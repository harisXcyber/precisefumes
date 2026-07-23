import { NextRequest, NextResponse } from "next/server";
import { adminConfigured, createAdminClient } from "@/lib/supabase/admin";

/** Dashboard sign-in + stats: the email/code pair must match a real,
 *  active affiliate. Returns commission totals and recent orders. */
export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and code are required" },
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

    const supabase = createAdminClient();
    const { data: affiliate } = await supabase
      .from("affiliates")
      .select("id, name, email, referral_code")
      .eq("email", String(email).toLowerCase())
      .eq("referral_code", String(code).toUpperCase())
      .eq("status", "active")
      .maybeSingle();

    if (!affiliate) {
      return NextResponse.json(
        { error: "No active affiliate matches that email and code." },
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
    const earned = orders
      .filter((o) => o.status === "paid")
      .reduce((s, o) => s + o.commission, 0);
    const pending = orders
      .filter((o) => o.status === "pending")
      .reduce((s, o) => s + o.commission, 0);

    return NextResponse.json(
      {
        name: affiliate.name,
        totals: { earned, pending, sales: orders.length },
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
