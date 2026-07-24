import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { adminConfigured, createAdminClient } from "@/lib/supabase/admin";
import { hashPassword } from "@/lib/password";
import { sendEmail, affiliateVerifyEmail } from "@/lib/email";
import { normalizePkMobile } from "@/lib/contact";

function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/** Clean the word the affiliate chose: uppercase A–Z0–9, 2–12 chars. */
export function sanitizeCodeWord(raw: string): string {
  return String(raw ?? "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 12);
}

/** Bonus code = chosen word + two random digits, e.g. HARIS47 */
function buildReferralCode(word: string): string {
  return `${word}${String(crypto.randomInt(0, 100)).padStart(2, "0")}`;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      email,
      name,
      password,
      codeWord,
      bankMethod,
      bankPhone,
      bankAccountName,
    } = body;

    if (
      !email ||
      !name ||
      !password ||
      !codeWord ||
      !bankMethod ||
      !bankPhone ||
      !bankAccountName
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    const word = sanitizeCodeWord(codeWord);
    if (word.length < 2) {
      return NextResponse.json(
        {
          error:
            "Choose a bonus-code word of at least 2 letters/numbers (e.g. your name).",
        },
        { status: 400 }
      );
    }
    if (String(password).length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }
    // A valid Pakistani mobile is required — it's where the commission
    // is paid, so blank/junk numbers are rejected.
    const normalizedPhone = normalizePkMobile(bankPhone);
    if (!normalizedPhone) {
      return NextResponse.json(
        {
          error:
            "Enter a valid Pakistani mobile number for payouts (e.g. 03001234567).",
        },
        { status: 400 }
      );
    }
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const token = generateToken();
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://precisefumes.com";
    const verifyUrl = `${baseUrl}/affiliate/verify?token=${token}`;

    if (!adminConfigured()) {
      // Database not connected yet — flow still completes via direct link.
      console.log("Affiliate signup (no DB):", { email, name });
      return NextResponse.json(
        { message: "Signup received.", verifyUrl },
        { status: 200 }
      );
    }

    const supabase = createAdminClient();

    const { data: existing } = await supabase
      .from("affiliates")
      .select("id, status")
      .eq("email", email.toLowerCase())
      .maybeSingle();

    if (existing && existing.status === "active") {
      return NextResponse.json(
        { error: "This email is already registered. Sign in to your dashboard instead." },
        { status: 409 }
      );
    }

    // Bonus code = PRECISE + chosen word + a random digit; retry the
    // digit until it's unique.
    let referralCode = buildReferralCode(word);
    for (let i = 0; i < 12; i++) {
      const { data: clash } = await supabase
        .from("affiliates")
        .select("id")
        .eq("referral_code", referralCode)
        .maybeSingle();
      if (!clash) break;
      referralCode = buildReferralCode(word);
    }

    const row = {
      email: email.toLowerCase(),
      name,
      password_hash: hashPassword(String(password)),
      bank_method: bankMethod,
      bank_phone: normalizedPhone,
      bank_account_name: bankAccountName,
      referral_code: referralCode,
      verification_token: token,
      status: "pending_verification",
    };

    const { error } = existing
      ? await supabase.from("affiliates").update(row).eq("id", existing.id)
      : await supabase.from("affiliates").insert(row);

    if (error) {
      console.error("Affiliate signup insert failed:", error.message);
      return NextResponse.json(
        { error: "Could not create your account. Please try again." },
        { status: 500 }
      );
    }

    const emailResult = await sendEmail({
      to: email,
      subject: "Verify your email — Precise Fumes Affiliates",
      html: affiliateVerifyEmail(name, verifyUrl),
    });

    // If mail isn't configured yet, hand back the link so the flow
    // still completes end-to-end.
    return NextResponse.json(
      {
        message: emailResult.sent
          ? "Verification email sent."
          : "Signup received.",
        ...(emailResult.sent ? {} : { verifyUrl }),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Affiliate signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
