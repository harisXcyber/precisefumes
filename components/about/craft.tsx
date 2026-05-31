import { Reveal } from "@/components/site/reveal"
import { BottleVisual } from "@/components/site/bottle-visual"

const steps = [
  { phase: "Sourcing", text: "Raw materials are selected from a small circle of trusted houses in Grasse, Calabria, and Mysore." },
  { phase: "Composition", text: "Our perfumer builds the accord by hand, adjusting in micro-increments until the structure holds." },
  { phase: "Maturation", text: "The concentrate rests in darkness, allowing the molecules to marry into a single coherent voice." },
  { phase: "Finishing", text: "Each bottle is filled, weighed, and inspected individually before it carries the Precise Fumes seal." },
]

export function Craft() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-28 md:px-10 md:py-36 lg:px-16">
      <div className="grid gap-16 lg:grid-cols-[1fr_0.8fr] lg:gap-24">
        <div>
          <Reveal>
            <p className="text-[0.7rem] uppercase tracking-luxury text-accent">The Process</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-5 max-w-md text-balance font-serif text-4xl leading-tight md:text-6xl">
              From raw material to finished fume
            </h2>
          </Reveal>

          <div className="mt-14 flex flex-col">
            {steps.map((step, i) => (
              <Reveal
                key={step.phase}
                delay={i * 0.05}
                className="flex gap-8 border-t border-foreground/10 py-8"
              >
                <span className="font-mono text-sm text-foreground/40">0{i + 1}</span>
                <div>
                  <h3 className="font-serif text-2xl">{step.phase}</h3>
                  <p className="mt-3 max-w-md leading-relaxed text-foreground/55">{step.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal className="relative hidden lg:block">
          <div className="sticky top-32 flex h-[60vh] items-center justify-center rounded-md border border-foreground/10 bg-card">
            <BottleVisual tone="oklch(0.62 0.1 75)" className="h-[70%]" label="PF" />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
