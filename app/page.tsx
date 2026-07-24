import { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { Marquee } from "@/components/home/marquee";
import { Featured } from "@/components/home/featured";
import { Categories } from "@/components/home/categories";
import { Atelier } from "@/components/home/atelier";
import { Story } from "@/components/home/story";
import { CTA } from "@/components/home/cta";
import { getProducts } from "@/lib/products";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Precise Fumes — Luxury Perfumes for Pakistan",
  description:
    "Discover handcrafted, luxury fragrances crafted for the discerning. Rogue, Royal Oud, Bloom, Blossom, and Legacy — each a masterpiece. Free delivery in Karachi.",
  keywords:
    "luxury perfume, designer fragrance, Pakistani perfume, premium scents, Karachi",
  openGraph: {
    title: "Precise Fumes — Luxury Perfumes",
    description: "Handcrafted fragrances for the discerning.",
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
      <Featured products={products} />
      <Categories />
      <Atelier />
      <Story />
      <Marquee />
      <CTA />
    </>
  );
}
