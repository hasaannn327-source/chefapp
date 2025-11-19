const CACHE_NAME = 'al-pisir-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/public/icon-192.png',
  '/public/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});

