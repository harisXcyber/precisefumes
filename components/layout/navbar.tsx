"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag, Menu, X, Sun, Moon } from "lucide-react";
import { useCart } from "@/lib/store/cart";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/shop?category=Him", label: "For Him" },
  { href: "/shop?category=Her", label: "For Her" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/affiliate/signup", label: "Affiliate" },
];

export function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { toggleCart, itemCount } = useCart();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change.
  useEffect(() => setMobileOpen(false), [pathname]);

  const count = mounted ? itemCount() : 0;
  // Light mode shows dark-text logo; dark mode shows light logo.
  const logoSrc = theme === "dark" ? "/logo-dark.png" : "/logo-light.png";

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled
            ? "border-b border-border bg-bg/90 backdrop-blur-md"
            : "border-b border-border/50 bg-bg/60 backdrop-blur-sm"
        )}
      >
        {/* Offers bar */}
        <div className="bg-accent text-on-accent">
          <p className="container-lux flex h-8 items-center justify-center gap-2 overflow-hidden whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.14em] sm:text-[11px]">
            <span className="hidden sm:inline">Any 2 Perfumes — PKR 5,000</span>
            <span className="hidden sm:inline" aria-hidden>·</span>
            <span>Buy 2 Get 1 Free</span>
            <span aria-hidden>·</span>
            <span>Free Delivery in Karachi</span>
          </p>
        </div>

        <nav className="container-lux relative flex h-16 items-center justify-between md:h-20">
          {/* Left: mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="flex items-center md:hidden"
          >
            <Menu className="h-6 w-6" strokeWidth={1.5} />
          </button>

          {/* Desktop nav (left) */}
          <ul className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.slice(0, 3).map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="link-underline text-xs uppercase tracking-[0.18em] text-fg-soft transition-colors hover:text-fg"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Center: logo */}
          <Link
            href="/"
            aria-label="Precise Fumes home"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <Image
              src={logoSrc}
              alt="Precise Fumes"
              width={56}
              height={56}
              priority
              className="h-12 w-12 object-contain md:h-14 md:w-14"
            />
          </Link>

          {/* Right: actions */}
          <div className="flex items-center gap-4 md:gap-6">
            <ul className="hidden items-center gap-8 md:flex">
              {NAV_LINKS.slice(3).map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="link-underline text-xs uppercase tracking-[0.18em] text-fg-soft transition-colors hover:text-fg"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="text-fg-soft transition-colors hover:text-fg"
            >
              {mounted && theme === "dark" ? (
                <Sun className="h-5 w-5" strokeWidth={1.5} />
              ) : (
                <Moon className="h-5 w-5" strokeWidth={1.5} />
              )}
            </button>

            {/* Cart */}
            <button
              onClick={toggleCart}
              aria-label="Open cart"
              className="relative text-fg-soft transition-colors hover:text-fg"
            >
              <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                    className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-medium text-on-accent tabular-nums"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[80] bg-[var(--pf-overlay)] backdrop-blur-[2px] md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className="fixed left-0 top-0 z-[90] flex h-full w-4/5 max-w-xs flex-col bg-bg-elevated px-6 py-6 shadow-[var(--pf-shadow-lg)] md:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mb-8 flex items-center justify-between">
                <Image
                  src={logoSrc}
                  alt="Precise Fumes"
                  width={44}
                  height={44}
                  className="h-11 w-11 object-contain"
                />
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="rounded-full p-2 text-fg-soft transition-colors hover:bg-bg-soft hover:text-fg"
                >
                  <X className="h-5 w-5" strokeWidth={1.5} />
                </button>
              </div>

              <ul className="flex flex-col gap-1">
                {NAV_LINKS.map((link, i) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.06 }}
                  >
                    <Link
                      href={link.href}
                      className="block py-3 font-serif text-2xl transition-colors hover:text-accent"
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-auto border-t border-border pt-6">
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-3 text-sm text-fg-soft transition-colors hover:text-fg"
                >
                  {theme === "dark" ? (
                    <>
                      <Sun className="h-4 w-4" strokeWidth={1.5} /> Light mode
                    </>
                  ) : (
                    <>
                      <Moon className="h-4 w-4" strokeWidth={1.5} /> Dark mode
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
