import { NextRequest, NextResponse } from "next/server";
import { checkOtp } from "@/lib/otp";

export async function POST(request: NextRequest) {
  const { email, code, purpose } = await request.json().catch(() => ({}));
  if (!email || !code) {
    return NextResponse.json({ error: "Email and code required." }, { status: 400 });
  }
  const ok = await checkOtp(
    String(email),
    String(code),
    purpose === "affiliate" ? "affiliate" : "checkout"
  );
  return NextResponse.json({ verified: ok });
}
