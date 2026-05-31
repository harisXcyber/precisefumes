import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/cart/cart-drawer";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://precisefumes.com"),
  title: {
    default: "Precise Fumes — Luxury Fragrances",
    template: "%s · Precise Fumes",
  },
  description:
    "Precise Fumes — meticulously composed luxury perfumes. Discover signature scents crafted with precision and character.",
  keywords: [
    "perfume",
    "luxury fragrance",
    "Precise Fumes",
    "eau de parfum",
    "signature scent",
    "Pakistan perfume",
  ],
  openGraph: {
    title: "Precise Fumes — Luxury Fragrances",
    description:
      "Meticulously composed luxury perfumes. Discover your signature scent.",
    url: "https://precisefumes.com",
    siteName: "Precise Fumes",
    type: "website",
    images: [{ url: "/logo-dark.png", width: 1080, height: 1080 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Precise Fumes — Luxury Fragrances",
    description: "Meticulously composed luxury perfumes.",
    images: ["/logo-dark.png"],
  },
  icons: {
    icon: "/logo-dark.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${cormorant.variable} ${inter.variable} antialiased bg-bg text-fg`}
      >
        <ThemeProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <CartDrawer />
        </ThemeProvider>
      </body>
    </html>
  );
}
