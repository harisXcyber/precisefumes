import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getProduct, getRelatedProducts } from "@/lib/products";
import { MOCK_PRODUCTS } from "@/lib/mock-data";
import { ProductDetail } from "@/components/shop/product-detail";
import { ProductCard } from "@/components/shop/product-card";
import { Reveal } from "@/components/ui/reveal";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/** Pre-render every catalog product at build time — instant loads.
 *  Uses the static catalog directly so no request-scoped APIs run. */
export function generateStaticParams() {
  return MOCK_PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Not Found" };
  return {
    title: product.name,
    description: product.tagline ?? product.description.slice(0, 150),
    openGraph: {
      title: `${product.name} · Precise Fumes`,
      description: product.tagline ?? product.description.slice(0, 150),
      images: product.images?.length ? [product.images[0]] : undefined,
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product);

  return (
    <div className="pt-32 md:pt-36">
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
        <ProductDetail product={product} />
      </Reveal>

      {/* Related */}
      {related.length > 0 && (
        <section className="container-lux mt-24 border-t border-border pt-16">
          <h2 className="font-serif text-3xl font-light mb-12">
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
