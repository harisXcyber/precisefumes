"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { getScentTone } from "@/lib/tones";

const EASE_LUX = [0.22, 1, 0.36, 1] as const;

const SCENTS = [
  { name: "Rogue", slug: "rogue", audience: "For Him" },
  { name: "Royal Oud", slug: "royal-oud", audience: "For Him" },
  { name: "Bloom", slug: "bloom", audience: "For Her" },
  { name: "Blossom", slug: "blossom", audience: "For Her" },
  { name: "Legacy", slug: "legacy", audience: "For Him" },
];

const OFFERS = [
  "Any 2 for PKR 5,000",
  "Buy 2 Get 1 Free",
  "Free Karachi Delivery",
];

export function Hero() {
  return (
    <section className="pf-tint relative overflow-hidden bg-bg pt-36 pb-16 md:pt-48 md:pb-20">
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

      <div className="container-lux relative z-10 flex flex-col items-center text-center">
        <motion.p
          className="pf-eyebrow"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: EASE_LUX }}
        >
          Maison de Parfum · Est. 2026 · Karachi
        </motion.p>

        <motion.h1
          className="mt-6 max-w-4xl font-serif text-5xl font-normal leading-[1.04] sm:text-6xl md:text-7xl lg:text-[5.5rem]"
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
          Five signature fragrances in 50ml — PKR 3,000 each. Delivered
          anywhere in Pakistan, cash on delivery.
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

        {/* Offer chips */}
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

        {/* The five scents — colour-coded strip */}
        <motion.div
          className="mt-14 grid w-full grid-cols-2 gap-3 sm:grid-cols-3 md:mt-16 md:grid-cols-5 md:gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.42, ease: EASE_LUX }}
        >
          {SCENTS.map((scent) => {
            const tone = getScentTone(scent.slug);
            return (
              <Link
                key={scent.slug}
                href={`/shop/${scent.slug}`}
                className="pf-card group flex min-h-[7.5rem] flex-col items-center justify-center gap-1.5 overflow-hidden border border-border p-4 text-center md:min-h-[8.5rem]"
                style={{ background: tone.gradient }}
              >
                <span className="text-[10px] uppercase tracking-[0.16em] text-fg-soft">
                  {scent.audience}
                </span>
                <span className="font-serif text-xl leading-tight md:text-2xl">
                  {scent.name}
                </span>
                <span className="text-xs text-fg-soft transition-colors group-hover:text-fg">
                  PKR 3,000 →
                </span>
              </Link>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
