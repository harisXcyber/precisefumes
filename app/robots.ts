import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/affiliate/dashboard", "/order-confirmation/"],
    },
    sitemap: "https://precisefumes.com/sitemap.xml",
  };
}
