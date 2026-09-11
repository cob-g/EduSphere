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
- `src/components/ui/` — `Section` (every band carries `data-theme`, which the nav reads to switch light/dark glass), `Container`, `Button`, `Eyebrow`, `Brand`
- `src/components/motion/reveal.tsx` — scroll-triggered fade-up (GSAP ScrollTrigger, reduced-motion safe)
- `src/components/layout/` — `SiteNav` (centred floating glass pill, mobile sheet) and `SiteFooter`
- `src/components/sections/` — one file per homepage band, assembled in `src/app/page.tsx`
  - the hero is a layered daylight scene inspired by fora.so's hero but built as a white studio: `hero-atmosphere.tsx` (pale sky with drifting clouds, ink constellation canvas, three rock-edged mountain ranges with fog between them, valley floor, film grain; plus `HeroForeground`, a nearest range and valley fog rendered in front of the device so it stands inside the scene), `hero-window.tsx` (light glass slab with floor shadow and reflection showing the executive overview, rotating between schools), `hero-scene.tsx` (GSAP parallax per depth, cloud drift, device tilt)
- `src/lib/constants/nav.ts` — navigation links and actions

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
    page.tsx          placeholder homepage
    globals.css       Tailwind import, theme tokens, base styles
    robots.ts         /robots.txt
    sitemap.ts        /sitemap.xml (add real routes as they ship)
  components/
    layout/           site chrome (header, footer, …)
    ui/               reusable UI primitives
    motion/           animation-related client components (MotionProvider)
    dev/              development-only placeholders (remove with the placeholder page)
  lib/
    animations/gsap.ts  GSAP + ScrollTrigger + useGSAP registration, reduced-motion queries
    constants/site.ts   site name, title, description, URL
```

## Conventions

- **Server Components by default.** Add `"use client"` only for components that need GSAP, Motion, state, browser APIs, or interactivity, and keep those components small.
- **GSAP:** import from `@/lib/animations/gsap` (not `"gsap"`), animate inside `useGSAP({ scope })` for automatic cleanup, and wrap animations in `gsap.matchMedia()` with `MOTION_QUERIES` to respect `prefers-reduced-motion`.
- **Motion:** `MotionProvider` in the root layout sets `reducedMotion="user"` for all Motion components.
- No global scroll hijacking or smooth-scroll library (Lenis is deferred).
