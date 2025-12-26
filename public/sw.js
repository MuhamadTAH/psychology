// 🧠 FILE PURPOSE
// This service worker handles offline caching and network requests for the PWA.
// It enables the app to work offline by caching essential resources and API responses.

// Step 1: Define cache names and versions
// Using versioned cache names allows us to update the cache when the app updates
const CACHE_NAME = 'duolearn-v2';
const RUNTIME_CACHE = 'duolearn-runtime-v2';

// Step 2: List essential resources to cache during installation
// These are the core files needed for the app to function offline
const PRECACHE_URLS = [
  '/',
  '/dark-psychology-dashboard',
  '/profile',
  '/shop',
  '/leagues',
];

// Step 3: Install event - cache essential resources
// This runs when the service worker is first installed
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        console.log('Attempting to cache these URLs:', PRECACHE_URLS);

        // Cache each URL individually to see which one fails
        return Promise.all(
          PRECACHE_URLS.map(url => {
            return cache.add(url)
              .then(() => {
                console.log('✅ Successfully cached:', url);
              })
              .catch((error) => {
                console.error('❌ Failed to cache:', url, error);
                // Don't throw - continue caching other URLs
              });
          })
        );
      })
      .then(() => self.skipWaiting())
  );
});

// ✅ In this section we achieved:
// Service worker installation and precaching of essential URLs

// Step 4: Activation event - clean up old caches
// This removes outdated caches when a new service worker activates
self.addEventListener('activate', (event) => {
  const currentCaches = [CACHE_NAME, RUNTIME_CACHE];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return cacheNames.filter((cacheName) => !currentCaches.includes(cacheName));
    }).then((cachesToDelete) => {
      return Promise.all(cachesToDelete.map((cacheToDelete) => {
        return caches.delete(cacheToDelete);
      }));
    }).then(() => self.clients.claim())
  );
});

// ✅ In this section we achieved:
// Cleanup of old caches to free up storage space

// Step 5: Fetch event - serve from cache, fallback to network
// This intercepts all network requests and implements a cache-first strategy
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests and chrome extensions
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Only cache GET requests; let other methods hit the network directly
  if (event.request.method !== 'GET') {
    event.respondWith(fetch(event.request));
    return;
  }

  // Handle API requests differently (network-first)
  if (event.request.url.includes('/api/') || event.request.url.includes('convex.cloud')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Only cache GET requests (Cache API doesn't support POST)
          if (response.status === 200 && event.request.method === 'GET') {
            const responseToCache = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // If network fails, try to serve from cache (only works for GET)
          if (event.request.method === 'GET') {
            return caches.match(event.request);
          }
          // For non-GET requests, return error
          return new Response('Network error', { status: 503 });
        })
    );
    return;
  }

  // For all other requests, use cache-first strategy
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response from cache
        if (response) {
          return response;
        }

        // Clone the request because it can only be consumed once
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then((response) => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response because it can only be consumed once
          const responseToCache = response.clone();

          caches.open(RUNTIME_CACHE)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        }).catch(() => {
          // If both network and cache fail, show offline page
          return caches.match('/offline');
        });
      })
  );
});

// ✅ In this section we achieved:
// Smart caching strategy that prioritizes cache for static resources
// and network for API calls, with offline fallback support

// Step 6: Background sync for offline actions
// This allows queuing actions when offline and syncing when back online
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-lessons') {
    event.waitUntil(syncLessons());
  }
});

async function syncLessons() {
  // Sync any pending lesson progress when back online
  console.log('Syncing lesson progress...');
  // This will be implemented based on your specific sync needs
}

// ✅ In this section we achieved:
// Background sync capability for offline-first functionality

// Step 7: Push notification support
// Handle push notifications for streak reminders and updates
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New update available!',
    icon: '/icons/icon-192x192.svg',
    badge: '/icons/icon-72x72.svg',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Open App',
        icon: '/icons/icon-96x96.svg'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/icon-96x96.svg'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('DuoLearn', options)
  );
});

// Step 8: Handle notification clicks
// Navigate to the app when user clicks a notification
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// ✅ In this section we achieved:
// Full push notification support with actions and click handlers
