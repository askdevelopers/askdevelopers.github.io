/* LeafPulse home: the scroll vine. As you read, a vine twines down a bamboo cane in the right margin, led by a small
   fairy light: leaves unfurl behind it, side shoots reach out, flowers open (morning glory, nasturtium, jasmine, cosmos),
   butterflies follow the flowers and robins land on the shoots and sing. It never shrinks back.
   One canvas fixed to the right edge, under the page content; painters are shared with garden.js (same light, same leaves).
   Reduced motion: shown fully grown and still. */
(function () {
  'use strict';
  var G = window.LPGarden;
  var main = document.getElementById('main'), hero = document.querySelector('.hero');
  if (!G || !main || !hero) return;
  var lib = G.lib, put = G.put, clamp = G.clamp, lerp = G.lerp, ph = G.ph, TAU = G.TAU;

  var cv = document.createElement('canvas');
  cv.className = 'vine-cv'; cv.setAttribute('aria-hidden', 'true');
  document.body.appendChild(cv);
  var ctx = cv.getContext('2d');
  var V = null, F = 0, amb = 0, last = 0, raf = 0, sparks = new G.Particles();

  function pageTop(el) { var r = el.getBoundingClientRect(); return r.top + window.scrollY; }
  function budFor(L, type) { return type === 'glory' ? L.buds.glory : type === 'jasmine' ? L.buds.jasmine : type === 'cosmos' ? L.buds.pink : L.buds.nast; }

  function build() {
    var vw = document.documentElement.clientWidth, vh = window.innerHeight;
    var wrapW = Math.min(1120, vw - 32), margin = (vw - wrapW) / 2;
    var narrow = vw <= 820;
    var k = narrow ? 0.5 : clamp(margin / 150, 0.6, 1.05);
    var CW = Math.round(narrow ? 90 : clamp(margin + 100 * k, 110, 320));
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = Math.round(CW * dpr); cv.height = Math.round(vh * dpr);
    cv.style.width = CW + 'px'; cv.style.height = vh + 'px';
    var sx = narrow ? CW - 13 : CW - Math.max(margin * 0.5, 16 * k);
    cv.classList.toggle('narrow', narrow);
    var y0 = pageTop(hero) + hero.offsetHeight - 30;
    var foot = document.querySelector('.site-footer');
    var y1 = (foot ? pageTop(foot) : pageTop(main) + main.offsetHeight) - 40;
    if (y1 - y0 < 200) { V = null; return; }
    var R = G.rng(41);
    var stems = [
      { A: 12 * k, P: 112 * k, phase: 0, w: 3.8 * k },
      { A: 9 * k, P: 88 * k, phase: 2.2, w: 2.6 * k }
    ];
    var sxAt = function (st, y) { var u = y - y0; return sx + Math.sin(u / st.P * TAU + st.phase) * st.A + Math.sin(u / 340) * 3 * k; };
    var front = function (st, y) { return Math.cos((y - y0) / st.P * TAU + st.phase) > 0; };
    var items = [], shoots = [], robins = [];
    var FL = ['glory', 'nast', 'jasmine', 'nastY', 'glory', 'cosmos', 'nastR', 'jasmine', 'glory'];
    var side = 1, y, i;
    // leaves on the main stem, alternating
    for (y = y0 + 20; y < y1 - 10; y += (14 + R() * 12) * k) {
      side = -side;
      var hang = R() < 0.3;
      items.push({ kind: 'leaf', st: 0, y: y, side: side, sz: 0.65 + R() * 0.7, rot: side * (hang ? 1.7 + R() * 0.8 : 0.6 + R() * 0.8) + (R() - 0.5) * 0.3, v: (R() * 3) | 0, off: (5 + R() * 8) * k });
    }
    // round nasturtium leaves on the second stem
    for (y = y0 + 40; y < y1 - 10; y += (26 + R() * 18) * k) items.push({ kind: 'round', st: 1, y: y, side: R() < 0.5 ? -1 : 1, sz: 0.55 + R() * 0.35, rot: (R() - 0.5) * 1.2, v: (R() * 2) | 0, off: (8 + R() * 8) * k });
    // flowers on the stems
    for (y = y0 + 60; y < y1 - 20; y += (40 + R() * 36) * k) {
      var n = 1 + ((R() * 2.4) | 0), type = FL[(R() * FL.length) | 0];
      for (i = 0; i < n; i++) items.push({ kind: 'flower', st: R() < 0.7 ? 0 : 1, y: y + i * 9 * k, side: R() < 0.5 ? -1 : 1, type: type, sz: 0.85 + R() * 0.4, rot: (R() - 0.5) * 1.4, off: (10 + R() * 12) * k, delay: 0.5 + i * 0.25 });
    }
    // tendrils
    for (y = y0 + 50; y < y1 - 20; y += (55 + R() * 40) * k) items.push({ kind: 'curl', st: R() < 0.5 ? 0 : 1, y: y, side: R() < 0.5 ? -1 : 1, sz: 0.8 + R() * 0.5 });
    // side shoots reaching out, with leaves and a flower cluster at the tip
    side = 1;
    for (y = y0 + 90; y < y1 - 60; y += (80 + R() * 70) * k) {
      side = -side;
      var len = (narrow ? 26 + R() * 18 : 50 + R() * 50) * k, ang = side < 0 ? Math.PI + 0.35 + R() * 0.4 : -0.35 - R() * 0.4;
      var sh = { y: y, side: side, len: len, ang: ang, bend: (R() - 0.5) * 0.8, leaves: [], fl: FL[(R() * FL.length) | 0], nfl: 2 + ((R() * 3) | 0) };
      for (var j = 1; j <= 4; j++) sh.leaves.push({ f: j / 4.6, side: j % 2 ? 1 : -1, sz: 0.55 + R() * 0.35, v: (R() * 3) | 0, rot: (R() - 0.5) * 0.5 });
      shoots.push(sh);
    }
    // robins perch on a few shoots
    [0.22, 0.55, 0.86].forEach(function (f, i) {
      var target = y0 + (y1 - y0) * f, best = null;
      shoots.forEach(function (s) { if (!best || Math.abs(s.y - target) < Math.abs(best.y - target)) best = s; });
      if (best && robins.every(function (r) { return r.sh !== best; })) robins.push({ sh: best, dir: best.side < 0 ? 1 : -1, st: { tilt: 0, hop: 0, beak: 0, tail: 0 }, timer: 1 + R() * 2 + i, mode: '', mt: 0 });
    });
    var bfs = [0, 1, 2].map(function (i) { return { sp: [0, 1, 3][i], x: sx, y: y0, vx: 0, vy: 0, rot: 0, ph: R() * TAU, rate: 15 + R() * 5, rest: 0, target: null, size: 0.8 + R() * 0.3 }; });
    var flies = []; for (i = 0; i < 14; i++) flies.push({ u: R(), ph: R() * TAU, dx: (R() - 0.5) * 120 * k, sp: 0.5 + R() });
    items.sort(function (a, b) { return a.y - b.y; });
    var tuft = [], tuftFl = [];
    for (i = 0; i < 46; i++) tuft.push({ x: (R() - 0.5) * 120 * k, h: (14 + R() * 26) * k, w: (1.2 + R() * 1.4) * k, lean: (R() - 0.5) * 0.5 });
    ['daisy', 'poppy', 'butter', 'daisy', 'cosmos', 'corn'].forEach(function (t, i) { tuftFl.push({ t: t, x: (i - 2.5) * 18 * k + (R() - 0.5) * 8 * k, h: (24 + R() * 22) * k, r: (R() - 0.5) * 0.4 }); });
    V = { tuft: tuft, tuftFl: tuftFl, vw: vw, vh: vh, CW: CW, dpr: dpr, k: k, sx: sx, y0: y0, y1: y1, stems: stems, sxAt: sxAt, front: front, items: items, shoots: shoots, robins: robins, bfs: bfs, flies: flies };
    if (G.reduce) { F = y1 + 100; items.forEach(function (it) { it.born = -100; }); shoots.forEach(function (s) { s.born = -100; }); robins.forEach(function (r) { r.born = -100; }); }
    else if (F < y0) F = y0;
  }

  // The tip chases a point 80% down the screen; it eases in and never shrinks back.
  function grow(dt) {
    if (!V) return;
    var target = Math.min(V.y1 + 60, window.scrollY + window.innerHeight * 0.8);
    if (target > F) F += Math.min((target - F) * (1 - Math.exp(-dt * 2.4)), 1100 * dt);
  }

  function shootPt(sh, f) {
    var bx = V.sxAt(V.stems[0], sh.y), a = sh.ang + sh.bend * f * 0.8;
    var x = bx + Math.cos(sh.ang) * sh.len * f + Math.cos(a + Math.PI / 2) * sh.bend * sh.len * f * (1 - f) * 0.6;
    var y = sh.y + Math.sin(sh.ang) * sh.len * f - sh.len * 0.125 * Math.sin(f * Math.PI);
    return [x, y];
  }

  function draw(dt) {
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height);
    if (!V) return;
    var L = lib(), k = V.k, dark = G.isDark(), sy = window.scrollY, top = sy - 60, bot = sy + V.vh + 60;
    if (bot < V.y0) return;
    ctx.setTransform(V.dpr, 0, 0, V.dpr, 0, -sy * V.dpr);
    var base = dark ? 0.85 : 1;
    ctx.globalAlpha = base;
    var Fy = Math.min(F, V.y1);
    V.items.forEach(function (it) { if (it.born === undefined && F >= it.y) it.born = amb; });
    V.shoots.forEach(function (s) { if (s.born === undefined && F >= s.y) s.born = amb; });
    V.robins.forEach(function (r) { if (r.born === undefined && F >= r.sh.y + 30) r.born = amb + 1.2; });

    // the cane, showing a little ahead of the vine
    var c0 = Math.max(V.y0 - 10, top), c1 = Math.min(V.y1 + 30, bot, F + 120);
    if (c1 > c0) {
      var cg = ctx.createLinearGradient(V.sx - 5 * k, 0, V.sx + 5 * k, 0);
      cg.addColorStop(0, dark ? '#4A3E2A' : '#9C8150'); cg.addColorStop(0.45, dark ? '#7A6A4A' : '#DCC690'); cg.addColorStop(1, dark ? '#3E3322' : '#8A6F42');
      ctx.fillStyle = cg; ctx.fillRect(V.sx - 4.5 * k, c0, 9 * k, c1 - c0);
      ctx.fillStyle = '#7E6438';
      for (var ny = V.y0 + 40; ny < c1; ny += 120 * k) if (ny > c0) { ctx.globalAlpha = base * 0.75 * clamp((F + 120 - ny) / 120); ctx.fillRect(V.sx - 5.5 * k, ny, 11 * k, 3 * k); }
      ctx.globalAlpha = base;
    }
    // stems: the runs behind the cane first, then the runs in front
    [false, true].forEach(function (fr) {
      V.stems.forEach(function (st, si) {
        var y = Math.max(V.y0, top), end = Math.min(Fy, bot), on = false, x;
        if (end <= y) return;
        ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        ctx.strokeStyle = fr ? (si ? '#4F8F35' : '#3E7A2A') : 'rgba(40,78,30,0.85)'; ctx.lineWidth = fr ? st.w : st.w * 0.85;
        ctx.beginPath();
        for (; y <= end; y += 3) {
          if (V.front(st, y) === fr) { x = V.sxAt(st, y); if (on) ctx.lineTo(x, y); else { ctx.moveTo(x, y); on = true; } } else on = false;
        }
        ctx.stroke();
        if (fr) {
          ctx.strokeStyle = 'rgba(190,235,150,0.45)'; ctx.lineWidth = st.w * 0.3;
          ctx.beginPath(); on = false;
          for (y = Math.max(V.y0, top); y <= end; y += 3) { if (V.front(st, y)) { x = V.sxAt(st, y) + st.w * 0.25; if (on) ctx.lineTo(x, y - st.w * 0.2); else { ctx.moveTo(x, y - st.w * 0.2); on = true; } } else on = false; }
          ctx.stroke();
        }
      });
    });
    // side shoots
    V.shoots.forEach(function (sh) {
      if (sh.born === undefined || sh.y < top - 120 || sh.y > bot + 60) return;
      var g = ph(0, 1.1, amb - sh.born), sway = Math.sin(amb * 1.1 + sh.y) * 0.04, f, p;
      ctx.strokeStyle = '#4A8632'; ctx.lineWidth = 2.2 * k; ctx.lineCap = 'round';
      ctx.beginPath();
      for (f = 0; f <= g + 0.001; f += 0.05) { p = shootPt(sh, f); p[1] += sway * f * 30; if (f) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); }
      ctx.stroke();
      sh.leaves.forEach(function (lf) {
        if (g < lf.f) return;
        var q = shootPt(sh, lf.f), lg = ph(lf.f, lf.f + 0.5, g);
        var rot = sh.ang + Math.PI / 2 + lf.side * 1.1 + lf.rot + sway * 2;
        put(ctx, L.heart[lf.v], q[0], q[1] + sway * lf.f * 30, rot, k * 0.62 * lf.sz * lg, k * 0.62 * lf.sz * lg, 1);
      });
      if (g > 0.9) {
        var tip = shootPt(sh, 1), op = ph(1.0, 2.2, amb - sh.born);
        for (var n = 0; n < sh.nfl; n++) {
          var a = n / sh.nfl * TAU + sh.y, fx = tip[0] + Math.cos(a) * 9 * k, fy = tip[1] + Math.sin(a) * 7 * k + sway * 30;
          if (op < 0.4) put(ctx, budFor(L, sh.fl), fx, fy, a * 0.3, k * 0.7, k * 0.7, 1);
          var o = clamp((op - 0.3) / 0.7);
          if (o > 0) put(ctx, L.flowers[sh.fl], fx, fy, a * 0.4 + (1 - o) * 0.8, k * 1.05 * o, k * 0.95 * o, 1);
        }
      }
    });
    // leaves, flowers and tendrils on the stems
    V.items.forEach(function (it, idx) {
      if (it.born === undefined || it.y < top || it.y > bot) return;
      var st = V.stems[it.st], x = V.sxAt(st, it.y), age = amb - it.born, sway = Math.sin(amb * 1.2 + idx * 0.7) * 0.05;
      ctx.lineCap = 'round';
      if (it.kind === 'leaf' || it.kind === 'round') {
        var g = ph(0, 0.9, age), bx = x + it.side * it.off * g, by = it.y - 3 * k * g;
        ctx.strokeStyle = '#5A9A3C'; ctx.lineWidth = 1.3 * k; ctx.beginPath(); ctx.moveTo(x, it.y); ctx.quadraticCurveTo(x + it.side * it.off * 0.5, it.y - 4 * k, bx, by); ctx.stroke();
        var sp = it.kind === 'leaf' ? L.heart[it.v] : L.round[it.v], sc = k * (it.kind === 'leaf' ? 0.95 : 0.85) * it.sz * g;
        put(ctx, sp, bx, by, it.rot * lerp(0.2, 1, g) + it.side * (1 - g) * 0.8 + sway, sc, sc, 1);
      } else if (it.kind === 'flower') {
        var bo = ph(it.delay, it.delay + 0.5, age), op = ph(it.delay + 0.5, it.delay + 1.7, age);
        if (bo <= 0) return;
        var fx = x + it.side * it.off, fy = it.y - 5 * k;
        ctx.strokeStyle = '#5A9A3C'; ctx.lineWidth = 1.1 * k; ctx.beginPath(); ctx.moveTo(x, it.y); ctx.quadraticCurveTo(x + it.side * it.off * 0.4, it.y + 2 * k, fx, fy); ctx.stroke();
        if (op < 0.45) put(ctx, budFor(L, it.type), fx, fy, it.side * 0.5 + sway, k * 0.8 * bo, k * 0.8 * bo, 1);
        var o = clamp((op - 0.35) / 0.65);
        if (o > 0) put(ctx, L.flowers[it.type], fx, fy, it.rot + (1 - o) * 0.9 + sway, k * 1.2 * it.sz * o, k * 1.05 * it.sz * o, 1);
        it.open = o > 0.9; it.fx = fx; it.fy = fy;
      } else if (it.kind === 'curl') {
        var cgw = ph(0, 1.2, age), s = it.side, r = 7 * k * it.sz;
        ctx.strokeStyle = '#6FAE45'; ctx.lineWidth = 1.1 * k; ctx.beginPath(); ctx.moveTo(x, it.y);
        for (var t = 0; t <= cgw * 3.2; t += 0.12) { var rr = r * (1 - t / 4); ctx.lineTo(x + s * (r + Math.sin(t * 2.2) * rr), it.y + 6 * k + t * 2 * k - Math.cos(t * 2.2) * rr); }
        ctx.stroke();
      }
    });
    // where the vine ends it reaches a little patch of meadow: grass and a few flowers spring up round the cane
    if (F >= V.y1 && V.y1 < bot && V.y1 > top - 80) {
      if (V.tuftBorn === undefined) V.tuftBorn = amb;
      var tg = ph(0, 1.2, amb - V.tuftBorn), gy = V.y1 + 34 * k;
      var gg = ctx.createLinearGradient(0, gy, 0, gy - 40 * k);
      gg.addColorStop(0, dark ? '#1F3A1E' : '#3E6E2A'); gg.addColorStop(1, dark ? '#4E7A3A' : '#9CCB62');
      ctx.fillStyle = gg; ctx.beginPath();
      V.tuft.forEach(function (b) {
        var h = b.h * tg, w = Math.sin(amb * 1.3 + b.x * 0.05) * 0.12 + b.lean, x = V.sx + b.x;
        ctx.moveTo(x - b.w, gy); ctx.quadraticCurveTo(x + w * h * 0.3, gy - h * 0.55, x + w * h, gy - h); ctx.quadraticCurveTo(x + w * h * 0.3 + b.w * 0.6, gy - h * 0.5, x + b.w, gy);
      });
      ctx.fill();
      V.tuftFl.forEach(function (f, i) {
        var o = ph(0.5 + i * 0.15, 1.6 + i * 0.15, amb - V.tuftBorn), x = V.sx + f.x + Math.sin(amb * 1.2 + i) * 2;
        if (o <= 0) return;
        ctx.strokeStyle = '#4F7F2E'; ctx.lineWidth = 1.2 * k; ctx.beginPath(); ctx.moveTo(V.sx + f.x, gy); ctx.quadraticCurveTo(V.sx + f.x, gy - f.h * 0.6, x, gy - f.h * o); ctx.stroke();
        put(ctx, L.flowers[f.t], x, gy - f.h * o, f.r, k * o, k * 0.8 * o, 1);
      });
    }
    // robins fly in and perch on their shoot
    V.robins.forEach(function (r) {
      if (r.born === undefined || amb < r.born) return;
      var p = shootPt(r.sh, 0.62), land = ph(0, 0.9, amb - r.born);
      if (p[1] < top - 40 || p[1] > bot + 40) return;
      var x = lerp(p[0] - 90 * k * r.dir, p[0], land), y = lerp(p[1] - 70 * k, p[1], land) - Math.sin(land * Math.PI) * 10 * k;
      robinAct(r, dt, land >= 1 && p[1] > sy && p[1] < sy + V.vh);
      G.drawRobin(ctx, x, y + 1, k * 1.45, r.dir, r.st);
    });
    // butterflies round the open flowers near the tip
    stepBfs(dt, top, bot);
    V.bfs.forEach(function (b) { if (b.y > top && b.y < bot) G.drawButterfly(ctx, b, L.wings, k * 0.95 * b.size); });
    // the fairy light at the growing tip, and its sparkles
    ctx.globalCompositeOperation = 'lighter';
    if (F < V.y1 + 40 && Fy > top && Fy < bot) {
      var tx = V.sxAt(V.stems[0], Fy) + Math.sin(amb * 2.1) * 10 * k, ty = Fy + 8 * k + Math.cos(amb * 1.7) * 6 * k;
      var pulse = 1 + 0.12 * Math.sin(amb * 5);
      put(ctx, L.glowG, tx, ty, 0, 2.6 * k * pulse, 2.6 * k * pulse, 0.9);
      put(ctx, L.glowW, tx, ty, 0, 0.8 * k, 0.8 * k, 1);
      var moving = (window.scrollY + window.innerHeight * 0.8) - F > 20;
      if (Math.random() < dt * (moving ? 50 : 10)) sparks.add({ x: tx + (Math.random() - 0.5) * 14 * k, y: ty, vx: (Math.random() - 0.5) * 18 * k, vy: (Math.random() * 18 - 4) * k, g: 14 * k, age: 0, life: 0.9 + Math.random() * 0.9, r: 1.4 + Math.random() * 2 });
    }
    sparks.step(dt);
    sparks.list.forEach(function (p, i) {
      var kk = 1 - p.age / p.life, tw = 0.6 + 0.4 * Math.sin(p.age * 16 + i);
      put(ctx, i % 3 ? L.glowG : L.star, p.x, p.y, 0, p.r / 5 * k * 1.3, p.r / 5 * k * 1.3, kk * tw);
    });
    if (dark) {   // fireflies along the grown part
      V.flies.forEach(function (f) {
        var y = V.y0 + (Fy - V.y0) * f.u, x = V.sx + f.dx + Math.sin(amb * 0.4 * f.sp + f.ph) * 20 * k;
        if (y < top || y > bot) return;
        var bl = Math.pow(Math.max(0, Math.sin(amb * 0.9 * f.sp + f.ph * 3)), 3);
        put(ctx, L.glowF, x, y + Math.sin(amb * 0.6 + f.ph) * 14, 0, 0.9, 0.9, bl);
      });
    }
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
  }

  // Robins now and then sing (beak opens; a soft chirp plays if the garden sound is on), hop, or tilt their head.
  function robinAct(r, dt, perched) {
    var st = r.st;
    st.tail *= Math.pow(0.02, dt);
    if (r.mode === 'chirp') { r.mt -= dt; st.beak = (Math.floor(r.mt * 8) % 2) ? 0.9 : 0.1; if (r.mt <= 0) { r.mode = ''; st.beak = 0; } }
    if (r.mode === 'hop') { r.mt -= dt; st.hop = Math.sin(clamp(1 - r.mt / 0.35) * Math.PI) * 6; if (r.mt <= 0) { r.mode = ''; st.hop = 0; } }
    st.tilt = lerp(st.tilt, r.tiltTo || 0, dt * 4);
    if (!perched) return;
    r.timer -= dt;
    if (r.timer <= 0 && !r.mode) {
      var x = Math.random();
      if (x < 0.4) { r.mode = 'chirp'; r.mt = 0.7; document.dispatchEvent(new CustomEvent('lp:cue', { detail: 'chirp' })); }
      else if (x < 0.65) { r.mode = 'hop'; r.mt = 0.35; st.tail = 0.4; }
      else r.tiltTo = (Math.random() - 0.5) * 0.7;
      r.timer = 2.5 + Math.random() * 4;
    }
  }

  function stepBfs(dt, top, bot) {
    var k = V.k, Fy = Math.min(F, V.y1);
    var open = V.items.filter(function (it) { return it.kind === 'flower' && it.open && it.fy > top + 40 && it.fy < bot - 40; });
    V.bfs.forEach(function (b, i) {
      if (b.y < top - 200 || b.y > bot + 200) { b.x = V.sx; b.y = Math.min(Fy, bot - 60); b.target = null; b.rest = 0; }
      if (b.rest > 0) { b.rest -= dt; b.ph += dt * 3; if (b.rest <= 0) { b.rest = 0; b.target = null; } return; }
      if (!b.target) {
        if (open.length && Math.random() < 0.6) { var f = open[(Math.random() * open.length) | 0]; b.target = { x: f.fx, y: f.fy - 2 * k, fl: true }; }
        else b.target = { x: V.sx + (Math.random() - 0.5) * 140 * k, y: clamp(Fy - Math.random() * 260, top + 60, bot - 60), fl: false };
      }
      var dx = b.target.x - b.x, dy = b.target.y - b.y, d = Math.hypot(dx, dy) || 1, sp = 60 * k * b.size;
      b.vx = lerp(b.vx, dx / d * sp + Math.cos(amb * 2 + i) * 20 * k, dt * 2.2);
      b.vy = lerp(b.vy, dy / d * sp + Math.sin(amb * 6 + i) * 30 * k, dt * 2.2);
      b.x = clamp(b.x + b.vx * dt, 8, V.CW - 8); b.y += b.vy * dt; b.ph += dt * b.rate;
      b.rot = lerp(b.rot, clamp(b.vx / (sp + 1), -1, 1) * 0.5, dt * 3);
      if (d < 7 * k) { if (b.target.fl) b.rest = 1.8 + Math.random() * 3; else b.target = null; }
    });
  }

  function loop(now) {
    raf = 0;
    var dt = Math.min(0.1, (now - last) / 1000 || 0.016); last = now;
    amb += dt; grow(dt);
    draw(dt);
    var active = !!V && window.scrollY + window.innerHeight > V.y0 - 40 && !document.hidden;
    cv.classList.toggle('on', active);
    if (active && !G.reduce) raf = requestAnimationFrame(loop);
  }
  function kick() { if (!raf) { last = performance.now(); raf = requestAnimationFrame(loop); } }
  function setup() { build(); kick(); }

  var rt, lastH = 0;
  window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(setup, 250); });
  window.addEventListener('scroll', kick, { passive: true });
  document.addEventListener('visibilitychange', kick);
  if ('ResizeObserver' in window) new ResizeObserver(function () { var h = document.body.scrollHeight; if (Math.abs(h - lastH) > 40) { lastH = h; clearTimeout(rt); rt = setTimeout(setup, 300); } }).observe(document.body);
  if (document.readyState === 'complete') setup(); else window.addEventListener('load', setup);
  window.LPVineDebug = { get F() { return F; }, get V() { return V; } };
})();
