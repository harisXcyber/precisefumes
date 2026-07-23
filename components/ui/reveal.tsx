"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const EASE_LUX = [0.22, 1, 0.36, 1] as const;

interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}

/** Scroll-triggered fade-and-rise reveal — quick, smooth, GPU-friendly. */
export function Reveal({
  children,
  delay = 0,
  y = 18,
  className,
  once = true,
}: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "0px 0px -60px 0px" }}
      transition={{ duration: 0.55, delay, ease: EASE_LUX }}
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </motion.div>
  );
}

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE_LUX },
  },
};

/** Staggered container for revealing lists of children in sequence. */
export function StaggerReveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -40px 0px" }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={itemVariants}
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </motion.div>
  );
}
