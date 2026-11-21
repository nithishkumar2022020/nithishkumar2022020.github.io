(() => {
  const returnKey = 'synqra-demo-return';
  const restoreKey = 'synqra-demo-restore';
  let navigating = false;
  let exitAnimation;
  let navigationTimer;
  const readReturn = () => {
    try {
      const record = JSON.parse(sessionStorage.getItem(returnKey));
      if (!record?.url) return null;
      const url = new URL(record.url, location.origin);
      return url.origin === location.origin && /^\/(?:index\.html)?$/.test(url.pathname) ? {...record, url:url.href} : null;
    } catch (_) { return null; }
  };
  document.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest('a[href]');
    if (!link || link.download || (link.target && link.target !== '_self')) return;
    let destination = new URL(link.href, location.href);
    const back = link.hasAttribute('data-demo-back');
    const launch = destination.origin === location.origin && /^\/synqra-demo(?:\.html)?\/?$/.test(destination.pathname);
    if (!back && !launch) return;
    event.preventDefault();
    if (navigating) return;
    navigating = true;
    if (launch) {
      const state = window.capturePortfolioReturnState?.() || {view:'work', scrollY:window.scrollY};
      state.focusSelector = link.classList.contains('roadmap-demo-link') ? '.roadmap-demo-link' : state.view === 'case-study' ? '#case-study-content .synqra-demo-cta' : '#card-synqra .synqra-demo-cta';
      try { sessionStorage.setItem(returnKey, JSON.stringify({url:location.href, state})); } catch (_) {}
    } else {
      const record = readReturn();
      if (record) {
        destination = new URL(record.url);
        try { sessionStorage.setItem(restoreKey, '1'); } catch (_) {}
      }
    }
    const go = () => {
      if (!navigating) return;
      navigating = false;clearTimeout(navigationTimer);
      location.assign(destination.href);
    };
    // Start the route immediately; waiting for an exit animation makes the
    // clicked project feel unresponsive. The demo animates its own entrance.
    if (launch) { go(); return; }
    const main = document.querySelector('main');
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || !main?.animate) { go(); return; }
    link.classList.add('is-launching');
    exitAnimation = main.animate([
      {opacity:1, transform:'translateY(0)'},
      {opacity:.35, transform:`translateY(${back ? '8px' : '-8px'})`}
    ], {duration:200, easing:'cubic-bezier(.4,0,1,1)', fill:'forwards'});
    navigationTimer = setTimeout(go, 230);
    exitAnimation.finished.then(go, () => {});
  }, true);
  addEventListener('pageshow', async event => {
    if (event.persisted) {
      navigating = false;clearTimeout(navigationTimer);
      exitAnimation?.cancel();
      document.querySelectorAll('.is-launching').forEach(link => link.classList.remove('is-launching'));
    }
    let restore = false;
    try {
      restore = sessionStorage.getItem(restoreKey) === '1';
      if (restore && window.restorePortfolioReturnState) sessionStorage.removeItem(restoreKey);
    } catch (_) {}
    if (!restore || !window.restorePortfolioReturnState) return;
    const record = readReturn();
    if (!record) return;
    await window.restorePortfolioReturnState(record.state);
    const main = document.querySelector('main');
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches && main?.animate) {
      main.animate([{opacity:.4, transform:'translateY(-8px)'}, {opacity:1, transform:'translateY(0)'}], {duration:380, easing:'cubic-bezier(.22,1,.36,1)'});
    }
  });
})();
