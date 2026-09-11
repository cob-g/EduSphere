import type { ReactNode } from "react";

// Small label above a headline. Monochrome: muted grey, medium weight.
export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={`mb-5 text-[13px] font-medium tracking-[0.01em] text-muted [[data-theme=dark]_&]:text-muted-dark ${className}`}
    >
      {children}
    </p>
  );
}
