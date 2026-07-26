"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types";
import { computePromo, computeTesters } from "@/lib/pricing";

// Canonical pricing constants live in lib/pricing (shared with the
// server-side order recompute); re-exported here for existing importers.
export { TESTER_PRICE, PACK_4_COMPARE } from "@/lib/pricing";

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

/** Which time-limited pricing offers are currently live. Set by
 *  OffersProvider from the DB; default true so pricing works on first
 *  paint and self-corrects within a second if an offer has expired. */
interface OfferFlags {
  bundle2: boolean;
  pack4: boolean;
  tester: boolean;
  freedelivery: boolean;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  offerFlags: OfferFlags;

  // mutations
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  setOfferFlags: (flags: OfferFlags) => void;

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
      offerFlags: {
        bundle2: true,
        pack4: true,
        tester: true,
        freedelivery: true,
      },

      setOfferFlags: (flags) => set({ offerFlags: flags }),

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

      /** Bottle offers — delegated to the shared pricing module (also
       *  used server-side to recompute every order). Each offer only
       *  applies while live (offerFlags, set from the DB offers). */
      getPromoInfo: () => computePromo(get().perfumeItems(), get().offerFlags),

      /** Free-tester rules — same shared module. */
      getTesterInfo: () =>
        computeTesters(
          get().perfumeItems(),
          get().testerItems(),
          get().offerFlags.tester
        ),

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
