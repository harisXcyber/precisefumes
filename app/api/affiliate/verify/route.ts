import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 400 }
      );
    }

    // TODO: Query Supabase affiliates table
    // - Find row where verification_token = token
    // - Check that verified_at is null and status = 'pending_verification'
    // - Update: set verified_at = now(), status = 'active'
    // - Return: { referralCode, email }

    // For MVP, mock response
    console.log("Affiliate verification:", {
      token,
      verifiedAt: new Date().toISOString(),
    });

    // Mock: extract email from token (in real implementation, query DB)
    // This is a placeholder — in production, fetch from Supabase
    const mockEmail = "affiliate@example.com";
    const mockReferralCode = "ROGUE42";

    return NextResponse.json(
      {
        message: "Email verified successfully",
        email: mockEmail,
        referralCode: mockReferralCode,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Affiliate verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
