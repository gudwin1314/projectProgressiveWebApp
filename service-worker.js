const cacheName = "Ecommerce-v2-Name";

self.addEventListener('install', (event) => {
    // skip waiting helps to reload new service worker itself without manually clicking

    self.skipWaiting();
    event.waitUntil(
        caches.open(cacheName)
            .then((cache) => {
                cache.addAll([
                    '/',
                    '/index.html',
                    '/cart.html',
                    '/JS/index.js',
                    '/JS/cart.js',
                    '/JS/database.js',
                    '/JS/notifications.js',
                    '/manifest.json',
                    '/main.css',
                    '/images',
                    'icons',
                    '/icons/manifest-icon-512.maskable.png'
                ]);
            })
            //Displays error message if errors in then function 
            .catch((error) => {
                console.log('Catch load failed: ', error);
            })
    )

});

// Activate service worker code block
self.addEventListener('activate', (event) => {

    // console.log("Activation of Service Worker", event);
    event.waitUntil(clients.claim());

    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                cacheNames.forEach((item) => {
                    if (item != cacheName) {
                        caches.delete(item);
                    }
                });
            })
    );

});

// Fetch is initialize
self.addEventListener('fetch', (event) => {

    // Cache strategy using Stale while revalidate 
    if (event.request.method == 'GET') {
        event.respondWith(
            caches.open(cacheName)
                .then((cache) => {
                    return cache.match(event.request)
                        .then((cacheResponse) => {
                            const fetchedResponse = fetch(event.request)
                                .then((networkResponse) => {
                                    cache.put(event.request, networkResponse.clone());
                                    return networkResponse;
                                });
                            return cacheResponse || fetchedResponse;
                        })
                })
        );
    }
});



self.addEventListener('message', (event) => {
    const product = event.data.title;
    const price = event.data.body;

    const options = {
        title: product,
        body: price,
        actions: [
            { action: 'agree', title: 'agree' },
            { action: 'disagree', title: 'disagree' }
        ]
    };
    event.waitUntil(
        self.registration.showNotification(product, options)
    );

    const whoPostedTheMessage = event.source;
    whoPostedTheMessage.postMessage('Successfull Message');
    clients.matchAll(options)
        .then((matchClients) => {

        });
});

self.addEventListener('notificationclick', (event) => {
    const action = event.action;

    if (action === 'agree') {
        sendMessageToClient('So we both agree on that');
    }
    else if(action === 'disagree'){
        sendMessageToClient('Let agree to Disagree');

    }
    else {
        sendMessageToClient('Click Either');
    }
    event.notification.close();
});
function sendMessageToClient(message){
    self.clients.matchAll().then(function(clients){
        clients.forEach(function(client){
            client.postMessage({type:'notification',message: message });
        });
    });
}

self.addEventListener('sync', (event) => {
    if (event.tag === 'syncCart') {
        event.waitUntil(syncCart());
    }
});

function syncCart() {
    console.log('Background sync initiated for cart.');
    
}

