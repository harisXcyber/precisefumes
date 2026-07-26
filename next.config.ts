import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Serve modern formats — big savings on the large logo PNGs.
    formats: ["image/avif", "image/webp"],
    // Supabase Storage sends `cache-control: no-cache`, which would make
    // the image optimizer treat every product photo as stale within ~60s.
    // Product photography changes rarely — cache optimized variants 31 days.
    minimumCacheTTL: 2678400,
    remotePatterns: [
      // Supabase Storage public URLs (set after project creation)
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  compress: true,
};

export default nextConfig;
