/*
 * Offline support for Manga Spelling.
 *
 * - Pages: network first, falling back to the cached copy when offline.
 * - Qwik bundles (/build, /assets): hashed, so cache first. Every bundle in
 *   q-manifest.json is precached so the whole app works offline after the
 *   first visit, and re-synced whenever the manifest hash changes.
 * - Self-hosted fonts (/fonts): immutable files listed in /fonts/index.json,
 *   precached so every glyph slice works offline; cache first.
 * - Spoken audio (/audio): Polly clips listed in /audio/index.json, precached
 *   in the background so every word works offline; cache first. Served with
 *   Range support because iOS Safari won't play media without it.
 * - Other static files: stale-while-revalidate.
 */

const CACHE = "manga-spell-v4";
const PAGES = ["/", "/play/", "/map/"];
const STATIC = [
  "/manifest.json",
  "/favicon.svg",
  "/favicon-kakkoii.svg",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

// Precaches the files named in /<dir>/index.json, in chunks so one failure doesn't drop the lot
async function precacheDir(dir) {
  const cache = await caches.open(CACHE);
  const res = await fetch(`/${dir}/index.json`);
  if (!res.ok) return;
  const files = (await res.json()).map((f) => `/${dir}/${f}`);
  const missing = [];
  for (const url of files) {
    if (!(await cache.match(url))) missing.push(url);
  }
  for (let i = 0; i < missing.length; i += 40) {
    await cache.addAll(missing.slice(i, i + 40)).catch(() => undefined);
  }
}

async function syncBundles() {
  const cache = await caches.open(CACHE);
  const res = await fetch("/q-manifest.json", { cache: "no-store" });
  if (!res.ok) return;
  const manifest = await res.json();
  const seen = await cache.match("/__manifest-hash");
  if (seen && (await seen.text()) === manifest.manifestHash) return;
  const urls = [
    ...Object.keys(manifest.bundles).map((b) => `/build/${b}`),
    ...Object.keys(manifest.assets ?? {}).map((a) => `/${a}`),
  ];
  const missing = [];
  for (const url of urls) {
    if (!(await cache.match(url))) missing.push(url);
  }
  await cache.addAll(missing);
  await cache.addAll(PAGES.map((p) => new Request(p, { cache: "reload" })));
  // Drop bundles from earlier deploys
  const current = new Set(urls);
  for (const req of await cache.keys()) {
    const path = new URL(req.url).pathname;
    if (
      (path.startsWith("/build/") || path.startsWith("/assets/")) &&
      !current.has(path)
    ) {
      await cache.delete(req);
    }
  }
  await cache.put("/__manifest-hash", new Response(manifest.manifestHash));
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      await cache.addAll([...PAGES, ...STATIC]);
      await syncBundles();
      await precacheDir("fonts").catch(() => undefined);
      await self.skipWaiting();
      await precacheDir("audio").catch(() => undefined);
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      for (const key of await caches.keys()) {
        if (key !== CACHE) await caches.delete(key);
      }
      await self.clients.claim();
    })(),
  );
});

let lastSync = 0;

async function networkFirst(event) {
  const cache = await caches.open(CACHE);
  try {
    const res = await fetch(event.request);
    if (res.ok) {
      const url = new URL(event.request.url);
      await cache.put(url.pathname, res.clone());
      // Pick up a new deploy's bundles at most every few minutes
      if (Date.now() - lastSync > 5 * 60 * 1000) {
        lastSync = Date.now();
        event.waitUntil(
          Promise.all([syncBundles(), precacheDir("audio")]).catch(
            () => undefined,
          ),
        );
      }
    }
    return res;
  } catch (err) {
    const cached =
      (await cache.match(event.request, { ignoreSearch: true })) ??
      (await cache.match("/"));
    if (cached) return cached;
    throw err;
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;
  const res = await fetch(request);
  if (res.ok) await cache.put(request, res.clone());
  return res;
}

async function audio(request) {
  const cache = await caches.open(CACHE);
  let res = await cache.match(request.url);
  if (!res) {
    // Fetch the whole file (not the range) so it can be cached
    res = await fetch(request.url);
    if (!res.ok) return res;
    await cache.put(request.url, res.clone());
  }
  const range = /^bytes=(\d*)-(\d*)$/.exec(request.headers.get("range") ?? "");
  if (!range) return res;
  const buf = await res.arrayBuffer();
  const size = buf.byteLength;
  const start = range[1] ? Number(range[1]) : size - Number(range[2]);
  const end =
    range[1] && range[2] ? Math.min(Number(range[2]), size - 1) : size - 1;
  if (!(start >= 0 && start <= end)) {
    return new Response(null, {
      status: 416,
      headers: { "Content-Range": `bytes */${size}` },
    });
  }
  return new Response(buf.slice(start, end + 1), {
    status: 206,
    headers: {
      "Content-Type": "audio/mpeg",
      "Content-Length": String(end - start + 1),
      "Content-Range": `bytes ${start}-${end}/${size}`,
      "Accept-Ranges": "bytes",
    },
  });
}

async function staleWhileRevalidate(event) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(event.request, { ignoreSearch: true });
  const fresh = fetch(event.request)
    .then(async (res) => {
      if (res.ok || res.type === "opaque")
        await cache.put(event.request, res.clone());
      return res;
    })
    .catch(() => cached);
  if (cached) {
    event.waitUntil(fresh);
    return cached;
  }
  return fresh;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(networkFirst(event));
  } else if (
    url.pathname.startsWith("/audio/") &&
    url.pathname.endsWith(".mp3")
  ) {
    event.respondWith(audio(request));
  } else if (
    url.pathname.startsWith("/build/") ||
    url.pathname.startsWith("/assets/") ||
    url.pathname.startsWith("/fonts/")
  ) {
    event.respondWith(cacheFirst(request));
  } else if (url.pathname !== "/sw.js") {
    event.respondWith(staleWhileRevalidate(event));
  }
});
