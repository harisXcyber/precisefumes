import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
  getProduct,
  getRelatedProducts,
  getProductSlugs,
  getProducts,
} from "@/lib/products";
import { ProductDetail } from "@/components/shop/product-detail";
import { ProductCard } from "@/components/shop/product-card";
import { Reveal } from "@/components/ui/reveal";
import { productLd, breadcrumbLd } from "@/lib/seo";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/** Revalidate hourly so admin edits reach the storefront without
 *  a redeploy, while pages stay static and instant. */
export const revalidate = 3600;

/** Pre-render every catalog product at build time. */
export async function generateStaticParams() {
  const slugs = await getProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Not Found" };

  const gender = product.category === "Her" ? "Women's" : "Men's";
  const title = `${product.name} Perfume — ${gender} Extrait de Parfum, PKR ${product.price.toLocaleString()}`;
  const description = `Buy ${product.name}, a premium ${gender.toLowerCase()} perfume by Precise Fumes. ${product.tagline ?? ""} 50ml Extrait de Parfum, 12–14 hour wear, PKR ${product.price.toLocaleString()}. Free 5ml tester, buy 3 get 1 free, free delivery in Karachi, cash on delivery across Pakistan.`.trim();

  return {
    title,
    description,
    keywords: [
      `${product.name} perfume`,
      `${product.name} Precise Fumes`,
      `${gender.toLowerCase()} perfume Pakistan`,
      "buy perfume online Pakistan",
      "free delivery Karachi",
      "cash on delivery perfume",
    ],
    alternates: { canonical: `/shop/${product.slug}` },
    openGraph: {
      title,
      description,
      url: `https://precisefumes.com/shop/${product.slug}`,
      type: "website",
      images: product.images?.length
        ? [{ url: product.images[0], width: 1400, height: 1400 }]
        : undefined,
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product);
  const all = await getProducts();
  const testerOptions = all.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    image: p.images?.[0] ?? "",
  }));

  const ld = productLd({
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price,
    image: product.images?.[0],
    category: product.category,
    inStock: product.stock > 0,
  });
  const crumbs = breadcrumbLd([
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: product.name, path: `/shop/${product.slug}` },
  ]);

  return (
    <div className="pt-32 md:pt-36">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }}
      />
      {/* Breadcrumb */}
      <div className="container-lux">
        <nav className="flex items-center gap-2 text-xs uppercase tracking-wider text-fg-faint">
          <Link href="/" className="transition-colors hover:text-fg">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" strokeWidth={1.5} />
          <Link href="/shop" className="transition-colors hover:text-fg">
            Shop
          </Link>
          <ChevronRight className="h-3 w-3" strokeWidth={1.5} />
          <span className="text-fg">{product.name}</span>
        </nav>
      </div>

      {/* Detail */}
      <Reveal className="mt-8">
        <ProductDetail product={product} testerOptions={testerOptions} />
      </Reveal>

      {/* Related */}
      {related.length > 0 && (
        <section className="container-lux mt-24 border-t border-border pt-16">
          <h2 className="font-serif text-3xl font-normal mb-12">
            You May Also Like
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
