const CACHE_VERSION = '2.0.0';
const STATIC_CACHE = `semen-nusantara-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `semen-nusantara-dynamic-${CACHE_VERSION}`;
const IMAGE_CACHE = `semen-nusantara-images-${CACHE_VERSION}`;

// Cache strategies
const CACHE_STRATEGIES = {
  STATIC: 'static',      // Cache first for static assets
  DYNAMIC: 'dynamic',    // Network first for dynamic content
  IMAGE: 'image'        // Cache first for images with WebP support
};

// Static assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/produk',
  '/proyek',
  '/tentang',
  '/kontak',
  '/download',
  '/keberlanjutan',
  '/investor',
  '/csr',
  '/og-image.jpg',
  '/vite.svg',
  // Critical CSS and JS files will be cached automatically
];

// Install event - cache critical resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheName.includes(CACHE_VERSION)) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Determine cache strategy based on request
const getCacheStrategy = (request) => {
  const url = new URL(request.url);
  
  // Images - use image cache strategy
  if (request.destination === 'image') {
    return CACHE_STRATEGIES.IMAGE;
  }
  
  // Static assets (CSS, JS, fonts) - use static cache
  if (request.destination === 'script' || 
      request.destination === 'style' || 
      request.destination === 'font') {
    return CACHE_STRATEGIES.STATIC;
  }
  
  // API calls - use dynamic cache
  if (url.pathname.startsWith('/api/')) {
    return CACHE_STRATEGIES.DYNAMIC;
  }
  
  // Pages - use dynamic cache for better freshness
  return CACHE_STRATEGIES.DYNAMIC;
};

// Cache first strategy for static assets
const cacheFirst = async (request, cacheName) => {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  
  if (cached) {
    // Update cache in background
    fetch(request).then(response => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
    }).catch(() => {}); // Ignore network errors for cache updates
    
    return cached;
  }
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.error('Network request failed:', error);
    throw error;
  }
};

// Network first strategy for dynamic content
const networkFirst = async (request, cacheName) => {
  const cache = await caches.open(cacheName);
  
  try {
    const response = await fetch(request);
    
    // Cache successful responses
    if (response.ok) {
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.log('Network failed, trying cache:', error);
    const cached = await cache.match(request);
    
    if (cached) {
      return cached;
    }
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/') || new Response('Offline', { status: 503 });
    }
    
    throw error;
  }
};

// Optimized image handling with WebP support
const handleImageRequest = async (request) => {
  const cache = await caches.open(IMAGE_CACHE);
  const cached = await cache.match(request);
  
  if (cached) {
    return cached;
  }
  
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      // Try to cache WebP version as well
      const url = new URL(request.url);
      const webpUrl = url.href.replace(/\.(jpg|jpeg|png)$/i, '.webp');
      
      // Cache original
      cache.put(request, response.clone());
      
      // Preload WebP version if supported
      if (webpUrl !== url.href) {
        fetch(webpUrl).then(webpResponse => {
          if (webpResponse.ok) {
            cache.put(new Request(webpUrl), webpResponse);
          }
        }).catch(() => {}); // Ignore WebP preload errors
      }
    }
    
    return response;
  } catch (error) {
    // Try WebP fallback
    const url = new URL(request.url);
    const webpUrl = url.href.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    const webpCached = await cache.match(new Request(webpUrl));
    
    if (webpCached) {
      return webpCached;
    }
    
    throw error;
  }
};

// Main fetch event handler
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const strategy = getCacheStrategy(request);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension requests
  if (request.url.startsWith('chrome-extension://')) {
    return;
  }
  
  event.respondWith(
    (async () => {
      try {
        switch (strategy) {
          case CACHE_STRATEGIES.STATIC:
            return await cacheFirst(request, STATIC_CACHE);
            
          case CACHE_STRATEGIES.IMAGE:
            return await handleImageRequest(request);
            
          case CACHE_STRATEGIES.DYNAMIC:
            return await networkFirst(request, DYNAMIC_CACHE);
            
          default:
            return await fetch(request);
        }
      } catch (error) {
        console.error('Cache strategy failed:', error);
        
        // Final fallback for navigation requests
        if (request.mode === 'navigate') {
          return caches.match('/') || new Response('Offline', { 
            status: 503,
            statusText: 'Service Unavailable'
          });
        }
        
        throw error;
      }
    })()
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Handle background sync tasks
      console.log('Background sync triggered')
    );
  }
});

// Push notification handling
self.addEventListener('push', (event) => {
  if (event.data) {
    const options = {
      body: event.data.text(),
      icon: '/vite.svg',
      badge: '/vite.svg',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      }
    };
    
    event.waitUntil(
      self.registration.showNotification('Semen Nusantara', options)
    );
  }
});

// Cache cleanup - run periodically
const cleanupCache = async () => {
  const cacheNames = await caches.keys();
  const currentCaches = [STATIC_CACHE, DYNAMIC_CACHE, IMAGE_CACHE];
  
  return Promise.all(
    cacheNames.map(async (cacheName) => {
      if (!currentCaches.includes(cacheName)) {
        await caches.delete(cacheName);
        return;
      }
      
      // Clean up old entries in dynamic cache (keep only recent 50 entries)
      if (cacheName === DYNAMIC_CACHE) {
        const cache = await caches.open(cacheName);
        const requests = await cache.keys();
        
        if (requests.length > 50) {
          const oldRequests = requests.slice(0, requests.length - 50);
          await Promise.all(oldRequests.map(req => cache.delete(req)));
        }
      }
    })
  );
};

// Run cleanup every hour
setInterval(cleanupCache, 60 * 60 * 1000);
