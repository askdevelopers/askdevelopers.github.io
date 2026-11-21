// Runs in <head> before the page paints: marks JS as on, applies the saved light/dark choice (no flash),
// and skips the intro loader if it already played during this visit (or motion is reduced).
(function () {
  var root = document.documentElement;
  root.classList.add('js');
  try {
    // ?theme=light|dark previews a theme without saving it (handy for screenshots).
    var q = /[?&]theme=(light|dark)/.exec(location.search);
    var saved = q ? q[1] : localStorage.getItem('bk-theme');
    if (saved === 'dark' || saved === 'light') root.setAttribute('data-theme', saved);
  } catch (e) {}
  var skip = /[?&]intro=off/.test(location.search);
  try { if (sessionStorage.getItem('bk-intro')) skip = true; } catch (e) {}
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) skip = true;
  if (skip) root.classList.add('seen-intro');
})();
