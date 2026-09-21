// Runs once when the production server boots (see the Next.js instrumentation
// convention). Its only job is to warm the image optimiser's cache.
//
// Why this exists. Every deploy starts with that cache empty, so the first
// request for each image size makes the server read the original and encode
// it. Two things go wrong in that window:
//
//   1. It is slow. A cold AVIF encode took 0.9 to 1.4 seconds on the Railway
//      container, and a real visitor was the one waiting for it.
//
//   2. It can get stuck for good. In Next 16.3 (and unchanged in 16.3.5), the
//      optimiser reads the original through a mocked response tied to the
//      requesting client's socket. If that client disconnects while the read
//      is in flight, the read never settles, and the optimiser de-duplicates
//      by key, so every later request for that same image size waits on the
//      same dead promise. Reproduced locally on a cold cache: the size then
//      hangs for every visitor until the process restarts. It only happens to
//      a size that is not cached yet.
//
// So the server asks itself for every variant the homepage references, once,
// patiently, right after boot. Those requests never abort, which makes them
// safe first requests, and everything a browser can ask for afterwards is a
// cache hit that never touches the fragile path. The images are static
// imports, so their cache entries last a year and are not re-encoded later.
//
// It is best-effort by design: nothing here is awaited by the server, every
// failure is swallowed, and the site works identically if it never runs.

const START_DELAY_MS = 1_500;
const READY_TIMEOUT_MS = 60_000;
const REQUEST_TIMEOUT_MS = 45_000;

// One entry per output format the optimiser negotiates. AVIF-capable browsers
// send the first; the rest (older Safari, mostly) get WebP.
const ACCEPT_HEADERS = ["image/avif,image/webp,*/*", "image/webp,*/*"];

export function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  if (process.env.NODE_ENV !== "production") return;
  // `next build` also loads this file while it prerenders. No server there.
  if (process.env.NEXT_PHASE === "phase-production-build") return;

  // register() must return before the server accepts requests, so the work
  // is only scheduled here. unref() keeps the timer from holding a shutdown.
  setTimeout(() => {
    warmImages().catch(() => {});
  }, START_DELAY_MS).unref();
}

async function warmImages() {
  const origin = `http://127.0.0.1:${process.env.PORT ?? 3000}`;
  const started = Date.now();

  const html = await fetchHomepage(origin);
  if (!html) return;

  // Every /_next/image URL the page can ask for, from src and srcset alike.
  const urls = new Set<string>();
  for (const match of html.matchAll(/\/_next\/image\?[^"'\s,]+/g)) {
    urls.add(match[0].replaceAll("&amp;", "&"));
  }
  if (urls.size === 0) return;

  // One at a time: this should not compete with real visitors for the CPU.
  let ready = 0;
  for (const url of urls) {
    for (const accept of ACCEPT_HEADERS) {
      try {
        const response = await fetch(origin + url, {
          headers: { accept },
          signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        });
        await response.arrayBuffer();
        if (response.ok) ready += 1;
      } catch {
        // Skip it; a visitor's request will create this variant instead.
      }
    }
  }

  const seconds = ((Date.now() - started) / 1000).toFixed(1);
  console.log(`[warm-images] ${ready} image variants ready in ${seconds}s`);
}

/** The server is usually listening by now; retry briefly in case it is not. */
async function fetchHomepage(origin: string) {
  const deadline = Date.now() + READY_TIMEOUT_MS;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(origin + "/", { signal: AbortSignal.timeout(10_000) });
      if (response.ok) return await response.text();
    } catch {
      // Not listening yet.
    }
    await new Promise((resolve) => setTimeout(resolve, 1_000));
  }
  return null;
}
