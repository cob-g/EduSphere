"use client";

import { AnimatePresence, motion } from "motion/react";
import { useId, useRef, useState } from "react";

import { gsap, MOTION_QUERIES, useGSAP } from "@/lib/animations/gsap";

// ---------------------------------------------------------------------------
// Stack interactor: a list of items on the left; on the right, one photograph
// masked by a set of shapes. Choosing an item swaps the photo and the shape
// layout, and the pieces assemble (random stagger), breathe, then collapse
// from the edges — on a loop. Adapted from the "connoisseur stack interactor"
// snippet; rebuilt on the shared GSAP module, in monochrome, with keyboard
// access and a description line for the active item.
// ---------------------------------------------------------------------------

export type StackLayout = "layers" | "mosaic" | "grid" | "columns";

export type StackItem = {
  num: string;
  /** Two words render on two lines, as in the original. */
  name: string;
  description?: string;
  /** A photograph (SVG image mode)… */
  image?: string;
  /** …or any markup, clipped by the same shapes (HTML mode). */
  visual?: React.ReactNode;
  layout: StackLayout;
};

type Props = {
  items: StackItem[];
  className?: string;
  /** Desaturate the photograph (monochrome sites). */
  grayscale?: boolean;
};

// Shape sets in a 500×500 box. Each shape carries the `piece` class GSAP targets.
const LAYOUTS: Record<StackLayout, React.ReactNode> = {
  layers: (
    <>
      <path className="piece" d="M459.2,196.2H40.8v-35c0-47.5,38.5-86,86-86h246.5c47.5,0,86,38.5,86,86V196.2z" />
      <path className="piece" d="M480.6,235H19.4c-6,0-10.8-4.9-10.8-10.8v-9.5c0-6,4.9-10.8,10.8-10.8h461.1c6,0,10.8,4.9,10.8,10.8v9.5C491.4,230.2,486.6,235,480.6,235z" />
      <path className="piece" d="M460.3,336.3H39.7c-17.2,0-31.1-13.9-31.1-31.1v-31.5c0-17.2,13.9-31.1,31.1-31.1h420.7c17.2,0,31.1,13.9,31.1,31.1v31.5C491.4,322.4,477.5,336.3,460.3,336.3z" />
      <path className="piece" d="M483.1,362.4H16.9c-4.6,0-8.3-3.7-8.3-8.3v-1.8c0-4.6,3.7-8.3,8.3-8.3h466.1c4.6,0,8.3,3.7,8.3,8.3v1.8C491.4,358.7,487.7,362.4,483.1,362.4z" />
      <path className="piece" d="M441.9,424.9H58.1c-9.6,0-17.3-7.8-17.3-17.3v-37.4h418.5v37.4C459.2,417.1,451.5,424.9,441.9,424.9z" />
    </>
  ),
  mosaic: (
    <>
      <rect className="piece" x="20" y="20" width="200" height="280" rx="14" />
      <rect className="piece" x="20" y="320" width="200" height="160" rx="14" />
      <rect className="piece" x="240" y="20" width="240" height="140" rx="14" />
      <rect className="piece" x="240" y="180" width="110" height="160" rx="14" />
      <rect className="piece" x="370" y="180" width="110" height="160" rx="14" />
      <rect className="piece" x="240" y="360" width="240" height="120" rx="14" />
    </>
  ),
  grid: (
    <>
      {Array.from({ length: 9 }).map((_, i) => (
        <rect key={i} className="piece" x={(i % 3) * 160 + 20} y={Math.floor(i / 3) * 160 + 20} width="140" height="140" rx="8" />
      ))}
    </>
  ),
  columns: (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <rect key={i} className="piece" x={i * 96 + 20} y={20 + (i % 2) * 24} width="76" height={440 - (i % 2) * 48} rx="14" />
      ))}
    </>
  ),
};

export default function StackInteractor({ items, className = "", grayscale = true }: Props) {
  const [active, setActive] = useState(0);
  const scope = useRef<HTMLDivElement>(null);
  const loop = useRef<gsap.core.Timeline | null>(null);
  const uid = useId().replace(/:/g, "");
  const clipId = (layout: StackLayout) => `${uid}-${layout}`;

  // Assemble → breathe → collapse, on a loop, for the active layout's pieces.
  const play = (index: number) => {
    const item = items[index];
    const pieces = `#${clipId(item.layout)} .piece`;
    loop.current?.kill();
    gsap.set(pieces, { scale: 0, transformOrigin: "50% 50%" });
    loop.current = gsap
      .timeline({ repeat: -1, repeatDelay: 1 })
      .to(pieces, { scale: 1, duration: 0.8, stagger: { amount: 0.4, from: "random" }, ease: "expo.out" })
      .to(pieces, { scale: 1.05, duration: 1.5, yoyo: true, repeat: 1, ease: "sine.inOut", stagger: { amount: 0.2, from: "center" } })
      .to(pieces, { scale: 0, duration: 0.6, stagger: { amount: 0.3, from: "edges" }, ease: "expo.in" });
  };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_QUERIES.motionOK, () => {
        play(active);
        return () => loop.current?.kill();
      });
      mm.add(MOTION_QUERIES.reduceMotion, () => {
        gsap.set(`#${clipId(items[active].layout)} .piece`, { scale: 1, transformOrigin: "50% 50%" });
      });
    },
    { scope, dependencies: [active] },
  );

  const item = items[active];
  const htmlMode = items.some((it) => it.visual);

  return (
    <div ref={scope} className={`flex flex-col items-center gap-16 md:flex-row md:justify-between ${className}`}>
      {/* List */}
      <nav className="w-full md:w-1/2" aria-label="Steps">
        <ul className="flex flex-col gap-9 max-[680px]:gap-7">
          {items.map((it, i) => {
            const on = i === active;
            const [first, ...rest] = it.name.split(" ");
            return (
              <li key={it.num}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-pressed={on}
                  className="group flex w-full items-start gap-5 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
                >
                  <span
                    className={`mt-1.5 text-[20px] font-semibold tracking-[-0.02em] transition-all duration-500 ease-apple ${
                      on ? "scale-110 text-ink [[data-theme=dark]_&]:text-white" : "text-muted-2"
                    }`}
                  >
                    {it.num}
                  </span>
                  <span className="min-w-0">
                    <span
                      className={`block text-[clamp(40px,4.6vw,60px)] leading-[0.9] font-semibold tracking-[-0.05em] uppercase transition-all duration-700 ease-apple ${
                        on
                          ? "translate-x-2 text-ink opacity-100 [[data-theme=dark]_&]:text-white"
                          : "text-transparent opacity-60 [-webkit-text-stroke:1.2px_#c4c5cd] [[data-theme=dark]_&]:[-webkit-text-stroke:1.2px_#3a3b41]"
                      }`}
                    >
                      {first}
                      {rest.length > 0 && (
                        <>
                          <br />
                          {rest.join(" ")}
                        </>
                      )}
                    </span>
                    <AnimatePresence initial={false}>
                      {on && it.description && (
                        <motion.span
                          initial={{ opacity: 0, height: 0, y: -4 }}
                          animate={{ opacity: 1, height: "auto", y: 0 }}
                          exit={{ opacity: 0, height: 0, y: -4 }}
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                          className="block overflow-hidden"
                        >
                          <span className="mt-3 block max-w-[420px] translate-x-2 text-[15px] leading-[1.55] text-muted [[data-theme=dark]_&]:text-muted-dark">
                            {it.description}
                          </span>
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Picture */}
      <div className="relative flex w-full items-center justify-center md:w-1/2">
        <div
          aria-hidden
          className="absolute h-[110%] w-[110%] rounded-full bg-black/[0.06] blur-[100px] [[data-theme=dark]_&]:bg-white/[0.05]"
        />
        {htmlMode ? (
          <div className="relative z-10 aspect-square w-full max-w-[520px]">
            {/* Clip definitions in bounding-box units so they fit any panel size. */}
            <svg className="absolute size-0" aria-hidden>
              <defs>
                {(Object.keys(LAYOUTS) as StackLayout[]).map((layout) => (
                  <clipPath
                    key={layout}
                    id={clipId(layout)}
                    clipPathUnits="objectBoundingBox"
                    transform="scale(0.002)"
                  >
                    {LAYOUTS[layout]}
                  </clipPath>
                ))}
              </defs>
            </svg>
            <div
              className="absolute inset-0 drop-shadow-[0_30px_60px_rgba(0,0,0,.18)]"
              style={{ clipPath: `url(#${clipId(item.layout)})` }}
            >
              {item.visual}
            </div>
          </div>
        ) : (
          <svg
            viewBox="0 0 500 500"
            className="relative z-10 h-auto w-full max-w-[500px] drop-shadow-[0_30px_60px_rgba(0,0,0,.18)]"
            role="img"
            aria-label={item.name}
          >
            <defs>
              {(Object.keys(LAYOUTS) as StackLayout[]).map((layout) => (
                <clipPath key={layout} id={clipId(layout)}>
                  {LAYOUTS[layout]}
                </clipPath>
              ))}
            </defs>
            <g clipPath={`url(#${clipId(item.layout)})`}>
              <image
                href={item.image}
                width="500"
                height="500"
                preserveAspectRatio="xMidYMid slice"
                style={grayscale ? { filter: "grayscale(1) contrast(1.05)" } : undefined}
              />
            </g>
          </svg>
        )}
      </div>
    </div>
  );
}
