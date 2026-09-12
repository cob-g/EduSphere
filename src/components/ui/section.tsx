import type { ComponentProps } from "react";

type SectionProps = {
  /** Ground colour. Drives text colour, button colours and the nav's light/dark mode. */
  theme: "light" | "dark";
  /** Background token for the theme. Defaults to paper (light) / night (dark). */
  tone?: "paper" | "white" | "night" | "night-2";
  /** Sections clip by default (overflow: clip, which keeps sticky children
   *  working); opt out when children need to overhang. */
  overflow?: "clip" | "visible";
  className?: string;
} & Omit<ComponentProps<"section">, "className">;

const tones = {
  paper: "bg-paper text-ink",
  white: "bg-white text-ink",
  night: "bg-night text-white",
  "night-2": "bg-night-2 text-white",
} as const;

// Every top-level band on the page renders through this so it carries
// `data-theme`, which the nav observes to switch between light and dark glass.
export function Section({ theme, tone, overflow = "clip", className = "", ...props }: SectionProps) {
  const resolved = tone ?? (theme === "dark" ? "night" : "paper");
  return (
    <section
      data-theme={theme}
      className={`relative ${overflow === "clip" ? "overflow-clip" : "overflow-visible"} ${tones[resolved]} ${className}`}
      {...props}
    />
  );
}
