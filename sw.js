const V='da-v1';
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(V).then(c=>c.addAll(['./index.html','./admin.html']).catch(()=>{})))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
  if(!(u.origin===location.origin||u.host==='fonts.gstatic.com'||u.host==='fonts.googleapis.com'||u.host==='www.gstatic.com'))return;
  const keep=res=>{if(res&&res.ok){const c=res.clone();caches.open(V).then(x=>x.put(r,c))}return res};
  if(r.mode==='navigate'){
    const fb=()=>caches.match(r).then(m=>m||caches.match(u.pathname.endsWith('admin.html')?'./admin.html':'./index.html'));
    e.respondWith(Promise.race([fetch(r).then(keep),new Promise((_,j)=>setTimeout(j,3000))]).catch(fb));return;
  }
  e.respondWith(caches.match(r).then(m=>{const n=fetch(r).then(keep).catch(()=>m);return m||n}));
});
