import { NextRequest, NextResponse } from "next/server";
import { adminConfigured, createAdminClient } from "@/lib/supabase/admin";
import {
  sendEmail,
  orderConfirmationEmail,
  affiliateSaleEmail,
} from "@/lib/email";
import { getActiveOffers } from "@/lib/offers";
import { getProducts } from "@/lib/products";
import {
  BASE_PRICE,
  TESTER_PRICE,
  priceOrder,
  type PricingFlags,
} from "@/lib/pricing";

function generateOrderRef(): string {
  const ts = Date.now().toString(36).toUpperCase().slice(-5);
  const rand = Math.random().toString(36).toUpperCase().slice(2, 5);
  return `PF-${ts}${rand}`;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customer, affiliate, items } = body;

    // Email is optional; phone is the contact we actually confirm on.
    if (
      !customer?.name ||
      !customer?.phone ||
      !customer?.address ||
      !customer?.city
    ) {
      return NextResponse.json(
        { error: "Missing customer information" },
        { status: 400 }
      );
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // ── Canonical pricing: never trust client-sent prices or totals. ──
    // Line prices come from the DB catalog (testers are fixed PKR 200),
    // discounts/shipping are recomputed from the live offers, and the
    // stored order carries the server's numbers.
    const [offers, products] = await Promise.all([
      getActiveOffers().catch(() => []),
      getProducts().catch(() => []),
    ]);
    const keys = new Set(offers.map((o) => o.offer_key));
    const flags: PricingFlags = {
      bundle2: keys.has("bundle2"),
      pack4: keys.has("pack4"),
      tester: keys.has("tester"),
      freedelivery: keys.has("freedelivery"),
    };
    const priceBySlug = new Map(products.map((p) => [p.slug, p.price]));

    const lines = (items as any[]).map((i) => ({
      ...i,
      quantity: Math.min(99, Math.max(1, Math.round(Number(i.quantity) || 1))),
      price:
        i.kind === "tester"
          ? TESTER_PRICE
          : (priceBySlug.get(String(i.slug)) ?? BASE_PRICE),
    }));

    const supabase = adminConfigured() ? createAdminClient() : null;

    // A promo code only counts if it maps to a real, active code row —
    // whether from affiliate signup or created directly by the admin.
    let affiliateRow: {
      id: string;
      referral_code: string;
      commission: number;
      email: string;
      name: string;
      source: string;
    } | null = null;
    if (supabase && affiliate?.code) {
      const { data } = await supabase
        .from("affiliates")
        .select("id, referral_code, commission, email, name, source")
        .eq("referral_code", String(affiliate.code).toUpperCase())
        .eq("status", "active")
        .maybeSingle();
      affiliateRow = data ?? null;
    }

    const pricing = priceOrder(lines, flags, {
      affiliateApplied: !!affiliateRow,
      city: String(customer.city),
    });

    // Observability: a mismatch means an outdated client or a tampered
    // payload — the server's numbers win either way.
    if (body.total !== undefined && Number(body.total) !== pricing.total) {
      console.warn(
        `Order total mismatch (client ${body.total} vs server ${pricing.total}) — using server pricing.`
      );
    }

    const ref = generateOrderRef();
    const creditAffiliate = affiliateRow && pricing.affiliateWins;

    if (supabase) {
      const { data: order, error } = await supabase
        .from("orders")
        .insert({
          ref,
          customer_name: customer.name,
          customer_email: customer.email || null,
          customer_phone: customer.phone,
          address: customer.address,
          city: customer.city,
          shipping_zone:
            customer.city === "Karachi" ? "karachi" : "nationwide",
          shipping_fee: pricing.shippingFee,
          payment_method: "cod",
          payment_status: "pending",
          items: lines,
          subtotal: pricing.subtotal,
          discount: pricing.discount,
          promo_type: creditAffiliate ? null : pricing.promo.type,
          affiliate_code: creditAffiliate ? affiliateRow!.referral_code : null,
          affiliate_commission: creditAffiliate ? affiliateRow!.commission : 0,
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

      if (creditAffiliate) {
        // Commission is per-code: 300 for signup affiliates, whatever the
        // admin chose for direct codes (0 = discount-only, still tracked
        // so the sales count per code stays visible).
        await supabase.from("affiliate_orders").insert({
          affiliate_id: affiliateRow!.id,
          order_id: order.id,
          order_ref: ref,
          commission: affiliateRow!.commission,
        });

        // Tell the code owner their code just made a sale — best-effort,
        // and never to the synthetic addresses behind admin-created codes.
        const ownerEmail = affiliateRow!.email;
        if (ownerEmail && !ownerEmail.endsWith("@admin.precisefumes.com")) {
          sendEmail({
            to: ownerEmail,
            subject: `Your code ${affiliateRow!.referral_code} was just used in an order 🎉`,
            html: affiliateSaleEmail({
              name: affiliateRow!.name,
              code: affiliateRow!.referral_code,
              orderRef: ref,
              commission: affiliateRow!.commission,
              hasDashboard: affiliateRow!.source !== "admin",
            }),
          }).catch(() => ({ sent: false }));
        }
      }
    } else {
      console.log("Order (Supabase not configured):", { ref, customer });
    }

    // Confirmation email — best-effort, only if they gave an email.
    if (customer.email) {
      await sendEmail({
        to: customer.email,
        subject: `Order ${ref} confirmed — Precise Fumes`,
        html: orderConfirmationEmail({
          ref,
          name: customer.name,
          city: customer.city,
          items: lines,
          subtotal: pricing.subtotal,
          discount: pricing.discount,
          shippingFee: pricing.shippingFee,
          total: pricing.total,
        }),
      }).catch(() => ({ sent: false }));
    }

    return NextResponse.json({ orderId: ref }, { status: 200 });
  } catch (error) {
    console.error("Orders API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
