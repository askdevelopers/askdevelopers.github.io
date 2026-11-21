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

/* ---------- loader: shown once per visit on the home page, fades out when the page has loaded ---------- */
(function () {
  var loader = document.getElementById('loader');
  if (!loader) return;
  var root = document.documentElement;
  if (root.classList.contains('seen-loader')) { loader.remove(); return; }
  try { sessionStorage.setItem('pp-loader', '1'); } catch (e) {}
  var started = Date.now();
  var hide = function () {
    var wait = Math.max(0, 1400 - (Date.now() - started)); // long enough to see the pets run one lap
    setTimeout(function () {
      loader.classList.add('done');
      setTimeout(function () { loader.remove(); }, 700);
    }, wait);
  };
  if (document.readyState === 'complete') hide(); else window.addEventListener('load', hide);
})();

/* ---------- pet meadow: each pet picks a spot, trots there, rests a little, and sets off again ---------- */
(function () {
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('.meadow').forEach(function (meadow) {
    var runners = Array.prototype.slice.call(meadow.querySelectorAll('.runner'));
    var visible = false;
    var W = function () { return meadow.clientWidth; };

    runners.forEach(function (r, i) {
      var size = parseFloat(r.dataset.size || '84');
      r.style.setProperty('--size', size + 'px');
      r.style.zIndex = String(2 + i);
      var face = r.dataset.face || 'front';          // which way the doodle looks: right, left or front
      var speed = parseFloat(r.dataset.speed || '110'); // px per second
      var flip = r.querySelector('.flip');
      // spread the pets out to start with
      var x = Math.round(((i + 0.5) / runners.length) * (W() - size)) - size / 2;
      x = Math.max(0, Math.min(W() - size, x));
      r.style.transform = 'translateX(' + x + 'px)';
      r._x = x;
      if (reduce) return;

      var lastPaw = 0;
      var pawUp = false;
      var trail = function () {
        if (!r.classList.contains('moving')) return;
        var now = Date.now();
        if (now - lastPaw > 260 && visible) {
          lastPaw = now;
          var box = r.getBoundingClientRect(), mb = meadow.getBoundingClientRect();
          var p = document.createElement('span');
          p.className = 'paw' + (pawUp ? ' up' : '');
          pawUp = !pawUp;
          p.style.left = Math.round(box.left - mb.left + box.width / 2 - 6) + 'px';
          meadow.appendChild(p);
          setTimeout(function () { p.remove(); }, 2500);
        }
        requestAnimationFrame(trail);
      };

      var step = function () {
        if (!visible || document.hidden) { setTimeout(step, 800); return; }
        var w = W() - size;
        var target = Math.round(Math.random() * w);
        if (Math.abs(target - r._x) < w * 0.22) target = r._x > w / 2 ? Math.round(Math.random() * w * 0.35) : Math.round(w * 0.65 + Math.random() * w * 0.35);
        var goingRight = target > r._x;
        var scale = face === 'front' ? 1 : (face === 'right') === goingRight ? 1 : -1;
        if (flip) flip.style.transform = 'scaleX(' + scale + ')';
        var dur = Math.max(1.2, Math.abs(target - r._x) / speed);
        r.style.transition = 'transform ' + dur.toFixed(2) + 's cubic-bezier(.45,.05,.55,.95)';
        r.classList.add('moving');
        requestAnimationFrame(trail);
        r.style.transform = 'translateX(' + target + 'px)';
        r._x = target;
        setTimeout(function () {
          r.classList.remove('moving');
          setTimeout(step, 700 + Math.random() * 2600); // a little rest, then off again
        }, dur * 1000);
      };
      setTimeout(step, 400 + i * 450);
    });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (e) { visible = e[0].isIntersecting; }).observe(meadow);
    } else { visible = true; }
    window.addEventListener('resize', function () {
      runners.forEach(function (r) {
        var size = parseFloat(r.dataset.size || '84');
        if (r._x > W() - size) { r._x = Math.max(0, W() - size); r.style.transition = 'none'; r.style.transform = 'translateX(' + r._x + 'px)'; }
      });
    });
  });
})();
