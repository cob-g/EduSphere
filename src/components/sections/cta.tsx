import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/motion/reveal";
import { contactEmail } from "@/lib/constants/nav";

import { CtaWatermark } from "./cta-watermark";

export function Cta() {
  const mailto = `mailto:${contactEmail}`;
  return (
    <Section theme="dark" tone="night" id="cta" className="pt-[160px] pb-[110px] text-center">
      <Container>
        <Reveal>
          <Eyebrow>One Platform. Complete School Intelligence.</Eyebrow>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="text-display-2 mx-auto mb-7 max-w-[950px]">
            The school, intelligently connected.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-lead mx-auto max-w-[780px] text-muted-dark">
            See what EduSphere can look like inside your institution.
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="mt-[34px] flex flex-wrap justify-center gap-3">
            <Button href={mailto} variant="primary">
              Book a Demo
            </Button>
            <Button href={mailto} variant="ghost" arrow>
              Talk to Our Team
            </Button>
          </div>
        </Reveal>
        <CtaWatermark />
      </Container>
    </Section>
  );
}
