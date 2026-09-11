"use client";

import { useRef } from "react";

import { gsap, MOTION_QUERIES, useGSAP } from "@/lib/animations/gsap";

// Giant outlined wordmark under the CTA: a hairline stroke with a faint fill,
// fading out toward the footer. Drifts sideways a little as the user scrolls
// through the band (scrubbed, so it tracks the scrollbar).
export function CtaWatermark() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = ref.current;
    if (!el) return;
    gsap.matchMedia().add(MOTION_QUERIES.motionOK, () => {
      gsap.fromTo(
        el,
        { xPercent: -3 },
        {
          xPercent: 3,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 1.2 },
        },
      );
    });
  });

  return (
    <div
      ref={ref}
      aria-hidden
      className="mt-[90px] -mb-[35px] text-[26vw] leading-none font-semibold tracking-[-0.08em] whitespace-nowrap text-white/[0.06] select-none [-webkit-text-stroke:1.5px_rgba(255,255,255,.28)] md:-mb-[70px] md:text-[clamp(90px,15vw,205px)]"
      style={{
        maskImage: "linear-gradient(180deg, #000 30%, rgba(0,0,0,.15) 100%)",
        WebkitMaskImage: "linear-gradient(180deg, #000 30%, rgba(0,0,0,.15) 100%)",
      }}
    >
      EDUSPHERE
    </div>
  );
}
