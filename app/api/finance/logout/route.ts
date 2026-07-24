import { NextResponse } from "next/server";
import { FINANCE_COOKIE } from "@/lib/finance-auth";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(FINANCE_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
