import { Reveal } from "@/components/ui/reveal";

/** Teaser for the special edition currently in the making. */
export function Atelier() {
  return (
    <section className="container-lux pb-24 md:pb-32">
      <Reveal>
        <div
          className="relative overflow-hidden rounded-[var(--radius-lg)] border border-border p-8 text-center md:p-14"
          style={{
            background:
              "radial-gradient(30rem 18rem at 50% 0%, color-mix(in oklab, var(--accent) 14%, transparent), transparent 70%)",
          }}
        >
          <p className="pf-eyebrow">In the Atelier</p>
          <h2 className="mx-auto mt-4 max-w-2xl font-serif text-3xl font-normal md:text-5xl">
            A special edition is{" "}
            <span className="italic text-accent-deep">being composed</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-fg-soft">
            Our sixth fragrance is in the making — rarer materials, a longer
            dry-down, a limited first run. Join the house list below to hear
            about it first.
          </p>
        </div>
      </Reveal>
    </section>
  );
}
