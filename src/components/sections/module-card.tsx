"use client";

import { useRef, type ReactNode, type PointerEvent } from "react";

type ModuleCardProps = {
  children: ReactNode;
  className?: string;
};

// Bento card with a cursor-following white glow. The glow position lives in
// CSS variables so React never re-renders on mouse move. Touch devices skip
// the effect (no hover) and simply see the resting card.
export function ModuleCard({ children, className = "" }: ModuleCardProps) {
  const ref = useRef<HTMLElement>(null);

  function handleMove(e: PointerEvent<HTMLElement>) {
    const el = ref.current;
    if (!el || e.pointerType === "touch") return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--glow-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--glow-y", `${e.clientY - rect.top}px`);
  }

  return (
    <article
      ref={ref}
      onPointerMove={handleMove}
      className={
        "group relative overflow-hidden rounded-card border border-line-dark bg-night-2 p-8 " +
        "transition-[border-color] duration-500 ease-apple hover:border-white/20 " +
        className
      }
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-apple group-hover:opacity-100 [@media(hover:none)]:hidden"
        style={{
          background:
            "radial-gradient(420px circle at var(--glow-x, 50%) var(--glow-y, 50%), rgba(255,255,255,0.07), transparent 60%)",
        }}
      />
      <div className="relative">{children}</div>
    </article>
  );
}
