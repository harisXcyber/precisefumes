import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { createAdminClient, adminConfigured } from "@/lib/supabase/admin";

type Ctx = { params: Promise<{ id: string }> };

/** Mark all payable commissions for an affiliate as paid. */
export async function PATCH(request: NextRequest, ctx: Ctx) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!adminConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const { id } = await ctx.params;
  const body = await request.json();
  const supabase = createAdminClient();

  if (body.action === "markPaid") {
    const { error } = await supabase
      .from("affiliate_orders")
      .update({ status: "paid" })
      .eq("affiliate_id", id)
      .in("status", ["pending", "payable"]);
    if (error) {
      return NextResponse.json({ error: "Could not update." }, { status: 400 });
    }
    return NextResponse.json({ ok: true });
  }

  if (body.action === "setStatus" && body.status) {
    const { error } = await supabase
      .from("affiliates")
      .update({ status: body.status })
      .eq("id", id);
    if (error) {
      return NextResponse.json({ error: "Could not update." }, { status: 400 });
    }
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
