const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/index.js",
  "icons/icon-192x192.png",
  "icons/icon-512x512.png",
  "/style.css",
  "/manifest.webmanifest",
];

const PRECACHE = "precache-v1";
const RUNTIME = "runtime";
const DATACACHE = "datacache-v1";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(PRECACHE)
      .then((cache) => cache.addAll(FILES_TO_CACHE))
      .then(self.skipWaiting())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.url.includes("/api/")) {
    event.respondWith(
      caches.open(DATACACHE).then((cachedResponse) => {
        return fetch(event.request)
          .then((response) => {
            if (response.status === 200) {
              cache.put(event.request.url, response.clone());
            }
            return response;
          })
          .catch((err) => {
            return cache.match(event.request);
          });
      })
    );
  }
  event.respondWith(fetch.(event.request)
  .catch(() => {
    return caches.match(event.request).then(function(response)) {
        if (response) {
            return response;
          } else if (event.request.headers.get("accept").includes("text/html")) {
            // return the cached home page for all requests for html pages
            return caches.match("/");
          }
        })
      })
    );
  })
});
