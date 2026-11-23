/* Runs in <head> before the page paints, so there is no flash of the wrong theme.
   Order: ?theme=light|dark in the URL (for screenshots, not saved) > the visitor's saved choice > the system setting. */
(function () {
  var d = document.documentElement;
  d.classList.add('js'); // lets CSS hide .reveal content until site.js fades it in
  var t = null;
  try {
    var m = /[?&]theme=(light|dark)\b/.exec(location.search);
    t = m ? m[1] : localStorage.getItem('rs-theme');
  } catch (e) {}
  if (t === 'light' || t === 'dark') d.setAttribute('data-theme', t);
})();
