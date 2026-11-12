/* Service worker du portfolio : le site reste consultable hors ligne.
 * - fichiers versionnés (/assets/*) : cache d'abord (ils ne changent jamais)
 * - pages : réseau d'abord, copie en cache en secours
 * - polices / images externes : cache puis mise à jour en arrière-plan
 * Les appels d'API (Sanity, GitHub, Web3Forms) ne sont jamais mis en cache ici.
 */
const VERSION = 'mkd-v3'
const SHELL = ['/', '/favicon.svg', '/icon-192.png', '/manifest.webmanifest']

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()))
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  )
})

const isApi = (url) => /api\.github\.com|sanity\.io|apicdn\.sanity|web3forms|cal\.com/.test(url.hostname)

self.addEventListener('fetch', (e) => {
  const req = e.request
  if (req.method !== 'GET') return
  const url = new URL(req.url)
  if (isApi(url)) return

  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone()
          caches.open(VERSION).then((c) => c.put('/', copy))
          return res
        })
        .catch(() => caches.match('/')),
    )
    return
  }

  if (url.origin === location.origin && url.pathname.startsWith('/assets/')) {
    e.respondWith(
      caches.match(req).then(
        (hit) =>
          hit ||
          fetch(req).then((res) => {
            const copy = res.clone()
            caches.open(VERSION).then((c) => c.put(req, copy))
            return res
          }),
      ),
    )
    return
  }

  if (/fonts\.(googleapis|gstatic)\.com|cdn\.sanity\.io/.test(url.hostname) || url.origin === location.origin) {
    e.respondWith(
      caches.match(req).then((hit) => {
        const net = fetch(req)
          .then((res) => {
            if (res.ok || res.type === 'opaque') {
              const copy = res.clone()
              caches.open(VERSION).then((c) => c.put(req, copy))
            }
            return res
          })
          .catch(() => hit)
        return hit || net
      }),
    )
  }
})
