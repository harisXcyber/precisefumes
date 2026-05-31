'use client'

import { useRef } from 'react'
import { ArrowDown } from 'lucide-react'
import { Logo } from '@/components/site/logo'
import { MagneticButton } from '@/components/site/magnetic-button'
import { SplitText } from '@/components/site/split-text'
import { FragranceParticles } from '@/components/site/fragrance-particles'
import { useGSAP } from '@/components/site/use-gsap'
import { gsap, prefersReducedMotion } from '@/lib/gsap'

export function Hero() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
      tl.from('[data-hero-logo]', {
        scale: 0.6,
        opacity: 0,
        filter: 'blur(20px)',
        duration: 1.6,
      })
        .from(
          '[data-hero-kicker]',
          { y: 20, opacity: 0, duration: 1 },
          '-=0.9',
        )
        .from(
          '[data-hero-cta]',
          { y: 24, opacity: 0, duration: 1, stagger: 0.12 },
          '-=0.6',
        )
        .from('[data-hero-cue]', { opacity: 0, duration: 1 }, '-=0.4')

      // Floating logo idle motion
      gsap.to('[data-hero-logo]', {
        y: -12,
        duration: 4,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: 1.6,
      })
    },
    { scope: root },
  )

  return (
    <section
      ref={root}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 pt-24 text-center"
    >
      <FragranceParticles density={70} />

      {/* Soft radial glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-50 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, color-mix(in oklch, var(--gold) 28%, transparent), transparent 65%)',
        }}
      />

      <div className="relative z-10 flex flex-col items-center">
        <p
          data-hero-kicker
          className="mb-6 text-[0.7rem] uppercase tracking-luxury text-foreground/50"
        >
          Maison de Parfum · Est. 2024
        </p>

        <div data-hero-logo className="relative h-40 w-40 md:h-52 md:w-52">
          <Logo priority className="h-full w-full" />
        </div>

        <h1 className="mt-6 font-serif text-5xl leading-[0.95] tracking-tight md:text-8xl">
          <SplitText text="Precise Fumes" trigger="load" by="char" delay={0.5} />
        </h1>

        <SplitText
          as="p"
          text="Elegant scents with a precise touch."
          trigger="load"
          delay={1.1}
          className="mt-6 max-w-md font-serif text-xl text-foreground/65 md:text-2xl"
        />

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <span data-hero-cta>
            <MagneticButton href="/shop">Explore the Collection</MagneticButton>
          </span>
          <span data-hero-cta>
            <MagneticButton href="/about" variant="outline">
              Our Story
            </MagneticButton>
          </span>
        </div>
      </div>

      <div
        data-hero-cue
        className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3"
      >
        <span className="text-[0.6rem] uppercase tracking-luxury text-foreground/40">
          Scroll
        </span>
        <span className="flex h-10 w-6 items-start justify-center rounded-full border border-foreground/20 p-1.5">
          <ArrowDown className="h-3 w-3 animate-bounce text-foreground/50" />
        </span>
      </div>
    </section>
  )
}
