import { NextRequest, NextResponse } from "next/server";
import { adminConfigured, createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token || typeof token !== "string") {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    if (!adminConfigured()) {
      // No database yet — accept the link so the flow demos end-to-end.
      return NextResponse.json(
        {
          message: "Email verified",
          email: "pending-database@precisefumes.com",
          referralCode: "ROGUE42",
        },
        { status: 200 }
      );
    }

    const supabase = createAdminClient();
    const { data: affiliate } = await supabase
      .from("affiliates")
      .select("id, email, referral_code, status")
      .eq("verification_token", token)
      .maybeSingle();

    if (!affiliate) {
      return NextResponse.json(
        { error: "Link expired or already used" },
        { status: 404 }
      );
    }

    if (affiliate.status !== "active") {
      await supabase
        .from("affiliates")
        .update({
          status: "active",
          verified_at: new Date().toISOString(),
          verification_token: null,
        })
        .eq("id", affiliate.id);
    }

    return NextResponse.json(
      {
        message: "Email verified",
        email: affiliate.email,
        referralCode: affiliate.referral_code,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Affiliate verify error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
