importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

workbox.precaching.precacheAndRoute([]);

workbox.routing.registerNavigationRoute(
  // look up its corresponding cache key for /view1
  workbox.precaching.getCacheKeyForURL('/my-view1')
);

workbox.routing.registerNavigationRoute(
  // look up its corresponding cache key for /view1
  workbox.precaching.getCacheKeyForURL('/my-view2')
);

workbox.routing.registerNavigationRoute(
  // look up its corresponding cache key for /view1
  workbox.precaching.getCacheKeyForURL('/my-view3')
);