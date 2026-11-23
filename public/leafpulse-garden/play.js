// LeafPulse website mini game: "Tend the windowsill".
// Five pots ask for water, mist, feed or a turn. Pick the matching tool, tap the plant, and it grows a step;
// six good jobs and it blooms. A plant left waiting droops a little and perks up as soon as you help.
// One-minute rounds; the loop only runs while a round is on. No images: every plant is drawn in SVG.
(function () {
  'use strict';
  var game = document.getElementById('gardenGame');
  if (!game) return;
  var NS = 'http://www.w3.org/2000/svg';
  var svg = game.querySelector('.gm-scene'), plantsG = svg.querySelector('#gmPlants'), fxG = svg.querySelector('#gmFx');
  var toastEl = game.querySelector('.gm-toast'), timerBar = game.querySelector('.gm-timer i');
  var startCard = game.querySelector('.gm-start'), endCard = game.querySelector('.gm-end');
  var soundBtn = game.querySelector('.gm-sound');
  var ROUND = 60, BLOOM_AT = 6;
  var stat = {};
  game.querySelectorAll('[data-gstat]').forEach(function (el) { stat[el.getAttribute('data-gstat')] = el; });

  function el(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function rand(a, b) { return a + Math.random() * (b - a); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }

  /* ---------- tools ---------- */
  var TOOLS = { water: 'Water', mist: 'Mist', feed: 'Feed', turn: 'Turn' };
  var ICON = { // small glyphs drawn inside the need bubbles (24-unit boxes)
    water: 'M4 9h11v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zM15 12l5-4M6 9V7a3.5 3.5 0 0 1 7 0v2',
    mist: 'M9 9h6v11a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1zM10 9V6h4l2-2M19 7h.01M21 5h.01M21 9h.01',
    feed: 'M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3M7.5 15h9',
    turn: 'M20 11a8 8 0 0 0-14.3-4.9L4 8M4 3v5h5M4 13a8 8 0 0 0 14.3 4.9L20 16M20 21v-5h-5'
  };
  var tool = 'water';
  var toolBtns = game.querySelectorAll('.gm-tool');
  function setTool(t) {
    tool = t;
    toolBtns.forEach(function (b) { var on = b.getAttribute('data-tool') === t; b.classList.toggle('on', on); b.setAttribute('aria-checked', on ? 'true' : 'false'); });
  }
  toolBtns.forEach(function (b) { b.addEventListener('click', function () { setTool(b.getAttribute('data-tool')); }); });
  game.addEventListener('keydown', function (e) {
    var k = { '1': 'water', '2': 'mist', '3': 'feed', '4': 'turn' }[e.key];
    if (k) { setTool(k); e.preventDefault(); }
  });

  /* ---------- sound (soft CC0 recordings; off with one tap, remembered) ---------- */
  var soundOn = true;
  try { soundOn = localStorage.getItem('lp-game-sound') !== 'off'; } catch (e) { /* private mode */ }
  var clips = {};
  function play(name, vol) {
    if (!soundOn) return;
    try {
      var a = clips[name] || (clips[name] = new Audio('assets/sounds/' + name + '.m4a'));
      a.volume = vol; a.currentTime = 0; var p = a.play(); if (p && p.catch) p.catch(function () {});
      clearTimeout(a._stop); a._stop = setTimeout(function () { a.pause(); }, 1400);
    } catch (e) { /* no audio */ }
  }
  function paintSound() {
    soundBtn.setAttribute('aria-pressed', soundOn ? 'true' : 'false');
    soundBtn.setAttribute('aria-label', soundOn ? 'Sound on. Turn garden sounds off' : 'Sound off. Turn garden sounds on');
  }
  soundBtn.addEventListener('click', function () {
    soundOn = !soundOn; paintSound();
    try { localStorage.setItem('lp-game-sound', soundOn ? 'on' : 'off'); } catch (e) { /* private mode */ }
  });
  paintSound();

  /* ---------- the plants ---------- */
  // Each plant is drawn around its pot rim (0,0), growing upward. Parts: st1 seedling, st2 more leaves,
  // st3 bud, st4 bloom. needs = what it may ask for (cacti ask for a turn more than a drink).
  var X = [112, 256, 400, 544, 688], RIM = 250;
  var KINDS = [
    { name: 'Tilly', kind: 'tulip', needs: ['water', 'water', 'feed', 'turn'] },
    { name: 'Sunny', kind: 'sunflower', needs: ['water', 'feed', 'turn', 'turn'] },
    { name: 'Daisy', kind: 'daisy', needs: ['water', 'mist', 'mist', 'feed'] },
    { name: 'Spike', kind: 'cactus', needs: ['turn', 'turn', 'feed', 'water'] },
    { name: 'Gerry', kind: 'geranium', needs: ['water', 'feed', 'mist', 'turn'] }
  ];
  var LEAF = '#5DA84A', LEAF2 = '#7DBE58', EDGE = '#2F6A34', STEM = '#3F8A3C';
  function leaf(g, d, fill) { el('path', { d: d, fill: fill || LEAF, stroke: EDGE, 'stroke-width': 1.2 }, g); }
  function draw(kind, body) {
    var s1 = el('g', { class: 'st st1' }, body), s2 = el('g', { class: 'st st2' }, body), s3 = el('g', { class: 'st st3' }, body), s4 = el('g', { class: 'st st4' }, body);
    var k;
    if (kind === 'tulip') {
      el('path', { d: 'M0 0 Q-4 -60 0 -122', stroke: STEM, 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round' }, s1);
      leaf(s1, 'M0 -6 C-30 -26 -36 -66 -22 -94 C-14 -60 -8 -30 0 -6Z');
      leaf(s1, 'M0 -6 C24 -22 30 -52 20 -72 C12 -48 6 -26 0 -6Z', LEAF2);
      leaf(s2, 'M0 -40 C28 -58 36 -88 26 -110 C16 -82 8 -60 0 -40Z');
      el('path', { d: 'M-8 -122 C-10 -138 -4 -146 0 -142 C4 -146 10 -138 8 -122 C4 -116 -4 -116 -8 -122Z', fill: '#9BCB72', stroke: EDGE, 'stroke-width': 1 }, s3);
      el('path', { d: 'M-17 -120 C-19 -146 -8 -158 0 -150 C8 -158 19 -146 17 -120 C10 -110 -10 -110 -17 -120Z', fill: 'url(#gmTulip)', stroke: '#9B4B36', 'stroke-width': 1.2 }, s4);
      el('path', { d: 'M-5 -144 Q-7 -130 -5 -118', stroke: '#FFE3D8', 'stroke-width': 2, fill: 'none', 'stroke-linecap': 'round' }, s4);
    } else if (kind === 'sunflower') {
      el('path', { d: 'M0 0 Q-6 -80 0 -150', stroke: STEM, 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round' }, s1);
      leaf(s1, 'M-1 -30 C-26 -32 -40 -50 -40 -64 C-22 -62 -8 -48 -1 -30Z');
      leaf(s1, 'M1 -46 C24 -48 36 -64 36 -78 C18 -76 6 -62 1 -46Z', LEAF2);
      leaf(s2, 'M-1 -92 C-22 -94 -34 -108 -34 -120 C-18 -118 -6 -106 -1 -92Z');
      leaf(s2, 'M1 -104 C20 -106 30 -118 30 -130 C16 -128 6 -118 1 -104Z', LEAF2);
      el('circle', { cx: 0, cy: -156, r: 10, fill: '#8CC266', stroke: EDGE, 'stroke-width': 1.2 }, s3);
      var hd = el('g', { transform: 'translate(0 -160)' }, s4);
      for (k = 0; k < 14; k++) el('ellipse', { rx: 5.5, ry: 14, transform: 'rotate(' + (k * 360 / 14) + ') translate(0 -18)', fill: 'url(#gmPetal)', stroke: '#C98A2A', 'stroke-width': .8 }, hd);
      el('circle', { r: 15, fill: '#6E4426', stroke: '#4A2E16', 'stroke-width': 1 }, hd);
    } else if (kind === 'daisy') {
      [[-16, -70, -1], [2, -84, 1], [18, -64, 1]].forEach(function (p, i) {
        el('path', { d: 'M' + (p[0] * .3) + ' 0 Q' + (p[0] * .6) + ' ' + (p[1] / 2) + ' ' + p[0] + ' ' + p[1], stroke: STEM, 'stroke-width': 2.6, fill: 'none', 'stroke-linecap': 'round' }, i === 1 ? s2 : s1);
      });
      leaf(s1, 'M-2 -6 C-24 -12 -32 -30 -28 -40 C-16 -32 -6 -20 -2 -6Z');
      leaf(s1, 'M2 -8 C22 -14 30 -30 28 -42 C16 -32 6 -22 2 -8Z', LEAF2);
      leaf(s2, 'M0 -30 C-20 -40 -26 -56 -20 -66 C-12 -54 -4 -44 0 -30Z', LEAF2);
      [[-16, -70], [2, -84], [18, -64]].forEach(function (p) {
        el('circle', { cx: p[0], cy: p[1], r: 5, fill: '#B9DB8F', stroke: EDGE, 'stroke-width': 1 }, s3);
        var f = el('g', { transform: 'translate(' + p[0] + ' ' + p[1] + ')' }, s4);
        for (k = 0; k < 8; k++) el('ellipse', { rx: 3, ry: 8, transform: 'rotate(' + (k * 45) + ') translate(0 -7)', fill: '#fff', stroke: '#D9D3E6', 'stroke-width': .8 }, f);
        el('circle', { r: 4.4, fill: '#F5B83D', stroke: '#C98A2A', 'stroke-width': .8 }, f);
      });
    } else if (kind === 'cactus') {
      el('ellipse', { cx: 0, cy: -28, rx: 18, ry: 28, fill: 'url(#gmCactus)', stroke: EDGE, 'stroke-width': 1.4 }, s1);
      el('path', { d: 'M0 -54 V-4 M-9 -48 Q-12 -28 -9 -8 M9 -48 Q12 -28 9 -8', stroke: '#2F6A34', 'stroke-width': 1, fill: 'none', opacity: .6 }, s1);
      el('path', { d: 'M18 -50 C30 -50 34 -60 34 -76 C34 -84 26 -84 26 -76 C26 -66 24 -62 18 -62Z', fill: 'url(#gmCactus)', stroke: EDGE, 'stroke-width': 1.3 }, s2);
      el('ellipse', { cx: 0, cy: -46, rx: 24, ry: 46, fill: 'url(#gmCactus)', stroke: EDGE, 'stroke-width': 1.4 }, s2);
      el('path', { d: 'M0 -88 V-6 M-12 -80 Q-16 -46 -12 -12 M12 -80 Q16 -46 12 -12', stroke: '#2F6A34', 'stroke-width': 1, fill: 'none', opacity: .6 }, s2);
      el('ellipse', { cx: 0, cy: -96, rx: 6, ry: 8, fill: '#F7A7BE', stroke: '#B8556F', 'stroke-width': 1 }, s3);
      var fl = el('g', { transform: 'translate(0 -98)' }, s4);
      for (k = 0; k < 9; k++) el('ellipse', { rx: 4.4, ry: 11, transform: 'rotate(' + (k * 40) + ') translate(0 -8)', fill: '#F9B8CC', stroke: '#C2607D', 'stroke-width': .8 }, fl);
      el('circle', { r: 4, fill: '#FFE07A' }, fl);
    } else { // geranium
      [[-20, -18, 16], [18, -22, 15], [0, -30, 17]].forEach(function (c) { el('circle', { cx: c[0], cy: c[1], r: c[2], fill: LEAF, stroke: EDGE, 'stroke-width': 1.2 }, s1); el('circle', { cx: c[0], cy: c[1], r: c[2] * .55, fill: 'none', stroke: '#2F6A34', 'stroke-width': 2.4, opacity: .3 }, s1); });
      el('path', { d: 'M0 -30 Q-3 -70 0 -104', stroke: STEM, 'stroke-width': 3, fill: 'none' }, s2);
      [[-22, -52, 14], [22, -58, 13]].forEach(function (c) { el('circle', { cx: c[0], cy: c[1], r: c[2], fill: LEAF2, stroke: EDGE, 'stroke-width': 1.2 }, s2); });
      [[-6, -108], [4, -112], [0, -102], [7, -104]].forEach(function (c) { el('circle', { cx: c[0], cy: c[1], r: 4, fill: '#9BCB72', stroke: EDGE, 'stroke-width': .8 }, s3); });
      [[-10, -110], [0, -118], [10, -110], [-6, -100], [7, -100], [0, -108]].forEach(function (c) { el('circle', { cx: c[0], cy: c[1], r: 7.5, fill: 'url(#gmGer)', stroke: '#9E2F2A', 'stroke-width': .8 }, s4); });
    }
  }

  var plants = KINDS.map(function (k, i) {
    var g = el('g', { class: 'gm-plant', transform: 'translate(' + X[i] + ' ' + RIM + ')', tabindex: 0, role: 'button' }, plantsG);
    el('rect', { x: -70, y: -238, width: 140, height: 300, fill: 'transparent' }, g); // the whole column is the tap target
    el('ellipse', { cx: 0, cy: 50, rx: 44, ry: 6, fill: '#2E3A20', opacity: .18 }, g);
    var body = el('g', { class: 'gm-body' }, g);
    draw(k.kind, body);
    el('path', { d: 'M-34 6 H34 L28 50 H-28 Z', fill: 'url(#gmPot)', stroke: '#7E3A22', 'stroke-width': 1.3 }, g);
    el('rect', { x: -38, y: -4, width: 76, height: 13, rx: 5, fill: 'url(#gmRim)', stroke: '#7E3A22', 'stroke-width': 1.3 }, g);
    var tag = el('text', { class: 'gm-name', x: 0, y: 34, 'text-anchor': 'middle' }, g); tag.textContent = k.name;
    // need bubble, sitting above the plant
    var bub = el('g', { class: 'gm-bubble', transform: 'translate(0 -208)' }, g);
    el('circle', { r: 25, class: 'gm-bub-bg' }, bub);
    var ring = el('circle', { r: 29, class: 'gm-ring', pathLength: 100 }, bub);
    var ic = el('path', { class: 'gm-bub-ic', transform: 'translate(-12 -12)' }, bub);
    el('path', { d: 'M-6 24 L0 33 L6 24', class: 'gm-bub-tail' }, bub);
    var p = { i: i, k: k, g: g, body: body, bub: bub, ring: ring, ic: ic, stage: 1, care: 0, need: null, wilt: false, bloomed: false };
    g.addEventListener('click', function () { tap(p); });
    g.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tap(p); } });
    return p;
  });
  function label(p) {
    var s = p.k.name + ' the ' + p.k.kind + (p.need ? ', asking for ' + TOOLS[p.need.type].toLowerCase() : ', happy') + (p.wilt ? ', drooping' : '');
    p.g.setAttribute('aria-label', s);
  }
  function setStage(p, n) {
    p.stage = n;
    for (var s = 2; s <= 4; s++) p.g.classList.toggle('g' + s, n >= s);
  }
  function reset() {
    plants.forEach(function (p) { p.care = 0; p.need = null; p.wilt = false; p.bloomed = false; setStage(p, 1); p.g.classList.remove('asking', 'wilt', 'urgent'); label(p); });
  }
  reset();

  // small screens: trim the empty edges so the plants are bigger
  function fitScene() { svg.setAttribute('viewBox', game.clientWidth < 560 ? '44 0 712 336' : '0 0 800 360'); }
  fitScene(); window.addEventListener('resize', fitScene);

  /* ---------- round ---------- */
  var playing = false, t = 0, last = 0, nextSpawn = 0, score = { jobs: 0, blooms: 0, best: 0 }, missed = 0;
  try { score.best = parseInt(localStorage.getItem('lp-game-best') || '0', 10) || 0; } catch (e) { /* private mode */ }
  function paintStats() { stat.jobs.textContent = score.jobs; stat.blooms.textContent = score.blooms; stat.best.textContent = score.best; }
  paintStats();

  var toastT = null;
  function toast(msg) {
    toastEl.textContent = msg; toastEl.classList.add('on');
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('on'); }, 1800);
  }

  function ask(p) {
    var type = pick(p.k.needs);
    var patience = Math.max(4.6, 8.5 - t * 0.06); // waits less as the minute goes on
    p.need = { type: type, t: 0, T: patience };
    p.ic.setAttribute('d', ICON[type]);
    p.g.classList.add('asking'); p.g.classList.remove('urgent');
    label(p);
  }
  function spawn() {
    var free = plants.filter(function (p) { return !p.need; });
    var asking = plants.length - free.length, cap = t < 15 ? 2 : t < 35 ? 3 : 4;
    if (!free.length || asking >= cap) return;
    ask(pick(free));
  }

  function tap(p) {
    if (!playing) { if (endCard.hidden && !startCard.hidden) start(); return; }
    if (!p.need) { toast(p.k.name + ' is happy right now'); return; }
    if (p.need.type !== tool) { toast(p.k.name + ' would like ' + (p.need.type === 'turn' ? 'a turn' : p.need.type === 'feed' ? 'some food' : p.need.type === 'mist' ? 'a mist' : 'some water')); nudge(p); return; }
    fx(p, tool);
    p.need = null; p.g.classList.remove('asking', 'urgent');
    if (p.wilt) { p.wilt = false; p.g.classList.remove('wilt'); }
    score.jobs++; p.care++;
    var target = Math.min(4, 1 + Math.floor(p.care / 2));
    if (target > p.stage) setStage(p, target);
    if (p.stage === 4 && !p.bloomed) { p.bloomed = true; score.blooms++; sparkle(p, true); toast(p.k.name + ' is in bloom!'); }
    label(p); paintStats();
  }
  function nudge(p) { p.g.classList.remove('nudge'); void p.g.getBBox(); p.g.classList.add('nudge'); }

  /* ---------- little effects ---------- */
  function fx(p, type) {
    var x = X[p.i], g = el('g', { class: 'gm-fx fx-' + type }, fxG);
    var k;
    if (type === 'water') {
      play('pour', .35);
      for (k = 0; k < 9; k++) {
        var d = el('ellipse', { cx: x + rand(-26, 26), cy: RIM - 120 + rand(-10, 10), rx: 2.4, ry: 4, class: 'drop' }, g);
        d.style.animationDelay = (k * 0.05).toFixed(2) + 's';
      }
    } else if (type === 'mist') {
      play('spray', .4);
      for (k = 0; k < 7; k++) {
        var m = el('circle', { cx: x + rand(-30, 30), cy: RIM - rand(50, 130), r: rand(6, 12), class: 'puff' }, g);
        m.style.animationDelay = (k * 0.04).toFixed(2) + 's';
      }
    } else if (type === 'feed') {
      for (k = 0; k < 8; k++) {
        var f = el('circle', { cx: x + rand(-22, 22), cy: RIM - 4, r: rand(2, 3.4), class: 'grain' }, g);
        f.style.animationDelay = (k * 0.05).toFixed(2) + 's';
      }
    } else {
      p.body.classList.remove('turning'); void p.body.getBBox(); p.body.classList.add('turning');
    }
    sparkle(p, false);
    setTimeout(function () { g.remove(); }, 1400);
  }
  function sparkle(p, big) {
    var g = el('g', { class: 'gm-spark' + (big ? ' big' : ''), transform: 'translate(' + X[p.i] + ' ' + (RIM - (p.stage >= 3 ? 150 : 90)) + ')' }, fxG);
    for (var k = 0; k < (big ? 10 : 6); k++) {
      var a = k / (big ? 10 : 6) * Math.PI * 2, r1 = big ? 26 : 18, r2 = big ? 44 : 30;
      el('path', { d: 'M' + (Math.cos(a) * r1).toFixed(1) + ' ' + (Math.sin(a) * r1).toFixed(1) + ' L' + (Math.cos(a) * r2).toFixed(1) + ' ' + (Math.sin(a) * r2).toFixed(1) }, g);
    }
    setTimeout(function () { g.remove(); }, 1200);
  }

  /* ---------- loop: only while a round is on ---------- */
  function frame(now) {
    if (!playing) return;
    var dt = last ? Math.min(.05, (now - last) / 1000) : .016; last = now; t += dt;
    timerBar.style.transform = 'scaleX(' + Math.max(0, 1 - t / ROUND).toFixed(4) + ')';
    if (t >= nextSpawn) { spawn(); nextSpawn = t + Math.max(.9, 2.1 - t * 0.02) * rand(.8, 1.2); }
    plants.forEach(function (p) {
      if (!p.need) return;
      p.need.t += dt;
      var left = Math.max(0, 1 - p.need.t / p.need.T);
      p.ring.style.strokeDashoffset = (100 - left * 100).toFixed(1);
      p.g.classList.toggle('urgent', left < .35);
      if (left <= 0 && !p.wilt) { p.wilt = true; p.g.classList.add('wilt'); missed++; label(p); }
    });
    if (t >= ROUND) return end();
    requestAnimationFrame(frame);
  }
  function start() {
    reset(); score.jobs = 0; score.blooms = 0; missed = 0; paintStats();
    startCard.hidden = true; endCard.hidden = true; game.classList.add('is-playing');
    playing = true; t = 0; last = 0; nextSpawn = .6;
    timerBar.style.transform = 'scaleX(1)';
    ask(plants[0]);
    requestAnimationFrame(frame);
  }
  function end() {
    playing = false; game.classList.remove('is-playing');
    plants.forEach(function (p) { p.need = null; p.g.classList.remove('asking', 'urgent'); label(p); });
    var best = score.jobs > score.best;
    if (best) { score.best = score.jobs; try { localStorage.setItem('lp-game-best', String(score.best)); } catch (e) { /* private mode */ } }
    paintStats();
    game.querySelector('.gm-end-title').textContent = score.blooms === 5 ? 'The whole sill is in bloom!' : best ? 'A new best!' : score.jobs >= 15 ? 'Lovely work' : 'A gentle start';
    game.querySelector('.gm-end-text').textContent = score.jobs + ' jobs done, ' + score.blooms + ' of 5 in bloom' + (missed ? ', ' + missed + (missed === 1 ? ' plant' : ' plants') + ' waited a little long' : '') + '. In the app, one calm reminder a day keeps them all happy.';
    endCard.hidden = false;
  }
  game.querySelectorAll('.gm-go').forEach(function (b) { b.addEventListener('click', start); });

})();
