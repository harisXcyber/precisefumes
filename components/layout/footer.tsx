"use client";

import Link from "next/link";
import { Instagram, Mail, Phone, MessageCircle } from "lucide-react";

const SHOP_LINKS = [
  { href: "/shop", label: "All Fragrances" },
  { href: "/shop?category=Him", label: "For Him" },
  { href: "/shop?category=Her", label: "For Her" },
  { href: "/shop?category=Unisex", label: "Unisex" },
];

const INFO_LINKS = [
  { href: "/about", label: "Our Story" },
  { href: "/contact", label: "Contact" },
  { href: "/shipping", label: "Shipping & Returns" },
  { href: "/faq", label: "FAQ" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-bg-soft">
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
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-fg-soft transition-colors hover:text-accent"
              >
                <Instagram className="h-5 w-5" strokeWidth={1.5} />
              </a>
              <a
                href="https://wa.me/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="text-fg-soft transition-colors hover:text-accent"
              >
                <MessageCircle className="h-5 w-5" strokeWidth={1.5} />
              </a>
              <a
                href="mailto:hello@precisefumes.com"
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
                  href="mailto:hello@precisefumes.com"
                  className="transition-colors hover:text-fg"
                >
                  hello@precisefumes.com
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
