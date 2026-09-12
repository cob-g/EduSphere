import { contactEmail, socialLinks } from "@/lib/constants/nav";

// NEXT_PUBLIC_* values are inlined at build time, so they must be set
// in the environment that runs `npm run build` (on Railway: service variables).
const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000");

export const siteConfig = {
  name: "EduSphere AI",
  title: "EduSphere AI — One Platform. Complete School Intelligence.",
  tagline: "One Platform. Complete School Intelligence.",
  description:
    "EduSphere AI connects teaching, school operations, student records, finance, analytics, and AI in one intelligent school platform.",
  url: siteUrl,
} as const;

/**
 * Organization structured data. This is the machine-readable copy of the same
 * contact details the footer shows, and it is how search engines tie the brand
 * to its official social profile and address rather than guessing.
 */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    alternateName: "EduSphere",
    url: siteConfig.url.href,
    logo: new URL("/brand/edusphere-logo-black.png", siteConfig.url).href,
    description: siteConfig.description,
    slogan: siteConfig.tagline,
    email: contactEmail,
    sameAs: socialLinks.map((link) => link.href),
    address: { "@type": "PostalAddress", addressCountry: "PH" },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: contactEmail,
      areaServed: "PH",
      availableLanguage: ["en", "fil"],
    },
  };
}
