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
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
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
    icon: "/favicon.png",
    apple: "/apple-icon.png",
  },
  verification: {
    google: "iwxBtefqafjy1n6eWU0uh70CSWYuKagMlfdC0jOk_WQ",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Precise Fumes",
    url: "https://precisefumes.com",
    logo: "https://precisefumes.com/logo-dark.png",
    description: "Meticulously composed luxury perfumes for Pakistan",
    email: "contact@precisefumes.com",
    sameAs: [
      "https://instagram.com/precisefumes",
      "https://facebook.com/precisefumes",
      "https://twitter.com/precisefumes",
    ],
    areaServed: {
      "@type": "Country",
      name: "PK",
    },
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Precise Fumes",
    image: "https://precisefumes.com/logo-dark.png",
    description: "Luxury fragrance store",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Karachi",
      addressCountry: "PK",
    },
    telephone: "+92 300 1234567",
    email: "contact@precisefumes.com",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "10:00",
        closes: "19:00",
      },
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google tag (gtag.js) — plain script tags in <head> so
            Google's tag detection finds the snippet in the HTML */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-PVF8HGRXF8"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-PVF8HGRXF8');`,
          }}
        />
        {/* Set theme before first paint to avoid a flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("pf-theme")||(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");var d=document.documentElement;d.setAttribute("data-pf-theme",t);if(t==="dark")d.classList.add("dark");}catch(e){}})();`,
          }}
        />
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema),
          }}
        />
      </head>
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
