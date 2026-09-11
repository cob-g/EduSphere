import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/constants/site";

// Add an entry here as each real public page ships.
const routes = ["/"];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: new URL(route, siteConfig.url).href,
  }));
}
