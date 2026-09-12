import { Compass, SlidersHorizontal, Timer, type LucideIcon } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Section } from "@/components/ui/section";
import { contactEmail } from "@/lib/constants/nav";

import { ProposalScale } from "./proposal-scale";

type Benefit = { icon: LucideIcon; title: string; text: string };

const benefits: Benefit[] = [
  {
    icon: SlidersHorizontal,
    title: "Tailored for your school",
    text: "Every proposal is shaped around your size, workflow, and rollout goals.",
  },
  {
    icon: Compass,
    title: "Guided onboarding",
    text: "We help your team get started smoothly with a structured implementation plan.",
  },
  {
    icon: Timer,
    title: "Fast setup",
    text: "Most schools can begin piloting within a short onboarding window.",
  },
];

// Band 8: pricing, without a price list. A centred header, three benefits on
// hairlines, and then a dark slab in the hero device's finish that carries the
// argument itself: the same platform should not cost a 200-student school what
// it costs a 10,000-student university. The slab's right half is an
// interactive proposal that reshapes with school size.
export function Pricing() {
  const mailto = `mailto:${contactEmail}`;

  return (
    <Section theme="light" tone="white" id="pricing" className="py-[105px] md:py-[150px]">
      <Container>
        <div className="mx-auto max-w-[880px] text-center">
          <Reveal>
            <Eyebrow variant="pill">Pricing</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="text-display-2">
              No public pricing.
              <br />
              <span className="text-accent-serif text-muted">Just a custom proposal.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-lead mx-auto mt-7 max-w-[640px] text-muted">
              Tell us about your institution and we&apos;ll recommend the best setup for your
              school.
            </p>
          </Reveal>
        </div>

        <ul className="mt-16 grid gap-10 md:mt-20 md:grid-cols-3 md:gap-0 md:divide-x md:divide-line">
          {benefits.map((b, i) => (
            <Reveal key={b.title} as="li" delay={i * 0.08} className="md:px-10 md:first:pl-0 md:last:pr-0">
              <div className="grid size-[42px] place-items-center rounded-[14px] border border-line text-ink">
                <b.icon aria-hidden className="size-5" strokeWidth={1.75} />
              </div>
              <h3 className="mt-5 text-[19px] font-semibold tracking-[-0.03em]">{b.title}</h3>
              <p className="mt-2 max-w-[320px] text-[15px] leading-[1.6] text-muted">{b.text}</p>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={0.1} className="mt-16 md:mt-20">
          <div
            data-theme="dark"
            className="relative overflow-hidden rounded-card bg-night-2 text-white ring-device-dark max-sm:rounded-[30px]"
          >
            {/* Soft light from above, as on the AI Teacher stage */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(60% 50% at 30% 0%, rgba(255,255,255,.10), transparent 60%)",
              }}
            />

            <div className="relative grid lg:grid-cols-[1.05fr_.95fr]">
              <div className="flex flex-col p-8 md:p-12 lg:p-14">
                <Eyebrow className="flex items-center gap-2.5">
                  <span aria-hidden className="size-1.5 rounded-full bg-white" />
                  Why no public pricing?
                </Eyebrow>
                <h3 className="mt-1 max-w-[560px] text-[clamp(28px,3.4vw,44px)] leading-[1.05] font-semibold tracking-[-0.04em]">
                  A 200-student school should not pay the same as a 10,000-student university.
                </h3>
                <p className="mt-5 max-w-[440px] leading-[1.6] text-muted-dark">
                  We build a proposal that fits your needs.
                </p>
                <div className="mt-9 lg:mt-auto lg:pt-10">
                  <Button href={mailto} variant="primary" arrow>
                    Request a Demo
                  </Button>
                </div>
              </div>

              <div className="grid place-items-center border-t border-white/10 p-8 md:p-12 lg:border-t-0 lg:border-l lg:p-14">
                <ProposalScale />
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
