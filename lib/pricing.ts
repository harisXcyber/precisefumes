import type { CartItem } from "@/types";

/**
 * Canonical pricing rules — the single source of truth, shared by the
 * client cart store AND the orders API (which recomputes every order
 * server-side so tampered client payloads can't change what's charged).
 */

export const BASE_PRICE = 3000;
export const AFFILIATE_PRICE = 2500; // single-perfume price with a promo code
export const TESTER_PRICE = 200;
export const BUNDLE_2_TOTAL = 5000; // any 2 for PKR 5,000
export const PACK_4_TOTAL = 9000; // Buy 3 Get 1 Free — 4 perfumes for PKR 9,000
export const PACK_4_COMPARE = 12000; // struck-through anchor (4 × 3,000)
export const SHIPPING_FEE = 300;

export interface PricingFlags {
  bundle2: boolean;
  pack4: boolean;
  tester: boolean;
  freedelivery: boolean;
}

/** The subset of a cart line pricing cares about. */
export type PricingLine = Pick<CartItem, "slug" | "price" | "quantity"> & {
  kind?: CartItem["kind"];
};

export const isTesterLine = (i: { kind?: CartItem["kind"] }) =>
  i.kind === "tester";

export interface PromoResult {
  type: "bundle" | "pack4" | null;
  discountAmount: number;
  description: string;
}

/** Bottle offers (perfumes only — testers never count). Greedy best
 *  price: 4-packs (PKR 9,000) first if live, then 2-bundles (PKR 5,000)
 *  if live, rest at base. Expired offers silently stop applying. */
export function computePromo(
  perfumes: PricingLine[],
  flags: Pick<PricingFlags, "bundle2" | "pack4">
): PromoResult {
  const qty = perfumes.reduce((sum, i) => sum + i.quantity, 0);
  if (qty === 0) {
    return { type: null, discountAmount: 0, description: "" };
  }
  const subtotal = perfumes.reduce((sum, i) => sum + i.price * i.quantity, 0);

  let remaining = qty;
  let total = 0;
  let packs = 0;
  let pairs = 0;
  if (flags.pack4) {
    packs = Math.floor(remaining / 4);
    total += packs * PACK_4_TOTAL;
    remaining -= packs * 4;
  }
  if (flags.bundle2) {
    pairs = Math.floor(remaining / 2);
    total += pairs * BUNDLE_2_TOTAL;
    remaining -= pairs * 2;
  }
  total += remaining * BASE_PRICE;

  const discount = Math.max(0, subtotal - total);
  if (discount <= 0) {
    return { type: null, discountAmount: 0, description: "" };
  }

  let type: PromoResult["type"] = "bundle";
  let description = "Bundle savings applied";
  if (packs >= 1) {
    type = "pack4";
    description =
      packs === 1
        ? "Buy 3 Get 1 Free — 4 perfumes for PKR 9,000"
        : `Buy 3 Get 1 Free ×${packs}`;
  } else if (pairs >= 1) {
    description = "Bundle — any 2 for PKR 5,000";
  }

  return { type, discountAmount: discount, description };
}

export interface TesterResult {
  allowance: number;
  freeApplied: number;
  unused: number;
  discountAmount: number;
  description: string;
}

/** Every bottle earns one free 5ml tester of a scent NOT purchased.
 *  Extras — including of the purchased scent — stay PKR 200 each. */
export function computeTesters(
  perfumes: PricingLine[],
  testers: PricingLine[],
  testerOfferActive: boolean
): TesterResult {
  const allowance = testerOfferActive
    ? perfumes.reduce((sum, i) => sum + i.quantity, 0)
    : 0;
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
}

/** Delivery: free ONLY in Karachi, while the free-delivery offer is live,
 *  AND the order contains at least one perfume. Tester-only orders always
 *  pay the delivery fee — a PKR 200 tester can't ship for free. */
export function computeShipping(
  city: string,
  hasPerfume: boolean,
  freeDeliveryActive: boolean
): number {
  if (!city) return 0; // city not chosen yet (checkout preview only)
  if (city === "Karachi" && hasPerfume && freeDeliveryActive) return 0;
  return SHIPPING_FEE;
}

/** Promo-code savings: each standard PKR 3,000 bottle drops to 2,500. */
export function computeAffiliateSavings(
  perfumes: PricingLine[],
  codeApplied: boolean
): number {
  if (!codeApplied) return 0;
  const standardUnits = perfumes
    .filter((i) => i.price === BASE_PRICE)
    .reduce((sum, i) => sum + i.quantity, 0);
  return standardUnits * (BASE_PRICE - AFFILIATE_PRICE);
}

export interface OrderPricing {
  subtotal: number;
  promo: PromoResult;
  testers: TesterResult;
  affiliateSavings: number;
  /** Promo code never stacks with bottle offers — better discount wins. */
  affiliateWins: boolean;
  discount: number; // active bottle discount + tester discount
  shippingFee: number;
  total: number;
  hasPerfume: boolean;
}

/** Price a whole order from its lines — used by the server to recompute
 *  (and correct) whatever totals the client sent. */
export function priceOrder(
  lines: PricingLine[],
  flags: PricingFlags,
  opts: { affiliateApplied: boolean; city: string }
): OrderPricing {
  const perfumes = lines.filter((l) => !isTesterLine(l));
  const testerLines = lines.filter(isTesterLine);
  const hasPerfume = perfumes.some((l) => l.quantity > 0);

  const subtotal = lines.reduce((sum, l) => sum + l.price * l.quantity, 0);
  const promo = computePromo(perfumes, flags);
  const testers = computeTesters(perfumes, testerLines, flags.tester);
  const affiliateSavings = computeAffiliateSavings(
    perfumes,
    opts.affiliateApplied
  );
  const affiliateWins =
    opts.affiliateApplied && affiliateSavings > promo.discountAmount;
  const bottleDiscount = affiliateWins
    ? affiliateSavings
    : promo.discountAmount;
  const discount = bottleDiscount + testers.discountAmount;
  const shippingFee = computeShipping(
    opts.city,
    hasPerfume,
    flags.freedelivery
  );
  const total = Math.max(0, subtotal - discount) + shippingFee;

  return {
    subtotal,
    promo,
    testers,
    affiliateSavings,
    affiliateWins,
    discount,
    shippingFee,
    total,
    hasPerfume,
  };
}
