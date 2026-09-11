import { Section } from "@/components/ui/section";

import { HeroScene } from "./hero-scene";

// Band 1: the opening hero. A layered daylight scene in the spirit of
// fora.so's hero — atmosphere, depth layers, a product slab, copy on top —
// but as a white studio rather than a dusk landscape: mist instead of hills,
// a floor with shadow and reflection, and the real EduSphere overview inside
// the glass. The Section shell keeps the data-theme the nav relies on.
export function Hero() {
  return (
    <Section theme="light" tone="paper" id="top" className="min-h-dvh">
      <HeroScene />
    </Section>
  );
}
