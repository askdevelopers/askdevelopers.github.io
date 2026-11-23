// LeafPulse garden hero: builds the repeated scene parts and runs the little creatures.
// Everything is drawn in SVG (no images). Respects reduced motion and pauses when off screen.
(function () {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';
  var svg = document.getElementById('scene');
  if (!svg) return;
  var root = document.documentElement;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var INK = '#2A3A26';

  function el(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function $(id) { return document.getElementById(id); }
  function rand(a, b) { return a + Math.random() * (b - a); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function night() { return root.getAttribute('data-theme') === 'dark'; }

  // ---------- fit the 1600x900 scene to any screen, keeping the pond and tree in view ----------
  var W = 1600, H = 900;
  function fit() {
    var r = svg.getBoundingClientRect();
    if (!r.width || !r.height) return;
    var a = r.width / r.height, focus = window.innerWidth < 860 ? 905 : 800, vw, vh, x0, y0;
    if (H * a <= W) { vh = H; vw = H * a; x0 = Math.min(Math.max(focus - vw / 2, 0), W - vw); y0 = 0; }
    else { vw = W; vh = W / a; x0 = 0; y0 = H - vh; }
    svg.setAttribute('viewBox', x0.toFixed(1) + ' ' + y0.toFixed(1) + ' ' + vw.toFixed(1) + ' ' + vh.toFixed(1));
  }
  fit();
  window.addEventListener('resize', fit);

  // ---------- static, repeated parts ----------
  // sun rays
  var rays = $('rays');
  for (var i = 0; i < 12; i++) {
    var a0 = (i * 30) * Math.PI / 180, s = 0.07;
    var p1 = [960 + Math.cos(a0 - s) * 80, 135 + Math.sin(a0 - s) * 80];
    var p2 = [960 + Math.cos(a0 - s * 1.6) * 430, 135 + Math.sin(a0 - s * 1.6) * 430];
    var p3 = [960 + Math.cos(a0 + s * 1.6) * 430, 135 + Math.sin(a0 + s * 1.6) * 430];
    var p4 = [960 + Math.cos(a0 + s) * 80, 135 + Math.sin(a0 + s) * 80];
    el('path', { d: 'M' + p1 + ' L' + p2 + ' L' + p3 + ' L' + p4 + 'Z', fill: '#FFF7DA', opacity: i % 2 ? .1 : .16 }, rays);
  }

  // stars
  var stars = $('stars');
  for (i = 0; i < 70; i++) {
    var st = el('circle', { cx: rand(-100, 1700).toFixed(1), cy: rand(-200, 440).toFixed(1), r: rand(.6, 1.9).toFixed(2), fill: '#FFF9E3', class: 'star' }, stars);
    st.style.animationDelay = (-rand(0, 3)).toFixed(2) + 's';
  }

  // picket fence behind the flower bed
  var fence = $('fence');
  el('rect', { x: 136, y: 606, width: 580, height: 7, rx: 3, fill: '#E9E1CC', stroke: '#B9AE94', 'stroke-width': 1 }, fence);
  el('rect', { x: 136, y: 626, width: 580, height: 7, rx: 3, fill: '#E9E1CC', stroke: '#B9AE94', 'stroke-width': 1 }, fence);
  for (var x = 146; x < 706; x += 26) {
    var h = 4 * Math.sin(x / 40);
    el('path', { d: 'M' + x + ' 646 V' + (600 + h) + ' L' + (x + 8) + ' ' + (590 + h) + ' L' + (x + 16) + ' ' + (600 + h) + ' V646Z', fill: '#F7F1E2', stroke: '#B9AE94', 'stroke-width': 1.2 }, fence);
  }
  el('ellipse', { cx: 426, cy: 648, rx: 300, ry: 8, fill: '#2E5E2A', opacity: .18 }, fence);

  // grass tufts + tiny lawn daisies
  var tufts = $('tufts');
  for (i = 0; i < 70; i++) {
    var tx = rand(-200, 1800), ty = rand(648, 790);
    if (Math.pow((tx - 910) / 260, 2) + Math.pow((ty - 704) / 72, 2) < 1) continue;
    el('path', { d: 'M' + tx + ' ' + ty + ' q-2 -8 -6 -12 M' + tx + ' ' + ty + ' q0 -9 1 -14 M' + tx + ' ' + ty + ' q3 -7 7 -10', stroke: '#3F7F37', 'stroke-width': 1.6, 'stroke-linecap': 'round', fill: 'none', opacity: .6 }, tufts);
    if (i % 4 === 0) { el('circle', { cx: tx + 9, cy: ty - 3, r: 2.6, fill: '#FFFFFF' }, tufts); el('circle', { cx: tx + 9, cy: ty - 3, r: 1, fill: '#F2B33D' }, tufts); }
  }

  // flower bed: tulips, daisies and lavender. Each bloom is registered in `bloomers` so it can
  // open with the sun (day) and nod off (night); butterflies use `perches` to land.
  var bed = $('bed'), perches = [], bloomers = [];
  var tulipFills = ['url(#gTulA)', 'url(#gTulB)', 'url(#gTulC)'];
  function zz(parent, zx, zy, size) {
    var g = el('g', { class: 'snooze', opacity: 0 }, parent);
    var t1 = el('text', { x: zx, y: zy, 'font-size': size }, g); t1.textContent = 'z';
    var t2 = el('text', { x: zx + size * .55, y: zy - size * .7, 'font-size': size * .75 }, g); t2.textContent = 'z';
    return g;
  }
  function flower(kind, fx, fy, fh, n) {
    var g = el('g', { transform: 'translate(' + fx + ' ' + fy + ')' }, bed);
    var s = el('g', { class: 'flower' }, g);
    s.style.animationDelay = (-rand(0, 4)).toFixed(2) + 's';
    s.style.animationDuration = rand(4, 5.6).toFixed(2) + 's';
    var bend = rand(-4, 4), dir = n % 2 ? 1 : -1;
    if (kind === 'lav') {
      var lg = el('g', {}, s);
      el('use', { href: '#lavStalk', transform: 'translate(-4 0) rotate(-8) scale(' + (fh / 62) + ')' }, lg);
      el('use', { href: '#lavStalk', transform: 'scale(' + (fh / 58) + ')' }, lg);
      el('use', { href: '#lavStalk', transform: 'translate(4 0) rotate(9) scale(' + (fh / 64) + ')' }, lg);
      bloomers.push({ kind: kind, x: fx, head: lg, dir: dir, s: 1, d: 0 });
      perches.push({ x: fx, y: fy - fh - 4 });
      return;
    }
    el('path', { d: 'M0 0 Q' + bend + ' ' + (-fh / 2) + ' 0 ' + (-fh), stroke: '#3F8A3C', 'stroke-width': 3, fill: 'none', 'stroke-linecap': 'round' }, s);
    el('path', { d: 'M0 ' + (-fh * .28) + ' q' + (14 * dir) + ' -4 ' + (18 * dir) + ' -16 q' + (-12 * dir) + ' 0 ' + (-18 * dir) + ' 16', fill: '#5DA84A', stroke: '#2F6A34', 'stroke-width': .8 }, s);
    var head = el('g', {}, s), petals = el('g', {}, head), b = { kind: kind, x: fx, fh: fh, head: head, petals: petals, dir: dir, s: 1, d: 0 };
    if (kind === 'tulip') {
      el('path', { d: 'M-9 0 C-10 -14 -4 -20 0 -15 C4 -20 10 -14 9 0 C6 6 -6 6 -9 0Z', fill: tulipFills[n % 3], stroke: '#7A5A44', 'stroke-width': .9, 'stroke-opacity': .5 }, petals);
      el('path', { d: 'M-3 -12 Q-5 -4 -3 2', stroke: '#FFFFFF', 'stroke-width': 1.6, fill: 'none', opacity: .55, 'stroke-linecap': 'round' }, petals);
      perches.push({ x: fx, y: fy - fh - 14 });
    } else {
      for (var k = 0; k < 8; k++) el('ellipse', { rx: 3, ry: 7.5, transform: 'rotate(' + (k * 45) + ') translate(0 -7)', fill: '#FFFFFF', stroke: '#D9D3E6', 'stroke-width': .8 }, petals);
      el('circle', { r: 4.2, fill: '#F5B83D', stroke: '#C98A2A', 'stroke-width': .8 }, head);
      perches.push({ x: fx, y: fy - fh - 4 });
    }
    if (n % 5 === 2) b.z = zz(s, 6 * dir, -fh - 16, 11);
    bloomers.push(b);
  }
  var kinds = ['tulip', 'daisy', 'lav', 'tulip', 'daisy', 'tulip'];
  var n = 0;
  for (x = 300; x < 690; x += 30) { flower(kinds[n % 6], x + rand(-4, 4), 652, rand(42, 62), n); n++; }
  for (x = 315; x < 690; x += 34) { flower(kinds[(n + 2) % 6], x + rand(-4, 4), 672, rand(36, 52), n); n++; }

  // sunflowers standing just behind the pond: they face the sun by day and doze at night
  var sunG = $('sunflowers');
  function sunflower(sx, sy, sh, sc) {
    var g = el('g', { transform: 'translate(' + sx + ' ' + sy + ')' }, sunG);
    var s = el('g', { class: 'sway-slow' }, g);
    s.style.animationDelay = (-rand(0, 6)).toFixed(2) + 's';
    el('path', { d: 'M0 0 Q-6 ' + (-sh / 2) + ' 0 ' + (-sh), stroke: '#4C8E3E', 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round' }, s);
    el('path', { d: 'M-2 ' + (-sh * .35) + ' C-20 ' + (-sh * .35 - 4) + ' -34 ' + (-sh * .35 - 18) + ' -34 ' + (-sh * .35 - 30) + ' C-18 ' + (-sh * .35 - 28) + ' -6 ' + (-sh * .35 - 16) + ' -2 ' + (-sh * .35) + 'Z', fill: '#5DA84A', stroke: '#2F6A34', 'stroke-width': 1 }, s);
    el('path', { d: 'M1 ' + (-sh * .6) + ' C18 ' + (-sh * .6 - 4) + ' 30 ' + (-sh * .6 - 16) + ' 32 ' + (-sh * .6 - 28) + ' C16 ' + (-sh * .6 - 26) + ' 6 ' + (-sh * .6 - 14) + ' 1 ' + (-sh * .6) + 'Z', fill: '#6DB04A', stroke: '#2F6A34', 'stroke-width': 1 }, s);
    var head = el('g', {}, s), inner = el('g', { transform: 'scale(' + sc + ')' }, head), petals = el('g', {}, inner);
    for (var k = 0; k < 14; k++) el('ellipse', { rx: 6, ry: 15, transform: 'rotate(' + (k * 360 / 14) + ') translate(0 -19)', fill: 'url(#gPetal)', stroke: '#C98A2A', 'stroke-width': .8 }, petals);
    el('circle', { r: 16, fill: 'url(#gSeedHead)', stroke: '#4A2E16', 'stroke-width': 1 }, inner);
    for (k = 0; k < 9; k++) el('circle', { cx: rand(-9, 9).toFixed(1), cy: rand(-9, 9).toFixed(1), r: 1.3, fill: '#C79A5E', opacity: .8 }, inner);
    // sleepy face, only visible at night
    var face = el('g', { opacity: 0 }, inner);
    el('path', { d: 'M-9 -2 q3.5 3.5 7 0 M2 -2 q3.5 3.5 7 0', stroke: '#2A1A0C', 'stroke-width': 1.8, fill: 'none', 'stroke-linecap': 'round' }, face);
    el('path', { d: 'M-2.5 6 q2.5 2 5 0', stroke: '#2A1A0C', 'stroke-width': 1.5, fill: 'none', 'stroke-linecap': 'round' }, face);
    el('circle', { cx: -9, cy: 4, r: 2.4, fill: '#F4A08A', opacity: .7 }, face);
    el('circle', { cx: 9, cy: 4, r: 2.4, fill: '#F4A08A', opacity: .7 }, face);
    bloomers.push({ kind: 'sun', x: sx, fh: sh, sc: sc, head: head, petals: petals, face: face, z: zz(s, 22 * sc, -sh - 30 * sc, 16 * sc + 4), dir: 1, s: 1, d: 0 });
    perches.push({ x: sx - 2, y: sy - sh - 22 * sc });
  }
  sunflower(742, 650, 186, 1);
  sunflower(790, 654, 150, .85);
  sunflower(612, 640, 120, .7);

  // the pond lotus closes at night too
  bloomers.push({ kind: 'lotus', x: 800, head: $('lotus'), dir: 1, s: 1, d: 0 });

  // s = 0 open and awake, 1 closed and asleep
  function applyBloom(b) {
    var s = b.s, e = s * s * (3 - 2 * s); // smoothstep
    if (b.kind === 'lav') { b.head.setAttribute('transform', 'rotate(' + (b.dir * 12 * e).toFixed(2) + ')'); return; }
    if (b.kind === 'lotus') { b.head.setAttribute('transform', 'translate(800 690) scale(' + (1 - .5 * e).toFixed(3) + ' ' + (1 - .12 * e).toFixed(3) + ')'); return; }
    var nod, dx, dy;
    if (b.kind === 'sun') { nod = 12 * (1 - e) + 58 * e; dx = 10 * e; dy = 14 * e; }      // faces the sun, then bows its head
    else { nod = b.dir * 52 * e; dx = b.dir * 5 * e; dy = 7 * e; }
    b.head.setAttribute('transform', 'translate(' + dx.toFixed(2) + ' ' + (-b.fh + dy).toFixed(2) + ') rotate(' + nod.toFixed(2) + ')');
    if (b.kind === 'tulip') b.petals.setAttribute('transform', 'scale(' + (1 - .42 * e).toFixed(3) + ' ' + (1 + .06 * e).toFixed(3) + ')');
    else if (b.kind === 'daisy') b.petals.setAttribute('transform', 'scale(' + (1 - .5 * e).toFixed(3) + ')');
    else b.petals.setAttribute('transform', 'scale(' + (1 - .38 * e).toFixed(3) + ') rotate(' + (20 * e).toFixed(1) + ')');
    if (b.face) b.face.setAttribute('opacity', Math.max(0, (e - .4) / .6).toFixed(2));
    if (b.z) b.z.setAttribute('opacity', Math.max(0, (e - .7) / .3).toFixed(2));
  }
  bloomers.forEach(applyBloom);

  // stones around the pond rim (back ones first so front ones overlap)
  var stones = $('stones'), list = [];
  for (var ang = 0; ang < Math.PI * 2; ang += rand(.2, .3)) {
    var sy = Math.sin(ang);
    if (sy < -.55) continue;
    list.push({ x: 910 + 244 * Math.cos(ang), y: 704 + 60 * sy, rx: rand(13, 22), ry: rand(7, 10) });
  }
  list.sort(function (p, q) { return p.y - q.y; }).forEach(function (p) {
    el('ellipse', { cx: p.x.toFixed(1), cy: p.y.toFixed(1), rx: p.rx.toFixed(1), ry: p.ry.toFixed(1), fill: 'url(#gStone)', stroke: '#8C8473', 'stroke-width': .8 }, stones);
  });

  // balcony balusters + deck seams
  var bal = $('balusters');
  for (x = -280; x < 1880; x += 62) {
    el('rect', { x: x, y: 800, width: 13, height: 48, rx: 6, fill: 'url(#gBal)', stroke: '#6E4426', 'stroke-opacity': .45 }, bal);
  }
  var seams = $('deckSeams');
  el('path', { d: 'M-300 874 H1900 M-300 894 H1900', stroke: '#6E4426', 'stroke-width': 1.4, opacity: .3 }, seams);
  el('path', { d: 'M-300 860 H1900', stroke: '#FFE2BF', 'stroke-width': 1.5, opacity: .4 }, seams);

  // pothos vines hanging over the rail
  var pothos = $('pothos'), potTop = $('pothosTop');
  function heart(g, hx, hy, rot, sc, fill) {
    el('path', { d: 'M0 0 C-6 -4 -9 -10 -5 -14 C-2 -16 0 -14 0 -12 C0 -14 2 -16 5 -14 C9 -10 6 -4 0 0Z', transform: 'translate(' + hx.toFixed(1) + ' ' + hy.toFixed(1) + ') rotate(' + rot.toFixed(0) + ') scale(' + sc + ')', fill: fill, stroke: '#2F6A34', 'stroke-width': .7 }, g);
  }
  var vineX = [1062, 1096, 1134, 1172], vineLen = [104, 72, 118, 84];
  vineX.forEach(function (vx, vi) {
    var g = el('g', { class: 'vine' }, pothos);
    g.style.animationDelay = (-vi * 1.3) + 's';
    var bend = vi % 2 ? 14 : -12, L = vineLen[vi];
    var path = el('path', { d: 'M' + vx + ' 770 C' + (vx + bend) + ' ' + (790 + L * .3) + ' ' + (vx - bend) + ' ' + (780 + L * .7) + ' ' + (vx + bend * .5) + ' ' + (770 + L), stroke: '#4F8A3C', 'stroke-width': 2, fill: 'none' }, g);
    var len = path.getTotalLength();
    for (var d = 14, j = 0; d < len; d += 13, j++) {
      var pt = path.getPointAtLength(d);
      heart(g, pt.x, pt.y, (j % 2 ? 50 : -50) + 180, 1.15, j % 3 ? '#6DB04A' : '#9BCF6A');
    }
  });
  for (x = 1056; x < 1190; x += 14) heart(potTop, x, 756, rand(-30, 30), rand(1.1, 1.4), x % 28 ? '#7DBE58' : '#A6D876');

  // ---------- creatures ----------
  var flyers = $('flyers');

  // dotted doodle trails + bees
  var bees = [], beeArt = $('beeArt');
  var beeRoutes = [
    { cx: 480, cy: 590, ax: 190, ay: 46, w1: .42, w2: 1.1, ph: 0 },
    { cx: 770, cy: 470, ax: 70, ay: 60, w1: .55, w2: 1.3, ph: 2 },
    { cx: 1060, cy: 560, ax: 240, ay: 70, w1: .33, w2: .9, ph: 4 }
  ];
  beeRoutes.forEach(function (r) {
    var trail = el('path', { fill: 'none', stroke: INK, 'stroke-width': 2, 'stroke-dasharray': '.5 8', 'stroke-linecap': 'round', opacity: .3, class: 'day-only' }, flyers);
    var g = el('g', { class: 'day-only' }, flyers);
    var inner = el('g', {}, g);
    var art = beeArt.cloneNode(true); art.removeAttribute('id'); inner.appendChild(art);
    bees.push({ r: r, g: g, inner: inner, trail: trail, pts: [], lastX: 0 });
  });

  // butterflies
  var bflies = [];
  [['wLil', 1.0], ['wSun', .9], ['wPea', .95], ['wSky', .85]].forEach(function (p, idx) {
    var g = el('g', { class: 'bfly day-only' }, flyers);
    var tilt = el('g', {}, g);
    function wingSet(parent) {
      el('path', { d: 'M0 -2 C-8 -18 -26 -24 -30 -14 C-33 -6 -20 2 0 0Z', fill: 'url(#' + p[0] + ')', stroke: INK, 'stroke-width': 1.1, 'stroke-opacity': .55 }, parent);
      el('path', { d: 'M0 1 C-14 4 -24 12 -18 20 C-12 26 -4 14 0 3Z', fill: 'url(#' + p[0] + ')', stroke: INK, 'stroke-width': 1.1, 'stroke-opacity': .55 }, parent);
      el('circle', { cx: -19, cy: -12, r: 3, fill: '#FFFFFF', opacity: .8 }, parent);
      el('circle', { cx: -13, cy: 13, r: 2.2, fill: '#FFFFFF', opacity: .7 }, parent);
      el('path', { d: 'M-4 -3 C-12 -10 -20 -14 -26 -13', stroke: '#FFFFFF', 'stroke-width': 1, fill: 'none', opacity: .6 }, parent);
    }
    wingSet(el('g', { class: 'wing wl' }, tilt));
    wingSet(el('g', { transform: 'scale(-1 1)' }, el('g', { class: 'wing wr' }, tilt)));
    el('ellipse', { rx: 2.6, ry: 11, fill: '#3A3046' }, tilt);
    el('circle', { cy: -12, r: 3.2, fill: '#3A3046' }, tilt);
    el('path', { d: 'M-1 -14 Q-5 -22 -9 -24 M1 -14 Q5 -22 9 -24', stroke: '#3A3046', 'stroke-width': 1.1, fill: 'none', 'stroke-linecap': 'round' }, tilt);
    el('circle', { cx: -9, cy: -24, r: 1.4, fill: '#3A3046' }, tilt);
    el('circle', { cx: 9, cy: -24, r: 1.4, fill: '#3A3046' }, tilt);
    var b = { g: g, tilt: tilt, sc: p[1], x: rand(300, 1300), y: rand(300, 600), vx: 0, vy: 0, tx: 0, ty: 0, rest: 0, ph: rand(0, 6) };
    pickTarget(b);
    bflies.push(b);
  });
  function pickTarget(b, spot) {
    if (spot) { b.tx = spot.x; b.ty = spot.y; b.landing = true; return; }
    if (Math.random() < .65 && perches.length) { var s = pick(perches); b.tx = s.x; b.ty = s.y; b.landing = true; }
    else { b.tx = rand(260, 1500); b.ty = rand(260, 620); b.landing = false; }
  }

  // dragonfly over the pond
  var dfly = (function () {
    var g = el('g', { class: 'day-only' }, flyers), inner = el('g', {}, g);
    [-70, -110, -60, -120].forEach(function (r, k) {
      el('ellipse', { cx: k < 2 ? -2 : -8, cy: 0, rx: 13, ry: 3.2, transform: 'rotate(' + r + ' ' + (k < 2 ? -2 : -8) + ' 0) translate(0 -12)', fill: '#EAF8FF', 'fill-opacity': .6, stroke: '#7FB3C2', 'stroke-width': .8, class: 'dwing' }, inner);
    });
    el('path', { d: 'M2 0 C-8 -2 -30 -1.5 -40 0 C-30 1.5 -8 2 2 0Z', fill: '#3FA7A0', stroke: '#1F6E6A', 'stroke-width': 1 }, inner);
    el('circle', { cx: 5, cy: 0, r: 4.2, fill: '#2E8C86', stroke: '#1F6E6A', 'stroke-width': 1 }, inner);
    el('circle', { cx: 6.5, cy: -1.5, r: 1.4, fill: '#FFFFFF' }, inner);
    return { g: g, inner: inner, x: 900, y: 600, tx: 900, ty: 600, wait: 1, dir: 1 };
  })();

  // pollen motes (day) and fireflies (night)
  var motes = [];
  for (i = 0; i < 22; i++) motes.push({ e: el('circle', { r: rand(1, 2.2).toFixed(1), fill: '#FFFBE6', opacity: .75, class: 'day-only' }, flyers), x: rand(0, 1600), y: rand(200, 820), ph: rand(0, 6), sp: rand(4, 10) });
  var fireflies = [], ffG = $('fireflies');
  for (i = 0; i < 30; i++) {
    var fg = el('g', {}, ffG);
    el('circle', { r: 11, fill: 'url(#gFly)' }, fg);
    el('circle', { r: 1.8, fill: '#FFFDE0' }, fg);
    fireflies.push({ e: fg, x: rand(150, 1550), y: rand(420, 840), ph: rand(0, 6), sp: rand(.3, .8) });
  }

  // koi under the water
  var koiG = $('koi'), koi = [];
  [{ ax: 170, ay: 30, sp: .22, sc: 1 }, { ax: 120, ay: 22, sp: -.3, sc: .8 }].forEach(function (k, idx) {
    var g = el('g', { opacity: .75 }, koiG);
    el('path', { d: 'M-12 0 L-22 -7 L-19 0 L-22 7 Z', fill: '#F48C3E', class: 'koi-tail' }, g);
    el('path', { d: 'M14 0 C8 -7 -6 -7 -13 0 C-6 7 8 7 14 0Z', fill: 'url(#gKoi)' }, g);
    el('circle', { cx: 2, cy: -1.5, r: 2.4, fill: '#F27A36' }, g);
    el('circle', { cx: -5, cy: 1.5, r: 1.8, fill: '#F27A36' }, g);
    koi.push({ g: g, ax: k.ax, ay: k.ay, sp: k.sp, sc: k.sc, th: idx * 2.6 });
  });

  // ripples
  var ripG = $('ripples'), ripples = [];
  function ripple(rx, ry) {
    var a = el('ellipse', { cx: rx, cy: ry, rx: 4, ry: 1, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 2 }, ripG);
    var b = el('ellipse', { cx: rx, cy: ry, rx: 2, ry: .6, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 1.6 }, ripG);
    ripples.push({ a: a, b: b, t: 0 });
  }

  // caterpillar inching along the top rail
  var catG = $('caterpillar'), cat = { x: 600, dir: 1, dirS: 1, segs: [], n: 8 };
  for (i = cat.n - 1; i >= 1; i--) {
    var sg = el('g', {}, catG);
    el('circle', { r: 8.6, fill: 'url(#gCat)', stroke: '#3F6E2A', 'stroke-width': 1 }, sg);
    el('circle', { cx: -1.5, cy: -4, r: 1.7, fill: '#FFE27A' }, sg);
    el('path', { d: 'M-3 8 v3 M3 8 v3', stroke: '#3F6E2A', 'stroke-width': 1.4, 'stroke-linecap': 'round' }, sg);
    cat.segs[i] = sg;
  }
  var head = el('g', {}, catG), face = el('g', {}, head);
  el('path', { d: 'M2 -8 Q4 -18 9 -20 M-2 -9 Q-3 -19 -7 -21', stroke: '#3F6E2A', 'stroke-width': 1.4, fill: 'none', 'stroke-linecap': 'round' }, face);
  el('circle', { cx: 9, cy: -20, r: 2, fill: '#F2B33D' }, face);
  el('circle', { cx: -7, cy: -21, r: 2, fill: '#F2B33D' }, face);
  el('circle', { r: 10.5, fill: 'url(#gCat)', stroke: '#3F6E2A', 'stroke-width': 1.1 }, face);
  el('circle', { cx: 4.5, cy: -2.5, r: 3.6, fill: '#FFFFFF' }, face);
  el('circle', { cx: 5.4, cy: -2.2, r: 1.9, fill: '#1E2A1A', class: 'cat-eye' }, face);
  el('circle', { cx: 3, cy: 4, r: 2, fill: '#F4A08A', opacity: .65 }, face);
  el('path', { d: 'M5 4.5 Q8 7 10 4', stroke: '#2F4A22', 'stroke-width': 1.2, fill: 'none', 'stroke-linecap': 'round' }, face);
  var zz = el('text', { class: 'zz night-only', x: 10, y: -22 }, head); zz.textContent = 'z z';
  cat.segs[0] = head;

  // falling leaves from the tree
  var leaves = [];
  var midG = $('mid');
  function dropLeaf() {
    var e = el('ellipse', { rx: 6, ry: 3, fill: pick(['#9BCF6A', '#C9DB6A', '#7DBB54']), stroke: '#3E7534', 'stroke-width': .6 }, midG);
    leaves.push({ e: e, x: rand(1090, 1480), y: rand(300, 440), t: 0, ph: rand(0, 6) });
  }

  // ---------- interactions ----------
  function hide(id) { // fade a doodle hint, then remove it
    var h = $(id); if (!h || h.classList.contains('done')) return;
    h.classList.add('done'); setTimeout(function () { h.remove(); }, 1100);
  }
  function localPoint(evt, node) {
    var pt = svg.createSVGPoint(); pt.x = evt.clientX; pt.y = evt.clientY;
    return pt.matrixTransform(node.getScreenCTM().inverse());
  }
  var pondLayer = $('pondLayer'), frog = $('frog');
  $('water').addEventListener('click', function (e) {
    var p = localPoint(e, pondLayer);
    ripple(p.x, p.y);
    setTimeout(function () { ripple(p.x + 1, p.y); }, 260);
    hide('hintPond');
    croak();
  });
  $('water').style.cursor = 'pointer';
  function croak() {
    frog.classList.remove('croaking'); void frog.getBBox(); frog.classList.add('croaking');
    setTimeout(function () { frog.classList.remove('croaking'); }, 1600);
  }
  frog.addEventListener('click', function () {
    frog.classList.remove('hop'); void frog.getBBox(); frog.classList.add('hop');
    setTimeout(function () { ripple(1000, 712); ripple(1002, 713); }, 760);
    setTimeout(function () { frog.classList.remove('hop'); }, 950);
    hide('hintPond');
  });

  var can = $('can'), sprout = $('sprout'), fore = $('fore'), dropsG = $('drops'), sparkG = $('sparkles');
  var drops = [], pouring = false;
  can.setAttribute('tabindex', '0');
  function water() {
    if (pouring) return;
    pouring = true;
    hide('hintCan');
    can.classList.add('pour');
    var tip = $('spoutTip');
    setTimeout(function () {
      // spout tip (after the tilt) in the balcony layer's coordinates
      var c = svg.createSVGPoint(); c.x = +tip.getAttribute('cx'); c.y = +tip.getAttribute('cy');
      var p = c.matrixTransform(tip.parentNode.getScreenCTM()).matrixTransform(fore.getScreenCTM().inverse());
      var count = 0;
      var iv = setInterval(function () {
        for (var k = 0; k < 2; k++) {
          drops.push({ e: el('ellipse', { rx: 1.8, ry: 2.8, fill: '#A6DDF2', stroke: '#4FA3C9', 'stroke-width': .5 }, dropsG), x: p.x + rand(-2, 2), y: p.y, vx: rand(18, 34), vy: rand(-6, 6) });
        }
        if (++count > 16) {
          clearInterval(iv);
          setTimeout(function () {
            can.classList.remove('pour');
            var st = +sprout.getAttribute('data-stage');
            if (st < 3) sprout.setAttribute('data-stage', st + 1);
            sparkle(800, st >= 2 ? 764 : 790);
            if (st + 1 >= 3) setTimeout(function () { // a butterfly comes to see the new bloom
              var b = bflies[0]; b.rest = 0; pickTarget(b, { x: 800, y: 774 });
            }, 900);
            pouring = false;
          }, 500);
        }
      }, 55);
    }, 650);
  }
  can.addEventListener('click', water);
  can.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); water(); } });
  function sparkle(sx, sy) {
    var g = el('g', { class: 'sparkle', transform: 'translate(' + sx + ' ' + sy + ')' }, sparkG);
    for (var k = 0; k < 7; k++) {
      var a = k / 7 * Math.PI * 2 - Math.PI / 2, r1 = 26, r2 = 40;
      el('path', { d: 'M' + (Math.cos(a) * r1).toFixed(1) + ' ' + (Math.sin(a) * r1).toFixed(1) + ' L' + (Math.cos(a) * r2).toFixed(1) + ' ' + (Math.sin(a) * r2).toFixed(1), stroke: '#F2B33D', 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-dasharray': '14 14' }, g);
    }
    setTimeout(function () { g.remove(); }, 1100);
  }

  // ---------- parallax ----------
  var layers = Array.prototype.slice.call(svg.querySelectorAll('[data-depth]')).map(function (g) { return { g: g, d: +g.getAttribute('data-depth') }; });
  var mx = 0, my = 0, tmx = 0, tmy = 0;
  window.addEventListener('pointermove', function (e) {
    if (e.pointerType !== 'mouse') return;
    tmx = (e.clientX / window.innerWidth) * 2 - 1;
    tmy = (e.clientY / window.innerHeight) * 2 - 1;
  }, { passive: true });

  // ---------- day / night: the sun rises and the flowers open; the moon rises and they nod off ----------
  var sunRise = $('sunG'), moonRise = $('moonG');
  var cycle = { night: night(), t0: 0, sun: night() ? 1 : 1, moon: night() ? 0 : 1 };
  function ease(v) { return v * v * (3 - 2 * v); }
  function scheduleCycle() {
    cycle.night = night(); cycle.t0 = t;
    bloomers.forEach(function (b) { // wake in a wave spreading out from under the sun; fall asleep in any order
      b.d = cycle.night ? .8 + rand(0, 1.4) : 1 + Math.abs(b.x - 960) * .0018 + rand(0, .4);
    });
  }
  function settleCycle() { // no animation: jump straight to the end state
    var target = cycle.night ? 1 : 0;
    bloomers.forEach(function (b) { b.s = target; applyBloom(b); });
    cycle.sun = cycle.night ? 1 : 0; cycle.moon = cycle.night ? 0 : 1; placeSkyBodies();
  }
  function placeSkyBodies() {
    sunRise.setAttribute('transform', 'translate(0 ' + (ease(cycle.sun) * 400).toFixed(1) + ')');
    moonRise.setAttribute('transform', 'translate(0 ' + (ease(cycle.moon) * 320).toFixed(1) + ')');
  }
  function stepCycle(dt) {
    var target = cycle.night ? 1 : 0, since = t - cycle.t0, rate = dt / 1.6;
    bloomers.forEach(function (b) {
      if (since < b.d || b.s === target) return;
      b.s = target > b.s ? Math.min(target, b.s + rate) : Math.max(target, b.s - rate);
      applyBloom(b);
    });
    var sr = dt / 2.4;
    cycle.sun = cycle.night ? Math.min(1, cycle.sun + sr) : Math.max(0, cycle.sun - sr);
    cycle.moon = cycle.night ? Math.max(0, cycle.moon - sr) : Math.min(1, cycle.moon + sr);
    placeSkyBodies();
  }
  scheduleCycle();
  placeSkyBodies();
  new MutationObserver(function () {
    if (night() === cycle.night) return;
    scheduleCycle();
    if (reduce) settleCycle();
  }).observe(root, { attributes: true, attributeFilter: ['data-theme'] });

  // ---------- main loop ----------
  var t = 0, last = 0, running = true, visible = true, nextRipple = 2, nextLeaf = 3;
  function step(dt) {
    t += dt;
    var isNight = night();
    stepCycle(dt);

    // parallax
    mx += (tmx - mx) * Math.min(1, dt * 2.2); my += (tmy - my) * Math.min(1, dt * 2.2);
    for (var i = 0; i < layers.length; i++) {
      var L = layers[i];
      L.g.setAttribute('transform', 'translate(' + (-mx * L.d).toFixed(2) + ' ' + (-my * L.d * .45).toFixed(2) + ')');
    }

    if (!isNight) {
      // bees
      bees.forEach(function (b) {
        var r = b.r;
        var x = r.cx + r.ax * Math.sin(t * r.w1 + r.ph) + 14 * Math.sin(t * r.w2 * 2.3);
        var y = r.cy + r.ay * Math.sin(t * r.w2 + r.ph * 1.7) + 6 * Math.sin(t * 5);
        var dir = x >= b.lastX ? 1 : -1; b.lastX = x;
        b.g.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ')');
        b.inner.setAttribute('transform', 'scale(' + dir + ' 1) rotate(' + (Math.sin(t * 3 + r.ph) * 8).toFixed(1) + ')');
        b.pts.push(x.toFixed(1) + ' ' + (y + 4).toFixed(1));
        if (b.pts.length > 46) b.pts.shift();
        b.trail.setAttribute('d', 'M' + b.pts.join(' L'));
      });

      // butterflies
      bflies.forEach(function (b) {
        if (b.rest > 0) {
          b.rest -= dt;
          if (b.rest <= 0) { b.g.classList.remove('rest'); pickTarget(b); }
        } else {
          var dx = b.tx - b.x, dy = b.ty - b.y, dist = Math.sqrt(dx * dx + dy * dy) || 1;
          var sp = 70 * (dist < 60 ? .5 + dist / 120 : 1);
          b.vx += ((dx / dist) * sp - b.vx) * Math.min(1, dt * 1.6);
          b.vy += ((dy / dist) * sp - b.vy) * Math.min(1, dt * 1.6);
          b.x += b.vx * dt; b.y += b.vy * dt + Math.sin(t * 5 + b.ph) * 14 * dt;
          if (dist < 5) {
            if (b.landing) { b.rest = rand(2.2, 5); b.vx = b.vy = 0; b.g.classList.add('rest'); }
            else pickTarget(b);
          }
        }
        var tiltDeg = Math.max(-22, Math.min(22, b.vx * .3));
        b.g.setAttribute('transform', 'translate(' + b.x.toFixed(1) + ' ' + b.y.toFixed(1) + ')');
        b.tilt.setAttribute('transform', 'rotate(' + tiltDeg.toFixed(1) + ') scale(' + b.sc + ')');
      });

      // dragonfly: hover, then dart
      var d = dfly;
      d.wait -= dt;
      if (d.wait <= 0 && Math.abs(d.tx - d.x) < 2 && Math.abs(d.ty - d.y) < 2) {
        d.tx = rand(720, 1110); d.ty = rand(560, 650); d.wait = rand(1.4, 3.2);
        d.dir = d.tx >= d.x ? 1 : -1;
      }
      d.x += (d.tx - d.x) * Math.min(1, dt * 4); d.y += (d.ty - d.y) * Math.min(1, dt * 4);
      d.g.setAttribute('transform', 'translate(' + (d.x + Math.sin(t * 9) * .8).toFixed(1) + ' ' + (d.y + Math.cos(t * 7) * 1.2).toFixed(1) + ')');
      d.inner.setAttribute('transform', 'scale(' + d.dir + ' 1)');

      // pollen
      motes.forEach(function (m) {
        m.x += m.sp * dt; m.y += (-m.sp * .4 + Math.sin(t + m.ph) * 6) * dt;
        if (m.x > 1700) m.x = -100; if (m.y < 150) m.y = 820;
        m.e.setAttribute('cx', m.x.toFixed(1)); m.e.setAttribute('cy', m.y.toFixed(1));
      });
    } else {
      fireflies.forEach(function (f) {
        var x = f.x + Math.sin(t * f.sp + f.ph) * 40 + Math.sin(t * f.sp * 2.3) * 12;
        var y = f.y + Math.cos(t * f.sp * .8 + f.ph) * 26;
        f.e.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ')');
        f.e.setAttribute('opacity', (.35 + .65 * Math.pow(Math.max(0, Math.sin(t * 1.4 + f.ph * 3)), 2)).toFixed(2));
      });
    }

    // koi
    koi.forEach(function (k) {
      k.th += k.sp * dt;
      var x = 910 + k.ax * Math.cos(k.th), y = 704 + k.ay * Math.sin(k.th);
      var dx = -k.ax * Math.sin(k.th) * Math.sign(k.sp), dy = k.ay * Math.cos(k.th) * Math.sign(k.sp);
      var deg = Math.atan2(dy / .5, dx) * 180 / Math.PI;
      k.g.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') scale(' + k.sc + ' ' + (k.sc * .5) + ') rotate(' + deg.toFixed(1) + ')');
    });

    // ripples (some happen by themselves)
    nextRipple -= dt;
    if (nextRipple <= 0) {
      nextRipple = rand(2.4, 5);
      var a = rand(0, Math.PI * 2), rr = Math.sqrt(Math.random()) * .7;
      ripple(910 + Math.cos(a) * 230 * rr, 702 + Math.sin(a) * 52 * rr);
    }
    for (i = ripples.length - 1; i >= 0; i--) {
      var R = ripples[i]; R.t += dt / 2;
      var ra = 4 + 70 * R.t, op = Math.max(0, .75 * (1 - R.t));
      R.a.setAttribute('rx', ra.toFixed(1)); R.a.setAttribute('ry', (ra * .24).toFixed(1)); R.a.setAttribute('opacity', op.toFixed(2));
      var rb = Math.max(0, ra - 18);
      R.b.setAttribute('rx', rb.toFixed(1)); R.b.setAttribute('ry', (rb * .24).toFixed(1)); R.b.setAttribute('opacity', (op * .8).toFixed(2));
      if (R.t >= 1) { R.a.remove(); R.b.remove(); ripples.splice(i, 1); }
    }

    // caterpillar
    var speed = isNight ? 0 : 9;
    var target = cat.dir;
    cat.dirS += (target - cat.dirS) * Math.min(1, dt * 1.2);
    if (Math.abs(cat.dirS - target) < .05) cat.x += cat.dir * speed * dt;
    if (cat.x > 1010 && cat.dir === 1) cat.dir = -1;
    if (cat.x < 300 && cat.dir === -1) cat.dir = 1;
    var crawl = isNight ? 0 : 1;
    for (i = 0; i < cat.n; i++) {
      var lift = crawl * 8 * Math.pow(Math.max(0, Math.sin(t * 3.2 - i * .7)), 2);
      var sx = cat.x - cat.dirS * i * 12 * (1 - .18 * lift / 8);
      var sy = 780 - (i === 0 ? 10 : 8.6) - lift;
      cat.segs[i].setAttribute('transform', 'translate(' + sx.toFixed(1) + ' ' + sy.toFixed(1) + ')');
    }
    face.setAttribute('transform', 'scale(' + (cat.dirS >= 0 ? 1 : -1) + ' 1)');

    // water drops
    for (i = drops.length - 1; i >= 0; i--) {
      var D = drops[i];
      D.vy += 420 * dt; D.x += D.vx * dt; D.y += D.vy * dt;
      D.e.setAttribute('cx', D.x.toFixed(1)); D.e.setAttribute('cy', D.y.toFixed(1));
      if (D.y > 828) { D.e.remove(); drops.splice(i, 1); }
    }

    // falling leaves
    nextLeaf -= dt;
    if (nextLeaf <= 0 && !isNight) { nextLeaf = rand(4, 8); dropLeaf(); }
    for (i = leaves.length - 1; i >= 0; i--) {
      var F = leaves[i]; F.t += dt;
      if (F.y < 640) { F.y += 26 * dt; F.x += Math.sin(F.t * 1.6 + F.ph) * 30 * dt - 6 * dt; }
      var fade = F.y >= 640 ? Math.max(0, 1 - (F.t - F.landT) / 2.5) : 1;
      if (F.y >= 640 && F.landT === undefined) F.landT = F.t;
      F.e.setAttribute('transform', 'translate(' + F.x.toFixed(1) + ' ' + F.y.toFixed(1) + ') rotate(' + (Math.sin(F.t * 1.6 + F.ph) * 50).toFixed(0) + ')');
      F.e.setAttribute('opacity', fade.toFixed(2));
      if (fade <= 0) { F.e.remove(); leaves.splice(i, 1); }
    }
  }

  function frame(now) {
    if (!running) return;
    var dt = last ? Math.min(.05, (now - last) / 1000) : .016;
    last = now;
    step(dt);
    requestAnimationFrame(frame);
  }
  function setRunning(on) {
    if (reduce) return;
    if (on && !running) { running = true; last = 0; requestAnimationFrame(frame); }
    else if (!on) running = false;
  }

  if (reduce) {
    running = false;
    settleCycle();
    t = 2; step(0.016); // one calm still frame
  } else {
    requestAnimationFrame(frame);
    document.addEventListener('visibilitychange', function () { setRunning(!document.hidden && visible); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { visible = es[0].isIntersecting; setRunning(visible && !document.hidden); }).observe(svg);
    }
  }
})();
