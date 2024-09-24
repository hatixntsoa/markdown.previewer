const CACHE_NAME = 'markdown-previewer-v0.2';
const urlsToCache = [
  '/markdown_previewer',
  '/markdown_previewer/index.html',
  '/markdown_previewer/css/global/style.css',
  '/markdown_previewer/css/global/scroll.css',
  '/markdown_previewer/css/global/colors.css',
  '/markdown_previewer/css/mdpreview/ghmd.min.css',
  '/markdown_previewer/css/katex/katex.min.css',
  '/markdown_previewer/imgs/check.png',
  '/markdown_previewer/imgs/copy.png',
  '/markdown_previewer/imgs/markdown.png',
  '/markdown_previewer/js/katex/katex.min.js',
  '/markdown_previewer/js/katex/auto-render.min.js',
  '/markdown_previewer/js/mdpreview/marked.min.js',
  '/markdown_previewer/js/mdpreview/preview.js',
  '/markdown_previewer/js/pwa/pwa.js',
  '/markdown_previewer/js/pwa/service-worker.js',
  '/markdown_previewer/manifest.json'
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
