/* Decorative opening, independent of page, image and globe loading. */
(() => {
  'use strict';
  const root = document.querySelector('.projector-intro');
  if (!root) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const query = new URLSearchParams(location.search);
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname);
  const replay = local && query.get('projector') === 'replay';
  const deepLink = location.hash && !['#home', '#top'].includes(location.hash);
  let seen = false;
  try { seen = sessionStorage.getItem('stem-projector-seen') === '1'; } catch { /* Storage is optional. */ }
  if (reduced.matches || (local && query.get('projector') === 'off') || (!replay && (seen || deepLink))) {
    root.remove();
    return;
  }
  try { sessionStorage.setItem('stem-projector-seen', '1'); } catch { /* Private browsing still works. */ }
  const slow = replay && query.get('speed') === 'slow';
  const duration = slow ? 6300 : 2100;
  root.style.setProperty('--projection-time', `${duration}ms`);
  // Do not run a late opening over a page somebody is already reading.
  if (!replay && performance.now() > 2500) { root.remove(); return; }
  let finished = false;
  let timeout;
  const finish = () => {
    if (finished) return;
    finished = true;
    clearTimeout(timeout);
    root.remove();
    window.removeEventListener('keydown', onKey);
    window.removeEventListener('wheel', finish);
    window.removeEventListener('pointerdown', finish);
    window.removeEventListener('pagehide', finish);
    document.removeEventListener('visibilitychange', onVisibility);
    reduced.removeEventListener('change', finish);
  };
  const onKey = event => { if (['Escape', 'Tab', 'ArrowDown', 'PageDown', ' '].includes(event.key)) finish(); };
  const onVisibility = () => { if (document.hidden) finish(); };
  root.querySelector('button').addEventListener('click', finish, { once: true });
  root.addEventListener('animationend', event => { if (event.target === root) finish(); });
  window.addEventListener('keydown', onKey);
  window.addEventListener('wheel', finish, { passive: true });
  window.addEventListener('pointerdown', finish, { passive: true });
  window.addEventListener('pagehide', finish, { once: true });
  document.addEventListener('visibilitychange', onVisibility);
  reduced.addEventListener('change', finish);
  root.hidden = false;
  timeout = setTimeout(finish, duration + 150);
})();
