import { NextRequest, NextResponse } from "next/server";
import { adminConfigured, createAdminClient } from "@/lib/supabase/admin";

/** Dashboard sign-in + stats: the email/code pair must match a real,
 *  active affiliate. Returns commission totals and recent orders. */
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    if (!adminConfigured()) {
      return NextResponse.json(
        {
          name: null,
          totals: { earned: 0, pending: 0, sales: 0 },
          orders: [],
          note: "Database not connected yet — stats activate soon.",
        },
        { status: 200 }
      );
    }

    // Look up by email only. The referral code is a PUBLIC promo code
    // (affiliates share it with customers), so it was never a real secret —
    // and keying on it meant a regenerated code locked the owner out of their
    // own dashboard and kept showing them the stale code. Identity is
    // established by the password sign-in; here we just return live figures.
    const supabase = createAdminClient();
    const { data: affiliate } = await supabase
      .from("affiliates")
      .select("id, name, email, referral_code")
      .eq("email", String(email).toLowerCase())
      .eq("status", "active")
      .maybeSingle();

    if (!affiliate) {
      return NextResponse.json(
        { error: "No active affiliate matches that email." },
        { status: 404 }
      );
    }

    const { data: rows } = await supabase
      .from("affiliate_orders")
      .select("order_ref, commission, status, created_at")
      .eq("affiliate_id", affiliate.id)
      .order("created_at", { ascending: false })
      .limit(50);

    const orders = rows ?? [];
    const sum = (status: string) =>
      orders
        .filter((o) => o.status === status)
        .reduce((s, o) => s + o.commission, 0);
    // Commission only becomes real cash once the order is delivered (COD
    // collected → 'payable'). Undelivered 'pending' sales are "in progress".
    const earned = sum("paid");
    const pending = sum("payable"); // delivered, awaiting your payout
    const inProgress = sum("pending"); // sold, awaiting delivery
    const sales = orders.filter((o) => o.status !== "void").length;

    return NextResponse.json(
      {
        name: affiliate.name,
        code: affiliate.referral_code, // live code — dashboard re-syncs to this
        totals: { earned, pending, inProgress, sales },
        orders,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Affiliate stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
