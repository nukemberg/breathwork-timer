const CACHE = 'breathwork-v1'

// Pre-cache the app shell on install
self.addEventListener('install', event => {
  self.skipWaiting()
  event.waitUntil(
    caches.open(CACHE).then(cache =>
      cache.addAll([
        './',
        './index.html',
        './manifest.webmanifest',
      ])
    )
  )
})

// Remove old caches on activate
self.addEventListener('activate', event => {
  self.clients.claim()
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      )
    )
  )
})

self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)

  // Only handle same-origin requests
  if (url.origin !== self.location.origin) return

  // Navigation requests: network-first, fall back to cached shell
  // This keeps SPA hash routing working offline
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          const clone = response.clone()
          caches.open(CACHE).then(c => c.put(request, clone))
          return response
        })
        .catch(() => caches.match('./index.html'))
    )
    return
  }

  // Static assets (JS/CSS/icons): cache-first, fetch + cache on miss
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached
      return fetch(request).then(response => {
        if (response.ok) {
          const clone = response.clone()
          caches.open(CACHE).then(c => c.put(request, clone))
        }
        return response
      })
    })
  )
})
