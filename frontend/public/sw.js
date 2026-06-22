// Mirayya ERP - Service Worker
// Caching strategy: stale-while-revalidate for pages, cache-first for assets

const CACHE_NAME = 'mirayya-erp-v1';
const STATIC_CACHE = 'mirayya-static-v1';

// Pages to precache (critical for offline)
const PRECACHE_URLS = [
  '/login',
  '/dashboard/karyawan/absensi',
  '/dashboard/karyawan',
];

// Static assets patterns
const STATIC_EXTENSIONS = ['.js', '.css', '.woff2', '.woff', '.ttf', '.png', '.jpg', '.jpeg', '.svg', '.ico'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== STATIC_CACHE)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip API calls — always go to network
  if (url.pathname.startsWith('/api/')) return;

  // Static assets — cache first
  if (STATIC_EXTENSIONS.some(ext => url.pathname.endsWith(ext))) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put(request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  // Pages — stale-while-revalidate
  event.respondWith(
    caches.match(request).then((cached) => {
      const fetchPromise = fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => {
          // If network fails and we have cache, return cached version
          if (cached) return cached;
          // If no cache either, return a basic offline page
          return new Response('Anda sedang offline. Silakan coba lagi saat terhubung ke internet.', {
            headers: { 'Content-Type': 'text/html; charset=utf-8' },
            status: 503,
          });
        });

      // Return cached version immediately, update in background
      return cached || fetchPromise;
    })
  );
});
