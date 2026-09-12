// Primary navigation, in page order. All targets are anchors on the homepage.
// `short` is the label the phone dock uses, where six tabs share the width.
export const navLinks = [
  { label: "AI Teacher", short: "Teacher", href: "#teacher" },
  { label: "Platform", short: "Platform", href: "#platform" },
  { label: "Modules", short: "Modules", href: "#modules" },
  { label: "Security", short: "Security", href: "#security" },
  { label: "Services", short: "Services", href: "#services" },
  { label: "Pricing", short: "Pricing", href: "#pricing" },
] as const;

export const navActions = {
  // Placeholder until the app has a login URL. Must target an in-flow element
  // (the footer itself is position: fixed, so a hash to it never scrolls).
  signIn: { label: "Sign in", href: "#cta" },
  demo: { label: "Book a demo", href: "#cta" },
} as const;

export const contactEmail = "edusphereai.ph@gmail.com";

// Social profiles shown in the footer. Only accounts that actually exist
// belong here: a link to a profile that 404s reads worse than no link at all,
// especially one section after the page promises auditability. LinkedIn and
// Telegram icons are still wired up in the footer's SOCIAL_ICONS map, so
// adding a row back here is all it takes once those accounts are live.
export const socialLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61593503322497",
  },
] as const;
