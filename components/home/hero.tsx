"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-invert-bg text-invert-fg">
      {/* Ambient animated gradient orbs */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-1/4 h-[32rem] w-[32rem] rounded-full bg-accent/20 blur-[120px]"
        animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-40 bottom-1/4 h-[28rem] w-[28rem] rounded-full bg-accent/10 blur-[120px]"
        animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="container-lux relative z-10 flex flex-col items-center text-center">
        <motion.p
          className="tracking-luxe text-xs text-accent"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          The Art of Fragrance
        </motion.p>

        <motion.h1
          className="mt-6 max-w-4xl font-serif text-5xl font-light leading-[1.05] sm:text-6xl md:text-7xl lg:text-8xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          Scent, Composed
          <br />
          <span className="italic text-accent">with Precision</span>
        </motion.h1>

        <motion.p
          className="mt-8 max-w-xl text-base leading-relaxed text-invert-fg/70"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          Discover Precise Fumes — a collection of luxury perfumes crafted for
          those who wear character. Every bottle, a deliberate statement.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link
            href="/shop"
            className="group inline-flex items-center justify-center gap-2 rounded-[var(--radius)] border border-invert-fg bg-invert-fg px-9 py-3.5 text-xs uppercase tracking-[0.18em] text-invert-bg transition-all duration-500 hover:bg-transparent hover:text-invert-fg"
          >
            Explore Collection
            <ArrowRight
              className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1"
              strokeWidth={1.5}
            />
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center justify-center gap-2 rounded-[var(--radius)] border border-invert-fg/30 px-9 py-3.5 text-xs uppercase tracking-[0.18em] text-invert-fg transition-all duration-500 hover:border-invert-fg"
          >
            Our Story
          </Link>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <motion.div
          className="h-12 w-px bg-invert-fg/30"
          animate={{ scaleY: [0.3, 1, 0.3], originY: 0 }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}
