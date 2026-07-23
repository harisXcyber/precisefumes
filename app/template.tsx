"use client";

import { motion } from "framer-motion";

/** Animates every route change — a quick fade-and-rise so page
 *  switches feel composed instead of abrupt. Kept short (0.4s)
 *  so navigation never feels slowed down. */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
