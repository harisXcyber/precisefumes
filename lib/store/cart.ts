"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types";

export const TESTER_PRICE = 200;
const BASE_PRICE = 3000;
const BUNDLE_2_TOTAL = 5000; // any 2 for PKR 5,000
const PACK_4_TOTAL = 9000; // Buy 3 Get 1 Free — 4 perfumes for PKR 9,000
export const PACK_4_COMPARE = 12000; // struck-through anchor (4 x 3,000)

interface PromoInfo {
  type: "bundle" | "pack4" | null;
  discountAmount: number;
  description: string;
}

interface TesterInfo {
  /** How many free testers the cart has earned (1 per perfume). */
  allowance: number;
  /** How many of those are actually being used right now. */
  freeApplied: number;
  /** Free testers still unclaimed — drives the "pick your free tester" nudge. */
  unused: number;
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
  perfumeItems: () => CartItem[];
  testerItems: () => CartItem[];
  getPromoInfo: () => PromoInfo;
  getTesterInfo: () => TesterInfo;
  total: () => number;
}

/** A cart line is uniquely identified by productId + size, so a scent's
 *  50ml bottle and its 5ml tester are separate lines. */
const sameLine = (a: CartItem, productId: string, size: string) =>
  a.productId === productId && a.size === size;

const isTester = (i: CartItem) => i.kind === "tester";

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

      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      perfumeItems: () => get().items.filter((i) => !isTester(i)),
      testerItems: () => get().items.filter(isTester),

      /** Bottle offers (all perfumes are PKR 3,000). Testers never count.
       *  Ladder: any 2 → PKR 5,000; Buy 3 Get 1 Free → 4 perfumes for
       *  PKR 9,000. Larger carts stack whole 4-packs, then apply the
       *  best remainder pricing. */
      getPromoInfo: () => {
        const perfumes = get().perfumeItems();
        const qty = perfumes.reduce((sum, i) => sum + i.quantity, 0);
        if (qty === 0) {
          return { type: null, discountAmount: 0, description: "" };
        }
        const subtotal = perfumes.reduce(
          (sum, i) => sum + i.price * i.quantity,
          0
        );

        const packs = Math.floor(qty / 4);
        const rem = qty % 4;

        // Best price for the leftover 1–3 bottles.
        let remPrice = 0;
        if (rem === 1) remPrice = BASE_PRICE;
        else if (rem === 2) remPrice = BUNDLE_2_TOTAL;
        else if (rem === 3) remPrice = BUNDLE_2_TOTAL + BASE_PRICE; // 8,000

        const promoTotal = packs * PACK_4_TOTAL + remPrice;
        const discount = Math.max(0, subtotal - promoTotal);
        if (discount <= 0) {
          return { type: null, discountAmount: 0, description: "" };
        }

        let type: PromoInfo["type"] = "bundle";
        let description = "Bundle savings applied";
        if (packs >= 1) {
          type = "pack4";
          description =
            packs === 1
              ? "Buy 3 Get 1 Free — 4 perfumes for PKR 9,000"
              : `Buy 3 Get 1 Free ×${packs}`;
        } else if (rem === 2) {
          description = "Bundle — any 2 for PKR 5,000";
        }

        return { type, discountAmount: discount, description };
      },

      /** Every bottle earns one free 5ml tester, and it has to be a scent
       *  you didn't just buy. Extra testers — including of the scent you
       *  bought — stay at PKR 200 each. */
      getTesterInfo: () => {
        const perfumes = get().perfumeItems();
        const testers = get().testerItems();

        const allowance = perfumes.reduce((sum, i) => sum + i.quantity, 0);
        const purchasedSlugs = new Set(perfumes.map((i) => i.slug));

        const eligibleUnits = testers
          .filter((t) => !purchasedSlugs.has(t.slug))
          .reduce((sum, t) => sum + t.quantity, 0);

        const freeApplied = Math.min(allowance, eligibleUnits);
        const unused = Math.max(0, allowance - freeApplied);

        return {
          allowance,
          freeApplied,
          unused,
          discountAmount: freeApplied * TESTER_PRICE,
          description:
            freeApplied === 1
              ? "Free tester with your perfume"
              : `${freeApplied} free testers with your perfumes`,
        };
      },

      total: () => {
        const subtotal = get().subtotal();
        const promo = get().getPromoInfo();
        const testers = get().getTesterInfo();
        return Math.max(
          0,
          subtotal - promo.discountAmount - testers.discountAmount
        );
      },
    }),
    {
      name: "pf-cart",
      version: 2,
      partialize: (state) => ({ items: state.items }),
    }
  )
);
