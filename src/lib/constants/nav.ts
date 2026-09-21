// Primary navigation, in page order. All targets are anchors on the homepage.
// The lesson-flow band (#platform) is deliberately not listed: it continues
// the AI Teacher story, so that link already leads into it. `short` is the
// label the phone dock uses, where five tabs share the width.
export const navLinks = [
  { label: "AI Teacher", short: "AI Teacher", href: "#teacher" },
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
// especially one section after the page promises auditability. The footer
// renders each row as a text link, so adding a row back here is all it takes
// once another account is live.
export const socialLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61593503322497",
  },
] as const;
