"use client";

import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { navActions, navLinks } from "@/lib/constants/nav";

// Vertical centre of the 64px bar. Whichever `section[data-theme]` spans this
// line decides the nav's light/dark mode.
const PROBE_Y = 42;
const SCROLLED_AT = 8;

// Globe mark only (public/brand/edusphere-mark-*.png). Intrinsic ratio is
// passed to next/image; the rendered size is set in CSS.
const MARK = { width: 952, height: 777 } as const;
const MARK_HEIGHT = 26;

// Backdrop that appears once the page scrolls: page ground fading to
// transparent, with the blur masked out over the same run so there is no edge.
const backdropFade = {
  light: "linear-gradient(180deg, rgba(245,245,247,.92), rgba(245,245,247,.6) 60%, transparent)",
  dark: "linear-gradient(180deg, rgba(0,0,0,.92), rgba(0,0,0,.6) 60%, transparent)",
} as const;
const backdropMask = "linear-gradient(#000 60%, transparent)";

const textLink =
  "text-[13px] font-medium tracking-[-0.01em] opacity-65 transition-opacity duration-200 ease-apple " +
  "hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-4 " +
  "focus-visible:outline-current";

// fora.so-style borderless navigation: brand left, links centred, actions
// right, sitting directly on the page at the top and gaining a soft blurred
// fade once scrolled. Light/dark follows the section beneath it.
export function SiteNav() {
  const [dark, setDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  // Theme + backdrop follow the section under the bar (rAF-throttled).
  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      setScrolled(window.scrollY > SCROLLED_AT);

      const sections = document.querySelectorAll<HTMLElement>("section[data-theme]");
      let theme: string | undefined;
      for (const section of sections) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= PROBE_Y && rect.bottom > PROBE_Y) {
          theme = section.dataset.theme;
          break;
        }
      }
      setDark(theme === "dark");
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

  // Mobile sheet: lock body scroll, close on Escape and when the viewport
  // grows past the mobile breakpoint.
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    const desktop = window.matchMedia("(min-width: 1000px)");
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) close();
    };

    window.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onChange);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onChange);
    };
  }, [open, close]);

  const theme = dark ? "dark" : "light";

  return (
    <header
      data-theme={theme}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ease-apple ${dark ? "text-white" : "text-ink"}`}
    >
      {/* Scrolled backdrop. Taller than the bar so the fade tails off below it. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-24 transition-opacity duration-300 ease-apple"
        style={{
          opacity: scrolled ? 1 : 0,
          backgroundImage: backdropFade[theme],
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          maskImage: backdropMask,
          WebkitMaskImage: backdropMask,
        }}
      />

      <Container as="nav" aria-label="Primary" className="relative z-10 flex h-16 items-center justify-between">
        <Link
          href="#top"
          aria-label="EduSphere AI — home"
          className="inline-flex items-center gap-2.5 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
        >
          {/* Both marks are rendered and cross-faded so the theme swap never
              waits on an image request. */}
          <span className="relative block shrink-0" style={{ height: MARK_HEIGHT }}>
            <Image
              src="/brand/edusphere-mark-black.png"
              alt=""
              width={MARK.width}
              height={MARK.height}
              sizes="32px"
              loading="eager"
              className="transition-opacity duration-300 ease-apple"
              style={{ height: MARK_HEIGHT, width: "auto", opacity: dark ? 0 : 1 }}
            />
            <Image
              src="/brand/edusphere-mark-white.png"
              alt=""
              width={MARK.width}
              height={MARK.height}
              sizes="32px"
              loading="eager"
              className="absolute inset-0 transition-opacity duration-300 ease-apple"
              style={{ height: MARK_HEIGHT, width: "auto", opacity: dark ? 1 : 0 }}
            />
          </span>
          <span className="text-[15px] font-semibold tracking-[-0.02em]">EduSphere</span>
          <span className="rounded-[5px] border border-current/40 px-1 text-[10px] font-medium leading-[1.5]">
            AI
          </span>
        </Link>

        {/* Absolutely centred so it stays centred regardless of the side widths. */}
        <ul className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-7 min-[1000px]:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className={textLink}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3 min-[1000px]:gap-5">
          <Link href={navActions.signIn.href} className={`hidden min-[1000px]:inline-flex ${textLink}`}>
            {navActions.signIn.label}
          </Link>
          <Button href={navActions.demo.href} variant="ghost" size="sm">
            {navActions.demo.label}
          </Button>
          <button
            type="button"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            aria-controls="site-nav-sheet"
            onClick={() => setOpen((value) => !value)}
            className="-mr-2 grid size-9 place-items-center opacity-80 transition-opacity duration-200 ease-apple hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current min-[1000px]:hidden"
          >
            {open ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
          </button>
        </div>
      </Container>

      <AnimatePresence>
        {open && (
          <motion.div
            id="site-nav-sheet"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className={
              `absolute inset-x-0 top-0 max-h-dvh overflow-y-auto pt-16 backdrop-blur-xl min-[1000px]:hidden ` +
              (dark ? "bg-night/96" : "bg-paper/96")
            }
          >
            <Container className="pt-3 pb-7">
              <ul className="flex flex-col">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={close}
                      className="block py-3 text-[22px] font-semibold tracking-[-0.03em] transition-opacity duration-200 ease-apple hover:opacity-70"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex flex-col gap-2.5">
                <Button href={navActions.signIn.href} variant="ghost" size="md" className="w-full" onClick={close}>
                  {navActions.signIn.label}
                </Button>
                <Button href={navActions.demo.href} variant="primary" size="md" className="w-full" onClick={close}>
                  {navActions.demo.label}
                </Button>
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
