import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin",
          "/admin/",
          "/affiliate/dashboard",
          "/affiliate/verify",
          "/order-confirmation/",
          "/checkout",
          "/finances",
        ],
      },
    ],
    sitemap: "https://precisefumes.com/sitemap.xml",
    host: "https://precisefumes.com",
  };
}
