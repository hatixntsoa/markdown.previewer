const CACHE_NAME = 'markdown-previewer-v0.2';
const urlsToCache = [
  '/markdown.previewer',
  '/markdown.previewer/index.html',
  '/markdown.previewer/css/global/style.css',
  '/markdown.previewer/css/global/scroll.css',
  '/markdown.previewer/css/global/colors.css',
  '/markdown.previewer/css/mdpreview/ghmd.min.css',
  '/markdown.previewer/css/katex/katex.min.css',
  '/markdown.previewer/imgs/check.png',
  '/markdown.previewer/imgs/copy.png',
  '/markdown.previewer/imgs/markdown.png',
  '/markdown.previewer/js/katex/katex.min.js',
  '/markdown.previewer/js/katex/auto-render.min.js',
  '/markdown.previewer/js/mdpreview/marked.min.js',
  '/markdown.previewer/js/mdpreview/preview.js',
  '/markdown.previewer/js/pwa/pwa.js',
  '/markdown.previewer/js/pwa/service-worker.js',
  '/markdown.previewer/manifest.json'
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
