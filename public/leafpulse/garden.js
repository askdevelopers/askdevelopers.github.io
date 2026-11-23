/* LeafPulse home: the living garden.
   Hero: an 18-second story painted live on canvas. A glowing seed falls on dry ground at dawn, a watering can waters it,
   the sun rises, a sprout becomes a young plant, aphids arrive and are misted off, then the plant grows into a tree while
   a wave of grass and wildflowers spreads across the dry ground; butterflies, bees and birds arrive and the app rises
   out of the meadow. Then the garden keeps living (wind, butterflies, bees, birds, pollen; fireflies at night).
   Scroll vine: a vine twines down a bamboo cane in the right margin as you read, led by a little fairy light;
   leaves unfurl, flowers open, butterflies and robins come.
   Everything is drawn here (no images), one light source, so it all belongs to the same world.
   Reduced motion: the finished garden, still. No inline scripts or styles (strict CSP). */
(function () {
  'use strict';
  var root = document.documentElement;
  var hero = document.querySelector('.hero.gd');
  if (!hero || !window.requestAnimationFrame) return;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var darkMq = window.matchMedia && matchMedia('(prefers-color-scheme: dark)');
  function isDark() { var t = root.getAttribute('data-theme'); return t ? t === 'dark' : !!(darkMq && darkMq.matches); }

  // ---------------------------------------------------------------- utilities
  var TAU = Math.PI * 2;
  function clamp(x, a, b) { a = a === undefined ? 0 : a; b = b === undefined ? 1 : b; return x < a ? a : x > b ? b : x; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function eio(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function ph(a, b, x) { return eio(clamp((x - a) / (b - a))); }
  function lin(a, b, x) { return clamp((x - a) / (b - a)); }
  function rng(seed) { var s = seed % 2147483647; if (s <= 0) s += 2147483646; return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }
  function hsl(h, s, l, a) { return 'hsla(' + h.toFixed(1) + ',' + s.toFixed(1) + '%,' + l.toFixed(1) + '%,' + (a === undefined ? 1 : a) + ')'; }
  function mixc(a, b, t) { return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)]; }
  function rgb(c, a) { return 'rgba(' + (c[0] | 0) + ',' + (c[1] | 0) + ',' + (c[2] | 0) + ',' + (a === undefined ? 1 : a) + ')'; }
  function hex(h) { h = h.replace('#', ''); return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]; }
  function noise(x) { var i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return lerp(hash(i), hash(i + 1), u) * 2 - 1; }
  function hash(i) { var x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }

  // A small offscreen canvas painted once and stamped many times.
  function sprite(w, h, ox, oy, q, paint) {
    var c = document.createElement('canvas');
    c.width = Math.max(1, Math.ceil(w * q)); c.height = Math.max(1, Math.ceil(h * q));
    var g = c.getContext('2d'); g.scale(q, q); g.translate(ox, oy); paint(g);
    return { c: c, w: w, h: h, ox: ox, oy: oy };
  }
  function put(ctx, sp, x, y, rot, sx, sy, alpha) {
    if (!sp || alpha <= 0.01 || !sx || !sy) return;
    ctx.save(); ctx.translate(x, y); if (rot) ctx.rotate(rot); ctx.scale(sx, sy);
    if (alpha < 1) ctx.globalAlpha *= alpha;
    ctx.drawImage(sp.c, -sp.ox, -sp.oy, sp.w, sp.h);
    ctx.restore();
  }

  // ---------------------------------------------------------------- painters (shared by hero and vine)
  function leafPath(g, kind, L, W) {
    g.beginPath();
    if (kind === 'heart') {
      g.moveTo(0, -L * 0.12);
      g.bezierCurveTo(W * 0.2, L * 0.06, W * 0.64, L * 0.02, W * 0.5, -L * 0.44);
      g.bezierCurveTo(W * 0.4, -L * 0.72, W * 0.12, -L * 0.88, 0, -L);
      g.bezierCurveTo(-W * 0.12, -L * 0.88, -W * 0.4, -L * 0.72, -W * 0.5, -L * 0.44);
      g.bezierCurveTo(-W * 0.64, L * 0.02, -W * 0.2, L * 0.06, 0, -L * 0.12);
    } else if (kind === 'round') {
      for (var i = 0; i <= 60; i++) {
        var a = i / 60 * TAU, rr = (L / 2) * (1 + 0.03 * Math.sin(a * 6) + 0.015 * Math.sin(a * 11));
        var x = Math.cos(a) * rr * (W / L), y = -L / 2 + Math.sin(a) * rr;
        if (i) g.lineTo(x, y); else g.moveTo(x, y);
      }
    } else {
      g.moveTo(0, 0);
      g.bezierCurveTo(W * 0.52, -L * 0.1, W * 0.64, -L * 0.58, 0, -L);
      g.bezierCurveTo(-W * 0.64, -L * 0.58, -W * 0.52, -L * 0.1, 0, 0);
    }
    g.closePath();
  }
  // A leaf pointing up from its base at (0,0): gradient from base to tip, the half away from the light in shade,
  // a warm light from the upper right, pale veins, a soft darker rim.
  function paintLeaf(g, kind, L, W, tone) {
    var h = tone[0], s = tone[1], l = tone[2];
    leafPath(g, kind, L, W);
    var lg = g.createLinearGradient(0, 0, 0, -L);
    lg.addColorStop(0, hsl(h - 4, s, l - 8));
    lg.addColorStop(0.55, hsl(h, s, l));
    lg.addColorStop(1, hsl(h + 9, s + 4, l + 7));
    g.fillStyle = lg; g.fill();
    g.save(); g.clip();
    g.fillStyle = 'rgba(8,28,6,0.17)'; g.fillRect(-W, -L * 1.2, W, L * 1.4);
    var rg = g.createRadialGradient(W * 0.32, -L * 0.74, 0, W * 0.32, -L * 0.74, L * 0.95);
    rg.addColorStop(0, 'rgba(255,250,205,0.34)'); rg.addColorStop(1, 'rgba(255,250,205,0)');
    g.fillStyle = rg; g.fillRect(-W, -L * 1.2, W * 2, L * 1.4);
    g.lineCap = 'round';
    if (kind === 'round') {
      g.strokeStyle = hsl(h + 12, s - 12, l + 20, 0.5); g.lineWidth = Math.max(0.5, L * 0.016);
      var cx = W * 0.04, cy = -L * 0.48;
      for (var i = 0; i < 9; i++) {
        var a = i / 9 * TAU + 0.3;
        g.beginPath(); g.moveTo(cx, cy);
        g.quadraticCurveTo(cx + Math.cos(a + 0.15) * L * 0.22 * (W / L), cy + Math.sin(a + 0.15) * L * 0.22, cx + Math.cos(a) * L * 0.46 * (W / L), cy + Math.sin(a) * L * 0.46);
        g.stroke();
      }
      g.fillStyle = hsl(h + 12, s - 12, l + 22, 0.7); g.beginPath(); g.arc(cx, cy, L * 0.03, 0, TAU); g.fill();
    } else {
      var b0 = kind === 'heart' ? -L * 0.12 : 0;
      g.strokeStyle = hsl(h + 10, s - 10, l + 17, 0.6); g.lineWidth = Math.max(0.6, L * 0.024);
      g.beginPath(); g.moveTo(0, b0); g.quadraticCurveTo(W * 0.03, -L * 0.5, 0, -L * 0.95); g.stroke();
      g.lineWidth = Math.max(0.35, L * 0.011); g.strokeStyle = hsl(h + 10, s - 10, l + 15, 0.32);
      for (var k = 1; k <= 5; k++) {
        var y = b0 - (L + b0) * (0.06 + k * 0.15), sp = W * 0.44 * Math.sin(Math.PI * (0.12 + k * 0.15));
        for (var d = -1; d <= 1; d += 2) { g.beginPath(); g.moveTo(0, y); g.quadraticCurveTo(d * sp * 0.5, y - L * 0.05, d * sp, y - L * 0.14); g.stroke(); }
      }
    }
    g.restore();
    leafPath(g, kind, L, W); g.strokeStyle = hsl(h, s, l - 18, 0.22); g.lineWidth = Math.max(0.4, L * 0.01); g.stroke();
  }
  function leafSprite(kind, L, W, tone, q) {
    return sprite(W * 1.1, L * 1.12, W * 0.55, L * 1.05, q, function (g) { paintLeaf(g, kind, L, W, tone); });
  }

  // Flower heads, seen slightly from above, centred on (0,0) in a box of radius R.
  function paintFlower(g, type, R) {
    var i, a;
    function petals(n, len, wid, c0, c1, rot, shape) {
      for (i = 0; i < n; i++) {
        a = rot + i / n * TAU;
        g.save(); g.rotate(a);
        var gr = g.createLinearGradient(0, 0, 0, -len);
        gr.addColorStop(0, c0); gr.addColorStop(1, c1);
        g.fillStyle = gr; g.beginPath();
        if (shape === 'notch') {
          g.moveTo(0, 0); g.bezierCurveTo(wid * 0.9, -len * 0.3, wid, -len * 0.85, wid * 0.45, -len);
          g.lineTo(0, -len * 0.9); g.lineTo(-wid * 0.45, -len);
          g.bezierCurveTo(-wid, -len * 0.85, -wid * 0.9, -len * 0.3, 0, 0);
        } else if (shape === 'round') {
          g.moveTo(0, 0); g.bezierCurveTo(wid * 1.2, -len * 0.2, wid * 1.1, -len, 0, -len); g.bezierCurveTo(-wid * 1.1, -len, -wid * 1.2, -len * 0.2, 0, 0);
        } else if (shape === 'rag') {
          g.moveTo(0, 0); g.lineTo(wid * 0.5, -len * 0.7); g.lineTo(wid, -len * 0.86); g.lineTo(wid * 0.55, -len * 0.84); g.lineTo(wid * 0.45, -len);
          g.lineTo(0, -len * 0.86); g.lineTo(-wid * 0.45, -len); g.lineTo(-wid * 0.55, -len * 0.84); g.lineTo(-wid, -len * 0.86); g.lineTo(-wid * 0.5, -len * 0.7);
        } else {
          g.ellipse(0, -len / 2, wid / 2, len / 2, 0, 0, TAU);
        }
        g.closePath(); g.fill();
        g.restore();
      }
    }
    function centre(r, c0, c1, dots) {
      var cg = g.createRadialGradient(-r * 0.3, -r * 0.3, 0, 0, 0, r);
      cg.addColorStop(0, c0); cg.addColorStop(1, c1);
      g.fillStyle = cg; g.beginPath(); g.arc(0, 0, r, 0, TAU); g.fill();
      if (dots) { g.fillStyle = dots; for (i = 0; i < 14; i++) { a = i * 2.4; var rr = r * 0.75 * Math.sqrt(i / 14); g.beginPath(); g.arc(Math.cos(a) * rr, Math.sin(a) * rr, r * 0.09, 0, TAU); g.fill(); } }
    }
    // soft shadow under every head
    g.fillStyle = 'rgba(20,40,10,0.12)'; g.beginPath(); g.arc(R * 0.06, R * 0.1, R * 0.9, 0, TAU); g.fill();
    if (type === 'daisy') {
      petals(19, R * 0.95, R * 0.2, '#E9E4D6', '#FFFFFF', 0.1);
      centre(R * 0.27, '#FFE07A', '#D89A12', 'rgba(150,90,0,0.35)');
    } else if (type === 'poppy') {
      petals(4, R * 0.98, R * 0.62, '#9E1A14', '#F0533A', 0.35, 'round');
      g.globalAlpha = 0.6; petals(4, R * 0.7, R * 0.42, '#C72A1E', '#FF7A55', 1.1, 'round'); g.globalAlpha = 1;
      g.fillStyle = 'rgba(30,8,10,0.85)'; g.beginPath(); g.arc(0, 0, R * 0.26, 0, TAU); g.fill();
      centre(R * 0.14, '#C9D6A0', '#6E7F45');
    } else if (type === 'cosmos') {
      petals(8, R * 0.96, R * 0.36, '#C9447F', '#F8B5D2', 0.2, 'notch');
      centre(R * 0.2, '#FFE277', '#C98A12', 'rgba(140,80,0,0.4)');
    } else if (type === 'butter') {
      petals(5, R * 0.9, R * 0.5, '#E5A500', '#FFE45C', 0.3, 'round');
      g.fillStyle = 'rgba(255,255,255,0.55)'; for (i = 0; i < 5; i++) { a = 0.3 + i / 5 * TAU; g.beginPath(); g.ellipse(Math.sin(a) * R * 0.5, -Math.cos(a) * R * 0.5, R * 0.1, R * 0.05, a, 0, TAU); g.fill(); }
      centre(R * 0.18, '#D8E07A', '#8D9A2A');
    } else if (type === 'corn') {
      petals(11, R * 0.95, R * 0.34, '#2F55B8', '#79A6F2', 0, 'rag');
      centre(R * 0.2, '#5B3B8C', '#2B1D47');
    } else if (type === 'glory') {          // morning glory: a trumpet with a pale star and white throat
      var gg = g.createRadialGradient(0, 0, R * 0.12, 0, 0, R);
      gg.addColorStop(0, '#FFFFFF'); gg.addColorStop(0.22, '#F4F0FF'); gg.addColorStop(0.42, '#8C8CF0'); gg.addColorStop(0.85, '#5A4FD6'); gg.addColorStop(1, '#4A38B8');
      g.fillStyle = gg; g.beginPath();
      for (i = 0; i <= 50; i++) { a = i / 50 * TAU; var r = R * (1 - 0.06 * Math.pow(Math.abs(Math.cos(a * 2.5)), 6)); if (i) g.lineTo(Math.cos(a) * r, Math.sin(a) * r); else g.moveTo(Math.cos(a) * r, Math.sin(a) * r); }
      g.fill();
      g.strokeStyle = 'rgba(255,255,255,0.45)'; g.lineWidth = R * 0.05;
      for (i = 0; i < 5; i++) { a = i / 5 * TAU - Math.PI / 2; g.beginPath(); g.moveTo(Math.cos(a) * R * 0.2, Math.sin(a) * R * 0.2); g.lineTo(Math.cos(a) * R * 0.92, Math.sin(a) * R * 0.92); g.stroke(); }
      centre(R * 0.12, '#FFF7C2', '#E8D67A');
    } else if (type === 'nast' || type === 'nastY' || type === 'nastR') {   // nasturtium
      var c = type === 'nastY' ? ['#E0A000', '#FFD54A'] : type === 'nastR' ? ['#A0201A', '#E8452E'] : ['#D2560E', '#FF9A2E'];
      petals(5, R * 0.95, R * 0.6, c[0], c[1], 0.2, 'round');
      g.strokeStyle = 'rgba(110,20,0,0.45)'; g.lineWidth = R * 0.04;
      for (i = 0; i < 5; i++) { a = 0.2 + i / 5 * TAU; g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.sin(a) * R * 0.42, -Math.cos(a) * R * 0.42); g.stroke(); }
      centre(R * 0.14, '#FFE08A', '#D08A20');
    } else if (type === 'jasmine') {
      petals(5, R * 0.95, R * 0.42, '#EFEDE4', '#FFFFFF', 0.1, 'round');
      centre(R * 0.13, '#FFF3B0', '#E2C657');
    }
  }
  function flowerSprite(type, R, q) { return sprite(R * 2.3, R * 2.3, R * 1.15, R * 1.15, q, function (g) { paintFlower(g, type, R); }); }

  // A closed bud (pointing up from (0,0)).
  function budSprite(c0, c1, q) {
    return sprite(14, 22, 7, 20, q, function (g) {
      var gr = g.createLinearGradient(0, 0, 0, -18); gr.addColorStop(0, '#4F8A2E'); gr.addColorStop(0.45, c0); gr.addColorStop(1, c1);
      g.fillStyle = gr; g.beginPath(); g.moveTo(0, 0); g.bezierCurveTo(6, -4, 5, -14, 0, -19); g.bezierCurveTo(-5, -14, -6, -4, 0, 0); g.fill();
      g.fillStyle = '#4C8A2B'; g.beginPath(); g.moveTo(0, 0); g.bezierCurveTo(5, -2, 4, -7, 1, -9); g.lineTo(0, -4); g.lineTo(-1, -9); g.bezierCurveTo(-4, -7, -5, -2, 0, 0); g.fill();
    });
  }

  // Butterfly wing (right side; the left is mirrored). Forewing + hindwing from the body at (0,0), R = wingspan/2.
  var SPECIES = [
    { a: '#F7A238', b: '#E06A1A', e: '#2A1A12', spot: '#FFFFFF' },   // painted lady
    { a: '#9FD0FF', b: '#3F7FE0', e: '#1C2A4A', spot: '#E8F4FF' },   // blue
    { a: '#FFF2A0', b: '#F2D04A', e: '#9A8420', spot: '#F59A2A' },   // brimstone
    { a: '#FFFFFF', b: '#F1EEE4', e: '#4A4A44', spot: '#3A3A36' }    // cabbage white
  ];
  function wingSprite(sp, R, q) {
    return sprite(R * 1.25, R * 2.1, R * 0.08, R * 1.05, q, function (g) {
      var fw = new Path2D();
      fw.moveTo(0, -R * 0.05); fw.bezierCurveTo(R * 0.25, -R * 0.75, R * 0.85, -R * 1.02, R * 1.08, -R * 0.86);
      fw.bezierCurveTo(R * 1.16, -R * 0.55, R * 0.88, -R * 0.12, R * 0.3, R * 0.05); fw.closePath();
      var hw = new Path2D();
      hw.moveTo(0, R * 0.02); hw.bezierCurveTo(R * 0.55, -R * 0.05, R * 0.95, R * 0.25, R * 0.78, R * 0.66);
      hw.bezierCurveTo(R * 0.62, R * 0.95, R * 0.2, R * 0.92, 0, R * 0.32); hw.closePath();
      [hw, fw].forEach(function (p, n) {
        var gr = g.createRadialGradient(0, 0, R * 0.05, 0, 0, R * 1.1);
        gr.addColorStop(0, sp.b); gr.addColorStop(0.35, sp.a); gr.addColorStop(0.78, sp.b); gr.addColorStop(1, sp.e);
        g.fillStyle = gr; g.fill(p);
        g.save(); g.clip(p);
        g.strokeStyle = 'rgba(20,10,5,0.22)'; g.lineWidth = R * 0.025;
        for (var i = 0; i < 5; i++) { var a = (n ? -1.25 : -0.4) + i * 0.32; g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.cos(a) * R * 1.2, Math.sin(a) * R * 1.2); g.stroke(); }
        g.restore();
      });
      g.fillStyle = sp.e; g.globalAlpha = 0.85;
      g.beginPath(); g.moveTo(R * 0.72, -R * 0.98); g.bezierCurveTo(R * 1.0, -R * 1.0, R * 1.16, -R * 0.7, R * 1.05, -R * 0.5); g.bezierCurveTo(R * 0.95, -R * 0.75, R * 0.85, -R * 0.88, R * 0.72, -R * 0.98); g.fill();
      g.globalAlpha = 1; g.fillStyle = sp.spot;
      [[0.92, -0.78, 0.055], [0.98, -0.64, 0.045], [0.84, -0.86, 0.04], [0.55, 0.6, 0.05]].forEach(function (d) { g.beginPath(); g.arc(R * d[0], R * d[1], R * d[2], 0, TAU); g.fill(); });
    });
  }
  function drawButterfly(ctx, b, wings, scale) {
    var flap = b.rest ? 0.25 + 0.75 * Math.abs(Math.cos(b.ph * 0.25)) : 0.12 + 0.88 * Math.abs(Math.cos(b.ph));
    ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.rot); ctx.scale(scale, scale);
    var w = wings[b.sp];
    put(ctx, w, 0, 0, 0, flap, 1, 1);
    put(ctx, w, 0, 0, 0, -flap, 1, 1);
    ctx.fillStyle = '#2A2118'; ctx.beginPath(); ctx.ellipse(0, 0, 1.3, 6.2, 0, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(0, -6.4, 1.5, 0, TAU); ctx.fill();
    ctx.strokeStyle = '#2A2118'; ctx.lineWidth = 0.45;
    ctx.beginPath(); ctx.moveTo(-0.5, -7.5); ctx.quadraticCurveTo(-2, -10, -2.6, -12); ctx.moveTo(0.5, -7.5); ctx.quadraticCurveTo(2, -10, 2.6, -12); ctx.stroke();
    ctx.restore();
  }

  // A small flying bird in profile; the wing angle comes from the flap phase.
  function drawFlyingBird(ctx, x, y, size, phase, dir, col) {
    var w = Math.sin(phase);
    ctx.save(); ctx.translate(x, y); ctx.scale(dir * size, size); ctx.fillStyle = col;
    ctx.beginPath(); ctx.ellipse(0, 0, 1.15, 0.34, -0.05, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(1.05, -0.1, 0.32, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.moveTo(1.33, -0.12); ctx.lineTo(1.62, -0.04); ctx.lineTo(1.33, 0.02); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-0.9, -0.05); ctx.lineTo(-2.1, -0.35); ctx.lineTo(-1.62, 0.02); ctx.lineTo(-2.1, 0.36); ctx.lineTo(-0.9, 0.1); ctx.fill();
    var ty = -w * 2.3, tx = -0.55 + Math.abs(w) * 0.2;
    ctx.beginPath(); ctx.moveTo(0.45, -0.12); ctx.quadraticCurveTo(0.1, ty * 0.55 - 0.2, tx, ty); ctx.quadraticCurveTo(-0.1, ty * 0.45, -0.35, 0.05); ctx.fill();
    ctx.globalAlpha *= 0.7;
    ctx.beginPath(); ctx.moveTo(0.3, -0.1); ctx.quadraticCurveTo(0.1, ty * 0.4 - 0.1, tx + 0.35, ty * 0.75); ctx.quadraticCurveTo(0, ty * 0.3, -0.2, 0); ctx.fill();
    ctx.restore();
  }

  // A robin perched (feet at 0,0), about 30 units tall at size 1.
  function drawRobin(ctx, x, y, size, dir, st) {
    ctx.save(); ctx.translate(x, y - (st.hop || 0)); ctx.scale(dir * size, size);
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#8C6A4A'; ctx.lineWidth = 0.9;
    ctx.beginPath(); ctx.moveTo(-1, -4); ctx.lineTo(-1.6, 0); ctx.moveTo(1.6, -4); ctx.lineTo(1.8, 0); ctx.stroke();
    ctx.save(); ctx.translate(-6, -8); ctx.rotate((st.tail || 0) - 0.35);
    ctx.fillStyle = '#5E4C37'; ctx.beginPath(); ctx.moveTo(0, -1.5); ctx.lineTo(-9, 1); ctx.lineTo(-9, 3.6); ctx.lineTo(0, 2.4); ctx.fill();
    ctx.restore();
    var bg = ctx.createLinearGradient(0, -16, 0, -2); bg.addColorStop(0, '#8A7556'); bg.addColorStop(1, '#6B583F');
    ctx.fillStyle = bg; ctx.beginPath(); ctx.ellipse(0, -9, 8.6, 6.6, -0.18, 0, TAU); ctx.fill();
    ctx.fillStyle = '#F1E9DC'; ctx.beginPath(); ctx.ellipse(1.8, -5.6, 6, 3.6, -0.1, 0, TAU); ctx.fill();
    var br = ctx.createRadialGradient(4.2, -10.5, 0.5, 4.6, -9.6, 6.2); br.addColorStop(0, '#F28A48'); br.addColorStop(1, '#C9541F');
    ctx.fillStyle = br; ctx.beginPath(); ctx.ellipse(4.6, -9.6, 4.8, 5, 0.1, 0, TAU); ctx.fill();
    ctx.fillStyle = '#6A573D'; ctx.beginPath(); ctx.ellipse(-2.2, -10, 6.4, 3.8, -0.3, 0, TAU); ctx.fill();
    ctx.strokeStyle = 'rgba(40,28,18,0.35)'; ctx.lineWidth = 0.45;
    ctx.beginPath(); ctx.moveTo(-6.5, -9.2); ctx.lineTo(1.5, -10.6); ctx.moveTo(-6.2, -7.8); ctx.lineTo(1, -8.8); ctx.stroke();
    ctx.save(); ctx.translate(5.6, -14.4); ctx.rotate(st.tilt || 0);
    ctx.fillStyle = '#7A6548'; ctx.beginPath(); ctx.arc(0, 0, 4.3, 0, TAU); ctx.fill();
    ctx.fillStyle = '#E2733A'; ctx.beginPath(); ctx.ellipse(1.6, 1.2, 3, 2.7, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = '#16110C'; ctx.beginPath(); ctx.arc(1.9, -0.6, 0.95, 0, TAU); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.beginPath(); ctx.arc(2.2, -0.95, 0.3, 0, TAU); ctx.fill();
    ctx.fillStyle = '#2A221A'; var o = st.beak || 0;
    ctx.beginPath(); ctx.moveTo(3.9, -0.4 - o); ctx.lineTo(6.6, 0.1); ctx.lineTo(3.9, 0.5); ctx.fill();
    if (o > 0.05) { ctx.beginPath(); ctx.moveTo(3.9, 0.5); ctx.lineTo(6.2, 0.9 + o); ctx.lineTo(3.9, 1.1); ctx.fill(); }
    ctx.restore();
    ctx.restore();
  }

  function drawAphid(ctx, x, y, size, rot) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(size, size);
    ctx.strokeStyle = 'rgba(40,60,20,0.8)'; ctx.lineWidth = 0.22; ctx.lineCap = 'round';
    ctx.beginPath();
    for (var i = -1; i <= 1; i++) { ctx.moveTo(-0.6, i * 0.7); ctx.lineTo(-1.8, i * 0.9 + 0.3); ctx.moveTo(0.6, i * 0.7); ctx.lineTo(1.8, i * 0.9 + 0.3); }
    ctx.moveTo(-0.3, -1.9); ctx.quadraticCurveTo(-1.2, -3, -1.6, -3.8); ctx.moveTo(0.3, -1.9); ctx.quadraticCurveTo(1.2, -3, 1.6, -3.8);
    ctx.stroke();
    var gr = ctx.createRadialGradient(-0.4, -0.5, 0.1, 0, 0, 2.2); gr.addColorStop(0, '#E8F5A8'); gr.addColorStop(1, '#7FA63A');
    ctx.fillStyle = gr; ctx.beginPath(); ctx.ellipse(0, 0.3, 1.25, 1.8, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = '#5E7D2A'; ctx.beginPath(); ctx.ellipse(0, -1.6, 0.7, 0.6, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = '#2E2A20'; ctx.beginPath(); ctx.arc(-0.35, -1.75, 0.16, 0, TAU); ctx.arc(0.35, -1.75, 0.16, 0, TAU); ctx.fill();
    ctx.restore();
  }

  function drawBee(ctx, b, scale) {
    ctx.save(); ctx.translate(b.x, b.y); ctx.scale(scale * b.dir, scale);
    var wf = 0.45 + 0.55 * Math.abs(Math.sin(b.ph * 5));
    ctx.fillStyle = 'rgba(235,245,255,0.55)';
    ctx.beginPath(); ctx.ellipse(-0.4, -2.2 * wf, 1.4, 2.6 * wf, -0.5, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(0.6, -2 * wf, 1.1, 2.2 * wf, 0.3, 0, TAU); ctx.fill();
    var gr = ctx.createLinearGradient(0, -1.6, 0, 1.6); gr.addColorStop(0, '#FFD45A'); gr.addColorStop(1, '#C98A10');
    ctx.fillStyle = gr; ctx.beginPath(); ctx.ellipse(0, 0, 2.7, 1.7, 0, 0, TAU); ctx.fill();
    ctx.save(); ctx.beginPath(); ctx.ellipse(0, 0, 2.7, 1.7, 0, 0, TAU); ctx.clip();
    ctx.fillStyle = '#2A2016'; ctx.fillRect(-1.6, -2, 0.7, 4); ctx.fillRect(-0.1, -2, 0.7, 4); ctx.fillRect(-2.9, -2, 0.6, 4);
    ctx.restore();
    ctx.fillStyle = '#2A2016'; ctx.beginPath(); ctx.arc(2.8, -0.1, 1.05, 0, TAU); ctx.fill();
    ctx.restore();
  }

  // Galvanised watering can, body centre at (0,0), spout to the right (+x), units ~ px at scale 1.
  function paintCan(g) {
    var steel = function (x0, x1) {
      var gr = g.createLinearGradient(x0, 0, x1, 0);
      gr.addColorStop(0, '#5D6B6C'); gr.addColorStop(0.18, '#9EACAC'); gr.addColorStop(0.36, '#E4EBE9'); gr.addColorStop(0.55, '#A6B3B3'); gr.addColorStop(0.85, '#7A8889'); gr.addColorStop(1, '#5A6768');
      return gr;
    };
    g.lineCap = 'round'; g.lineJoin = 'round';
    // spout
    g.fillStyle = steel(20, 60);
    g.beginPath(); g.moveTo(22, 14); g.lineTo(80, -34); g.lineTo(84, -29); g.lineTo(27, 22); g.closePath(); g.fill();
    g.strokeStyle = 'rgba(255,255,255,0.55)'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(25, 13); g.lineTo(80, -32); g.stroke();
    // rose (sprinkler head)
    g.save(); g.translate(84, -34); g.rotate(-0.7);
    var rg = g.createLinearGradient(0, -9, 0, 9); rg.addColorStop(0, '#C7D0CF'); rg.addColorStop(1, '#6C7979');
    g.fillStyle = rg; g.beginPath(); g.moveTo(-5, -3); g.lineTo(4, -9); g.lineTo(4, 9); g.lineTo(-5, 3); g.closePath(); g.fill();
    g.fillStyle = '#B9C4C3'; g.beginPath(); g.ellipse(4.5, 0, 2.4, 9, 0, 0, TAU); g.fill();
    g.fillStyle = 'rgba(40,50,50,0.55)'; for (var i = 0; i < 9; i++) { g.beginPath(); g.arc(4.8, -6 + i * 1.5, 0.45, 0, TAU); g.fill(); }
    g.restore();
    // back grip
    g.strokeStyle = steel(-44, -30); g.lineWidth = 5;
    g.beginPath(); g.moveTo(-30, -18); g.bezierCurveTo(-46, -16, -46, 14, -30, 16); g.stroke();
    // body
    g.fillStyle = steel(-32, 32);
    g.beginPath(); g.moveTo(-31, -24); g.lineTo(31, -24); g.lineTo(33, 22); g.quadraticCurveTo(33, 27, 28, 27); g.lineTo(-28, 27); g.quadraticCurveTo(-33, 27, -33, 22); g.closePath(); g.fill();
    // ribs
    g.strokeStyle = 'rgba(255,255,255,0.45)'; g.lineWidth = 1.2;
    g.beginPath(); g.moveTo(-32, -10); g.lineTo(32, -10); g.moveTo(-33, 16); g.lineTo(33, 16); g.stroke();
    g.strokeStyle = 'rgba(30,40,40,0.35)';
    g.beginPath(); g.moveTo(-32, -8.6); g.lineTo(32, -8.6); g.moveTo(-33, 17.4); g.lineTo(33, 17.4); g.stroke();
    // rim + opening
    g.fillStyle = '#C9D2D1'; g.beginPath(); g.ellipse(0, -24, 31, 5.5, 0, 0, TAU); g.fill();
    g.fillStyle = '#3E4848'; g.beginPath(); g.ellipse(-6, -24, 20, 3.4, 0, 0, TAU); g.fill();
    // top handle
    g.strokeStyle = steel(-30, 20); g.lineWidth = 4.6;
    g.beginPath(); g.moveTo(-24, -25); g.bezierCurveTo(-22, -58, 14, -58, 18, -25); g.stroke();
    g.strokeStyle = 'rgba(255,255,255,0.5)'; g.lineWidth = 1;
    g.beginPath(); g.moveTo(-21, -30); g.bezierCurveTo(-19, -53, 11, -53, 15, -30); g.stroke();
  }
  // Trigger spray bottle; base centre at (0,0), nozzle pointing left at (-31,-69).
  function paintBottle(g) {
    var bg = g.createLinearGradient(-14, 0, 14, 0);
    bg.addColorStop(0, 'rgba(205,220,214,0.95)'); bg.addColorStop(0.3, 'rgba(250,253,251,0.95)'); bg.addColorStop(1, 'rgba(185,202,196,0.95)');
    g.fillStyle = bg;
    g.beginPath(); g.moveTo(-13, -46); g.quadraticCurveTo(-14, -50, -8, -55); g.lineTo(8, -55); g.quadraticCurveTo(14, -50, 13, -46);
    g.lineTo(13, -6); g.quadraticCurveTo(13, 0, 7, 0); g.lineTo(-7, 0); g.quadraticCurveTo(-13, 0, -13, -6); g.closePath(); g.fill();
    g.save(); g.clip();
    var lq = g.createLinearGradient(-13, 0, 13, 0); lq.addColorStop(0, 'rgba(96,170,138,0.55)'); lq.addColorStop(0.35, 'rgba(160,215,190,0.5)'); lq.addColorStop(1, 'rgba(80,150,120,0.6)');
    g.fillStyle = lq; g.fillRect(-14, -30, 28, 31);
    g.fillStyle = 'rgba(200,240,220,0.7)'; g.beginPath(); g.ellipse(0, -30, 13, 2, 0, 0, TAU); g.fill();
    g.fillStyle = 'rgba(255,255,255,0.6)'; g.fillRect(-8, -48, 3, 44);
    g.restore();
    g.fillStyle = '#2F6A34'; g.fillRect(-8, -63, 16, 9);
    g.fillStyle = 'rgba(255,255,255,0.25)'; for (var i = 0; i < 5; i++) g.fillRect(-7 + i * 3.2, -62, 1, 7);
    var hg = g.createLinearGradient(0, -76, 0, -62); hg.addColorStop(0, '#F7F7F2'); hg.addColorStop(1, '#C9CCC2');
    g.fillStyle = hg;
    g.beginPath(); g.moveTo(9, -63); g.lineTo(9, -73); g.quadraticCurveTo(9, -77, 4, -77); g.lineTo(-24, -74); g.lineTo(-29, -72); g.lineTo(-31, -72);
    g.lineTo(-31, -66); g.lineTo(-25, -66); g.lineTo(-12, -63); g.closePath(); g.fill();
    g.fillStyle = '#2F6A34'; g.fillRect(-33, -72, 3.5, 6.5);
    g.strokeStyle = '#2F6A34'; g.lineWidth = 4; g.lineCap = 'round';
    g.beginPath(); g.moveTo(-13, -64); g.quadraticCurveTo(-21, -58, -19, -46); g.stroke();
  }

  // Soft glow dots (stamped with 'lighter' for light, normal for mist).
  function glowSprite(col, q) {
    return sprite(20, 20, 10, 10, q, function (g) {
      var gr = g.createRadialGradient(0, 0, 0, 0, 0, 10); gr.addColorStop(0, rgb(col, 1)); gr.addColorStop(0.25, rgb(col, 0.55)); gr.addColorStop(1, rgb(col, 0));
      g.fillStyle = gr; g.beginPath(); g.arc(0, 0, 10, 0, TAU); g.fill();
    });
  }
  function starSprite(q) {
    return sprite(20, 20, 10, 10, q, function (g) {
      var gr = g.createRadialGradient(0, 0, 0, 0, 0, 6); gr.addColorStop(0, 'rgba(255,255,240,1)'); gr.addColorStop(1, 'rgba(255,240,180,0)');
      g.fillStyle = gr; g.beginPath(); g.arc(0, 0, 6, 0, TAU); g.fill();
      g.fillStyle = 'rgba(255,255,235,0.95)';
      g.beginPath(); g.moveTo(0, -10); g.quadraticCurveTo(0.8, -0.8, 10, 0); g.quadraticCurveTo(0.8, 0.8, 0, 10); g.quadraticCurveTo(-0.8, 0.8, -10, 0); g.quadraticCurveTo(-0.8, -0.8, 0, -10); g.fill();
    });
  }

  // Shared sprite library (built once; quality q covers the hero's close-up zoom).
  var LIB = null;
  function lib() {
    if (LIB) return LIB;
    var q = Math.min(3, (window.devicePixelRatio || 1) * 1.5);
    var Q = Math.min(6, (window.devicePixelRatio || 1) * 3);
    LIB = {
      treeLeaf: [[96, 40, 22], [104, 46, 30], [88, 50, 38], [80, 56, 48]].map(function (t) { return leafSprite('ovate', 12, 7, t, q); }),
      big: [[100, 46, 34], [96, 50, 38], [104, 44, 31]].map(function (t) { return leafSprite('ovate', 60, 34, t, Q); }),
      sick: leafSprite('ovate', 60, 34, [62, 44, 44], Q),
      coty: leafSprite('round', 18, 14, [92, 48, 40], Q),
      heart: [[104, 42, 32], [96, 46, 38], [110, 38, 28]].map(function (t) { return leafSprite('heart', 40, 38, t, q * 1.4); }),
      round: [[120, 26, 40], [112, 30, 46]].map(function (t) { return leafSprite('round', 40, 40, t, q * 1.4); }),
      flowers: {},
      buds: { glory: budSprite('#7E78D8', '#C8C4F5', q * 1.4), nast: budSprite('#E8862A', '#F7C46A', q * 1.4), jasmine: budSprite('#E8E6DA', '#FFFFFF', q * 1.4), pink: budSprite('#D86A9A', '#F8C0D6', q * 1.4) },
      wings: SPECIES.map(function (sp) { return wingSprite(sp, 12, q * 1.6); }),
      can: sprite(140, 100, 50, 62, Q * 0.8, paintCan),
      bottle: sprite(48, 82, 36, 80, Q * 0.8, paintBottle),
      glowW: glowSprite([255, 255, 255], 2),
      glowG: glowSprite([255, 226, 150], 2),
      glowF: glowSprite([200, 255, 140], 2),
      star: starSprite(2)
    };
    ['daisy', 'poppy', 'cosmos', 'butter', 'corn', 'glory', 'nast', 'nastY', 'nastR', 'jasmine'].forEach(function (t) { LIB.flowers[t] = flowerSprite(t, 12, q * 1.6); });
    return LIB;
  }

  // Wind: two slow waves plus a gust that rolls across the meadow every few seconds.
  function wind(x, t) {
    var gx = ((t * 160) % 2600) - 600;
    return 0.16 * Math.sin(t * 1.15 + x * 0.006) + 0.09 * Math.sin(t * 0.63 + x * 0.013 + 1.3) + 0.34 * Math.exp(-Math.pow((x - gx) / 220, 2));
  }

  // Tiny particle system (seed sparkles, water, mist, falling aphids, fairy dust, pollen).
  function Particles() { this.list = []; }
  Particles.prototype.add = function (p) { if (this.list.length < 1400) this.list.push(p); };
  Particles.prototype.step = function (dt) {
    var L = this.list, out = [];
    for (var i = 0; i < L.length; i++) {
      var p = L[i];
      p.age += dt; if (p.age >= p.life) continue;
      var drag = p.drag ? Math.pow(p.drag, dt * 60) : 1;
      p.vx *= drag; p.vy = p.vy * drag + (p.g || 0) * dt;
      p.px = p.x; p.py = p.y; p.x += p.vx * dt; p.y += p.vy * dt;
      if (p.spin) p.rot += p.spin * dt;
      if (p.hit && p.hit(p)) continue;
      out.push(p);
    }
    this.list = out;
  };

  // =================================================================== HERO
  var back = hero.querySelector('.gd-back'), front = hero.querySelector('.gd-front');
  var stage = hero.querySelector('.hero-stage'), clip = hero.querySelector('.hp-clip'), phone = hero.querySelector('.hp-phone');
  var growBtn = document.getElementById('growBtn');
  var bctx = back && back.getContext('2d'), fctx = front && front.getContext('2d');
  if (!bctx || !fctx) return;

  var T = {
    seed0: 0.5, seed1: 2.3,
    can0: 2.3, can1: 3.2, tilt0: 3.1, tilt1: 3.6, pour0: 3.55, pour1: 5.0, out0: 5.0, out1: 5.9,
    sun0: 4.4, sun1: 7.6,
    spr0: 5.7, spr1: 7.5, yng0: 7.3, yng1: 9.4,
    aph0: 9.1, aph1: 10.2, bot0: 10.1, bot1: 10.8, puff1: 10.9, puff2: 11.5, bout0: 12.0, bout1: 12.7, perk0: 11.9, perk1: 12.6,
    tree0: 12.6, tree1: 15.9, cam0: 12.3, cam1: 15.9, wave0: 12.8, wave1: 16.6,
    bf: 13.9, birds: 14.4, ph0: 15.3, ph1: 16.8, copy: 16.6, end: 18.2
  };
  var playing = root.classList.contains('lp-intro');
  var st = playing ? 0 : T.end;          // story time
  var amb = 0;                            // ambient time
  var S = {};                             // layout + scene
  var P = null;                           // palette
  var parts = new Particles(), fparts = new Particles();
  var cuesFired = {};
  var visible = true, raf = 0, last = 0;

  function palette(dark) {
    return dark ? {
      dark: true,
      skyDawn: [hex('#05101A'), hex('#0E1E2A'), hex('#1A2E33')], skyDay: [hex('#081521'), hex('#13283A'), hex('#27434A')],
      sunCol: [210, 230, 255], far: ['#1A2C33', '#1C3136'], tree: [150, 18, 15], treeLit: [130, 22, 24],
      mfar: hex('#22382E'), mnear: hex('#18301F'), mfg: hex('#10241A'), dfar: hex('#38372E'), dnear: hex('#2E2B23'), dfg: hex('#24211B'),
      grassL: [12, 26], flowerA: 0.7, bark: ['#1E1611', '#3A2C21'], haze: 'rgba(60,90,110,', grade: null, night: [150, 170, 200]
    } : {
      dark: false,
      skyDawn: [hex('#5C6E96'), hex('#D6A9A2'), hex('#F7CFA0')], skyDay: [hex('#8FBFD6'), hex('#D3E7E6'), hex('#F8ECCB')],
      sunCol: [255, 236, 190], far: ['#A9BFBC', '#94B0A3'], tree: [128, 20, 48], treeLit: [88, 30, 64],
      mfar: hex('#B4C98A'), mnear: hex('#77A346'), mfg: hex('#4C7A2C'), dfar: hex('#DCCBA6'), dnear: hex('#C6A97E'), dfg: hex('#A98A60'),
      grassL: [24, 46], flowerA: 1, bark: ['#3A2A1E', '#7A5B3E'], haze: 'rgba(250,244,226,', grade: [150, 112, 140]
    };
  }

  // ---- layout: everything is placed from the DOM (phone column) so canvas and HTML agree
  function layout() {
    var dpr = Math.min(window.devicePixelRatio || 1, hero.clientWidth > 1000 ? 1.5 : 2);
    var W = hero.clientWidth, mobile = W <= 820;
    var hr = hero.getBoundingClientRect(), cr = clip.getBoundingClientRect(), sr = stage.getBoundingClientRect();
    var H = mobile ? Math.round(sr.bottom - hr.top + 26) : hero.clientHeight;
    [back, front].forEach(function (c) { c.width = Math.round(W * dpr); c.height = Math.round(H * dpr); c.style.height = H + 'px'; });
    var gy = cr.bottom - hr.top;
    var s = mobile ? clamp(H / 640, 0.55, 0.9) : clamp(H / 880, 0.72, 1.15);
    var tx = mobile ? W * 0.8 : Math.min(W - 150 * s, cr.right - hr.left + 125 * s);
    var hz = mobile ? gy - H * 0.36 : gy - H * 0.3;
    var TH = gy - H * (mobile ? 0.16 : 0.2);
    S = { W: W, H: H, dpr: dpr, mobile: mobile, s: s, gy: gy, hz: hz, tx: tx, TH: TH,
      clip: { l: cr.left - hr.left, r: cr.right - hr.left, t: cr.top - hr.top, b: gy, w: cr.width, h: cr.height },
      Z0: mobile ? 1.8 : 2.05, A0: [W / 2, H * (mobile ? 0.64 : 0.68)], F0: [tx, gy - 70 * s] };
    var R = rng(7);
    S.Rmax = Math.hypot(Math.max(tx, W - tx) + 80, (H - hz) / 0.32) + 120;
    function arrive(x, y) { var d = Math.hypot(x - tx, (y - gy) / 0.32); return T.wave0 + (T.wave1 - T.wave0 - 0.6) * Math.pow(clamp(d / S.Rmax), 0.72); }
    // grass blades, back to front
    var n = Math.round((mobile ? 650 : 1500) * clamp(W / 1440, 0.5, 1.2)), blades = [];
    for (var i = 0; i < n; i++) {
      var u = R(), y = hz + 4 + (H + 12 - hz) * Math.pow(u, 0.9), k = (y - hz) / (gy - hz);
      var x = -20 + R() * (W + 40);
      var hgt = s * (5 + 44 * Math.pow(k, 1.35)) * (0.6 + R() * 0.75);
      blades.push({ x: x, y: y, h: hgt, w: s * (0.9 + 2.6 * k) * (0.8 + R() * 0.5), lean: (R() - 0.5) * 0.5, flex: 0.6 + R() * 0.6, c: R() < 0.5 ? 0 : 1, ta: arrive(x, y), dry: R() < 0.12 });
    }
    blades.sort(function (a, b) { return a.y - b.y; });
    S.blades = blades;
    // wildflowers
    var types = ['daisy', 'daisy', 'poppy', 'cosmos', 'butter', 'corn', 'daisy', 'cosmos', 'poppy'];
    var fl = [], nf = Math.round((mobile ? 38 : 95) * clamp(W / 1440, 0.5, 1.2));
    for (i = 0; i < nf; i++) {
      y = hz + 10 + (H - hz) * Math.pow(R(), 0.8); k = (y - hz) / (gy - hz);
      x = R() * W;
      if (!mobile && x < W * 0.45 && y < gy - 10 && R() < 0.6) x = W * 0.45 + R() * W * 0.55;  // fewer behind the headline
      fl.push({ x: x, y: y, k: k, h: s * (14 + 40 * Math.pow(k, 1.2)) * (0.7 + R() * 0.6), type: types[(R() * types.length) | 0], ta: arrive(x, y) + 0.35 + R() * 0.3, lean: (R() - 0.5) * 0.3, lav: R() < 0.12 });
    }
    fl.sort(function (a, b) { return a.y - b.y; });
    S.flowers = fl;
    // pebbles and cracks on the dry ground round the seed
    S.pebbles = []; for (i = 0; i < 30; i++) { var a = R() * TAU, r = (40 + R() * 320) * s; S.pebbles.push({ x: tx + Math.cos(a) * r, y: gy + Math.sin(a) * r * 0.28, r: s * (1 + R() * 2.4), c: 120 + R() * 40 }); }
    S.blotch = []; for (i = 0; i < 40; i++) { a = R() * TAU; r = R() * 700 * s; S.blotch.push({ x: tx + Math.cos(a) * r * 1.6, y: gy + Math.sin(a) * r * 0.3, r: (60 + R() * 160) * s, dark: R() < 0.5 }); }
    S.cracks = []; for (i = 0; i < 14; i++) { a = R() * TAU; r = (60 + R() * 260) * s; var pts = [], cx = tx + Math.cos(a) * r, cy = gy + Math.sin(a) * r * 0.28; for (var j = 0; j < 4; j++) { pts.push([cx, cy]); cx += (R() - 0.5) * 40 * s; cy += (R() - 0.5) * 7 * s; } S.cracks.push(pts); }
    // tree
    S.tree = makeTree(rng(21));
    // phone vines
    S.pv = makePhoneVines(rng(5));
    S.layers = null; // rebuilt lazily for the theme
    S.bees = [mkBee(0), mkBee(1)];
    if (!S.flies) S.flies = [0, 1, 2, 3].map(mkFly);
    S.flock = null; S.nextFlock = T.birds;
    S.motes = []; for (i = 0; i < (mobile ? 18 : 34); i++) S.motes.push({ x: R() * W, y: R() * gy, ph: R() * TAU, sp: 0.4 + R() * 0.8, r: 0.6 + R() * 1.2 });
    S.clouds = []; for (i = 0; i < 4; i++) S.clouds.push({ x: R() * W, y: hz * (0.12 + R() * 0.4), w: (160 + R() * 180) * s, v: 3 + R() * 5, seed: 11 + i });
  }

  // ---- the tree: branches grow in turn; leaf clumps open at the outer branches
  function makeTree(R) {
    var nodes = [];
    function br(parent, ang, len, w, depth, birth) {
      var n = { parent: parent, ang: ang, len: len, w: w, depth: depth, birth: birth, dur: 0.19, kids: [], bend: (R() - 0.5) * 0.3, sway: R() * TAU };
      nodes.push(n);
      if (depth < 5) {
        var k = depth === 0 ? 3 : (R() < 0.3 ? 3 : 2);
        for (var i = 0; i < k; i++) {
          var spread = (depth === 0 ? 0.62 : 0.42 + R() * 0.25);
          var a = ang + (k === 2 ? (i ? 1 : -1) * spread * (0.7 + R() * 0.5) : (i - 1) * spread) + (R() - 0.5) * 0.22;
          a = lerp(a, -Math.PI / 2, depth < 2 ? 0.08 : 0.0);
          n.kids.push(br(n, a, len * (0.7 + R() * 0.14), w * 0.62, depth + 1, birth + 0.155));
        }
      }
      if (depth >= 3) n.clumps = depth === 5 ? 2 : 1;
      return n;
    }
    var trunk = br(null, -Math.PI / 2 - 0.04, 0.34, 0.07, 0, 0);
    trunk.bend = 0.05;
    var clumps = [];
    nodes.forEach(function (n) {
      for (var c = 0; c < (n.clumps || 0); c++) clumps.push({ n: n, f: c ? 0.55 : 1, r: 0.07 + R() * 0.05, v: (R() * 6) | 0, rot: R() * TAU, dx: (R() - 0.5) * 0.04, dy: (R() - 0.5) * 0.04 });
    });
    // big soft masses behind, so the crown reads as a crown and not as dots
    var mass = []; for (var i = 0; i < 9; i++) mass.push({ a: -Math.PI / 2 + (R() - 0.5) * 2.2, r: 0.2 + R() * 0.16, s: 0.16 + R() * 0.08, v: (R() * 6) | 0 });
    return { nodes: nodes, trunk: trunk, clumps: clumps, mass: mass };
  }

  // Foliage clumps: dozens of small leaves over a dark core. Variants 0-2 are the shaded body of a clump,
  // 3-5 its sunlit cap; drawn as a pair (cap nudged towards the light) they give each clump volume.
  function clumpSprites(dark) {
    var L = lib(), out = [], q = Math.min(2, (window.devicePixelRatio || 1));
    for (var v = 0; v < 6; v++) {
      var lit = v >= 3, R = rng(100 + v);
      out.push(sprite(120, 120, 60, 60, q, function (g) {
        var core = g.createRadialGradient(4, 6, 4, 0, 0, 50);
        var c0 = dark ? 'rgba(6,18,12,0.95)' : lit ? 'rgba(70,112,40,0.85)' : 'rgba(26,52,24,0.95)';
        core.addColorStop(0, c0); core.addColorStop(0.7, dark ? 'rgba(8,22,14,0.8)' : lit ? 'rgba(80,120,46,0.55)' : 'rgba(34,64,28,0.75)'); core.addColorStop(1, 'rgba(34,64,28,0)');
        g.fillStyle = core; g.beginPath(); g.arc(0, 0, 50, 0, TAU); g.fill();
        var leaves = [];
        for (var i = 0; i < (lit ? 130 : 160); i++) {
          var a = R() * TAU, r = 50 * Math.sqrt(R()), x = Math.cos(a) * r, y = Math.sin(a) * r * 0.9;
          var light = clamp(0.5 + (x * 0.5 - y * 0.85) / 75 + (R() - 0.5) * 0.4);
          leaves.push({ x: x, y: y, l: light, rot: R() * TAU, sc: 0.85 + R() * 0.6 });
        }
        leaves.sort(function (a, b) { return a.l - b.l; });
        leaves.forEach(function (f) {
          var idx = lit ? 1 + Math.min(2, Math.floor(f.l * 3)) : Math.min(1, Math.floor(f.l * 2));
          g.globalAlpha = dark ? 0.5 + f.l * 0.25 : lit ? 0.9 : 0.8;
          var sp = L.treeLeaf[idx];
          g.save(); g.translate(f.x, f.y); g.rotate(f.rot); g.scale(f.sc, f.sc); g.drawImage(sp.c, -sp.ox, -sp.oy, sp.w, sp.h); g.restore();
        });
        g.globalAlpha = 1;
        g.globalCompositeOperation = 'source-atop';
        if (dark) { g.fillStyle = 'rgba(10,30,40,0.55)'; g.fillRect(-60, -60, 120, 120); }
        else if (!lit) { g.fillStyle = 'rgba(20,40,30,0.25)'; g.fillRect(-60, -60, 120, 120); }
        else { var hl = g.createRadialGradient(18, -22, 0, 18, -22, 60); hl.addColorStop(0, 'rgba(255,245,190,0.28)'); hl.addColorStop(1, 'rgba(255,245,190,0)'); g.fillStyle = hl; g.fillRect(-60, -60, 120, 120); }
        g.globalCompositeOperation = 'source-over';
      }));
    }
    return out;
  }

  // One blur pass over a finished layer (distance softness); skipped where canvas filters are not supported.
  function softened(c, px) {
    var o = document.createElement('canvas'); o.width = c.width; o.height = c.height;
    var g = o.getContext('2d');
    if (!('filter' in g)) return c;
    g.filter = 'blur(' + px.toFixed(2) + 'px)'; g.drawImage(c, 0, 0); g.filter = 'none';
    return o;
  }
  // Background layers (hills, distant woods) painted once per size/theme; they move with depth (parallax).
  function buildLayers() {
    var W = S.W, H = S.H, hz = S.hz, s = S.s, dpr = S.dpr, R = rng(3);
    var pad = Math.round(W * 0.35);
    function layer(paint) { var c = document.createElement('canvas'); c.width = Math.round((W + pad * 2) * dpr); c.height = Math.round(H * dpr); var g = c.getContext('2d'); g.scale(dpr, dpr); g.translate(pad, 0); paint(g); return c; }
    var far = layer(function (g) {
      [[hz - H * 0.13, H * 0.05, P.far[0], 0.0024], [hz - H * 0.065, H * 0.035, P.far[1], 0.004]].forEach(function (r, n) {
        g.beginPath(); g.moveTo(-pad - 10, H);
        for (var x = -pad - 10; x <= W + pad + 10; x += 8) g.lineTo(x, r[0] + noise(x * r[3] + n * 7) * r[1] + noise(x * r[3] * 3.1 + 3) * r[1] * 0.3);
        g.lineTo(W + pad + 10, H); g.closePath();
        var gr = g.createLinearGradient(0, r[0] - r[1], 0, hz + 20); gr.addColorStop(0, r[2]); gr.addColorStop(1, P.dark ? '#22383A' : '#C9D8C6');
        g.fillStyle = gr; g.fill();
      });
      var hzG = g.createLinearGradient(0, hz - H * 0.12, 0, hz + 10); hzG.addColorStop(0, P.haze + '0)'); hzG.addColorStop(1, P.haze + (P.dark ? '0.25)' : '0.55)'));
      g.fillStyle = hzG; g.fillRect(-pad, hz - H * 0.12, W + pad * 2, H * 0.12 + 12);
    });
    var near = layer(function (g) {
      var base = hz + 2, t = P.tree, tl = P.treeLit;
      var trees = [];
      for (var x = -pad - 40; x < W + pad + 40; x += (9 + R() * 18) * s) {
        var big = R() < 0.2, r = (big ? 26 + R() * 30 : 12 + R() * 18) * s * (S.mobile ? 0.8 : 1);
        var poplar = R() < 0.08;
        trees.push({ x: x, r: r, cy: base - r * (0.75 + R() * 0.6), poplar: poplar, back: R() < 0.5 });
      }
      trees.sort(function (a, b) { return (b.back ? 1 : 0) - (a.back ? 1 : 0); });
      trees.forEach(function (tr) {
        var rx = tr.poplar ? tr.r * 0.45 : tr.r, ry = tr.poplar ? tr.r * 1.7 : tr.r * 0.85, cy = tr.poplar ? base - ry : tr.cy;
        var hz2 = tr.back ? 8 : 0;
        g.fillStyle = hsl(t[0] + (R() - 0.5) * 14, t[1], t[2] - 4 + hz2);
        g.beginPath(); g.ellipse(tr.x, cy, rx * 0.86, ry * 0.86, 0, 0, TAU); g.fill();
        g.beginPath(); g.ellipse(tr.x, (cy + base) / 2 + 2, rx * 0.8, (base - cy) / 2 + 4, 0, 0, TAU); g.fill();
        var n = Math.round(30 + rx * ry * 0.06);
        for (var k = 0; k < n; k++) {
          var a = R() * TAU, rr = Math.sqrt(R()), px = tr.x + Math.cos(a) * rx * rr, py = cy + Math.sin(a) * ry * rr;
          var light = clamp(0.5 + ((px - tr.x) / rx * 0.5 - (py - cy) / ry * 0.8) * 0.6 + (R() - 0.5) * 0.3);
          g.fillStyle = hsl(lerp(t[0], tl[0], light), lerp(t[1], tl[1], light), lerp(t[2] - 6, tl[2] + 4, light) + hz2, 0.8);
          g.beginPath(); g.arc(px, py, (1.6 + R() * 2.6) * s, 0, TAU); g.fill();
        }
      });
      // a continuous hedge along the bottom of the woods, so no gaps reach the meadow
      g.fillStyle = hsl(t[0], t[1], t[2] - 2);
      g.beginPath(); g.moveTo(-pad - 10, base + 4);
      for (var hx = -pad - 10; hx <= W + pad + 10; hx += 6) g.lineTo(hx, base - (10 + 8 * noise(hx * 0.03) + 4 * noise(hx * 0.11 + 5)) * s);
      g.lineTo(W + pad + 10, base + 4); g.closePath(); g.fill();
      for (var hd = 0; hd < (W + pad * 2) / 3; hd++) {
        var dx = -pad + R() * (W + pad * 2), dy = base - R() * 16 * s, li = R();
        g.fillStyle = hsl(lerp(t[0], tl[0], li), lerp(t[1], tl[1], li), lerp(t[2] - 4, tl[2], li), 0.7);
        g.beginPath(); g.arc(dx, dy, (1.4 + R() * 2.2) * s, 0, TAU); g.fill();
      }
      g.fillStyle = rgb(P.mfar); g.fillRect(-pad - 10, base - 2, W + pad * 2 + 20, H);
      var hzG = g.createLinearGradient(0, hz - H * 0.2, 0, hz + 6); hzG.addColorStop(0, P.haze + '0)'); hzG.addColorStop(1, P.haze + (P.dark ? '0.22)' : '0.5)'));
      g.fillStyle = hzG; g.fillRect(-pad, hz - H * 0.2, W + pad * 2, H * 0.2 + 8);
    });
    near = softened(near, 0.7 * s * dpr);
    var cloud = S.clouds.map(function (c) {
      var w = c.w, h = w * 0.42, Rc = rng(c.seed), cv = document.createElement('canvas');
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      var g = cv.getContext('2d'); g.scale(dpr, dpr);
      for (var i = 0; i < 16; i++) {
        var x = w * (0.18 + Rc() * 0.64), y = h * (0.42 + Rc() * 0.3), r = h * (0.18 + Rc() * 0.24);
        var gr = g.createRadialGradient(x, y - r * 0.3, 0, x, y, r);
        gr.addColorStop(0, P.dark ? 'rgba(120,150,170,0.22)' : 'rgba(255,255,255,0.75)'); gr.addColorStop(1, P.dark ? 'rgba(120,150,170,0)' : 'rgba(255,255,255,0)');
        g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill();
      }
      return cv;
    });
    S.layers = { pad: pad, far: far, near: near, cloud: cloud, clumps: clumpSprites(P.dark) };
  }

  function mkFly(i) { return { sp: i % 4, x: -40, y: 0, vx: 0, vy: 0, rot: 0, ph: Math.random() * TAU, rate: 15 + Math.random() * 6, rest: 0, target: null, size: 0.9 + Math.random() * 0.35, arrive: T.bf + i * 0.45, front: i % 2 === 1 }; }
  function mkBee(i) { return { x: 0, y: 0, ph: Math.random() * TAU, dir: 1, target: null, rest: 0, arrive: T.bf + 0.8 + i * 0.6, i: i }; }

  function makePhoneVines(R) {
    var v = [];
    [-1, 1].forEach(function (side) {
      var items = [];
      for (var y = 12; y < 900; y += 11 + R() * 10) items.push({ y: y, side: R() < 0.5 ? -1 : 1, size: 0.7 + R() * 0.5, rot: (R() - 0.5) * 0.7, v: (R() * 3) | 0, flower: R() < 0.2, fl: R() < 0.5 ? 'jasmine' : 'glory', born: 0 });
      v.push({ side: side, P: 74 + R() * 18, A: 9 + R() * 4, items: items, phase: R() * TAU });
    });
    return v;
  }

  // ---- camera: starts close on the seed, pulls back while the tree grows
  function camera(t) {
    var p = ph(T.cam0, T.cam1, t), c = [S.W / 2, S.H / 2];
    return { Z: lerp(S.Z0, 1, p), F: [lerp(S.F0[0], c[0], p), lerp(S.F0[1], c[1], p)], A: [lerp(S.A0[0], c[0], p), lerp(S.A0[1], c[1], p)] };
  }
  function setCam(ctx, cam, d) {
    var Z = 1 + (cam.Z - 1) * d, k = S.dpr, cx = S.W / 2, cy = S.H / 2;
    var Fx = lerp(cx, cam.F[0], d), Fy = lerp(cy, cam.F[1], d), Ax = lerp(cx, cam.A[0], d), Ay = lerp(cy, cam.A[1], d);
    ctx.setTransform(k * Z, 0, 0, k * Z, k * (Ax - Fx * Z), k * (Ay - Fy * Z));
  }
  function toScreen(cam, x, y) { return [(x - cam.F[0]) * cam.Z + cam.A[0], (y - cam.F[1]) * cam.Z + cam.A[1]]; }

  // ---- the young plant (stem height grows, leaves unfold, droop while aphids feed)
  var NODES = [[40, 1, 58], [58, -1, 54], [75, 1, 50], [91, -1, 44], [105, 1, 38], [117, -1, 30]];
  function plantState(t) {
    var s = S.s;
    var h = t < T.spr0 ? 0 : t < T.yng0 ? 34 * ph(T.spr0, T.spr1, t) : 34 + 96 * ph(T.yng0, T.yng1, t);
    var hook = 1 - ph(T.spr0 + 0.5, T.spr1, t);
    var sick = ph(T.aph0, T.aph1, t) * (1 - ph(T.perk0, T.perk1, t));
    return { h: h * s, hook: hook, sick: sick };
  }

  // =================================================================== HERO DRAW
  function drawSky(ctx, t) {
    var k = P.dark ? 1 : ph(T.sun0, T.sun1, t), d = P.skyDawn, y = P.skyDay;
    var top = mixc(d[0], y[0], k), mid = mixc(d[1], y[1], k), low = mixc(d[2], y[2], k);
    ctx.setTransform(S.dpr, 0, 0, S.dpr, 0, 0);
    var gr = ctx.createLinearGradient(0, 0, 0, S.hz + 20);
    gr.addColorStop(0, rgb(top)); gr.addColorStop(0.6, rgb(mid)); gr.addColorStop(1, rgb(low));
    ctx.fillStyle = gr; ctx.fillRect(0, 0, S.W, S.H);
    if (P.dark) {   // a few stars
      var R = rng(9); ctx.fillStyle = 'rgba(230,240,255,0.7)';
      for (var i = 0; i < 70; i++) { var x = R() * S.W, yy = R() * S.hz * 0.8, tw = 0.4 + 0.6 * Math.abs(Math.sin(amb * (0.5 + R()) + i)); ctx.globalAlpha = tw * 0.7; ctx.fillRect(x, yy, 1.2, 1.2); }
      ctx.globalAlpha = 1;
    }
  }
  function sunPos(t) {
    var k = ph(T.sun0, T.sun1, t);
    var x = S.mobile ? S.W * 0.3 : S.W * 0.83, y = lerp(S.hz + 30 * S.s, S.H * (S.mobile ? 0.14 : 0.13), P.dark ? 1 : k);
    return [x, y, P.dark ? 0.35 + 0.65 * k : k];
  }
  function drawSun(ctx, cam, t) {
    var sp = sunPos(t), r = 240 * S.s * (S.mobile ? 0.8 : 1);
    setCam(ctx, cam, 0.06);
    ctx.globalCompositeOperation = 'lighter';
    var c = P.sunCol, a = P.dark ? 0.32 : 0.75;
    var gr = ctx.createRadialGradient(sp[0], sp[1], 0, sp[0], sp[1], r);
    gr.addColorStop(0, rgb(c, a * sp[2])); gr.addColorStop(0.12, rgb(c, a * 0.6 * sp[2])); gr.addColorStop(0.4, rgb(c, a * 0.16 * sp[2])); gr.addColorStop(1, rgb(c, 0));
    ctx.fillStyle = gr; ctx.fillRect(sp[0] - r, sp[1] - r, r * 2, r * 2);
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = P.dark ? 'rgba(235,242,250,' + (0.85 * sp[2]) + ')' : 'rgba(255,250,232,' + sp[2] + ')';
    ctx.beginPath(); ctx.arc(sp[0], sp[1], (P.dark ? 15 : 22) * S.s, 0, TAU); ctx.fill();
  }
  function drawRays(ctx, cam, t) {
    var sp = sunPos(t), k = sp[2] * (P.dark ? 0.35 : 1);
    if (k < 0.02) return;
    setCam(ctx, cam, 0.15);
    ctx.globalCompositeOperation = 'lighter';
    for (var i = 0; i < 7; i++) {
      var a = Math.PI * 0.55 + i * 0.16 + Math.sin(amb * 0.11 + i) * 0.03, len = S.H * 1.4, wd = 0.035 + 0.02 * Math.sin(i * 3.1);
      var al = (0.05 + 0.035 * Math.sin(amb * 0.4 + i * 1.7)) * k;
      var gr = ctx.createLinearGradient(sp[0], sp[1], sp[0] + Math.cos(a) * len, sp[1] + Math.sin(a) * len);
      gr.addColorStop(0, rgb(P.sunCol, al)); gr.addColorStop(1, rgb(P.sunCol, 0));
      ctx.fillStyle = gr; ctx.beginPath(); ctx.moveTo(sp[0], sp[1]);
      ctx.lineTo(sp[0] + Math.cos(a - wd) * len, sp[1] + Math.sin(a - wd) * len); ctx.lineTo(sp[0] + Math.cos(a + wd) * len, sp[1] + Math.sin(a + wd) * len); ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
  }
  function drawClouds(ctx, cam) {
    setCam(ctx, cam, 0.1);
    S.clouds.forEach(function (c, i) {
      var cv = S.layers.cloud[i], x = ((c.x + amb * c.v) % (S.W + c.w * 2)) - c.w;
      ctx.drawImage(cv, x, c.y, c.w, c.w * 0.42);
    });
  }
  function drawGround(ctx, cam, t) {
    setCam(ctx, cam, 1);
    var W = S.W, H = S.H, hz = S.hz, gy = S.gy, s = S.s;
    ctx.save(); ctx.beginPath(); ctx.rect(-W * 2, hz, W * 5, H * 3); ctx.clip();
    var dry = ctx.createLinearGradient(0, hz, 0, H);
    dry.addColorStop(0, rgb(P.dfar)); dry.addColorStop((gy - hz) / (H - hz), rgb(P.dnear)); dry.addColorStop(1, rgb(P.dfg));
    ctx.fillStyle = dry; ctx.fillRect(-W, hz, W * 3, H * 2);
    // dry ground: soft blotches, cracks, pebbles
    S.blotch.forEach(function (b) {
      var gr = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
      gr.addColorStop(0, b.dark ? (P.dark ? 'rgba(0,0,0,0.18)' : 'rgba(120,88,52,0.16)') : (P.dark ? 'rgba(90,85,70,0.12)' : 'rgba(255,240,205,0.22)'));
      gr.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.save(); ctx.translate(b.x, b.y); ctx.scale(1, 0.3); ctx.translate(-b.x, -b.y); ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, TAU); ctx.fill(); ctx.restore();
    });
    ctx.strokeStyle = P.dark ? 'rgba(10,8,5,0.35)' : 'rgba(110,80,50,0.35)'; ctx.lineWidth = 1.1 * s; ctx.lineCap = 'round';
    S.cracks.forEach(function (c) { ctx.beginPath(); ctx.moveTo(c[0][0], c[0][1]); for (var i = 1; i < c.length; i++) ctx.lineTo(c[i][0], c[i][1]); ctx.stroke(); });
    S.pebbles.forEach(function (p) {
      ctx.fillStyle = P.dark ? 'rgba(60,58,50,0.9)' : 'rgb(' + (p.c + 45 | 0) + ',' + (p.c + 28 | 0) + ',' + (p.c + 5 | 0) + ')';
      ctx.beginPath(); ctx.ellipse(p.x, p.y, p.r, p.r * 0.62, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.beginPath(); ctx.ellipse(p.x + p.r * 0.25, p.y - p.r * 0.25, p.r * 0.4, p.r * 0.22, 0, 0, TAU); ctx.fill();
    });
    // the green wave
    var R = S.Rmax * Math.pow(lin(T.wave0, T.wave1 - 0.6, t), 1 / 0.72);
    if (t >= T.end) R = S.Rmax * 1.2;
    if (R > 1) {
      ctx.save(); ctx.translate(S.tx, gy); ctx.scale(1, 0.32);
      var gr = ctx.createRadialGradient(0, 0, 0, 0, 0, R);
      var edge = clamp(1 - (60 * s) / R, 0.5, 0.97);
      var m = rgb(P.mnear);
      gr.addColorStop(0, m); gr.addColorStop(edge, m); gr.addColorStop(1, rgb(P.mnear, 0));
      ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(0, 0, R, 0, TAU); ctx.fill();
      ctx.restore();
      // depth shading over the green
      var shade = ctx.createLinearGradient(0, hz, 0, H);
      shade.addColorStop(0, rgb(P.mfar, 0.75 * clamp(R / S.Rmax))); shade.addColorStop((gy - hz) / (H - hz), rgb(P.mnear, 0)); shade.addColorStop(1, rgb(P.mfg, 0.6 * clamp(R / S.Rmax)));
      ctx.save(); ctx.translate(S.tx, gy); ctx.scale(1, 0.32); ctx.beginPath(); ctx.arc(0, 0, R * edge, 0, TAU); ctx.restore();
      ctx.save(); ctx.clip(); ctx.fillStyle = shade; ctx.fillRect(-W, hz, W * 3, H * 2); ctx.restore();
    }
    ctx.restore();
    var hb = ctx.createLinearGradient(0, hz, 0, hz + (gy - hz) * 0.35);
    hb.addColorStop(0, P.haze + (P.dark ? '0.12)' : '0.55)')); hb.addColorStop(1, P.haze + '0)');
    ctx.fillStyle = hb; ctx.fillRect(-W, hz, W * 3, (gy - hz) * 0.35);
    // the little mound where the seed goes
    var wet = ph(T.pour0 + 0.4, T.pour1, t);
    ctx.save(); ctx.translate(S.tx, gy);
    var mg = ctx.createRadialGradient(-6 * s, -5 * s, 2 * s, 0, 0, 44 * s);
    mg.addColorStop(0, P.dark ? '#3A2C22' : '#7A5A40'); mg.addColorStop(1, P.dark ? '#22170F' : '#4A3324');
    ctx.fillStyle = mg; ctx.beginPath(); ctx.ellipse(0, 0, 44 * s, 10 * s, 0, 0, TAU); ctx.fill();
    if (wet > 0) { ctx.fillStyle = 'rgba(28,18,10,' + (0.55 * wet) + ')'; ctx.beginPath(); ctx.ellipse(0, 1 * s, 38 * s, 8 * s, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = 'rgba(200,225,240,' + (0.22 * wet * (1 - ph(T.yng1, T.tree0, t))) + ')'; ctx.beginPath(); ctx.ellipse(-8 * s, -1.5 * s, 14 * s, 2 * s, 0, 0, TAU); ctx.fill(); }
    ctx.restore();
  }

  function drawBlade(ctx, b, t, g) {
    var h = b.h * g, x = b.x, y = b.y, wv = wind(x, amb) * b.flex;
    var tipx = x + (b.lean + wv) * h, tipy = y - h * (1 - 0.18 * Math.abs(b.lean + wv));
    var mx = x + (b.lean + wv) * h * 0.35;
    ctx.moveTo(x - b.w, y);
    ctx.quadraticCurveTo(mx - b.w * 0.4, y - h * 0.55, tipx, tipy);
    ctx.quadraticCurveTo(mx + b.w * 0.4, y - h * 0.5, x + b.w, y);
  }
  // Grass in bands of depth; each band gets one gradient (dark at the roots, light at the tips).
  function drawGrass(ctx, t, from, to) {
    var bl = S.blades, n = bl.length, i = 0, gl = P.grassL;
    while (i < n && bl[i].y < from) i++;
    while (i < n && bl[i].y < to) {
      var y0 = bl[i].y, j = i, hmax = 0;
      while (j < n && bl[j].y < y0 + 10 && bl[j].y < to) { if (bl[j].h > hmax) hmax = bl[j].h; j++; }
      for (var c = 0; c < 2; c++) {
        var gr = ctx.createLinearGradient(0, y0 + 6, 0, y0 - hmax);
        gr.addColorStop(0, hsl(c ? 104 : 92, 40, gl[0] - 4)); gr.addColorStop(0.55, hsl(c ? 96 : 86, 44, (gl[0] + gl[1]) / 2)); gr.addColorStop(1, hsl(c ? 84 : 76, 52, gl[1] + 6));
        ctx.fillStyle = gr; ctx.beginPath();
        var dryPath = false;
        for (var k = i; k < j; k++) {
          var b = bl[k]; if (b.c !== c) continue;
          var g = t >= T.end ? 1 : ph(b.ta, b.ta + 1.0, t);
          if (g > 0.01) drawBlade(ctx, b, t, g);
          if (b.dry && g < 1) dryPath = true;
        }
        ctx.fill();
        if (dryPath && c === 0) {
          ctx.fillStyle = P.dark ? 'rgba(80,72,52,0.8)' : 'rgba(176,150,100,0.85)'; ctx.beginPath();
          for (k = i; k < j; k++) { b = bl[k]; if (!b.dry) continue; var gg = t >= T.end ? 1 : ph(b.ta, b.ta + 0.8, t); if (gg < 1) { for (var q = -2; q <= 2; q++) drawBlade(ctx, { x: b.x + q * b.w * 0.9, y: b.y, h: b.h * (0.55 - Math.abs(q) * 0.08), w: b.w * 0.32, lean: q * 0.32 + b.lean * 0.4, flex: 0.15 }, t, 1 - gg); } }
          ctx.fill();
        }
      }
      i = j;
    }
  }
  function flowerHead(f, t) {
    var g = t >= T.end ? 1 : ph(f.ta - 0.3, f.ta + 0.5, t), h = f.h * (0.3 + 0.7 * g);
    var wv = wind(f.x, amb) * 0.7 + f.lean;
    return { x: f.x + wv * h * 0.8, y: f.y - h * (1 - 0.1 * Math.abs(wv)), g: g, h: h, wv: wv };
  }
  function drawFlowers(ctx, t, from, to) {
    var L = lib(), s = S.s;
    S.flowers.forEach(function (f) {
      if (f.y < from || f.y >= to) return;
      var hd = flowerHead(f, t);
      if (hd.g <= 0.01) return;
      var bloom = t >= T.end ? 1 : ph(f.ta + 0.3, f.ta + 1.4, t);
      ctx.strokeStyle = P.dark ? 'rgba(40,70,40,0.9)' : '#4F7F2E'; ctx.lineWidth = Math.max(0.7, s * (0.6 + 1.2 * f.k)); ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(f.x, f.y); ctx.quadraticCurveTo(f.x + hd.wv * hd.h * 0.15, f.y - hd.h * 0.6, hd.x, hd.y); ctx.stroke();
      var sc = s * (0.35 + 0.75 * f.k) * (f.type === 'poppy' ? 1.15 : 1);
      if (f.lav) {   // lavender spike
        for (var i = 0; i < 9; i++) {
          var u = i / 9, px = lerp(hd.x, f.x + hd.wv * hd.h * 0.1, u * 0.35), py = hd.y + u * hd.h * 0.35;
          ctx.fillStyle = hsl(268 + i * 2, 45, (P.dark ? 40 : 62) - i * 2, P.flowerA * clamp(bloom * 1.5 - u * 0.5));
          ctx.beginPath(); ctx.ellipse(px, py, 2.4 * sc, 3.2 * sc, 0, 0, TAU); ctx.fill();
        }
        return;
      }
      if (bloom < 0.35) { put(ctx, L.buds.pink, hd.x, hd.y, hd.wv * 0.4, sc * 0.6, sc * 0.6, hd.g); }
      var o = clamp((bloom - 0.25) / 0.75);
      if (o > 0) put(ctx, L.flowers[f.type], hd.x, hd.y, hd.wv * 0.5 + (1 - o) * 0.8, sc * o, sc * o * 0.72, P.flowerA);
    });
  }

  function treeGrowth(t) { return t >= T.end ? 1 : lin(T.tree0, T.tree1, t); }
  // Branch geometry for this frame (recursive: children start at their parent's tip).
  function treeGeom(t) {
    var G = treeGrowth(t), TH = S.TH, s = S.s, pl = plantState(t), list = [];
    var stemW = 4.2 * s;
    function walk(n, x, y, swayA) {
      var p, len, w0, w1;
      if (n.depth === 0) {
        var gT = ph(0, 0.22, G);
        len = G > 0 ? lerp(pl.h, n.len * TH, gT) : pl.h;
        w0 = lerp(stemW, n.w * TH, ph(0, 0.85, G)); w1 = lerp(stemW * 0.55, n.w * TH * 0.62, ph(0, 0.85, G)); p = 1;
      } else {
        p = ph(n.birth, n.birth + n.dur, G); len = n.len * TH * p;
        w0 = n.w * TH * (0.4 + 0.6 * ph(0, 1, G)); w1 = w0 * 0.62;
      }
      var a = n.ang + swayA + (n.depth ? Math.sin(amb * 0.9 + n.sway) * 0.012 * n.depth + wind(x, amb) * 0.02 * n.depth : 0);
      var ex = x + Math.cos(a) * len, ey = y + Math.sin(a) * len;
      var item = { n: n, x0: x, y0: y, x1: ex, y1: ey, a: a, len: len, w0: w0, w1: w1, p: p };
      list.push(item);
      if (n.depth === 0 && G <= 0) return list;
      if (p > 0.85) n.kids.forEach(function (k) { walk(k, ex, ey, (a - n.ang) * 0.6); });
      return list;
    }
    walk(S.tree.trunk, S.tx, S.gy, 0);
    return { list: list, G: G, pl: pl };
  }
  function drawBranch(ctx, it, colA, colB, green) {
    if (it.len < 0.5) return;
    var nx = -Math.sin(it.a), ny = Math.cos(it.a), b = it.n.bend * it.len;
    var mx = (it.x0 + it.x1) / 2 + nx * b, my = (it.y0 + it.y1) / 2 + ny * b;
    ctx.beginPath();
    ctx.moveTo(it.x0 + nx * it.w0 / 2, it.y0 + ny * it.w0 / 2);
    ctx.quadraticCurveTo(mx + nx * (it.w0 + it.w1) / 4, my + ny * (it.w0 + it.w1) / 4, it.x1 + nx * it.w1 / 2, it.y1 + ny * it.w1 / 2);
    ctx.lineTo(it.x1 - nx * it.w1 / 2, it.y1 - ny * it.w1 / 2);
    ctx.quadraticCurveTo(mx - nx * (it.w0 + it.w1) / 4, my - ny * (it.w0 + it.w1) / 4, it.x0 - nx * it.w0 / 2, it.y0 - ny * it.w0 / 2);
    ctx.closePath();
    if (it.n.depth <= 2) {
      var gr = ctx.createLinearGradient(it.x0 - nx * it.w0, it.y0 - ny * it.w0, it.x0 + nx * it.w0, it.y0 + ny * it.w0);
      gr.addColorStop(0, green ? '#3D7A2A' : colB); gr.addColorStop(0.6, green ? '#5E9A3A' : colA); gr.addColorStop(1, green ? '#2C5A1E' : colA);
      ctx.fillStyle = gr;
    } else ctx.fillStyle = colA;
    ctx.fill();
  }
  function drawTree(ctx, t) {
    var geo = treeGeom(t), G = geo.G, pl = geo.pl, s = S.s, L = lib(), TH = S.TH;
    if (pl.h <= 0) return geo;
    var green = G < 0.12, cl = S.layers.clumps;
    var crown = geo.list[0];
    // soft dark masses behind the crown
    if (G > 0.35) {
      var mA = ph(0.35, 0.9, G);
      S.tree.mass.forEach(function (m) {
        var cx = crown.x1 + Math.cos(m.a) * m.r * TH * 0.9, cy = crown.y1 - TH * 0.25 + Math.sin(m.a) * m.r * TH * 0.55;
        put(ctx, cl[m.v % 3], cx, cy, 0, m.s * TH / 60 * mA, m.s * TH / 60 * mA, P.dark ? 0.9 : 0.95);
      });
    }
    // branches
    var bark = P.bark;
    for (var i = 0; i < geo.list.length; i++) {
      var it = geo.list[i];
      if (i === 0 && green) { drawStem(ctx, it, pl); continue; }
      drawBranch(ctx, it, bark[1], bark[0], false);
    }
    // root flare and a few bark lines on the trunk
    if (!green) {
      var tr = geo.list[0], fw = tr.w0;
      ctx.fillStyle = bark[0];
      ctx.beginPath(); ctx.moveTo(tr.x0 - fw * 1.1, tr.y0 + 2); ctx.quadraticCurveTo(tr.x0 - fw * 0.45, tr.y0 - fw * 0.2, tr.x0 - fw * 0.4, tr.y0 - fw * 1.2);
      ctx.lineTo(tr.x0 + fw * 0.4, tr.y0 - fw * 1.2); ctx.quadraticCurveTo(tr.x0 + fw * 0.5, tr.y0 - fw * 0.2, tr.x0 + fw * 1.2, tr.y0 + 2); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = 'rgba(20,12,6,0.35)'; ctx.lineWidth = Math.max(1, fw * 0.06); ctx.lineCap = 'round';
      for (var bl = 0; bl < 4; bl++) { var u = -0.3 + bl * 0.2; ctx.beginPath(); ctx.moveTo(tr.x0 + fw * u, tr.y0 - fw * 0.5); ctx.quadraticCurveTo(tr.x0 + fw * (u + 0.08), lerp(tr.y0, tr.y1, 0.45), lerp(tr.x0, tr.x1, 0.8) + fw * u * 0.6, lerp(tr.y0, tr.y1, 0.8)); ctx.stroke(); }
    }
    // leaf clumps
    if (G > 0) {
      var byNode = new Map(); geo.list.forEach(function (it) { byNode.set(it.n, it); });
      var cs = [];
      S.tree.clumps.forEach(function (c) {
        var it = byNode.get(c.n); if (!it) return;
        var g = ph(c.n.birth + c.n.dur * 0.5, c.n.birth + c.n.dur * 0.5 + 0.3, G);
        if (g <= 0) return;
        cs.push({ x: lerp(it.x0, it.x1, c.f) + c.dx * TH, y: lerp(it.y0, it.y1, c.f) + c.dy * TH, sc: c.r * TH / 60 * g, c: c });
      });
      cs.forEach(function (o) { put(ctx, cl[o.c.v % 3], o.x, o.y, o.c.rot + Math.sin(amb * 0.8 + o.c.rot) * 0.03, o.sc, o.sc, 1); });
      cs.forEach(function (o) {
        var up = clamp(0.5 + (S.tx - o.x) / (TH * 0.9) * -0.3 + (crown.y1 - o.y) / (TH * 0.5));
        put(ctx, cl[3 + o.c.v % 3], o.x + o.sc * 6, o.y - o.sc * 8, o.c.rot * 0.7 + Math.sin(amb * 0.8 + o.c.rot) * 0.03, o.sc * 0.86, o.sc * 0.86, 0.6 + 0.4 * up);
      });
    }
    // the young plant's leaves (they fade as the tree takes over)
    var fade = 1 - ph(0.08, 0.32, G);
    if (fade > 0) drawPlantLeaves(ctx, t, crown, pl, fade);
    return geo;
  }
  function drawStem(ctx, it, pl) {
    var s = S.s, x = it.x0, y = it.y0, h = pl.h, hook = pl.hook;
    var tip = [x + hook * 12 * s, y - h + hook * 10 * s], c = [x - hook * 3 * s, y - h * 0.8];
    ctx.lineCap = 'round';
    ctx.strokeStyle = P.dark ? '#2C5A2A' : '#4E8A30'; ctx.lineWidth = it.w0;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(c[0], c[1], tip[0], tip[1]); ctx.stroke();
    ctx.strokeStyle = 'rgba(210,240,170,0.35)'; ctx.lineWidth = it.w0 * 0.3;
    ctx.beginPath(); ctx.moveTo(x + it.w0 * 0.2, y); ctx.quadraticCurveTo(c[0] + it.w0 * 0.2, c[1], tip[0] + it.w0 * 0.15, tip[1]); ctx.stroke();
  }
  // Leaf transform helpers (so aphids can sit on a leaf and fall from it).
  function plantLeafPose(t, i, crown, pl) {
    var s = S.s, nd = NODES[i], hNode = nd[0] * s;
    var stemTop = Math.max(pl.h, 1);
    if (pl.h < hNode + 4 * s) return null;
    var born = clamp((pl.h - hNode) / (16 * s));
    var f = hNode / Math.max(stemTop, crown.len) * (crown.len / stemTop);
    var x = lerp(crown.x0, crown.x1, clamp(hNode / Math.max(crown.len, 1))), y = lerp(crown.y0, crown.y1, clamp(hNode / Math.max(crown.len, 1)));
    var side = nd[1], open = ph(0, 1, born);
    var rot = side * (lerp(0.15, 1.05 - i * 0.07, open) + 0.45 * pl.sick) + Math.sin(amb * 1.3 + i) * 0.03 + wind(x, amb) * 0.05;
    var sc = nd[2] / 60 * s * (0.25 + 0.75 * open);
    return { x: x, y: y, rot: rot, sc: sc, f: f };
  }
  function drawPlantLeaves(ctx, t, crown, pl, alpha) {
    var L = lib(), s = S.s;
    // cotyledons
    var cy = Math.min(pl.h, 24 * s), cOpen = ph(T.spr0 + 0.7, T.spr1, t);
    var cx = lerp(crown.x0, crown.x1, clamp(cy / Math.max(crown.len, 1))), cyy = lerp(crown.y0, crown.y1, clamp(cy / Math.max(crown.len, 1)));
    if (pl.hook > 0.01) { cx += pl.hook * 12 * s; cyy += pl.hook * 10 * s; }
    if (pl.h > 2) {
      var a0 = lerp(2.6, 1.25, cOpen);
      put(ctx, L.coty, cx, cyy, a0, s * (0.6 + 0.4 * cOpen), s * (0.6 + 0.4 * cOpen), alpha);
      put(ctx, L.coty, cx, cyy, -lerp(1.9, 1.25, cOpen) + pl.hook * 1.2, s * (0.6 + 0.4 * cOpen), s * (0.6 + 0.4 * cOpen), alpha);
    }
    for (var i = 0; i < NODES.length; i++) {
      var p = plantLeafPose(t, i, crown, pl); if (!p) continue;
      var v = L.big[i % 3];
      put(ctx, v, p.x, p.y, p.rot, p.sc, p.sc, alpha);
      if (pl.sick > 0.02) put(ctx, L.sick, p.x, p.y, p.rot, p.sc, p.sc, alpha * pl.sick * 0.55);
    }
    // the growing tip bud
    if (pl.h > 30 * s && t < T.tree0 + 0.6) put(ctx, L.buds.jasmine, crown.x1, crown.y1, 0, s * 0.5, s * 0.5, alpha * 0.9);
  }
  // Aphids: they sit on leaves 1–4, then fall when the mist reaches them.
  var APH = [[1, 0.45, 0.06], [1, 0.62, -0.08], [2, 0.38, 0.05], [2, 0.58, -0.05], [3, 0.5, 0.04], [4, 0.42, -0.04], [0, 0.55, 0.05]];
  function aphidPose(t, k, geo) {
    var a = APH[k], p = plantLeafPose(t, a[0], geo.list[0], geo.pl); if (!p) return null;
    var crawl = Math.sin(amb * 0.7 + k) * 0.03;
    var lx = a[2] * 60 * 0.5, ly = -(a[1] + crawl) * 60;
    var c = Math.cos(p.rot), sn = Math.sin(p.rot);
    return { x: p.x + (lx * c - ly * sn) * p.sc, y: p.y + (lx * sn + ly * c) * p.sc, rot: p.rot + (k % 2 ? 0.4 : -0.3) };
  }
  function aphidFallT(k) { return k < 4 ? T.puff1 + 0.15 + k * 0.1 : T.puff2 + 0.15 + (k - 4) * 0.12; }

  function drawStory(ctx, cam, t, geo, dt) {
    var L = lib(), s = S.s;
    // aphids on the leaves
    var show = ph(T.aph0, T.aph1, t);
    if (show > 0 && t < T.tree0) {
      for (var k = 0; k < APH.length; k++) {
        var ft = aphidFallT(k), pose = aphidPose(t, k, geo); if (!pose) continue;
        var appear = ph(T.aph0 + k * 0.12, T.aph0 + k * 0.12 + 0.5, t);
        if (t < ft) { ctx.globalAlpha = appear; drawAphid(ctx, pose.x, pose.y, 1.6 * s, pose.rot); ctx.globalAlpha = 1; }
        else if (!cuesFired['aph' + k]) {
          cuesFired['aph' + k] = 1;
          parts.add({ kind: 'aphid', x: pose.x, y: pose.y, vx: -(30 + Math.random() * 50) * s, vy: -25 * s, g: 520 * s, rot: pose.rot, spin: (Math.random() < 0.5 ? -1 : 1) * (5 + Math.random() * 5), age: 0, life: 1.6, drag: 0.985 });
        }
      }
    }
    // seed
    if (t > T.seed0 - 0.1 && t < T.seed1 + 0.8) {
      var sp = ph(T.seed0, T.seed1, t), x = S.tx + Math.sin(sp * 5) * 26 * s * (1 - sp) + 20 * s * (1 - sp), y = lerp(S.gy - 330 * s, S.gy - 4 * s, sp);
      var al = 1 - lin(T.seed1 + 0.2, T.seed1 + 0.8, t);
      ctx.save(); ctx.translate(x, y); ctx.rotate(0.4 + sp * 2);
      ctx.globalAlpha = al; ctx.fillStyle = '#8C6A45'; ctx.beginPath(); ctx.ellipse(0, 0, 3.4 * s, 5 * s, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = '#C9A77B'; ctx.beginPath(); ctx.ellipse(-1 * s, -1.4 * s, 1.1 * s, 2.2 * s, 0, 0, TAU); ctx.fill();
      ctx.restore(); ctx.globalAlpha = 1;
      S.seedGlow = [x, y, al];
      if (t < T.seed1 && Math.random() < dt * 30) parts.add({ kind: 'spark', x: x + (Math.random() - 0.5) * 6 * s, y: y, vx: (Math.random() - 0.5) * 12 * s, vy: 8 * s, g: 0, age: 0, life: 1 + Math.random() * 0.6, r: 2 + Math.random() * 2.5 });
    } else S.seedGlow = null;
    if (t >= T.seed1 && !cuesFired.land) { cuesFired.land = 1; for (var i = 0; i < 22; i++) { var a = Math.random() * TAU, v = (30 + Math.random() * 60) * s; parts.add({ kind: 'spark', x: S.tx, y: S.gy - 3 * s, vx: Math.cos(a) * v, vy: Math.sin(a) * v * 0.5 - 30 * s, g: 40 * s, age: 0, life: 0.8 + Math.random() * 0.7, r: 2 + Math.random() * 3, drag: 0.96 }); } }
    // watering can
    if (t > T.can0 && t < T.out1) {
      var inP = ph(T.can0, T.can1, t), outP = ph(T.out0, T.out1, t), tilt = ph(T.tilt0, T.tilt1, t) * (1 - ph(T.out0 - 0.1, T.out0 + 0.4, t));
      var cx = S.tx + lerp(360, 98, inP) * s + outP * 300 * s, cy = S.gy + lerp(-300, -150, inP) * s - outP * 160 * s;
      var ang = -0.6 * tilt;
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(ang); ctx.scale(-s * 1.05, s * 1.05);
      ctx.drawImage(L.can.c, -L.can.ox, -L.can.oy, L.can.w, L.can.h);
      ctx.restore();
      if (t > T.pour0 && t < T.pour1) {
        var lx = -88 * s * 1.05, ly = -36 * s * 1.05, c = Math.cos(ang), sn = Math.sin(ang);
        var rx = cx + lx * c - ly * sn, ry = cy + lx * sn + ly * c, dirA = Math.atan2(sn * -1 + c * 0.25, -c - sn * 0.25);
        var flow = ph(T.pour0, T.pour0 + 0.3, t) * (1 - ph(T.pour1 - 0.3, T.pour1, t));
        for (i = 0; i < 260 * dt * flow; i++) {
          var aa = Math.PI * 0.62 + (Math.random() - 0.5) * 0.5, vv = (50 + Math.random() * 40) * s;
          parts.add({ kind: 'water', x: rx + (Math.random() - 0.5) * 8 * s, y: ry + (Math.random() - 0.5) * 8 * s, vx: Math.cos(aa) * vv, vy: Math.sin(aa) * vv, g: 700 * s, age: 0, life: 1.6, hit: waterHit });
        }
      }
    }
    // spray bottle
    if (t > T.bot0 && t < T.bout1) {
      var bi = ph(T.bot0, T.bot1, t), bo = ph(T.bout0, T.bout1, t);
      var bx = S.tx + lerp(300, 92, bi) * s + bo * 260 * s, by = S.gy - 64 * s + (1 - bi) * 20 * s;
      var squeeze = Math.max(pulse(t, T.puff1), pulse(t, T.puff2));
      var bs = s * 1.25;
      ctx.save(); ctx.translate(bx, by); ctx.rotate(-0.06 - squeeze * 0.05); ctx.scale(bs, bs);
      ctx.drawImage(L.bottle.c, -L.bottle.ox, -L.bottle.oy, L.bottle.w, L.bottle.h);
      ctx.restore();
      [T.puff1, T.puff2].forEach(function (pt, n) {
        if (t >= pt && !cuesFired['puff' + n]) {
          cuesFired['puff' + n] = 1;
          var nx = bx - 32 * bs, ny = by - 69 * bs;
          for (var j = 0; j < 180; j++) {
            var a2 = Math.PI + (Math.random() - 0.5) * 0.55 + 0.06, v2 = (150 + Math.random() * 260) * s;
            parts.add({ kind: 'mist', x: nx, y: ny, vx: Math.cos(a2) * v2, vy: Math.sin(a2) * v2, g: 12 * s, drag: 0.93, age: 0, life: 0.9 + Math.random() * 0.8, r: (1.5 + Math.random() * 2) * s, grow: (6 + Math.random() * 8) * s });
          }
        }
      });
    }
    // perk-up sparkle once the leaves are clean
    if (t >= T.perk0 + 0.3 && !cuesFired.perk) { cuesFired.perk = 1; for (i = 0; i < 26; i++) { var p = geo.list[0]; parts.add({ kind: 'spark', x: S.tx + (Math.random() - 0.5) * 80 * s, y: S.gy - Math.random() * 120 * s, vx: (Math.random() - 0.5) * 20 * s, vy: -(10 + Math.random() * 30) * s, g: 0, age: 0, life: 0.9 + Math.random() * 0.8, r: 2 + Math.random() * 2 }); } }
    // fairy dust along the green wave front
    if (t > T.wave0 && t < T.wave1) {
      var R = S.Rmax * Math.pow(lin(T.wave0, T.wave1 - 0.6, t), 1 / 0.72);
      for (i = 0; i < 70 * dt * (S.mobile ? 0.6 : 1) * 3; i++) {
        var a3 = Math.random() * Math.PI + Math.PI * (Math.random() < 0.5 ? 0 : 1), x3 = S.tx + Math.cos(a3) * R, y3 = S.gy + Math.sin(a3) * R * 0.32;
        if (y3 < S.hz || y3 > S.H + 10 || x3 < -10 || x3 > S.W + 10) continue;
        parts.add({ kind: 'spark', x: x3, y: y3, vx: (Math.random() - 0.5) * 10 * s, vy: -(14 + Math.random() * 40) * s, g: 0, age: 0, life: 0.8 + Math.random() * 0.9, r: 1.6 + Math.random() * 2.6 * clamp((y3 - S.hz) / (S.gy - S.hz), 0.4, 1.4) });
      }
    }
    // burst of light as the tree takes over
    if (t >= T.tree0 && !cuesFired.burst) { cuesFired.burst = 1; for (i = 0; i < 40; i++) { a = Math.random() * TAU; v = (40 + Math.random() * 120) * s; parts.add({ kind: 'spark', x: S.tx, y: S.gy - 80 * s, vx: Math.cos(a) * v, vy: Math.sin(a) * v, g: 0, drag: 0.95, age: 0, life: 1 + Math.random(), r: 2 + Math.random() * 3 }); } }
  }
  function pulse(t, at) { return clamp(1 - Math.abs(t - at - 0.1) / 0.2); }
  function waterHit(p) {
    if (p.y >= S.gy - 2 * S.s && Math.abs(p.x - S.tx) < 70 * S.s) {
      if (Math.random() < 0.35) parts.add({ kind: 'drop', x: p.x, y: S.gy - 2 * S.s, vx: (Math.random() - 0.5) * 50 * S.s, vy: -(30 + Math.random() * 50) * S.s, g: 500 * S.s, age: 0, life: 0.35 });
      return true;
    }
    return p.y > S.H + 20;
  }

  function drawParticles(ctx, list, glowPass) {
    var L = lib();
    for (var i = 0; i < list.length; i++) {
      var p = list[i], k = 1 - p.age / p.life;
      if (p.kind === 'water' && !glowPass) {
        ctx.strokeStyle = P.dark ? 'rgba(150,200,230,0.75)' : 'rgba(190,225,250,0.85)'; ctx.lineWidth = 1.6 * S.s; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - p.vx * 0.025, p.y - p.vy * 0.025); ctx.stroke();
      } else if (p.kind === 'drop' && !glowPass) {
        ctx.fillStyle = 'rgba(200,230,250,' + (0.8 * k) + ')'; ctx.beginPath(); ctx.arc(p.x, p.y, 1.3 * S.s, 0, TAU); ctx.fill();
      } else if (p.kind === 'mist' && !glowPass) {
        var r = p.r + p.grow * (p.age / p.life);
        put(ctx, L.glowW, p.x, p.y, 0, r / 10 * 2, r / 10 * 2, 0.32 * k);
      } else if (p.kind === 'aphid' && !glowPass) {
        if (p.y > S.gy) { p.y = S.gy; p.vy = 0; p.vx *= 0.5; p.spin = 0; }
        ctx.globalAlpha = clamp(k * 2.2); drawAphid(ctx, p.x, p.y, 1.6 * S.s, p.rot); ctx.globalAlpha = 1;
      } else if (p.kind === 'spark' && glowPass) {
        var tw = 0.6 + 0.4 * Math.sin(p.age * 18 + i);
        put(ctx, i % 3 ? L.glowG : L.star, p.x, p.y, 0, p.r / 5 * S.s * 1.4, p.r / 5 * S.s * 1.4, k * tw);
      }
    }
  }

  // Butterflies wander between flowers and rest on them; half fly in front of the phone.
  function stepFlies(dt, t) {
    var s = S.s, W = S.W, minX = S.mobile ? 10 : W * 0.42;
    S.flies.forEach(function (b, i) {
      if (P.dark && i > 1) { b.hidden = true; return; } b.hidden = false;
      if (t < b.arrive) { b.x = i % 2 ? W + 30 : (S.mobile ? -30 : W * 0.5); b.y = S.hz - 60 * s + i * 30 * s; return; }
      if (b.rest > 0) {
        b.rest -= dt; b.ph += dt * 3;
        if (b.target && b.target.f) { var hd = flowerHead(b.target.f, t); b.x = hd.x; b.y = hd.y - 2 * s; }
        if (b.rest <= 0) b.target = null;
        return;
      }
      if (!b.target) {
        var fl = S.flowers.filter(function (f) { return f.x > minX && f.k > 0.35 && !f.lav; });
        if (fl.length && Math.random() < 0.6) b.target = { f: fl[(Math.random() * fl.length) | 0] };
        else b.target = { x: minX + Math.random() * (W - minX - 20), y: S.hz - Math.random() * S.H * 0.35 };
      }
      var tx = b.target.f ? flowerHead(b.target.f, t).x : b.target.x, ty = b.target.f ? flowerHead(b.target.f, t).y : b.target.y;
      var dx = tx - b.x, dy = ty - b.y, d = Math.hypot(dx, dy) || 1, sp = 58 * s * b.size;
      var wob = noise(amb * 1.7 + i * 10) * 1.6;
      b.vx = lerp(b.vx, dx / d * sp + Math.cos(wob) * 18 * s, dt * 2.2);
      b.vy = lerp(b.vy, dy / d * sp + Math.sin(amb * 6 + i) * 30 * s, dt * 2.2);
      b.x += b.vx * dt; b.y += b.vy * dt; b.ph += dt * b.rate;
      b.rot = lerp(b.rot, clamp(b.vx / (sp + 1), -1, 1) * 0.5, dt * 3);
      if (d < 8 * s) { if (b.target.f) b.rest = 2 + Math.random() * 3.5; else b.target = null; }
    });
  }
  function stepBees(dt, t) {
    var s = S.s;
    S.bees.forEach(function (b) {
      if (P.dark || t < b.arrive) { b.x = S.W + 40; b.y = S.gy - 100 * s; return; }
      b.ph += dt * 10;
      if (b.rest > 0) { b.rest -= dt; if (b.target) { var hd = flowerHead(b.target, t); b.x = hd.x + Math.sin(b.ph) * 1.5 * s; b.y = hd.y - 3 * s; } if (b.rest <= 0) b.target = null; return; }
      if (!b.target) { var fl = S.flowers.filter(function (f) { return f.x > (S.mobile ? 0 : S.W * 0.5) && f.k > 0.5 && !f.lav; }); b.target = fl[(Math.random() * fl.length) | 0]; }
      if (!b.target) return;
      var hd2 = flowerHead(b.target, t), dx = hd2.x - b.x, dy = hd2.y - 3 * s - b.y, d = Math.hypot(dx, dy) || 1, sp = 90 * s;
      b.x += (dx / d * sp + Math.sin(b.ph * 0.7) * 30 * s) * dt; b.y += (dy / d * sp + Math.cos(b.ph * 0.9) * 26 * s) * dt; b.dir = dx < 0 ? -1 : 1;
      if (d < 5 * s) b.rest = 1.2 + Math.random() * 2;
    });
  }
  function stepFlock(dt, t) {
    if (P.dark) { S.flock = null; return; }
    if (!S.flock && t >= S.nextFlock) {
      var dir = Math.random() < 0.5 ? 1 : -1, n = 3 + ((Math.random() * 3) | 0), y = S.H * (0.12 + Math.random() * 0.16);
      S.flock = []; for (var i = 0; i < n; i++) S.flock.push({ x: dir > 0 ? -40 - i * 26 * S.s : S.W + 40 + i * 26 * S.s, y: y + (Math.random() - 0.5) * 40 * S.s, v: (120 + Math.random() * 40) * S.s, ph: Math.random() * TAU, rate: 9 + Math.random() * 4, dir: dir, size: (5 + Math.random() * 2.5) * S.s });
      S.nextFlock = t + 16 + Math.random() * 12;
    }
    if (!S.flock) return;
    var alive = false;
    S.flock.forEach(function (b) { b.x += b.dir * b.v * dt; b.y += Math.sin(amb * 1.2 + b.ph) * 6 * S.s * dt; b.ph += dt * b.rate * (Math.sin(amb * 0.6 + b.ph) > 0.4 ? 0.2 : 1); if (b.x > -80 && b.x < S.W + 80) alive = true; });
    if (!alive && S.flock.every(function (b) { return b.dir > 0 ? b.x > S.W : b.x < 0; })) S.flock = null;
  }

  function drawPhoneVines(ctx, t) {
    var p = t >= T.end ? 1 : ph(T.ph0 - 0.1, T.ph1, t);
    if (p <= 0) return;
    var L = lib(), s = S.s, c = S.clip, top = c.b - (c.h * 0.92) * p;
    S.pv.forEach(function (v, vi) {
      var ex = v.side < 0 ? c.l : c.r;
      var pts = [];
      for (var y = c.b + 6; y >= top; y -= 3) {
        var u = c.b - y, a = u / v.P * TAU + v.phase;
        pts.push([ex + Math.sin(a) * v.A * s + Math.sin(amb * 0.8 + u * 0.02) * 1.2 * s, y, Math.cos(a) > 0]);
      }
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      [false, true].forEach(function (fr) {
        ctx.strokeStyle = fr ? '#4F8F35' : 'rgba(46,92,34,0.8)'; ctx.lineWidth = (fr ? 3.4 : 2.6) * s;
        ctx.beginPath(); var on = false;
        for (var i = 0; i < pts.length; i++) { if (pts[i][2] === fr) { if (on) ctx.lineTo(pts[i][0], pts[i][1]); else { ctx.moveTo(pts[i][0], pts[i][1]); on = true; } } else on = false; }
        ctx.stroke();
      });
      v.items.forEach(function (it, k) {
        var y = c.b - it.y; if (y < top + 4) return;
        var u = it.y, a = u / v.P * TAU + v.phase, x = ex + Math.sin(a) * v.A * s;
        var age = clamp((y - top) / (40 * s));
        var rot = it.side * (0.9 + it.rot) + Math.sin(amb * 1.1 + k) * 0.05;
        var sc = s * 0.55 * it.size * ph(0, 1, age);
        put(ctx, L.heart[it.v], x, y, rot, sc, sc, 1);
        if (it.flower) { var fs = s * (it.fl === 'glory' ? 0.75 : 0.6) * ph(0.4, 1, age); put(ctx, L.flowers[it.fl], x + it.side * 14 * s, y - 8 * s, it.rot, fs, fs * 0.85, 1); }
      });
    });
  }

  function frameHero(dt) {
    var t = st;
    if (!S.layers) buildLayers();
    var cam = camera(t), ctx = bctx, s = S.s;
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, back.width, back.height);
    drawSky(ctx, t);
    drawSun(ctx, cam, t);
    drawClouds(ctx, cam);
    var pd = S.layers.pad;
    setCam(ctx, cam, 0.25); ctx.drawImage(S.layers.far, -pd, 0, S.W + pd * 2, S.H);
    // birds in the far sky
    if (S.flock) { setCam(ctx, cam, 0.3); S.flock.forEach(function (b) { drawFlyingBird(ctx, b.x, b.y, b.size, b.ph, b.dir, 'rgba(46,54,52,0.85)'); }); }
    setCam(ctx, cam, 1); ctx.drawImage(S.layers.near, -pd, 0, S.W + pd * 2, S.H);
    drawRays(ctx, cam, t);
    drawGround(ctx, cam, t);
    drawGrass(ctx, t, -1e9, S.gy - 8 * s);
    drawFlowers(ctx, t, -1e9, S.gy - 8 * s);
    var geo = drawTree(ctx, t);
    drawStory(ctx, cam, t, geo, dt);
    drawGrass(ctx, t, S.gy - 8 * s, 1e9);
    drawFlowers(ctx, t, S.gy - 8 * s, 1e9);
    // bees and the butterflies that fly behind the phone
    S.bees.forEach(function (b) { if (b.x < S.W + 20) drawBee(ctx, b, s * 1.3); });
    S.flies.forEach(function (b) { if (!b.front && !b.hidden && t >= b.arrive) drawButterfly(ctx, b, lib().wings, s * 1.05 * b.size); });
    drawParticles(ctx, parts.list, false);
    // dawn colour grade (light theme), lifting as the sun comes up
    if (P.grade) {
      var gk = 1 - ph(T.sun0, T.sun1, t);
      if (gk > 0.01) { ctx.setTransform(S.dpr, 0, 0, S.dpr, 0, 0); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = rgb(mixc([255, 255, 255], P.grade, 0.6 * gk)); ctx.fillRect(0, 0, S.W, S.H); ctx.globalCompositeOperation = 'source-over'; }
    }
    if (P.night) {   // moonlight: the meadow and tree go blue-grey below the horizon (follows the camera)
      var hzS = toScreen(cam, 0, S.hz)[1];
      ctx.setTransform(S.dpr, 0, 0, S.dpr, 0, 0); ctx.globalCompositeOperation = 'multiply';
      var ng = ctx.createLinearGradient(0, hzS - 120, 0, hzS + 30); ng.addColorStop(0, 'rgb(255,255,255)'); ng.addColorStop(1, rgb(P.night));
      ctx.fillStyle = ng; ctx.fillRect(0, Math.max(0, hzS - 120), S.W, S.H);
      ctx.globalCompositeOperation = 'source-over';
    }
    // glows: seed, sparkles, pollen / fireflies
    setCam(ctx, cam, 1);
    ctx.globalCompositeOperation = 'lighter';
    if (S.seedGlow) { var g = S.seedGlow; put(ctx, lib().glowG, g[0], g[1], 0, 3.2 * s * (1 + 0.15 * Math.sin(amb * 6)), 3.2 * s * (1 + 0.15 * Math.sin(amb * 6)), g[2]); }
    if (t > T.yng0 && t < T.tree0 + 1) { var gl = ph(T.yng0, T.yng0 + 1, t) * (1 - ph(T.tree0, T.tree0 + 1, t)) * (1 - 0.6 * plantState(t).sick); put(ctx, lib().glowG, S.tx, S.gy - 60 * s, 0, 9 * s, 9 * s, 0.25 * gl); }
    drawParticles(ctx, parts.list, true);
    if (t >= T.wave0) {
      var mk = t >= T.end ? 1 : ph(T.wave0 + 1, T.end, t);
      S.motes.forEach(function (m, i) {
        var x = (m.x + Math.sin(amb * 0.2 * m.sp + m.ph) * 40) % S.W, y = m.y + Math.sin(amb * 0.3 * m.sp + m.ph * 2) * 24 - (amb * 4 * m.sp) % 40;
        if (P.dark) { var bl = Math.pow(Math.max(0, Math.sin(amb * 0.9 * m.sp + m.ph * 3)), 3); if (y > S.hz - 40) put(ctx, lib().glowF, x, y, 0, m.r * 0.9, m.r * 0.9, bl * mk); }
        else put(ctx, lib().glowG, x, y, 0, m.r * 0.35, m.r * 0.35, 0.5 * mk);
      });
    }
    ctx.globalCompositeOperation = 'source-over';

    // ---- front layer (over the phone and the words)
    ctx = fctx; ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, front.width, front.height);
    setCam(ctx, cam, 1);
    if (t >= T.ph0 - 0.2) {
      drawPhoneVines(ctx, t);
      // grass in front of the phone's base so it rises out of the meadow
      var c = S.clip, gk2 = t >= T.end ? 1 : ph(T.ph0 - 0.4, T.ph0 + 0.6, t);
      ctx.beginPath();
      S.frontGrass = S.frontGrass || (function () { var R = rng(31), a = []; for (var i = 0; i < 110; i++) a.push({ x: c.l - 26 * s + R() * (c.w + 52 * s), y: c.b + 2 + R() * 16 * s, h: (16 + R() * 26) * s, w: (1.6 + R() * 1.6) * s, lean: (R() - 0.5) * 0.5, flex: 0.8 }); return a; })();
      var gr = ctx.createLinearGradient(0, c.b + 18 * s, 0, c.b - 40 * s); gr.addColorStop(0, hsl(96, 40, P.grassL[0] - 2)); gr.addColorStop(1, hsl(80, 50, P.grassL[1] + 4));
      ctx.fillStyle = gr; S.frontGrass.forEach(function (b) { drawBlade(ctx, b, t, gk2); }); ctx.fill();
    }
    S.flies.forEach(function (b) { if (b.front && !b.hidden && t >= b.arrive) drawButterfly(ctx, b, lib().wings, s * 1.05 * b.size); });
  }

  // ---------------------------------------------------------------- story control
  function setLabel() {
    if (!growBtn) return;
    var lab = growBtn.querySelector('span'), running = st < T.end;
    lab.textContent = running ? 'Skip' : 'Replay';
    growBtn.setAttribute('aria-label', running ? 'Skip the intro' : 'Replay the intro');
  }
  function cue(name) { document.dispatchEvent(new CustomEvent('lp:cue', { detail: name })); }
  var CUES = [['pour', T.pour0], ['spray', T.puff1 - 0.05], ['spray', T.puff2 - 0.05]];
  function phoneRise() {
    if (st >= T.end) { phone.style.transform = ''; return; }
    var p = ph(T.ph0, T.ph1, st);
    phone.style.transform = 'translateY(' + ((1 - p) * (S.clip.h + 30)).toFixed(1) + 'px)';
  }
  function advance(dt) {
    if (st < T.end) {
      var prev = st; st = Math.min(T.end, st + dt);
      CUES.forEach(function (c) { if (prev < c[1] && st >= c[1]) cue(c[0]); });
      if (prev < T.copy && st >= T.copy) root.classList.remove('lp-intro');
      if (st >= T.end) setLabel();
    }
    phoneRise();
  }
  function restart() {
    st = 0; parts.list = []; cuesFired = {}; S.flies = [0, 1, 2, 3].map(mkFly); S.bees = [mkBee(0), mkBee(1)]; S.flock = null; S.nextFlock = T.birds;
    root.classList.add('lp-intro'); setLabel(); phoneRise();
  }
  function skip() {
    st = T.end; parts.list = []; root.classList.remove('lp-intro'); setLabel(); phoneRise();
    S.flies.forEach(function (b) { b.arrive = 0; b.x = S.W * (0.55 + Math.random() * 0.4); b.y = S.hz - Math.random() * 120 * S.s; });
    S.bees.forEach(function (b) { b.arrive = 0; b.x = S.W * 0.8; b.y = S.gy - 60 * S.s; });
  }
  if (growBtn) {
    growBtn.addEventListener('click', function () { if (st < T.end) skip(); else restart(); kick(); });
    setLabel();
  }

  function loop(now) {
    raf = 0;
    var dt = Math.min(0.1, (now - last) / 1000 || 0.016); last = now;
    if (!reduce) { amb += dt; advance(dt); }
    stepFlies(dt, st); stepBees(dt, st); stepFlock(dt, st);
    parts.step(dt);
    frameHero(dt);
    if (visible && !reduce && !document.hidden) raf = requestAnimationFrame(loop);
  }
  function kick() { if (!raf) { last = performance.now(); raf = requestAnimationFrame(loop); } }
  function themeChanged() { P = palette(isDark()); S.layers = null; if (reduce) kick(); }

  function init() {
    P = palette(isDark());
    layout();
    if (reduce) { st = T.end; amb = 4; root.classList.remove('lp-intro'); skip(); }
    phoneRise();
    kick();
  }
  var rt;
  window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { layout(); kick(); }, 200); });
  new MutationObserver(themeChanged).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
  if (darkMq && darkMq.addEventListener) darkMq.addEventListener('change', themeChanged);
  if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (visible) kick(); }).observe(hero);
  document.addEventListener('visibilitychange', function () { if (!document.hidden) kick(); });
  init();
  window.LPGardenDebug = { get t() { return st; }, get S() { return S; } };

  // =================================================================== SCROLL VINE (right margin)
  window.LPGarden = { lib: lib, put: put, drawButterfly: drawButterfly, drawRobin: drawRobin, wind: wind, rng: rng, ph: ph, clamp: clamp, lerp: lerp, noise: noise, isDark: isDark, reduce: reduce, TAU: TAU, Particles: Particles, hsl: hsl };
})();
