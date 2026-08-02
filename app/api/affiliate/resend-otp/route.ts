import { NextRequest, NextResponse } from "next/server";
import { adminConfigured, createAdminClient } from "@/lib/supabase/admin";
import { sendOtp } from "@/lib/otp";

/** Re-send the affiliate verification code (2-minute cooldown, enforced
 *  by the OTP layer). Only works for accounts still awaiting verification. */
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }
    if (!adminConfigured()) {
      return NextResponse.json(
        { error: "Verification is being set up — try again shortly." },
        { status: 503 }
      );
    }

    const supabase = createAdminClient();
    const { data: affiliate } = await supabase
      .from("affiliates")
      .select("id, status")
      .eq("email", String(email).toLowerCase())
      .maybeSingle();

    if (!affiliate || affiliate.status !== "pending_verification") {
      return NextResponse.json(
        { error: "This account doesn't need verification." },
        { status: 400 }
      );
    }

    const result = await sendOtp(String(email), "affiliate-verify");
    if (!result.ok) {
      return NextResponse.json(
        { error: result.error, cooldown: result.cooldown },
        { status: result.cooldown ? 429 : 500 }
      );
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Affiliate resend-otp error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
