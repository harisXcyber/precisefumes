'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { Logo } from '@/components/site/logo'
import { ThemeToggle } from '@/components/site/theme-toggle'
import { cn } from '@/lib/utils'

const links = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [pathname])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-500',
        scrolled
          ? 'glass border-b border-foreground/10 py-3'
          : 'border-b border-transparent py-5',
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 md:px-8">
        <Link
          href="/"
          aria-label="Precise Fumes home"
          className="flex items-center gap-3"
        >
          <Logo className="h-10 w-10" priority />
          <span className="hidden font-serif text-lg leading-none tracking-wide-lux sm:block">
            PRECISE FUMES
          </span>
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
          {links.map((l) => {
            const active = pathname === l.href
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  'group relative text-[0.72rem] uppercase tracking-wide-lux transition-colors',
                  active ? 'text-accent' : 'text-foreground/70 hover:text-foreground',
                )}
              >
                {l.label}
                <span
                  className={cn(
                    'absolute -bottom-1.5 left-0 h-px bg-accent transition-all duration-400',
                    active ? 'w-full' : 'w-0 group-hover:w-full',
                  )}
                />
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-foreground/15 text-foreground/70 md:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          'overflow-hidden border-t border-foreground/10 transition-all duration-500 md:hidden',
          open ? 'max-h-80 glass' : 'max-h-0',
        )}
      >
        <nav className="flex flex-col px-6 py-4">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                'border-b border-foreground/5 py-4 font-serif text-2xl tracking-wide-lux last:border-0',
                pathname === l.href ? 'text-accent' : 'text-foreground',
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
