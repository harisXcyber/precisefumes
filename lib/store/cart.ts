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

        const uniqueProducts = new Set(items.map((i) => i.slug)).size;
        const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0);
        const subtotal = get().subtotal();

        // Buy 2 Get 1 Free: 3 different items/scents
        if (uniqueProducts >= 3) {
          // Find the cheapest item across all items
          const cheapestPrice = Math.min(...items.map((i) => i.price));
          const freeItemSavings = cheapestPrice;

          return {
            type: "free-item",
            discountAmount: freeItemSavings,
            description: "Buy 2 Get 1 Free applied",
          };
        }

        // Bundle of 2 for PKR 5,000: exactly 2 items of different scents
        if (uniqueProducts === 2 && totalQuantity >= 2) {
          const bundlePrice = 5000;
          const discount = Math.max(0, subtotal - bundlePrice);

          if (discount > 0) {
            return {
              type: "bundle",
              discountAmount: discount,
              description: "Bundle of 2 for PKR 5,000 applied",
            };
          }
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
