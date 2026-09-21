"use client";

import { useEffect, useRef, type CSSProperties } from "react";

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

// ---------------------------------------------------------------------------
// Rocky ridgelines, baked.
//
// These silhouettes used to be smooth polylines roughened at paint time by an
// feTurbulence + feDisplacementMap filter. That looked right but cost a full
// offscreen render pass per range on every scrolled frame, which is what made
// the hero drop frames on phones. The same shape is now generated once as
// plain geometry: each ridgeline is resampled densely and every sample is
// pushed around by seeded fractal noise, so the fill is an ordinary path with
// no filter attached. The generator is deterministic, so the server and the
// client produce identical markup.
// ---------------------------------------------------------------------------

type Point = readonly [number, number];

/** Small deterministic PRNG (mulberry32). */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Seeded fractal value noise over a 1D domain, returning roughly -1..1.
 * Three octaves matches the numOctaves="3" the old filter used.
 */
function fractalNoise(seed: number, wavelength: number, octaves = 3) {
  const next = rng(seed);
  const table = Array.from({ length: 512 }, () => next() * 2 - 1);
  const at = (i: number) => table[((i % 512) + 512) % 512];
  const smooth = (t: number) => t * t * (3 - 2 * t);
  return (x: number) => {
    let value = 0;
    let amplitude = 1;
    let total = 0;
    let step = wavelength;
    for (let o = 0; o < octaves; o++) {
      const u = x / step;
      const i = Math.floor(u);
      const f = smooth(u - i);
      value += (at(i) * (1 - f) + at(i + 1) * f) * amplitude;
      total += amplitude;
      amplitude *= 0.5;
      step *= 0.5;
    }
    return value / total;
  };
}

/**
 * Resample a ridgeline and displace each sample with fractal noise, then close
 * the shape with its straight bottom edge. `amp` mirrors the old filter's
 * displacement scale; x displacement tapers to nothing at the two ends so the
 * silhouette still meets the edges of its box cleanly.
 */
function roughRidge(top: readonly Point[], close: readonly Point[], amp: number, seed: number) {
  const noiseY = fractalNoise(seed, 84);
  const noiseX = fractalNoise(seed + 977, 84);
  const span = top[top.length - 1][0] - top[0][0];
  const out: string[] = [];

  for (let i = 0; i < top.length - 1; i++) {
    const [x1, y1] = top[i];
    const [x2, y2] = top[i + 1];
    const segments = Math.max(2, Math.round(Math.abs(x2 - x1) / 7));
    for (let s = 0; s < segments; s++) {
      const t = s / segments;
      const x = x1 + (x2 - x1) * t;
      const y = y1 + (y2 - y1) * t;
      // Fade the sideways push out at both ends of the range.
      const edge = Math.min(1, (Math.min(x - top[0][0], span - (x - top[0][0])) / span) * 6);
      const dx = noiseX(x) * amp * 0.5 * edge;
      const dy = noiseY(x) * amp * 0.58;
      out.push(`${(x + dx).toFixed(1)} ${(y + dy).toFixed(1)}`);
    }
  }
  const [lastX, lastY] = top[top.length - 1];
  out.push(`${lastX} ${(lastY + noiseY(lastX) * amp * 0.58).toFixed(1)}`);

  return (
    `M${out[0]}` +
    out.slice(1).map((pt) => `L${pt}`).join("") +
    close.map(([x, y]) => `L${x} ${y}`).join("") +
    "Z"
  );
}

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
const RIDGE_FOOT: readonly Point[] = [
  [1440, 560],
  [0, 560],
];

const RIDGES = [
  {
    key: "ridge-mid",
    top: "43%",
    height: "38%",
    d: roughRidge(
      [
        [0, 260], [120, 300], [240, 224], [360, 282], [470, 206], [590, 270], [720, 196],
        [840, 262], [960, 216], [1090, 286], [1200, 230], [1320, 292], [1440, 240],
      ],
      RIDGE_FOOT,
      26,
      7,
    ),
    from: "#c9cad2",
    to: "#b3b4bd",
    blur: 0.6,
  },
  {
    key: "ridge-near",
    top: "55%",
    height: "36%",
    d: roughRidge(
      [
        [0, 250], [130, 290], [260, 232], [380, 296], [520, 244], [640, 300], [780, 236],
        [900, 292], [1030, 250], [1160, 306], [1290, 258], [1440, 300],
      ],
      RIDGE_FOOT,
      30,
      11,
    ),
    from: "#aaabb5",
    to: "#91929c",
    blur: 0,
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
  d: roughRidge(
    [
      [0, 180], [90, 120], [180, 200], [300, 262], [420, 300], [560, 274], [700, 312],
      [840, 284], [980, 322], [1120, 272], [1230, 222], [1330, 140], [1440, 172],
    ],
    [
      [1440, 800],
      [0, 800],
    ],
    30,
    17,
  ),
  from: "#9a9ba5",
  to: "#66676f",
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

      {/* Clouds. The element that moves (data-hero, animated by HeroScene) and
          the element that is blurred are deliberately not the same one. A
          filter on a layer whose transform is animating is re-run by the
          compositor on every frame, as its own render pass. On a still child
          of the moving layer, the same blur is rasterised once into that
          layer's texture and then only slides around. Same pixels, no
          per-frame cost. The fog banks and the far ridge below do the same. */}
      {CLOUDS.map((layer) => (
        <div
          key={layer.key}
          data-hero={layer.key}
          data-drift={layer.drift}
          data-period={layer.period}
          className="absolute -inset-x-[12%]"
          style={{ top: layer.top, height: layer.height }}
        >
          <div
            className="absolute inset-0 [filter:blur(var(--hero-blur))] max-sm:[filter:blur(var(--hero-blur-sm))]"
            style={{
              "--hero-blur": `${layer.blur}px`,
              "--hero-blur-sm": `${Math.round(layer.blur * 0.45)}px`,
              background: layer.spots
                .map(
                  ([x, y, w, h, a]) =>
                    `radial-gradient(${w}% ${h}% at ${x}% ${y}%, rgba(255,255,255,${a}), transparent 68%)`,
                )
                .join(","),
            } as CSSProperties}
          />
        </div>
      ))}

      <Constellation />

      {/* Mountain ranges with fog between them */}
      {RIDGES.map((ridge, i) => (
        <div key={ridge.key} className="contents">
          <div
            data-hero={ridge.key}
            className="absolute -inset-x-[3%] w-[106%]"
            style={{ top: ridge.top, height: ridge.height }}
          >
            <svg
              viewBox="0 0 1440 500"
              preserveAspectRatio="none"
              className="block size-full max-sm:[filter:none]"
              style={{ filter: ridge.blur ? `blur(${ridge.blur}px)` : undefined }}
            >
              <defs>
                <linearGradient id={`${ridge.key}-g`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor={ridge.from} />
                  <stop offset="1" stopColor={ridge.to} />
                </linearGradient>
              </defs>
              <path d={ridge.d} fill={`url(#${ridge.key}-g)`} />
            </svg>
          </div>
          {FOG[i] && (
            <div
              data-hero={FOG[i].key}
              className="absolute -inset-x-[10%]"
              style={{ top: FOG[i].top, height: FOG[i].height }}
            >
              <div
                className="absolute inset-0 [filter:blur(var(--hero-blur))] max-sm:[filter:blur(var(--hero-blur-sm))]"
                style={{
                  "--hero-blur": `${FOG[i].blur}px`,
                  "--hero-blur-sm": `${Math.round(FOG[i].blur * 0.5)}px`,
                  background:
                    `radial-gradient(45% 60% at 20% 50%, rgba(255,255,255,${FOG[i].alpha}), transparent 70%),` +
                    `radial-gradient(50% 60% at 60% 55%, rgba(255,255,255,${FOG[i].alpha}), transparent 70%),` +
                    `radial-gradient(40% 60% at 95% 45%, rgba(255,255,255,${FOG[i].alpha}), transparent 70%)`,
                } as CSSProperties}
              />
            </div>
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
        className="absolute inset-0 opacity-[.06] mix-blend-multiply max-sm:hidden"
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
        </defs>
        <path d={ridge.d} fill={`url(#${ridge.key}-g)`} />
      </svg>

      <div
        data-hero={fog.key}
        className="absolute -inset-x-[10%] top-[81%] max-sm:top-[86%]"
        style={{ height: fog.height }}
      >
        <div
          className="absolute inset-0 [filter:blur(var(--hero-blur))] max-sm:[filter:blur(var(--hero-blur-sm))]"
          style={{
            "--hero-blur": `${fog.blur}px`,
            "--hero-blur-sm": `${Math.round(fog.blur * 0.5)}px`,
            background:
              `radial-gradient(40% 60% at 10% 55%, rgba(255,255,255,${fog.alpha}), transparent 70%),` +
              `radial-gradient(50% 65% at 45% 60%, rgba(255,255,255,${fog.alpha}), transparent 70%),` +
              `radial-gradient(45% 60% at 80% 50%, rgba(255,255,255,${fog.alpha}), transparent 70%),` +
              `linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(240,241,245,.6) 55%, rgba(236,237,241,.85) 100%)`,
          } as CSSProperties}
        />
      </div>

      {/* Film grain over the foreground too, so it belongs to the same image */}
      <div
        className="absolute inset-x-0 bottom-0 h-[30%] opacity-[.06] mix-blend-multiply max-sm:hidden"
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

// Same field everywhere — node count and link range are untouched so the
// constellation looks identical. Phones only pay less per frame: a smaller
// backing store and half the frame rate, which is where the cost actually was
// (clearing and repainting a full-DPR canvas sixty times a second).
const DESKTOP = { maxNodes: 80, areaPerNode: 14000, link: 130, dpr: 2, minFrameMs: 0 };
const COMPACT = { maxNodes: 80, areaPerNode: 14000, link: 130, dpr: 1.5, minFrameMs: 1000 / 30 };

function Constellation() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tune = window.matchMedia("(max-width: 42.4375rem)").matches ? COMPACT : DESKTOP;
    const linkSq = tune.link * tune.link;
    let width = 0;
    let height = 0;
    let nodes: Node[] = [];
    let frame = 0;
    let visible = true;
    let last = 0;

    const seed = () => {
      const count = Math.round(Math.min(tune.maxNodes, (width * height) / tune.areaPerNode));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.14,
        vy: (Math.random() - 0.5) * 0.09,
        r: 1 + Math.random() * 1.5,
      }));
    };

    // The field fades out toward the edges of the sky. This used to be a CSS
    // mask on the canvas element, which the compositor had to apply as an
    // extra render pass on every frame the canvas repainted or moved. The
    // same falloff is now painted into the canvas itself: an ellipse 75% of
    // the width by 90% of the height, centred at 50% 20%, fully opaque out to
    // a quarter of its radius and transparent at its edge. The gradient lives
    // in unit space and is stretched by the transform, so one serves any size.
    const falloff = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
    falloff.addColorStop(0, "rgba(0,0,0,1)");
    falloff.addColorStop(0.25, "rgba(0,0,0,1)");
    falloff.addColorStop(1, "rgba(0,0,0,0)");
    const fade = () => {
      const cx = width * 0.5;
      const cy = height * 0.2;
      const rx = width * 0.75;
      const ry = height * 0.9;
      if (!rx || !ry) return;
      ctx.save();
      ctx.globalCompositeOperation = "destination-in";
      ctx.translate(cx, cy);
      ctx.scale(rx, ry);
      ctx.fillStyle = falloff;
      ctx.fillRect(-cx / rx, -cy / ry, width / rx, height / ry);
      ctx.restore();
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
          if (d2 >= linkSq) continue;
          const d = Math.sqrt(d2);
          ctx.strokeStyle = `rgba(9,9,11,${(1 - d / tune.link) * 0.16})`;
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
      fade();
    };

    // Time-based so 120Hz displays do not drift twice as fast.
    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      if (!last) last = now;
      const elapsed = now - last;
      if (elapsed < tune.minFrameMs) return;
      const dt = Math.min(elapsed / (1000 / 60), 2);
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
      const dpr = Math.min(window.devicePixelRatio || 1, tune.dpr);
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
      className="absolute inset-x-0 top-0 h-[50%] w-full"
    />
  );
}
