self.addEventListener('install', function(event) {
    console.log('Service Worker installing.');
});

self.addEventListener('activate', function(event) {
    console.log('Service Worker activated.');
});
self.addEventListener('fetch', function(event) {
    console.log('Service Worker fetching.');
});

function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');
  
    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);
  
    for (var i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
  
  self.addEventListener('install', function(event) {
    console.log('Service Worker installing.');
  });
  
  self.addEventListener('activate', async function(event) {
    console.log('Service Worker activated.');
    try {
      const applicationServerKey = urlB64ToUint8Array('BCdhtUOHu78DJL6YE6uSRVZqjZ6aIE91NQL6ej0VXt5fp4DVlb2zZIPC34uINrLRxRLjSWAHFSNDeRDpMAco2T0')
      const options = { applicationServerKey, userVisibleOnly: true }
      const subscription = await self.registration.pushManager.subscribe(options)
      console.log(JSON.stringify(subscription))
    } catch (err) {
      console.log('Error', err)
    }
  });
  self.addEventListener('fetch', function(event) {
    console.log('Service Worker fetching.');
  });
  self.addEventListener('push', function(event) {
    console.log('[Service Worker] Push Received.');
    console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);
  
    const title = 'A nice title';
    const options = {
      body: event.data.text(),
      icon: 'images/icon.png',
      badge: 'images/badge.png'
    };
  
    event.waitUntil(self.registration.showNotification(title, options));
  });

  const OFFLINE_VERSION = 1;
const CACHE_NAME = 'offline';
const OFFLINE_URL = 'offline';

self.addEventListener('install', function (event) {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    // Setting {cache: 'reload'} in the new request will ensure that the response
    // isn't fulfilled from the HTTP cache; i.e., it will be from the network.
    await cache.add(new Request(OFFLINE_URL, {cache: 'reload'}));
  })());
});

self.addEventListener('activate', async function (event) {
  event.waitUntil((async () => {
  // Enable navigation preload if it's supported.
  // See https://developers.google.com/web/updates/2017/02/navigation-preload
    if ('navigationPreload' in self.registration) {
      await self.registration.navigationPreload.enable();
    }
  })());

  // Tell the active service worker to take control of the page immediately.
  self.clients.claim();
});

self.addEventListener('fetch', function (event) {
  // We only want to call event.respondWith() if this is a navigation request
  // for an HTML page.
    event.respondWith((async () => {
      try {
        // First, try to use the navigation preload response if it's supported.
        const preloadResponse = await event.preloadResponse;
        if (preloadResponse) {
          return preloadResponse;
        }

        return await caches.match(event.request) || await fetch(event.request);
      } catch (error) {
        // catch is only triggered if an exception is thrown, which is likely
        // due to a network error.
        // If fetch() returns a valid HTTP response with a response code in
        // the 4xx or 5xx range, the catch() will NOT be called.
        console.log('Fetch failed; returning offline page instead.', error);

        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(OFFLINE_URL);
        return cachedResponse;
      }
    })());
});