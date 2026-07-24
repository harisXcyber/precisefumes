import Image from "next/image";
import { Reveal } from "@/components/ui/reveal";

/** Every perfume ships wrapped in a premium gift bag — free. */
export function GiftBag() {
  return (
    <section className="border-y border-border bg-invert-bg py-16 text-invert-fg md:py-20">
      <div className="container-lux grid items-center gap-10 md:grid-cols-2 md:gap-16">
        <Reveal>
          <div className="flex gap-4">
            <div className="relative aspect-square flex-1 overflow-hidden rounded-[var(--radius-lg)] border border-white/10">
              <Image
                src="/gift-bag-black.jpg"
                alt="Precise Fumes premium black gift bag"
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
            <div className="relative aspect-square flex-1 overflow-hidden rounded-[var(--radius-lg)] border border-white/10">
              <Image
                src="/gift-bag-cream.jpg"
                alt="Precise Fumes premium cream gift bag"
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="pf-eyebrow !text-accent">Gift-wrapped, free</p>
          <h2 className="mt-4 font-serif text-4xl font-normal leading-tight md:text-5xl">
            Every perfume arrives in a{" "}
            <span className="italic text-accent">premium gift bag</span>
          </h2>
          <p className="mt-5 max-w-md leading-relaxed text-invert-fg/70">
            No plain parcels here. Each bottle is presented in one of our
            signature luxury gift bags at no extra cost — ready to gift, or to
            make unboxing your own order feel like the occasion it is.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
