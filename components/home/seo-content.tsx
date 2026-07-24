import Link from "next/link";

/** Keyword-rich content block for the homepage — gives Google real,
 *  useful text around the buying intent we want to rank for. */
export function SeoContent() {
  return (
    <section className="border-t border-border bg-bg py-16 md:py-24">
      <div className="container-lux max-w-3xl">
        <h2 className="font-serif text-3xl font-normal md:text-4xl">
          Premium perfumes online in Pakistan
        </h2>
        <div className="mt-6 space-y-5 text-sm leading-relaxed text-fg-soft md:text-base">
          <p>
            Precise Fumes is a Karachi-based fragrance house crafting premium,
            long-lasting perfumes for men and women — available to{" "}
            <strong className="text-fg">order online across Pakistan</strong>{" "}
            with cash on delivery. Each of our five signatures is an{" "}
            <strong className="text-fg">Extrait de Parfum</strong>, the most
            concentrated and longest-lasting form of fragrance, giving you 12 to
            14 hours of wear from a single application.
          </p>
          <p>
            Every bottle is 50ml and priced at PKR 3,000, and every order ships
            with a <strong className="text-fg">free 5ml tester</strong> of
            another scent. Take advantage of our standing offers —{" "}
            <Link href="/shop" className="link-underline text-fg">
              buy 2 get 1 free
            </Link>
            , or any two perfumes for PKR 5,000 — applied automatically at
            checkout, with a full money-back guarantee on anything that&apos;s
            our fault.
          </p>
          <p>
            <strong className="text-fg">Free delivery in Karachi</strong> lands
            in 2 to 5 working days; nationwide delivery is PKR 300 and arrives in
            5 to 7 days. Whether you&apos;re looking for a bold men&apos;s oud, a
            fresh floral for her, or a distinguished everyday signature, explore
            the{" "}
            <Link href="/shop" className="link-underline text-fg">
              full collection
            </Link>{" "}
            and find the scent that becomes unmistakably yours.
          </p>
        </div>
      </div>
    </section>
  );
}
