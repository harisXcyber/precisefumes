import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { createAdminClient, adminConfigured } from "@/lib/supabase/admin";

type Ctx = { params: Promise<{ id: string }> };

const STATUSES = ["new", "confirmed", "shipped", "delivered", "cancelled"];

/** Update order fulfilment status / payment / note. */
export async function PATCH(request: NextRequest, ctx: Ctx) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!adminConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const { id } = await ctx.params;
  const body = await request.json();
  const patch: Record<string, unknown> = {};

  if (body.status !== undefined) {
    if (!STATUSES.includes(body.status)) {
      return NextResponse.json({ error: "Unknown status" }, { status: 400 });
    }
    patch.status = body.status;
  }
  if (body.paymentStatus !== undefined) patch.payment_status = body.paymentStatus;
  if (body.trackingNote !== undefined) patch.tracking_note = body.trackingNote;
  if (body.confirmationSent !== undefined) {
    patch.confirmation_sent = !!body.confirmationSent;
    patch.confirmation_sent_at = body.confirmationSent
      ? new Date().toISOString()
      : null;
    // Sending the confirmation moves a brand-new order to "confirmed".
    if (body.confirmationSent) patch.status = "confirmed";
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("orders").update(patch).eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Could not update." }, { status: 400 });
  }

  // Marking an order delivered releases its affiliate commission for payout.
  if (body.status === "delivered") {
    await supabase
      .from("affiliate_orders")
      .update({ status: "payable" })
      .eq("order_id", id)
      .eq("status", "pending");
  }

  return NextResponse.json({ ok: true });
}
