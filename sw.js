/* ═══════════════════════════════════════════════
   THE CODEX — Service Worker
   Offline-first caching strategy
═══════════════════════════════════════════════ */

const CACHE_NAME = 'codex-v1';

const STATIC_ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Cinzel:wght@400;500;600;700&family=IM+Fell+English:ital@0;1&display=swap',
];

/* ── INSTALL: cache static assets ── */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return Promise.allSettled(
        STATIC_ASSETS.map(url => cache.add(url).catch(e => console.warn('Cache miss:', url, e)))
      );
    }).then(() => self.skipWaiting())
  );
});

/* ── ACTIVATE: clean old caches ── */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

/* ── FETCH: cache-first for local, network-first for APIs ── */
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // For API calls (gold price etc.) — network with timeout, fallback to nothing
  if (url.hostname.includes('metals.live') || url.hostname.includes('er-api.com')) {
    event.respondWith(
      fetch(event.request).catch(() => new Response(JSON.stringify({error:'offline'}), {
        headers: { 'Content-Type': 'application/json' }
      }))
    );
    return;
  }

  // Google Fonts — network first, cache fallback
  if (url.hostname.includes('fonts.googleapis.com') || url.hostname.includes('fonts.gstatic.com')) {
    event.respondWith(
      fetch(event.request)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
          return res;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Local assets — cache first
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(res => {
        if (!res || res.status !== 200 || res.type === 'opaque') return res;
        const clone = res.clone();
        caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
        return res;
      }).catch(() => {
        // Offline fallback for navigation
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
