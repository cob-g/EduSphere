"use client";

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type AnimationPlaybackControls,
} from "motion/react";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";

// The proposal visual: a school-size slider and a mock proposal that reshapes
// itself as the size changes. Two hundred students and ten thousand students
// produce visibly different documents, which is the whole argument for not
// publishing a price list. The knob drifts on its own while the panel is on
// screen; touching or dragging the track takes over, and the drift resumes a
// moment after the pointer lets go. Every changing value is a MotionValue
// rendered straight into the DOM, so nothing here re-renders React per frame.

const MIN = 200;
const MAX = 10_000;
const SPAN = Math.log(MAX / MIN);
const TICKS = [200, 1_000, 5_000, 10_000];

const toStudents = (p: number) => Math.round(MIN * Math.exp(p * SPAN));
const toProgress = (n: number) => Math.log(n / MIN) / SPAN;
const clamp = (n: number) => Math.min(1, Math.max(0, n));
const format = new Intl.NumberFormat("en-US");

type Shape = { campuses: string; modules: string; rollout: string; support: string };

function shape(p: number): Shape {
  if (p < 0.3) {
    return {
      campuses: "1 campus",
      modules: "Teaching + Registrar",
      rollout: "2-week pilot",
      support: "Shared onboarding lead",
    };
  }
  if (p < 0.6) {
    return {
      campuses: "1 to 2 campuses",
      modules: "Teaching, Registrar, Finance",
      rollout: "Pilot, then school-wide",
      support: "Dedicated onboarding lead",
    };
  }
  if (p < 0.85) {
    return {
      campuses: "2 to 3 campuses",
      modules: "Full platform",
      rollout: "Phased by department",
      support: "Implementation team",
    };
  }
  return {
    campuses: "4+ campuses",
    modules: "Full platform + Command Center",
    rollout: "Phased by campus",
    support: "Implementation team + training",
  };
}

const ROWS: Array<[label: string, key: keyof Shape]> = [
  ["Campuses", "campuses"],
  ["Modules", "modules"],
  ["Rollout", "rollout"],
  ["Support", "support"],
];

const START = toProgress(1_200);
const RESUME_AFTER_MS = 2_400;

export function ProposalScale() {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { amount: 0.4 });
  const reduceMotion = useReducedMotion();

  const progress = useMotionValue(START);
  const students = useTransform(progress, (p) => format.format(toStudents(p)));
  const fillScale = useTransform(progress, (p) => p);
  const knobLeft = useTransform(progress, (p) => `${p * 100}%`);
  const campuses = useTransform(progress, (p) => shape(p).campuses);
  const modules = useTransform(progress, (p) => shape(p).modules);
  const rollout = useTransform(progress, (p) => shape(p).rollout);
  const support = useTransform(progress, (p) => shape(p).support);
  const values = { campuses, modules, rollout, support } as const;

  // Screen-reader value: updated on user input only. The drift is decorative.
  const [announced, setAnnounced] = useState(toStudents(START));

  const drift = useRef<AnimationPlaybackControls | null>(null);
  const resumeTimer = useRef<number>(0);
  const dragging = useRef(false);
  // The drift re-arms itself on completion; it reaches its own latest version
  // through this ref rather than closing over itself.
  const loop = useRef<() => void>(null);

  const stopDrift = useCallback(() => {
    drift.current?.stop();
    drift.current = null;
  }, []);

  // Ping-pong toward whichever end is farther, forever. Restarting from the
  // current value means a user's drag never snaps back.
  const startDrift = useCallback(() => {
    stopDrift();
    const from = progress.get();
    const to = from < 0.5 ? 1 : 0;
    drift.current = animate(progress, to, {
      duration: 9 * Math.abs(to - from) + 1.5,
      ease: "easeInOut",
      onComplete: () => loop.current?.(),
    });
  }, [progress, stopDrift]);

  useEffect(() => {
    loop.current = startDrift;
  }, [startDrift]);

  useEffect(() => {
    if (!inView || reduceMotion) {
      stopDrift();
      return;
    }
    if (!dragging.current) startDrift();
    return () => {
      stopDrift();
      window.clearTimeout(resumeTimer.current);
    };
  }, [inView, reduceMotion, startDrift, stopDrift]);

  const commit = useCallback(
    (p: number) => {
      const next = clamp(p);
      progress.set(next);
      setAnnounced(toStudents(next));
    },
    [progress],
  );

  const fromPointer = (clientX: number) => {
    const rect = track.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    commit((clientX - rect.left) / rect.width);
  };

  const scheduleResume = () => {
    window.clearTimeout(resumeTimer.current);
    if (reduceMotion || !inView) return;
    resumeTimer.current = window.setTimeout(startDrift, RESUME_AFTER_MS);
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    // Capture keeps the drag alive when the pointer leaves the track. It can
    // throw for a pointer the browser no longer considers active; the drag
    // still works without it, so never let that abort the handler.
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* fall through */
    }
    dragging.current = true;
    window.clearTimeout(resumeTimer.current);
    stopDrift();
    fromPointer(e.clientX);
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (dragging.current) fromPointer(e.clientX);
  };
  const onPointerEnd = () => {
    if (!dragging.current) return;
    dragging.current = false;
    scheduleResume();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = 0.04;
    const p = progress.get();
    const next =
      e.key === "ArrowRight" || e.key === "ArrowUp"
        ? p + step
        : e.key === "ArrowLeft" || e.key === "ArrowDown"
          ? p - step
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? 1
              : null;
    if (next === null) return;
    e.preventDefault();
    window.clearTimeout(resumeTimer.current);
    stopDrift();
    commit(next);
    scheduleResume();
  };

  return (
    <div
      ref={root}
      className="w-full max-w-[420px] rounded-[16px] border border-white/10 bg-[#141416] p-5 text-white shadow-[0_30px_60px_-30px_rgba(0,0,0,.8)] select-none"
    >
      <div className="mb-4 flex items-baseline justify-between border-b border-white/10 pb-3">
        <span className="text-[13px] font-medium">Proposal</span>
        <span className="text-[11px] text-white/45">Shaped to the school</span>
      </div>

      {/* Headline number */}
      <div className="flex items-baseline gap-2">
        <motion.span className="text-[44px] leading-none font-semibold tracking-[-0.04em] tabular-nums">
          {students}
        </motion.span>
        <span className="text-[13px] text-white/55">students</span>
      </div>

      {/* Slider */}
      <div
        ref={track}
        role="slider"
        tabIndex={0}
        aria-label="School size"
        aria-valuemin={MIN}
        aria-valuemax={MAX}
        aria-valuenow={announced}
        aria-valuetext={`${format.format(announced)} students`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        onKeyDown={onKeyDown}
        className="relative mt-6 cursor-ew-resize touch-none py-3 outline-none focus-visible:[&>div:first-child]:ring-2 focus-visible:[&>div:first-child]:ring-white/40"
      >
        <div className="relative h-1.5 rounded-pill bg-white/10">
          <motion.div
            className="absolute inset-y-0 left-0 w-full origin-left rounded-pill bg-white"
            style={{ scaleX: fillScale }}
          />
          <motion.div
            className="absolute top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white bg-[#141416] shadow-[0_0_0_4px_rgba(255,255,255,.08)]"
            style={{ left: knobLeft }}
          />
        </div>
        <div className="relative mt-3 h-4 text-[10px] text-white/40 tabular-nums">
          {TICKS.map((t) => (
            <span
              key={t}
              className="absolute -translate-x-1/2 first:translate-x-0 last:-translate-x-full"
              style={{ left: `${toProgress(t) * 100}%` }}
            >
              {t >= 1000 ? `${t / 1000}k` : t}
            </span>
          ))}
        </div>
      </div>

      {/* What changes */}
      <dl className="mt-4 border-t border-white/10">
        {ROWS.map(([label, key]) => (
          <div
            key={key}
            className="flex items-baseline justify-between gap-4 border-b border-white/10 py-3 text-[13px]"
          >
            <dt className="text-white/50">{label}</dt>
            <motion.dd className="text-right text-white">{values[key]}</motion.dd>
          </div>
        ))}
      </dl>

      <p className="mt-4 text-[11px] text-white/45">
        Drag to see how the proposal changes with school size.
      </p>
    </div>
  );
}
