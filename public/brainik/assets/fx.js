// Brainik website motion: intro loader, count-up facts, seamless marquee, and tilting game cards. Everything is decorative and respects
// prefers-reduced-motion; the page works the same without it.
(function () {
  var root = document.documentElement;
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // ---------- Intro loader ----------
  var loader = document.getElementById('loader');
  var introDone = false;
  function finishIntro() {
    if (introDone) return;
    introDone = true;
    root.classList.add('intro-done');
    countUp();
    if (loader) {
      loader.classList.add('done');
      setTimeout(function () { if (loader && loader.parentNode) loader.parentNode.removeChild(loader); }, 700);
    }
  }
  if (!loader || root.classList.contains('seen-intro')) {
    if (loader && loader.parentNode) loader.parentNode.removeChild(loader);
    loader = null;
    requestAnimationFrame(finishIntro);
  } else {
    try { sessionStorage.setItem('bk-intro', '1'); } catch (e) {}
    var t = setTimeout(finishIntro, 2500);
    var skip = function () { clearTimeout(t); finishIntro(); };
    loader.addEventListener('click', skip);
    window.addEventListener('keydown', skip, { once: true });
  }

  // ---------- Count-up facts ----------
  function countUp() {
    var els = document.querySelectorAll('[data-count]');
    if (reduced) return;
    els.forEach(function (el, k) {
      var target = Number(el.getAttribute('data-count'));
      var start = performance.now() + 250 + k * 120, dur = 1100;
      el.textContent = '0';
      (function step(now) {
        var p = Math.min(1, Math.max(0, (now - start) / dur));
        var e = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * e).toLocaleString('en');
        if (p < 1) requestAnimationFrame(step);
      })(performance.now());
    });
  }

  // ---------- Marquee: duplicate each track once so translateX(-50%) loops seamlessly ----------
  document.querySelectorAll('.mq-track').forEach(function (track) {
    Array.prototype.slice.call(track.children).forEach(function (child) {
      var c = child.cloneNode(true);
      c.setAttribute('aria-hidden', 'true');
      track.appendChild(c);
    });
  });

  if (reduced) return;

  // ---------- Game cards tilt toward the cursor, with a soft glare ----------
  if (fine) {
    document.querySelectorAll('.game, .tile, .perks li').forEach(function (card) {
      card.classList.add('tiltable');
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        var k = card.classList.contains('game') ? 1 : 0.4;
        card.style.setProperty('--ry', ((x - 0.5) * 10 * k).toFixed(2) + 'deg');
        card.style.setProperty('--rx', ((0.5 - y) * 8 * k).toFixed(2) + 'deg');
        card.style.setProperty('--gx', (x * 100).toFixed(1) + '%');
        card.style.setProperty('--gy', (y * 100).toFixed(1) + '%');
      });
      card.addEventListener('pointerleave', function () {
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    });
  }
})();
