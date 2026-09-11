"use client";

import { CircleCheck } from "lucide-react";
import { motion } from "motion/react";
import { useRef } from "react";

import { gsap, MOTION_QUERIES, ScrollTrigger, useGSAP } from "@/lib/animations/gsap";

const checks = [
  `GSAP ${gsap.version}`,
  `ScrollTrigger ${ScrollTrigger.version}`,
  "Motion for React",
  "Lucide React",
];

// Development placeholder: proves GSAP, ScrollTrigger, Motion and Lucide load and
// hydrate in a Client Component. Delete together with the placeholder homepage.
export function StackCheck() {
  const bar = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.matchMedia().add(MOTION_QUERIES, (context) => {
      gsap.to(bar.current, {
        scaleX: 1,
        duration: context.conditions?.reduceMotion ? 0 : 0.8,
        ease: "power2.out",
      });
    });
  });

  return (
    <section aria-label="Stack check" className="mt-8 space-y-4 text-sm text-neutral-600">
      <ul className="space-y-1.5">
        {checks.map((label) => (
          <li key={label} className="flex items-center gap-2">
            <CircleCheck aria-hidden className="size-4 text-neutral-900" />
            {label}
          </li>
        ))}
      </ul>
      <div className="h-px bg-neutral-200">
        <div ref={bar} className="h-full origin-left scale-x-0 bg-neutral-900" />
      </div>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        Client components hydrated.
      </motion.p>
    </section>
  );
}
