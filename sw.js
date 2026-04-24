// ─── sw.js — Rapid Report Service Worker ────────────────────────────────────
// Strategy: Cache-first for all app assets.
// On End Shift the app works identically with zero signal — Faraday cage proof.

const CACHE_NAME = "rapid-report-v1";

// Everything the app needs to run completely offline
const ASSETS = [
  "./index.html",
  "./revenue.js",
  "https://fonts.googleapis.com/css2?family=Overpass:wght@400;600;700&display=swap",
];

// Install — cache all core assets immediately
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[SW] Caching app shell");
      return cache.addAll(ASSETS);
    }),
  );
  self.skipWaiting(); // Activate immediately, don't wait for old SW to die
});

// Activate — delete any old cache versions
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => {
            console.log("[SW] Deleting old cache:", key);
            return caches.delete(key);
          }),
      ),
    ),
  );
  self.clients.claim(); // Take control of all open tabs immediately
});

// Fetch — serve from cache, fall back to network
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        // Cache any new successful GET requests on the fly
        if (event.request.method === "GET" && response.status === 200) {
          const copy = response.clone();
          caches
            .open(CACHE_NAME)
            .then((cache) => cache.put(event.request, copy));
        }
        return response;
      });
    }),
  );
});
