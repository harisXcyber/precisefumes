import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/products";
import { ARTICLES } from "@/lib/blog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://precisefumes.com";

  // Fetch all active products
  const products = await getProducts();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/affiliate/signup`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/shipping`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/returns`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];

  // Dynamic product pages — include product images for Google Images.
  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}/shop/${product.slug}`,
    lastModified: product.updatedAt
      ? new Date(product.updatedAt)
      : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
    images: (product.images ?? []).filter((u) => u.startsWith("http")),
  }));

  // Category landing views (indexable filtered shop pages)
  const categoryPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/shop?category=Him`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/shop?category=Her`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  // Blog articles — with hero image for Google Images.
  const blogPages: MetadataRoute.Sitemap = ARTICLES.map((a) => ({
    url: `${baseUrl}/blog/${a.slug}`,
    lastModified: new Date(a.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
    images: a.hero.startsWith("http") ? [a.hero] : undefined,
  }));

  return [...staticPages, ...categoryPages, ...productPages, ...blogPages];
}
