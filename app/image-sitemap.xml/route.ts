import { getProducts } from "@/lib/products";
import { ARTICLES } from "@/lib/blog";
import { productImageAlt, SITE_URL } from "@/lib/seo";

/**
 * Dedicated Google Images sitemap. Unlike the default sitemap (URLs + image
 * locations only), this adds <image:title> and <image:caption> for every
 * image — the metadata Google Images ranks on. Listed in robots.txt.
 */

const STORAGE =
  "https://qjjdxxtfvrdrpwcvlwhb.supabase.co/storage/v1/object/public/product-images";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function imageTag(loc: string, title: string, caption: string): string {
  return `    <image:image>
      <image:loc>${esc(loc)}</image:loc>
      <image:title>${esc(title)}</image:title>
      <image:caption>${esc(caption)}</image:caption>
    </image:image>`;
}

function urlBlock(loc: string, images: string): string {
  return `  <url>
    <loc>${esc(loc)}</loc>
${images}
  </url>`;
}

export const revalidate = 3600;

export async function GET() {
  const products = await getProducts();

  const marketing = [
    {
      loc: `${STORAGE}/site/collection-bottles.jpg`,
      title: "Precise Fumes perfume collection — five long-lasting fragrances",
      caption:
        "The five Precise Fumes Extrait de Parfum fragrances — Rogue, Royal Oud, Legacy, Bloom and Blossom. Buy perfume online in Pakistan.",
    },
    {
      loc: `${STORAGE}/site/collection-boxes.jpg`,
      title: "Precise Fumes perfume boxes — premium packaging",
      caption:
        "Precise Fumes perfumes in premium packaging. Cash on delivery across Pakistan, free delivery in Karachi.",
    },
    {
      loc: `${STORAGE}/site/testers.jpg`,
      title: "Precise Fumes 5ml perfume testers",
      caption:
        "A free 5ml Extrait de Parfum tester comes with every Precise Fumes order.",
    },
    {
      loc: `${STORAGE}/site/for-her.jpg`,
      title: "Precise Fumes perfumes for women — Bloom and Blossom",
      caption:
        "Women's perfumes by Precise Fumes — Bloom and Blossom, long-lasting floral Extrait de Parfum.",
    },
    {
      loc: `${SITE_URL}/gift-bag-black.jpg`,
      title: "Precise Fumes premium black gift bag",
      caption:
        "Every Precise Fumes perfume ships in a free premium gift bag.",
    },
    {
      loc: `${SITE_URL}/gift-bag-cream.jpg`,
      title: "Precise Fumes premium cream gift bag",
      caption: "Free premium gift bag with every Precise Fumes order.",
    },
  ];

  const blocks: string[] = [];

  // Homepage — brand & collection imagery
  blocks.push(
    urlBlock(
      SITE_URL,
      marketing.map((m) => imageTag(m.loc, m.title, m.caption)).join("\n")
    )
  );

  // Product pages — every image, with a scent-specific caption
  for (const p of products) {
    const imgs = (p.images ?? []).filter((u) => u.startsWith("http"));
    if (!imgs.length) continue;
    const tags = imgs
      .map((u, i) =>
        imageTag(
          u,
          productImageAlt(p.name, p.category, i),
          p.description || `${p.name} perfume by Precise Fumes.`
        )
      )
      .join("\n");
    blocks.push(urlBlock(`${SITE_URL}/shop/${p.slug}`, tags));
  }

  // Blog hero images
  for (const a of ARTICLES) {
    if (!a.hero?.startsWith("http")) continue;
    blocks.push(
      urlBlock(
        `${SITE_URL}/blog/${a.slug}`,
        imageTag(a.hero, a.title, a.description || a.title)
      )
    );
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${blocks.join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
