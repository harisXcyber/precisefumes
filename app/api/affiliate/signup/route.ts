import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { adminConfigured, createAdminClient } from "@/lib/supabase/admin";
import { hashPassword } from "@/lib/password";
import { sendEmail, affiliateVerifyEmail, emailConfigured } from "@/lib/email";

function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

function generateReferralCode(): string {
  const scents = ["ROGUE", "ROYAL", "BLOOM", "BLOSSOM", "LEGACY"];
  const scent = scents[Math.floor(Math.random() * scents.length)];
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const suffix =
    chars[Math.floor(Math.random() * chars.length)] +
    chars[Math.floor(Math.random() * chars.length)];
  return `${scent}${suffix}`;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, password, bankMethod, bankPhone, bankAccountName } =
      body;

    if (
      !email ||
      !name ||
      !password ||
      !bankMethod ||
      !bankPhone ||
      !bankAccountName
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    if (String(password).length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
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

    // Generate a referral code that isn't taken.
    let referralCode = generateReferralCode();
    for (let i = 0; i < 5; i++) {
      const { data: clash } = await supabase
        .from("affiliates")
        .select("id")
        .eq("referral_code", referralCode)
        .maybeSingle();
      if (!clash) break;
      referralCode = generateReferralCode();
    }

    const row = {
      email: email.toLowerCase(),
      name,
      password_hash: hashPassword(String(password)),
      bank_method: bankMethod,
      bank_phone: bankPhone,
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
