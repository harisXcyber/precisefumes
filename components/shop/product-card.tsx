'use client'

import { useRef } from 'react'
import { Plus } from 'lucide-react'
import type { Product } from '@/lib/products'
import { BottleVisual } from '@/components/site/bottle-visual'
import { gsap, prefersReducedMotion } from '@/lib/gsap'
import { cn } from '@/lib/utils'

export function ProductCard({
  product,
  className,
}: {
  product: Product
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  const onMove = (e: React.MouseEvent) => {
    if (prefersReducedMotion()) return
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    gsap.to(el.querySelector('[data-bottle]'), {
      rotateY: px * 16,
      rotateX: -py * 16,
      y: -10,
      duration: 0.6,
      ease: 'power3.out',
      transformPerspective: 800,
    })
  }

  const onLeave = () => {
    gsap.to(ref.current?.querySelector('[data-bottle]') ?? null, {
      rotateY: 0,
      rotateX: 0,
      y: 0,
      duration: 0.8,
      ease: 'elastic.out(1, 0.5)',
    })
  }

  return (
    <article
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-md border border-foreground/10 bg-card transition-colors duration-500 hover:border-accent/50',
        className,
      )}
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 opacity-60 transition-opacity duration-700 group-hover:opacity-100"
          style={{
            background: `radial-gradient(circle at 50% 75%, color-mix(in oklch, ${product.tone} 30%, transparent), transparent 65%)`,
          }}
        />
        <div
          data-bottle
          className="absolute inset-0 flex items-center justify-center p-10 will-change-transform [transform-style:preserve-3d]"
        >
          <BottleVisual tone={product.tone} className="h-full" label="PF" />
        </div>
        <span className="absolute left-4 top-4 text-[0.62rem] uppercase tracking-luxury text-foreground/45">
          {product.family}
        </span>
        <button
          type="button"
          aria-label={`Add ${product.name} to bag`}
          className="absolute bottom-4 right-4 flex h-10 w-10 translate-y-3 items-center justify-center rounded-full bg-foreground text-background opacity-0 transition-all duration-500 hover:bg-accent hover:text-accent-foreground group-hover:translate-y-0 group-hover:opacity-100"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-serif text-2xl leading-none">{product.name}</h3>
          <span className="font-mono text-sm text-foreground/70">
            ${product.price}
          </span>
        </div>
        <p className="mt-1.5 text-[0.7rem] uppercase tracking-wide-lux text-accent">
          {product.mood}
        </p>
        <p className="mt-4 text-sm leading-relaxed text-foreground/55">
          {product.notes.join(' · ')}
        </p>
        <div className="mt-auto flex items-center justify-between pt-6 text-[0.7rem] uppercase tracking-wide-lux text-foreground/40">
          <span>{product.size}</span>
          <span>Eau de Parfum</span>
        </div>
      </div>
    </article>
  )
}
