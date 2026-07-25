import type { Metadata } from "next";
import { TrackClient } from "@/components/track/track-client";

export const metadata: Metadata = {
  title: "Track Your Order",
  description:
    "Track your Precise Fumes order — enter your order number and the phone or email you used at checkout to see live delivery status.",
  alternates: { canonical: "/track" },
};

export default function TrackPage() {
  return (
    <div className="min-h-screen bg-bg text-fg">
      <section className="border-b border-border bg-bg-soft pt-36 pb-14 md:pt-40">
        <div className="container-lux text-center">
          <p className="tracking-luxe text-xs text-accent">Order Tracking</p>
          <h1 className="mt-4 font-serif text-5xl font-normal md:text-6xl">
            Track your order
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-fg-soft">
            Enter your order number and the phone or email you used at checkout
            to see exactly where your fragrance is.
          </p>
        </div>
      </section>

      <div className="container-lux py-14 md:py-20">
        <TrackClient />
      </div>
    </div>
  );
}
