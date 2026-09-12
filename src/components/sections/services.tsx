import { Reveal } from "@/components/motion/reveal";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Section } from "@/components/ui/section";

import { ServicesIndex } from "./services-index";

type Service = { title: string; text: string };
type Group = { letter: string; name: string; items: Service[] };

// Fifteen services in five categories. Descriptions are cut to one line each
// but keep every claim from the source copy.
const groups: Group[] = [
  {
    letter: "A",
    name: "AI Academic Systems",
    items: [
      {
        title: "Intelligent Learning Management System (AI-LMS)",
        text: "Adapts to each student's pace, tracks engagement and delivers personalised content automatically.",
      },
      {
        title: "Adaptive Learning Platforms",
        text: "Learning paths that keep adjusting to each student's strengths, weaknesses and pace.",
      },
      {
        title: "AI-based Assessment Tools",
        text: "Automated grading, intelligent question generation and real-time assessment analytics.",
      },
    ],
  },
  {
    letter: "B",
    name: "Institutional Systems",
    items: [
      {
        title: "Smart Enrollment & Scheduling",
        text: "Automated section assignment, schedule conflict detection and live slot tracking per course.",
      },
      {
        title: "Student Information System with Analytics",
        text: "Complete profiles, grade analytics, academic history and AI retention forecasting.",
      },
      {
        title: "Faculty Performance Monitoring",
        text: "Teaching evaluation, workload management and performance analytics for academic faculty.",
      },
    ],
  },
  {
    letter: "C",
    name: "AI Student Support",
    items: [
      {
        title: "AI Chatbots for Admissions & Student Services",
        text: "Admissions inquiries, service requests and FAQs answered around the clock.",
      },
      {
        title: "Predictive Analytics for Student Retention",
        text: "Flags at-risk students early and recommends timely, personalised interventions.",
      },
      {
        title: "Personalised Academic Advising",
        text: "Data-driven guidance on course selection, career paths and academic progress.",
      },
    ],
  },
  {
    letter: "D",
    name: "Data & Analytics",
    items: [
      {
        title: "Administrator Dashboard",
        text: "A real-time view of enrollment, performance and compliance data in one place.",
      },
      {
        title: "Academic Performance Forecasting",
        text: "Forecasts student outcomes, course demand and institutional trends for planning.",
      },
      {
        title: "Accreditation & Compliance Reporting",
        text: "Automated CHED-aligned reports, accreditation checklists and audit documentation.",
      },
    ],
  },
  {
    letter: "E",
    name: "Digital Transformation Consulting",
    items: [
      {
        title: "IT Infrastructure Planning",
        text: "Assessment and design of secure, cloud-based infrastructure sized to your institution.",
      },
      {
        title: "CHED-aligned System Development",
        text: "Custom software built to CHED policies, academic standards and Philippine regulations.",
      },
      {
        title: "Faculty Training & Upskilling",
        text: "Hands-on programmes that equip educators to use AI tools and digital platforms well.",
      },
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

// Band 8: the full catalogue, as an index rather than a wall of cards. The
// left column sticks: headline, lead, and the A to E list that tracks the
// scroll. The right column is fifteen numbered hairline rows. Dark, so the
// page keeps alternating between Trust and Pricing.
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

          <div>
            {numbered.map((g, gi) => (
              <Reveal
                key={g.letter}
                as="section"
                delay={gi * 0.05}
                className={gi === 0 ? "" : "mt-14"}
              >
                <div id={groupId(g)} className="scroll-mt-[112px]">
                  <div className="mb-3 flex items-baseline gap-4">
                    <span className="text-[44px] leading-none font-semibold tracking-[-0.05em]">
                      {g.letter}
                    </span>
                    <h3 className="text-[19px] font-semibold tracking-[-0.03em]">{g.name}</h3>
                    <span className="ml-auto text-[11px] text-white/40 tabular-nums">
                      {pad(g.first)}–{pad(g.last)}
                    </span>
                  </div>
                  <ol className="divide-y divide-white/10 border-y border-white/10">
                    {g.items.map((item, i) => {
                      const n = g.first + i;
                      return (
                        <li
                          key={item.title}
                          className="group grid gap-x-6 gap-y-1 py-4 transition-colors duration-300 ease-apple md:grid-cols-[36px_1fr_1.1fr] md:items-baseline"
                        >
                          <span className="text-[11px] text-white/40 tabular-nums transition-colors duration-300 ease-apple group-hover:text-white">
                            {pad(n)}
                          </span>
                          <span className="text-[15px] font-medium tracking-[-0.01em] text-white">
                            {item.title}
                          </span>
                          <span className="text-[13.5px] leading-[1.55] text-muted-dark">
                            {item.text}
                          </span>
                        </li>
                      );
                    })}
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
