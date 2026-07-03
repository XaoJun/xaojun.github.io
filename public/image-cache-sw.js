const IMAGE_CACHE_NAME = 'yanjun-blog-image-cache-v1'
const IMAGE_META_CACHE_NAME = 'yanjun-blog-image-cache-meta-v1'
const IMAGE_CACHE_TTL = 2 * 60 * 60 * 1000

const isImageRequest = (request) => {
  if (request.method !== 'GET') {
    return false
  }

  if (request.destination === 'image') {
    return true
  }

  return /\.(png|jpe?g|gif|webp|avif|svg)(\?.*)?$/i.test(request.url)
}

const metaRequest = (url) => new Request(`/__image-cache-meta__?url=${encodeURIComponent(url)}`)

const getCachedAt = async (url) => {
  const metaCache = await caches.open(IMAGE_META_CACHE_NAME)
  const response = await metaCache.match(metaRequest(url))

  if (!response) {
    return 0
  }

  try {
    const data = await response.json()
    return Number(data.cachedAt || 0)
  } catch (error) {
    return 0
  }
}

const setCachedAt = async (url) => {
  const metaCache = await caches.open(IMAGE_META_CACHE_NAME)
  await metaCache.put(
    metaRequest(url),
    new Response(JSON.stringify({ cachedAt: Date.now() }), {
      headers: { 'Content-Type': 'application/json' },
    }),
  )
}

const cacheImageFromNetwork = async (request) => {
  const response = await fetch(request)

  if (response.ok || response.type === 'opaque') {
    const cache = await caches.open(IMAGE_CACHE_NAME)
    await cache.put(request, response.clone())
    await setCachedAt(request.url)
  }

  return response
}

const handleImageRequest = async (request) => {
  const cache = await caches.open(IMAGE_CACHE_NAME)
  const cachedResponse = await cache.match(request)

  if (!cachedResponse) {
    return cacheImageFromNetwork(request)
  }

  const cachedAt = await getCachedAt(request.url)
  const isFresh = Date.now() - cachedAt < IMAGE_CACHE_TTL

  if (isFresh) {
    return cachedResponse
  }

  cacheImageFromNetwork(request).catch(() => undefined)
  return cachedResponse
}

self.addEventListener('install', (event) => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((cacheName) =>
              cacheName.startsWith('yanjun-blog-image-cache') &&
              ![IMAGE_CACHE_NAME, IMAGE_META_CACHE_NAME].includes(cacheName),
            )
            .map((cacheName) => caches.delete(cacheName)),
        ),
      )
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  if (!isImageRequest(event.request)) {
    return
  }

  event.respondWith(handleImageRequest(event.request))
})
