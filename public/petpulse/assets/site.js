// PetPulse website: theme toggle, mobile menu, sticky-header hairline, calm fade-in, footer year.
// No tracking. The only thing stored is your light/dark choice, in this browser.
(function () {
  var root = document.documentElement;

  // GitHub Pages can't send X-Frame-Options, so refuse to be framed (clickjacking).
  if (window.top !== window.self) { try { window.top.location = window.self.location; } catch (e) { document.body.innerHTML = ''; } }

  /* light / dark toggle */
  var themeBtn = document.getElementById('themeBtn');
  var current = function () {
    return root.getAttribute('data-theme') || (window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  };
  var label = function () {
    if (!themeBtn) return;
    var dark = current() === 'dark';
    themeBtn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    themeBtn.setAttribute('title', dark ? 'Light mode' : 'Dark mode');
    var meta = document.querySelectorAll('meta[name="theme-color"]');
    meta.forEach(function (m) { m.setAttribute('content', dark ? '#0E0E11' : '#F5F2FD'); m.removeAttribute('media'); });
  };
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = current() === 'dark' ? 'light' : 'dark';
      root.classList.add('theme-fade');
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('pp-theme', next); } catch (e) {}
      label();
      setTimeout(function () { root.classList.remove('theme-fade'); }, 500);
    });
    if (window.matchMedia) {
      var mq = matchMedia('(prefers-color-scheme: dark)');
      var onChange = function () { if (!root.getAttribute('data-theme')) label(); };
      if (mq.addEventListener) mq.addEventListener('change', onChange); else if (mq.addListener) mq.addListener(onChange);
    }
    label();
  }

  /* mobile menu */
  var nav = document.querySelector('.site-header');
  var menuBtn = document.getElementById('menuBtn');
  if (nav && menuBtn) {
    var setMenu = function (open) {
      nav.classList.toggle('open', open);
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };
    menuBtn.addEventListener('click', function () { setMenu(!nav.classList.contains('open')); });
    nav.querySelectorAll('.nav-links a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  }

  /* header hairline once scrolled */
  var onScroll = function () { if (nav) nav.classList.toggle('scrolled', window.scrollY > 8); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* calm fade-in */
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();

/* ---------- loader: once per visit, fades out when the page has loaded ---------- */
(function () {
  var loader = document.getElementById('loader');
  if (!loader) return;
  if (document.documentElement.classList.contains('seen-loader')) { loader.remove(); return; }
  try { sessionStorage.setItem('pp-loader', '1'); } catch (e) {}
  var started = Date.now();
  var hide = function () {
    var wait = Math.max(0, 1900 - (Date.now() - started)); // ring closes and every pet has arrived
    setTimeout(function () { loader.classList.add('done'); setTimeout(function () { loader.remove(); }, 800); }, wait);
  };
  if (document.readyState === 'complete') hide(); else window.addEventListener('load', hide);
})();

/* ---------- hero stage: phone tilts toward the cursor, cards float at their own depth ---------- */
(function () {
  var stage = document.getElementById('stage');
  if (!stage) return;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var loaderUp = document.getElementById('loader') && !document.documentElement.classList.contains('seen-loader');
  setTimeout(function () { stage.classList.add('ready'); }, loaderUp ? 1900 : 150);
  if (reduce) return;

  var tx = 0, ty = 0, x = 0, y = 0, sy = 0, tsy = 0, running = false;
  var fine = window.matchMedia && matchMedia('(pointer: fine)').matches;
  var hero = stage.closest('section') || document.body;
  if (fine) {
    hero.addEventListener('pointermove', function (e) {
      var r = stage.getBoundingClientRect();
      tx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width / 1.2)));
      ty = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (r.height / 1.2)));
      kick();
    });
    hero.addEventListener('pointerleave', function () { tx = 0; ty = 0; kick(); });
  }
  var onScroll = function () {
    var r = stage.getBoundingClientRect();
    tsy = Math.max(0, Math.min(1, -r.top / (r.height || 1)));
    kick();
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  function kick() { if (!running) { running = true; requestAnimationFrame(frame); } }
  function frame() {
    // ease toward the target (smooth, no overshoot)
    x += (tx - x) * 0.07; y += (ty - y) * 0.07; sy += (tsy - sy) * 0.12;
    stage.style.setProperty('--mx', x.toFixed(4));
    stage.style.setProperty('--my', y.toFixed(4));
    stage.style.setProperty('--sy', sy.toFixed(4));
    if (Math.abs(tx - x) > 0.001 || Math.abs(ty - y) > 0.001 || Math.abs(tsy - sy) > 0.001) requestAnimationFrame(frame);
    else running = false;
  }
})();

/* ---------- feature cards: soft light follows the cursor ---------- */
(function () {
  if (!(window.matchMedia && matchMedia('(pointer: fine)').matches)) return;
  document.querySelectorAll('.feature').forEach(function (card) {
    card.addEventListener('pointermove', function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty('--x', (e.clientX - r.left) + 'px');
      card.style.setProperty('--y', (e.clientY - r.top) + 'px');
    });
  });
})();

/* ---------- Service Dog Hub spotlight: screen reel, rotating place, counters ---------- */
(function () {
  var spot = document.getElementById('service');
  if (!spot) return;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var frames = spot.querySelectorAll('.reel .frame');
  var dots = spot.querySelectorAll('.reel-dots i');
  var placeBox = spot.querySelector('.c-place .place');
  var PLACES = ['Texas', 'Ontario', 'New South Wales', 'Scotland', 'California', 'Maharashtra', 'British Columbia', 'Victoria', 'New York', 'Wales', 'Florida', 'Karnataka'];
  var visible = false, timer = 0, reelIx = 0, placeIx = 0, counted = false;

  function show(i) {
    frames.forEach(function (f, j) { f.classList.toggle('on', j === i); });
    dots.forEach(function (d, j) { d.classList.toggle('on', j === i); });
  }
  function nextPlace() {
    if (!placeBox) return;
    var cur = placeBox.querySelector('b:not(.out)');
    placeIx = (placeIx + 1) % PLACES.length;
    var nb = document.createElement('b');
    nb.className = 'in'; nb.textContent = PLACES[placeIx];
    placeBox.appendChild(nb);
    requestAnimationFrame(function () { requestAnimationFrame(function () { nb.classList.remove('in'); if (cur) cur.classList.add('out'); }); });
    setTimeout(function () { if (cur && cur.parentNode) cur.remove(); }, 800);
  }
  function count() {
    if (counted) return; counted = true;
    spot.querySelectorAll('[data-count]').forEach(function (el) {
      var to = parseInt(el.getAttribute('data-count'), 10), t0 = performance.now(), dur = 1500;
      if (reduce) { el.textContent = to; return; }
      (function step(now) {
        var p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(to * e);
        if (p < 1) requestAnimationFrame(step);
      })(t0);
    });
  }
  function tick() {
    if (!visible || document.hidden) return;
    reelIx = (reelIx + 1) % frames.length; show(reelIx);
    nextPlace();
  }
  show(0);
  if (reduce) { count(); return; }
  spot.querySelectorAll('[data-count]').forEach(function (el) { el.textContent = '0'; });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (e) {
      visible = e[0].isIntersecting;
      if (visible) { count(); if (!timer) timer = setInterval(tick, 3600); }
      else if (timer) { clearInterval(timer); timer = 0; }
    }, { threshold: 0.25 }).observe(spot);
  } else { visible = true; count(); timer = setInterval(tick, 3600); }
})();
