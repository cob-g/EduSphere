import { Reveal } from "@/components/motion/reveal";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Section } from "@/components/ui/section";

import { MissionStatement } from "./mission-statement";

// Band 2: full-bleed black statement.
export function Mission() {
  return (
    <Section theme="dark" tone="night" className="py-[180px] max-sm:py-[130px]">
      <Container>
        <Reveal>
          <Eyebrow variant="pill">The idea</Eyebrow>
          <MissionStatement />
        </Reveal>
      </Container>
    </Section>
  );
}
