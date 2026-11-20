const STATIC_CACHE = 'mandala-static-v3';
const MEDIA_CACHE = 'mandala-media-v3';
const MAX_MEDIA_ITEMS = 180;

const CORE_ASSETS = [
  './',
  './index.html',
  './offline.html',
  './favicon.ico',
  './favicon.svg',
  './manifest.webmanifest',
  './assets/pwa/icon-192.png',
  './assets/pwa/icon-512.png',
  './styles/main.css',
  './scripts/catalog.js',
  './scripts/audio.js',
  './scripts/app.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  const validCaches = new Set([STATIC_CACHE, MEDIA_CACHE]);
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => !validCaches.has(k)).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

async function trimCache(cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length > maxItems) {
    await Promise.all(keys.slice(0, keys.length - maxItems).map((k) => cache.delete(k)));
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Navegação (HTML): Network-First com fallback para cache / offline.html
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.ok) {
            const clone = response.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put('./index.html', clone));
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match('./index.html');
          return cached || caches.match('./offline.html');
        })
    );
    return;
  }

  // Imagens (WebP/PNG/JPG): Cache-First com atualização em segundo plano (Stale-While-Revalidate)
  if (request.destination === 'image' || /\.(webp|png|jpe?g|svg|ico)$/i.test(url.pathname)) {
    event.respondWith(
      caches.open(MEDIA_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        const networkPromise = fetch(request)
          .then((response) => {
            if (response && response.ok) {
              cache.put(request, response.clone());
              trimCache(MEDIA_CACHE, MAX_MEDIA_ITEMS);
            }
            return response;
          })
          .catch(() => cached);

        return cached || networkPromise;
      })
    );
    return;
  }

  // Demais assets estáticos (CSS/JS/Manifest): Stale-While-Revalidate
  event.respondWith(
    caches.open(STATIC_CACHE).then(async (cache) => {
      const cached = await cache.match(request);
      const networkPromise = fetch(request)
        .then((response) => {
          if (response && response.ok && response.type === 'basic') {
            cache.put(request, response.clone());
          }
          return response;
        })
        .catch(() => cached);

      return cached || networkPromise;
    })
  );
});
