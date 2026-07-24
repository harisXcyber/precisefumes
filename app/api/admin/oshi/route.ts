import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { createAdminClient, adminConfigured } from "@/lib/supabase/admin";
import {
  bookShipment,
  trackShipment,
  cancelShipment,
  oshiConfigured,
  courierLabel,
} from "@/lib/oshi";
import type { AdminOrder } from "@/lib/admin-data";

/** Book / track / cancel an Oshi shipment for one order. */
export async function POST(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!adminConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }
  if (!oshiConfigured()) {
    return NextResponse.json({ error: "Oshi is not configured." }, { status: 503 });
  }

  const { orderId, action, courier } = await request.json();
  if (!orderId || !action) {
    return NextResponse.json({ error: "Missing orderId or action" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .maybeSingle();
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  const o = order as AdminOrder;

  // ── Book ────────────────────────────────────────────────
  if (action === "book") {
    if (o.oshi_tracking) {
      return NextResponse.json(
        { error: "Already booked with Oshi.", tracking: o.oshi_tracking },
        { status: 409 }
      );
    }
    const courierId = String(courier || "1");
    const codAmount = o.subtotal - o.discount + o.shipping_fee;
    const itemsSummary =
      o.items.map((it) => `${it.name} ×${it.quantity}`).join(", ") || "Perfume";
    const qty = o.items.reduce((s, it) => s + it.quantity, 0) || 1;

    const result = await bookShipment({
      ref: o.ref,
      name: o.customer_name,
      email: o.customer_email,
      mobile: o.customer_phone,
      city: o.city,
      address: o.address,
      itemsSummary,
      qty,
      codAmount,
      courier: courierId,
    });
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    await supabase
      .from("orders")
      .update({
        oshi_id: result.oshiId,
        oshi_tracking: result.tracking,
        oshi_courier: courierId,
        oshi_status: "Shipment Booked",
        oshi_booked_at: new Date().toISOString(),
        // Booking a shipment moves the order to "shipped".
        status: "shipped",
      })
      .eq("id", orderId);

    return NextResponse.json({
      ok: true,
      tracking: result.tracking,
      service: result.service ?? courierLabel(courierId),
      status: "Shipment Booked",
    });
  }

  // ── Track ───────────────────────────────────────────────
  if (action === "track") {
    if (!o.oshi_id || !o.oshi_tracking) {
      return NextResponse.json({ error: "Not booked yet." }, { status: 400 });
    }
    const result = await trackShipment(o.oshi_id, o.oshi_tracking);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    if (result.latest && result.latest !== o.oshi_status) {
      await supabase
        .from("orders")
        .update({ oshi_status: result.latest })
        .eq("id", orderId);
    }
    return NextResponse.json({
      ok: true,
      latest: result.latest,
      events: result.events,
    });
  }

  // ── Cancel ──────────────────────────────────────────────
  if (action === "cancel") {
    if (!o.oshi_id) {
      return NextResponse.json({ error: "Not booked." }, { status: 400 });
    }
    const result = await cancelShipment(o.oshi_id);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    await supabase
      .from("orders")
      .update({
        oshi_id: null,
        oshi_tracking: null,
        oshi_courier: null,
        oshi_status: null,
        oshi_booked_at: null,
        status: "confirmed",
      })
      .eq("id", orderId);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
