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
