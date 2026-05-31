'use client'

import { useRef } from 'react'
import { Logo } from '@/components/site/logo'
import { useGSAP } from '@/components/site/use-gsap'
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/gsap'

const lines = [
  'A signature pressed into glass.',
  'Built on precision.',
  'Worn as memory.',
]

export function LogoScroll() {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const ctx = root.current
      if (!ctx) return

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ctx,
          start: 'top top',
          end: '+=170%',
          pin: true,
          scrub: 1,
        },
      })

      tl.fromTo(
        '[data-mark]',
        { scale: 2.4, opacity: 0.12, rotate: -6 },
        { scale: 1, opacity: 1, rotate: 0, ease: 'none' },
      )
        .to('[data-mark]', { y: -40, ease: 'none' })
        .fromTo(
          '[data-line]',
          { yPercent: 120, opacity: 0 },
          { yPercent: 0, opacity: 1, stagger: 0.4, ease: 'power2.out' },
          '<',
        )

      return () => {
        ScrollTrigger.getAll().forEach((t) => {
          if (t.trigger === ctx) t.kill()
        })
      }
    },
    { scope: root },
  )

  return (
    <section
      ref={root}
      className="relative flex h-screen items-center justify-center overflow-hidden bg-background"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            'radial-gradient(circle at 50% 60%, color-mix(in oklch, var(--champagne) 18%, transparent), transparent 60%)',
        }}
      />
      <div className="relative flex flex-col items-center text-center">
        <div data-mark className="relative h-44 w-44 md:h-64 md:w-64">
          <Logo className="h-full w-full" />
        </div>
        <div className="mt-10 flex flex-col gap-2">
          {lines.map((l) => (
            <span key={l} className="overflow-hidden">
              <span
                data-line
                className="block font-serif text-2xl leading-tight text-foreground/85 md:text-4xl"
              >
                {l}
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
