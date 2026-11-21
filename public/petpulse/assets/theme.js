// Runs in <head> before the page paints: marks JS as on, applies the saved light/dark choice (no flash),
// and skips the pet loader if it already played during this visit.
(function () {
  var root = document.documentElement;
  root.classList.add('js');
  try {
    var saved = localStorage.getItem('pp-theme');
    if (saved === 'dark' || saved === 'light') root.setAttribute('data-theme', saved);
  } catch (e) {}
  try { if (sessionStorage.getItem('pp-loader')) root.classList.add('seen-loader'); } catch (e) {}
})();
