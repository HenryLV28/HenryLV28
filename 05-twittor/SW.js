importScripts('js/SW-utils.js');

const STATIC_CACHE = 'static-v2';
const DYNAMIC_CACHE = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';


const APP_SHELL = [
    // '/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/app.js',
    'js/SW-utils.js'
];

const APP_SHELL_INMUTABLE = [
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'css/animate.css',
    'js/libs/jquery.js'
];


self.addEventListener('install', event =>{
    const cacheStatic = caches.open(STATIC_CACHE).then(cache=>
        cache.addAll(APP_SHELL));
    const cacheImutable = caches.open(INMUTABLE_CACHE).then(cache=>
        cache.addAll(APP_SHELL_INMUTABLE));

    event.waitUntil(Promise.all([cacheStatic, cacheImutable]));
});

self.addEventListener('activate', event =>{
    const respuesta = caches.keys().then(keys=>{
    keys.forEach(key=>{
            if(key!= STATIC_CACHE && key.includes('static')){
                return caches.delete(key);
            }
        })
    });
    event.waitUntil(respuesta);
});

self.addEventListener('fetch', e=>{
    const respuesta = caches.match(e.request).then(resp=>{
        if (resp){
            return resp;
        }else{
            return fetch(e.request).then(newResp=>{
                return actualizaCacheDinamico(DYNAMIC_CACHE, e.request, newResp);
            });
        }
    });
    e.respondWith(respuesta);
});