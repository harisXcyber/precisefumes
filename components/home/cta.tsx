import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";

export function CTA() {
  return (
    <section className="relative overflow-hidden bg-invert-bg py-28 text-invert-fg md:py-36">
      {/* Colour wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(38rem 24rem at 20% 20%, rgba(201,154,78,0.22), transparent 65%), radial-gradient(34rem 22rem at 80% 85%, rgba(196,106,114,0.16), transparent 65%), radial-gradient(28rem 20rem at 60% 10%, rgba(138,111,184,0.12), transparent 60%)",
        }}
      />

      <div className="container-lux relative z-10 flex flex-col items-center text-center">
        <Reveal>
          <p className="tracking-luxe text-xs text-accent">
            Find Your Signature
          </p>
          <h2 className="mt-5 max-w-2xl font-serif text-4xl font-normal leading-tight md:text-6xl">
            The right scent is{" "}
            <span className="pf-gradient-text italic">waiting for you</span>
          </h2>
          <p className="mx-auto mt-6 max-w-md leading-relaxed text-invert-fg/70">
            Five signatures. Any two for PKR 5,000 — or Buy 3 Get 1 Free: four
            perfumes for PKR 8,000.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/shop" className="btn-primary">
              Shop the Collection
            </Link>
            <Link
              href="/faq"
              className="btn-ghost border-invert-fg/25 text-invert-fg"
            >
              How Offers Work
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
