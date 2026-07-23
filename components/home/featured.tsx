import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/types";
import { ProductCard } from "@/components/shop/product-card";
import { Reveal, StaggerReveal, StaggerItem } from "@/components/ui/reveal";

export function Featured({ products }: { products: Product[] }) {
  return (
    <section className="pf-tint"><div className="container-lux py-24 md:py-32">
      <Reveal className="mb-14 flex flex-col items-center text-center">
        <p className="tracking-luxe text-xs text-accent">Curated Selection</p>
        <h2 className="mt-4 font-serif text-4xl font-light md:text-5xl">
          Signature Fragrances
        </h2>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-fg-soft">
          Our most coveted compositions — each a careful balance of art and
          chemistry.
        </p>
      </Reveal>

      <StaggerReveal className="grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <StaggerItem key={product.id}>
            <ProductCard product={product} />
          </StaggerItem>
        ))}
      </StaggerReveal>

      <Reveal delay={0.1} className="mt-16 flex justify-center">
        <Link
          href="/shop"
          className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-fg transition-colors hover:text-accent"
        >
          View All Fragrances
          <ArrowRight
            className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1"
            strokeWidth={1.5}
          />
        </Link>
      </Reveal>
      </div>
    </section>
  );
}
