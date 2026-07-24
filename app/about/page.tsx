import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Discover the story behind Precise Fumes — a house of meticulously composed luxury fragrances.",
};

export default function About() {
  return (
    <div className="min-h-screen bg-bg text-fg">
      {/* Hero */}
      <section className="bg-invert-bg text-invert-fg pt-40 pb-20 md:pt-48 md:pb-28">
        <div className="container-lux text-center">
          <h1 className="font-serif text-5xl md:text-6xl font-normal mb-6">
            Our Story
          </h1>
          <p className="text-lg max-w-2xl mx-auto text-invert-fg/80">
            Founded in 2026, Precise Fumes is a house dedicated to the art of
            fragrance composition. Each scent is a balance of precision and
            creativity.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container-lux py-24 md:py-32">
        <div className="max-w-3xl mx-auto space-y-12">
          <div>
            <h2 className="font-serif text-3xl font-normal mb-6">
              Crafted with Intention
            </h2>
            <p className="text-lg leading-relaxed text-fg-soft mb-4">
              At Precise Fumes, we believe that fragrance is more than a scent —
              it's an experience. Each composition is carefully developed to tell
              a story, evoke an emotion, and leave a lasting impression.
            </p>
            <p className="text-lg leading-relaxed text-fg-soft">
              From the initial spark of inspiration to the final formulation,
              every step of our process is guided by a commitment to quality,
              authenticity, and precision.
            </p>
          </div>

          {/* Three Pillars */}
          <div className="grid md:grid-cols-3 gap-8 py-12">
            <div className="text-center">
              <h3 className="font-serif text-2xl font-normal mb-4">Restraint</h3>
              <p className="text-fg-soft leading-relaxed">
                We believe in the power of subtlety. Every ingredient serves a
                purpose; nothing is superfluous.
              </p>
            </div>
            <div className="text-center">
              <h3 className="font-serif text-2xl font-normal mb-4">Origin</h3>
              <p className="text-fg-soft leading-relaxed">
                We source the finest natural and synthetic materials from
                around the world, ensuring quality at every level.
              </p>
            </div>
            <div className="text-center">
              <h3 className="font-serif text-2xl font-normal mb-4">
                Signature
              </h3>
              <p className="text-fg-soft leading-relaxed">
                Each fragrance carries our signature — a distinctive approach
                to composition that sets us apart.
              </p>
            </div>
          </div>

          <div className="border-t border-border pt-12">
            <h2 className="font-serif text-3xl font-normal mb-6">
              Premium, and Guaranteed
            </h2>
            <p className="text-lg leading-relaxed text-fg-soft mb-6">
              Every Precise Fumes scent is an Extrait de Parfum — the most
              concentrated form of fragrance — built to last 12 to 14 hours on
              the skin. We're so confident in each piece that we back it with a
              full money-back guarantee: if anything is ever wrong on our side,
              we refund you completely or replace it free.
            </p>
            <p className="text-lg leading-relaxed text-fg-soft mb-6">
              We're proud to serve fragrance enthusiasts across Pakistan, with
              free delivery in Karachi (2–5 working days) and nationwide
              shipping available.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.18em] btn-primary"
            >
              Explore Fragrances
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
