const C='ai15-v2-4',A=['./manifest.webmanifest','./icon.svg'];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(C).then(c=>c.addAll(A)));
  self.skipWaiting();
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==C).map(k=>caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  if(e.request.mode==='navigate'){
    e.respondWith(fetch(e.request).then(r=>{
      const copy=r.clone();caches.open(C).then(c=>c.put('./index.html',copy));return r;
    }).catch(()=>caches.match('./index.html')));
    return;
  }
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{
    const copy=res.clone();caches.open(C).then(c=>c.put(e.request,copy));return res;
  })));
});