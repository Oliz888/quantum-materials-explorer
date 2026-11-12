// Remember each map's own URL options for version switches in this browser tab.
// The main Field Map link and explicitly opened bookmarks keep their destinations.
(() => {
  const nav = document.querySelector('.field-map-versions');
  const links = Array.from(nav.querySelectorAll('a'), link => ({
    link,
    target: new URL(link.href)
  }));
  const current = links.find(({ target }) => target.pathname === location.pathname);
  const key = pathname => 'qm:field-map:' + pathname;

  function restoreLinks() {
    const here = new URL(location.href);
    for (const { link, target } of links) {
      if (target.pathname === here.pathname) {
        link.href = here.href;
        continue;
      }
      const next = new URL(target);
      let saved;
      try { saved = sessionStorage.getItem(key(target.pathname)); } catch {}
      if (saved != null) {
        next.search = saved;
      } else {
        for (const name of ['source', 'lang']) {
          const value = here.searchParams.get(name);
          if (value) next.searchParams.set(name, value);
        }
      }
      link.href = next.href;
    }
  }

  // Re-selecting the main entry on V3 should keep the open graph just as
  // re-selecting the active version does. Modified clicks retain native behavior.
  const mainEntry = document.querySelector('.site-nav a[aria-current="page"]');
  if (current && mainEntry && new URL(mainEntry.href).pathname === location.pathname) {
    mainEntry.addEventListener('click', event => {
      mainEntry.href = location.href;
      if (!event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
        event.preventDefault();
        window.scrollTo(0, 0);
      }
    });
  }

  window.addEventListener('pagehide', () => {
    if (!current) return;
    try { sessionStorage.setItem(key(location.pathname), location.search); } catch {}
  });
  window.addEventListener('pageshow', restoreLinks);
  nav.addEventListener('focusin', restoreLinks);
  nav.addEventListener('pointerdown', restoreLinks);
  nav.addEventListener('click', event => {
    restoreLinks();
    if (current && event.target.closest('a') === current.link &&
        !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
      event.preventDefault();
    }
  });
  restoreLinks();
})();
