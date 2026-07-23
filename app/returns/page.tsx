import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Returns & Refunds",
  robots: { index: false },
};

export default function Returns() {
  return (
    <div className="min-h-screen bg-bg text-fg">
      <div className="container-lux pt-36 pb-20 max-w-3xl">
        <h1 className="font-serif text-5xl font-normal mb-12">
          Returns & Refunds Policy
        </h1>

        <div className="prose prose-invert max-w-none space-y-8 text-base leading-relaxed">
          <section>
            <h2 className="font-serif text-2xl font-normal mb-4">
              Return Eligibility
            </h2>
            <p className="text-fg-soft">
              At Precise Fumes, we stand behind the quality of our fragrances.
              If you're not completely satisfied with your purchase, we're happy
              to help. Here's what you need to know about returns.
            </p>

            <div className="bg-bg-soft p-6 rounded-[var(--radius)] mt-4 space-y-3 text-fg-soft">
              <p>
                <strong>Return Window:</strong> 14 days from the date of delivery
              </p>
              <p>
                <strong>Condition Required:</strong> Products must be unopened
                and in original packaging
              </p>
              <p>
                <strong>Eligibility:</strong> Returns are accepted for defective,
                damaged, or incorrect items
              </p>
              <p>
                <strong>Note:</strong> Opened or used fragrances cannot be
                returned for hygiene reasons
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-normal mb-4">
              How to Initiate a Return
            </h2>
            <p className="text-fg-soft">
              To start a return, please follow these steps:
            </p>
            <ol className="list-decimal list-inside text-fg-soft space-y-2 mt-4">
              <li>
                Contact us at{" "}
                <a href="mailto:contact@precisefumes.com" className="link-underline">
                  contact@precisefumes.com
                </a>{" "}
                within 14 days of delivery
              </li>
              <li>
                Include your order reference number and reason for the return
              </li>
              <li>
                Provide photos of the product and packaging (if damaged)
              </li>
              <li>Wait for return authorization and shipping instructions</li>
            </ol>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-normal mb-4">
              Shipping the Return
            </h2>
            <p className="text-fg-soft">
              Once your return is authorized, you'll receive return shipping
              instructions. Please note:
            </p>
            <ul className="list-disc list-inside text-fg-soft space-y-2 mt-4">
              <li>
                Return shipping costs are the responsibility of the customer
                (unless the item is defective or damaged)
              </li>
              <li>
                Please package items securely to prevent further damage during
                transit
              </li>
              <li>
                Keep your tracking number for reference until the return is
                processed
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-normal mb-4">
              Refunds
            </h2>
            <p className="text-fg-soft">
              <strong>Refund Timeline:</strong> Refunds are processed within
              7–10 business days of receiving your return at our facility.
            </p>
            <p className="text-fg-soft mt-4">
              <strong>Refund Amount:</strong> You will receive a refund of the
              product price. Original shipping charges are non-refundable unless
              the return is due to our error or a defective product.
            </p>
            <p className="text-fg-soft mt-4">
              <strong>Payment Method:</strong> Refunds will be credited to the
              original payment method. For bank transfers, please allow 3–5
              business days for the funds to appear in your account.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-normal mb-4">
              Damaged or Defective Items
            </h2>
            <p className="text-fg-soft">
              If you receive a damaged or defective product, we will arrange a
              full refund or replacement at no additional cost to you. Please
              contact us within 3 days of delivery with photos of the damage.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-normal mb-4">
              Non-Returnable Items
            </h2>
            <p className="text-fg-soft">
              The following items cannot be returned:
            </p>
            <ul className="list-disc list-inside text-fg-soft space-y-2 mt-4">
              <li>Opened or used fragrances</li>
              <li>Items without original packaging</li>
              <li>Items purchased more than 14 days ago</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-normal mb-4">
              Exchanges
            </h2>
            <p className="text-fg-soft">
              We don't offer direct exchanges. Instead, please return the item
              for a refund and place a new order for the desired product. If you
              have any questions, our team can assist you.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-normal mb-4">
              Contact Us
            </h2>
            <p className="text-fg-soft">
              For any questions about returns or refunds, please contact:
            </p>
            <p className="text-fg-soft mt-4">
              <a href="mailto:contact@precisefumes.com" className="link-underline">
                contact@precisefumes.com
              </a>
            </p>
            <p className="text-fg-soft mt-2">
              <strong>Hours:</strong> Monday – Saturday, 10:00 – 19:00 PKT
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
