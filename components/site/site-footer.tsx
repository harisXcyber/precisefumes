import Link from 'next/link'
import { Instagram, Twitter, Facebook } from 'lucide-react'
import { Logo } from '@/components/site/logo'

const footerLinks = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

const socials = [
  { href: 'https://instagram.com', label: 'Instagram', Icon: Instagram },
  { href: 'https://twitter.com', label: 'Twitter', Icon: Twitter },
  { href: 'https://facebook.com', label: 'Facebook', Icon: Facebook },
]

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-foreground/10 bg-background">
      {/* Oversized watermark logo */}
      <div className="pointer-events-none absolute -bottom-16 left-1/2 h-[360px] w-[360px] -translate-x-1/2 opacity-[0.04]">
        <Logo className="h-full w-full" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20">
        <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-3">
              <Logo className="h-12 w-12" />
              <span className="font-serif text-xl tracking-wide-lux">
                PRECISE FUMES
              </span>
            </div>
            <p className="mt-5 text-pretty font-serif text-2xl leading-snug text-foreground/80">
              Elegant scents with a precise touch.
            </p>
            <a
              href="mailto:atelier@precisefumes.com"
              className="mt-4 inline-block text-sm tracking-wide-lux text-foreground/60 transition-colors hover:text-accent"
            >
              atelier@precisefumes.com
            </a>
          </div>

          <div className="flex gap-16">
            <div>
              <h3 className="text-[0.7rem] uppercase tracking-luxury text-foreground/40">
                Explore
              </h3>
              <ul className="mt-5 space-y-3">
                {footerLinks.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm tracking-wide-lux text-foreground/70 transition-colors hover:text-accent"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-[0.7rem] uppercase tracking-luxury text-foreground/40">
                Social
              </h3>
              <ul className="mt-5 space-y-3">
                {socials.map(({ href, label }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm tracking-wide-lux text-foreground/70 transition-colors hover:text-accent"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-foreground/10 pt-8 md:flex-row">
          <p className="text-xs tracking-wide-lux text-foreground/40">
            © {new Date().getFullYear()} Precise Fumes. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {socials.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-foreground/15 text-foreground/60 transition-colors hover:border-accent hover:text-accent"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
