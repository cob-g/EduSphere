import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-hosted on Railway: emit a minimal Node server in .next/standalone.
  // `npm run build` copies public/ and .next/static into it (see postbuild).
  output: "standalone",
  poweredByHeader: false,
  images: {
    // AVIF first (roughly 20% smaller than WebP for photographs), WebP fallback.
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    // Brand and product assets change rarely and are referenced by fixed
    // names, so let browsers keep them for a day and revalidate in the
    // background for a week after that.
    const cache = "public, max-age=86400, stale-while-revalidate=604800";
    return [
      { source: "/brand/:path*", headers: [{ key: "Cache-Control", value: cache }] },
      { source: "/product/:path*", headers: [{ key: "Cache-Control", value: cache }] },
    ];
  },
};

export default nextConfig;
