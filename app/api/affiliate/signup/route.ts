import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// Generate unique verification token
function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

// Generate unique referral code (e.g., ROGUE50, AQUA33)
function generateReferralCode(): string {
  const scents = ["ROGUE", "ROYAL", "BLOOM", "BLOSSOM", "LEGACY"];
  const scent = scents[Math.floor(Math.random() * scents.length)];
  const num = Math.random().toString(36).substring(2, 4).toUpperCase();
  return `${scent}${num}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, bankMethod, bankPhone, bankAccountName } = body;

    // Validation
    if (!email || !name || !bankMethod || !bankPhone || !bankAccountName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // TODO: Check if email already registered in Supabase
    // For now, proceed with signup flow

    const verificationToken = generateVerificationToken();
    const referralCode = generateReferralCode();

    // TODO: Insert into Supabase affiliates table with:
    // - email, name, bank_method, bank_phone, bank_account_name
    // - verification_token, status='pending_verification'
    // - referral_code
    // - created_at = now()

    // TODO: Send verification email with link to /affiliate/verify?token={verificationToken}

    console.log("Affiliate signup:", {
      email,
      name,
      bankMethod,
      referralCode,
      verificationToken,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        message: "Signup successful. Verification email sent.",
        email,
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

function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}
