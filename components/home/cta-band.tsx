'use client'

import { useRef } from 'react'
import { Logo } from '@/components/site/logo'
import { MagneticButton } from '@/components/site/magnetic-button'
import { SplitText } from '@/components/site/split-text'
import { useGSAP } from '@/components/site/use-gsap'
import { gsap, prefersReducedMotion } from '@/lib/gsap'

export function CtaBand() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.to('[data-cta-mark]', {
        rotate: 8,
        scale: 1.05,
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      })
    },
    { scope: root },
  )

  return (
    <section
      ref={root}
      className="relative overflow-hidden border-t border-foreground/10 py-28 text-center md:py-40"
    >
      <div
        data-cta-mark
        className="pointer-events-none absolute left-1/2 top-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 opacity-[0.05]"
      >
        <Logo className="h-full w-full" />
      </div>

      <div className="relative mx-auto max-w-2xl px-5">
        <SplitText
          as="h2"
          text="Find your precise signature"
          className="font-serif text-4xl leading-tight md:text-7xl"
        />
        <p className="mx-auto mt-6 max-w-md text-pretty leading-relaxed text-foreground/60">
          Discover the fragrance that becomes unmistakably yours. Crafted in
          small batches, designed to be remembered.
        </p>
        <div className="mt-10 flex justify-center">
          <MagneticButton href="/shop">Shop the Collection</MagneticButton>
        </div>
      </div>
    </section>
  )
}
