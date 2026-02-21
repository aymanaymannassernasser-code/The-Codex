/* ════════════════════════════════════════
   VIGIL — Service Worker v2.0
   Push · Sync · Periodic · Cache
════════════════════════════════════════ */
const CACHE   = 'vigil-v3';
const ASSETS  = ['/index.html','/style.css','/app.js','/manifest.json','/icon-96.png','/icon-192.png','/icon-512.png'];
const API_HX  = ['aladhan.com','metals.live','er-api.com','gold-api.com','fonts.googleapis.com','fonts.gstatic.com'];

self.addEventListener('install',  e => { e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (API_HX.some(h => url.hostname.includes(h))) {
    e.respondWith(fetch(e.request).catch(() => new Response('{"error":"offline"}',{headers:{'Content-Type':'application/json'}})));
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (res.ok && e.request.method==='GET') { const cl=res.clone(); caches.open(CACHE).then(c=>c.put(e.request,cl)); }
        return res;
      }).catch(() => { if (e.request.mode==='navigate') return caches.match('/index.html'); });
    })
  );
});

self.addEventListener('push', e => {
  const d = e.data ? e.data.json() : {title:'Vigil',body:'The castle requires your attention.',tab:'home'};
  e.waitUntil(self.registration.showNotification(d.title||'Vigil',{body:d.body||'',icon:'/icon-192.png',tag:d.tag||'vigil',data:{tab:d.tab||'home'},vibrate:[100,50,100],requireInteraction:!!d.sticky}));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  const tab = e.notification.data?.tab || 'home';
  e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(list => {
    for (const c of list) { if (c.url.includes(self.location.origin) && 'focus' in c) { c.focus(); c.postMessage({type:'NAVIGATE',tab}); return; } }
    if (clients.openWindow) return clients.openWindow('/?tab='+tab);
  }));
});

self.addEventListener('sync', e => {
  if (e.tag==='sync-gold') e.waitUntil(syncGold());
});

self.addEventListener('periodicsync', e => {
  if (e.tag==='daily-briefing') e.waitUntil(self.registration.showNotification('Vigil — The Watch begins',{body:'A new day in the castle.',icon:'/icon-192.png',tag:'briefing',data:{tab:'home'},vibrate:[50,30,50]}));
});

self.addEventListener('message', e => {
  if (e.data?.type==='SKIP_WAITING') self.skipWaiting();
  if (e.data?.type==='SHOW_NOTIFICATION') {
    self.registration.showNotification(e.data.title,{body:e.data.body,icon:'/icon-192.png',tag:e.data.tag||'vigil-'+Date.now(),data:{tab:e.data.tab||'home'},vibrate:e.data.vibrate||[100,50,100],silent:!!e.data.silent});
  }
});

async function syncGold() {
  try {
    let usdPerOz = null;
    try {
      const r=await fetch('https://gold-api.com/price/XAU');
      if(r.ok){const j=await r.json(); usdPerOz=j.price??j.ask??j.bid??(Array.isArray(j)?j[0]?.price:null);}
    } catch(_){}
    if(!usdPerOz){
      const r=await fetch('https://api.metals.live/v1/spot/gold');
      if(r.ok){const j=await r.json(); usdPerOz=Array.isArray(j)?j[0]?.price:j?.price;}
    }
    const fx=await fetch('https://open.er-api.com/v6/latest/USD');
    const fxj=await fx.json();
    const all=await clients.matchAll({includeUncontrolled:true});
    all.forEach(c=>c.postMessage({type:'GOLD_UPDATED',usdPerOz,egpRate:fxj.rates?.EGP,ts:Date.now()}));
  } catch(_){}
}
