/**
 * Service Worker for NurseScribe AI
 * Provides offline functionality, caching, and background sync
 */

// Generate cache names with version for cache busting
const VERSION = '1.4.10';
const TIMESTAMP = Date.now();

// Environment detection
const ENVIRONMENT = 'production'; // Always production in service worker
const CACHE_NAME = `nursescribe-v${VERSION}-${TIMESTAMP}`;
const STATIC_CACHE = `nursescribe-static-v${VERSION}-${TIMESTAMP}`;
const DYNAMIC_CACHE = `nursescribe-dynamic-v${VERSION}-${TIMESTAMP}`;

// Force cache invalidation on every update
const FORCE_CACHE_CLEAR = true;

// Aggressive cache clearing - clear ALL possible cache names
const OLD_CACHE_PATTERNS = [
  'nursescribe-v1.3.0',
  'nursescribe-static-v1.3.0',
  'nursescribe-dynamic-v1.3.0',
  'nursescribe-v1.4.0',
  'nursescribe-static-v1.4.0',
  'nursescribe-dynamic-v1.4.0',
  'nursescribe-v1.4.1',
  'nursescribe-static-v1.4.1',
  'nursescribe-dynamic-v1.4.1',
  'nursescribe-v1.4.2',
  'nursescribe-static-v1.4.2',
  'nursescribe-dynamic-v1.4.2',
  'nursescribe-v1.4.3',
  'nursescribe-static-v1.4.3',
  'nursescribe-dynamic-v1.4.3',
  'nursescribe-v1.4.4',
  'nursescribe-static-v1.4.4',
  'nursescribe-dynamic-v1.4.4',
  'nursescribe-v1.4.5',
  'nursescribe-static-v1.4.5',
  'nursescribe-dynamic-v1.4.5',
  'transformers-cache',
  'whisper-cache',
  // Clear any cache that might contain old asset references
  'nursescribe',
  'static',
  'dynamic'
];

// Files to cache for offline functionality
const STATIC_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/placeholder.svg',
  '/robots.txt'
];

// API endpoints to cache
const API_CACHE_PATTERNS = [
  /^\/api\/templates/,
  /^\/api\/analytics/,
  /^\/api\/education/,
  /^\/api\/admin/
];

// Install event - cache static files with aggressive cache clearing
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  // Force immediate activation
  self.skipWaiting();
  
  event.waitUntil(
    // ALWAYS clear ALL caches to prevent old HTML from being served
    caches.keys().then((cacheNames) => {
      console.log('Force clearing all caches:', cacheNames);
      
      // Delete all existing caches
      const deletePromises = cacheNames.map(name => {
        console.log(`Deleting old cache: ${name}`);
        return caches.delete(name);
      });
      
      // Also delete any cache that matches our old patterns
      const patternDeletePromises = OLD_CACHE_PATTERNS.map(pattern => {
        return cacheNames.filter(name => name.includes(pattern))
          .map(name => {
            console.log(`Deleting pattern cache: ${name}`);
            return caches.delete(name);
          });
      }).flat();
      
      return Promise.all([...deletePromises, ...patternDeletePromises]);
    }).then(() => {
      // Cache new files
      return caches.open(STATIC_CACHE);
    }).then((cache) => {
      console.log('Caching static files');
      return cache.addAll(STATIC_FILES);
    }).then(() => {
      console.log('Static files cached successfully');
      console.log('Skipping waiting and activating immediately...');
      return self.skipWaiting();
    }).catch((error) => {
      console.error('Failed to cache static files:', error);
      // Still skip waiting even if caching fails
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        console.log('Current caches:', cacheNames);
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker activated');
        return self.clients.claim();
      })
      .then(() => {
        // Notify all clients about the update
        return self.clients.matchAll();
      })
      .then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            type: 'SW_UPDATED',
            version: VERSION
          });
        });
      })
  );
});

// Fetch event - handle requests with caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle different types of requests
  if (isStaticFile(request.url)) {
    // Static files - cache first strategy
    event.respondWith(cacheFirst(request));
  } else if (isAPIRequest(request.url)) {
    // API requests - network first with cache fallback
    event.respondWith(networkFirst(request));
  } else if (isExternalRequest(request.url)) {
    // External requests - network only
    event.respondWith(networkOnly(request));
  } else {
    // Default - stale while revalidate
    event.respondWith(staleWhileRevalidate(request));
  }
});

// Background sync for offline data
self.addEventListener('sync', (event) => {
  // Only log in development
  if (ENVIRONMENT === 'development') {
    console.log('Background sync triggered:', event.tag);
  }
  
  if (event.tag === 'offline-notes') {
    event.waitUntil(syncOfflineNotes());
  } else if (event.tag === 'analytics') {
    event.waitUntil(syncAnalytics());
  } else if (event.tag === 'education-progress') {
    event.waitUntil(syncEducationProgress());
  }
});

// Push notifications for updates
self.addEventListener('push', (event) => {
  console.log('Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New update available for NurseScribe AI',
    icon: '/placeholder.svg',
    badge: '/placeholder.svg',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Update',
        icon: '/placeholder.svg'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/placeholder.svg'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('NurseScribe AI', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event.action);
  
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Cache strategies
async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('Cache first strategy failed:', error);
    return new Response('Offline - Resource not available', { status: 503 });
  }
}

async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('Network failed, trying cache:', error);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    return new Response('Offline - API not available', { status: 503 });
  }
}

async function networkOnly(request) {
  try {
    return await fetch(request);
  } catch (error) {
    console.error('Network only strategy failed:', error);
    return new Response('Offline - External resource not available', { status: 503 });
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);

  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch((error) => {
    console.error('Stale while revalidate network failed:', error);
    return null;
  });

  return cachedResponse || await fetchPromise;
}

// Helper functions
function isStaticFile(url) {
  return STATIC_FILES.some(file => url.includes(file)) ||
         url.includes('.js') ||
         url.includes('.css') ||
         url.includes('.png') ||
         url.includes('.jpg') ||
         url.includes('.svg') ||
         url.includes('.ico');
}

function isAPIRequest(url) {
  return API_CACHE_PATTERNS.some(pattern => pattern.test(url)) ||
         url.includes('/api/');
}

function isExternalRequest(url) {
  return url.startsWith('https://api.openai.com') ||
         url.startsWith('https://api.elevenlabs.io') ||
         url.startsWith('https://supabase.co');
}

// Background sync functions
async function syncOfflineNotes() {
  try {
    // Get offline notes from IndexedDB
    const offlineNotes = await getOfflineNotes();
    
    for (const note of offlineNotes) {
      try {
        // Attempt to sync each note
        await fetch('/api/notes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(note)
        });
        
        // Remove from offline storage if successful
        await removeOfflineNote(note.id);
        console.log('Synced offline note:', note.id);
      } catch (error) {
        console.error('Failed to sync note:', note.id, error);
      }
    }
  } catch (error) {
    console.error('Background sync for notes failed:', error);
  }
}

async function syncAnalytics() {
  try {
    // Service workers don't have access to localStorage
    // In a real implementation, this would use IndexedDB or communicate with the main thread
    console.log('Analytics sync would happen here in a real implementation');
  } catch (error) {
    console.error('Background sync for analytics failed:', error);
  }
}

async function syncEducationProgress() {
  try {
    // Service workers don't have access to localStorage
    // In a real implementation, this would use IndexedDB or communicate with the main thread
    console.log('Education progress sync would happen here in a real implementation');
  } catch (error) {
    console.error('Background sync for education progress failed:', error);
  }
}

// IndexedDB helpers for offline storage
async function getOfflineNotes() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('NurseScribeOffline', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['notes'], 'readonly');
      const store = transaction.objectStore('notes');
      const getAllRequest = store.getAll();
      
      getAllRequest.onsuccess = () => resolve(getAllRequest.result);
      getAllRequest.onerror = () => reject(getAllRequest.error);
    };
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('notes')) {
        db.createObjectStore('notes', { keyPath: 'id' });
      }
    };
  });
}

async function removeOfflineNote(noteId) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('NurseScribeOffline', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['notes'], 'readwrite');
      const store = transaction.objectStore('notes');
      const deleteRequest = store.delete(noteId);
      
      deleteRequest.onsuccess = () => resolve();
      deleteRequest.onerror = () => reject(deleteRequest.error);
    };
  });
}

// Health check endpoint for service worker
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'HEALTH_CHECK') {
    event.ports[0].postMessage({ status: 'healthy', version: CACHE_NAME });
  }
});

console.log('NurseScribe AI Service Worker loaded successfully');
