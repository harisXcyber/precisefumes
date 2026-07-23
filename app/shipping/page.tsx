import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping Policy",
  robots: { index: false },
};

export default function Shipping() {
  return (
    <div className="min-h-screen bg-bg text-fg">
      <div className="container-lux pt-36 pb-20 max-w-3xl">
        <h1 className="font-serif text-5xl font-normal mb-12">
          Shipping Policy
        </h1>

        <div className="prose prose-invert max-w-none space-y-8 text-base leading-relaxed">
          <section>
            <h2 className="font-serif text-2xl font-normal mb-4">
              Delivery Coverage
            </h2>
            <p className="text-fg-soft">
              Precise Fumes offers shipping throughout Pakistan. All shipments
              are carefully packaged to ensure your fragrances arrive in perfect
              condition.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-normal mb-4">
              Shipping Options
            </h2>

            <div className="space-y-6 mt-4">
              <div className="border-l-2 border-accent pl-6">
                <h3 className="font-serif text-xl font-normal mb-2">
                  Karachi (Free Shipping)
                </h3>
                <p className="text-fg-soft">
                  <strong>Delivery Time:</strong> 2–5 working days
                </p>
                <p className="text-fg-soft">
                  <strong>Cost:</strong> Free for all orders
                </p>
                <p className="text-fg-soft mt-2">
                  Orders placed in Karachi are processed and dispatched from our
                  local facility, ensuring swift delivery.
                </p>
              </div>

              <div className="border-l-2 border-accent pl-6">
                <h3 className="font-serif text-xl font-normal mb-2">
                  Nationwide (Paid Shipping)
                </h3>
                <p className="text-fg-soft">
                  <strong>Delivery Time:</strong> 5–7 working days
                </p>
                <p className="text-fg-soft">
                  <strong>Cost:</strong> PKR 300 per order
                </p>
                <p className="text-fg-soft mt-2">
                  Available to all cities across Pakistan. Tracking information
                  will be provided upon dispatch.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-normal mb-4">
              Processing Time
            </h2>
            <p className="text-fg-soft">
              Orders are typically processed within 1–2 business days. During
              peak seasons, processing may take up to 3 business days. You will
              receive a shipping notification with tracking details via email
              once your order is dispatched.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-normal mb-4">
              Tracking Your Order
            </h2>
            <p className="text-fg-soft">
              Once your order is shipped, you'll receive an email with a
              tracking link. You can use this to monitor your delivery status
              and estimated arrival date.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-normal mb-4">
              Packaging
            </h2>
            <p className="text-fg-soft">
              All Precise Fumes fragrances are packaged with care in
              protective materials to ensure they arrive safely. Our elegant
              packaging is also designed to make opening your order a luxurious
              experience.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-normal mb-4">
              Damaged or Lost Shipments
            </h2>
            <p className="text-fg-soft">
              In the rare event that your order arrives damaged or is lost in
              transit, please contact us immediately at{" "}
              <a href="mailto:contact@precisefumes.com" className="link-underline">
                contact@precisefumes.com
              </a>{" "}
              with photos of the damage or shipment details. We will work to
              resolve the issue within 7 business days.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-normal mb-4">
              Holidays and Special Closures
            </h2>
            <p className="text-fg-soft">
              Orders placed during public holidays or special closures will be
              processed the next business day. We'll notify you of any delays in
              your order confirmation email.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-normal mb-4">
              International Shipping
            </h2>
            <p className="text-fg-soft">
              Currently, we only offer shipping within Pakistan. International
              shipping may be available in the future. Please contact us for
              inquiries.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-normal mb-4">
              Contact Us
            </h2>
            <p className="text-fg-soft">
              For any questions about shipping, please reach out to us at{" "}
              <a href="mailto:contact@precisefumes.com" className="link-underline">
                contact@precisefumes.com
              </a>
              .
            </p>
          </section>

          <p className="text-xs text-fg-faint pt-8">
            Last updated: July 2026
          </p>
        </div>
      </div>
    </div>
  );
}
