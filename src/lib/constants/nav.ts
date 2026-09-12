// Primary navigation. All targets are anchors on the homepage for now.
export const navLinks = [
  { label: "AI Teacher", href: "#teacher" },
  { label: "Platform", href: "#platform" },
  { label: "Modules", href: "#modules" },
  { label: "Security", href: "#security" },
] as const;

export const navActions = {
  // Placeholder until the app has a login URL. Must target an in-flow element
  // (the footer itself is position: fixed, so a hash to it never scrolls).
  signIn: { label: "Sign in", href: "#cta" },
  demo: { label: "Book a demo", href: "#cta" },
} as const;

export const contactEmail = "hello@edusphere.ai";

// Social profiles shown in the footer. Replace the handles once the official
// accounts exist.
export const socialLinks = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/edusphere-ai" },
  { label: "Facebook", href: "https://www.facebook.com/edusphereai" },
  { label: "Telegram", href: "https://t.me/edusphereai" },
] as const;
