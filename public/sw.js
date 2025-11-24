// Service Worker for CV Portfolio PWA
// Cache version - Updated to force cache refresh (v3 - cache bust)
const CACHE_NAME = 'cv-omar-v3';
const RUNTIME_CACHE = 'cv-omar-runtime-v3';

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/static/css/main.css',
  '/static/js/main.js',
  '/my_image.jpg',
  '/logo192.png',
  '/logo512.png',
  '/favicon.ico',
  '/manifest.json',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting()) // Activate immediately
  );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating and cleaning old caches...');
  
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        // Delete all old caches that don't match current version
        const deletePromises = cacheNames
          .filter((cacheName) => {
            // Delete all caches that are not the current version
            return (
              cacheName !== CACHE_NAME &&
              cacheName !== RUNTIME_CACHE &&
              (cacheName.startsWith('cv-omar-') || cacheName.startsWith('cv-omar-runtime'))
            );
          })
          .map((cacheName) => {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          });
        
        // Also delete any other old caches
        const otherCaches = cacheNames.filter((cacheName) => {
          return !cacheName.startsWith('cv-omar-');
        });
        
        otherCaches.forEach((cacheName) => {
          console.log('[Service Worker] Deleting unrelated cache:', cacheName);
          deletePromises.push(caches.delete(cacheName));
        });
        
        return Promise.all(deletePromises);
      })
      .then(() => {
        console.log('[Service Worker] Old caches cleaned successfully');
        return self.clients.claim(); // Take control of all pages
      })
  );
});

// Fetch event - Network First strategy for HTML, Cache First for assets
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests
  const url = new URL(event.request.url);
  if (url.origin !== location.origin) {
    return;
  }

  // Network First strategy for HTML pages (always get fresh content)
  if (event.request.headers.get('accept')?.includes('text/html') || 
      event.request.url === location.origin + '/' ||
      event.request.url.endsWith('.html')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache the fresh response
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback to cache if network fails
          return caches.match(event.request);
        })
    );
    return;
  }

  // Cache First strategy for static assets (JS, CSS, images, etc.)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached version if available
      if (cachedResponse) {
        // Also fetch in background to update cache
        fetch(event.request).then((response) => {
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
        }).catch(() => {});
        return cachedResponse;
      }

      // Fetch from network
      return fetch(event.request).then((response) => {
        // Don't cache non-successful responses
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Clone the response
        const responseToCache = response.clone();

        // Cache the response
        caches.open(RUNTIME_CACHE).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
});

// Handle messages from the client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
