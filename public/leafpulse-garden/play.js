// LeafPulse website mini game: "Pest Patrol".
// Four planter boxes, pests crawling in from the right toward your houseplants on the left. Spend water drops on
// defenders based on real pest control: a mister sprays, a Venus flytrap snaps a bug and chews, marigolds block,
// rain barrels collect more drops. Six waves; every pest that gets through eats one of your five leaves.
// Endless rounds of three waves, each tougher; combos for quick catches; stars per round; a seeded Daily garden
// (same pests for everyone that day) and a share button. Between rounds there is a short ad break, and a lost
// garden can be saved once by watching an ad (both via ads.js, off until AdSense is set up).
// Drawn entirely in SVG. The loop runs only during a round, and pauses off screen or in a hidden tab.
(function () {
  'use strict';
  var game = document.getElementById('pestGame');
  if (!game) return;
  var NS = 'http://www.w3.org/2000/svg';
  var svg = game.querySelector('.pt-scene');
  var G = {}; ['ptBoard', 'ptHome', 'ptGhost', 'ptUnits', 'ptPests', 'ptShots', 'ptFx'].forEach(function (id) { G[id] = svg.querySelector('#' + id); });
  var hud = {}; game.querySelectorAll('[data-pt]').forEach(function (e) { hud[e.getAttribute('data-pt')] = e; });
  var banner = game.querySelector('.pt-banner');
  var cards = {}; game.querySelectorAll('.pt-card').forEach(function (c) { cards[c.getAttribute('data-kind')] = c; });
  var startCard = game.querySelector('.pt-start'), pauseCard = game.querySelector('.pt-pause'), endCard = game.querySelector('.pt-end'), roundCard = game.querySelector('.pt-round');
  var saveBtn = game.querySelector('.pt-save');
  var Ads = window.LPAds || { enabled: false, next: function (n, d) { d(); }, reward: function (n, h) { if (h.done) h.done(); } };
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, String(v)); } catch (e) { return null; } }

  // seeded randomness, so the Daily garden sends the same pests to everyone
  var rnd = Math.random;
  function seeded(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  var today = function () { var d = new Date(); return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate(); };

  function el(tag, a, p) { var e = document.createElementNS(NS, tag); for (var k in a) e.setAttribute(k, a[k]); if (p) p.appendChild(e); return e; }
  function rand(a, b) { return a + Math.random() * (b - a); }
  function grand(a, b) { return a + rnd() * (b - a); } // gameplay randomness (seeded in Daily mode)
  function tf(e, x, y) { e.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ')'); }

  /* ---------- board ---------- */
  var COLS = 8, LANES = 4, CELL = 90, GX = 108, GY = 74, HOME_X = 54;
  var cx = function (c) { return GX + c * CELL + CELL / 2; }, cy = function (l) { return GY + l * CELL + CELL / 2; };
  for (var l = 0; l < LANES; l++) {
    var y0 = GY + l * CELL;
    el('rect', { x: GX - 8, y: y0 + 4, width: 900 - GX + 20, height: CELL - 8, rx: 10, fill: 'url(#ptWood)' }, G.ptBoard);
    el('rect', { x: GX - 2, y: y0 + 10, width: 900 - GX + 10, height: CELL - 20, rx: 7, fill: l % 2 ? 'url(#ptSoilB)' : 'url(#ptSoilA)' }, G.ptBoard);
    for (var c = 1; c < COLS; c++) el('path', { d: 'M' + (GX + c * CELL) + ' ' + (y0 + 14) + ' v' + (CELL - 28), stroke: '#FFE8C8', 'stroke-width': 1, 'stroke-dasharray': '2 6', opacity: .25 }, G.ptBoard);
    for (var k = 0; k < 14; k++) el('circle', { cx: rand(GX, 890), cy: rand(y0 + 18, y0 + CELL - 18), r: rand(1, 2.2), fill: '#4A2E1A', opacity: .35 }, G.ptBoard);
  }
  el('rect', { x: 0, y: GY - 2, width: GX - 12, height: LANES * CELL + 4, rx: 12, class: 'pt-shelf' }, G.ptBoard);

  /* ---------- art ---------- */
  var INK = '#2A3A26';
  function pot(g, s) {
    s = s || 1;
    el('ellipse', { cx: 0, cy: 38 * s, rx: 22 * s, ry: 4 * s, fill: '#2B1A0E', opacity: .3 }, g);
    el('path', { d: 'M' + (-17 * s) + ' ' + (14 * s) + ' H' + (17 * s) + ' L' + (13 * s) + ' ' + (37 * s) + ' H' + (-13 * s) + 'Z', fill: 'url(#ptPot)', stroke: '#7E3A22', 'stroke-width': 1.2 }, g);
    el('rect', { x: -20 * s, y: 8 * s, width: 40 * s, height: 8 * s, rx: 3, fill: 'url(#ptRim)', stroke: '#7E3A22', 'stroke-width': 1.2 }, g);
  }
  var ART = {
    mister: function (g) {
      pot(g);
      el('path', { d: 'M0 9 V-2', stroke: '#6B4A33', 'stroke-width': 3 }, g);
      var b = el('g', { class: 'pt-bottle' }, g);
      el('rect', { x: -11, y: -36, width: 22, height: 36, rx: 6, fill: 'url(#ptBottle)', stroke: '#2F5E54', 'stroke-width': 1.3 }, b);
      el('path', { d: 'M-8 -36 V-44 H8 L16 -46 V-40 H8 V-36Z', fill: '#E8F1EC', stroke: '#2F5E54', 'stroke-width': 1.2 }, b);
      el('path', { d: 'M3 -36 q-2 6 -8 7', stroke: '#2F5E54', 'stroke-width': 2, fill: 'none', 'stroke-linecap': 'round' }, b);
      el('rect', { x: -7, y: -26, width: 4, height: 20, rx: 2, fill: '#fff', opacity: .55 }, b);
      el('circle', { cx: -1, cy: -14, r: 2, fill: INK }, b); el('circle', { cx: 6, cy: -14, r: 2, fill: INK }, b);
      el('path', { d: 'M-1 -8 q3.5 3 7 0', stroke: INK, 'stroke-width': 1.4, fill: 'none', 'stroke-linecap': 'round' }, b);
    },
    barrel: function (g) {
      el('ellipse', { cx: 0, cy: 36, rx: 24, ry: 4, fill: '#2B1A0E', opacity: .3 }, g);
      el('path', { d: 'M-18 -18 C-24 0 -24 18 -18 34 H18 C24 18 24 0 18 -18Z', fill: 'url(#ptBarrel)', stroke: '#4A2E16', 'stroke-width': 1.3 }, g);
      el('path', { d: 'M-21 -4 H21 M-22 18 H22', stroke: '#4F5A5F', 'stroke-width': 3.2 }, g);
      el('ellipse', { cx: 0, cy: -18, rx: 18, ry: 5, fill: '#7FC6E4', stroke: '#4A2E16', 'stroke-width': 1.3 }, g);
      el('ellipse', { cx: -5, cy: -19, rx: 6, ry: 1.6, fill: '#fff', opacity: .7 }, g);
      el('circle', { cx: -6, cy: 6, r: 2, fill: INK }, g); el('circle', { cx: 6, cy: 6, r: 2, fill: INK }, g);
      el('path', { d: 'M-4 12 q4 3.5 8 0', stroke: INK, 'stroke-width': 1.4, fill: 'none', 'stroke-linecap': 'round' }, g);
    },
    trap: function (g) {
      pot(g);
      el('path', { d: 'M0 10 C-2 -4 4 -14 2 -22', stroke: '#3F8A3C', 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round' }, g);
      el('path', { d: 'M-2 6 C-18 2 -24 -8 -22 -16 C-12 -10 -6 -4 -2 6Z', fill: 'url(#ptLeaf)', stroke: '#2F6A34', 'stroke-width': 1 }, g);
      var h = el('g', { class: 'pt-jaws', transform: 'translate(4 -26)' }, g);
      var up = el('g', { class: 'pt-jaw up' }, h), dn = el('g', { class: 'pt-jaw dn' }, h);
      el('path', { d: 'M0 0 C6 -20 24 -24 34 -10 C24 -8 12 -4 0 0Z', fill: '#E35B4A', stroke: '#2F6A34', 'stroke-width': 1.6 }, up);
      el('path', { d: 'M0 0 C6 -20 24 -24 34 -10', fill: 'none', stroke: '#7DBE58', 'stroke-width': 5, 'stroke-linecap': 'round' }, up);
      el('path', { d: 'M8 -14 l2 -6 M16 -18 l1 -6 M24 -18 l2 -6 M31 -13 l4 -4', stroke: '#E9F6C4', 'stroke-width': 1.6, 'stroke-linecap': 'round' }, up);
      el('path', { d: 'M0 0 C6 20 24 24 34 10 C24 8 12 4 0 0Z', fill: '#E35B4A', stroke: '#2F6A34', 'stroke-width': 1.6 }, dn);
      el('path', { d: 'M0 0 C6 20 24 24 34 10', fill: 'none', stroke: '#7DBE58', 'stroke-width': 5, 'stroke-linecap': 'round' }, dn);
      el('path', { d: 'M8 14 l2 6 M16 18 l1 6 M24 18 l2 6 M31 13 l4 4', stroke: '#E9F6C4', 'stroke-width': 1.6, 'stroke-linecap': 'round' }, dn);
      el('circle', { cx: 6, cy: -8, r: 2.4, fill: '#fff' }, up); el('circle', { cx: 6.6, cy: -8, r: 1.3, fill: INK }, up);
    },
    marigold: function (g) {
      pot(g, 1.08);
      var bush = el('g', { class: 'pt-bush' }, g);
      [[-16, 2, 13], [16, 2, 13], [0, -2, 15], [-9, -14, 12], [10, -14, 12]].forEach(function (b) { el('circle', { cx: b[0], cy: b[1], r: b[2], fill: 'url(#ptLeaf)', stroke: '#2F6A34', 'stroke-width': 1 }, bush); });
      [[-14, -6], [12, -8], [-1, -20], [2, 2], [-18, 6], [18, 4]].forEach(function (f, i) {
        var fl = el('g', { class: 'pt-bloom', transform: 'translate(' + f[0] + ' ' + f[1] + ')' }, bush);
        el('circle', { r: i < 3 ? 9 : 7, fill: 'url(#ptMari)', stroke: '#B85B12', 'stroke-width': .8 }, fl);
        el('circle', { r: i < 3 ? 5 : 4, fill: 'none', stroke: '#C2621A', 'stroke-width': 1.2, 'stroke-dasharray': '2 2' }, fl);
      });
    },
    trowel: function (g) {
      el('path', { d: 'M-4 -30 C-16 -18 -14 4 0 14 C14 4 16 -18 4 -30Z', fill: '#C9D1D6', stroke: '#5B6670', 'stroke-width': 1.4 }, g);
      el('path', { d: 'M0 -26 V8', stroke: '#fff', 'stroke-width': 1.6, opacity: .7 }, g);
      el('rect', { x: -5, y: 12, width: 10, height: 26, rx: 4, fill: '#B87A47', stroke: '#6E4326', 'stroke-width': 1.3 }, g);
    }
  };
  game.querySelectorAll('[data-art]').forEach(function (span) { // tray icons
    var s = el('svg', { viewBox: '-36 -56 72 100', 'aria-hidden': 'true' }); ART[span.getAttribute('data-art')](el('g', {}, s)); span.appendChild(s);
  });

  var PEST_ART = {
    aphid: function (g) {
      var b = el('g', { class: 'pt-walk' }, g);
      el('path', { d: 'M-6 6 l-5 8 M0 7 l-2 9 M6 6 l3 9', stroke: '#4C7A22', 'stroke-width': 1.6, 'stroke-linecap': 'round' }, b);
      el('ellipse', { cx: 2, cy: 0, rx: 14, ry: 10, fill: 'url(#ptAphid)', stroke: '#4C7A22', 'stroke-width': 1.2 }, b);
      el('path', { d: 'M-10 -6 q-10 -10 -16 -8 M-8 -8 q-4 -12 -10 -14', stroke: '#4C7A22', 'stroke-width': 1.3, fill: 'none', 'stroke-linecap': 'round' }, b);
      el('circle', { cx: -7, cy: -2, r: 2.6, fill: '#fff' }, b); el('circle', { cx: -7.6, cy: -2, r: 1.4, fill: INK }, b);
      el('ellipse', { cx: 6, cy: -5, rx: 5, ry: 2, fill: '#fff', opacity: .5 }, b);
    },
    cat: function (g) {
      for (var i = 5; i >= 1; i--) {
        var sgm = el('g', { class: 'pt-seg' }, g);
        sgm.style.animationDelay = (-i * .14) + 's';
        var inner = el('g', { transform: 'translate(' + (i * 11) + ' 0)' }, sgm);
        el('circle', { r: 9.5, fill: 'url(#ptCat)', stroke: '#3F6E2A', 'stroke-width': 1 }, inner);
        el('circle', { cx: 1, cy: -4, r: 1.8, fill: '#FFE27A' }, inner);
      }
      var hd = el('g', { class: 'pt-seg' }, g);
      el('path', { d: 'M-3 -9 q-3 -9 -9 -10 M2 -10 q1 -9 -3 -12', stroke: '#3F6E2A', 'stroke-width': 1.3, fill: 'none', 'stroke-linecap': 'round' }, hd);
      el('circle', { r: 11, fill: 'url(#ptCat)', stroke: '#3F6E2A', 'stroke-width': 1.1 }, hd);
      el('circle', { cx: -4.5, cy: -2.5, r: 3.4, fill: '#fff' }, hd); el('circle', { cx: -5.4, cy: -2.4, r: 1.8, fill: INK }, hd);
      el('path', { d: 'M-8 4 q3 2.6 6 0', stroke: INK, 'stroke-width': 1.3, fill: 'none', 'stroke-linecap': 'round' }, hd);
    },
    snail: function (g) {
      var b = el('g', { class: 'pt-slide' }, g);
      el('path', { d: 'M-26 10 C-24 2 -6 0 20 6 C28 8 28 14 18 14 H-22 C-28 14 -28 12 -26 10Z', fill: '#E0CDA6', stroke: '#9C8560', 'stroke-width': 1.2 }, b);
      el('path', { d: 'M-18 4 L-24 -14 M-12 3 L-14 -15', stroke: '#9C8560', 'stroke-width': 2, 'stroke-linecap': 'round' }, b);
      el('circle', { cx: -24, cy: -15, r: 2.6, fill: INK }, b); el('circle', { cx: -14, cy: -16, r: 2.6, fill: INK }, b);
      el('circle', { cx: 4, cy: -8, r: 17, fill: 'url(#ptShell)', stroke: '#8A5A30', 'stroke-width': 1.4 }, b);
      el('path', { d: 'M4 -8 m-8 0 a8 8 0 1 1 8 8 a5 5 0 1 1 -4 -5 a2.4 2.4 0 1 1 2 2', stroke: '#8A5A30', 'stroke-width': 1.4, fill: 'none' }, b);
      el('ellipse', { cx: -3, cy: -18, rx: 5, ry: 2.4, fill: '#fff', opacity: .55 }, b);
    }
  };

  /* ---------- rules ---------- */
  var UNIT = {
    mister: { cost: 50, hp: 5, cd: 4 },
    barrel: { cost: 50, hp: 5, cd: 6 },
    trap: { cost: 125, hp: 7, cd: 12 },
    marigold: { cost: 50, hp: 22, cd: 16 }
  };
  var PEST = {
    aphid: { hp: 3, speed: 24, bite: 1, reward: 10, y: 22 },
    cat: { hp: 7, speed: 17, bite: 1, reward: 15, y: 20 },
    snail: { hp: 16, speed: 10, bite: 1.4, reward: 30, y: 16 }
  };
  var POINTS = { aphid: 10, cat: 15, snail: 30 };
  // three waves a round; every round brings more, tougher, faster pests
  function makeWave(round, w) {
    var n = 3 + round * 2 + w * 2, list = [];
    for (var i = 0; i < n; i++) {
      var r = rnd(), snailP = round > 1 || w === 3 ? .12 + round * .03 : 0, catP = round > 1 || w > 1 ? .3 : 0;
      list.push(r < snailP ? 'snail' : r < snailP + catP ? 'cat' : 'aphid');
    }
    return list;
  }

  /* ---------- your houseplants (the leaves you protect) ---------- */
  var HOMES = [];
  ['Monty', 'Goldie', 'Basil', 'Fern'].forEach(function (name, ln) {
    var g = el('g', { class: 'pt-homeplant' }, G.ptHome); tf(g, HOME_X, cy(ln) - 2);
    pot(g, .95);
    var body = el('g', { class: 'pt-hbody' }, g);
    if (ln === 0) [[-12, -16, -30], [12, -18, 30], [0, -30, 0]].forEach(function (a) { el('path', { d: 'M0 10 Q' + (a[0] / 2) + ' ' + (a[1] / 2) + ' ' + a[0] + ' ' + a[1], stroke: '#3F7F37', 'stroke-width': 2.4, fill: 'none' }, body); el('ellipse', { cx: a[0], cy: a[1], rx: 14, ry: 10, transform: 'rotate(' + a[2] + ' ' + a[0] + ' ' + a[1] + ')', fill: 'url(#ptLeaf)', stroke: '#2F6A34', 'stroke-width': 1 }, body); });
    else if (ln === 1) [[-12, -2], [12, -4], [-4, -16], [8, -22]].forEach(function (a) { el('path', { d: 'M' + a[0] + ' ' + a[1] + ' c-6 -4 -9 -10 -5 -14 c3 -2 5 0 5 2 c0 -2 2 -4 5 -2 c4 4 1 10 -5 14z', fill: '#7DBE58', stroke: '#2F6A34', 'stroke-width': .9 }, body); });
    else if (ln === 2) [[-10, -2, 9], [10, -2, 9], [0, -14, 10], [-8, -24, 8], [8, -24, 8]].forEach(function (a) { el('ellipse', { cx: a[0], cy: a[1], rx: a[2], ry: a[2] * .7, fill: '#86C65E', stroke: '#2F6A34', 'stroke-width': 1 }, body); });
    else for (var f = -2; f <= 2; f++) el('path', { d: 'M0 10 Q' + (f * 7) + ' -10 ' + (f * 14) + ' -22', stroke: '#4E9A47', 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round', 'stroke-dasharray': '3 2' }, body);
    var t = el('text', { x: 0, y: 30, 'text-anchor': 'middle', class: 'pt-hname' }, g); t.textContent = name;
    HOMES.push({ g: g });
  });

  // phones: trim the sky strip so the planters get the room
  function fitScene() { svg.setAttribute('viewBox', game.clientWidth < 560 ? '0 46 900 400' : '0 0 900 446'); }
  fitScene(); window.addEventListener('resize', fitScene);

  /* ---------- state ---------- */
  var S, sel = null, running = false, paused = false, last = 0, visible = true, daily = false;
  var best = parseInt(store('lp-pest-best') || '0', 10) || 0;
  function fresh() {
    return { t: 0, drops: 150, leaves: 5, round: 1, wave: 0, roundStartLeaves: 5, queue: [], spawnT: 0, waveGap: 4, units: {}, pests: [], shots: [], caught: 0, passiveT: 0,
      score: 0, combo: 0, lastCatch: -9, saved: false, cool: { mister: 0, barrel: 0, trap: 0, marigold: 0 } };
  }
  function paintBests() {
    var db = parseInt(store('lp-pest-daily-' + today()) || '0', 10) || 0;
    game.querySelector('.pt-bests').textContent = (best ? 'Your best: ' + best.toLocaleString() + ' pts' : '') + (db ? (best ? ' · ' : '') + "Today's daily best: " + db.toLocaleString() : '');
  }
  paintBests();
  function key(c, ln) { return c + ',' + ln; }

  /* ---------- sound ---------- */
  var soundOn = true; try { soundOn = localStorage.getItem('lp-game-sound') !== 'off'; } catch (e) { /* private mode */ }
  var clips = {}, lastSnd = {};
  function snd(name, vol) {
    if (!soundOn || game.classList.contains('ad-playing') || (lastSnd[name] && performance.now() - lastSnd[name] < 500)) return;
    lastSnd[name] = performance.now();
    try { var a = clips[name] || (clips[name] = new Audio('assets/sounds/' + name + '.m4a')); a.volume = vol; a.currentTime = 0; var p = a.play(); if (p && p.catch) p.catch(function () {}); clearTimeout(a._s); a._s = setTimeout(function () { a.pause(); }, 900); } catch (e) { /* no audio */ }
  }
  var sb = game.querySelector('.pt-sound');
  function paintSound() { sb.setAttribute('aria-pressed', soundOn ? 'true' : 'false'); sb.setAttribute('aria-label', soundOn ? 'Sound on. Turn game sounds off' : 'Sound off. Turn game sounds on'); }
  sb.addEventListener('click', function () { soundOn = !soundOn; paintSound(); try { localStorage.setItem('lp-game-sound', soundOn ? 'on' : 'off'); } catch (e) { /* private mode */ } });
  paintSound();

  /* ---------- HUD ---------- */
  function paint() {
    hud.drops.textContent = Math.floor(S.drops);
    hud.wave.textContent = Math.min(3, Math.max(1, S.wave));
    hud.round.textContent = S.round;
    hud.score.textContent = S.score.toLocaleString();
    var lv = ''; for (var i = 0; i < 5; i++) lv += '<i class="' + (i < S.leaves ? 'on' : '') + '"></i>';
    if (hud.leaves.innerHTML !== lv) { hud.leaves.innerHTML = lv; hud.leaves.setAttribute('aria-label', S.leaves + ' leaves left'); }
    Object.keys(UNIT).forEach(function (k) {
      var c = cards[k], cd = S.cool[k] / UNIT[k].cd;
      c.classList.toggle('poor', S.drops < UNIT[k].cost);
      c.querySelector('.pt-cd').style.transform = 'scaleY(' + Math.max(0, cd).toFixed(3) + ')';
    });
  }
  function choose(k) {
    sel = k;
    Object.keys(cards).forEach(function (n) { var on = n === sel; cards[n].classList.toggle('on', on); cards[n].setAttribute('aria-checked', on ? 'true' : 'false'); });
    G.ptGhost.innerHTML = ''; G.ptGhost.style.display = 'none'; if (sel) ART[sel](G.ptGhost);
  }
  Object.keys(cards).forEach(function (k) { cards[k].addEventListener('click', function () { choose(sel === k ? null : k); }); });
  game.addEventListener('keydown', function (e) {
    var k = { '1': 'mister', '2': 'barrel', '3': 'trap', '4': 'marigold', '5': 'trowel' }[e.key];
    if (k) { choose(k); e.preventDefault(); } else if (e.key === 'Escape') choose(null);
  });
  var bTimer = null;
  function say(msg, long) { banner.textContent = msg; banner.classList.add('on'); clearTimeout(bTimer); bTimer = setTimeout(function () { banner.classList.remove('on'); }, long ? 2600 : 1500); }

  /* ---------- placing ---------- */
  function cellAt(evt) {
    var pt = svg.createSVGPoint(); pt.x = evt.clientX; pt.y = evt.clientY;
    var p = pt.matrixTransform(svg.getScreenCTM().inverse());
    var c = Math.floor((p.x - GX) / CELL), ln = Math.floor((p.y - GY) / CELL);
    return (c >= 0 && c < COLS && ln >= 0 && ln < LANES) ? { c: c, l: ln } : null;
  }
  svg.addEventListener('pointermove', function (e) {
    if (!sel || !running) return;
    var cell = cellAt(e);
    if (!cell) { G.ptGhost.style.display = 'none'; return; }
    G.ptGhost.style.display = '';
    tf(G.ptGhost, cx(cell.c), cy(cell.l));
    var taken = !!S.units[key(cell.c, cell.l)];
    G.ptGhost.classList.toggle('bad', sel === 'trowel' ? !taken : taken || S.drops < UNIT[sel].cost || S.cool[sel] > 0);
  });
  svg.addEventListener('pointerleave', function () { G.ptGhost.style.display = 'none'; });
  svg.addEventListener('click', function (e) {
    if (!running || paused) return;
    var cell = cellAt(e); if (!cell) return;
    var k = key(cell.c, cell.l), u = S.units[k];
    if (sel === 'trowel') {
      if (!u) return;
      var back = Math.floor(UNIT[u.kind].cost / 2); S.drops += back; floatText('+' + back, u.x, u.y - 40, 'gain');
      u.g.remove(); delete S.units[k]; paint(); return;
    }
    if (!sel) { say('Pick something from the tray first'); return; }
    if (u) { say('That square is taken'); return; }
    var def = UNIT[sel];
    if (S.cool[sel] > 0) { say('Still growing a new one'); return; }
    if (S.drops < def.cost) { say('Not enough drops yet'); return; }
    S.drops -= def.cost; S.cool[sel] = def.cd;
    var g = el('g', { class: 'pt-unit pt-' + sel }, G.ptUnits);
    var inner = el('g', { class: 'pt-in' }, g); ART[sel](inner);
    tf(g, cx(cell.c), cy(cell.l));
    S.units[k] = { kind: sel, c: cell.c, l: cell.l, x: cx(cell.c), y: cy(cell.l), hp: def.hp, max: def.hp, g: g, t: 0, chew: 0 };
    snd('pour', .22);
    paint();
  });

  /* ---------- waves ---------- */
  function startWave() {
    S.wave++;
    if (S.wave > 3) { roundClear(); return; }
    S.queue = makeWave(S.round, S.wave); S.spawnT = 1.2;
    say('Round ' + S.round + ' · wave ' + S.wave + (S.wave === 3 ? ': the big one!' : S.round === 1 && S.wave === 1 ? ': aphids!' : ''), true);
    paint();
  }
  function spawn(kind) {
    var lane = Math.floor(rnd() * LANES), d = PEST[kind];
    var g = el('g', { class: 'pt-pest pt-' + kind }, G.ptPests); PEST_ART[kind](g);
    var bar = el('rect', { x: -14, y: -34, width: 28, height: 4, rx: 2, class: 'pt-hp' }, g);
    var hp = Math.round(d.hp * (1 + .3 * (S.round - 1)));
    S.pests.push({ kind: kind, l: lane, x: 930, y: cy(lane) + d.y - 14, hp: hp, max: hp, d: d, g: g, bar: bar, slow: 0, sp: d.speed * (1 + .07 * (S.round - 1)) });
  }

  /* ---------- effects ---------- */
  function floatText(txt, x, y, cls) {
    var t = el('text', { x: x, y: y, 'text-anchor': 'middle', class: 'pt-float ' + (cls || '') }, G.ptFx); t.textContent = txt;
    setTimeout(function () { t.remove(); }, 1100);
  }
  function puff(x, y, color) {
    var g = el('g', { class: 'pt-puff' }, G.ptFx); tf(g, x, y);
    for (var i = 0; i < 6; i++) { var a = i / 6 * Math.PI * 2; el('circle', { cx: Math.cos(a) * 8, cy: Math.sin(a) * 6, r: 6, fill: color || '#EAF8FF' }, g); }
    setTimeout(function () { g.remove(); }, 700);
  }
  function flash(g, cls) { g.classList.remove(cls); void g.getBBox(); g.classList.add(cls); }
  function hit(p, dmg) { p.hp -= dmg; flash(p.g, 'hurt'); if (p.hp <= 0) caught(p); }
  function caught(p) {
    if (p.dead) return; p.dead = true;
    S.caught++; S.drops += p.d.reward; floatText('+' + p.d.reward, p.x, p.y - 30, 'gain');
    // combo: catches less than 2.5 s apart multiply the points
    S.combo = S.t - S.lastCatch < 2.5 ? Math.min(4, S.combo + 1) : 1; S.lastCatch = S.t;
    var mult = [1, 1, 1.5, 2, 3][S.combo];
    S.score += Math.round(POINTS[p.kind] * mult * (1 + .2 * (S.round - 1)));
    if (mult > 1) floatText('Combo x' + mult, p.x, p.y - 52, 'combo');
    puff(p.x, p.y, '#D8F0B8'); p.g.remove();
  }
  function frontOf(p) { // the defender a pest is chewing, if any
    var hit_ = null;
    for (var k in S.units) { var u = S.units[k]; if (u.l === p.l && p.x > u.x && p.x - u.x < 40) hit_ = u; }
    return hit_;
  }

  /* ---------- loop ---------- */
  function step(dt) {
    S.t += dt;
    S.passiveT += dt; if (S.passiveT >= 5) { S.passiveT = 0; S.drops += 10; }
    for (var ck in S.cool) S.cool[ck] = Math.max(0, S.cool[ck] - dt);

    if (S.queue.length) { S.spawnT -= dt; if (S.spawnT <= 0) { spawn(S.queue.shift()); S.spawnT = Math.max(1.1, 4 - S.wave * .4 - S.round * .3) * grand(.75, 1.25); } }
    else if (!S.pests.length) { S.waveGap -= dt; if (S.waveGap <= 0) { S.waveGap = 6; startWave(); if (!running) return; } }

    for (var k in S.units) {
      var u = S.units[k]; u.t += dt;
      var ahead = S.pests.filter(function (p) { return !p.dead && p.l === u.l && p.x > u.x - 20 && p.x < 910; });
      if (u.kind === 'mister' && ahead.length && u.t >= 1.35) {
        u.t = 0; flash(u.g, 'fire');
        var s = el('circle', { r: 7, fill: 'url(#ptMist)', class: 'pt-shot' }, G.ptShots);
        S.shots.push({ x: u.x + 18, y: u.y - 42, l: u.l, g: s });
        snd('spray', .07);
      } else if (u.kind === 'barrel' && u.t >= 9) {
        u.t = 0; S.drops += 25; floatText('+25', u.x, u.y - 34, 'gain'); flash(u.g, 'fill');
      } else if (u.kind === 'trap') {
        if (u.chew > 0) { u.chew -= dt; if (u.chew <= 0) u.g.classList.remove('chew'); }
        else {
          var near = ahead.filter(function (p) { return p.x - u.x < 96; })[0];
          if (near) {
            u.g.classList.add('chew');
            if (near.kind === 'snail') { hit(near, 8); u.chew = 2.2; } else { caught(near); u.chew = near.kind === 'cat' ? 4.5 : 3; }
          }
        }
      }
    }

    S.shots = S.shots.filter(function (s) {
      s.x += 330 * dt;
      var target = S.pests.filter(function (p) { return !p.dead && p.l === s.l && Math.abs(p.x - s.x) < 18; })[0];
      if (target) { hit(target, 1); target.slow = .6; puff(s.x, s.y + 22); s.g.remove(); return false; }
      if (s.x > 920) { s.g.remove(); return false; }
      tf(s.g, s.x, s.y + 22 + Math.sin(s.x / 22) * 2); return true;
    });

    var chewing = {};
    S.pests = S.pests.filter(function (p) {
      if (p.dead) return false;
      var block = frontOf(p);
      if (block) {
        chewing[key(block.c, block.l)] = 1;
        block.hp -= p.d.bite * dt;
        if (block.kind === 'marigold') block.g.style.setProperty('--wilt', (1 - block.hp / block.max).toFixed(2));
        if (block.hp <= 0) { puff(block.x, block.y, '#C9A27A'); block.g.remove(); delete S.units[key(block.c, block.l)]; }
        p.g.classList.add('eating');
      } else {
        p.g.classList.remove('eating');
        p.slow = Math.max(0, p.slow - dt);
        p.x -= p.sp * (p.slow > 0 ? .55 : 1) * dt;
      }
      if (p.x < HOME_X + 34) { // reached a houseplant: one leaf lost
        S.leaves--; p.g.remove(); flash(HOMES[p.l].g, 'nibbled');
        floatText('-1 leaf', HOME_X, cy(p.l) - 40, 'loss');
        if (S.leaves <= 0) lost();
        return false;
      }
      tf(p.g, p.x, p.y);
      p.bar.setAttribute('width', (28 * Math.max(0, p.hp / p.max)).toFixed(1));
      return true;
    });
    for (var uk in S.units) S.units[uk].g.classList.toggle('bitten', !!chewing[uk]);
    paint();
  }
  function frame(now) {
    if (!running || paused || !visible || document.hidden) { last = 0; return; }
    var dt = last ? Math.min(.05, (now - last) / 1000) : .016; last = now;
    step(dt);
    if (running) requestAnimationFrame(frame);
  }
  function go() { if (running && !paused && visible && !document.hidden) { last = 0; requestAnimationFrame(frame); } }

  /* ---------- round control ---------- */
  function hideCards() { startCard.hidden = true; endCard.hidden = true; pauseCard.hidden = true; roundCard.hidden = true; }
  function start(isDaily) {
    ['ptUnits', 'ptPests', 'ptShots', 'ptFx'].forEach(function (id) { G[id].innerHTML = ''; });
    daily = !!isDaily; rnd = daily ? seeded(today()) : Math.random;
    S = fresh(); running = true; paused = false; hideCards();
    store('lp-pest-runs', (parseInt(store('lp-pest-runs') || '0', 10) || 0) + 1);
    game.classList.add('is-playing'); game.classList.toggle('is-daily', daily); choose('mister'); paint();
    say(daily ? "Daily garden: everyone gets today's pests" : 'Plant a mister or two. The aphids are coming', true);
    go();
  }
  function roundClear() {
    running = false; game.classList.remove('is-playing');
    S.shots.forEach(function (sh) { sh.g.remove(); }); S.shots = [];
    var lost_ = S.roundStartLeaves - S.leaves, stars = lost_ === 0 ? 3 : lost_ <= 2 ? 2 : 1;
    var bonus = 100 * S.round + 20 * S.leaves; S.score += bonus;
    var healed = Math.min(5, S.leaves + 2) - S.leaves; S.leaves += healed;
    roundCard.querySelector('.pt-round-kick').textContent = 'Round ' + S.round + ' cleared';
    roundCard.querySelectorAll('.pt-stars i').forEach(function (st, i) { st.classList.toggle('on', i < stars); });
    roundCard.querySelector('.pt-round-title').textContent = stars === 3 ? 'Not a leaf lost!' : stars === 2 ? 'Nicely defended' : 'That was close';
    roundCard.querySelector('.pt-round-text').textContent = '+' + bonus + ' round bonus · ' + S.score.toLocaleString() + ' pts so far' + (healed ? ' · your plants grew ' + healed + (healed === 1 ? ' leaf' : ' leaves') + ' back' : '') + '. Next round: tougher, faster pests.';
    roundCard.hidden = false; paint();
  }
  function nextRound() {
    roundCard.hidden = true;
    var resume = function () {
      S.round++; S.wave = 0; S.waveGap = 2.5; S.roundStartLeaves = S.leaves;
      running = true; paused = false; game.classList.add('is-playing'); paint(); go();
    };
    // a short ad between rounds; skipped during a visitor's very first game
    var firstGame = (parseInt(store('lp-pest-runs') || '0', 10) || 0) <= 1;
    if (firstGame && S.round === 1) resume(); else Ads.next('pest-round-' + (S.round + 1), resume);
  }
  function lost() {
    running = false; game.classList.remove('is-playing'); choose(null);
    var title = endCard.querySelector('.pt-end-title');
    endCard.querySelector('.pt-end-kick').textContent = 'The bugs got through';
    title.textContent = S.round > 2 ? 'What a run!' : 'Your plants need a rest';
    var nb = S.score > best; if (nb) { best = S.score; store('lp-pest-best', best); }
    if (daily) { var dk = 'lp-pest-daily-' + today(); if (S.score > (parseInt(store(dk) || '0', 10) || 0)) store(dk, S.score); }
    endCard.querySelector('.pt-end-text').textContent = 'Round ' + S.round + ', ' + S.caught + ' pests caught, ' + S.score.toLocaleString() + ' pts' + (nb ? '. A new best!' : ' (best ' + best.toLocaleString() + ').') + (daily ? ' Daily garden for ' + new Date().toLocaleDateString(undefined, { day: 'numeric', month: 'short' }) + '.' : '');
    endCard.hidden = false; saveBtn.hidden = true; paintBests();
    // one rescue per game: offered only when an ad is actually ready
    if (!S.saved && Ads.enabled) Ads.reward('pest-save', {
      available: function (show) { saveBtn.hidden = false; saveBtn.onclick = function () { saveBtn.disabled = true; show(); }; },
      viewed: function () { rescue(); },
      done: function () { saveBtn.hidden = true; saveBtn.disabled = false; }
    });
  }
  function rescue() {
    S.saved = true; S.leaves = 3;
    S.pests.forEach(function (p) { puff(p.x, p.y, '#D8F0B8'); p.g.remove(); }); S.pests = [];
    endCard.hidden = true; saveBtn.hidden = true;
    running = true; paused = false; game.classList.add('is-playing'); choose('mister'); paint();
    say('Garden saved! 3 leaves back, the planters are clear', true); go();
  }
  game.querySelector('.pt-next').addEventListener('click', nextRound);
  game.querySelector('.pt-daily').addEventListener('click', function () { start(true); });
  game.querySelector('.pt-share').addEventListener('click', function () {
    var txt = 'I reached round ' + S.round + ' with ' + S.score.toLocaleString() + ' points in LeafPulse Pest Patrol' + (daily ? " (today's daily garden)" : '') + '. Can you beat it?';
    var url = location.origin + location.pathname + '#play', btn = this;
    if (navigator.share) { navigator.share({ title: 'Pest Patrol', text: txt, url: url }).catch(function () {}); return; }
    if (navigator.clipboard) navigator.clipboard.writeText(txt + ' ' + url).then(function () { btn.textContent = 'Copied!'; setTimeout(function () { btn.textContent = 'Share score'; }, 1800); });
  });
  document.addEventListener('lp:ad', function (e) { game.classList.toggle('ad-playing', e.detail.playing); });
  game.querySelectorAll('.pt-go').forEach(function (b) { b.addEventListener('click', function () { start(false); }); });
  function pause(on) { if (!running) return; paused = on; pauseCard.hidden = !on; if (!on) go(); }
  game.querySelector('.pt-pausebtn').addEventListener('click', function () { pause(!paused); });
  game.querySelector('.pt-resume').addEventListener('click', function () { pause(false); });
  document.addEventListener('visibilitychange', function () { if (document.hidden) pause(true); });
  if ('IntersectionObserver' in window) new IntersectionObserver(function (es) {
    visible = es[0].isIntersecting;
    if (!visible && running && !paused && S.t > 0) pause(true);
    else go();
  }, { threshold: .25 }).observe(svg);

  S = fresh(); paint();
})();
