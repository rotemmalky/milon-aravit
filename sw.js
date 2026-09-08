/* Milon v40. Isolated per installation path; generated version follows content. */
'use strict';
const SCOPE=new URL(self.registration.scope);
const CACHE_PREFIX='milon-aravit:'+SCOPE.pathname+':';
const CACHE_VERSION=CACHE_PREFIX+'v40-0f7a1255fb6f';
const INDEX_URL=new URL('index.html',SCOPE).href;
const ROOT_URL=SCOPE.href;
const APP_SHELL=['./','./index.html','./manifest.json','./icon.svg','./icon-192.png','./icon-512.png','./icon-maskable.png'];
self.addEventListener('install',event=>{event.waitUntil((async()=>{const cache=await caches.open(CACHE_VERSION);await cache.addAll(APP_SHELL);await self.skipWaiting();})());});
self.addEventListener('activate',event=>{event.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(key=>key.startsWith(CACHE_PREFIX)&&key!==CACHE_VERSION).map(key=>caches.delete(key)));await self.clients.claim();})());});
self.addEventListener('message',event=>{if(event.data?.type==='SKIP_WAITING')self.skipWaiting();});
self.addEventListener('fetch',event=>{
  const request=event.request,url=new URL(request.url);
  if(request.method!=='GET'||url.origin!==SCOPE.origin||!url.pathname.startsWith(SCOPE.pathname))return;
  if(request.mode==='navigate'){
    event.respondWith((async()=>{
      const cache=await caches.open(CACHE_VERSION),controller=new AbortController(),timer=setTimeout(()=>controller.abort(),3500);
      try{
        const response=await fetch(request,{signal:controller.signal});
        if(response.ok&&response.headers.get('content-type')?.includes('text/html')){
          const copy=response.clone(),rootCopy=response.clone();
          event.waitUntil(Promise.all([cache.put(INDEX_URL,copy),cache.put(ROOT_URL,rootCopy)]).catch(()=>{}));
          return response;
        }
        return(await cache.match(INDEX_URL))||response;
      }catch{
        return(await cache.match(INDEX_URL))||new Response('<!doctype html><html lang="he" dir="rtl"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>המילון אינו זמין</title><body><h1>אין חיבור כרגע</h1><p>יש לפתוח את המילון פעם אחת עם חיבור לאינטרנט כדי לשמור אותו לשימוש אופליין.</p></body></html>',{status:503,headers:{'Content-Type':'text/html; charset=utf-8'}});
      }finally{clearTimeout(timer);}
    })());return;
  }
  event.respondWith((async()=>{const cache=await caches.open(CACHE_VERSION),cached=await cache.match(request);if(cached)return cached;const response=await fetch(request);if(response.ok&&response.type!=='opaque')event.waitUntil(cache.put(request,response.clone()).catch(()=>{}));return response;})());
});
