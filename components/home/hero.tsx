"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { getScentTone } from "@/lib/tones";

const EASE_LUX = [0.22, 1, 0.36, 1] as const;

const COLLECTION_IMAGE =
  "https://qjjdxxtfvrdrpwcvlwhb.supabase.co/storage/v1/object/public/product-images/site/collection-bottles.jpg";

const OFFERS = [
  "Any 2 for PKR 5,000",
  "Buy 3 Get 1 Free",
  "Free 5ml Tester",
  "Free Gift Bag",
  "Free Karachi Delivery",
];

export interface HeroScent {
  name: string;
  slug: string;
  category: string;
  image: string;
}

export function Hero({ scents = [] }: { scents?: HeroScent[] }) {
  return (
    <section className="pf-tint relative overflow-hidden bg-bg pt-36 pb-16 md:pt-44 md:pb-20">
      {/* Soft ambient colour — quiet on the light ground */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-10 h-[26rem] w-[26rem] rounded-full bg-accent/15 blur-[100px]"
        style={{ willChange: "transform" }}
        animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-40 bottom-0 h-[24rem] w-[24rem] rounded-full bg-accent-rose/10 blur-[100px]"
        style={{ willChange: "transform" }}
        animate={{ x: [0, -40, 0], y: [0, -24, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="container-lux relative z-10">
        <div className="flex flex-col items-center text-center">
          <motion.p
            className="pf-eyebrow"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE_LUX }}
          >
            Maison de Parfum · Est. 2026 · Karachi
          </motion.p>

          <motion.h1
            className="mt-6 max-w-4xl font-serif text-5xl leading-[1.04] sm:text-6xl md:text-7xl lg:text-[5.25rem]"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08, ease: EASE_LUX }}
          >
            The Scent of
            <br />
            <span className="italic text-accent-deep">Precision</span>
          </motion.h1>

          <motion.p
            className="mt-7 max-w-xl text-base leading-relaxed text-fg-soft"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.16, ease: EASE_LUX }}
          >
            Five premium Extrait de Parfum signatures in 50ml — PKR 3,000 each,
            12–14 hours of wear, with a free 5ml tester in every order. Cash on
            delivery anywhere in Pakistan.
          </motion.p>

          <motion.div
            className="mt-9 flex flex-col items-center gap-4 sm:flex-row"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.24, ease: EASE_LUX }}
          >
            <Link href="/shop" className="btn-primary">
              Explore Collection
              <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
            </Link>
            <Link href="/about" className="btn-ghost">
              Our Story
            </Link>
          </motion.div>

          <motion.ul
            className="mt-9 flex flex-wrap items-center justify-center gap-2.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.34 }}
          >
            {OFFERS.map((offer) => (
              <li
                key={offer}
                className="rounded-full border border-border bg-bg px-4 py-2 text-[11px] uppercase tracking-[0.14em] text-fg-soft"
              >
                {offer}
              </li>
            ))}
          </motion.ul>
        </div>

        {/* The collection, photographed */}
        <motion.div
          className="relative mt-14 aspect-[16/10] overflow-hidden rounded-[var(--radius-lg)] border border-border md:mt-16 md:aspect-[21/9]"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: EASE_LUX }}
        >
          <Image
            src={COLLECTION_IMAGE}
            alt="The five Precise Fumes fragrances — Legacy, Blossom, Rogue, Bloom and Royal Oud"
            fill
            priority
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover"
          />
        </motion.div>

        {/* Shop each scent */}
        {scents.length > 0 && (
          <motion.div
            className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 md:gap-4"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: EASE_LUX }}
          >
            {scents.map((scent) => {
              const tone = getScentTone(scent.slug);
              return (
                <Link
                  key={scent.slug}
                  href={`/shop/${scent.slug}`}
                  className="pf-card group overflow-hidden border border-border"
                >
                  <span
                    className="relative block aspect-square"
                    style={{ background: tone.gradient }}
                  >
                    {scent.image && (
                      <Image
                        src={scent.image}
                        alt={scent.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 20vw"
                        className="object-cover transition-transform duration-700 ease-[var(--ease-lux)] group-hover:scale-105"
                      />
                    )}
                  </span>
                  <span className="block bg-bg px-3 py-3 text-center">
                    <span className="block text-[10px] uppercase tracking-[0.16em] text-fg-soft">
                      {scent.category === "Her" ? "For Her" : "For Him"}
                    </span>
                    <span className="mt-0.5 block font-serif text-lg leading-tight">
                      {scent.name}
                    </span>
                  </span>
                </Link>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
}
