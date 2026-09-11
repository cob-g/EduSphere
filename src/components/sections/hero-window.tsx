"use client";

import {
  BarChart3,
  BookOpen,
  ChevronDown,
  ClipboardList,
  LayoutGrid,
  Plus,
  Search,
  ShieldCheck,
  Users,
  Wallet,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";

// ---------------------------------------------------------------------------
// The device: a light glass slab standing on the studio floor, with a contact
// shadow and a floor reflection. Where fora.so shows a community's landing
// page, this shows the product itself — the teaching workspace — and switches
// between schools the way an administrator would from the school picker.
// ---------------------------------------------------------------------------

const ACTIVE = 1; // Teaching

const SIDEBAR = [
  { label: "Overview", icon: LayoutGrid },
  { label: "Teaching", icon: BookOpen },
  { label: "Registrar", icon: ClipboardList },
  { label: "Finance", icon: Wallet },
  { label: "Students", icon: Users },
  { label: "Analytics", icon: BarChart3 },
  { label: "Security", icon: ShieldCheck },
] as const;

type LessonStatus = "approved" | "analyzing" | "draft";

const SCHOOLS = [
  {
    name: "San Isidro Academy",
    teacher: "Good morning, Ms. Reyes.",
    klass: "Grade 8 · Mathematics",
    live: "96 sections live",
    kpis: [
      ["Lessons this term", "24"],
      ["AI lessons approved", "18"],
      ["Average quiz score", "86%"],
    ],
    lessons: [
      { title: "Pythagorean Theorem", meta: "12 pages · Taglish narration", status: "approved" as LessonStatus },
      { title: "Quadratic Equations", meta: "Understanding source · 64%", status: "analyzing" as LessonStatus, progress: 64 },
      { title: "Linear Functions", meta: "Uploaded today", status: "draft" as LessonStatus },
    ],
    insight:
      "Section 8-B struggled with hypotenuse problems in the last quiz. A guided 3-4-5 example is ready to add.",
  },
  {
    name: "Mabini Science High School",
    teacher: "Good morning, Mr. Santos.",
    klass: "Grade 9 · Mathematics",
    live: "58 sections live",
    kpis: [
      ["Lessons this term", "19"],
      ["AI lessons approved", "15"],
      ["Average quiz score", "89%"],
    ],
    lessons: [
      { title: "Systems of Equations", meta: "9 pages · English narration", status: "approved" as LessonStatus },
      { title: "Radical Expressions", meta: "Understanding source · 41%", status: "analyzing" as LessonStatus, progress: 41 },
      { title: "Variation", meta: "Uploaded yesterday", status: "draft" as LessonStatus },
    ],
    insight:
      "Quiz scores rose 11% after the approved AI lessons went live. Students ask most about factoring.",
  },
  {
    name: "Lumen International School",
    teacher: "Good morning, Ms. Lim.",
    klass: "Grade 10 · Science",
    live: "31 sections live",
    kpis: [
      ["Lessons this term", "16"],
      ["AI lessons approved", "14"],
      ["Average quiz score", "91%"],
    ],
    lessons: [
      { title: "Plate Tectonics", meta: "14 pages · English narration", status: "approved" as LessonStatus },
      { title: "Electromagnetism", meta: "Understanding source · 78%", status: "analyzing" as LessonStatus, progress: 78 },
      { title: "Chemical Bonds", meta: "Uploaded today", status: "draft" as LessonStatus },
    ],
    insight:
      "Three students asked the AI Teacher about subduction zones this week. A short recap is suggested.",
  },
] as const;

const STATUS: Record<LessonStatus, { label: string; className: string }> = {
  approved: { label: "Approved", className: "bg-[rgba(42,39,37,.9)] text-white" },
  analyzing: { label: "Analyzing…", className: "border border-black/10 text-ink" },
  draft: { label: "Draft", className: "bg-[#f0f0f3] text-muted" },
};

const ROTATE_MS = 5400;

const swap = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
};

export function HeroWindow() {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const school = SCHOOLS[index];

  useEffect(() => {
    if (reduceMotion) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % SCHOOLS.length), ROTATE_MS);
    return () => window.clearInterval(id);
  }, [reduceMotion]);

  return (
    <div
      data-hero="window"
      className="relative mx-auto mt-[72px] w-[min(1040px,calc(100%-24px))] max-[680px]:mt-12"
    >
      {/* Contact shadow on the floor */}
      <div
        aria-hidden
        className="absolute inset-x-[8%] -bottom-10 h-24 rounded-[50%] blur-2xl"
        style={{ background: "radial-gradient(50% 50% at 50% 50%, rgba(0,0,0,.30), transparent 70%)" }}
      />

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 56 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
        className="relative h-[620px] overflow-hidden rounded-[30px] text-ink max-[680px]:h-[600px] max-[680px]:rounded-[22px]"
        style={{
          background: "transparent",
          boxShadow:
            "0 50px 120px rgba(0,0,0,.14), 0 14px 34px rgba(0,0,0,.06), inset 0 1px 0 #fff, inset 0 0 0 1px rgba(255,255,255,.7)",
          WebkitBoxReflect: "below 2px linear-gradient(transparent 74%, rgba(0,0,0,.13))",
        }}
      >
        {/* App chrome */}
        <div
          className="relative flex h-[58px] items-center gap-3 px-5 text-white max-[680px]:px-4"
          style={{ background: "rgba(42,39,37,.9)" }}
        >
          <span className="flex items-center gap-2">
            <Image
              src="/brand/edusphere-mark-white.png"
              alt=""
              width={952}
              height={777}
              className="h-[22px] w-auto"
              loading="eager"
            />
            <span className="text-[13px] font-semibold tracking-[-0.02em] max-[680px]:hidden">
              EduSphere
            </span>
          </span>

          <span className="ml-2 inline-flex h-8 items-center gap-1.5 rounded-pill border border-white/15 bg-white/10 px-3 text-[12px] font-medium">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={school.name} {...swap}>
                {school.name}
              </motion.span>
            </AnimatePresence>
            <ChevronDown aria-hidden className="size-3.5 text-white/60" />
          </span>

          <Search aria-hidden className="ml-1 size-4 text-white/55 max-[680px]:hidden" />

          <span className="ml-auto inline-flex items-center gap-2 text-[11px] text-white/60">
            <i className="size-1.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,.9)]" />
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={school.live} {...swap}>
                {school.live}
              </motion.span>
            </AnimatePresence>
          </span>
        </div>

        <div className="grid h-[calc(100%-58px)] grid-cols-[200px_1fr] max-[680px]:grid-cols-1">
          {/* Sidebar. The active item is a tab that merges into the content pane:
              it runs past the sidebar's edge and two small corner pieces carve
              the concave curves above and below it. */}
          <nav
            aria-hidden
            className="py-4 pl-3 max-[680px]:hidden"
            style={{ background: "linear-gradient(180deg, rgba(42,39,37,.9) 0%, rgba(26,24,23,.93) 100%)" }}
          >
            {SIDEBAR.map(({ label, icon: Icon }, i) => (
              <div
                key={label}
                className={`relative flex h-10 items-center gap-2.5 pl-3 text-[12.5px] ${
                  i === ACTIVE
                    ? "rounded-l-[12px] bg-white font-medium text-ink"
                    : "mr-3 rounded-[10px] text-white/65"
                }`}
              >
                {i === ACTIVE && (
                  <>
                    <span
                      className="absolute -top-[14px] right-0 size-[14px]"
                      style={{ background: "radial-gradient(circle at 0 0, transparent 13.5px, #fff 14px)" }}
                    />
                    <span
                      className="absolute -bottom-[14px] right-0 size-[14px]"
                      style={{ background: "radial-gradient(circle at 0 100%, transparent 13.5px, #fff 14px)" }}
                    />
                  </>
                )}
                <Icon aria-hidden className="size-[15px]" strokeWidth={1.75} />
                {label}
              </div>
            ))}
          </nav>

          {/* Teaching workspace */}
          <div className="relative bg-white p-6 max-[680px]:p-4">
            <div className="flex items-end justify-between">
              <div>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.small
                    key={school.klass}
                    {...swap}
                    className="block text-[9px] tracking-[0.08em] text-muted-2 uppercase"
                  >
                    Teaching · {school.klass}
                  </motion.small>
                </AnimatePresence>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.h3
                    key={school.teacher}
                    {...swap}
                    className="mt-1 text-[20px] font-semibold tracking-[-0.03em]"
                  >
                    {school.teacher}
                  </motion.h3>
                </AnimatePresence>
              </div>
              <span className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-pill bg-[rgba(42,39,37,.9)] px-3 text-[11px] font-medium whitespace-nowrap text-white max-[680px]:hidden">
                <Plus aria-hidden className="size-3.5" strokeWidth={2.2} />
                Upload lesson
              </span>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2.5 max-[680px]:grid-cols-2">
              {school.kpis.map(([label, value], i) => (
                <div
                  key={label}
                  className={`rounded-[14px] border border-black/[0.06] bg-white p-3.5 shadow-[0_1px_2px_rgba(0,0,0,.03)] ${
                    i === 2 ? "max-[680px]:hidden" : ""
                  }`}
                >
                  <small className="text-[10px] text-muted-2">{label}</small>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.b
                      key={value}
                      {...swap}
                      className="mt-1 block text-[22px] font-semibold tracking-[-0.03em]"
                    >
                      {value}
                    </motion.b>
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Lessons */}
            <div className="mt-2.5 overflow-hidden rounded-[14px] border border-black/[0.06] bg-white">
              <div className="flex items-center justify-between border-b border-black/[0.06] px-4 py-2.5">
                <small className="text-[10px] font-medium text-ink">Lessons</small>
                <small className="text-[10px] text-muted-2">AI Teacher · teacher-approved</small>
              </div>
              <AnimatePresence mode="wait" initial={false}>
                <motion.ul key={school.name} {...swap} className="divide-y divide-black/[0.06]">
                  {school.lessons.map((lesson, i) => (
                    <li
                      key={lesson.title}
                      className={`flex items-center gap-3 px-4 py-2.5 ${i === 2 ? "max-[680px]:hidden" : ""}`}
                    >
                      <span className="grid size-8 shrink-0 place-items-center rounded-[9px] bg-[#f0f0f3] text-[9px] font-semibold text-ink">
                        PDF
                      </span>
                      <span className="min-w-0 flex-1">
                        <b className="block truncate text-[12px] font-semibold">{lesson.title}</b>
                        <small className="block text-[10px] text-muted-2">{lesson.meta}</small>
                        {lesson.status === "analyzing" && (
                          <span className="mt-1.5 block h-1 w-full max-w-[160px] overflow-hidden rounded-pill bg-[#ececf0]">
                            <motion.span
                              className="block h-full rounded-pill bg-ink"
                              initial={{ width: 0 }}
                              animate={{ width: `${"progress" in lesson ? lesson.progress : 0}%` }}
                              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                            />
                          </span>
                        )}
                      </span>
                      <span
                        className={`shrink-0 rounded-pill px-2.5 py-1 text-[10px] font-medium ${STATUS[lesson.status].className}`}
                      >
                        {STATUS[lesson.status].label}
                      </span>
                    </li>
                  ))}
                </motion.ul>
              </AnimatePresence>
            </div>

            {/* AI insight */}
            <div className="absolute right-6 bottom-6 w-[280px] rounded-[16px] border border-black/[0.08] bg-white/95 p-4 shadow-[0_18px_44px_rgba(0,0,0,.12)] backdrop-blur-md max-[680px]:right-4 max-[680px]:left-4 max-[680px]:w-auto">
              <div className="flex items-center gap-1.5 text-[10px] font-medium text-ink">
                <i className="size-1.5 rounded-full bg-ink" />
                EduSphere AI Insight
              </div>
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={school.insight}
                  {...swap}
                  className="mt-2 text-[11px] leading-[1.5] text-muted"
                >
                  {school.insight}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
