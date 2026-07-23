import { Suspense } from "react";
import type { Metadata } from "next";
import { getProducts } from "@/lib/products";
import { ShopGrid } from "@/components/shop/shop-grid";

export const metadata: Metadata = {
  title: "Shop All Fragrances",
  description:
    "Browse the complete Precise Fumes collection — luxury perfumes for him and for her.",
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
            All Fragrances
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-fg-soft">
            Explore every composition in the Precise Fumes house — each crafted
            to become unmistakably yours.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="container-lux py-12 md:py-16">
        <Suspense fallback={<div className="py-20 text-center text-fg-soft">Loading…</div>}>
          <ShopGrid products={products} />
        </Suspense>
      </section>
    </div>
  );
}
