import type { ReactNode } from "react";

import { Sparkles } from "@/components/ui/sparkles-title3-utils/sparkles";

type SparklesTitleProps = {
  /** The heading group rendered above the light. */
  children: ReactNode;
  className?: string;
};

// A heading group standing over a horizon of light: three stacked gradient
// lines (glow, line, hot core) with a field of sparkles falling away beneath.
// Adapted from the "sparkles title" snippet, stripped to the effect itself and
// kept monochrome for the dark bands.
export default function SparklesTitle({ children, className = "" }: SparklesTitleProps) {
  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      <div className="relative z-10">{children}</div>

      <div className="relative h-80 w-full max-[680px]:h-52">
        {/* Wide glow bloom */}
        <div className="absolute inset-x-0 top-0 mx-auto h-8 w-3/4 -translate-y-1/2 rounded-full bg-white/25 blur-2xl" />
        <div className="absolute inset-x-0 top-0 mx-auto h-[3px] w-3/4 bg-linear-to-r from-transparent via-neutral-400 to-transparent blur-sm" />
        <div className="absolute inset-x-0 top-0 mx-auto h-px w-3/4 bg-linear-to-r from-transparent via-neutral-200 to-transparent" />
        <div className="absolute inset-x-0 top-0 mx-auto h-px w-2/5 bg-linear-to-r from-transparent via-white to-transparent" />

        <Sparkles
          density={1600}
          size={1.4}
          mousemove
          className="absolute inset-x-0 top-0 -mt-28 h-full w-full mask-[radial-gradient(55%_55%,white,transparent_60%)]"
        />
      </div>
    </div>
  );
}
