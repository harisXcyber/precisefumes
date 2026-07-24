import { NextRequest, NextResponse } from "next/server";
import { checkPassword, issueToken, FINANCE_COOKIE } from "@/lib/finance-auth";

export async function POST(request: NextRequest) {
  const { password } = await request.json().catch(() => ({ password: "" }));
  if (!process.env.FINANCE_PASSWORD) {
    return NextResponse.json(
      { error: "Finance access isn't configured on the server yet." },
      { status: 503 }
    );
  }
  if (!password || !checkPassword(String(password))) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }
  const { value, maxAge } = issueToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(FINANCE_COOKIE, value, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge,
  });
  return res;
}
