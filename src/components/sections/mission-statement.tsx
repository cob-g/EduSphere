"use client";

import { useRef } from "react";

import { gsap, MOTION_QUERIES, useGSAP } from "@/lib/animations/gsap";

const LINE_1 = "A school shouldn't feel like five systems stitched together.";
const LINE_2 = "It should feel like one.";

const DIM = "rgba(255,255,255,0.25)";

function Words({ text, to }: { text: string; to: string }) {
  return text.split(" ").map((word, i) => (
    <span key={`${word}-${i}`}>
      <span data-word data-to={to}>
        {word}
      </span>{" "}
    </span>
  ));
}

// Big statement whose words brighten from white/25 to their final colour as the
// reader scrolls (GSAP scrub). Server-rendered in the final state, so
// reduced-motion users (and no-JS) read it fully lit.
export function MissionStatement() {
  const ref = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      gsap.matchMedia().add(MOTION_QUERIES.motionOK, () => {
        const words = gsap.utils.toArray<HTMLElement>("[data-word]", el);
        gsap.fromTo(
          words,
          { color: DIM },
          {
            color: (_, target: HTMLElement) => target.dataset.to ?? "#fff",
            ease: "none",
            stagger: 0.08,
            scrollTrigger: {
              trigger: el,
              start: "top 80%",
              end: "bottom 45%",
              scrub: 0.6,
            },
          },
        );
      });
    },
    { scope: ref },
  );

  return (
    <p
      ref={ref}
      className="max-w-[1080px] text-[clamp(56px,8vw,112px)] leading-[0.95] font-semibold tracking-[-0.06em] max-sm:text-[14vw]"
    >
      <Words text={LINE_1} to="#ffffff" />
      <Words text={LINE_2} to="#727278" />
    </p>
  );
}
