import { NextRequest, NextResponse } from "next/server";
import { adminConfigured, createAdminClient } from "@/lib/supabase/admin";
import { sendEmail, orderConfirmationEmail } from "@/lib/email";

function generateOrderRef(): string {
  const ts = Date.now().toString(36).toUpperCase().slice(-5);
  const rand = Math.random().toString(36).toUpperCase().slice(2, 5);
  return `PF-${ts}${rand}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customer,
      shipping,
      promo,
      affiliate,
      items,
      subtotal,
      discount,
      total,
    } = body;

    if (
      !customer?.name ||
      !customer?.email ||
      !customer?.phone ||
      !customer?.address ||
      !customer?.city
    ) {
      return NextResponse.json(
        { error: "Missing customer information" },
        { status: 400 }
      );
    }
    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const ref = generateOrderRef();

    if (adminConfigured()) {
      const supabase = createAdminClient();

      // If an affiliate code was used, resolve it to a real, active
      // affiliate — commission only counts for registered codes.
      let affiliateRow: { id: string; referral_code: string } | null = null;
      if (affiliate?.code) {
        const { data } = await supabase
          .from("affiliates")
          .select("id, referral_code")
          .eq("referral_code", String(affiliate.code).toUpperCase())
          .eq("status", "active")
          .maybeSingle();
        affiliateRow = data ?? null;
      }

      const { data: order, error } = await supabase
        .from("orders")
        .insert({
          ref,
          customer_name: customer.name,
          customer_email: customer.email,
          customer_phone: customer.phone,
          address: customer.address,
          city: customer.city,
          shipping_zone: shipping?.zone ?? "nationwide",
          shipping_fee: shipping?.fee ?? 0,
          payment_method: "cod",
          payment_status: "pending",
          items,
          subtotal,
          discount: discount ?? 0,
          promo_type: promo?.type ?? null,
          affiliate_code: affiliateRow?.referral_code ?? null,
          affiliate_commission: affiliateRow ? 300 : 0,
        })
        .select("id")
        .single();

      if (error || !order) {
        console.error("Order insert failed:", error?.message);
        return NextResponse.json(
          { error: "Could not save your order. Please try again." },
          { status: 500 }
        );
      }

      if (affiliateRow) {
        await supabase.from("affiliate_orders").insert({
          affiliate_id: affiliateRow.id,
          order_id: order.id,
          order_ref: ref,
          commission: 300,
        });
      }
    } else {
      console.log("Order (Supabase not configured):", { ref, customer, total });
    }

    // Confirmation email — best-effort, never blocks the order.
    await sendEmail({
      to: customer.email,
      subject: `Order ${ref} confirmed — Precise Fumes`,
      html: orderConfirmationEmail({
        ref,
        name: customer.name,
        city: customer.city,
        items,
        subtotal,
        discount: discount ?? 0,
        shippingFee: shipping?.fee ?? 0,
        total,
      }),
    }).catch(() => ({ sent: false }));

    return NextResponse.json({ orderId: ref }, { status: 200 });
  } catch (error) {
    console.error("Orders API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
