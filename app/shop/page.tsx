import type { Metadata } from "next"
import { ShopGrid } from "@/components/shop/shop-grid"
import { Reveal } from "@/components/site/reveal"

export const metadata: Metadata = {
  title: "Shop · Precise Fumes",
  description: "Explore the Precise Fumes collection of precision-crafted eau de parfum.",
}

export default function ShopPage() {
  return (
    <main className="px-6 pb-32 pt-36 md:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <header className="mb-16 flex flex-col gap-6 border-b border-foreground/10 pb-12 md:mb-20">
          <Reveal>
            <p className="text-[0.7rem] uppercase tracking-luxury text-accent">The Collection</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="max-w-3xl text-balance font-serif text-5xl leading-[0.95] md:text-7xl">
              Fragrances composed with precision
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="max-w-xl text-pretty leading-relaxed text-foreground/55">
              Each scent is built around a single architectural idea — balanced, intentional, and
              unmistakably refined. Filter by olfactive family to find your signature.
            </p>
          </Reveal>
        </header>

        <ShopGrid />
      </div>
    </main>
  )
}
