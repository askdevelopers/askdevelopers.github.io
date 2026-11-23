// A few garden creatures that roam the empty margins while you scroll (behind the content),
// plus small plant "nooks" beside the app screenshots. Day: butterflies, a bee, drifting leaves and
// dandelion seeds. Night: fireflies, a moth and glowing seeds; nooks grow glowing mushrooms.
(function () {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';
  var root = document.documentElement;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function el(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function rand(a, b) { return a + Math.random() * (b - a); }
  function night() { return root.getAttribute('data-theme') === 'dark'; }

  function grad(defs, id, stops, radial) {
    var g = el(radial ? 'radialGradient' : 'linearGradient', radial ? { id: id } : { id: id, x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
    stops.forEach(function (s) { el('stop', { offset: s[0], 'stop-color': s[1], 'stop-opacity': s[2] == null ? 1 : s[2] }, g); });
  }

  // ---------- plant nooks beside the screenshots (static art that sways; changes with the theme) ----------
  function nook(host, i) {
    var s = el('svg', { class: 'nook', viewBox: '0 0 150 120', 'aria-hidden': 'true', focusable: 'false' });
    var d = el('defs', {}, s), p = 'nk' + i;
    grad(d, p + 'glow', [[0, '#C9FFF0', .9], [.4, '#7FF0D0', .35], [1, '#7FF0D0', 0]], true);
    grad(d, p + 'moon', [[0, '#FFFDF0', .95], [.5, '#FFF6D0', .3], [1, '#FFF6D0', 0]], true);
    grad(d, p + 'cap', [[0, '#E9FFF7'], [1, '#86DCC2']]);
    grad(d, p + 'bcap', [[0, '#F2D2A6'], [1, '#C98F57']]);
    grad(d, p + 'lady', [[0, '#FF8E78'], [1, '#D2412E']]);
    el('ellipse', { cx: 75, cy: 112, rx: 62, ry: 8, fill: '#3F7238', opacity: .22 }, s);
    var sway = el('g', { class: 'nk-sway' }, s);
    // leaves + grass shared by day and night
    el('path', { d: 'M40 112 C30 92 34 72 50 60 C52 78 50 96 40 112Z', fill: '#5DA84A', stroke: '#2F6A34', 'stroke-width': 1 }, sway);
    el('path', { d: 'M104 112 C118 94 120 76 108 62 C100 80 98 98 104 112Z', fill: '#6DB04A', stroke: '#2F6A34', 'stroke-width': 1 }, sway);
    el('path', { d: 'M60 112 q-4 -16 -10 -24 M66 112 q0 -18 3 -28 M84 112 q4 -14 12 -22 M92 112 q-2 -12 -6 -18 M26 112 q2 -10 -2 -16 M124 112 q-2 -10 3 -16', stroke: '#3F7F37', 'stroke-width': 2, fill: 'none', 'stroke-linecap': 'round' }, sway);
    // day: daisies, a little mushroom and a ladybug
    var day = el('g', { class: 'day-only' }, sway);
    [[58, 60, 1], [80, 72, .85]].forEach(function (f) {
      el('path', { d: 'M' + f[0] + ' 112 Q' + (f[0] - 3) + ' ' + (f[1] + 25) + ' ' + f[0] + ' ' + f[1], stroke: '#3F8A3C', 'stroke-width': 2.2, fill: 'none' }, day);
      var h = el('g', { transform: 'translate(' + f[0] + ' ' + f[1] + ') scale(' + f[2] + ')' }, day);
      for (var k = 0; k < 8; k++) el('ellipse', { rx: 2.6, ry: 6.5, transform: 'rotate(' + (k * 45) + ') translate(0 -6)', fill: '#fff', stroke: '#D9D3E6', 'stroke-width': .6 }, h);
      el('circle', { r: 3.4, fill: '#F5B83D' }, h);
    });
    el('rect', { x: 110, y: 98, width: 6, height: 14, rx: 3, fill: '#F4ECDC' }, day);
    el('path', { d: 'M102 100 Q113 84 124 100Z', fill: 'url(#' + p + 'bcap)', stroke: '#9A6436', 'stroke-width': 1 }, day);
    var lady = el('g', { class: 'nk-lady', transform: 'translate(46 84) rotate(-30)' }, day);
    el('circle', { cx: 0, cy: -6, r: 2.8, fill: '#2A2A2A' }, lady);
    el('ellipse', { rx: 5.5, ry: 6, fill: 'url(#' + p + 'lady)', stroke: '#6E1F18', 'stroke-width': .7 }, lady);
    el('path', { d: 'M0 -5.5 V6', stroke: '#6E1F18', 'stroke-width': .7 }, lady);
    el('circle', { cx: -2.4, cy: -1, r: 1.2, fill: '#2A2A2A' }, lady); el('circle', { cx: 2.4, cy: 2, r: 1.2, fill: '#2A2A2A' }, lady);
    // night: glowing mushrooms and a moonflower
    var nt = el('g', { class: 'night-only' }, sway);
    el('circle', { cx: 112, cy: 96, r: 30, fill: 'url(#' + p + 'glow)', class: 'nk-pulse' }, nt);
    [[104, 100, 1], [118, 104, .75], [92, 106, .6]].forEach(function (m) {
      var g = el('g', { transform: 'translate(' + m[0] + ' ' + m[1] + ') scale(' + m[2] + ')' }, nt);
      el('rect', { x: -2.5, y: 0, width: 5, height: 12, rx: 2.5, fill: '#E6FFF6' }, g);
      el('path', { d: 'M-10 2 Q0 -14 10 2Z', fill: 'url(#' + p + 'cap)', stroke: '#4FBFA2', 'stroke-width': .8 }, g);
      el('circle', { cx: -3, cy: -3, r: 1.2, fill: '#FFFFFF', opacity: .9 }, g);
    });
    el('path', { d: 'M66 112 C62 96 70 84 64 70', stroke: '#3F7F37', 'stroke-width': 2, fill: 'none' }, nt);
    el('circle', { cx: 64, cy: 64, r: 22, fill: 'url(#' + p + 'moon)', class: 'nk-pulse' }, nt);
    var mf = el('g', { transform: 'translate(64 64)' }, nt);
    for (var k = 0; k < 5; k++) el('ellipse', { rx: 4.6, ry: 9, transform: 'rotate(' + (k * 72) + ') translate(0 -7)', fill: '#FFFDF4', stroke: '#E4DCC0', 'stroke-width': .6 }, mf);
    el('circle', { r: 3, fill: '#F7E7A6' }, mf);
    var ff = el('circle', { cx: 30, cy: 60, r: 2.2, fill: '#FFF2A0', class: 'nk-ff' }, nt); void ff;
    host.appendChild(s);
  }
  Array.prototype.forEach.call(document.querySelectorAll('.split-art'), nook);

  if (reduce) return; // the roaming layer is motion only

  // ---------- the roaming layer ----------
  var svg = el('svg', { class: 'roam', 'aria-hidden': 'true', focusable: 'false' });
  var defs = el('defs', {}, svg);
  grad(defs, 'rmLil', [[0, '#EDE5FF'], [1, '#9580E4']]);
  grad(defs, 'rmSun', [[0, '#FFF4C0'], [1, '#F1AE36']]);
  grad(defs, 'rmMoth', [[0, '#FBF6EA'], [1, '#D9CBB0']]);
  grad(defs, 'rmBee', [[0, '#FFF0A6'], [1, '#E9A92A']]);
  grad(defs, 'rmFly', [[0, '#FFFBD0'], [.25, '#FFE66E', .85], [1, '#FFE66E', 0]], true);
  grad(defs, 'rmSpore', [[0, '#E6FFF6'], [.35, '#9BF2D8', .7], [1, '#9BF2D8', 0]], true);
  document.body.appendChild(svg);

  var W = 0, H = 0, lanes = null;
  function measure() {
    W = window.innerWidth; H = window.innerHeight;
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    var cw = Math.min(1120, W - 32), m = (W - cw) / 2;
    lanes = m >= 80 ? { wide: true, m: m } : { wide: false, m: m };
  }
  measure();
  window.addEventListener('resize', measure);

  var roamers = [];
  function add(r) { r.x = 0; r.y = rand(0, H || 800); r.ph = rand(0, 6.28); r.side = r.side == null ? roamers.length % 2 : r.side; r.u = rand(.1, .9); roamers.push(r); return r; }

  function wings(parent, fill) {
    var g = el('g', {}, parent);
    var wl = el('g', { class: 'wing wl' }, g), wr = el('g', { class: 'wing wr' }, g);
    var up = 'M0 -2 C-7 -15 -22 -20 -25 -12 C-27 -5 -17 2 0 0Z', lo = 'M0 1 C-12 3 -20 10 -15 17 C-10 22 -3 12 0 3Z';
    [wl, el('g', { transform: 'scale(-1 1)' }, wr)].forEach(function (w) {
      el('path', { d: up, fill: fill, stroke: '#2A3A26', 'stroke-opacity': .45, 'stroke-width': 1 }, w);
      el('path', { d: lo, fill: fill, stroke: '#2A3A26', 'stroke-opacity': .45, 'stroke-width': 1 }, w);
      el('circle', { cx: -16, cy: -10, r: 2.4, fill: '#fff', opacity: .75 }, w);
    });
    return g;
  }
  function butterfly(fill, moth) {
    var g = el('g', { class: moth ? 'night-only rm' : 'day-only rm' }, svg), t = el('g', {}, g);
    wings(t, fill);
    el('ellipse', { rx: moth ? 3.4 : 2.2, ry: moth ? 10 : 9.5, fill: moth ? '#B8A98C' : '#3A3046' }, t);
    el('path', { d: moth ? 'M-1 -10 Q-7 -18 -12 -17 M1 -10 Q7 -18 12 -17' : 'M-1 -11 Q-4 -18 -8 -20 M1 -11 Q4 -18 8 -20', stroke: moth ? '#B8A98C' : '#3A3046', 'stroke-width': 1, fill: 'none', 'stroke-linecap': 'round' }, t);
    return { g: g, t: t };
  }

  var small = window.innerWidth < 760;
  // day
  var b1 = butterfly('url(#rmLil)'), b2 = small ? null : butterfly('url(#rmSun)');
  add({ kind: 'bfly', night: false, art: b1, k: .35, sc: .8, side: 0 });
  if (b2) add({ kind: 'bfly', night: false, art: b2, k: .5, sc: .7, side: 1 });
  if (!small) {
    var beeG = el('g', { class: 'day-only rm' }, svg);
    var trail = el('path', { class: 'day-only', fill: 'none', stroke: '#2A3A26', 'stroke-width': 1.8, 'stroke-dasharray': '.5 7', 'stroke-linecap': 'round', opacity: .28 }, svg);
    svg.insertBefore(trail, beeG);
    var bi = el('g', {}, beeG);
    el('ellipse', { rx: 9, ry: 7, fill: 'url(#rmBee)', stroke: '#3A2A1A', 'stroke-width': 1 }, bi);
    el('path', { d: 'M-3 -6.5 Q-1 0 -3 6.5 M2.5 -6.8 Q4.5 0 2.5 6.8', stroke: '#3A2A1A', 'stroke-width': 2.6, fill: 'none', 'stroke-linecap': 'round' }, bi);
    el('circle', { cx: 9, cy: -1, r: 5, fill: 'url(#rmBee)', stroke: '#3A2A1A', 'stroke-width': 1 }, bi);
    el('circle', { cx: 10.6, cy: -2, r: 1.3, fill: '#2A1E12' }, bi);
    el('ellipse', { cx: -1, cy: -10, rx: 5, ry: 7, fill: '#F4FBFF', 'fill-opacity': .85, stroke: '#7FA7B8', 'stroke-width': .7, class: 'bwing' }, bi);
    add({ kind: 'bee', night: false, g: beeG, inner: bi, trail: trail, pts: [], k: .45, side: 1, lx: 0 });
  }
  for (var i = 0; i < (small ? 1 : 3); i++) { // drifting leaves
    var lf = el('g', { class: 'day-only rm' }, svg);
    el('path', { d: 'M0 -8 C6 -4 6 4 0 8 C-6 4 -6 -4 0 -8Z', fill: ['#9BCF6A', '#C9DB6A', '#F2B9A0'][i % 3], stroke: '#3E7534', 'stroke-width': .7 }, lf);
    el('path', { d: 'M0 -7 V7', stroke: '#3E7534', 'stroke-width': .6, opacity: .7 }, lf);
    add({ kind: 'leaf', night: false, g: lf, k: .6, vy: rand(10, 18), side: i % 2 });
  }
  for (i = 0; i < (small ? 0 : 2); i++) { // dandelion seeds floating up
    var sd = el('g', { class: 'day-only rm', opacity: .9 }, svg);
    el('path', { d: 'M0 0 V14', stroke: '#B8AE94', 'stroke-width': 1 }, sd);
    el('ellipse', { cx: 0, cy: 15, rx: 1.4, ry: 2.4, fill: '#A08A62' }, sd);
    for (var k = 0; k < 9; k++) { var a = -Math.PI * (k / 8); el('path', { d: 'M0 0 L' + (Math.cos(a) * 9).toFixed(1) + ' ' + (Math.sin(a) * 9).toFixed(1), stroke: '#FFFFFF', 'stroke-width': .9 }, sd); }
    add({ kind: 'seed', night: false, g: sd, k: .25, vy: -rand(6, 11), side: (i + 1) % 2 });
  }
  // night
  for (i = 0; i < (small ? 3 : 7); i++) {
    var fg = el('g', { class: 'night-only rm' }, svg);
    el('circle', { r: 10, fill: 'url(#rmFly)' }, fg);
    el('circle', { r: 1.7, fill: '#FFFDE0' }, fg);
    add({ kind: 'ff', night: true, g: fg, k: rand(.2, .55), side: i % 2 });
  }
  if (!small) add({ kind: 'moth', night: true, art: butterfly('url(#rmMoth)', true), k: .4, sc: .75, side: 0 });
  for (i = 0; i < (small ? 0 : 2); i++) {
    var sp = el('g', { class: 'night-only rm' }, svg);
    el('circle', { r: 7, fill: 'url(#rmSpore)' }, sp);
    add({ kind: 'spore', night: true, g: sp, k: .3, vy: -rand(5, 9), side: i % 2 });
  }

  // ---------- motion ----------
  function laneX(r, t, amp) {
    if (lanes.wide) {
      var c = r.side ? W - lanes.m / 2 : lanes.m / 2, a = Math.max(18, Math.min(130, lanes.m / 2 - 24));
      return c + Math.sin(t * .33 + r.ph) * a * amp + Math.sin(t * .9 + r.ph * 2) * 10;
    }
    return r.u * W + Math.sin(t * .3 + r.ph) * 40 * amp;
  }
  var t = 0, last = 0, lastScroll = window.scrollY, running = true;
  function frame(now) {
    if (!running) return;
    var dt = last ? Math.min(.05, (now - last) / 1000) : .016; last = now; t += dt;
    var sy = window.scrollY, dy = sy - lastScroll; lastScroll = sy;
    var isNight = night();
    var speedUp = Math.min(1, Math.abs(dy) / 30);
    for (var i = 0; i < roamers.length; i++) {
      var r = roamers[i];
      if (r.night !== isNight) continue;
      r.y -= dy * r.k; // drift against the scroll, like things hanging in the air
      if (r.vy) r.y += r.vy * dt;
      if (r.y < -60 || r.y > H + 60) { // wrap round evenly, so a long jump never bunches them at an edge
        var span = H + 120;
        r.y = ((r.y + 60) % span + span) % span - 60;
        r.ph = rand(0, 6.28); r.u = rand(.1, .9);
        if (r.pts) r.pts.length = 0;
      }
      var x, y;
      if (r.kind === 'bfly' || r.kind === 'moth') {
        x = laneX(r, t, 1); y = r.y + Math.sin(t * 1.3 + r.ph) * 18 + Math.sin(t * 6 + r.ph) * 3;
        if (r.kind === 'moth') { x += Math.cos(t * 1.7) * 26; y += Math.sin(t * 2.3) * 16; }
        var dx = x - (r.x || x);
        r.art.g.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ')');
        r.art.t.setAttribute('transform', 'rotate(' + Math.max(-25, Math.min(25, dx * 12 - dy * .4)).toFixed(1) + ') scale(' + r.sc + ')');
        r.art.g.classList.toggle('rush', speedUp > .3);
      } else if (r.kind === 'bee') {
        x = laneX(r, t * 1.6, .9); y = r.y + Math.sin(t * 2.1 + r.ph) * 24 + Math.sin(t * 9) * 2;
        var dir = x >= r.lx ? 1 : -1; r.lx = x;
        r.g.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ')');
        r.inner.setAttribute('transform', 'scale(' + dir + ' 1)');
        for (var p = 0; p < r.pts.length; p++) r.pts[p][1] -= dy * r.k;
        r.pts.push([x, y + 4]); if (r.pts.length > 34) r.pts.shift();
        r.trail.setAttribute('d', 'M' + r.pts.map(function (q) { return q[0].toFixed(1) + ' ' + q[1].toFixed(1); }).join(' L'));
      } else if (r.kind === 'leaf') {
        x = laneX(r, t, .7) + Math.sin(t * 1.4 + r.ph) * 22; y = r.y;
        r.g.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') rotate(' + (Math.sin(t * 1.4 + r.ph) * 60).toFixed(0) + ')');
      } else if (r.kind === 'seed' || r.kind === 'spore') {
        x = laneX(r, t * .6, .8) + Math.sin(t * .8 + r.ph) * 16; y = r.y;
        r.g.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') rotate(' + (Math.sin(t + r.ph) * 14).toFixed(0) + ')');
        if (r.kind === 'spore') r.g.setAttribute('opacity', (.5 + .5 * Math.sin(t * 1.2 + r.ph)).toFixed(2));
      } else { // firefly
        x = laneX(r, t * .7, .9) + Math.sin(t * 1.1 + r.ph * 3) * 14; y = r.y + Math.cos(t * .8 + r.ph) * 22;
        r.g.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ')');
        r.g.setAttribute('opacity', (.25 + .75 * Math.pow(Math.max(0, Math.sin(t * 1.3 + r.ph * 3)), 2)).toFixed(2));
      }
      r.x = x;
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) running = false;
    else if (!running) { running = true; last = 0; lastScroll = window.scrollY; requestAnimationFrame(frame); }
  });
})();
