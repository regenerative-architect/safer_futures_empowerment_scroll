const CACHE="ngso-v1.0.0";
const CORE=["./","./index.html","./assets/styles.css","./assets/icon.svg","./js/data.js","./js/storage.js","./js/planner.js","./js/diagnostics.js","./js/collaboration.js","./js/app.js","./docs/STATIC_GUIDE.md"];
self.addEventListener("install",event=>event.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE))));
self.addEventListener("activate",event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",event=>{
  if(event.request.method!=="GET")return;
  event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(resp=>{
    const copy=resp.clone(); if(new URL(event.request.url).origin===location.origin)caches.open(CACHE).then(c=>c.put(event.request,copy)); return resp;
  }).catch(()=>caches.match("./index.html"))));
});