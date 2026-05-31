'use client'

import { useRef } from 'react'
import { useGSAP } from '@/components/site/use-gsap'
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/gsap'
import { FragranceParticles } from '@/components/site/fragrance-particles'

const pyramid = [
  {
    tier: 'Top Notes',
    desc: 'The first impression — bright, volatile, fleeting.',
    notes: ['Bergamot', 'Saffron', 'Green Mandarin', 'Pink Pepper'],
  },
  {
    tier: 'Heart Notes',
    desc: 'The character — the soul of the composition.',
    notes: ['Damask Rose', 'Iris', 'Jasmine', 'Orris'],
  },
  {
    tier: 'Base Notes',
    desc: 'The memory — what lingers on skin for hours.',
    notes: ['Oud', 'Amber', 'Sandalwood', 'Tonka Bean'],
  },
]

export function Notes() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.utils.toArray<HTMLElement>('[data-tier]').forEach((row) => {
        gsap.from(row, {
          opacity: 0,
          x: -40,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: row, start: 'top 85%' },
        })
        gsap.from(row.querySelectorAll('[data-note]'), {
          opacity: 0,
          y: 16,
          stagger: 0.08,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: { trigger: row, start: 'top 82%' },
        })
      })
      return () => ScrollTrigger.getAll().forEach((t) => t.kill())
    },
    { scope: root },
  )

  return (
    <section
      ref={root}
      className="relative overflow-hidden border-y border-foreground/10 bg-secondary/40 py-24 md:py-32"
    >
      <FragranceParticles density={40} />
      <div className="relative mx-auto max-w-5xl px-5 md:px-8">
        <div className="mb-16 text-center">
          <p className="text-[0.7rem] uppercase tracking-luxury text-accent">
            The Composition
          </p>
          <h2 className="mt-4 text-balance font-serif text-4xl leading-tight md:text-6xl">
            An olfactory pyramid
          </h2>
        </div>

        <div className="flex flex-col gap-px">
          {pyramid.map((t) => (
            <div
              key={t.tier}
              data-tier
              className="grid gap-6 border-t border-foreground/10 py-10 md:grid-cols-[1fr_1.4fr] md:items-center"
            >
              <div>
                <h3 className="font-serif text-2xl md:text-3xl">{t.tier}</h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-foreground/55">
                  {t.desc}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {t.notes.map((n) => (
                  <span
                    key={n}
                    data-note
                    className="rounded-full border border-foreground/15 px-5 py-2 text-sm tracking-wide-lux text-foreground/75"
                  >
                    {n}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
