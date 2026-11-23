// Picks light/dark before first paint: saved choice first, then the system setting.
(function () {
  var t, q = /[?&]theme=(light|dark)/.exec(location.search);
  try { t = q ? q[1] : localStorage.getItem('lp-garden-theme'); } catch (e) { t = null; }
  if (t !== 'light' && t !== 'dark') {
    t = window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  document.documentElement.setAttribute('data-theme', t);
})();
