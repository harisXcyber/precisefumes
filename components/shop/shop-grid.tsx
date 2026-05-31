"use client"

import { useMemo, useState } from "react"
import { products, scentFamilies, type Product, type ScentFamily } from "@/lib/products"
import { ProductCard } from "./product-card"
import { cn } from "@/lib/utils"

type SortKey = "default" | "price-asc" | "price-desc" | "name"

const sortOptions: { key: SortKey; label: string }[] = [
  { key: "default", label: "Curated" },
  { key: "price-asc", label: "Price: Low to High" },
  { key: "price-desc", label: "Price: High to Low" },
  { key: "name", label: "Alphabetical" },
]

export function ShopGrid() {
  const [activeFamily, setActiveFamily] = useState<ScentFamily | "All">("All")
  const [sort, setSort] = useState<SortKey>("default")

  const filtered = useMemo(() => {
    const list: Product[] =
      activeFamily === "All" ? [...products] : products.filter((p) => p.family === activeFamily)

    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        list.sort((a, b) => b.price - a.price)
        break
      case "name":
        list.sort((a, b) => a.name.localeCompare(b.name))
        break
      default:
        break
    }
    return list
  }, [activeFamily, sort])

  const families: (ScentFamily | "All")[] = ["All", ...scentFamilies]

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-6 border-b border-foreground/10 pb-6 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-wrap gap-2">
          {families.map((fam) => (
            <button
              key={fam}
              onClick={() => setActiveFamily(fam)}
              className={cn(
                "rounded-full border px-4 py-2 text-[0.7rem] uppercase tracking-wide-lux transition-colors duration-300",
                activeFamily === fam
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-foreground/15 text-foreground/55 hover:border-accent/60 hover:text-foreground",
              )}
            >
              {fam}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[0.7rem] uppercase tracking-wide-lux text-foreground/45">Sort</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-full border border-foreground/15 bg-transparent px-4 py-2 text-[0.7rem] uppercase tracking-wide-lux text-foreground outline-none transition-colors hover:border-accent/60 focus:border-accent"
          >
            {sortOptions.map((opt) => (
              <option key={opt.key} value={opt.key} className="bg-background text-foreground">
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-20 text-center text-foreground/50">No fragrances in this family yet.</p>
      )}
    </div>
  )
}
