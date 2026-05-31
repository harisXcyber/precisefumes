import { products } from '@/lib/products'
import { ProductCard } from '@/components/shop/product-card'
import { Reveal } from '@/components/site/reveal'
import { MagneticButton } from '@/components/site/magnetic-button'

export function Featured() {
  const featured = products.slice(0, 3)
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
      <Reveal className="flex flex-col items-end justify-between gap-6 md:flex-row md:items-end">
        <div className="max-w-xl">
          <p className="text-[0.7rem] uppercase tracking-luxury text-accent">
            The Collection
          </p>
          <h2 className="mt-4 text-balance font-serif text-4xl leading-tight md:text-6xl">
            Signature fragrances
          </h2>
        </div>
        <MagneticButton href="/shop" variant="outline">
          View all
        </MagneticButton>
      </Reveal>

      <Reveal stagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </Reveal>
    </section>
  )
}
