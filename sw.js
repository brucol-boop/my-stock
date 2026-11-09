const V='mystock-2026.11.09.4';
const SHELL=['./','index.html','icon.png','manifest.webmanifest'];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting())); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch',e=>{
  const r=e.request; if(r.method!=='GET') return;
  const u=new URL(r.url), same=u.origin===location.origin, font=/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname);
  if(!same&&!font) return;
  if(r.mode==='navigate'){ e.respondWith(fetch(r).then(x=>{ const c=x.clone(); caches.open(V).then(ch=>ch.put('index.html',c)); return x; }).catch(()=>caches.match('index.html'))); return; }
  e.respondWith(caches.match(r).then(hit=>{ const net=fetch(r).then(x=>{ if(x&&(x.ok||x.type==='opaque')){ const c=x.clone(); caches.open(V).then(ch=>ch.put(r,c)); } return x; }).catch(()=>hit); return hit||net; }));
});
