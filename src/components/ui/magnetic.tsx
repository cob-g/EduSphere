"use client";

import { useRef, type ReactNode } from "react";

import { gsap, MOTION_QUERIES, useGSAP } from "@/lib/animations/gsap";

type MagneticProps = {
  children: ReactNode;
  /** How far the element follows the pointer (0–1). */
  strength?: number;
  className?: string;
};

// Physics-feel hover: the wrapped element leans toward the pointer while it is
// over it and springs back when it leaves. Pointer-only; touch and
// reduced-motion users get a static element.
export function Magnetic({ children, strength = 0.35, className = "" }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      gsap.matchMedia().add(`${MOTION_QUERIES.motionOK} and ${MOTION_QUERIES.finePointer}`, () => {
        const onMove = (e: MouseEvent) => {
          const r = el.getBoundingClientRect();
          const x = e.clientX - r.left - r.width / 2;
          const y = e.clientY - r.top - r.height / 2;
          gsap.to(el, {
            x: x * strength,
            y: y * strength,
            rotationX: -y * 0.12,
            rotationY: x * 0.12,
            scale: 1.04,
            transformPerspective: 700,
            duration: 0.4,
            ease: "power2.out",
          });
        };
        const onLeave = () => {
          gsap.to(el, {
            x: 0,
            y: 0,
            rotationX: 0,
            rotationY: 0,
            scale: 1,
            duration: 1.2,
            ease: "elastic.out(1, 0.3)",
          });
        };
        el.addEventListener("mousemove", onMove);
        el.addEventListener("mouseleave", onLeave);
        return () => {
          el.removeEventListener("mousemove", onMove);
          el.removeEventListener("mouseleave", onLeave);
        };
      });
    },
    { scope: ref, dependencies: [strength] },
  );

  return (
    <div ref={ref} className={`inline-block will-change-transform ${className}`}>
      {children}
    </div>
  );
}
