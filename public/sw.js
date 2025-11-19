const CACHE_NAME = 'al-pisir-v3'; // Versiyonu değiştirdim ki tarayıcı güncellesin
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// Yükleme (Install)
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Beklemeden yeni versiyona geç
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Önbellek dosyaları yükleniyor...');
        return cache.addAll(urlsToCache);
      })
  );
});

// İstekleri Yakalama (Fetch)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Önbellekte varsa döndür, yoksa internetten çek
        return response || fetch(event.request);
      })
  );
});
