"use client";

import { useEffect, useRef } from "react";

// ---------------------------------------------------------------------------
// Hero atmosphere — the world behind the device, in daylight.
//
// fora.so sets its window in a photographic dusk landscape. EduSphere's world
// is a bright, misty mountain morning rendered in greys — the learning journey
// — with a faint constellation of connected nodes in the sky, the one quiet
// nod to AI and to "everything connected". Three ranges of rock-edged
// mountains with fog lying between them give the depth, and a valley floor
// carries the device. Film grain keeps the gradients from reading as flat CSS.
// The nearest range and its fog are exported separately (HeroForeground) and
// rendered in front of the device. Every layer carries a data-hero attribute
// so HeroScene can parallax it.
// ---------------------------------------------------------------------------

const GRAIN = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'>` +
    `<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/>` +
    `<feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .5 0'/></filter>` +
    `<rect width='100%' height='100%' filter='url(#n)'/></svg>`,
)}")`;

// Cloud layers in the upper sky: soft white masses over a pale grey sky.
const CLOUDS = [
  {
    key: "cloud-far",
    top: "4%",
    height: "34%",
    blur: 34,
    drift: 60,
    period: 40,
    spots: [
      [12, 40, 30, 55, 0.9],
      [46, 30, 40, 60, 0.95],
      [82, 45, 32, 55, 0.9],
    ],
  },
  {
    key: "cloud-near",
    top: "16%",
    height: "30%",
    blur: 26,
    drift: -45,
    period: 32,
    spots: [
      [0, 60, 26, 60, 0.85],
      [30, 55, 30, 65, 0.8],
      [66, 50, 34, 60, 0.9],
      [100, 62, 24, 55, 0.85],
    ],
  },
] as const;

// Mountain ranges behind the device, far → near (the nearest of the three is
// in HeroForeground). Each SVG is stretched over its band and its
// ridgeline is roughened by a turbulence-driven displacement so the silhouettes
// read as rock, not bezier curves. Farther ranges are lighter and blurrier
// (atmospheric perspective).
const RIDGES = [
  {
    key: "ridge-mid",
    top: "43%",
    height: "38%",
    d: "M0 260 L120 300 L240 224 L360 282 L470 206 L590 270 L720 196 L840 262 L960 216 L1090 286 L1200 230 L1320 292 L1440 240 L1440 560 L0 560 Z",
    from: "#c9cad2",
    to: "#b3b4bd",
    blur: 0.6,
    rough: 26,
    seed: 7,
  },
  {
    key: "ridge-near",
    top: "55%",
    height: "36%",
    d: "M0 250 L130 290 L260 232 L380 296 L520 244 L640 300 L780 236 L900 292 L1030 250 L1160 306 L1290 258 L1440 300 L1440 560 L0 560 Z",
    from: "#aaabb5",
    to: "#91929c",
    blur: 0,
    rough: 30,
    seed: 11,
  },
] as const;

// The nearest range and the valley fog sit IN FRONT of the device (rendered
// by HeroForeground after the content), so the glass stands inside the scene
// the way fora.so's window stands among its foreground trees. The peaks rise
// at the edges, where they only clip the device's lower corners; the fog does
// the rest softly across its bottom edge.
const FOREGROUND_RIDGE = {
  key: "ridge-fore",
  // The band is 32% of the hero tall for the shape itself (viewBox rows 0–500);
  // the box and path continue another 250 rows below so the layer's upward
  // parallax never exposes the floor behind it.
  height: "48%",
  viewBox: "0 0 1440 750",
  d: "M0 180 L90 120 L180 200 L300 262 L420 300 L560 274 L700 312 L840 284 L980 322 L1120 272 L1230 222 L1330 140 L1440 172 L1440 800 L0 800 Z",
  from: "#9a9ba5",
  to: "#66676f",
  rough: 30,
  seed: 17,
} as const;

const FOREGROUND_FOG = { key: "fog-fore", height: "18%", alpha: 0.8, blur: 30 } as const;

// Fog lying between the ranges.
const FOG = [{ key: "fog-near", top: "61%", height: "18%", alpha: 0.9, blur: 24 }] as const;

export function HeroAtmosphere() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Sky: pale, lit from above, hazier toward the ranges */}
      <div
        data-hero="sky"
        className="absolute inset-x-0 -top-[10%] h-[120%]"
        style={{
          background:
            "radial-gradient(80% 50% at 50% 0%, #ffffff 0%, rgba(255,255,255,0) 70%)," +
            "linear-gradient(180deg, #f3f4f7 0%, #e9eaef 22%, #f3f4f7 36%, #f8f9fb 46%, #e6e7ec 100%)",
        }}
      />

      {/* Clouds */}
      {CLOUDS.map((layer) => (
        <div
          key={layer.key}
          data-hero={layer.key}
          data-drift={layer.drift}
          data-period={layer.period}
          className="absolute -inset-x-[12%]"
          style={{
            top: layer.top,
            height: layer.height,
            filter: `blur(${layer.blur}px)`,
            background: layer.spots
              .map(
                ([x, y, w, h, a]) =>
                  `radial-gradient(${w}% ${h}% at ${x}% ${y}%, rgba(255,255,255,${a}), transparent 68%)`,
              )
              .join(","),
          }}
        />
      ))}

      <Constellation />

      {/* Mountain ranges with fog between them */}
      {RIDGES.map((ridge, i) => (
        <div key={ridge.key} className="contents">
          <svg
            data-hero={ridge.key}
            viewBox="0 0 1440 500"
            preserveAspectRatio="none"
            className="absolute -inset-x-[3%] w-[106%]"
            style={{
              top: ridge.top,
              height: ridge.height,
              filter: ridge.blur ? `blur(${ridge.blur}px)` : undefined,
            }}
          >
            <defs>
              <linearGradient id={`${ridge.key}-g`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor={ridge.from} />
                <stop offset="1" stopColor={ridge.to} />
              </linearGradient>
              <filter id={`${ridge.key}-rough`} x="-5%" y="-15%" width="110%" height="130%">
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.012 0.03"
                  numOctaves="3"
                  seed={ridge.seed}
                  result="noise"
                />
                <feDisplacementMap
                  in="SourceGraphic"
                  in2="noise"
                  scale={ridge.rough}
                  xChannelSelector="R"
                  yChannelSelector="G"
                />
              </filter>
            </defs>
            <path d={ridge.d} fill={`url(#${ridge.key}-g)`} filter={`url(#${ridge.key}-rough)`} />
          </svg>
          {FOG[i] && (
            <div
              data-hero={FOG[i].key}
              className="absolute -inset-x-[10%]"
              style={{
                top: FOG[i].top,
                height: FOG[i].height,
                filter: `blur(${FOG[i].blur}px)`,
                background:
                  `radial-gradient(45% 60% at 20% 50%, rgba(255,255,255,${FOG[i].alpha}), transparent 70%),` +
                  `radial-gradient(50% 60% at 60% 55%, rgba(255,255,255,${FOG[i].alpha}), transparent 70%),` +
                  `radial-gradient(40% 60% at 95% 45%, rgba(255,255,255,${FOG[i].alpha}), transparent 70%)`,
              }}
            />
          )}
        </div>
      ))}

      {/* Floor: valley haze the device stands in */}
      <div
        data-hero="floor"
        className="absolute inset-x-0 bottom-0 h-[24%] bg-[linear-gradient(180deg,rgba(236,237,241,0)_0%,#e9eaee_35%,#e0e1e7_100%)]"
      />

      {/* Film grain */}
      <div
        className="absolute inset-0 opacity-[.06] mix-blend-multiply"
        style={{ backgroundImage: GRAIN, backgroundSize: "220px 220px" }}
      />
    </div>
  );
}

// Rendered after the hero content so it paints over the device.
export function HeroForeground() {
  const ridge = FOREGROUND_RIDGE;
  const fog = FOREGROUND_FOG;
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
      <svg
        data-hero={ridge.key}
        viewBox={ridge.viewBox}
        preserveAspectRatio="none"
        className="absolute -inset-x-[3%] top-[70%] w-[106%] max-sm:top-[80%]"
        style={{ height: ridge.height }}
      >
        <defs>
          <linearGradient
            id={`${ridge.key}-g`}
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="0"
            x2="0"
            y2="500"
          >
            <stop offset="0" stopColor={ridge.from} />
            <stop offset="1" stopColor={ridge.to} />
          </linearGradient>
          <filter id={`${ridge.key}-rough`} x="-5%" y="-15%" width="110%" height="130%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.012 0.03"
              numOctaves="3"
              seed={ridge.seed}
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={ridge.rough}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
        <path d={ridge.d} fill={`url(#${ridge.key}-g)`} filter={`url(#${ridge.key}-rough)`} />
      </svg>

      <div
        data-hero={fog.key}
        className="absolute -inset-x-[10%] top-[81%] max-sm:top-[86%]"
        style={{
          height: fog.height,
          filter: `blur(${fog.blur}px)`,
          background:
            `radial-gradient(40% 60% at 10% 55%, rgba(255,255,255,${fog.alpha}), transparent 70%),` +
            `radial-gradient(50% 65% at 45% 60%, rgba(255,255,255,${fog.alpha}), transparent 70%),` +
            `radial-gradient(45% 60% at 80% 50%, rgba(255,255,255,${fog.alpha}), transparent 70%),` +
            `linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(240,241,245,.6) 55%, rgba(236,237,241,.85) 100%)`,
        }}
      />

      {/* Film grain over the foreground too, so it belongs to the same image */}
      <div
        className="absolute inset-x-0 bottom-0 h-[30%] opacity-[.06] mix-blend-multiply"
        style={{ backgroundImage: GRAIN, backgroundSize: "220px 220px" }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Constellation: a slow field of nodes that link when near each other — the
// "everything connected" idea, drawn in ink. Runs only while visible and only
// when motion is allowed; reduced-motion users get one static frame.
// ---------------------------------------------------------------------------

type Node = { x: number; y: number; vx: number; vy: number; r: number };

const LINK_DISTANCE = 130;
const LINK_DISTANCE_SQ = LINK_DISTANCE * LINK_DISTANCE;

function Constellation() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let nodes: Node[] = [];
    let frame = 0;
    let visible = true;
    let last = 0;

    const seed = () => {
      const count = Math.round(Math.min(80, (width * height) / 14000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.14,
        vy: (Math.random() - 0.5) * 0.09,
        r: 1 + Math.random() * 1.5,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 >= LINK_DISTANCE_SQ) continue;
          const d = Math.sqrt(d2);
          ctx.strokeStyle = `rgba(9,9,11,${(1 - d / LINK_DISTANCE) * 0.16})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
      ctx.fillStyle = "rgba(9,9,11,.5)";
      for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    // Time-based so 120Hz displays do not drift twice as fast.
    const tick = (now: number) => {
      const dt = last ? Math.min((now - last) / (1000 / 60), 2) : 1;
      last = now;
      for (const n of nodes) {
        n.x += n.vx * dt;
        n.y += n.vy * dt;
        if (n.x < -12) n.x = width + 12;
        else if (n.x > width + 12) n.x = -12;
        if (n.y < -12) n.y = height + 12;
        else if (n.y > height + 12) n.y = -12;
      }
      draw();
      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      cancelAnimationFrame(frame);
      if (reduceMotion || !visible || document.hidden) return;
      last = 0;
      frame = requestAnimationFrame(tick);
    };
    const stop = () => cancelAnimationFrame(frame);

    // Rescale existing nodes on resize instead of reseeding, so the field
    // does not jump when the window or scrollbar changes.
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const prevW = width;
      const prevH = height;
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (nodes.length === 0 || !prevW || !prevH) {
        seed();
      } else {
        for (const n of nodes) {
          n.x *= width / prevW;
          n.y *= height / prevH;
        }
      }
      draw();
    };

    resize();
    start();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(canvas);
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      data-hero="stars"
      className="absolute inset-x-0 top-0 h-[50%] w-full mask-[radial-gradient(75%_90%_at_50%_20%,#000_25%,transparent_100%)]"
    />
  );
}
