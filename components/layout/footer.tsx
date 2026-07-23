"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Instagram, Mail, Phone, MessageCircle } from "lucide-react";

const SHOP_LINKS = [
  { href: "/shop", label: "All Fragrances" },
  { href: "/shop?category=Him", label: "For Him" },
  { href: "/shop?category=Her", label: "For Her" },
];

const INFO_LINKS = [
  { href: "/about", label: "Our Story" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" },
  { href: "/shipping", label: "Shipping Policy" },
  { href: "/returns", label: "Returns & Refunds" },
  { href: "/affiliate/signup", label: "Affiliate Program" },
];

export function Footer() {
  const year = new Date().getFullYear();
  const [subscribed, setSubscribed] = useState(false);
  const [sending, setSending] = useState(false);

  async function subscribe(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = new FormData(e.currentTarget).get("email");
    if (!email) return;
    setSending(true);
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Newsletter",
          email,
          message: "Newsletter signup",
        }),
      });
      setSubscribed(true);
    } catch {
      setSubscribed(true);
    } finally {
      setSending(false);
    }
  }

  return (
    <footer className="border-t border-border bg-bg-soft">
      {/* Newsletter band */}
      <div className="border-b border-border">
        <div className="container-lux flex flex-col items-start justify-between gap-6 py-12 md:flex-row md:items-center">
          <div>
            <h3 className="font-serif text-2xl font-normal md:text-3xl">
              Join the house list
            </h3>
            <p className="mt-2 max-w-sm text-sm text-fg-soft">
              New scents, private offers, and launch dates — a few emails a
              year, nothing more.
            </p>
          </div>
          {subscribed ? (
            <p className="text-sm text-accent-deep">
              ✓ Welcome — you're on the list.
            </p>
          ) : (
            <form
              onSubmit={subscribe}
              className="flex w-full max-w-md gap-3 md:w-auto"
            >
              <input
                type="email"
                name="email"
                required
                placeholder="Your email"
                className="flex-1 md:w-64"
                aria-label="Email for newsletter"
              />
              <button
                type="submit"
                disabled={sending}
                className="btn-primary shrink-0 !px-6 disabled:opacity-60"
              >
                {sending ? "…" : "Subscribe"}
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="container-lux py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <h3 className="font-serif text-2xl tracking-wide">Precise Fumes</h3>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-fg-soft">
              Meticulously composed luxury fragrances. Crafted with precision,
              worn with character.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <a
                href="https://instagram.com/precisefumes"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-fg-soft transition-colors hover:text-accent"
              >
                <Instagram className="h-5 w-5" strokeWidth={1.5} />
              </a>
              <a
                href="https://wa.me/923000000000"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="text-fg-soft transition-colors hover:text-accent"
              >
                <MessageCircle className="h-5 w-5" strokeWidth={1.5} />
              </a>
              <a
                href="mailto:contact@precisefumes.com"
                aria-label="Email"
                className="text-fg-soft transition-colors hover:text-accent"
              >
                <Mail className="h-5 w-5" strokeWidth={1.5} />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="tracking-luxe text-xs text-fg-faint">Shop</h4>
            <ul className="mt-5 flex flex-col gap-3">
              {SHOP_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="link-underline text-sm text-fg-soft transition-colors hover:text-fg"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="tracking-luxe text-xs text-fg-faint">Information</h4>
            <ul className="mt-5 flex flex-col gap-3">
              {INFO_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="link-underline text-sm text-fg-soft transition-colors hover:text-fg"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="tracking-luxe text-xs text-fg-faint">Get in Touch</h4>
            <ul className="mt-5 flex flex-col gap-3 text-sm text-fg-soft">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                <a
                  href="tel:+92"
                  className="transition-colors hover:text-fg"
                >
                  +92 300 0000000
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                <a
                  href="mailto:contact@precisefumes.com"
                  className="transition-colors hover:text-fg"
                >
                  contact@precisefumes.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-xs text-fg-faint sm:flex-row">
          <p>© {year} Precise Fumes. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="transition-colors hover:text-fg"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="transition-colors hover:text-fg"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
