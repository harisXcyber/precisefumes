import { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { Marquee } from "@/components/home/marquee";
import { Assurance } from "@/components/home/assurance";
import { Featured } from "@/components/home/featured";
import { Categories } from "@/components/home/categories";
import { Atelier } from "@/components/home/atelier";
import { Story } from "@/components/home/story";
import { SeoContent } from "@/components/home/seo-content";
import { CTA } from "@/components/home/cta";
import { getProducts } from "@/lib/products";

export const revalidate = 3600;

export const metadata: Metadata = {
  title:
    "Buy Premium Perfumes Online in Pakistan | Free Delivery in Karachi — Precise Fumes",
  description:
    "Order premium long-lasting perfumes online in Pakistan. 5 signature Extrait de Parfum scents, 12–14 hour wear, PKR 3,000 each. Buy 2 get 1 free · 2 for PKR 5,000 · free 5ml tester · free delivery in Karachi · cash on delivery nationwide.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Precise Fumes — Premium Perfumes Online in Pakistan",
    description:
      "Premium long-lasting perfumes. Buy 2 get 1 free, free delivery in Karachi, cash on delivery nationwide.",
    type: "website",
    url: "https://precisefumes.com",
    siteName: "Precise Fumes",
  },
};

export default async function Home() {
  const all = await getProducts();
  const products = all.filter((p) => p.featured);
  const scents = all.map((p) => ({
    name: p.name,
    slug: p.slug,
    category: p.category,
    image: p.images?.[0] ?? "",
  }));

  return (
    <>
      <Hero scents={scents} />
      <Assurance />
      <Featured products={products} />
      <Categories />
      <Atelier />
      <Story />
      <Marquee />
      <SeoContent />
      <CTA />
    </>
  );
}
