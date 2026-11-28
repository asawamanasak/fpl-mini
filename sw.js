/* FPLSaWaDiKa App-Shell Service Worker */
const CACHE_VERSION = 'fpl-shell-82edc9b7-0eba8a52';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter((k) => k.startsWith('fpl-shell-') && k !== CACHE_VERSION)
        .map((k) => caches.delete(k))
    );
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (!req || req.method !== 'GET') return;

  let url;
  try {
    url = new URL(req.url);
  } catch (_) {
    return;
  }

  if (url.origin !== self.location.origin) return;
  const p = url.pathname || '';
  if (p.startsWith('/api/') || p === '/pay' || p.startsWith('/pay/') || p === '/sw.js') return;

  // Cache-First for versioned static assets & icons/images
  if (p.startsWith('/assets/') || p.startsWith('/images/') || p.endsWith('manifest.webmanifest') || p.endsWith('site.webmanifest')) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_VERSION);
      const hit = await cache.match(req);
      if (hit) return hit;
      const resp = await fetch(req);
      if (resp && resp.status === 200 && resp.type === 'basic') {
        cache.put(req, resp.clone()).catch(() => {});
      }
      return resp;
    })());
    return;
  }

  // Network-First with offline fallback for HTML navigations & league JSON data
  if (req.mode === 'navigate' || p.startsWith('/data/')) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_VERSION);
      try {
        const fresh = await fetch(req);
        if (fresh && fresh.status === 200 && fresh.type === 'basic') {
          cache.put(req, fresh.clone()).catch(() => {});
        }
        return fresh;
      } catch (err) {
        const fallback = await cache.match(req);
        if (fallback) return fallback;
        throw err;
      }
    })());
  }
});
