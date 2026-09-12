import type { ReactNode } from "react";
import { Building2, History, ShieldCheck, UserCheck, type LucideIcon } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Section } from "@/components/ui/section";

import { AccessVisual, AuditVisual, BoundaryVisual, ReviewVisual } from "./trust-visuals";

type Card = {
  eyebrow: string;
  title: string;
  text: string;
  footer: string;
  icon: LucideIcon;
  visual: ReactNode;
};

const cards: Card[] = [
  {
    eyebrow: "Role-based access",
    title: "Everyone sees what their role allows.",
    text: "Registrar, teachers, finance staff, students and parents each get their own view. Permissions follow responsibilities, not convenience.",
    footer: "Least privilege by default.",
    icon: ShieldCheck,
    visual: <AccessVisual />,
  },
  {
    eyebrow: "Audit trail",
    title: "Every change has an author and a time.",
    text: "Grades, enrollment, payments and lesson approvals are traceable. When something changes, the school can see who, what and when.",
    footer: "Accountability without extra work.",
    icon: History,
    visual: <AuditVisual />,
  },
  {
    eyebrow: "Protected school data",
    title: "One school's records never reach another's.",
    text: "Each institution runs inside its own boundary. Data is separated by school and governed by access rules the school defines.",
    footer: "Boundaries the school controls.",
    icon: Building2,
    visual: <BoundaryVisual />,
  },
  {
    eyebrow: "Teacher-governed AI",
    title: "AI proposes. The teacher approves.",
    text: "Generated lessons, quizzes and feedback stay in review until a teacher signs off. Nothing reaches students without a human decision.",
    footer: "Human judgment stays in charge.",
    icon: UserCheck,
    visual: <ReviewVisual />,
  },
];

// Band 7: trust. A header row (headline left, lead right) and then four
// full-width feature cards that stick under the nav and stack over one another
// as the page scrolls, alternating which side carries the visual. Below the
// desktop breakpoint they simply flow, visual first.
export function Trust() {
  return (
    <Section
      theme="light"
      tone="paper"
      id="security"
      className="py-[105px] md:py-[150px]"
    >
      <Container>
        <div className="mb-16 grid grid-cols-1 gap-8 lg:mb-20 lg:grid-cols-[1.15fr_.85fr] lg:items-end">
          <div>
            <Reveal>
              <Eyebrow>Trust by design</Eyebrow>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="text-display-2">
                Intelligence
                <br />
                <span className="text-muted">the whole school can trust.</span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <p className="text-lead max-w-[440px] text-muted lg:ml-auto">
              Access control, audit history, data boundaries and teacher review are part of
              the foundation, not features added later.
            </p>
          </Reveal>
        </div>

        <ol className="grid gap-5 lg:gap-0">
          {cards.map((card, i) => {
            const flip = i % 2 === 1;
            return (
              <li
                key={card.eyebrow}
                className="lg:sticky lg:top-[112px] lg:pb-6"
              >
                <article
                  className={[
                    "grid overflow-hidden rounded-[22px] border border-line bg-white",
                    // Never taller than the space under the pinned offset, so the
                    // card's footer is always on screen on short laptops.
                    "lg:min-h-[min(600px,calc(100dvh-136px))] lg:grid-cols-2",
                    flip ? "lg:[&>*:first-child]:order-2" : "",
                  ].join(" ")}
                >
                  <div className="flex flex-col p-8 md:p-12 lg:p-14">
                    <Eyebrow className="flex items-center gap-2.5">
                      <span aria-hidden className="size-1.5 rounded-full bg-ink" />
                      {card.eyebrow}
                    </Eyebrow>
                    <div className="my-auto py-8">
                      <h3 className="mb-4 max-w-[420px] text-[34px] leading-[1.05] font-semibold tracking-[-0.04em]">
                        {card.title}
                      </h3>
                      <p className="max-w-[430px] leading-[1.6] text-muted">{card.text}</p>
                    </div>
                    <p className="flex items-center gap-2.5 text-[15px] tracking-[-0.01em] text-muted">
                      <card.icon aria-hidden className="size-[18px] text-ink" strokeWidth={1.75} />
                      {card.footer}
                    </p>
                  </div>

                  <div
                    className="grid place-items-center bg-night bg-[radial-gradient(circle_at_50%_110%,rgba(255,255,255,.14),transparent_60%)] p-8 max-sm:min-h-[420px] md:p-12 lg:p-14"
                  >
                    {card.visual}
                  </div>
                </article>
              </li>
            );
          })}
        </ol>
      </Container>
    </Section>
  );
}
