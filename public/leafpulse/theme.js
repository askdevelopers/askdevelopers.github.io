/* Runs in <head> before the page paints.
   1. Applies the visitor's saved light/dark choice so there is no flash.
   2. Home page only (<html data-intro>): plays the seed-to-app story once per browser tab, never with reduced motion.
      The final scene is the default; .lp-intro on <html> runs the timeline in style.css. */
(function () {
  var d = document.documentElement;
  try {
    var t = localStorage.getItem('lp-theme');
    if (t === 'light' || t === 'dark') d.setAttribute('data-theme', t);
  } catch (e) {}

  if (!d.hasAttribute('data-intro')) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var seen = false;
  try {
    seen = sessionStorage.getItem('lp-intro') === '1';
    sessionStorage.setItem('lp-intro', '1');
  } catch (e) {}
  if (!reduce && !seen) d.classList.add('lp-intro');
})();
