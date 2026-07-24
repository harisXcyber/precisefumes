import { Metadata } from "next";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { adminConfigured, createAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "Order Confirmed",
  robots: { index: false },
};

interface OrderRow {
  ref: string;
  customer_name: string;
  city: string;
  shipping_fee: number;
  items: { name: string; size: string; quantity: number; price: number }[];
  subtotal: number;
  discount: number;
  created_at: string;
}

async function getOrder(ref: string): Promise<OrderRow | null> {
  if (!adminConfigured()) return null;
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("orders")
      .select(
        "ref, customer_name, city, shipping_fee, items, subtotal, discount, created_at"
      )
      .eq("ref", ref)
      .maybeSingle();
    return (data as OrderRow) ?? null;
  } catch {
    return null;
  }
}

export default async function OrderConfirmation({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: orderId } = await params;
  const order = await getOrder(orderId);
  const total = order
    ? order.subtotal - order.discount + order.shipping_fee
    : null;

  return (
    <div className="min-h-screen bg-bg text-fg flex items-center justify-center pb-16 pt-36">
      <div className="container-lux max-w-xl text-center">
        {/* Success Icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/20 text-accent-deep mb-6">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <h1 className="font-serif text-4xl font-normal mb-4">
          Order Confirmed
        </h1>
        <p className="text-lg text-fg-soft mb-8">
          {order
            ? `Thank you, ${order.customer_name}. Your order is being prepared.`
            : "Thank you for your purchase. Your order has been placed successfully."}
        </p>

        {/* Order Details */}
        <div className="bg-bg-soft p-8 rounded-[var(--radius-lg)] mb-8 text-left">
          <div className="mb-6 text-center">
            <p className="pf-eyebrow mb-2">Order Reference</p>
            <p className="font-serif text-2xl tracking-wider">{orderId}</p>
          </div>

          {order && (
            <div className="mb-6 border-y border-border py-5">
              <ul className="space-y-3 text-sm">
                {order.items.map((item, i) => (
                  <li key={i} className="flex justify-between gap-4">
                    <span>
                      {item.name} · {item.size} × {item.quantity}
                    </span>
                    <span className="tabular-nums">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 space-y-1.5 text-sm">
                <div className="flex justify-between text-fg-soft">
                  <span>Subtotal</span>
                  <span className="tabular-nums">
                    {formatPrice(order.subtotal)}
                  </span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-accent-deep">
                    <span>Savings</span>
                    <span className="tabular-nums">
                      −{formatPrice(order.discount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-fg-soft">
                  <span>Delivery ({order.city})</span>
                  <span>
                    {order.shipping_fee === 0
                      ? "Free"
                      : formatPrice(order.shipping_fee)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-border pt-3 font-serif text-lg">
                  <span>Total — Cash on Delivery</span>
                  <span className="tabular-nums">{formatPrice(total!)}</span>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-6 text-left">
            <div>
              <p className="pf-eyebrow mb-2">What's Next</p>
              <ul className="text-sm text-fg-soft space-y-2">
                <li>✓ A confirmation email is on its way to your inbox</li>
                <li>✓ We prepare and dispatch your parcel</li>
                <li>
                  ✓ Pay the rider in cash on delivery — please keep the exact
                  amount ready
                </li>
              </ul>
            </div>

            <div className="border-t border-border pt-5">
              <p className="pf-eyebrow mb-2">Delivery Timeline</p>
              <p className="text-sm text-fg-soft">
                <strong>Karachi:</strong> 2–5 working days (free)
                <br />
                <strong>Nationwide:</strong> 5–7 working days (PKR 300)
              </p>
            </div>

            <div className="border-t border-border pt-5">
              <p className="pf-eyebrow mb-2">Questions</p>
              <p className="text-sm text-fg-soft">
                WhatsApp us at{" "}
                <a
                  href={`https://wa.me/923172388450?text=${encodeURIComponent(
                    `Hi Precise Fumes, about my order ${orderId}:`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline font-medium text-[#1a8a4a]"
                >
                  0317 2388450
                </a>{" "}
                with your order reference — it&apos;s the fastest way to reach
                us.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/shop" className="btn-primary">
            Continue Shopping
          </Link>
          <Link href="/" className="btn-ghost">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
