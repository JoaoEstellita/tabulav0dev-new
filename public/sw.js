const CACHE_NAME = 'tabula-estelar-v2';
const urlsToCache = [
  '/',
  '/app',
  '/manifest.json',
  '/favicon.ico'
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
});

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      }
    )
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

// Push: exibir tÃ­tulo/corpo vindos do payload
self.addEventListener('push', (event) => {
  const data = (event.data && (() => { try { return event.data.json() } catch { return {} } })()) || {}
  const title = data.title || 'TÃ¡bula Estelar'
  const body = data.body || ''
  event.waitUntil(self.registration.showNotification(title, {
    body,
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    data
  }))
})

// Click: abrir /app
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(clients.openWindow('/app'))
})

