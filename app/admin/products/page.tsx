import Link from "next/link";
import Image from "next/image";
import { fetchProducts } from "@/lib/admin-data";
import { formatPrice } from "@/lib/utils";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function AdminProducts() {
  const products = (await fetchProducts()) as any[];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-normal md:text-4xl">
            Products
          </h1>
          <p className="mt-2 text-sm text-fg-soft">
            {products.length} in the catalog. Edit anything — name, price,
            category, notes, images.
          </p>
        </div>
        <Link href="/admin/products/new" className="btn-primary">
          + New product
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => {
          const img = Array.isArray(p.images) && p.images.length ? p.images[0] : null;
          return (
            <Link
              key={p.id}
              href={`/admin/products/${p.id}`}
              className="group overflow-hidden rounded-[var(--radius-lg)] border border-border bg-bg-soft transition-colors hover:border-accent"
            >
              <div className="relative aspect-[4/3] bg-bg">
                {img ? (
                  <Image
                    src={img}
                    alt={p.name}
                    fill
                    sizes="300px"
                    className="object-contain p-4"
                    unoptimized
                  />
                ) : (
                  <span className="flex h-full items-center justify-center text-xs text-fg-faint">
                    No image yet
                  </span>
                )}
                {!p.active && (
                  <span className="absolute left-3 top-3 rounded-full bg-fg px-3 py-1 text-[10px] uppercase tracking-wider text-bg">
                    Hidden
                  </span>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-serif text-lg">{p.name}</p>
                    <p className="text-xs text-fg-soft">
                      {p.category === "Her" ? "For Her" : "For Him"} ·{" "}
                      {Array.isArray(p.images) ? p.images.length : 0} image
                      {(Array.isArray(p.images) ? p.images.length : 0) === 1
                        ? ""
                        : "s"}
                    </p>
                  </div>
                  <p className="tabular-nums text-sm">{formatPrice(p.price)}</p>
                </div>
                {p.featured && (
                  <span className="mt-3 inline-block rounded-full bg-accent/20 px-3 py-1 text-[10px] uppercase tracking-wider text-accent-deep">
                    Featured
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
