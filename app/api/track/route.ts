import { NextRequest, NextResponse } from "next/server";
import { adminConfigured, createAdminClient } from "@/lib/supabase/admin";
import { trackShipment, courierLabel, oshiConfigured } from "@/lib/oshi";
import type { AdminOrder } from "@/lib/admin-data";

const last10 = (s: string) => (s || "").replace(/\D/g, "").slice(-10);

/**
 * Public order lookup. A customer must supply BOTH their order ref and the
 * phone or email on the order, so nobody can browse someone else's order.
 */
export async function POST(request: NextRequest) {
  if (!adminConfigured()) {
    return NextResponse.json(
      { error: "Order tracking is temporarily unavailable." },
      { status: 503 }
    );
  }
  const { ref, contact } = await request.json().catch(() => ({}));
  if (!ref || !contact) {
    return NextResponse.json(
      { error: "Enter your order number and the phone or email you used." },
      { status: 400 }
    );
  }

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("orders")
    .select("*")
    .ilike("ref", String(ref).trim())
    .maybeSingle();

  const order = data as AdminOrder | null;

  // Verify the contact matches — otherwise behave as "not found".
  const c = String(contact).trim().toLowerCase();
  const matches =
    order &&
    (order.customer_email?.toLowerCase() === c ||
      (last10(c) && last10(order.customer_phone) === last10(c)));

  if (!order || !matches) {
    return NextResponse.json(
      {
        error:
          "We couldn't find an order with those details. Check the order number and the phone/email you used at checkout.",
      },
      { status: 404 }
    );
  }

  // Live courier status, if the order has been booked.
  let trackingStatus: string | null = order.oshi_status ?? null;
  if (oshiConfigured() && order.oshi_id && order.oshi_tracking) {
    const live = await trackShipment(order.oshi_id, order.oshi_tracking);
    if (live.ok && live.latest) trackingStatus = live.latest;
  }

  const estimate =
    order.shipping_fee === 0
      ? "Free delivery — usually 2–5 days"
      : "Delivery in 5–7 days";

  return NextResponse.json({
    found: true,
    ref: order.ref,
    status: order.status,
    placedAt: order.created_at,
    items: order.items.map((it) => ({
      name: it.name,
      size: it.size,
      quantity: it.quantity,
    })),
    city: order.city,
    total: order.subtotal - order.discount + order.shipping_fee,
    courier: order.oshi_courier ? courierLabel(order.oshi_courier) : null,
    tracking: order.oshi_tracking ?? null,
    trackingStatus,
    estimate,
  });
}
