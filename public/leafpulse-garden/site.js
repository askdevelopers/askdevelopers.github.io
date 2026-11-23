// Shared by every page: day/night toggle, mobile menu, calm reveal on scroll, footer year,
// and the little drawn garden strips ([data-garden]) on the inner pages.
(function () {
  'use strict';
  var root = document.documentElement;
  var NS = 'http://www.w3.org/2000/svg';

  // ---------- day / night ----------
  var themeBtn = document.getElementById('themeBtn');
  if (themeBtn) themeBtn.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('lp-garden-theme', next); } catch (e) { /* private mode */ }
  });

  // ---------- mobile menu ----------
  var menuBtn = document.getElementById('menuBtn'), links = document.getElementById('links');
  if (menuBtn && links) {
    menuBtn.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.addEventListener('click', function (e) {
      if (e.target.closest('a')) { links.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); }
    });
  }

  // ---------- footer year ----------
  Array.prototype.forEach.call(document.querySelectorAll('[data-year]'), function (n) { n.textContent = new Date().getFullYear(); });

  // ---------- reveal on scroll ----------
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)) {
    root.classList.add('js-reveal');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    Array.prototype.forEach.call(reveals, function (r) { io.observe(r); });
  }


  // ---------- "real gardens" carousels: arrows, dots, keys, swipe, calm autoplay ----------
  var calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  Array.prototype.forEach.call(document.querySelectorAll('[data-cs]'), function (cs) {
    var track = cs.querySelector('.cs-track'), slides = cs.querySelectorAll('.cs-slide'), dots = cs.querySelectorAll('.cs-dot');
    var view = cs.querySelector('.cs-viewport'), n = slides.length, i = 0, timer = null, hover = false, seen = false;
    cs.setAttribute('data-ready', '');
    function go(k, user) {
      i = (k + n) % n;
      for (var j = 0; j < n; j++) {
        // position relative to the current slide, wrapping round so both neighbours always exist
        var rel = ((j - i) % n + n) % n; if (rel > n / 2) rel -= n;
        slides[j].style.setProperty('--rel', rel);
        slides[j].classList.toggle('is-active', j === i);
        slides[j].classList.toggle('is-near', Math.abs(rel) === 1);
        slides[j].classList.toggle('is-far', Math.abs(rel) > 1);
        slides[j].setAttribute('aria-hidden', j === i ? 'false' : 'true');
        if (dots[j]) dots[j].setAttribute('aria-current', j === i ? 'true' : 'false');
        // keep links in hidden slides out of the tab order
        Array.prototype.forEach.call(slides[j].querySelectorAll('a'), function (a) { a.tabIndex = j === i ? 0 : -1; });
      }
      // handwritten hints under the vine arrows: where each one goes
      var title = function (k) { var h = slides[(k + n) % n].querySelector('h3'); return h ? h.textContent : ''; };
      var lp = cs.querySelector('.cs-prev .va-label'), ln = cs.querySelector('.cs-next .va-label');
      if (lp) lp.textContent = 'back: ' + title(i - 1);
      if (ln) ln.textContent = 'next: ' + title(i + 1);
      cs.querySelector('.cs-prev').setAttribute('aria-label', 'Previous slide: ' + title(i - 1));
      cs.querySelector('.cs-next').setAttribute('aria-label', 'Next slide: ' + title(i + 1));
      if (user) restart();
    }
    function restart() {
      clearInterval(timer);
      if (calm) return;
      timer = setInterval(function () { if (!hover && seen && !document.hidden && cs.offsetParent) go(i + 1); }, 8000);
    }
    Array.prototype.forEach.call(slides, function (sl, j) {
      sl.addEventListener('click', function (e) {
        if (j === i) return;
        e.preventDefault(); go(j, true);
      });
    });
    cs.querySelector('.cs-prev').addEventListener('click', function () { go(i - 1, true); });
    cs.querySelector('.cs-next').addEventListener('click', function () { go(i + 1, true); });
    Array.prototype.forEach.call(dots, function (d, j) { d.addEventListener('click', function () { go(j, true); }); });
    view.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(i + 1, true); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(i - 1, true); }
    });
    cs.addEventListener('mouseenter', function () { hover = true; });
    cs.addEventListener('mouseleave', function () { hover = false; });
    cs.addEventListener('focusin', function () { hover = true; });
    cs.addEventListener('focusout', function () { hover = false; });
    // swipe
    var x0 = null, y0 = 0;
    view.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') { x0 = e.clientX; y0 = e.clientY; } });
    view.addEventListener('pointerup', function (e) {
      if (x0 === null) return;
      var dx = e.clientX - x0, dy = e.clientY - y0; x0 = null;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) go(i + (dx < 0 ? 1 : -1), true);
    });
    view.addEventListener('pointercancel', function () { x0 = null; });
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { seen = es[0].isIntersecting; }, { threshold: .35 }).observe(cs);
    else seen = true;
    go(0); restart();
  });

  // ---------- little garden strips ----------
  function el(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  var gid = 0;
  function garden(host) {
    var id = 'mg' + (gid++);
    var svg = el('svg', { viewBox: '0 0 1200 140', preserveAspectRatio: 'xMidYMax slice', 'aria-hidden': 'true', focusable: 'false' });
    var defs = el('defs', {}, svg);
    function lin(name, a, b) { var g = el('linearGradient', { id: id + name, x1: 0, y1: 0, x2: 0, y2: 1 }, defs); el('stop', { offset: 0, 'stop-color': a }, g); el('stop', { offset: 1, 'stop-color': b }, g); }
    lin('h1', '#B9D9C6', '#97C3AA'); lin('h2', '#A6D877', '#5E9E4B'); lin('p', '#FFE98A', '#F4AE2E');
    lin('t1', '#FFCDB6', '#EC7F5E'); lin('t2', '#ECE2FF', '#A48AE6'); lin('w', '#EDE5FF', '#9580E4');
    var land = el('g', { class: 'mg-land' }, svg);
    el('path', { d: 'M-50 92 C150 50 330 56 520 80 C700 100 860 46 1060 56 C1160 61 1220 52 1260 60 V160 H-50Z', fill: 'url(#' + id + 'h1)' }, land);
    el('path', { d: 'M-50 116 C200 96 420 104 640 110 C860 116 1020 98 1260 104 V160 H-50Z', fill: 'url(#' + id + 'h2)' }, land);
    // tufts
    for (var x = 10; x < 1200; x += 46) {
      var y = 124 + (x * 7 % 13);
      el('path', { d: 'M' + x + ' ' + y + ' q-2 -7 -5 -10 M' + x + ' ' + y + ' q0 -8 1 -12 M' + x + ' ' + y + ' q3 -6 6 -9', stroke: '#3F7F37', 'stroke-width': 1.5, fill: 'none', 'stroke-linecap': 'round', opacity: .6 }, land);
    }
    // flowers (heads nod at night via CSS)
    var spots = [[90, 'sun'], [140, 't1'], [178, 'd'], [228, 't2'], [930, 't1'], [972, 'd'], [1010, 'sun'], [1060, 't2'], [1102, 'd'], [600, 'd'], [640, 't1'], [470, 't2'], [512, 'sun'], [552, 'd'], [690, 't2'], [728, 'sun'], [768, 'd'], [410, 'd'], [820, 't1']];
    spots.forEach(function (sp, i) {
      var fx = sp[0], kind = sp[1], h = kind === 'sun' ? 74 : 34 + (i % 3) * 7, base = 122;
      var g = el('g', { class: 'mg-flower', transform: 'translate(' + fx + ' ' + base + ')' }, svg);
      var s = el('g', { class: 'mg-sway' }, g);
      s.style.animationDelay = (-(i * .7) % 4).toFixed(1) + 's';
      el('path', { d: 'M0 0 Q-3 ' + (-h / 2) + ' 0 ' + (-h), stroke: '#3F8A3C', 'stroke-width': kind === 'sun' ? 3.6 : 2.4, fill: 'none', 'stroke-linecap': 'round' }, s);
      el('path', { d: 'M0 ' + (-h * .35) + ' q12 -3 15 -13 q-10 0 -15 13', fill: '#5DA84A' }, s);
      var hd = el('g', { transform: 'translate(0 ' + (-h) + ')' }, s);
      var nod = el('g', { class: 'mg-head' + (i % 2 ? ' r' : '') }, hd);
      if (kind === 'sun') {
        for (var k = 0; k < 12; k++) el('ellipse', { rx: 4, ry: 10, transform: 'rotate(' + (k * 30) + ') translate(0 -12)', fill: 'url(#' + id + 'p)', stroke: '#C98A2A', 'stroke-width': .6 }, nod);
        el('circle', { r: 10, fill: '#6E4426', stroke: '#4A2E16', 'stroke-width': .8 }, nod);
        var face = el('g', { class: 'mg-face' }, nod);
        el('path', { d: 'M-6 -1 q2.5 2.5 5 0 M1 -1 q2.5 2.5 5 0', stroke: '#F4E6C8', 'stroke-width': 1.3, fill: 'none', 'stroke-linecap': 'round' }, face);
        var z = el('text', { class: 'mg-z', x: 12, y: -16 }, nod); z.textContent = 'z';
      } else if (kind === 'd') {
        for (k = 0; k < 8; k++) el('ellipse', { rx: 2.4, ry: 6, transform: 'rotate(' + (k * 45) + ') translate(0 -5.5)', fill: '#fff', stroke: '#D9D3E6', 'stroke-width': .6 }, nod);
        el('circle', { r: 3.2, fill: '#F5B83D' }, nod);
      } else {
        el('path', { d: 'M-7 0 C-8 -11 -3 -16 0 -12 C3 -16 8 -11 7 0 C5 5 -5 5 -7 0Z', fill: 'url(#' + id + kind + ')', stroke: '#7A5A44', 'stroke-opacity': .4 }, nod);
      }
    });
    // a butterfly drifting across, and a bee
    var bf = el('g', { class: 'mg-fly day-only' }, svg), bfi = el('g', { class: 'mg-bob' }, bf);
    var wl = el('g', { class: 'wing wl' }, bfi), wr = el('g', { class: 'wing wr' }, bfi);
    el('path', { d: 'M0 -2 C-6 -14 -20 -18 -23 -11 C-25 -4 -15 2 0 0Z M0 1 C-11 3 -18 9 -14 15 C-9 20 -3 11 0 2Z', fill: 'url(#' + id + 'w)', stroke: '#2A3A26', 'stroke-opacity': .5 }, wl);
    el('path', { d: 'M0 -2 C6 -14 20 -18 23 -11 C25 -4 15 2 0 0Z M0 1 C11 3 18 9 14 15 C9 20 3 11 0 2Z', fill: 'url(#' + id + 'w)', stroke: '#2A3A26', 'stroke-opacity': .5 }, wr);
    el('ellipse', { rx: 2, ry: 8, fill: '#3A3046' }, bfi);
    var bee = el('g', { class: 'mg-bee day-only' }, svg), bi = el('g', { class: 'mg-bob b' }, bee);
    el('ellipse', { rx: 8, ry: 6, fill: '#FFD24F', stroke: '#3A2A1A', 'stroke-width': 1 }, bi);
    el('path', { d: 'M-2 -5.5 Q0 0 -2 5.5 M3 -5.5 Q5 0 3 5.5', stroke: '#3A2A1A', 'stroke-width': 2.2, fill: 'none' }, bi);
    el('ellipse', { cx: 0, cy: -8, rx: 4, ry: 5.5, fill: '#F4FBFF', 'fill-opacity': .85, stroke: '#7FA7B8', 'stroke-width': .7, class: 'bwing' }, bi);
    // fireflies for the night
    var ff = el('g', { class: 'night-only' }, svg);
    [[150, 70], [320, 96], [520, 60], [700, 90], [880, 70], [1080, 84], [1160, 50]].forEach(function (p, i) {
      var c = el('circle', { cx: p[0], cy: p[1], r: 2.4, fill: '#FFF2A0', class: 'mg-ff' }, ff);
      c.style.animationDelay = (-i * .6) + 's';
    });
    host.appendChild(svg);
  }
  Array.prototype.forEach.call(document.querySelectorAll('[data-garden]'), garden);
})();
