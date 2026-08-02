import { NextRequest, NextResponse } from "next/server";
import { adminConfigured, createAdminClient } from "@/lib/supabase/admin";
import { consumeOtp } from "@/lib/otp";

/** Verify an affiliate's email with the 6-digit code — activates their
 *  promo code. Knowing the emailed code proves ownership of the inbox. */
export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();
    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and code are required." },
        { status: 400 }
      );
    }
    if (!adminConfigured()) {
      return NextResponse.json(
        { error: "Verification is being set up — try again shortly." },
        { status: 503 }
      );
    }

    const ok = await consumeOtp(String(email), String(code), "affiliate-verify");
    if (!ok) {
      return NextResponse.json(
        { error: "That code is wrong or expired. Tap resend for a fresh one." },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("affiliates")
      .update({ status: "active", verified_at: new Date().toISOString() })
      .eq("email", String(email).toLowerCase())
      .eq("status", "pending_verification")
      .select("referral_code")
      .maybeSingle();

    if (error || !data) {
      return NextResponse.json(
        { error: "Could not activate your account. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, code: data.referral_code });
  } catch (error) {
    console.error("Affiliate verify-otp error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
