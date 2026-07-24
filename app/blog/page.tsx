import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ARTICLES, articleDate } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Fragrance Journal — Perfume Guides & Tips",
  description:
    "Guides to the best long-lasting perfumes in Pakistan, the best perfumes for men and women, oud fragrances, and how to make your perfume last all day — from Precise Fumes.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Precise Fumes Journal — Perfume Guides & Tips",
    description:
      "Guides to the best perfumes in Pakistan, oud fragrances, and making your scent last 12–14 hours.",
    url: "https://precisefumes.com/blog",
    type: "website",
  },
};

export default function BlogIndex() {
  const [lead, ...rest] = ARTICLES.length
    ? [
        ARTICLES.find((a) => a.slug === "best-long-lasting-perfumes-in-pakistan") ??
          ARTICLES[0],
        ...ARTICLES.filter(
          (a) => a.slug !== "best-long-lasting-perfumes-in-pakistan"
        ),
      ]
    : [];

  return (
    <div className="min-h-screen bg-bg text-fg">
      {/* Header */}
      <section className="border-b border-border bg-bg-soft pt-36 pb-14 md:pt-40">
        <div className="container-lux text-center">
          <p className="tracking-luxe text-xs text-accent">Fragrance Journal</p>
          <h1 className="mt-4 font-serif text-5xl font-normal md:text-6xl">
            Perfume Guides &amp; Tips
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-fg-soft">
            Everything worth knowing about premium fragrance in Pakistan — the
            best long-lasting scents, how to choose, and how to make them last.
          </p>
        </div>
      </section>

      <div className="container-lux py-14 md:py-20">
        {/* Lead article */}
        {lead && (
          <Link
            href={`/blog/${lead.slug}`}
            className="pf-card group grid overflow-hidden rounded-[var(--radius-lg)] border border-border md:grid-cols-2"
          >
            <div className="relative aspect-[16/10] md:aspect-auto">
              <Image
                src={lead.hero}
                alt={lead.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-center p-7 md:p-10">
              <p className="pf-eyebrow">
                {lead.category} · {lead.readMinutes} min read
              </p>
              <h2 className="mt-3 font-serif text-3xl font-normal leading-tight md:text-4xl">
                {lead.title}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-fg-soft">
                {lead.description}
              </p>
              <span className="mt-6 inline-block text-xs uppercase tracking-[0.16em] text-accent-deep">
                Read the guide →
              </span>
            </div>
          </Link>
        )}

        {/* Rest */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((a) => (
            <Link
              key={a.slug}
              href={`/blog/${a.slug}`}
              className="pf-card group flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-border"
            >
              <div className="relative aspect-[16/10]">
                <Image
                  src={a.hero}
                  alt={a.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="pf-eyebrow text-[11px]">
                  {a.category} · {a.readMinutes} min
                </p>
                <h3 className="mt-2 font-serif text-xl font-normal leading-snug">
                  {a.title}
                </h3>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-fg-soft">
                  {a.description}
                </p>
                <span className="mt-auto pt-4 text-xs uppercase tracking-[0.16em] text-accent-deep">
                  Read →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
