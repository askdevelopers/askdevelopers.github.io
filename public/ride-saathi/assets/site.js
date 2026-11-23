/* RideSaathi site: theme toggle (saved per browser), mobile menu, calm fade-in on scroll, footer year.
   No inline scripts anywhere (strict CSP). */
(function () {
  var root = document.documentElement;
  var KEY = 'rs-theme';

  function isDark() {
    var t = root.getAttribute('data-theme');
    if (t) return t === 'dark';
    return !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  }

  function ready() {
    var themeBtn = document.getElementById('themeBtn');
    if (themeBtn) {
      themeBtn.addEventListener('click', function () {
        var next = isDark() ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        try { localStorage.setItem(KEY, next); } catch (e) {}
      });
    }

    var menuBtn = document.getElementById('menuBtn');
    var links = document.getElementById('links');
    if (menuBtn && links) {
      menuBtn.addEventListener('click', function () {
        var open = links.classList.toggle('open');
        menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
        menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      });
      links.addEventListener('click', function (e) {
        if (e.target && e.target.tagName === 'A') {
          links.classList.remove('open');
          menuBtn.setAttribute('aria-expanded', 'false');
          menuBtn.setAttribute('aria-label', 'Open menu');
        }
      });
    }

    // Calm reveal: elements fade and glide up a few pixels once, as they come into view.
    var items = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
        });
      }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
      items.forEach(function (el) { io.observe(el); });
    } else {
      items.forEach(function (el) { el.classList.add('in'); });
    }

    document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = String(new Date().getFullYear()); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready);
  else ready();
})();
