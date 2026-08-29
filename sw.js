// Service Worker - מילון ערבית מדוברת
// ⚠️ בכל העלאת גרסה חדשה של index.html: העלה את המספר כאן ב-1.
//    זה מה שגורם למשתמשים לקבל את המילים החדשות במקום גרסה מהמטמון.
const CACHE = 'milon-v1';

const ASSETS = ['./', './index.html', './manifest.json', './icon.svg'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(ASSETS))
      .then(() => self.skipWaiting())      // הגרסה החדשה נכנסת לתוקף מיד
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())    // משתלט על הלשוניות הפתוחות
  );
});

// אסטרטגיה: רשת קודם, מטמון כגיבוי.
// למה? מילון שמתעדכן כל כמה ימים - עדיף מילים עדכניות כשיש רשת,
// ונפילה חלקה למטמון כשאין. אין רשת = עובד מלא, בלי הבדל.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;   // YouGlish/Forvo - לא נוגעים

  e.respondWith(
    fetch(e.request)
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
  );
});
