import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { contactEmail } from "@/lib/constants/nav";

const columns = [
  {
    heading: "Platform",
    links: [
      { label: "Overview", href: "#platform" },
      { label: "AI Teacher", href: "#teacher" },
      { label: "Modules", href: "#modules" },
    ],
  },
  {
    heading: "Schools",
    links: [
      { label: "Leaders", href: "#platform" },
      { label: "Teachers", href: "#platform" },
      { label: "Students", href: "#platform" },
      { label: "Parents", href: "#platform" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Contact", href: `mailto:${contactEmail}` },
      { label: "News", href: "#" },
    ],
  },
  {
    heading: "Trust",
    links: [
      { label: "Security", href: "#security" },
      { label: "Privacy", href: "#" },
      { label: "Data Protection", href: "#" },
      { label: "Terms", href: "#" },
    ],
  },
] as const;

// Full lockup (public/brand/edusphere-logo-black.png): globe mark, wordmark and
// the "One Platform. Complete School Intelligence." tagline. Intrinsic ratio is
// passed to next/image; the rendered width is set in CSS.
const LOGO = { width: 1539, height: 1129 } as const;

// Light, Apple-style footer after the dark CTA. Rendered through <Section> so
// the nav reads its theme; the semantic <footer> lives inside.
export function SiteFooter() {
  return (
    <Section theme="light" tone="paper" id="footer" className="border-t border-line">
      <Container as="footer" role="contentinfo" className="pt-[72px] pb-7">
        <div className="grid grid-cols-2 gap-[35px] min-[681px]:grid-cols-3 min-[1001px]:grid-cols-[1.35fr_repeat(4,.8fr)]">
          <div className="col-span-full min-[1001px]:col-span-1">
            <Image
              src="/brand/edusphere-logo-black.png"
              alt="EduSphere AI — One Platform. Complete School Intelligence."
              width={LOGO.width}
              height={LOGO.height}
              sizes="230px"
              className="h-auto w-[230px] max-w-full"
            />
            <p className="mt-4 max-w-[280px] text-[13px] leading-[1.6] text-muted">
              The intelligent school platform for teaching, operations, students and finance.
            </p>
          </div>

          {columns.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <h4 className="mb-[18px] text-[10px] font-medium uppercase tracking-[.12em] text-muted-2">
                {column.heading}
              </h4>
              <ul>
                {column.links.map((link) => (
                  <li key={link.label} className="my-[11px]">
                    <Link
                      href={link.href}
                      className="block text-[12px] text-muted transition-colors duration-200 ease-apple hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-14 flex flex-col justify-between gap-4 border-t border-line pt-[22px] text-[11px] text-muted-2 min-[681px]:flex-row">
          <span>© 2026 EduSphere AI. All rights reserved.</span>
          <span>Philippines · LinkedIn · Facebook</span>
        </div>
      </Container>
    </Section>
  );
}
