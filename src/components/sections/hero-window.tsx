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
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { markWhite } from "@/lib/assets/images";

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

// The mock is decorative: one accessible name for the whole slab, and the
// rotating contents inside are hidden from assistive tech so they never read
// out (or re-read every few seconds).
export function HeroWindow() {
  const frame = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const inView = useInView(frame, { amount: 0.25 });
  const [index, setIndex] = useState(0);
  const school = SCHOOLS[index];

  // Rotate schools only while the slab is on screen and the tab is visible.
  useEffect(() => {
    if (reduceMotion || !inView) return;
    const tick = () => {
      if (!document.hidden) setIndex((i) => (i + 1) % SCHOOLS.length);
    };
    const id = window.setInterval(tick, ROTATE_MS);
    return () => window.clearInterval(id);
  }, [reduceMotion, inView]);

  return (
    <div
      ref={frame}
      data-hero="window"
      role="img"
      aria-label="EduSphere teaching workspace showing lessons, AI approvals and an AI insight"
      className="relative mx-auto mt-[72px] w-[min(1040px,calc(100%-24px))] max-sm:mt-12"
    >
      {/* Contact shadow on the floor */}
      <div
        aria-hidden
        className="absolute inset-x-[8%] -bottom-10 h-24 rounded-[50%] bg-[radial-gradient(50%_50%_at_50%_50%,rgba(0,0,0,.30),transparent_70%)] blur-2xl"
      />

      {/* Entrance: MotionConfig reducedMotion="user" already drops the travel
          for reduced-motion users, so no conditional initial (a conditional
          would differ between server and first client render). */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0, y: 56 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
        className="relative h-[620px] overflow-hidden rounded-[30px] text-ink shadow-[0_50px_120px_rgba(0,0,0,.14),0_14px_34px_rgba(0,0,0,.06),inset_0_1px_0_#fff,inset_0_0_0_1px_rgba(255,255,255,.7)] max-sm:h-[600px] max-sm:rounded-[22px] sm:[-webkit-box-reflect:below_2px_linear-gradient(transparent_74%,rgba(0,0,0,.13))]"
      >
        {/* App chrome */}
        <div
          className="relative flex h-[58px] items-center gap-3 px-5 text-white max-sm:px-4 bg-[rgba(42,39,37,.9)]"
        >
          <span className="flex items-center gap-2">
            <Image
              src={markWhite}
              alt=""
              sizes="28px"
              className="h-[22px] w-auto"
            />
            <span className="text-[13px] font-semibold tracking-[-0.02em] max-sm:hidden">
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

          <Search aria-hidden className="ml-1 size-4 text-white/55 max-sm:hidden" />

          <span className="ml-auto inline-flex items-center gap-2 text-[11px] text-white/60">
            <i className="size-1.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,.9)]" />
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={school.live} {...swap}>
                {school.live}
              </motion.span>
            </AnimatePresence>
          </span>
        </div>

        <div className="grid h-[calc(100%-58px)] grid-cols-[200px_1fr] max-sm:grid-cols-1">
          {/* Sidebar. The active item is a tab that merges into the content pane:
              it runs past the sidebar's edge and two small corner pieces carve
              the concave curves above and below it. */}
          <nav
            aria-hidden
            className="bg-[linear-gradient(180deg,rgba(42,39,37,.9)_0%,rgba(26,24,23,.93)_100%)] py-4 pl-3 max-sm:hidden"
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
                    <span className="absolute -top-[14px] right-0 size-[14px] bg-[radial-gradient(circle_at_0_0,transparent_13.5px,#fff_14px)]" />
                    <span className="absolute -bottom-[14px] right-0 size-[14px] bg-[radial-gradient(circle_at_0_100%,transparent_13.5px,#fff_14px)]" />
                  </>
                )}
                <Icon aria-hidden className="size-[15px]" strokeWidth={1.75} />
                {label}
              </div>
            ))}
          </nav>

          {/* Teaching workspace */}
          <div className="relative bg-white p-6 max-sm:p-4">
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
                  <motion.p
                    key={school.teacher}
                    {...swap}
                    className="mt-1 text-[20px] font-semibold tracking-[-0.03em]"
                  >
                    {school.teacher}
                  </motion.p>
                </AnimatePresence>
              </div>
              <span className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-pill bg-[rgba(42,39,37,.9)] px-3 text-[11px] font-medium whitespace-nowrap text-white max-sm:hidden">
                <Plus aria-hidden className="size-3.5" strokeWidth={2.2} />
                Upload lesson
              </span>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2.5 max-sm:grid-cols-2">
              {school.kpis.map(([label, value], i) => (
                <div
                  key={label}
                  className={`rounded-[14px] border border-black/[0.06] bg-white p-3.5 shadow-[0_1px_2px_rgba(0,0,0,.03)] ${
                    i === 2 ? "max-sm:hidden" : ""
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
                      className={`flex items-center gap-3 px-4 py-2.5 ${i === 2 ? "max-sm:hidden" : ""}`}
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
                              className="block h-full origin-left rounded-pill bg-ink"
                              initial={{ scaleX: 0 }}
                              animate={{ scaleX: ("progress" in lesson ? lesson.progress : 0) / 100 }}
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

            {/* AI insight. No backdrop blur: the card is 95% white over a plain
                white pane, so a blur had nothing to show and still cost a
                filter pass inside a 3D-transformed, reflected slab. */}
            <div className="absolute right-6 bottom-6 w-[280px] rounded-[16px] border border-black/[0.08] bg-white/95 p-4 shadow-[0_18px_44px_rgba(0,0,0,.12)] max-sm:right-4 max-sm:left-4 max-sm:w-auto">
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
