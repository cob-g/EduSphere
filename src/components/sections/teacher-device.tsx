"use client";

import { motion } from "motion/react";
import { useRef } from "react";

import { Eyebrow } from "@/components/ui/eyebrow";
import { gsap, MOTION_QUERIES, useGSAP } from "@/lib/animations/gsap";

const STATUS = [
  { label: "Lesson context", value: "Grounded", active: true },
  { label: "Voice narration", value: "On" },
  { label: "Student Q&A", value: "Enabled" },
  { label: "Quiz", value: "Ready" },
];

const bubble = {
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.6 },
} as const;

function bubbleDelay(index: number) {
  return { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const, delay: index * 0.25 };
}

// The dark glass "teacher device": lesson stage on the left, tutor panel on the
// right. Scales/fades in with a scrubbed ScrollTrigger; chat bubbles arrive in
// sequence with Motion.
export function TeacherDevice() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      gsap.matchMedia().add(MOTION_QUERIES.motionOK, () => {
        gsap.fromTo(
          el,
          { scale: 0.94, opacity: 0.25 },
          {
            scale: 1,
            opacity: 1,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top 92%", end: "top 40%", scrub: 0.8 },
          },
        );
      });
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      className="ring-device-dark grid h-[610px] w-[min(1000px,calc(100%-34px))] grid-cols-[1.2fr_.8fr] overflow-hidden rounded-device border border-white/15 will-change-transform max-lg:h-auto max-lg:grid-cols-1 max-sm:w-[calc(100%-22px)] max-sm:rounded-[30px]"
      style={{ background: "linear-gradient(145deg,#0d0f14,#050506)" }}
    >
      {/* Lesson stage */}
      <div
        aria-hidden
        className="relative grid place-items-center border-r border-[#20242b] max-lg:min-h-[420px] max-lg:border-r-0 max-lg:border-b max-sm:min-h-[320px]"
        style={{
          background:
            "radial-gradient(circle at 45% 35%,rgba(255,255,255,.09),transparent 34%)," +
            "linear-gradient(160deg,#15161b,#07080b 60%)",
        }}
      >
        <div className="relative aspect-[16/10] w-[74%] -translate-y-2.5 rounded-panel bg-white p-[31px] text-[#0b0b0c] shadow-[0_32px_70px_rgba(0,0,0,.42)] max-sm:w-[82%] max-sm:p-[22px]">
          <div>
            <small className="text-[9px] text-muted">GRADE 8 • MATHEMATICS</small>
            <h3 className="mt-[18px] mb-3 text-[35px] leading-none font-semibold tracking-[-0.04em] max-sm:text-[27px]">
              Pythagorean Theorem
            </h3>
            <p className="max-w-[58%] text-[13px] leading-[1.55] text-[#68686d]">
              Understand the relationship between the sides of a right triangle.
            </p>
          </div>
          {/* Right triangle */}
          <div
            className="absolute right-[29px] bottom-[27px] size-0 border-b-[108px] border-l-[140px] border-b-[#e8e8ec] border-l-transparent drop-shadow-[0_12px_18px_rgba(0,0,0,.08)] max-sm:border-b-[76px] max-sm:border-l-[98px]"
          />
        </div>

        {/* AI avatar */}
        <div
          className="absolute right-[8%] bottom-[8%] grid size-[138px] place-items-center rounded-full border border-white/50 text-[44px] font-semibold tracking-[-0.04em] text-[#0a0a0b] shadow-[0_0_75px_rgba(255,255,255,.12)] max-sm:size-[94px] max-sm:text-[30px]"
          style={{ background: "radial-gradient(circle at 45% 35%,#f2f2f5,#8e8e96 55%,#26262b)" }}
        >
          AI
        </div>
      </div>

      {/* Tutor panel */}
      <div className="flex flex-col p-[30px] max-lg:min-h-[420px]">
        <Eyebrow className="mb-5">AI Teacher Mode</Eyebrow>

        <motion.div
          {...bubble}
          transition={bubbleDelay(0)}
          className="rounded-[19px] border border-[#252a32] bg-[#0e1014] p-[17px] text-[14px] leading-[1.6] text-[#c2c7d0]"
        >
          “Imagine natin na may right triangle. The Pythagorean Theorem helps us relate its three
          sides…”
        </motion.div>

        <motion.div
          {...bubble}
          transition={bubbleDelay(1)}
          className="mt-[18px] max-w-[86%] self-end rounded-[18px_18px_5px_18px] border border-white/20 bg-[#17181c] px-[15px] py-[13px] text-[12px] text-[#e5e5ea]"
        >
          Can you explain that again in Taglish?
        </motion.div>

        <motion.div
          {...bubble}
          transition={bubbleDelay(2)}
          className="mt-2.5 rounded-[18px_18px_18px_5px] border border-[#252a32] bg-[#0d0f12] px-[15px] py-[13px] text-[12px] leading-[1.55] text-[#b8c0ca]"
        >
          Sure. Isipin natin na may right triangle. The longest side is the hypotenuse, and
          that&apos;s the side represented by <b className="font-semibold text-white">c</b>.
        </motion.div>

        <ul className="mt-auto border-t border-[#22262d] pt-0">
          {STATUS.map((row) => (
            <li
              key={row.label}
              className={`flex justify-between border-b border-[#22262d] py-3 text-[10px] ${
                row.active ? "text-white" : "text-[#727a86]"
              }`}
            >
              <span>{row.label}</span>
              <span className={row.active ? "font-medium text-white" : ""}>{row.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
