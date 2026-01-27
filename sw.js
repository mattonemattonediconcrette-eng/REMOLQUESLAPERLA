const CACHE_NAME = 'rlp-cache-v5';
const OFFLINE_URL = 'offline.html';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/styles.css',
  '/offline.html',
  '/data/products.json',
  '/assets/logo.png',
  '/assets/food-truck-1.jpg',
  '/assets/food-truck-2.jpg',
  '/assets/food-truck-3.jpg',
  '/assets/food-truck-4.jpg',
  '/assets/food-truck-4-alt.jpg',
  '/assets/remolque-multiusos-1.jpg',
  '/assets/remolque-multiusos-2.jpg',
  '/assets/remolque-multiusos-3.jpg',
  '/assets/remolque-multiusos-4.jpg',
  '/assets/cama-baja-3t.jpg',
  '/assets/cama-baja-6t.jpg',
  '/assets/ganadero-1.jpg',
  '/assets/ganadero-2.jpg',
  '/assets/ganadero-4.jpg',
  '/assets/oficina-movil-1.jpg',
  '/assets/oficina-movil-5.jpg',
  '/product/remolque-carga-cama-baja-3-toneladas.html',
  '/product/remolque-carga-cama-baja-6-toneladas.html',
  '/product/food-truck-premium.html',
  '/product/food-truck-compacto.html',
  '/product/food-truck-profesional.html',
  '/product/food-truck-deluxe.html',
  '/product/remolque-ganadero-estandar.html',
  '/product/remolque-ganadero-reforzado.html',
  '/product/remolque-ganadero-premium.html',
  '/product/remolque-multiusos-basico.html',
  '/product/remolque-multiusos-mediano.html',
  '/product/remolque-multiusos-grande.html',
  '/product/remolque-multiusos-premium.html',
  '/product/oficina-movil-basica.html',
  '/product/oficina-movil-equipada.html'
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
