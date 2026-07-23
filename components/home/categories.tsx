import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

const TILES = [
  {
    href: "/shop?category=Him",
    eyebrow: "The Masculine Collection",
    title: "For Him",
    scents: "Rogue · Royal Oud · Legacy",
    background:
      "radial-gradient(30rem 20rem at 85% 0%, rgba(160,82,45,0.5), transparent 65%), linear-gradient(140deg, #2a1d11, #14100c)",
  },
  {
    href: "/shop?category=Her",
    eyebrow: "The Feminine Collection",
    title: "For Her",
    scents: "Bloom · Blossom",
    background:
      "radial-gradient(30rem 20rem at 85% 0%, rgba(196,106,114,0.45), transparent 65%), linear-gradient(140deg, #33191f, #14100c)",
  },
];

/** Editorial shop-by-collection tiles. */
export function Categories() {
  return (
    <section className="container-lux pb-24 md:pb-32">
      <div className="grid gap-5 md:grid-cols-2">
        {TILES.map((tile, i) => (
          <Reveal key={tile.href} delay={i * 0.08}>
            <Link
              href={tile.href}
              className="group relative flex min-h-[18rem] flex-col justify-end overflow-hidden rounded-[var(--radius-lg)] p-8 text-invert-fg transition-transform duration-500 ease-[var(--ease-lux)] hover:-translate-y-1.5 md:min-h-[22rem] md:p-12"
              style={{ background: tile.background }}
            >
              <p className="pf-eyebrow !text-accent">{tile.eyebrow}</p>
              <h3 className="mt-3 font-serif text-4xl font-light md:text-5xl">
                {tile.title}
              </h3>
              <p className="mt-2 text-sm text-invert-fg/70">{tile.scents}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-invert-fg/90">
                Shop {tile.title}
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1.5"
                  strokeWidth={1.5}
                />
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
