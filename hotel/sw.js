// Piano Hotel SW v3 — clone() sırası düzeltildi
const CACHE = 'piano-hotel-v3';
const URLS = [
  '/hotel/mobile-hotel-panel.html',
  '/assets/piano-theme.css',
  '/assets/theme-overrides.css',
  '/assets/common.js',
  '/assets/firebase-api.js',
  '/config/config.js',
  '/config/firebase.js',
  '/hotel/services/hotel-reservation-service.js',
  '/hotel/components/hotel-reservation-card.js',
  '/hotel/utils/hotel-utils.js',
  '/hotel/views/hotel-panel-view.js'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(URLS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = e.request.url;
  if (url.includes('firebaseio.com') || url.includes('googleapis.com') ||
      url.includes('gstatic.com') || url.includes('firebaseapp.com')) return;

  e.respondWith(
    fetch(e.request)
      .then(r => {
        if (!r || r.status !== 200 || r.type === 'opaque') return r;
        const clone = r.clone(); // ← önce clone al
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return r; // ← sonra orijinali döndür
      })
      .catch(() => caches.match(e.request))
  );
});
