"use client";

import { useRef } from "react";

import { Container } from "@/components/ui/container";
import { gsap, MOTION_QUERIES, useGSAP } from "@/lib/animations/gsap";

import { HeroAtmosphere, HeroForeground } from "./hero-atmosphere";
import { HeroCopy } from "./hero-copy";
import { HeroWindow } from "./hero-window";

// Composes the hero's layers and drives their motion. Farther layers lag more
// behind the scroll, the clouds also drift sideways on their own, the copy
// recedes, and the device — leaning back at rest — straightens up as it rises.
const PARALLAX: Array<[selector: string, y: number]> = [
  ['[data-hero="sky"]', 70],
  ['[data-hero="cloud-far"]', 120],
  ['[data-hero="cloud-near"]', 90],
  ['[data-hero="stars"]', 110],
  ['[data-hero="ridge-mid"]', 85],
  ['[data-hero="fog-near"]', 60],
  ['[data-hero="ridge-near"]', 40],
  ['[data-hero="floor"]', 20],
  // Foreground layers sit nearer than the content, so they move against it.
  ['[data-hero="ridge-fore"]', -60],
  ['[data-hero="fog-fore"]', -45],
];

export function HeroScene() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      gsap.matchMedia().add(MOTION_QUERIES.motionOK, () => {
        const scrollTrigger = { trigger: root, start: "top top", end: "bottom top", scrub: 1 };

        for (const [selector, y] of PARALLAX) {
          gsap.to(selector, { y, ease: "none", scrollTrigger });
        }

        // Idle drift for the clouds (time-driven, on x — never fights the
        // scroll-driven y above because GSAP composes transforms per axis).
        gsap.utils.toArray<HTMLElement>('[data-hero^="cloud"]').forEach((bank) => {
          gsap.to(bank, {
            x: Number(bank.dataset.drift ?? 30),
            duration: Number(bank.dataset.period ?? 24),
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          });
        });

        gsap.to('[data-hero="copy"]', {
          y: -70,
          opacity: 0.15,
          ease: "none",
          scrollTrigger: { ...scrollTrigger, end: "55% top" },
        });

        // Device: tilted back 9° at rest, flat once it has risen into view.
        // Targets the wrapper, not the Motion-animated slab, so the two
        // libraries never write the same transform.
        gsap.fromTo(
          '[data-hero="window"]',
          { rotateX: 9, transformOrigin: "50% 100%", transformPerspective: 1800 },
          {
            rotateX: 0,
            y: -40,
            ease: "none",
            scrollTrigger: { trigger: root, start: "top top", end: "45% top", scrub: 1 },
          },
        );
      });
    },
    { scope },
  );

  return (
    <div ref={scope} className="relative">
      <HeroAtmosphere />

      <div className="relative pt-[150px] pb-[170px] max-[680px]:pt-[112px] max-[680px]:pb-[120px]">
        <Container as="header" className="max-w-[1040px] text-center">
          <HeroCopy />
        </Container>
        <HeroWindow />
      </div>

      <HeroForeground />
    </div>
  );
}
