"use client";

import { useEffect, useState } from "react";

type Entry = { id: string; letter: string; name: string };

// The A to E list beside the services. It watches the five groups and lights
// the one currently under the reading line, so the sticky column doubles as
// a progress indicator on long scrolls. Plain anchors underneath, so it also
// works as a jump list without JavaScript.
export function ServicesIndex({ entries }: { entries: Entry[] }) {
  const [active, setActive] = useState(entries[0]?.id ?? "");

  useEffect(() => {
    const groups = entries
      .map((e) => document.getElementById(e.id))
      .filter((el): el is HTMLElement => el !== null);
    if (groups.length === 0) return;

    // The list is display:none below the lg breakpoint; skip the work there.
    const desktop = window.matchMedia("(min-width: 62.5rem)");

    // A group is "current" once its top passes a line 35% down the viewport;
    // the last such group wins. Cheaper and steadier than intersection ratios.
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!desktop.matches) return;
      const line = window.innerHeight * 0.35;
      let current = groups[0].id;
      for (const g of groups) {
        if (g.getBoundingClientRect().top <= line) current = g.id;
      }
      setActive((prev) => (prev === current ? prev : current));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [entries]);

  return (
    <ol className="mt-10 hidden lg:block" aria-label="Service categories">
      {entries.map((e) => {
        const on = e.id === active;
        return (
          <li key={e.id}>
            <a
              href={`#${e.id}`}
              aria-current={on ? "true" : undefined}
              className={`group flex items-baseline gap-4 py-2.5 text-[15px] transition-colors duration-300 ease-apple ${
                on ? "text-white" : "text-white/40 hover:text-white/75"
              }`}
            >
              <span className="w-5 font-semibold tabular-nums">{e.letter}</span>
              <span className="tracking-[-0.01em]">{e.name}</span>
              <span
                aria-hidden
                className={`ml-auto size-1.5 rounded-full bg-white transition-opacity duration-300 ease-apple ${
                  on ? "opacity-100" : "opacity-0"
                }`}
              />
            </a>
          </li>
        );
      })}
    </ol>
  );
}
