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

    // Baseline security headers. The site sent none, which any header scan of
    // a page that sells "trust by design" would flag. These are the ones that
    // cannot break anything here: the site is HTTPS-only already, is never
    // meant to be framed by another origin, and uses no camera, microphone or
    // location. The CSP deliberately stops at framing, <base> and plugins; it
    // does not restrict script or style sources, so adding analytics or a
    // form provider later needs no change here.
    const security = [
      { key: "Strict-Transport-Security", value: "max-age=31536000" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      {
        key: "Content-Security-Policy",
        value: "frame-ancestors 'self'; base-uri 'self'; object-src 'none'",
      },
    ];

    return [
      { source: "/:path*", headers: security },
      { source: "/brand/:path*", headers: [{ key: "Cache-Control", value: cache }] },
      { source: "/product/:path*", headers: [{ key: "Cache-Control", value: cache }] },
    ];
  },
};

export default nextConfig;
