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

const OffersContext = createContext<Offer[]>([]);

export function useOffers() {
  return useContext(OffersContext);
}

/** Loads live offers, keeps the cart's pricing flags in sync, and
 *  drops offers the moment their countdown passes (re-checked each
 *  30s against the client clock). */
export function OffersProvider({ children }: { children: React.ReactNode }) {
  const [all, setAll] = useState<Offer[]>([]);
  const [live, setLive] = useState<Offer[]>([]);
  const setOfferFlags = useCart((s) => s.setOfferFlags);

  // Fetch once on mount.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/offers")
      .then((r) => (r.ok ? r.json() : { offers: [] }))
      .then((d) => {
        if (!cancelled) setAll(d.offers ?? []);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // Re-evaluate which offers are still live, now and every 30s.
  const evaluate = useCallback(() => {
    const now = Date.now();
    const current = all.filter(
      (o) => !o.ends_at || new Date(o.ends_at).getTime() > now
    );
    setLive(current);
    const keys = new Set(current.map((o) => o.offer_key));
    setOfferFlags({
      bundle2: keys.has("bundle2"),
      pack4: keys.has("pack4"),
    });
  }, [all, setOfferFlags]);

  useEffect(() => {
    evaluate();
    const id = setInterval(evaluate, 30_000);
    return () => clearInterval(id);
  }, [evaluate]);

  return (
    <OffersContext.Provider value={live}>{children}</OffersContext.Provider>
  );
}
