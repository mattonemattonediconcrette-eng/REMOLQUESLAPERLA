const CACHE_NAME = 'rlp-cache-v5';
const OFFLINE_URL = 'offline.html';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/styles.css',
  '/data/products.json',
  '/assets/logo.png',
  '/assets/images/hero-todos.jpg',
  '/assets/images/hero-todos-1200.jpg',
  '/assets/images/hero-todos.webp',
  '/product/rem-carga-1.html',
  '/product/rem-carga-plataforma-1.html',
  '/product/rem-carga-cama-baja-1.html',
  '/product/foodtruck-1.html',
  '/product/foodtruck-llave-en-mano-1.html',
  '/product/rem-especial-1.html',
  '/product/caja-sec-1.html',
  '/product/rem-ganaderos-1.html',
  '/product/rem-oficina-1.html',
  '/product/rem-atv-1.html',
  '/product/rem-enclosed-1.html',
  '/product/rem-refrigerado-1.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match(OFFLINE_URL))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200) {
            return networkResponse;
          }
          const copy = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return networkResponse;
        })
        .catch(() => {
          if (event.request.destination === 'image') {
            return caches.match('/assets/logo.png');
          }
          return null;
        });
    })
  );
});
