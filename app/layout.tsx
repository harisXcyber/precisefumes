import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import {
  KEYWORDS,
  organizationLd,
  storeLd,
  websiteLd,
} from "@/lib/seo";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteChrome } from "@/components/layout/site-chrome";

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
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://precisefumes.com"),
  title: {
    default:
      "Precise Fumes — Buy Premium Perfumes Online in Pakistan | Free Karachi Delivery",
    template: "%s · Precise Fumes",
  },
  description:
    "Buy premium long-lasting perfumes online in Pakistan. Extrait de Parfum, 12–14 hour wear, free 5ml tester in every order. Buy 2 get 1 free · 2 for PKR 5,000 · free delivery in Karachi · cash on delivery nationwide.",
  keywords: KEYWORDS,
  alternates: { canonical: "/" },
  openGraph: {
    title:
      "Precise Fumes — Premium Perfumes Online in Pakistan | Free Karachi Delivery",
    description:
      "Premium Extrait de Parfum, 12–14 hour wear. Buy 2 get 1 free, 2 for PKR 5,000, free 5ml tester. Free delivery in Karachi, cash on delivery across Pakistan.",
    url: "https://precisefumes.com",
    siteName: "Precise Fumes",
    locale: "en_PK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Precise Fumes — Premium Perfumes Online in Pakistan",
    description:
      "Premium long-lasting perfumes. Buy 2 get 1 free, free delivery in Karachi, cash on delivery nationwide.",
  },
  icons: {
    icon: "/favicon.png",
    apple: "/apple-icon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
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
            __html: `(function(){try{var t=localStorage.getItem("pf-theme")||"light";var d=document.documentElement;d.setAttribute("data-pf-theme",t);if(t==="dark")d.classList.add("dark");}catch(e){}})();`,
          }}
        />
        {/* JSON-LD: Organization + Store + WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(storeLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd()) }}
        />
      </head>
      <body
        className={`${cormorant.variable} ${inter.variable} antialiased bg-bg text-fg`}
      >
        <ThemeProvider>
          <SiteChrome>{children}</SiteChrome>
        </ThemeProvider>
      </body>
    </html>
  );
}
