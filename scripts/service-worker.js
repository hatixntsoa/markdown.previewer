const CACHE_NAME = 'markdown-preview-v1';
const urlsToCache = [
  '/markdown_preview',
  '/markdown_preview/index.html',
  '/markdown_preview/styles/style.css',
  '/markdown_preview/scripts/marked.min.js',
  '/markdown_preview/scripts/preview.js',
  '/markdown_preview/images/check.png',
  '/markdown_preview/images/copy.png',
  '/markdown_preview/images/markdown.png',
  '/markdown_preview/manifest.json'
];

// Install event - Cache all specified files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('Caching failed:', error);
      })
  );
});

// Fetch event - Serve cached files or fetch from network if not cached
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request)
          .then((networkResponse) => {
            // Optionally cache the new request
            if (event.request.method === 'GET' && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });
            }
            return networkResponse;
          });
      })
      .catch((error) => {
        console.error('Fetch failed:', error);
      })
  );
});
