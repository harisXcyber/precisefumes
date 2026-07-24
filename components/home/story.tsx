import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";

const PILLARS = [
  {
    title: "Precision",
    body: "Every formula is balanced to the milligram — nothing accidental, nothing excessive.",
  },
  {
    title: "Longevity",
    body: "Extrait de Parfum strength — premium oils that carry a scent 12–14 hours, from morning to midnight.",
  },
  {
    title: "Character",
    body: "Distinct, memorable compositions designed to become a part of who you are.",
  },
];

export function Story() {
  return (
    <>
      {/* Brand statement with image */}
      <section className="pf-tint bg-bg-soft py-24 md:py-32">
        <div className="container-lux grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <div className="img-zoom relative aspect-[4/5] overflow-hidden rounded-[var(--radius-lg)] bg-invert-bg">
              <Image
                src="/logo-dark.png"
                alt="Precise Fumes craftsmanship"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain p-12"
              />
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <p className="tracking-luxe text-xs text-accent">Our Philosophy</p>
            <h2 className="mt-4 font-serif text-4xl font-normal leading-tight md:text-5xl">
              Fragrance as a
              <br />
              <span className="italic text-accent">deliberate craft</span>
            </h2>
            <p className="mt-6 max-w-md leading-relaxed text-fg-soft">
              Precise Fumes was born from a simple belief: a great perfume is
              not worn, it is inhabited. We compose each scent like a piece of
              music — structured, layered, and unmistakably ours.
            </p>
            <p className="mt-4 max-w-md leading-relaxed text-fg-soft">
              From sourcing the finest raw materials to the final drop in the
              bottle, precision guides every decision.
            </p>
            <Link
              href="/about"
              className="link-underline mt-8 inline-block text-xs uppercase tracking-[0.18em] text-fg"
            >
              Read Our Story
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Three pillars */}
      <section className="pf-tint-cool pf-tint container-lux py-24 md:py-28">
        <div className="grid gap-px overflow-hidden rounded-[var(--radius-lg)] border border-border bg-border md:grid-cols-3">
          {PILLARS.map((pillar, i) => (
            <Reveal
              key={pillar.title}
              delay={i * 0.12}
              className="bg-bg p-10 text-center md:p-12"
            >
              <span className="pf-gradient-text font-serif text-5xl">
                0{i + 1}
              </span>
              <h3 className="mt-4 font-serif text-2xl">{pillar.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-fg-soft">
                {pillar.body}
              </p>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
