"use client";

import { CalendarCheck, Layers, LayoutGrid, ShieldCheck, Sparkles, type LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useEffect, useState, type MouseEvent } from "react";

import { navActions, navLinks } from "@/lib/constants/nav";

const ICONS: Record<string, LucideIcon> = {
  "#teacher": Sparkles,
  "#platform": Layers,
  "#modules": LayoutGrid,
  "#security": ShieldCheck,
};

// Where the "current section" is sampled: a little above the middle of the
// viewport, so a tab lights up once its section fills most of the screen.
const ACTIVE_RATIO = 0.45;
// Ground sampled just behind the dock, to pick its light/dark glass.
const DOCK_INSET = 44;

const spring = { type: "spring", stiffness: 420, damping: 34, mass: 0.8 } as const;

// Tapping a tab scrolls the page; the tab itself should not stay focused (the
// browser would draw its default ring around it). Keyboard users still get the
// inset ring below through focus-visible.
const blurOnClick = (e: MouseEvent<HTMLAnchorElement>) => e.currentTarget.blur();
const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-current/40 focus-visible:ring-inset";

// Phone navigation: a floating dock at the thumb, in place of a burger menu.
// One tab per section with a sliding highlight that tracks scroll, plus the
// demo action. The glass inverts against the section behind it and the dock
// retires once the footer (which carries its own actions) takes over.
export function MobileDock() {
  const [active, setActive] = useState<string | null>(null);
  const [dark, setDark] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let frame = 0;

    const sectionAt = (y: number) => {
      const sections = document.querySelectorAll<HTMLElement>("section[data-theme]");
      for (const section of sections) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= y && rect.bottom > y) return section;
      }
      return null;
    };

    const measure = () => {
      frame = 0;
      const h = window.innerHeight;
      const current = sectionAt(h * ACTIVE_RATIO);
      setActive(current?.id ? `#${current.id}` : null);
      const ground = sectionAt(h - DOCK_INSET);
      setDark(ground?.dataset.theme === "dark");
      setHidden(ground?.id === "cta");
    };

    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  // On a dark section the dock is light glass; on a light section, dark glass.
  const shell = dark
    ? "border-white/60 bg-white/85 text-ink shadow-[0_20px_50px_-20px_rgba(0,0,0,.6)]"
    : "border-white/10 bg-night/85 text-white shadow-[0_20px_50px_-20px_rgba(0,0,0,.55)]";
  // Active tab: a soft tint with full-strength icon and label, so it reads as
  // "you are here" and never competes with the solid Demo action.
  const highlight = dark ? "bg-ink/[0.09]" : "bg-white/[0.14]";
  const activeText = dark ? "text-ink" : "text-white";
  const idleText = dark ? "text-ink/50" : "text-white/55";
  // Demo is an action, not a place: outlined rather than filled so it never
  // reads as the selected tab.
  const cta = dark
    ? "border border-ink/20 text-ink hover:bg-ink/[0.06]"
    : "border border-white/25 text-white hover:bg-white/[0.08]";

  return (
    <motion.nav
      aria-label="Sections"
      initial={false}
      animate={{ y: hidden ? 140 : 0, opacity: hidden ? 0 : 1 }}
      transition={spring}
      className="fixed inset-x-0 z-50 flex justify-center px-4 min-[1000px]:hidden"
      style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 14px)" }}
    >
      <div
        className={`flex w-full max-w-[420px] items-stretch gap-1 rounded-[26px] border p-1.5 backdrop-blur-2xl backdrop-saturate-150 transition-colors duration-300 ease-apple ${shell}`}
      >
        {navLinks.map((link) => {
          const Icon = ICONS[link.href] ?? Sparkles;
          const isActive = active === link.href;
          return (
            <motion.div key={link.href} whileTap={{ scale: 0.92 }} className="relative flex-1">
              {isActive && (
                <motion.span
                  layoutId="dock-highlight"
                  transition={spring}
                  className={`absolute inset-0 rounded-[20px] ${highlight}`}
                />
              )}
              <Link
                href={link.href}
                aria-current={isActive ? "location" : undefined}
                onClick={blurOnClick}
                className={`${focusRing} relative z-10 flex h-[54px] flex-col items-center justify-center gap-1 rounded-[20px] text-[10px] font-medium tracking-[0.01em] whitespace-nowrap transition-colors duration-300 ease-apple ${isActive ? activeText : idleText}`}
              >
                <Icon aria-hidden className="size-[19px]" strokeWidth={isActive ? 2.25 : 1.75} />
                {link.label}
              </Link>
            </motion.div>
          );
        })}

        <motion.div whileTap={{ scale: 0.92 }} className="flex-1">
          <Link
            href={navActions.demo.href}
            onClick={blurOnClick}
            className={`${focusRing} flex h-[54px] flex-col items-center justify-center gap-1 rounded-[20px] text-[10px] font-medium tracking-[0.01em] whitespace-nowrap transition-colors duration-300 ease-apple ${cta}`}
          >
            <CalendarCheck aria-hidden className="size-[19px]" strokeWidth={1.75} />
            Demo
          </Link>
        </motion.div>
      </div>
    </motion.nav>
  );
}
