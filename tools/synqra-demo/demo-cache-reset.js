// Reveal the app only after Flutter has painted its first real frame.
window.addEventListener('flutter-first-frame', () => {
  if (window.parent !== window) window.parent.postMessage({type:'synqra-demo-ready'}, location.origin);
}, {once:true});
// A portfolio demo should load the current build, not retain a stale PWA shell.
(async () => {
  let reload = false;
  try {
    if ('serviceWorker' in navigator) {
      const controlled = navigator.serviceWorker.controller;
      for (const registration of await navigator.serviceWorker.getRegistrations()) {
        if (['/synqra-app/', '/synqra-preview/'].some(path => new URL(registration.scope).pathname.endsWith(path))) {
          await registration.unregister();
          reload ||= !!controlled;
        }
      }
      if (reload && 'caches' in window) {
        for (const name of ['flutter-app-cache', 'flutter-temp-cache', 'flutter-app-manifest']) {
          await caches.delete(name);
        }
      }
    }
  } catch (_) { /* The demo also works where storage is unavailable. */ }
  if (reload) { location.reload(); return; }
  const script = document.createElement('script');
  script.src = 'flutter_bootstrap.js';
  document.head.append(script);
})();
