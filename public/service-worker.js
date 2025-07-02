self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => Promise.all(cacheNames.map(cacheName => caches.delete(cacheName))))
      .then(() => self.registration.unregister())
      .then(() => self.clients.matchAll())
      .then(clients => {
        clients.forEach(client => client.navigate(client.url));
      })
  );
});

self.addEventListener('fetch', (event) => {
  return;
}); 