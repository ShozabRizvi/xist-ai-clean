const CACHE_NAME = 'xist-ai-v1.0.3';
const STATIC_CACHE = 'xist-static-v1.0.3';

const urlsToCache = [
  '/',
  '/manifest.json',
  '/favicon.ico'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('🔧 SW Installing...');
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then(cache => {
        return cache.addAll(urlsToCache);
      }),
      caches.open(STATIC_CACHE)
    ]).then(() => {
      console.log('✅ SW Installation complete');
      return self.skipWaiting();
    })
  );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  console.log('🚀 SW Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ SW Activated');
      return self.clients.claim();
    })
  );
});

// Fetch event with cache strategy
self.addEventListener('fetch', (event) => {
  // Skip cross-origin, chrome-extension, and analytics requests
  if (!event.request.url.startsWith(self.location.origin) ||
      event.request.url.includes('chrome-extension') ||
      event.request.url.includes('googletagmanager.com') ||
      event.request.url.includes('google-analytics.com') ||
      event.request.url.includes('gtag')) {
    return;
  }

  const url = new URL(event.request.url);
  
  // For HTML files (navigation requests)
  if (event.request.mode === 'navigate' || 
      (event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html'))) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Cache successful responses
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback to cache if network fails
          return caches.match(event.request).then(response => {
            return response || caches.match('/');
          });
        })
    );
    return;
  }

  // For static assets (JS, CSS, images)
  if (url.pathname.includes('/static/') || 
      url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
    
    // For JS and CSS files - always try network first (cache busting)
    if (url.pathname.includes('/static/js/') || url.pathname.includes('/static/css/')) {
      event.respondWith(
        fetch(event.request)
          .then(response => {
            if (response.status === 200) {
              const responseClone = response.clone();
              caches.open(STATIC_CACHE).then(cache => {
                cache.put(event.request, responseClone);
              });
            }
            return response;
          })
          .catch(() => {
            return caches.match(event.request);
          })
      );
    } else {
      // For other static assets - cache first
      event.respondWith(
        caches.match(event.request).then(response => {
          return response || fetch(event.request).then(fetchResponse => {
            if (fetchResponse.status === 200) {
              const responseClone = fetchResponse.clone();
              caches.open(STATIC_CACHE).then(cache => {
                cache.put(event.request, responseClone);
              });
            }
            return fetchResponse;
          });
        })
      );
    }
    return;
  }

  // For all other requests - network first
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});

// Listen for messages from the main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.keys().then(names => {
      names.forEach(name => caches.delete(name));
    });
  }
});
