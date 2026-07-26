import type { Metadata } from "next";
import { InfluencerApplyForm } from "@/components/influencers/apply-form";

export const metadata: Metadata = {
  title: "Influencer Programme — Earn With Precise Fumes",
  description:
    "Three tiers for Pakistani creators: free luxury perfumes + a personal promo code, your own signature perfume, or a full perfume brand in your name — managed A to Z by Precise Fumes.",
  alternates: { canonical: "/influencers" },
  openGraph: {
    title: "Precise Fumes Influencer Programme",
    description:
      "Free luxury perfumes, PKR 300 per sale, your own signature perfume — or a full brand in your name.",
    url: "https://precisefumes.com/influencers",
    type: "website",
  },
};

interface Tier {
  eyebrow: string;
  name: string;
  tagline: string;
  perks: string[];
  requirements: string[];
  budget: string | null;
  earnings: string;
  featured?: boolean;
}

const TIERS: Tier[] = [
  {
    eyebrow: "Tier 1",
    name: "The Collab",
    tagline: "Start earning with your audience.",
    perks: [
      "5 luxurious perfumes with premium packaging — our gift to you",
      "A personalized promo code in your name",
      "PKR 300 commission on every sale with your code",
      "Your audience saves PKR 500 on every perfume",
    ],
    requirements: [
      "5,000+ Instagram followers",
      "50,000+ average reel views",
      "1,000+ likes on reels",
      "Confident you can close 20+ sales",
    ],
    budget: null,
    earnings: "20 sales = PKR 6,000 commission",
  },
  {
    eyebrow: "Tier 2",
    name: "Your Signature Perfume",
    tagline: "We launch a perfume under your name.",
    perks: [
      "Everything in The Collab — gift set + promo code",
      "A perfume launched under YOUR name, built around your theme",
      "You choose the fragrance, bottle and packaging — we send testers of multiple fragrances and photos to pick from",
      "The perfumes are 100% yours — you keep the whole profit, at any price you set (PKR 4,000, 5,000, your call)",
      "≈ 20–25 premium perfumes from your budget",
      "Stock shipped to you, or kept with us — we sell it on our website and socials, and you can sell it yourself too",
      "Delivery, packaging and everything A to Z handled by us",
    ],
    requirements: [
      "25,000+ Instagram followers",
      "200,000+ average reel views",
      "5,000+ likes on reels",
      "Can close 50+ sales",
    ],
    budget: "Minimum budget PKR 50,000 (perfume making & purchase)",
    earnings: "50 sales = PKR 15,000 promo-code commission on top of your profit",
    featured: true,
  },
  {
    eyebrow: "Tier 3",
    name: "Your Own Brand",
    tagline: "For big influencers — a complete perfume brand in your name.",
    perks: [
      "Everything in the previous tiers",
      "We launch AND manage a premium perfume brand under your name",
      "Multiple perfumes of your choice, built to your theme",
      "Promo codes for your own brand — a proper, functioning brand",
      "Sales and delivery managed by us, or by you — your call",
      "All-in-one: we handle everything end to end",
    ],
    requirements: [
      "150,000+ Instagram followers",
      "1M+ average reel views",
      "100,000+ average likes",
      "Can easily close 200+ sales",
    ],
    budget: "Minimum budget PKR 500,000",
    earnings: "200 sales = PKR 60,000 promo-code commission on top of brand profit",
  },
];

export default function InfluencersPage() {
  return (
    <div className="min-h-screen bg-bg text-fg">
      {/* Header */}
      <section className="border-b border-border bg-bg-soft pt-36 pb-14 md:pt-40">
        <div className="container-lux text-center">
          <p className="tracking-luxe text-xs text-accent">
            Influencer Programme
          </p>
          <h1 className="mt-4 font-serif text-5xl font-normal md:text-6xl">
            Your audience. Our perfumes.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-fg-soft">
            Three tiers for Pakistani creators — from a personal promo code, to
            a signature perfume in your name, to a complete perfume brand we
            build and run for you. Every tier starts with a luxury gift.
          </p>
        </div>
      </section>

      {/* The gift — common to all tiers */}
      <section className="container-lux py-12 md:py-16">
        <div className="rounded-[var(--radius-lg)] border border-accent/40 bg-accent/10 p-6 text-center md:p-8">
          <p className="pf-eyebrow">Every tier begins with a gift</p>
          <p className="mx-auto mt-3 max-w-2xl font-serif text-2xl leading-snug md:text-3xl">
            5 premium perfumes, testers &amp; premium packaging — sent to you
            free.
          </p>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-fg-soft">
            In return, we ask for one thing: a{" "}
            <strong className="text-fg">30–60 second reel</strong> featuring you
            and Precise Fumes. Simple works; funny or creative is even better —
            your <strong className="text-fg">voice and face</strong> must be in
            it.
          </p>
        </div>
      </section>

      {/* Tiers */}
      <section className="container-lux pb-14 md:pb-20">
        <div className="grid gap-6 lg:grid-cols-3">
          {TIERS.map((t) => (
            <div
              key={t.name}
              className={`flex flex-col rounded-[var(--radius-lg)] border p-6 md:p-7 ${
                t.featured
                  ? "border-accent bg-bg-soft shadow-[0_18px_40px_-18px_rgba(201,154,78,0.45)]"
                  : "border-border bg-bg-soft"
              }`}
            >
              <p className="pf-eyebrow">{t.eyebrow}</p>
              <h2 className="mt-2 font-serif text-3xl font-normal">{t.name}</h2>
              <p className="mt-1 text-sm text-fg-soft">{t.tagline}</p>

              <p className="pf-label mt-6 mb-2">What you get</p>
              <ul className="space-y-1.5 text-sm leading-relaxed text-fg-soft">
                {t.perks.map((p) => (
                  <li key={p} className="flex gap-2">
                    <span className="text-accent-deep" aria-hidden>
                      ✦
                    </span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>

              <p className="pf-label mt-6 mb-2">Requirements</p>
              <ul className="space-y-1.5 text-sm leading-relaxed text-fg-soft">
                {t.requirements.map((r) => (
                  <li key={r} className="flex gap-2">
                    <span className="text-fg-faint" aria-hidden>
                      —
                    </span>
                    <span>{r}</span>
                  </li>
                ))}
                {t.budget && (
                  <li className="flex gap-2 font-medium text-fg">
                    <span className="text-fg-faint" aria-hidden>
                      —
                    </span>
                    <span>{t.budget}</span>
                  </li>
                )}
              </ul>

              <p className="mt-6 rounded-[var(--radius)] bg-accent/15 px-4 py-3 text-xs font-medium leading-relaxed text-accent-deep">
                {t.earnings}
              </p>

              <a
                href="#apply"
                className={`mt-6 block rounded-full px-5 py-3 text-center text-sm font-medium transition-transform hover:scale-[1.02] ${
                  t.featured
                    ? "bg-accent text-on-accent"
                    : "border border-fg text-fg hover:bg-fg hover:text-bg"
                }`}
              >
                Apply for {t.name}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-border bg-bg-soft py-14 md:py-16">
        <div className="container-lux">
          <h2 className="text-center font-serif text-3xl font-normal md:text-4xl">
            How it works
          </h2>
          <div className="mx-auto mt-10 grid max-w-4xl gap-8 sm:grid-cols-3">
            {[
              ["01", "Apply below", "Tell us your handle and your numbers — we review every application personally."],
              ["02", "Get your gift", "5 premium perfumes, testers and packaging arrive at your door, with your promo code."],
              ["03", "Post your reel", "One 30–60s reel with your voice and face — then watch the commissions come in."],
            ].map(([n, title, body]) => (
              <div key={n} className="text-center">
                <p className="font-serif text-3xl text-accent-deep">{n}</p>
                <p className="mt-2 font-medium">{title}</p>
                <p className="mt-2 text-sm leading-relaxed text-fg-soft">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application */}
      <section id="apply" className="container-lux py-14 md:py-20">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <p className="pf-eyebrow">Apply now</p>
            <h2 className="mt-3 font-serif text-4xl font-normal">
              Join the programme
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-fg-soft">
              Fill this in and we&apos;ll reach out on WhatsApp within 1–2 days.
            </p>
          </div>
          <InfluencerApplyForm />
        </div>
      </section>
    </div>
  );
}
