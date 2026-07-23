import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Serve modern formats — big savings on the large logo PNGs.
    formats: ["image/avif", "image/webp"],
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
