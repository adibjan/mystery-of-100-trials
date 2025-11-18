self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('memory-game-cache').then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/style.css',
        '/game-challenge.js',
        '/match.mp3',
        '/wrong.mp3',
        '/reward.mp3',
        '/win.mp3'
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});