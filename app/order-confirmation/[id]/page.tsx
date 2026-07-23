import { Metadata } from "next";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Order Confirmed",
  robots: { index: false },
};

export default async function OrderConfirmation({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // TODO: Fetch actual order data from Supabase when configured
  // For now, show a success message with the order reference
  const { id: orderId } = await params;

  return (
    <div className="min-h-screen bg-bg text-fg flex items-center justify-center pb-16 pt-36">
      <div className="container-lux max-w-xl text-center">
        {/* Success Icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/20 text-accent mb-6">
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

        <h1 className="font-serif text-4xl font-light mb-4">Order Confirmed</h1>
        <p className="text-lg text-fg-soft mb-8">
          Thank you for your purchase. Your order has been placed successfully.
        </p>

        {/* Order Details */}
        <div className="bg-bg-soft p-8 rounded-[var(--radius)] mb-8">
          <div className="mb-6">
            <p className="pf-eyebrow mb-2">Order Reference</p>
            <p className="font-serif text-2xl tracking-wider">{orderId}</p>
          </div>

          <div className="text-left space-y-6">
            <div>
              <p className="pf-eyebrow mb-2">What's Next</p>
              <ul className="text-sm text-fg-soft space-y-2">
                <li>✓ You'll receive an order confirmation email shortly</li>
                <li>
                  ✓ Your items will be prepared and shipped to the address
                  provided
                </li>
                <li>✓ Track your delivery via the link in your email</li>
              </ul>
            </div>

            <div className="border-t border-border pt-6">
              <p className="pf-eyebrow mb-2">Delivery Timeline</p>
              <p className="text-sm text-fg-soft">
                <strong>Karachi:</strong> 2–5 working days (Free shipping)
                <br />
                <strong>Nationwide:</strong> 5–7 working days (PKR 300)
              </p>
            </div>

            <div className="border-t border-border pt-6">
              <p className="pf-eyebrow mb-2">Questions</p>
              <p className="text-sm text-fg-soft">
                Contact us at{" "}
                <a
                  href="mailto:contact@precisefumes.com"
                  className="link-underline font-medium"
                >
                  contact@precisefumes.com
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/shop" className="btn-primary">
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-4 border border-fg/20 rounded-[var(--radius)] text-sm uppercase tracking-[0.18em] hover:bg-bg-soft transition-colors"
          >
            Back to Home
          </Link>
        </div>

        {/* Legal */}
        <p className="mt-12 text-xs text-fg-soft">
          A confirmation email has been sent to your inbox. If you don't see
          it, please check your spam folder.
        </p>
      </div>
    </div>
  );
}
