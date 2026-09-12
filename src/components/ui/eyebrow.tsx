import type { ReactNode } from "react";

type EyebrowProps = {
  children: ReactNode;
  className?: string;
  /**
   * `text`: a small muted label (inside cards and panels).
   * `pill`: a hairline pill with a dot, for the label above a section headline.
   */
  variant?: "text" | "pill";
};

// Small label above a headline. Monochrome: muted grey, medium weight.
export function Eyebrow({ children, className = "", variant = "text" }: EyebrowProps) {
  if (variant === "pill") {
    return (
      <p
        className={`mb-6 inline-flex items-center gap-2 rounded-pill border border-line px-3.5 py-1.5 text-[12px] font-medium tracking-[0.01em] text-muted [[data-theme=dark]_&]:border-white/15 [[data-theme=dark]_&]:text-muted-dark ${className}`}
      >
        <span aria-hidden className="size-1.5 rounded-full bg-current" />
        {children}
      </p>
    );
  }
  return (
    <p
      className={`mb-5 text-[13px] font-medium tracking-[0.01em] text-muted [[data-theme=dark]_&]:text-muted-dark ${className}`}
    >
      {children}
    </p>
  );
}
