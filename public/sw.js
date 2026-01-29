const CACHE_NAME = 'tabula-estelar-v3';
const urlsToCache = [
  '/',
  '/app',
  '/manifest.json',
  '/favicon.ico',
  '/icons/notification-icon.png'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Fetch event
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const accept = request.headers.get('accept') || '';
  const isHtmlRequest = request.mode === 'navigate' || accept.includes('text/html');

  if (isHtmlRequest) {
    // Network-first for HTML to avoid stale bundle references after deploys.
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Cache-first for other assets.
  event.respondWith(
    caches.match(request)
      .then((response) => response || fetch(request))
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Recarregar clientes para pegar SW novo
  event.waitUntil(self.clients.claim())
});

// Push: exibir titulo/corpo vindos do payload
self.addEventListener('push', (event) => {
  const data = (event.data && (() => { try { return event.data.json() } catch { return {} } })()) || {}
  const title = data.title || 'Tabula Estelar'
  const body = data.body || ''
  const notificationIcon = '/icons/notification-icon.png'
  event.waitUntil(self.registration.showNotification(title, {
    body,
    icon: notificationIcon,
    badge: notificationIcon,
    data
  }))
})

// Click: abrir /app
self.addEventListener('notificationclick', (event) => {
  const data = event.notification?.data || {}
  const targetUrl =
    data.url ||
    data.deepLink?.url ||
    (typeof data.deepLink === 'string' ? data.deepLink : null) ||
    '/app'
  event.notification.close()
  event.waitUntil(clients.openWindow(targetUrl))
})
