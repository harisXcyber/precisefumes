import type React from 'react'
import type { Metadata } from 'next'
import { Geist, Geist_Mono, Cormorant_Garamond } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { SiteHeader } from '@/components/site/site-header'
import { SiteFooter } from '@/components/site/site-footer'
import { SmoothScroll } from '@/components/site/smooth-scroll'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
})

export const metadata: Metadata = {
  title: {
    default: 'Precise Fumes — Elegant scents with a precise touch',
    template: '%s · Precise Fumes',
  },
  description:
    'Precise Fumes is a refined fragrance house crafting elegant scents with a precise touch. Discover a luxury collection of perfumes built around precision, elegance, and sensory detail.',
  keywords: [
    'Precise Fumes',
    'luxury perfume',
    'niche fragrance',
    'oud',
    'amber',
    'floral perfume',
    'designer scent',
  ],
  generator: 'v0.app',
  openGraph: {
    title: 'Precise Fumes — Elegant scents with a precise touch',
    description:
      'A refined fragrance house crafting elegant scents with a precise touch.',
    type: 'website',
    siteName: 'Precise Fumes',
  },
  icons: {
    icon: '/logo-white.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geist.variable} ${geistMono.variable} ${cormorant.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <SmoothScroll />
          <SiteHeader />
          <main className="min-h-screen">{children}</main>
          <SiteFooter />
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
