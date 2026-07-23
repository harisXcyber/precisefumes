"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { Product } from "@/types";
import { ProductCard } from "@/components/shop/product-card";

const CATEGORIES = ["All", "Him", "Her"] as const;
type SortKey = "featured" | "price-asc" | "price-desc" | "name";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "featured", label: "Featured" },
  { key: "price-asc", label: "Price: Low to High" },
  { key: "price-desc", label: "Price: High to Low" },
  { key: "name", label: "Alphabetical" },
];

export function ShopGrid({ products }: { products: Product[] }) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") ?? "All";

  const [category, setCategory] = useState<string>(initialCategory);
  const [sort, setSort] = useState<SortKey>("featured");

  // Sync when navbar links change ?category=
  useEffect(() => {
    setCategory(searchParams.get("category") ?? "All");
  }, [searchParams]);

  const filtered = useMemo(() => {
    let list =
      category === "All"
        ? [...products]
        : products.filter((p) => p.category === category);

    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "name":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        list.sort((a, b) => Number(b.featured) - Number(a.featured));
    }
    return list;
  }, [products, category, sort]);

  return (
    <div>
      {/* Toolbar */}
      <div className="mb-10 flex flex-col gap-5 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
        {/* Category filters */}
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`relative px-4 py-2 text-xs uppercase tracking-[0.16em] transition-colors ${
                category === cat
                  ? "text-fg"
                  : "text-fg-faint hover:text-fg-soft"
              }`}
            >
              {cat === "Him" ? "For Him" : cat === "Her" ? "For Her" : cat}
              {category === cat && (
                <motion.span
                  layoutId="cat-underline"
                  className="absolute inset-x-3 -bottom-px h-px bg-accent"
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-wider text-fg-faint">
            Sort
          </span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="cursor-pointer border border-border bg-bg px-3 py-2 text-xs uppercase tracking-wider text-fg outline-none transition-colors hover:border-fg-soft focus:border-fg"
          >
            {SORTS.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Count */}
      <p className="mb-8 text-xs uppercase tracking-wider text-fg-faint">
        {filtered.length}{" "}
        {filtered.length === 1 ? "fragrance" : "fragrances"}
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="py-20 text-center text-fg-soft">
          No fragrances found in this category.
        </p>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 lg:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
