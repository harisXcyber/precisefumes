"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import type { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/lib/store/cart";
import { getScentTone } from "@/lib/tones";

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCart((s) => s.addItem);
  const [hovered, setHovered] = useState(false);

  const primaryImage = product.images?.[0] ?? "/logo-light.png";
  const onSale =
    product.compareAtPrice && product.compareAtPrice > product.price;
  const tone = getScentTone(product.slug);

  const quickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const size = product.sizes[0];
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: primaryImage,
      size: size?.label ?? "One size",
      price: size?.price ?? product.price,
      quantity: 1,
    });
  };

  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image on scent-toned backdrop */}
      <div
        className="img-zoom pf-card relative aspect-[3/4] overflow-hidden"
        style={{
          background: tone.gradient,
          boxShadow: hovered ? `0 22px 44px -12px ${tone.glow}` : undefined,
        }}
      >
        <Image
          src={primaryImage}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
          className="object-contain p-6"
        />

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {onSale && (
            <span className="rounded-full bg-accent px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-on-accent">
              Sale
            </span>
          )}
          {product.stock <= 5 && product.stock > 0 && (
            <span className="rounded-full bg-fg px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-bg">
              Low Stock
            </span>
          )}
          {product.stock === 0 && (
            <span className="rounded-full bg-fg-faint px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-bg">
              Sold Out
            </span>
          )}
        </div>

        {/* Quick add — slides up on hover (desktop) */}
        {product.stock > 0 && (
          <button
            onClick={quickAdd}
            className="absolute inset-x-3 bottom-3 flex translate-y-[calc(100%+0.75rem)] items-center justify-center gap-2 rounded-full bg-fg py-3 text-[11px] uppercase tracking-[0.18em] text-bg opacity-0 transition-all duration-400 ease-[var(--ease-lux)] group-hover:translate-y-0 group-hover:opacity-100"
          >
            <ShoppingBag className="h-3.5 w-3.5" strokeWidth={1.5} />
            Quick Add
          </button>
        )}
      </div>

      {/* Info */}
      <div className="mt-4 text-center">
        <p className="tracking-luxe text-[10px] text-fg-faint">
          {product.category === "Him"
            ? "For Him"
            : product.category === "Her"
              ? "For Her"
              : product.category}
        </p>
        <h3 className="mt-1.5 font-serif text-lg leading-snug transition-colors group-hover:text-accent">
          {product.name}
        </h3>
        <div className="mt-1 flex items-center justify-center gap-2 text-sm">
          <span className="tabular-nums text-fg">
            {formatPrice(product.price)}
          </span>
          {onSale && (
            <span className="tabular-nums text-fg-faint line-through">
              {formatPrice(product.compareAtPrice!)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
