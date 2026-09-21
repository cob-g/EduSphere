"use client";

import { useEffect, useRef } from "react";

type SparklesProps = {
  /** Particles per 800×800px of canvas. */
  density?: number;
  /** Particles drift gently toward the pointer. */
  mousemove?: boolean;
  /** Particle colour. */
  color?: string;
  /** Base particle radius in px; each particle varies around it. */
  size?: number;
  /** Drift speed multiplier. */
  speed?: number;
  className?: string;
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  phase: number;
  rate: number;
};

// Canvas field of twinkling particles (the original snippet used tsparticles;
// this is dependency-free and honours reduced motion, visibility and DPR).
export function Sparkles({
  density = 800,
  mousemove = false,
  color = "#ffffff",
  size = 1,
  speed = 1,
  className = "",
}: SparklesProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Phones draw the same field, just more cheaply: a smaller backing store
    // and half the frame rate, which is where the cost was. Particle count is
    // untouched so the look does not change. Pointer attraction is pointless
    // on touch, so those listeners are never attached there.
    const compact = window.matchMedia("(max-width: 42.4375rem)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const followPointer = mousemove && !coarse;
    const maxDpr = compact ? 1.5 : 2;
    const minFrameMs = compact ? 1000 / 30 : 0;
    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let frame = 0;
    let visible = true;
    let t = 0;
    let last = 0;
    const pointer = { x: -1e4, y: -1e4 };

    const seed = () => {
      const count = Math.min(1600, Math.round((density * width * height) / (800 * 800)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.12 * speed,
        vy: (-0.05 - Math.random() * 0.12) * speed,
        r: size * (0.4 + Math.random() * 0.9),
        phase: Math.random() * Math.PI * 2,
        rate: 0.6 + Math.random() * 1.6,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = color;
      for (const p of particles) {
        const twinkle = 0.5 + 0.5 * Math.sin(t * p.rate + p.phase);
        ctx.globalAlpha = 0.15 + 0.85 * twinkle;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    // Time-based so 120Hz displays do not run twice as fast (dt is in 60fps
    // frames, capped so a resumed tab does not jump).
    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      if (!last) last = now;
      const elapsed = now - last;
      if (elapsed < minFrameMs) return;
      const dt = Math.min(elapsed / (1000 / 60), 2);
      last = now;
      t += 0.03 * dt;
      for (const p of particles) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        if (followPointer) {
          const dx = pointer.x - p.x;
          const dy = pointer.y - p.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 140 * 140) {
            const f = (1 - Math.sqrt(d2) / 140) * 0.02 * dt;
            p.x += dx * f;
            p.y += dy * f;
          }
        }
        if (p.y < -4) {
          p.y = height + 4;
          p.x = Math.random() * width;
        }
        if (p.x < -4) p.x = width + 4;
        else if (p.x > width + 4) p.x = -4;
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

    // Keep existing particles across resizes (rescaled) so a scrollbar or
    // window change does not teleport the whole field.
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
      const prevW = width;
      const prevH = height;
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (particles.length === 0 || !prevW || !prevH) {
        seed();
      } else {
        for (const p of particles) {
          p.x *= width / prevW;
          p.y *= height / prevH;
        }
      }
      draw();
    };

    const onMove = (event: PointerEvent) => {
      // This listens on the window, so it fires for every pointer move on the
      // page. Off screen there is nothing to attract, and measuring the canvas
      // would force a layout in the middle of whatever else is animating.
      if (!visible) return;
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
    };
    const onLeave = () => {
      pointer.x = -1e4;
      pointer.y = -1e4;
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
    // pointerleave does not bubble, so listen on the root element itself.
    const root = document.documentElement;
    if (followPointer) {
      window.addEventListener("pointermove", onMove, { passive: true });
      root.addEventListener("pointerleave", onLeave);
    }

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
    };
  }, [density, mousemove, color, size, speed]);

  return <canvas ref={ref} aria-hidden className={className} />;
}
