import type { ReactNode } from "react";

import { Reveal } from "@/components/motion/reveal";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Section } from "@/components/ui/section";

import { ServicesIndex } from "./services-index";
import {
  AcademicVisual,
  AnalyticsVisual,
  ConsultingVisual,
  InstitutionalVisual,
  SupportVisual,
} from "./services-visuals";

type Group = { letter: string; name: string; visual: ReactNode; items: string[] };

// Fifteen services in five categories. Each category is shown as a rendered
// image of the product; the service names ride along as numbered captions.
const groups: Group[] = [
  {
    letter: "A",
    visual: <AcademicVisual />,
    name: "AI Academic Systems",
    items: [
      "Intelligent Learning Management System (AI-LMS)",
      "Adaptive Learning Platforms",
      "AI-based Assessment Tools",
    ],
  },
  {
    letter: "B",
    visual: <InstitutionalVisual />,
    name: "Institutional Systems",
    items: [
      "Smart Enrollment & Scheduling",
      "Student Information System with Analytics",
      "Faculty Performance Monitoring",
    ],
  },
  {
    letter: "C",
    visual: <SupportVisual />,
    name: "AI Student Support",
    items: [
      "AI Chatbots for Admissions & Student Services",
      "Predictive Analytics for Student Retention",
      "Personalised Academic Advising",
    ],
  },
  {
    letter: "D",
    visual: <AnalyticsVisual />,
    name: "Data & Analytics",
    items: [
      "Administrator Dashboard",
      "Academic Performance Forecasting",
      "Accreditation & Compliance Reporting",
    ],
  },
  {
    letter: "E",
    visual: <ConsultingVisual />,
    name: "Digital Transformation Consulting",
    items: [
      "IT Infrastructure Planning",
      "CHED-aligned System Development",
      "Faculty Training & Upskilling",
    ],
  },
];

const groupId = (g: Group) => `services-${g.letter.toLowerCase()}`;
const pad = (n: number) => String(n).padStart(2, "0");

// Numbering runs 01 to 15 across the groups; computed once here rather than
// counted during render.
const numbered = groups.reduce<Array<Group & { first: number; last: number }>>((acc, g) => {
  const first = (acc.at(-1)?.last ?? 0) + 1;
  return [...acc, { ...g, first, last: first + g.items.length - 1 }];
}, []);

// Band 8: the full catalogue. The left column sticks: headline, lead, and the
// A to E list that tracks the scroll. The right column is five image panels,
// one per category, each a rendered view of that part of the product with the
// category's services as numbered captions. Dark, so the page keeps
// alternating between Trust and Pricing.
export function Services() {
  return (
    <Section theme="dark" tone="night" id="services" className="py-[105px] md:py-[150px]">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[.85fr_1.15fr] lg:gap-20">
          <div className="lg:sticky lg:top-[112px] lg:self-start">
            <Reveal>
              <Eyebrow>Core services</Eyebrow>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="text-display-2">
                All services.
                <br />
                <span className="text-muted-dark">Five categories.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-lead mt-7 max-w-[440px] text-muted-dark">
                AI-powered services for how Philippine institutions teach, manage and grow.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <ServicesIndex
                entries={groups.map((g) => ({ id: groupId(g), letter: g.letter, name: g.name }))}
              />
            </Reveal>
          </div>

          <div className="grid gap-10 lg:gap-14">
            {numbered.map((g, gi) => (
              <Reveal key={g.letter} as="section" delay={gi * 0.05}>
                <div
                  id={groupId(g)}
                  className="relative flex min-h-[520px] scroll-mt-[112px] flex-col overflow-hidden rounded-[22px] border border-white/[0.14] bg-[#111114] p-7 shadow-[0_40px_90px_-40px_rgba(0,0,0,.9)] max-sm:min-h-0 md:p-8"
                >
                  {/* Light from above, like the AI Teacher stage */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(70% 55% at 50% -10%, rgba(255,255,255,.12), transparent 60%)",
                    }}
                  />

                  <div className="relative flex items-baseline gap-4">
                    <span className="text-[44px] leading-none font-semibold tracking-[-0.05em]">
                      {g.letter}
                    </span>
                    <h3 className="text-[19px] font-semibold tracking-[-0.03em]">{g.name}</h3>
                    <span className="ml-auto text-[11px] text-white/40 tabular-nums">
                      {pad(g.first)}–{pad(g.last)}
                    </span>
                  </div>

                  <div className="relative grid flex-1 place-items-center py-8 md:py-10">
                    {g.visual}
                  </div>

                  <ol className="relative flex flex-wrap gap-2">
                    {g.items.map((title, i) => (
                      <li
                        key={title}
                        className="inline-flex items-baseline gap-2 rounded-pill border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[12px] text-white/85"
                      >
                        <span className="text-[10px] text-white/40 tabular-nums">{pad(g.first + i)}</span>
                        {title}
                      </li>
                    ))}
                  </ol>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
