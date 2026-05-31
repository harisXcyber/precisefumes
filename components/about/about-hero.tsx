"use client"

import { useRef } from "react"
import { useGSAP } from "@/components/site/use-gsap"
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap"
import { SplitText } from "@/components/site/split-text"

export function AboutHero() {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const el = ref.current
      if (!el) return
      gsap.to(el.querySelector("[data-bg]"), {
        yPercent: 30,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
      })
    },
    { scope: ref },
  )

  return (
    <section
      ref={ref}
      className="relative flex min-h-[90vh] items-end overflow-hidden px-6 pb-20 pt-40 md:px-10 lg:px-16"
    >
      <div
        data-bg
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 60% at 70% 20%, color-mix(in oklch, var(--accent) 14%, transparent), transparent 70%)",
        }}
      />
      <div className="mx-auto w-full max-w-7xl">
        <p className="mb-8 text-[0.7rem] uppercase tracking-luxury text-accent">Our Philosophy</p>
        <SplitText
          as="h1"
          text="The art of precision"
          trigger="load"
          className="max-w-5xl font-serif text-5xl leading-[0.95] md:text-8xl"
        />
        <p className="mt-10 max-w-xl text-pretty text-lg leading-relaxed text-foreground/55">
          Precise Fumes was founded on a simple conviction: a great fragrance is not an accident.
          It is the result of restraint, measurement, and an obsessive attention to balance.
        </p>
      </div>
    </section>
  )
}
