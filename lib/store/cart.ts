"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types";

interface PromoInfo {
  type: "bundle" | "free-item" | null;
  discountAmount: number;
  description: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;

  // mutations
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;

  // drawer
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  // derived
  itemCount: () => number;
  subtotal: () => number;
  getPromoInfo: () => PromoInfo;
  total: () => number;
}

/** A cart line is uniquely identified by productId + size. */
const sameLine = (a: CartItem, productId: string, size: string) =>
  a.productId === productId && a.size === size;

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) =>
            sameLine(i, item.productId, item.size)
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                sameLine(i, item.productId, item.size)
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
              isOpen: true,
            };
          }
          return { items: [...state.items, item], isOpen: true };
        }),

      removeItem: (productId, size) =>
        set((state) => ({
          items: state.items.filter((i) => !sameLine(i, productId, size)),
        })),

      updateQuantity: (productId, size, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => !sameLine(i, productId, size))
              : state.items.map((i) =>
                  sameLine(i, productId, size) ? { ...i, quantity } : i
                ),
        })),

      clearCart: () => set({ items: [] }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      itemCount: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      getPromoInfo: () => {
        const items = get().items;
        if (items.length === 0) {
          return { type: null, discountAmount: 0, description: "" };
        }

        // Expand cart lines into individual bottle prices.
        const unitPrices = items
          .flatMap((i) => Array(i.quantity).fill(i.price) as number[])
          .sort((a, b) => a - b);
        const totalQuantity = unitPrices.length;

        const BASE_PRICE = 3000;
        const BUNDLE_TOTAL = 5000;

        // Buy 2 Get 1 Free: for every 3 bottles, the cheapest is free.
        if (totalQuantity >= 3) {
          const freeCount = Math.floor(totalQuantity / 3);
          const discount = unitPrices
            .slice(0, freeCount)
            .reduce((sum, p) => sum + p, 0);
          return {
            type: "free-item",
            discountAmount: discount,
            description:
              freeCount === 1
                ? "Buy 2 Get 1 Free — 1 bottle free"
                : `Buy 2 Get 1 Free — ${freeCount} bottles free`,
          };
        }

        // Bundle: exactly 2 standard (PKR 3,000) bottles for PKR 5,000.
        if (
          totalQuantity === 2 &&
          unitPrices.every((p) => p === BASE_PRICE)
        ) {
          return {
            type: "bundle",
            discountAmount: BASE_PRICE * 2 - BUNDLE_TOTAL,
            description: "Bundle — any 2 for PKR 5,000",
          };
        }

        return { type: null, discountAmount: 0, description: "" };
      },
      total: () => {
        const subtotal = get().subtotal();
        const promo = get().getPromoInfo();
        return Math.max(0, subtotal - promo.discountAmount);
      },
    }),
    {
      name: "pf-cart",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
