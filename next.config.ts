import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-hosted on Railway: emit a minimal Node server in .next/standalone.
  // `npm run build` copies public/ and .next/static into it (see postbuild).
  output: "standalone",
  poweredByHeader: false,
};

export default nextConfig;
