# EduSphere Public Website

The public marketing website for **EduSphere AI**.

This repository contains only the public site. The EduSphere school platform itself is a separate Laravel application.

> Status: homepage implemented. Design direction: Apple Vision Pro–style presentation (glass devices, halos, cinematic full-bleed dark bands, oversized centred headlines) combined with fora.so's strict black-and-white palette, Inter typography and centred floating pill navigation. No accent colour.

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack), React 19, TypeScript (strict)
- [Tailwind CSS 4](https://tailwindcss.com) (CSS-first config in `src/app/globals.css`)
- [GSAP](https://gsap.com) + ScrollTrigger + [`@gsap/react`](https://gsap.com/resources/React/) (`useGSAP`)
- [Motion for React](https://motion.dev) (`motion/react`)
- [Lucide React](https://lucide.dev) icons
- Inter via `next/font/google` (self-hosted, optical-size axis enabled)
- ESLint (`eslint-config-next`)

## Structure

- `src/app/globals.css` — design tokens (monochrome palette, radii, display type utilities, glass surfaces) as Tailwind 4 `@theme` / `@utility`
- `src/components/ui/` — `Section` (every band carries `data-theme`, which the nav reads to switch light/dark glass), `Container`, `Button`, `Eyebrow`, `Magnetic`
- `src/components/motion/reveal.tsx` — scroll-triggered fade-up (GSAP ScrollTrigger, reduced-motion safe)
- `src/components/layout/` — `SiteNav` (borderless bar, links centred on desktop), `MobileDock` (the floating section tabs that replace a menu below the desktop breakpoint) and `SiteFooter`
- `src/components/sections/` — one file per homepage band, assembled in `src/app/page.tsx`
  - the hero is a layered daylight scene inspired by fora.so's hero but built as a white studio: `hero-atmosphere.tsx` (pale sky with drifting clouds, ink constellation canvas, three rock-edged mountain ranges with fog between them, valley floor, film grain; plus `HeroForeground`, a nearest range and valley fog rendered in front of the device so it stands inside the scene), `hero-window.tsx` (light glass slab with floor shadow and reflection showing the executive overview, rotating between schools), `hero-scene.tsx` (GSAP parallax per depth, cloud drift, device tilt)
- `src/lib/constants/nav.ts` — navigation links and actions
- `src/lib/assets/images.ts` — static imports of every raster the page shows (see Performance notes)
- `src/instrumentation.ts` — warms the image optimiser's cache when the server boots (see Performance notes)

## Prerequisites

- Node.js **24 LTS** (`.nvmrc`; `engines.node` is `24.x`)
- npm (the committed lockfile is `package-lock.json`)

## Getting started

```bash
nvm use            # optional, picks up .nvmrc
npm install
cp .env.example .env.local   # optional for local dev
npm run dev        # http://localhost:3000
```

## Scripts

| Command             | What it does                                                              |
| ------------------- | ------------------------------------------------------------------------- |
| `npm run dev`       | Development server with hot reload. **Never use in production.**          |
| `npm run build`     | Production build → `.next/standalone`, then copies `public/` and `.next/static` into it |
| `npm run start`     | Runs the standalone production server (`node .next/standalone/server.js`) |
| `npm run lint`      | ESLint                                                                    |
| `npm run typecheck` | Generates route types, then `tsc --noEmit`                                |

Production locally:

```bash
npm run build
PORT=3000 npm run start
```

## Deployment (Railway)

Deployed on Railway with its native Node builder (Railpack). No Dockerfile or Vercel config is used.

- **Build:** Railpack detects npm, installs Node from `engines.node` (24.x), and runs `npm run build`. The `postbuild` step copies `public/` and `.next/static` into `.next/standalone` so the standalone server can serve them.
- **Start:** Railpack runs `npm run start`, which launches the standalone server with `HOSTNAME=0.0.0.0`. The server listens on Railway's injected `PORT` (it falls back to 3000).
- **Config:** nothing needs to be set in the Railway dashboard beyond variables. Recommended service settings: healthcheck path `/`. Railway's `railway.json` / `railway.toml` config-as-code is deprecated and intentionally not used.
- **Variables:** set `NEXT_PUBLIC_SITE_URL` (and later `NEXT_PUBLIC_APP_URL`) as service variables. They are baked in at build time, so changing one requires a redeploy.

## Environment variables

See [`.env.example`](.env.example). No secrets are required.

| Variable               | Purpose                                                                                   |
| ---------------------- | ----------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL for metadata, `robots.txt`, `sitemap.xml`. Defaults to `http://localhost:3000`. |
| `NEXT_PUBLIC_APP_URL`  | URL of the EduSphere platform (Laravel app). Reserved; not read by the code yet.          |

## Project structure

```
public/
  brand/  images/  video/  product/   static assets, served from /
src/
  app/
    layout.tsx        root layout + default metadata (Metadata API)
    page.tsx          the homepage, one component per band
    globals.css       Tailwind import, theme tokens, base styles
    robots.ts         /robots.txt
    sitemap.ts        /sitemap.xml (add real routes as they ship)
  components/
    layout/           site chrome (header, footer, …)
    ui/               reusable UI primitives
    motion/           animation-related client components (MotionProvider, Reveal)
    sections/         one file per homepage band
  instrumentation.ts  server start-up hook (image cache warm-up)
  lib/
    assets/images.ts    static image imports
    animations/gsap.ts  GSAP + ScrollTrigger + useGSAP registration, reduced-motion queries
    constants/site.ts   site name, title, description, URL
```

## Performance notes

These are the rules the September 2026 audit left behind. Each one fixed something measured; breaking one brings the cost back.

- **Anything that animates forever must stop when it is off screen.** The lesson-flow clip loop and the hero cloud drift used to run for the whole visit, which forced a style recalculation and a layout on every frame on every section. Both are now paused by an `IntersectionObserver`. Parked on a static section, the page now does no DOM writes at all.
- **Never put a `filter` on the element whose transform is animated.** The compositor re-runs the filter as its own render pass on every frame. Put the transform on a wrapper and the blur on a still child: the blur is rasterised once into the wrapper's texture (`hero-atmosphere.tsx`). Same pixels; the hero went from 5 to 8 render passes per frame on a phone to 2 or 3.
- **No CSS `mask` on an animating canvas.** Paint the fade inside the canvas with `destination-in` (`Constellation`, `Sparkles`'s `fade` prop).
- **Display headlines have their own fallback font** (`"Inter Display Fallback"` in `globals.css`). next/font's automatic fallback is tuned for text sizes and set the hero headline about 6% too wide, which wrapped it onto an extra line on iPhone widths until Inter loaded and then moved the page 60px.
- **In-page and `mailto:` links are plain `<a>` tags.** `next/link` prefetched the page the visitor was already on. `Button` still uses `next/link` for a real route (an href starting with `/`).
- **Images are static imports** from `src/lib/assets/images.ts`, so their optimised variants are fingerprinted and served as `immutable`.
- **The image cache is warmed at boot** (`src/instrumentation.ts`). On a cold cache, a visitor who disconnects during the first request for an image size can leave that size hanging for everyone until the next restart (a Next.js image optimiser bug, present in 16.3.4 and 16.3.5). Warming removes the cold window, and the first visitor no longer waits about a second per image for the encode. Look for `[warm-images] … ready` in the deploy log.
- **Entrances that matter above the fold are CSS**, not JavaScript (`animate-rise*`), so the server HTML is visible before hydration.

## Conventions

- **Server Components by default.** Add `"use client"` only for components that need GSAP, Motion, state, browser APIs, or interactivity, and keep those components small.
- **GSAP:** import from `@/lib/animations/gsap` (not `"gsap"`), animate inside `useGSAP({ scope })` for automatic cleanup, and wrap animations in `gsap.matchMedia()` with `MOTION_QUERIES` to respect `prefers-reduced-motion`.
- **Motion:** `MotionProvider` in the root layout sets `reducedMotion="user"` for all Motion components.
- No global scroll hijacking or smooth-scroll library (Lenis is deferred).
