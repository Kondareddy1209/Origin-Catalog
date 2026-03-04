const CACHE_NAME = "catalogbuddy-v1";
const ASSETS_TO_CACHE = [
    "/",
    "/manifest.json",
    "/icon-192x192.png",
    "/icon-512x512.png",
    "/product-pot.png"
];

// Install Event
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("PWA: Caching shell assets");
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// Activate Event
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
            );
        })
    );
});

// Fetch Event
self.addEventListener("fetch", (event) => {
    // Basic network-first strategy for dynamic content, cache-first for static
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) return cachedResponse;
            return fetch(event.request).catch(() => {
                // If both fail and it's a navigation request, we could return an offline page
            });
        })
    );
});
