'use client'

import { useRef } from 'react'
import { BottleVisual } from '@/components/site/bottle-visual'
import { Reveal } from '@/components/site/reveal'
import { useGSAP } from '@/components/site/use-gsap'
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/gsap'

const panels = [
  {
    index: '01',
    title: 'Composed with intention',
    body: 'Every Precise Fumes formula begins as an idea about restraint — what to leave out so the essential can speak. Our perfumers work in grams and seconds, not guesswork.',
    tone: 'oklch(0.45 0.07 40)',
  },
  {
    index: '02',
    title: 'Sourced without compromise',
    body: 'Rare oud, cold-pressed citrus, and steam-distilled florals are selected by harvest and origin. Precision is a supply chain, not only a scent.',
    tone: 'oklch(0.7 0.11 70)',
  },
  {
    index: '03',
    title: 'Worn as a signature',
    body: 'A fragrance should feel inevitable — the natural extension of the person wearing it. We design longevity and sillage to be felt, never announced.',
    tone: 'oklch(0.52 0.12 12)',
  },
]

export function Storytelling() {
  const root = useRef<HTMLDivElement>(null)
  const bottleRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const sections = gsap.utils.toArray<HTMLElement>('[data-panel]')
      sections.forEach((sec, i) => {
        ScrollTrigger.create({
          trigger: sec,
          start: 'top center',
          end: 'bottom center',
          onToggle: (self) => {
            if (self.isActive) {
              const tone = sec.dataset.tone || 'oklch(0.6 0.08 70)'
              gsap.to(bottleRef.current, {
                '--bottle-tone': tone,
                rotate: i % 2 === 0 ? -3 : 3,
                duration: 0.8,
                ease: 'power3.out',
              } as gsap.TweenVars)
              gsap.fromTo(
                bottleRef.current,
                { yPercent: 6 },
                { yPercent: -6, duration: 1.2, ease: 'power2.out' },
              )
            }
          },
        })
      })
    },
    { scope: root },
  )

  return (
    <section
      ref={root}
      className="relative mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32"
    >
      <Reveal className="mb-16 max-w-xl">
        <p className="text-[0.7rem] uppercase tracking-luxury text-accent">
          The House
        </p>
        <h2 className="mt-4 text-balance font-serif text-4xl leading-tight md:text-6xl">
          Precision is our perfume
        </h2>
      </Reveal>

      <div className="grid gap-12 md:grid-cols-2 md:gap-20">
        {/* Sticky bottle */}
        <div className="hidden md:block">
          <div className="sticky top-28 flex h-[70vh] items-center justify-center">
            <div
              ref={bottleRef}
              className="h-[60vh] w-full will-change-transform"
              style={
                {
                  ['--bottle-tone' as string]: panels[0].tone,
                } as React.CSSProperties
              }
            >
              <BottleVisualBound />
            </div>
          </div>
        </div>

        {/* Scrolling panels */}
        <div className="flex flex-col">
          {panels.map((p) => (
            <article
              key={p.index}
              data-panel
              data-tone={p.tone}
              className="flex min-h-[60vh] flex-col justify-center border-b border-foreground/10 py-12 last:border-0"
            >
              <span className="font-mono text-sm text-accent">{p.index}</span>
              <h3 className="mt-4 font-serif text-3xl leading-tight md:text-4xl">
                {p.title}
              </h3>
              <p className="mt-5 max-w-md text-pretty leading-relaxed text-foreground/65">
                {p.body}
              </p>
              {/* Mobile bottle */}
              <div className="mt-8 h-64 md:hidden">
                <BottleVisual tone={p.tone} className="h-full" label="PF" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

// Bottle that reads the animated CSS var tone from its parent
function BottleVisualBound() {
  return <BottleVisual tone="var(--bottle-tone)" className="h-full" label="PRECISE" />
}
