// Brainik website motion: intro loader, hero depth scene (cursor + scroll parallax, gentle card tilt),
// count-up facts, seamless marquee, and tilting game cards. Everything is decorative and respects
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

  // ---------- Hero depth scene ----------
  var scene = document.getElementById('scene');
  var tilt = document.getElementById('tilt');
  var board = document.getElementById('board');
  if (scene && tilt) {
    var floats = Array.prototype.slice.call(scene.querySelectorAll('.float')).map(function (el) {
      return { el: el, d: Number(el.getAttribute('data-depth')) || 1 };
    });
    var tx = 0, ty = 0, cx = 0, cy = 0, onBoard = false, tiltX = 0, tiltY = 0, running = false, visible = true, sy = 0, csy = 0;
    var frame = function () {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      csy += (sy - csy) * 0.15;
      var aimX = onBoard ? 0 : cx, aimY = onBoard ? 0 : cy;
      tiltX += (aimX - tiltX) * 0.1;
      tiltY += (aimY - tiltY) * 0.1;
      floats.forEach(function (f) {
        f.el.style.transform = 'translate3d(' + (cx * f.d * 26).toFixed(2) + 'px,' + (cy * f.d * 18 - csy * f.d * 0.14).toFixed(2) + 'px,0)';
      });
      tilt.style.transform = 'rotateY(' + (tiltX * 5).toFixed(2) + 'deg) rotateX(' + (-tiltY * 4).toFixed(2) + 'deg)';
      var still = Math.abs(tx - cx) < 0.002 && Math.abs(ty - cy) < 0.002 && Math.abs(sy - csy) < 0.3 && Math.abs(aimX - tiltX) < 0.002 && Math.abs(aimY - tiltY) < 0.002;
      if (still || !visible) { running = false; return; }
      requestAnimationFrame(frame);
    };
    var kick = function () { if (!running && visible) { running = true; requestAnimationFrame(frame); } };
    if (fine) {
      window.addEventListener('pointermove', function (e) {
        var r = scene.getBoundingClientRect();
        tx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2)));
        ty = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (window.innerHeight / 2)));
        onBoard = !!(board && board.contains(e.target));
        kick();
      }, { passive: true });
      document.addEventListener('pointerleave', function () { tx = 0; ty = 0; kick(); });
    }
    window.addEventListener('scroll', function () { sy = Math.min(window.scrollY, 900); kick(); }, { passive: true });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { visible = en[0].isIntersecting; kick(); }).observe(scene);
    }
  }

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
