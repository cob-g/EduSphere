"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { navActions, navLinks } from "@/lib/constants/nav";

// Sample line, a little below the centre of the 64px bar. Whichever
// `section[data-theme]` spans it decides the nav's light/dark mode.
const PROBE_Y = 42;
const SCROLLED_AT = 8;

// Globe mark only (public/brand/edusphere-mark-*.png). Intrinsic ratio is
// passed to next/image; the rendered size is set in CSS.
const MARK = { width: 952, height: 777 } as const;

// Backdrop that appears once the page scrolls: page ground fading to
// transparent, with the blur masked out over the same run so there is no edge.
const backdropFade = {
  light: "bg-[linear-gradient(180deg,rgba(245,245,247,.92),rgba(245,245,247,.6)_60%,transparent)]",
  dark: "bg-[linear-gradient(180deg,rgba(0,0,0,.92),rgba(0,0,0,.6)_60%,transparent)]",
} as const;

const textLink =
  "text-[13px] font-medium tracking-[-0.01em] opacity-65 transition-opacity duration-200 ease-apple " +
  "hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-4 " +
  "focus-visible:outline-current";

// fora.so-style borderless navigation: brand left, links centred, actions
// right, sitting directly on the page at the top and gaining a soft blurred
// fade once scrolled. Light/dark follows the section beneath it. Below the
// desktop breakpoint the links live in the floating MobileDock instead of a
// menu, and the demo button stays up here so the dock has room for five tabs.
export function SiteNav() {
  const [dark, setDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

  const theme = dark ? "dark" : "light";

  return (
    <header
      data-theme={theme}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ease-apple ${dark ? "text-white" : "text-ink"}`}
    >
      {/* Scrolled backdrop. Taller than the bar so the fade tails off below it. */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 top-0 h-24 backdrop-blur-[14px] max-sm:backdrop-blur-[8px] transition-opacity duration-300 ease-apple mask-b-from-60% ${backdropFade[theme]} ${scrolled ? "opacity-100" : "opacity-0"}`}
      />

      <Container as="nav" aria-label="Primary" className="relative z-10 flex h-16 items-center justify-between">
        <Link
          href="#top"
          aria-label="EduSphere AI — home"
          className="inline-flex items-center gap-2.5 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
        >
          {/* Both marks are rendered and cross-faded so the theme swap never
              waits on an image request. Not marked eager: that would preload
              both, and the hidden one would be a wasted request. */}
          <span className="relative block h-[26px] shrink-0">
            <Image
              src="/brand/edusphere-mark-black.png"
              alt=""
              width={MARK.width}
              height={MARK.height}
              sizes="32px"
              className={`h-[26px] w-auto transition-opacity duration-300 ease-apple ${dark ? "opacity-0" : "opacity-100"}`}
            />
            <Image
              src="/brand/edusphere-mark-white.png"
              alt=""
              width={MARK.width}
              height={MARK.height}
              sizes="32px"
              className={`absolute inset-0 h-[26px] w-auto transition-opacity duration-300 ease-apple ${dark ? "opacity-100" : "opacity-0"}`}
            />
          </span>
          <span className="text-[15px] font-semibold tracking-[-0.02em]">EduSphere</span>
          <span className="rounded-[5px] border border-current/40 px-1 text-[10px] font-medium leading-[1.5]">
            AI
          </span>
        </Link>

        {/* Absolutely centred so it stays centred regardless of the side widths. */}
        <ul className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-5 lg:flex xl:gap-7">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className={textLink}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4 lg:gap-5">
          <Link href={navActions.signIn.href} className={textLink}>
            {navActions.signIn.label}
          </Link>
          <Button href={navActions.demo.href} variant="ghost" size="sm">
            <span className="lg:hidden">Demo</span>
            <span className="max-lg:hidden">{navActions.demo.label}</span>
          </Button>
        </div>
      </Container>

    </header>
  );
}
