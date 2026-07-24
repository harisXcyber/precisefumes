"use client";

import Image from "next/image";
import { useCart, TESTER_PRICE } from "@/lib/store/cart";
import { formatPrice } from "@/lib/utils";
import { getScentTone } from "@/lib/tones";

export interface TesterOption {
  id: string;
  name: string;
  slug: string;
  image: string;
}

/**
 * Free-tester picker. Every bottle in the cart earns one free 5ml tester
 * of a scent you haven't bought; anything beyond that is PKR 200.
 *
 * `currentSlug` (on a product page) is the scent being viewed — its own
 * tester can still be added, just never as the free one.
 */
export function TesterPicker({
  options,
  currentSlug,
  compact = false,
}: {
  options: TesterOption[];
  currentSlug?: string;
  compact?: boolean;
}) {
  const { items, addItem, getTesterInfo } = useCart();
  const tester = getTesterInfo();

  const qtyOf = (slug: string) =>
    items
      .filter((i) => i.kind === "tester" && i.slug === slug)
      .reduce((s, i) => s + i.quantity, 0);

  const purchased = new Set(
    items.filter((i) => i.kind !== "tester").map((i) => i.slug)
  );

  const add = (o: TesterOption) =>
    addItem({
      productId: `${o.id}-tester`,
      name: `${o.name} Tester`,
      slug: o.slug,
      image: o.image,
      size: "5ml Tester",
      price: TESTER_PRICE,
      quantity: 1,
      kind: "tester",
    });

  return (
    <div>
      {!compact && (
        <>
          <p className="pf-eyebrow">Add a 5ml tester</p>
          <p className="mt-2 text-sm leading-relaxed text-fg-soft">
            Every perfume you buy comes with{" "}
            <strong className="text-fg">one free 5ml tester</strong> of a
            different scent — so a Buy 2 Get 1 Free order (3 perfumes) earns 3
            free testers. Extra testers are {formatPrice(TESTER_PRICE)} each,
            including one of the perfume you&apos;re buying.
          </p>
        </>
      )}

      {tester.unused > 0 && (
        <p className="mt-3 rounded-[var(--radius)] bg-accent/15 px-4 py-2.5 text-xs text-accent-deep">
          You have {tester.unused} free tester
          {tester.unused === 1 ? "" : "s"} to claim — pick any scent you
          haven&apos;t bought.
        </p>
      )}

      <ul
        className={`mt-4 grid gap-2 ${
          compact ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"
        }`}
      >
        {options.map((o) => {
          const qty = qtyOf(o.slug);
          const isOwnScent = purchased.has(o.slug) || o.slug === currentSlug;
          const tone = getScentTone(o.slug);
          const freeAvailable = tester.unused > 0 && !purchased.has(o.slug);

          return (
            <li
              key={o.slug}
              className="flex items-center gap-3 rounded-[var(--radius)] border border-border p-2.5"
            >
              <span
                className="relative h-12 w-12 shrink-0 overflow-hidden rounded-[var(--radius)]"
                style={{ background: tone.gradient }}
              >
                {o.image && (
                  <Image
                    src={o.image}
                    alt={o.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                )}
              </span>

              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">
                  {o.name}
                </span>
                <span className="block text-xs text-fg-soft">
                  {freeAvailable ? (
                    <span className="text-accent-deep">
                      Free with your perfume
                    </span>
                  ) : isOwnScent ? (
                    `${formatPrice(TESTER_PRICE)} · same scent`
                  ) : (
                    formatPrice(TESTER_PRICE)
                  )}
                </span>
              </span>

              <button
                type="button"
                onClick={() => add(o)}
                className="shrink-0 rounded-full border border-fg px-3 py-1.5 text-[11px] uppercase tracking-[0.12em] transition-colors hover:bg-fg hover:text-bg"
              >
                {qty > 0 ? `Added ${qty}` : "Add"}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
