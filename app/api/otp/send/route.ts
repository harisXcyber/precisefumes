import { NextRequest, NextResponse } from "next/server";
import { sendOtp } from "@/lib/otp";

export async function POST(request: NextRequest) {
  const { email, purpose } = await request.json().catch(() => ({}));
  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }
  const r = await sendOtp(String(email), purpose === "affiliate" ? "affiliate" : "checkout");
  if (!r.ok) {
    return NextResponse.json(
      { error: r.error, cooldown: r.cooldown },
      { status: 429 }
    );
  }
  return NextResponse.json({ ok: true });
}
