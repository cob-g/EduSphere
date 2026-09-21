import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/constants/site";

// Add an entry here as each real public page ships.
const routes = ["/"];

// The sitemap is prerendered, so this is the time of the build that shipped it.
const builtAt = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: new URL(route, siteConfig.url).href,
    lastModified: builtAt,
  }));
}
