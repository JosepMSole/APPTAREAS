/* APPTAREAS v0.7 — static assets offline, network-first app shell. */
const CACHE='apptareas-v0.7-static';
const ASSETS=['./','./index.html','./config.js','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-180.png','./icons/icon-512.png'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('apptareas-')&&k!==CACHE).map(k=>caches.delete(k)))),self.clients.claim()]))});
self.addEventListener('fetch',event=>{const req=event.request;if(req.method!=='GET'||new URL(req.url).origin!==self.location.origin)return;
 const url=new URL(req.url);if(!url.pathname.startsWith(new URL(self.registration.scope).pathname))return;
 if(req.mode==='navigate'){event.respondWith(fetch(req).then(r=>{if(r.ok){const copy=r.clone();caches.open(CACHE).then(c=>c.put('./index.html',copy))}return r}).catch(()=>caches.match('./index.html')));return}
 event.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(r=>{if(r.ok&&/\.(png|webmanifest)$/.test(url.pathname)){const copy=r.clone();caches.open(CACHE).then(c=>c.put(req,copy))}return r})));});
