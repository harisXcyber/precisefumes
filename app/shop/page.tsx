import { Suspense } from "react";
import type { Metadata } from "next";
import { getProducts } from "@/lib/products";
import { ShopGrid } from "@/components/shop/shop-grid";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Shop Perfumes Online in Pakistan — Free Karachi Delivery",
  description:
    "Browse premium perfumes for men and women — Rogue, Royal Oud, Legacy, Bloom & Blossom. Extrait de Parfum, 12–14 hour wear, PKR 3,000. Buy 3 get 1 free, free 5ml tester, free delivery in Karachi, cash on delivery nationwide.",
  alternates: { canonical: "/shop" },
  openGraph: {
    title: "Shop Perfumes Online in Pakistan — Precise Fumes",
    description:
      "Premium perfumes for men and women. Buy 3 get 1 free, free delivery in Karachi, cash on delivery.",
    url: "https://precisefumes.com/shop",
    type: "website",
  },
};

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <div className="pt-24 md:pt-28">
      {/* Page header */}
      <section className="border-b border-border bg-bg-soft py-16 md:py-20">
        <div className="container-lux text-center">
          <p className="tracking-luxe text-xs text-accent">The Collection</p>
          <h1 className="mt-4 font-serif text-5xl font-normal md:text-6xl">
            Buy Perfumes Online in Pakistan
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-fg-soft">
            Five premium Extrait de Parfum signatures for men and women — 50ml,
            12–14 hour wear, PKR 3,000 each. Free 5ml tester in every order,
            buy 3 get 1 free, free delivery in Karachi and cash on delivery
            across Pakistan.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="container-lux py-12 md:py-16">
        <Suspense fallback={<div className="py-20 text-center text-fg-soft">Loading…</div>}>
          <ShopGrid products={products} />
        </Suspense>
      </section>

      {/* SEO content — real, useful copy for search intent */}
      <section className="border-t border-border bg-bg-soft py-16 md:py-20">
        <div className="container-lux max-w-3xl space-y-8 text-sm leading-relaxed text-fg-soft">
          <div>
            <h2 className="mb-3 font-serif text-2xl font-normal text-fg">
              Premium perfumes, delivered across Pakistan
            </h2>
            <p>
              Precise Fumes is a Karachi fragrance house making premium,
              long-lasting perfumes you can order online with confidence. Every
              scent is an Extrait de Parfum — the most concentrated form of
              fragrance — so a few sprays carry 12 to 14 hours through your day.
              Choose from five signatures: <strong>Rogue</strong>,{" "}
              <strong>Royal Oud</strong> and <strong>Legacy</strong> for him,{" "}
              <strong>Bloom</strong> and <strong>Blossom</strong> for her — each
              PKR 3,000 for a 50ml bottle.
            </p>
          </div>

          <div>
            <h2 className="mb-3 font-serif text-2xl font-normal text-fg">
              Free delivery in Karachi, cash on delivery nationwide
            </h2>
            <p>
              Order perfume online and pay when it arrives — no advance payment.
              Delivery is <strong>free in Karachi</strong> within 2 to 5 working
              days, and PKR 300 anywhere else in Pakistan within 5 to 7 days.
              Every order includes a <strong>free 5ml tester</strong> of a scent
              you haven&apos;t tried yet.
            </p>
          </div>

          <div>
            <h2 className="mb-3 font-serif text-2xl font-normal text-fg">
              Buy 3 Get 1 Free &amp; 2 for PKR 5,000
            </h2>
            <p>
              Our promotions apply automatically at checkout. Add any two
              perfumes for{" "}
              <strong>PKR 5,000 (save PKR 1,000)</strong>, or take the{" "}
              <strong>Buy 3 Get 1 Free</strong> deal — four perfumes for just{" "}
              <strong>PKR 8,000</strong> instead of PKR 9,000. Backed by a full money-back
              guarantee — if anything is wrong on our side, we refund you in
              full or replace it free.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
