/* RideSaathi home page: window-seat stories under the language sign. One language at a time: its window rolls the
   tinted glass down, the story bar fills, and the matching row on the sign lights up. Pauses on hover/focus, off
   screen and in a hidden tab; no auto-play for prefers-reduced-motion. */
(function () {
  'use strict';
  var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var STEP = 5200; /* keep in step with .ws-bars i.on b in home.css */

  function stories() {
    var ws = document.getElementById('ws');
    var row = document.getElementById('wsRow');
    if (!ws || !row) return;
    var cards = row.querySelectorAll('.ws-card');
    var bars = ws.querySelectorAll('.ws-bars i');
    var signs = document.querySelectorAll('.sign-in span[data-i]');
    var cur = 0, timer = null, visible = false, held = false;

    function show(i) {
      cur = i;
      for (var j = 0; j < cards.length; j++) {
        cards[j].setAttribute('aria-pressed', j === i ? 'true' : 'false');
        bars[j].classList.remove('on');
        bars[j].classList.toggle('done', j < i);
        if (signs[j]) signs[j].classList.toggle('on', j === i);
      }
      void bars[i].offsetWidth; /* restart the bar's fill */
      bars[i].classList.add('on');
      /* On phones the row scrolls sideways: bring the active window in, without moving the page. */
      if (row.scrollWidth > row.clientWidth + 4) {
        row.scrollTo({ left: cards[i].parentNode.offsetLeft - row.offsetLeft, behavior: reduce ? 'auto' : 'smooth' });
      }
    }
    function play() {
      clearTimeout(timer);
      if (reduce || !visible || held || document.hidden) { ws.classList.add('paused'); return; }
      ws.classList.remove('paused');
      timer = setTimeout(function () { show((cur + 1) % cards.length); play(); }, STEP);
    }

    for (var k = 0; k < cards.length; k++) {
      cards[k].addEventListener('click', function (e) { show(+e.currentTarget.getAttribute('data-i')); play(); });
    }
    ws.addEventListener('mouseenter', function () { held = true; play(); });
    ws.addEventListener('mouseleave', function () { held = false; show(cur); play(); });
    ws.addEventListener('focusin', function () { held = true; play(); });
    ws.addEventListener('focusout', function () { held = false; play(); });
    document.addEventListener('visibilitychange', play);

    show(0);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { visible = en[0].isIntersecting; play(); }, { threshold: 0.35 }).observe(ws);
    } else { visible = true; play(); }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', stories);
  else stories();
})();
