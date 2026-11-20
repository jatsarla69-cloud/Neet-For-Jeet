const CACHE_NAME = 'neet-for-jeet-shell-v5';
// Sirf wahi files jo sach me repo me hain (single-file index.html build)
const SHELL = ['./', './index.html', './manifest.json', './icon-192.png', './favicon-32.png'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      // allSettled: koi ek file missing ho to bhi install fail nahi hoga
      .then(cache => Promise.allSettled(SHELL.map(url => cache.add(url))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;

  // Page (index.html) pehle network se -> GitHub par update karte hi naya interface dikhe
  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(request);
        const copy = fresh.clone();
        caches.open(CACHE_NAME).then(c => c.put('./index.html', copy));
        return fresh;
      } catch (e) {
        return (await caches.match('./index.html')) || Response.error();
      }
    })());
    return;
  }

  // Images/baaki files: cache first, nahi mila to network
  event.respondWith((async () => {
    const cached = await caches.match(request);
    if (cached) return cached;
    try {
      const response = await fetch(request);
      if (response.ok) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(c => c.put(request, copy));
      }
      return response;
    } catch (e) {
      return Response.error();
    }
  })());
});
