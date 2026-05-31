import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getProduct, getRelatedProducts, getProducts } from "@/lib/products";
import { ProductDetail } from "@/components/shop/product-detail";
import { ProductCard } from "@/components/shop/product-card";
import { Reveal } from "@/components/ui/reveal";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
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
    <div className="pt-28">
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
      <section className="container-lux py-10 md:py-14">
        <ProductDetail product={product} />
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="container-lux py-20 md:py-28">
          <Reveal className="mb-12 text-center">
            <p className="tracking-luxe text-xs text-accent">
              You May Also Like
            </p>
            <h2 className="mt-4 font-serif text-3xl font-light md:text-4xl">
              Complete the Collection
            </h2>
          </Reveal>
          <div className="grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
