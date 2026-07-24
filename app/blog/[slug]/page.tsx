import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { ARTICLES, getArticle, articleDate } from "@/lib/blog";
import { getProducts } from "@/lib/products";
import { ArticleBody } from "@/components/blog/article-body";
import { breadcrumbLd, SITE_URL, SITE_NAME } from "@/lib/seo";
import type { Product } from "@/types";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return { title: "Not Found" };
  return {
    title: a.title,
    description: a.description,
    keywords: a.keywords,
    alternates: { canonical: `/blog/${a.slug}` },
    openGraph: {
      title: a.title,
      description: a.description,
      url: `${SITE_URL}/blog/${a.slug}`,
      type: "article",
      publishedTime: a.date,
      images: [{ url: a.hero, width: 1400, height: 1000 }],
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const products = await getProducts();
  const productMap: Record<string, Product> = {};
  for (const p of products) productMap[p.slug] = p;

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    image: [article.hero],
    datePublished: article.date,
    dateModified: article.date,
    author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo-dark.png`,
      },
    },
    mainEntityOfPage: `${SITE_URL}/blog/${article.slug}`,
  };
  const crumbs = breadcrumbLd([
    { name: "Home", path: "/" },
    { name: "Journal", path: "/blog" },
    { name: article.title, path: `/blog/${article.slug}` },
  ]);

  const related = ARTICLES.filter((a) => a.slug !== article.slug).slice(0, 3);

  return (
    <article className="min-h-screen bg-bg text-fg">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }}
      />

      <div className="container-lux max-w-3xl pt-32 pb-8 md:pt-36">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs uppercase tracking-wider text-fg-faint">
          <Link href="/" className="hover:text-fg">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" strokeWidth={1.5} />
          <Link href="/blog" className="hover:text-fg">
            Journal
          </Link>
        </nav>

        <p className="pf-eyebrow mt-8">
          {article.category} · {article.readMinutes} min read ·{" "}
          {articleDate(article.date)}
        </p>
        <h1 className="mt-4 font-serif text-4xl font-normal leading-tight md:text-5xl">
          {article.title}
        </h1>
      </div>

      {/* Hero */}
      <div className="container-lux max-w-4xl">
        <div className="relative aspect-[16/9] overflow-hidden rounded-[var(--radius-lg)] border border-border">
          <Image
            src={article.hero}
            alt={article.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 56rem"
            className="object-cover"
          />
        </div>
      </div>

      {/* Body */}
      <div className="container-lux max-w-3xl py-12 md:py-16">
        <ArticleBody blocks={article.body} productMap={productMap} />

        {/* Offer footer */}
        <div className="mt-14 rounded-[var(--radius-lg)] border border-border bg-bg-soft p-7 text-center md:p-9">
          <h2 className="font-serif text-2xl font-normal">
            Premium perfumes, PKR 3,000
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-fg-soft">
            12–14 hour Extrait de Parfum · free 5ml tester with every perfume ·
            buy 3 get 1 free · free delivery in Karachi · cash on delivery
            nationwide.
          </p>
          <Link href="/shop" className="btn-primary mt-6">
            Shop the Collection
          </Link>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="container-lux max-w-5xl border-t border-border py-14">
          <h2 className="mb-8 font-serif text-2xl font-normal">
            More from the Journal
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {related.map((a) => (
              <Link
                key={a.slug}
                href={`/blog/${a.slug}`}
                className="pf-card group overflow-hidden rounded-[var(--radius-lg)] border border-border"
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
                <div className="p-4">
                  <h3 className="font-serif text-lg font-normal leading-snug">
                    {a.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
