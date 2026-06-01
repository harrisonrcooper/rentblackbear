// ── Self-destructing service worker ──
// A previous version of this worker cached the app shell and JS chunks,
// which left stale assets in browsers (code changes wouldn't show up after
// a reload). Nothing registers a service worker anymore, so this script
// now exists only to unregister any lingering worker, wipe every cache it
// created, and force open tabs to reload onto fresh assets.
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // Delete every cache this origin created.
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
      // Unregister this worker so it never intercepts a fetch again.
      await self.registration.unregister();
      // Reload any open clients so they fetch fresh, uncached assets.
      const clients = await self.clients.matchAll({ type: "window" });
      for (const client of clients) {
        client.navigate(client.url);
      }
    })(),
  );
});

// While still alive for this final cycle, never serve from cache — always
// go straight to the network.
self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request));
});
