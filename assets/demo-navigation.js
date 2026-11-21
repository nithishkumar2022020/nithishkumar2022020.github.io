(() => {
  let navigating = false;
  let exitAnimation;
  document.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest('a[href]');
    if (!link || link.download || (link.target && link.target !== '_self')) return;
    const destination = new URL(link.href, location.href);
    if (destination.origin !== location.origin || !/^\/synqra-demo(?:\.html)?\/?$/.test(destination.pathname)) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const main = document.querySelector('main');
    if (!main?.animate) return;
    event.preventDefault();
    if (navigating) return;
    navigating = true;
    link.classList.add('is-launching');
    exitAnimation = main.animate([
      {opacity:1, transform:'translateY(0)'},
      {opacity:.35, transform:'translateY(-8px)'}
    ], {duration:200, easing:'cubic-bezier(.4,0,1,1)', fill:'forwards'});
    exitAnimation.finished.then(() => {
      if (navigating) location.assign(destination.href);
    }, () => {});
  }, true);
  addEventListener('pageshow', () => {
    navigating = false;
    exitAnimation?.cancel();
    document.querySelectorAll('.is-launching').forEach(link => link.classList.remove('is-launching'));
  });
})();
