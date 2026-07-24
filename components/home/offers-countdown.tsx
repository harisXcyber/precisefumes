"use client";

import Link from "next/link";
import { useOffers } from "@/components/offers-provider";
import { Countdown } from "@/components/ui/countdown";

/** Homepage band showing the live, time-limited offers with a
 *  countdown. Renders nothing once every offer has expired. */
export function OffersCountdown() {
  const offers = useOffers();
  const timed = offers.filter((o) => o.ends_at);
  if (offers.length === 0) return null;

  // The soonest end time across the live offers drives the headline timer.
  const soonest = timed
    .map((o) => o.ends_at as string)
    .sort()[0];

  return (
    <section className="bg-invert-bg py-16 text-invert-fg md:py-20">
      <div className="container-lux text-center">
        <p className="pf-eyebrow !text-accent">Limited-time offers</p>
        <h2 className="mt-4 font-serif text-4xl font-normal md:text-5xl">
          Ending soon
        </h2>

        {soonest && (
          <div className="mt-8 flex justify-center">
            <Countdown endsAt={soonest} className="text-invert-fg" />
          </div>
        )}

        <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-2">
          {offers.map((o) => (
            <div
              key={o.id}
              className="rounded-[var(--radius-lg)] border border-white/10 bg-white/[0.03] p-6 text-left"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-serif text-xl">{o.title}</h3>
                {o.ends_at && (
                  <Countdown
                    endsAt={o.ends_at}
                    compact
                    className="shrink-0 text-xs text-accent"
                  />
                )}
              </div>
              {o.description && (
                <p className="mt-2 text-sm leading-relaxed text-invert-fg/70">
                  {o.description}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10">
          <Link href="/shop" className="btn-primary">
            Shop Before It Ends
          </Link>
        </div>
      </div>
    </section>
  );
}
