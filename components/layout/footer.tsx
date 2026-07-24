"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Instagram, Mail, Facebook, Linkedin } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { waLink, WHATSAPP_DISPLAY, CONTACT_EMAIL } from "@/lib/contact";

const SHOP_LINKS = [
  { href: "/shop", label: "All Fragrances" },
  { href: "/shop?category=Him", label: "For Him" },
  { href: "/shop?category=Her", label: "For Her" },
];

const INFO_LINKS = [
  { href: "/about", label: "Our Story" },
  { href: "/blog", label: "Journal" },
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
                href="https://facebook.com/precisefumes"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-fg-soft transition-colors hover:text-accent"
              >
                <Facebook className="h-5 w-5" strokeWidth={1.5} />
              </a>
              <a
                href="https://linkedin.com/company/precisefumes"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-fg-soft transition-colors hover:text-accent"
              >
                <Linkedin className="h-5 w-5" strokeWidth={1.5} />
              </a>
              <a
                href={waLink()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="text-fg-soft transition-colors hover:text-[#25D366]"
              >
                <WhatsAppIcon className="h-5 w-5" />
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
            <p className="mt-5 text-sm text-fg-soft">
              WhatsApp is the fastest way to reach us.
            </p>
            <a
              href={waLink(
                "Hi Precise Fumes! I'd like to ask about your perfumes."
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2.5 text-sm font-medium text-white transition-transform hover:scale-[1.02]"
            >
              <WhatsAppIcon className="h-4 w-4" />
              {WHATSAPP_DISPLAY}
            </a>
            <p className="mt-4 flex items-center gap-2 text-xs text-fg-soft">
              <Mail className="h-4 w-4 shrink-0" strokeWidth={1.5} />
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="transition-colors hover:text-fg"
              >
                {CONTACT_EMAIL}
              </a>
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-xs text-fg-faint sm:flex-row">
          <div className="flex flex-col items-center gap-1 sm:items-start">
            <p>© {year} Precise Fumes. All rights reserved.</p>
            <p>
              Powered by{" "}
              <a
                href="https://harishere.com"
                target="_blank"
                rel="noopener"
                className="text-fg-soft underline-offset-2 transition-colors hover:text-accent hover:underline"
              >
                harishere.com
              </a>
            </p>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="transition-colors hover:text-fg">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-fg">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
