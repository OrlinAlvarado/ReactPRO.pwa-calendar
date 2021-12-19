importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.2.0/workbox-sw.js');
workbox.loadModule('workbox-background-sync')

workbox.precaching.precacheAndRoute( self.__WB_MANIFEST);

const { registerRoute } = workbox.routing;
const { CacheFirst, NetworkFirst, NetworkOnly } = workbox.strategies;

const { BackgroundSyncPlugin } = workbox.backgroundSync;


const cacheFirstPaths = [
    "https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css",
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.0-2/css/all.min.css",
]

registerRoute(
    ({ request, url }) => {
        
        if( cacheFirstPaths.includes( url.href )) return true;
        
        return false;
    },
    new CacheFirst()
)

const cacheNetworkFirst = [
    "/api/auth/renew",
    "/api/events",
]

registerRoute(
    ({ request, url }) => {
        
        if( cacheNetworkFirst.includes( url.pathname )) return true;
        
        return false;
    },
    new NetworkFirst()
)


// registerRoute(
//     new RegExp('http://localhost:4000/api/events'),
//     new NetworkFirst()
// )


const bgSyncPlugin = new BackgroundSyncPlugin('posteos-offline', {
    maxRetentionTime: 24 * 60 // Retry for max of 24 Hours (specified in minutes)
  });
  
// Posteos Offline
registerRoute(
    new RegExp('http://localhost:4000/api/events'),
    new NetworkOnly({
        plugins: [bgSyncPlugin]
    }),
    'POST'
)

const regExp = new RegExp('http://localhost:4000/api/events/');

//Actualizacion Offline
registerRoute(
    regExp,
    new NetworkOnly({
        plugins: [bgSyncPlugin]
    }),
    'PUT'
)

registerRoute(
    regExp,
    new NetworkOnly({
        plugins: [bgSyncPlugin]
    }),
    'DELETE'
)