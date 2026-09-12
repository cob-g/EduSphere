"use client";

import { ArrowUp, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { FacebookIcon, LinkedinIcon, TelegramIcon } from "@/components/ui/brand-icons";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/ui/magnetic";
import { Section } from "@/components/ui/section";
import { gsap, MOTION_QUERIES, ScrollTrigger, useGSAP } from "@/lib/animations/gsap";
import { contactEmail, navLinks, socialLinks } from "@/lib/constants/nav";

const MARQUEE = [
  "AI Virtual Teacher",
  "Student Records",
  "Registrar",
  "Finance",
  "Command Center",
  "Teacher-governed AI",
  "Role-based access",
  "Audit trail",
];

const SOCIAL_ICONS = {
  LinkedIn: LinkedinIcon,
  Facebook: FacebookIcon,
  Telegram: TelegramIcon,
} as const;

// Glass pills sit on a near-black ground, so no backdrop blur is needed (and
// backdrop-filter inside a clipped fixed subtree is unreliable in WebKit).
const glass =
  "border border-white/10 bg-white/[0.04] shadow-[inset_0_1px_1px_rgba(255,255,255,.08)] " +
  "transition-[background-color,border-color,color] duration-300 ease-apple " +
  "hover:border-white/25 hover:bg-white/[0.09] hover:text-white";
const pill = `inline-flex items-center rounded-pill px-5 py-2.5 text-[13px] font-medium text-white/70 ${glass}`;
const iconButton = `grid size-11 place-items-center rounded-full text-white/75 ${glass}`;

function MarqueeRun() {
  return (
    <div className="flex shrink-0 items-center">
      {MARQUEE.map((item) => (
        <span key={item} className="flex items-center">
          <span className="px-7">{item}</span>
          <span aria-hidden className="text-white/35">
            ✦
          </span>
        </span>
      ))}
    </div>
  );
}

// The page's closing band and footer in one. On wide screens where the whole
// footer fits the viewport it is fixed and clipped to a viewport-tall wrapper,
// so the last section scrolls away and reveals it underneath like a curtain
// lifting. Anywhere it would not fit (phones, short windows) it simply flows,
// so nothing can be cut off. Inside: a diagonal marquee of what the platform
// covers, the closing statement with the demo buttons, the section links, and
// the wordmark rising from the bottom edge. Entrances are scroll-scrubbed;
// reduced-motion users get the final state.
export function SiteFooter() {
  const wrap = useRef<HTMLElement>(null);
  const footer = useRef<HTMLElement>(null);
  const giant = useRef<HTMLDivElement>(null);
  const head = useRef<HTMLDivElement>(null);
  const actions = useRef<HTMLDivElement>(null);
  const [curtain, setCurtain] = useState(false);

  // Curtain only when the footer's content fits the viewport on a wide screen.
  useEffect(() => {
    const el = footer.current;
    if (!el) return;
    const wide = window.matchMedia("(min-width: 62.5rem)");
    const decide = () => setCurtain(wide.matches && el.scrollHeight <= window.innerHeight);
    decide();
    const observer = new ResizeObserver(decide);
    observer.observe(el);
    window.addEventListener("resize", decide);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", decide);
    };
  }, []);

  useGSAP(
    () => {
      // The fixed footer is always painted, so its ambient animations only run
      // while the wrapper is actually on screen.
      ScrollTrigger.create({
        trigger: wrap.current,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => footer.current?.toggleAttribute("data-onscreen", self.isActive),
      });

      gsap.matchMedia().add(MOTION_QUERIES.motionOK, () => {
        gsap.fromTo(
          giant.current,
          { y: "10vh", scale: 0.8, opacity: 0 },
          {
            y: 0,
            scale: 1,
            opacity: 1,
            ease: "power1.out",
            scrollTrigger: { trigger: wrap.current, start: "top 80%", end: "bottom bottom", scrub: 1 },
          },
        );
        gsap.fromTo(
          [head.current, actions.current],
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: { trigger: wrap.current, start: "top 40%", end: "bottom bottom", scrub: 1 },
          },
        );
      });
    },
    { scope: wrap, dependencies: [curtain] },
  );

  const mailto = `mailto:${contactEmail}`;

  return (
    <Section
      ref={wrap}
      theme="dark"
      tone="night"
      id="cta"
      className={curtain ? "h-[100dvh] [clip-path:inset(0)]" : "min-h-[100dvh]"}
    >
      <footer
        ref={footer}
        id="footer"
        role="contentinfo"
        className={`group flex w-full flex-col bg-night text-white ${
          curtain ? "fixed bottom-0 left-0 h-[100dvh]" : "relative min-h-[100dvh]"
        }`}
      >
        {/* Glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-1/2 h-[60vh] w-[80vw] -translate-x-1/2 -translate-y-1/2"
        >
          <div className="h-full w-full rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,.13),rgba(255,255,255,.04)_40%,transparent_70%)] blur-[80px] motion-safe:group-data-onscreen:animate-breathe" />
        </div>

        {/* Grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.04)_1px,transparent_1px)] bg-[size:60px_60px] mask-y-from-70%"
        />

        {/* Wordmark rising from the bottom edge */}
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-[3vh] left-1/2 -translate-x-1/2 select-none"
        >
          <div
            ref={giant}
            className="text-[clamp(96px,21vw,320px)] leading-none font-semibold tracking-[-0.07em] whitespace-nowrap text-white/[0.04] mask-[linear-gradient(180deg,#000_20%,rgba(0,0,0,.1)_90%)] [-webkit-text-stroke:1.5px_rgba(255,255,255,.16)]"
          >
            EDUSPHERE
          </div>
        </div>

        {/* Diagonal marquee */}
        <div
          aria-hidden
          className="absolute top-[92px] left-0 z-10 w-full origin-center -rotate-2 scale-110 overflow-hidden border-y border-white/10 bg-black/60 py-3.5 shadow-[0_25px_50px_-12px_rgba(0,0,0,.6)] max-sm:hidden"
        >
          <div className="flex w-max text-[11px] font-semibold tracking-[0.28em] text-white/55 uppercase motion-safe:group-data-onscreen:animate-marquee md:text-[12px]">
            <MarqueeRun />
            <MarqueeRun />
          </div>
        </div>

        {/* Closing statement */}
        <div className="relative z-10 mx-auto flex w-full max-w-[980px] flex-1 flex-col items-center justify-center px-[22px] pt-[150px] pb-8 text-center max-sm:pt-[96px]">
          <div ref={head}>
            <p className="mb-5 text-[13px] font-medium tracking-[0.01em] text-muted-dark">
              One Platform. Complete School Intelligence.
            </p>
            <h2 className="text-display-2 mx-auto max-w-[900px] text-shadow-[0_0_60px_rgba(255,255,255,.18)] [@media(max-height:760px)]:text-[clamp(40px,5.5vw,64px)]">
              The school, intelligently connected.
            </h2>
            <p className="text-lead mx-auto mt-6 max-w-[640px] text-muted-dark">
              See what EduSphere can look like inside your institution.
            </p>
          </div>

          <div
            ref={actions}
            className="mt-9 flex w-full flex-col items-center gap-5 max-sm:mt-7 max-sm:gap-4"
          >
            <div className="flex flex-wrap justify-center gap-3">
              <Magnetic>
                <Button href={mailto} variant="primary">
                  Book a Demo
                </Button>
              </Magnetic>
              <Magnetic>
                <Button href={mailto} variant="ghost" arrow>
                  Talk to Our Team
                </Button>
              </Magnetic>
            </div>
            <nav aria-label="Footer" className="flex flex-wrap justify-center gap-2.5">
              {navLinks.map((link) => (
                <Magnetic key={link.href} strength={0.2}>
                  <Link href={link.href} className={pill}>
                    {link.label}
                  </Link>
                </Magnetic>
              ))}
              <Magnetic strength={0.2}>
                <a href={mailto} className={pill}>
                  Contact
                </a>
              </Magnetic>
            </nav>

            {/* Where to find us */}
            <ul className="flex items-center gap-2.5" aria-label="Social">
              {socialLinks.map((s) => {
                const Icon = SOCIAL_ICONS[s.label];
                return (
                  <li key={s.label}>
                    <Magnetic strength={0.25}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={s.label}
                        className={iconButton}
                      >
                        <Icon className="size-[17px]" />
                      </a>
                    </Magnetic>
                  </li>
                );
              })}
              <li>
                <Magnetic strength={0.25}>
                  <a href={mailto} aria-label="Email" className={iconButton}>
                    <Mail aria-hidden className="size-[18px]" strokeWidth={1.75} />
                  </a>
                </Magnetic>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal row */}
        <div className="relative z-20 flex w-full flex-col items-center justify-between gap-5 px-[22px] pb-[calc(env(safe-area-inset-bottom,0px)+28px)] md:flex-row md:px-12">
          <p className="order-2 text-[10px] font-medium tracking-[0.18em] text-muted-dark-2 uppercase md:order-1 md:text-[11px]">
            © 2026 EduSphere AI. All rights reserved.
          </p>
          <div className="order-1 flex items-center gap-2.5 rounded-pill border border-white/10 bg-white/[0.04] py-2 pr-5 pl-2.5 md:order-2">
            <Image
              src="/brand/edusphere-mark-white.png"
              alt=""
              width={952}
              height={777}
              sizes="22px"
              className="h-auto w-[22px]"
            />
            <span className="text-[10px] font-semibold tracking-[0.18em] text-white/70 uppercase md:text-[11px]">
              Built in the Philippines for schools
            </span>
          </div>
          <Magnetic className="order-3">
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0 })}
              aria-label="Back to top"
              className={`grid size-12 place-items-center rounded-full text-white/80 ${glass}`}
            >
              <ArrowUp aria-hidden className="size-[18px]" strokeWidth={1.75} />
            </button>
          </Magnetic>
        </div>
      </footer>
    </Section>
  );
}
