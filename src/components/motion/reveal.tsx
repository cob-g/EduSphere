"use client";

import { useRef, type ElementType, type ReactNode } from "react";

import { gsap, MOTION_QUERIES, useGSAP } from "@/lib/animations/gsap";

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Seconds. Use to stagger siblings (0, 0.1, 0.2…). */
  delay?: number;
  /** Pixels the element travels up while fading in. */
  distance?: number;
};

// Scroll-triggered fade-up (replaces `.reveal` in the reference). Content is
// server-rendered in its final state; GSAP hides then animates it after
// hydration, and reduced-motion users never see it move.
export function Reveal({
  children,
  as: Tag = "div",
  className = "",
  delay = 0,
  distance = 32,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(() => {
    const el = ref.current;
    if (!el) return;
    gsap.matchMedia().add(MOTION_QUERIES.motionOK, () => {
      gsap.fromTo(
        el,
        { autoAlpha: 0, y: distance },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          delay,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        },
      );
    });
  });

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} className={className}>
      {children}
    </Tag>
  );
}
