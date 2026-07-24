"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, ShoppingBag, Check } from "lucide-react";
import type { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/lib/store/cart";
import { getScentTone } from "@/lib/tones";
import { TesterPicker, type TesterOption } from "@/components/shop/tester-picker";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { waLink } from "@/lib/contact";

export function ProductDetail({
  product,
  testerOptions = [],
}: {
  product: Product;
  testerOptions?: TesterOption[];
}) {
  const addItem = useCart((s) => s.addItem);

  const [activeImage, setActiveImage] = useState(0);
  const [sizeIdx, setSizeIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const selectedSize = product.sizes[sizeIdx] ?? {
    label: "One size",
    price: product.price,
    stock: product.stock,
  };
  const images = product.images?.length ? product.images : ["/logo-light.png"];
  const tone = getScentTone(product.slug);
  const inStock = selectedSize.stock > 0;
  const onSale =
    product.compareAtPrice && product.compareAtPrice > selectedSize.price;

  const handleAdd = () => {
    if (!inStock) return;
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: images[0],
      size: selectedSize.label,
      price: selectedSize.price,
      quantity: qty,
      kind: "perfume",
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
      {/* Gallery */}
      <div className="flex flex-col gap-4">
        <div
          className="relative aspect-square overflow-hidden rounded-[var(--radius-lg)]"
          style={{ background: tone.gradient }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0"
            >
              <Image
                src={images[activeImage]}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-3">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`relative h-20 w-20 overflow-hidden rounded-[var(--radius)] bg-bg-soft transition-all ${
                  activeImage === i
                    ? "ring-2 ring-fg ring-offset-2 ring-offset-bg"
                    : "opacity-60 hover:opacity-100"
                }`}
              >
                <Image
                  src={img}
                  alt={`${product.name} ${i + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col">
        <p className="tracking-luxe text-xs text-accent">
          {product.category === "Him"
            ? "For Him"
            : product.category === "Her"
              ? "For Her"
              : product.category}
        </p>
        <h1 className="mt-3 font-serif text-4xl font-normal md:text-5xl">
          {product.name}
        </h1>
        {product.tagline && (
          <p className="mt-2 font-serif text-lg italic text-fg-soft">
            {product.tagline}
          </p>
        )}

        {/* Price */}
        <div className="mt-6 flex items-center gap-3">
          <span className="font-serif text-3xl tabular-nums">
            {formatPrice(selectedSize.price)}
          </span>
          {onSale && (
            <span className="text-lg tabular-nums text-fg-faint line-through">
              {formatPrice(product.compareAtPrice!)}
            </span>
          )}
        </div>

        <div className="hairline my-8" />

        {/* Description */}
        <p className="leading-relaxed text-fg-soft">{product.description}</p>

        {/* Sizes */}
        {product.sizes.length > 0 && (
          <div className="mt-8">
            <p className="mb-3 text-xs uppercase tracking-[0.16em] text-fg-faint">
              Size
            </p>
            <div className="flex flex-wrap gap-3">
              {product.sizes.map((size, i) => (
                <button
                  key={size.label}
                  onClick={() => setSizeIdx(i)}
                  disabled={size.stock === 0}
                  className={`min-w-20 rounded-full border px-5 py-3 text-sm transition-all ${
                    sizeIdx === i
                      ? "border-fg bg-fg text-bg"
                      : "border-border text-fg hover:border-fg-soft"
                  } ${
                    size.stock === 0
                      ? "cursor-not-allowed opacity-40 line-through"
                      : ""
                  }`}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity + Add */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-stretch">
          <div className="flex items-center overflow-hidden rounded-full border border-border">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              aria-label="Decrease quantity"
              className="flex h-full w-12 items-center justify-center text-fg-soft transition-colors hover:bg-bg-soft hover:text-fg"
            >
              <Minus className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <span className="w-12 text-center tabular-nums">{qty}</span>
            <button
              onClick={() => setQty((q) => q + 1)}
              aria-label="Increase quantity"
              className="flex h-full w-12 items-center justify-center text-fg-soft transition-colors hover:bg-bg-soft hover:text-fg"
            >
              <Plus className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>

          <button
            onClick={handleAdd}
            disabled={!inStock}
            className="btn-primary flex-1"
          >
            <AnimatePresence mode="wait" initial={false}>
              {added ? (
                <motion.span
                  key="added"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex items-center gap-2"
                >
                  <Check className="h-4 w-4" strokeWidth={2} /> Added to Cart
                </motion.span>
              ) : (
                <motion.span
                  key="add"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex items-center gap-2"
                >
                  <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
                  {inStock ? "Add to Cart" : "Sold Out"}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* Order on WhatsApp — primary contact channel */}
        <a
          href={waLink(
            `Hi Precise Fumes! I'd like to order ${product.name} (${selectedSize.label}, ${formatPrice(
              selectedSize.price
            )}).`
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-[#25D366] py-3.5 text-sm font-medium text-[#1a8a4a] transition-colors hover:bg-[#25D366] hover:text-white"
        >
          <WhatsAppIcon className="h-5 w-5" />
          Order on WhatsApp
        </a>

        {inStock && selectedSize.stock <= 5 && (
          <p className="mt-3 text-xs text-accent">
            Only {selectedSize.stock} left in stock — order soon.
          </p>
        )}

        {/* Testers */}
        {testerOptions.length > 0 && (
          <div className="mt-10 rounded-[var(--radius-lg)] border border-border bg-bg-soft p-6 md:p-7">
            <TesterPicker
              options={testerOptions}
              currentSlug={product.slug}
            />
          </div>
        )}

        {/* Offers — always crystal clear */}
        <div className="mt-10 space-y-2.5 rounded-[var(--radius-lg)] border border-border bg-bg-soft p-6 md:p-7 text-sm">
          <p className="pf-eyebrow">Offers on this fragrance</p>
          <p className="text-fg-soft">
            <strong className="text-fg">Any 2 for PKR 5,000</strong> — pair it
            with any other scent and save PKR 1,000.
          </p>
          <p className="text-fg-soft">
            <strong className="text-fg">Buy 3 Get 1 Free</strong> — four perfumes
            for{" "}
            <span className="text-fg-faint line-through">PKR 12,000</span>{" "}
            <strong className="text-accent-deep">PKR 9,000</strong>.
          </p>
          <p className="text-fg-soft">
            <strong className="text-fg">Launch bonus — save up to PKR 500</strong>{" "}
            — apply an affiliate bonus code at checkout and single perfumes
            drop to PKR 2,500.
          </p>
          <p className="text-fg-soft">
            <strong className="text-fg">Free 5ml tester</strong> — every bottle
            comes with a tester of another scent. Extra testers PKR 200.
          </p>
          <p className="text-fg-soft">
            <strong className="text-fg">Full money-back guarantee</strong> — if
            anything's wrong on our side, we refund you in full or replace it
            free.
          </p>
          <p className="text-fg-soft">
            <strong className="text-fg">Free premium gift bag</strong> — every
            bottle arrives gift-wrapped, ready to give.
          </p>
          <p className="pt-1 text-xs text-fg-faint">
            Premium Extrait de Parfum · 12–14 hours · Free delivery in Karachi
            (2–5 days) · Nationwide PKR 300 (5–7 days) · Cash on Delivery
          </p>
        </div>

        {/* Craft detail */}
        {(product.concentration || product.longevity) && (
          <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-3 text-sm">
            {product.concentration && (
              <div>
                <dt className="pf-eyebrow">Concentration</dt>
                <dd className="mt-1 text-fg-soft">{product.concentration}</dd>
              </div>
            )}
            {product.longevity && (
              <div>
                <dt className="pf-eyebrow">Longevity</dt>
                <dd className="mt-1 text-fg-soft">{product.longevity}</dd>
              </div>
            )}
          </dl>
        )}

        {/* Notes pyramid */}
        {product.notes && (
          <div className="mt-12">
            <div className="hairline mb-8" />
            <p className="mb-6 text-xs uppercase tracking-[0.16em] text-fg-faint">
              Olfactory Notes
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {(
                [
                  ["Top", product.notes.top],
                  ["Heart", product.notes.heart],
                  ["Base", product.notes.base],
                ] as const
              ).map(([label, notes]) => (
                <div key={label}>
                  <h4 className="font-serif text-lg text-accent">{label}</h4>
                  <ul className="mt-2 space-y-1 text-sm text-fg-soft">
                    {notes.map((n) => (
                      <li key={n}>{n}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
