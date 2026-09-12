"use client";

import { Check, Copy } from "lucide-react";
import { useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

// The footer's email plate. The address is the centrepiece: display type on
// a glass pill, a tap-to-copy button that confirms itself, a light sweep on
// hover, and a one-time decode the first time the footer scrolls into view,
// where the characters settle left to right out of random glyphs. The server
// renders the real address, so it is there without JavaScript and for search.

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@._-";
const DECODE_MS = 1100;
const COPIED_MS = 1800;

export function FooterEmail({ email }: { email: string }) {
  const root = useRef<HTMLDivElement>(null);
  const text = useRef<HTMLSpanElement>(null);
  const inView = useInView(root, { once: true, amount: 0.6 });
  const reduceMotion = useReducedMotion();
  const [copied, setCopied] = useState(false);

  // Decode: each frame, characters left of the sweep show for real, the rest
  // flicker. Written straight to the DOM; nothing re-renders.
  useEffect(() => {
    const el = text.current;
    if (!inView || reduceMotion || !el) return;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / DECODE_MS);
      const settled = Math.floor(p * email.length);
      let out = "";
      for (let i = 0; i < email.length; i++) {
        out +=
          i < settled || email[i] === "@" || email[i] === "."
            ? email[i]
            : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      el.textContent = out;
      if (p < 1) frame = requestAnimationFrame(tick);
      else el.textContent = email;
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      el.textContent = email;
    };
  }, [inView, reduceMotion, email]);

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), COPIED_MS);
    return () => window.clearTimeout(t);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      // Clipboard blocked: the address is still selectable and the link still opens mail.
    }
  };

  return (
    <div
      ref={root}
      className="group relative flex w-full max-w-[720px] items-center gap-5 overflow-hidden rounded-pill border border-white/10 bg-white/[0.04] py-2 pr-2 pl-6 shadow-[inset_0_1px_1px_rgba(255,255,255,.08)] transition-colors duration-300 ease-apple hover:border-white/20 max-sm:flex-col max-sm:items-stretch max-sm:gap-4 max-sm:rounded-[22px] max-sm:p-5"
    >
      {/* Light sweep on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/[0.09] to-transparent opacity-0 group-hover:animate-shine group-hover:opacity-100"
      />

      <span className="shrink-0 text-[10px] font-medium tracking-[0.18em] text-white/45 uppercase max-sm:text-center">
        Write to us
      </span>

      <a
        href={`mailto:${email}`}
        className="min-w-0 flex-1 text-center text-[clamp(17px,2.4vw,28px)] font-semibold tracking-[-0.03em] whitespace-nowrap text-white transition-opacity duration-200 ease-apple hover:opacity-80 max-sm:text-[clamp(16px,4.6vw,20px)]"
      >
        <span ref={text} className="tabular-nums">
          {email}
        </span>
      </a>

      <button
        type="button"
        onClick={copy}
        aria-live="polite"
        className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-pill bg-white px-4 text-[13px] font-medium text-ink transition-[transform,background-color] duration-200 ease-apple hover:-translate-y-px hover:bg-paper active:translate-y-0 max-sm:w-full"
      >
        {copied ? (
          <>
            <Check aria-hidden className="size-4" strokeWidth={2.25} />
            Copied
          </>
        ) : (
          <>
            <Copy aria-hidden className="size-4" strokeWidth={2} />
            Copy
          </>
        )}
      </button>
    </div>
  );
}
