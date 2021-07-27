const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/index.js",
  "icons/icon-192x192.png",
  "icons/icon-512x512.png",
  "/styles.css",
  "/manifest.webmanifest",
];

const PRECACHE = "precache-v1";
const RUNTIME = "runtime";
const DATACACHE = "datacache-v1";

// install
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(PRECACHE)
      .then((cache) => cache.addAll(FILES_TO_CACHE))
      .then(self.skipWaiting())
  );
});

// fetch
self.addEventListener("fetch", (event) => {
  // cache successful request to the API
  if (event.request.url.includes("/api/")) {
    event.respondWith(
      caches.open(DATACACHE).then((cachedResponse) => {
        return fetch(event.request)
          .then((response) => {
            // if the response is successful, clone it and store it in the cache
            if (response.status === 200) {
              cachedResponse.put(event.request.url, response.clone());
            }
            return response;
          })
          .catch((err) => {
            // Network request failed, try to get it from the cache
            return cachedResponse.match(event.request);
          });
      })
    );
  }
  // if the request is not for the API, use static assets using offline tracker
  event.respondWith(
    fetch(event.request).catch(function () {
      return caches.match(event.request).then(function (response) {
        if (response) {
          return response;
        } else if (event.request.headers.get("accept").includes("text/html")) {
          // return the cached home page for all requests for html pages
          return caches.match("/");
        }
      });
    })
  );
});
