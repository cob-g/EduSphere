"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

// Makes every Motion animation honour the user's prefers-reduced-motion setting.
// Children passed through here stay Server Components.
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
