import { Metadata } from "next";
import Link from "next/link";
import { faqLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Perfume FAQ — Delivery, Prices & Offers in Pakistan",
  description:
    "How much perfumes cost, how buy 3 get 1 free and the 2-for-PKR-5,000 bundle work, free delivery in Karachi, cash on delivery, free 5ml testers, and our money-back guarantee — answered clearly.",
  alternates: { canonical: "/faq" },
};

const FAQS: { q: string; a: React.ReactNode; plain?: string }[] = [
  {
    q: "How much do the perfumes cost?",
    a: "Every Precise Fumes fragrance is an Extrait de Parfum in a 50ml bottle for PKR 3,000. Five scents are in stock now — and a special edition perfume is currently in the making.",
    plain:
      "Every Precise Fumes fragrance is an Extrait de Parfum in a 50ml bottle for PKR 3,000. Five scents are in stock now, and a special edition perfume is currently in the making.",
  },
  {
    q: "How does the 2-for-PKR-5,000 bundle work?",
    a: "Add any two standard (PKR 3,000) perfumes to your cart — any scents, mix and match — and the total automatically drops to PKR 5,000. You save PKR 1,000. No code needed; it applies by itself at checkout.",
    plain:
      "Add any two standard PKR 3,000 perfumes to your cart, any scents, and the total automatically drops to PKR 5,000. You save PKR 1,000. No code needed; it applies by itself at checkout.",
  },
  {
    q: "How does Buy 3 Get 1 Free work?",
    a: "Buy 3 Get 1 Free: add four perfumes to your cart and the price drops to just PKR 8,000 instead of PKR 9,000 — that's four premium perfumes plus four free 5ml testers. Applied automatically, no code needed.",
    plain:
      "Buy 3 Get 1 Free: add four perfumes to your cart and the price drops to just PKR 8,000 instead of PKR 9,000 — four premium perfumes plus four free 5ml testers. Applied automatically, no code needed.",
  },
  {
    q: "What is a bonus code and how do I use one?",
    a: (
      <>
        Bonus codes come from our affiliates. Enter one at checkout and single
        perfumes drop from PKR 3,000 to PKR 2,500 each. Bonus codes apply to
        single perfumes only — they don't combine with the bundle or
        Buy&nbsp;2&nbsp;Get&nbsp;1&nbsp;Free offers. If both could apply, we
        automatically give you whichever saves you more.
      </>
    ),
    plain:
      "Bonus codes come from our affiliates. Enter one at checkout and single perfumes drop from PKR 3,000 to PKR 2,500 each. Bonus codes apply to single perfumes only and don't combine with the bundle or Buy 3 Get 1 Free offers. If both could apply, we automatically give you whichever saves you more.",
  },
  {
    q: "How do I become an affiliate and earn?",
    a: (
      <>
        Sign up on the{" "}
        <Link href="/affiliate/signup" className="link-underline text-fg">
          affiliate page
        </Link>
        , verify your email, and you'll get your own bonus code. You earn PKR
        300 for every sale made with your code, paid to your EasyPaisa or
        JazzCash account.
      </>
    ),
    plain:
      "Sign up on the affiliate page, verify your email, and you'll get your own bonus code. You earn PKR 300 for every sale made with your code, paid to your EasyPaisa or JazzCash account.",
  },
  {
    q: "What are the free 5ml testers?",
    a: "Every perfume you buy comes with one free 5ml tester of a different scent — so if you order Blossom, you can pick a free tester of Rogue, Royal Oud, Bloom or Legacy. Want more? Extra testers are PKR 200 each, and those can be any scent, including the one you bought. Add them from any product page.",
  },
  {
    q: "How long does delivery take and what does it cost?",
    a: "Karachi: free delivery, 2–5 working days. Everywhere else in Pakistan: PKR 300, 5–7 working days. You'll get a confirmation as soon as your order ships.",
  },
  {
    q: "How can I pay?",
    a: "Cash on Delivery, anywhere in Pakistan — pay the rider in cash when your parcel arrives. No advance payment is needed. Online payment options are coming soon.",
  },
  {
    q: "What if my perfume arrives damaged or wrong?",
    a: (
      <>
        We offer a <strong>full money-back guarantee</strong> on anything that's
        our fault — a defective piece, a leak, the wrong item, or a valid claim.
        Report it within 14 days with a photo and we'll replace it or refund you
        in full, including delivery. See the{" "}
        <Link href="/returns" className="link-underline text-fg">
          returns policy
        </Link>{" "}
        for details.
      </>
    ),
    plain:
      "We offer a full money-back guarantee on anything that's our fault: a defective piece, a leak, the wrong item, or a valid claim. Report it within 14 days with a photo and we'll replace it or refund you in full, including delivery.",
  },
  {
    q: "Are the fragrances long-lasting?",
    a: "Very. Each is an Extrait de Parfum — the most concentrated form — built on premium fragrance oils for 12–14 hours of wear, depending on the scent and your skin.",
  },
  {
    q: "How do I contact you?",
    a: (
      <>
        The fastest way is <strong>WhatsApp: 0317 2388450</strong> — message us
        to order, ask about a scent, or check your delivery, and we reply within
        minutes during business hours (Mon–Sat, 10:00–19:00 PKT). You can also{" "}
        <Link href="/contact" className="link-underline text-fg">
          use the contact form
        </Link>{" "}
        or email contact@precisefumes.com, though WhatsApp is always quickest.
      </>
    ),
    plain:
      "The fastest way to reach us is WhatsApp at 0317 2388450 — message us to order, ask about a scent, or check your delivery, and we reply within minutes during business hours (Mon–Sat, 10:00–19:00 PKT). You can also use the contact form or email contact@precisefumes.com.",
  },
];

export default function FAQ() {
  const ld = faqLd(
    FAQS.map((f) => ({
      q: f.q,
      a: f.plain ?? (typeof f.a === "string" ? f.a : ""),
    }))
  );

  return (
    <div className="min-h-screen bg-bg text-fg">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />
      <div className="container-lux max-w-3xl pt-36 pb-24">
        <p className="tracking-luxe text-xs text-accent">Help Center</p>
        <h1 className="mt-4 font-serif text-5xl font-normal md:text-6xl">
          Frequently Asked Questions
        </h1>
        <p className="mt-4 max-w-xl text-fg-soft">
          Everything about our perfumes, offers, delivery, and the affiliate
          program — answered clearly.
        </p>

        <div className="mt-14 divide-y divide-border border-y border-border">
          {FAQS.map((item) => (
            <details key={item.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-xl font-normal [&::-webkit-details-marker]:hidden">
                {item.q}
                <span
                  aria-hidden
                  className="text-accent transition-transform duration-300 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <div className="pt-4 text-sm leading-relaxed text-fg-soft">
                {item.a}
              </div>
            </details>
          ))}
        </div>

        <div className="mt-14 rounded-[var(--radius-lg)] border border-border bg-bg-soft p-8 text-center">
          <h2 className="font-serif text-2xl font-normal">
            Still have a question?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-fg-soft">
            Our team is happy to help with anything — orders, scents, or the
            affiliate program.
          </p>
          <Link href="/contact" className="btn-primary mt-6">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
