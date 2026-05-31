"use client"

import { useRef } from "react"
import { useGSAP } from "@/components/site/use-gsap"
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap"

const values = [
  {
    no: "01",
    title: "Restraint",
    body: "We compose with the fewest possible notes. Every ingredient must earn its place, or it is removed. What remains is clarity.",
  },
  {
    no: "02",
    title: "Measure",
    body: "Each formula is weighed to the milligram. Precision is not cold — it is the foundation on which emotion is reliably built.",
  },
  {
    no: "03",
    title: "Patience",
    body: "Our maturations rest for months, never weeks. Time rounds the edges and lets the architecture of a scent settle into place.",
  },
  {
    no: "04",
    title: "Permanence",
    body: "A Precise Fume is made to be remembered. We design longevity and sillage that linger long after you have left the room.",
  },
]

export function Values() {
  const ref = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const section = ref.current
      const track = trackRef.current
      if (!section || !track) return

      const distance = track.scrollWidth - window.innerWidth
      if (distance <= 0) return

      gsap.to(track, {
        x: -distance,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${distance}`,
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
        },
      })
    },
    { scope: ref },
  )

  return (
    <section ref={ref} className="relative overflow-hidden bg-card">
      <div className="flex items-center justify-between px-6 pt-20 md:px-10 lg:px-16">
        <p className="text-[0.7rem] uppercase tracking-luxury text-accent">Four Principles</p>
        <p className="hidden text-[0.7rem] uppercase tracking-wide-lux text-foreground/40 md:block">
          Scroll to explore
        </p>
      </div>
      <div
        ref={trackRef}
        className="flex w-max items-stretch gap-6 px-6 py-16 md:gap-10 md:px-10 lg:px-16"
      >
        {values.map((v) => (
          <article
            key={v.no}
            className="flex w-[80vw] max-w-[460px] flex-col justify-between rounded-md border border-foreground/10 bg-background/40 p-10 md:w-[460px] md:p-14"
          >
            <span className="font-mono text-sm text-accent">{v.no}</span>
            <div className="mt-24">
              <h3 className="font-serif text-4xl md:text-6xl">{v.title}</h3>
              <p className="mt-6 text-pretty leading-relaxed text-foreground/55">{v.body}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
