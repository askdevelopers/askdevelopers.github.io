/* LeafPulse site: theme toggle (saved per browser), mobile menu, calm reveal on scroll, footer year.
   No inline scripts anywhere (strict CSP). */
(function () {
  var root = document.documentElement;
  var KEY = 'lp-theme';

  try {
    var saved = localStorage.getItem(KEY);
    if (saved === 'light' || saved === 'dark') root.setAttribute('data-theme', saved);
  } catch (e) {}

  function isDark() {
    var t = root.getAttribute('data-theme');
    if (t) return t === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
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
      });
      links.addEventListener('click', function (e) {
        if (e.target && e.target.tagName === 'A') {
          links.classList.remove('open');
          menuBtn.setAttribute('aria-expanded', 'false');
        }
      });
    }

    var items = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
      items.forEach(function (el) { io.observe(el); });
    } else {
      items.forEach(function (el) { el.classList.add('in'); });
    }

    // Garden sound: off until the visitor asks (browsers block autoplay). Real CC0 recordings, soft volume.
    // The choice is remembered; when it was on, sound resumes at the visitor's first tap or key press.
    var soundBtn = document.getElementById('soundBtn');
    if (soundBtn) {
      var SKEY = 'lp-sound';
      var sounds = {};
      var on = false;
      var load = function (name, vol, loop) {
        if (!sounds[name]) {
          var a = new Audio('assets/sounds/' + name + '.m4a');
          a.volume = vol; a.loop = !!loop; a.preload = 'auto';
          sounds[name] = a;
        }
        return sounds[name];
      };
      var cue = function (name, vol) {
        if (!on) return;
        var a = load(name, vol);
        try { a.currentTime = 0; } catch (e) {}
        var p = a.play(); if (p && p.catch) p.catch(function () {});
      };
      var setSound = function (next, remember) {
        on = next;
        soundBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
        soundBtn.setAttribute('aria-label', on ? 'Turn garden sound off' : 'Turn garden sound on');
        var bg = load('garden', 0.45, true);
        if (on) { var p = bg.play(); if (p && p.catch) p.catch(function () {}); } else { bg.pause(); }
        if (remember) { try { localStorage.setItem(SKEY, on ? '1' : '0'); } catch (e) {} }
      };
      soundBtn.addEventListener('click', function () { setSound(!on, true); });
      var wanted = false;
      try { wanted = localStorage.getItem(SKEY) === '1'; } catch (e) {}
      if (wanted) {
        var resume = function (e) {
          if (e && e.target && e.target.closest && e.target.closest('#soundBtn')) return;
          setSound(true, false);
          window.removeEventListener('pointerdown', resume); window.removeEventListener('keydown', resume);
        };
        window.addEventListener('pointerdown', resume); window.addEventListener('keydown', resume);
      }
      // Story cues come from garden.js as it plays (pour, two spray puffs, a robin's chirp on the vine).
      var VOL = { pour: 0.5, spray: 0.55, chirp: 0.4 };
      document.addEventListener('lp:cue', function (e) { if (VOL[e.detail]) cue(e.detail, VOL[e.detail]); });
    }

    document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = String(new Date().getFullYear()); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready);
  else ready();
})();
