import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchProductById } from "@/lib/admin-data";
import { ProductForm } from "@/components/admin/product-form";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function EditProduct({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const p = (await fetchProductById(id)) as any;
  if (!p) notFound();

  const initial = {
    id: p.id,
    slug: p.slug ?? "",
    name: p.name ?? "",
    tagline: p.tagline ?? "",
    description: p.description ?? "",
    category: (p.category === "Her" ? "Her" : "Him") as "Him" | "Her",
    price: Number(p.price ?? 3000),
    compareAtPrice: (p.compare_at_price ?? "") as number | "",
    sizes: Array.isArray(p.sizes) && p.sizes.length
      ? p.sizes
      : [{ label: "50ml", price: Number(p.price ?? 3000), stock: 999 }],
    notes: {
      top: p.notes?.top ?? [],
      heart: p.notes?.heart ?? [],
      base: p.notes?.base ?? [],
    },
    images: Array.isArray(p.images) ? p.images : [],
    concentration: p.concentration ?? "",
    longevity: p.longevity ?? "",
    stock: Number(p.stock ?? 999),
    featured: !!p.featured,
    active: p.active !== false,
    sortOrder: Number(p.sort_order ?? 99),
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            href="/admin/products"
            className="text-xs uppercase tracking-[0.14em] text-fg-soft hover:text-fg"
          >
            ← Products
          </Link>
          <h1 className="mt-3 font-serif text-3xl font-normal md:text-4xl">
            {p.name}
          </h1>
        </div>
        <Link
          href={`/shop/${p.slug}`}
          target="_blank"
          className="text-xs uppercase tracking-[0.14em] text-accent-deep hover:underline"
        >
          View on site ↗
        </Link>
      </div>
      <ProductForm initial={initial} isNew={false} />
    </div>
  );
}
