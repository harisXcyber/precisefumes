import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";

export function CTA() {
  return (
    <section className="relative overflow-hidden bg-invert-bg py-28 text-invert-fg md:py-36">
      <div className="container-lux relative z-10 flex flex-col items-center text-center">
        <Reveal>
          <p className="tracking-luxe text-xs text-accent">
            Find Your Signature
          </p>
          <h2 className="mt-5 max-w-2xl font-serif text-4xl font-light leading-tight md:text-6xl">
            The right scent is waiting for you
          </h2>
          <p className="mx-auto mt-6 max-w-md leading-relaxed text-invert-fg/70">
            Explore the full collection and discover the fragrance that becomes
            unmistakably yours.
          </p>
          <Link
            href="/shop"
            className="mt-10 inline-flex items-center justify-center rounded-[var(--radius)] bg-invert-fg px-10 py-4 text-xs uppercase tracking-[0.18em] text-invert-bg transition-opacity duration-500 hover:opacity-85"
          >
            Shop the Collection
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
