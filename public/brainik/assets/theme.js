// Runs in <head> before the page paints: marks JS as on and applies the saved light/dark choice (no flash).
(function () {
  var root = document.documentElement;
  root.classList.add('js');
  try {
    // ?theme=light|dark previews a theme without saving it (handy for screenshots).
    var q = /[?&]theme=(light|dark)/.exec(location.search);
    var saved = q ? q[1] : localStorage.getItem('bk-theme');
    if (saved === 'dark' || saved === 'light') root.setAttribute('data-theme', saved);
  } catch (e) {}
})();
