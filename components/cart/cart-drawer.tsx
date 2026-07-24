"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/store/cart";
import { formatPrice } from "@/lib/utils";
import { useEffect, useState } from "react";

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    subtotal,
    getPromoInfo,
    getTesterInfo,
    total: getTotal,
  } = useCart();

  // Avoid SSR/hydration mismatch for persisted cart.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Lock body scroll while open.
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeCart();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeCart]);

  const subtotalAmount = mounted ? subtotal() : 0;
  const promo = mounted ? getPromoInfo() : { type: null, discountAmount: 0, description: "" };
  const tester = mounted
    ? getTesterInfo()
    : { allowance: 0, freeApplied: 0, unused: 0, discountAmount: 0, description: "" };
  const cartTotal = mounted ? getTotal() : 0;
  const lines = mounted ? items : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 z-[60] bg-[var(--pf-overlay)] backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={closeCart}
          />

          {/* Panel */}
          <motion.aside
            className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col bg-bg-elevated shadow-[var(--pf-shadow-lg)]"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <div className="flex items-center gap-3">
                <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
                <h2 className="font-serif text-xl">
                  Your Cart
                  {lines.length > 0 && (
                    <span className="ml-2 text-sm text-fg-faint">
                      ({lines.reduce((s, i) => s + i.quantity, 0)})
                    </span>
                  )}
                </h2>
              </div>
              <button
                onClick={closeCart}
                aria-label="Close cart"
                className="rounded-full p-2 text-fg-soft transition-colors hover:bg-bg-soft hover:text-fg"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>

            {/* Items */}
            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <ShoppingBag
                  className="h-12 w-12 text-fg-faint"
                  strokeWidth={1}
                />
                <p className="font-serif text-2xl">Your cart is empty</p>
                <p className="max-w-xs text-sm text-fg-soft">
                  Discover our collection of meticulously composed fragrances.
                </p>
                <Link
                  href="/shop"
                  onClick={closeCart}
                  className="btn-primary mt-2"
                >
                  Explore Shop
                </Link>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto px-6 py-4">
                <ul className="flex flex-col divide-y divide-border">
                  <AnimatePresence initial={false}>
                    {lines.map((item) => (
                      <motion.li
                        key={`${item.productId}-${item.size}`}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="flex gap-4 py-4"
                      >
                        {/* Image */}
                        <Link
                          href={`/shop/${item.slug}`}
                          onClick={closeCart}
                          className="relative h-24 w-20 shrink-0 overflow-hidden rounded-[var(--radius)] bg-bg-soft"
                        >
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="80px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-fg-faint">
                              <ShoppingBag
                                className="h-6 w-6"
                                strokeWidth={1}
                              />
                            </div>
                          )}
                        </Link>

                        {/* Details */}
                        <div className="flex flex-1 flex-col">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <Link
                                href={`/shop/${item.slug}`}
                                onClick={closeCart}
                                className="link-underline font-medium leading-snug"
                              >
                                {item.name}
                              </Link>
                              <p className="mt-0.5 text-xs uppercase tracking-wider text-fg-faint">
                                {item.size}
                              </p>
                            </div>
                            <button
                              onClick={() =>
                                removeItem(item.productId, item.size)
                              }
                              aria-label="Remove item"
                              className="text-fg-faint transition-colors hover:text-fg"
                            >
                              <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                            </button>
                          </div>

                          <div className="mt-auto flex items-center justify-between pt-3">
                            {/* Quantity stepper */}
                            <div className="flex items-center border border-border">
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.productId,
                                    item.size,
                                    item.quantity - 1
                                  )
                                }
                                aria-label="Decrease quantity"
                                className="flex h-8 w-8 items-center justify-center text-fg-soft transition-colors hover:bg-bg-soft hover:text-fg"
                              >
                                <Minus className="h-3.5 w-3.5" strokeWidth={2} />
                              </button>
                              <span className="w-8 text-center text-sm tabular-nums">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.productId,
                                    item.size,
                                    item.quantity + 1
                                  )
                                }
                                aria-label="Increase quantity"
                                className="flex h-8 w-8 items-center justify-center text-fg-soft transition-colors hover:bg-bg-soft hover:text-fg"
                              >
                                <Plus className="h-3.5 w-3.5" strokeWidth={2} />
                              </button>
                            </div>

                            <span className="text-sm tabular-nums">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              </div>
            )}

            {/* Footer */}
            {lines.length > 0 && (
              <div className="border-t border-border px-6 py-5">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm text-fg-soft">Subtotal</span>
                  <span className="font-serif text-lg tabular-nums">
                    {formatPrice(subtotalAmount)}
                  </span>
                </div>

                {promo.discountAmount > 0 && (
                  <div className="mb-2 flex items-center justify-between text-accent-deep">
                    <span className="text-xs">{promo.description}</span>
                    <span className="text-sm tabular-nums">
                      −{formatPrice(promo.discountAmount)}
                    </span>
                  </div>
                )}

                {tester.discountAmount > 0 && (
                  <div className="mb-2 flex items-center justify-between text-accent-deep">
                    <span className="text-xs">{tester.description}</span>
                    <span className="text-sm tabular-nums">
                      −{formatPrice(tester.discountAmount)}
                    </span>
                  </div>
                )}

                {tester.unused > 0 && (
                  <p className="mb-3 rounded-[var(--radius)] bg-accent/15 px-3 py-2 text-xs leading-relaxed text-accent-deep">
                    You have {tester.unused} free 5ml tester
                    {tester.unused === 1 ? "" : "s"} to claim — add one of a
                    scent you haven&apos;t bought from any product page.
                  </p>
                )}

                <div className="mb-4 flex items-center justify-between border-t border-border pt-2">
                  <span className="font-serif text-sm">Total</span>
                  <span className="font-serif text-lg tabular-nums">
                    {formatPrice(cartTotal)}
                  </span>
                </div>

                <p className="mb-4 text-xs text-fg-faint">
                  Shipping calculated at checkout.
                </p>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="btn-primary w-full"
                >
                  Proceed to Checkout
                </Link>
                <button
                  onClick={closeCart}
                  className="link-underline mx-auto mt-4 block text-xs uppercase tracking-wider text-fg-soft"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
