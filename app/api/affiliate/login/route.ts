import { NextRequest, NextResponse } from "next/server";
import { adminConfigured, createAdminClient } from "@/lib/supabase/admin";
import { verifyPassword } from "@/lib/password";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (!adminConfigured()) {
      return NextResponse.json(
        { error: "Sign-in is being set up — please try again shortly." },
        { status: 503 }
      );
    }

    const supabase = createAdminClient();
    const { data: affiliate } = await supabase
      .from("affiliates")
      .select("id, name, email, referral_code, password_hash, status")
      .eq("email", String(email).toLowerCase())
      .maybeSingle();

    if (!affiliate || !verifyPassword(password, affiliate.password_hash)) {
      return NextResponse.json(
        { error: "Incorrect email or password." },
        { status: 401 }
      );
    }

    // Unverified affiliates can sign in too — the dashboard shows a
    // big "verify your email" gate and lets them enter their code there.
    if (
      affiliate.status !== "active" &&
      affiliate.status !== "pending_verification"
    ) {
      return NextResponse.json(
        { error: "This account is not active." },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        name: affiliate.name,
        email: affiliate.email,
        code: affiliate.referral_code,
        status: affiliate.status,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Affiliate login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
