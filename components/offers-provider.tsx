"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useCart } from "@/lib/store/cart";
import type { Offer } from "@/lib/offers";

interface OffersCtx {
  offers: Offer[];
  /** True once the live offers have actually been fetched. Until then,
   *  consumers should show neutral fallbacks — an empty array before
   *  load means "unknown", not "no offers". */
  loaded: boolean;
}

const OffersContext = createContext<OffersCtx>({ offers: [], loaded: false });

export function useOffers(): OffersCtx {
  return useContext(OffersContext);
}

/** Loads live offers, keeps the cart's pricing flags in sync, and
 *  drops offers the moment their countdown passes (re-checked each
 *  30s against the client clock). */
export function OffersProvider({ children }: { children: React.ReactNode }) {
  const [all, setAll] = useState<Offer[]>([]);
  const [live, setLive] = useState<Offer[]>([]);
  const [loaded, setLoaded] = useState(false);
  const setOfferFlags = useCart((s) => s.setOfferFlags);

  // Fetch on mount; if the network hiccups, retry on the 30s tick below
  // (until then the cart keeps its optimistic defaults).
  const load = useCallback(() => {
    fetch("/api/offers")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => {
        setAll(d.offers ?? []);
        setLoaded(true);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Re-evaluate which offers are still live, now and every 30s. Only
  // once real data has loaded — evaluating an empty pre-fetch list
  // would wrongly switch every offer off for a moment (or for good,
  // if the fetch failed).
  const evaluate = useCallback(() => {
    if (!loaded) {
      load(); // fetch failed earlier — keep retrying on the tick
      return;
    }
    const now = Date.now();
    const current = all.filter(
      (o) => !o.ends_at || new Date(o.ends_at).getTime() > now
    );
    setLive(current);
    const keys = new Set(current.map((o) => o.offer_key));
    setOfferFlags({
      bundle2: keys.has("bundle2"),
      pack4: keys.has("pack4"),
      tester: keys.has("tester"),
      freedelivery: keys.has("freedelivery"),
    });
  }, [all, loaded, load, setOfferFlags]);

  useEffect(() => {
    evaluate();
    const id = setInterval(evaluate, 30_000);
    return () => clearInterval(id);
  }, [evaluate]);

  return (
    <OffersContext.Provider value={{ offers: live, loaded }}>
      {children}
    </OffersContext.Provider>
  );
}
