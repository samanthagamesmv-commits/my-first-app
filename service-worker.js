const CACHE_NAME = 'bunsho-check-v1';
const SHELL_FILES = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_FILES))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Anthropicへの通信は絶対にキャッシュせず、常にネットワークへ素通しする
  if (url.hostname.includes('anthropic.com')) {
    return;
  }

  // 画面の見た目（HTML/CSS/JS/アイコン）だけをオフライン用にキャッシュ
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
