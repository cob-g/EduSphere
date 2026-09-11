import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Single entry point for GSAP. Import gsap, ScrollTrigger and useGSAP from here
// (never straight from "gsap") so plugins are always registered before use.
// Only import this module from Client Components.
//
// Usage pattern:
//   - Animate inside useGSAP({ scope }) so everything is reverted on unmount.
//   - Wrap animations in gsap.matchMedia() with MOTION_QUERIES so users who
//     prefer reduced motion get the final state instead. A matchMedia created
//     inside useGSAP is cleaned up with it.
//   - Wrap event-handler animations in contextSafe() from useGSAP.
//   - Render content in its final, readable state on the server; let GSAP
//     animate after hydration rather than changing markup.
gsap.registerPlugin(ScrollTrigger, useGSAP);

export const MOTION_QUERIES = {
  motionOK: "(prefers-reduced-motion: no-preference)",
  reduceMotion: "(prefers-reduced-motion: reduce)",
} as const;

export { gsap, ScrollTrigger, useGSAP };
