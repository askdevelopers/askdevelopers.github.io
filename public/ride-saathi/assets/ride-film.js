/* RideSaathi home page, phones and tablets: "Watch a ride". The wide-screen trip (trip.js) runs in the page margins,
   which narrow screens don't have, so they get the same morning as a short film: Rahul's car leaves home, picks up
   You, Anita and Vikram at their stops (the door opens, the rider walks in and sits down) and reaches the office.
   A metro line on top shows the stations; a meter below counts the time, riders on board, shared km and CO₂.
   Same people, times, seats and drawings as trip.js. Built on first tap. Calm motion only; no button at all for
   prefers-reduced-motion. No inline scripts or style attributes (strict CSP). */
(function () {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';
  var root = document.documentElement;
  var openBtn = document.getElementById('rfOpen');
  var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  if (!openBtn || reduce) return;

  /* ---------- The morning (keep in step with PLAN and RIDES in trip.js) ---------- */
  var KM = 125; // scene units per km
  var STATIONS = [
    { b: 'Home', time: '07:40', km: 0 },
    { b: 'You', time: '07:52', km: 10, ride: 14, seat: 'bl', to: 'br', pc: 'pc-sun', sk: 'sk-1', av: 'av-sun', ini: 'Y' },
    { b: 'Anita', time: '08:01', km: 17, ride: 7, seat: 'bl', pc: 'pc-lilac', sk: 'sk-2', av: 'av-lilac', ini: 'AS' },
    { b: 'Vikram', time: '08:09', km: 20, ride: 4, seat: 'fl', pc: 'pc-mint', sk: 'sk-3', av: 'av-mint', ini: 'V' },
    { b: 'Office', time: '08:30', km: 24 }
  ];
  var RIDERS = STATIONS.slice(1, 4);
  var LAST = STATIONS.length - 1, ROUTE_KM = STATIONS[LAST].km;
  var KG_PER_KM = 0.12; // 120 g CO₂ per km of petrol car not driven (impact.html, "How we count")
  var CAPS = {
    hold: '07:40 · Rahul leaves home for work. Three seats are free.',
    d1: 'He drives his usual route. Riders along it asked for his seats.',
    s1: '07:52 · You get in at your stop, a short walk from home.',
    d2: 'You ride 14 km and pay only for those 14 km.',
    s2: '08:01 · Anita gets in. She rides the last 7 km.',
    d3: 'Same road, same time, one car.',
    s3: '08:09 · Vikram takes the front seat for 4 km.',
    d4: 'Four people, one car: three cars fewer on the road.',
    office: '08:30 · At the office. Everyone pays Rahul their share.'
  };

  /* ---------- The car (#car in index.html: viewBox 200×404, nose up) ---------- */
  var CAR_K = 0.42, CAR_W = 200 * CAR_K, CAR_H = 404 * CAR_K;
  var LANE_X = 138, PULL_X = 134;                   // car centre while driving / pulled in to the kerb
  var SEAT = { fl: [75, 205], dr: [125, 205], bl: [75, 291], br: [125, 291] };
  var DOOR = { fl: [164, 76], bl: [246, 62] };      // kerb-side doors: hinge y and length, hinged at the front
  function doorDy(d) { return CAR_K * (DOOR[d][0] + DOOR[d][1] / 2) - CAR_H / 2; } // door centre, from car centre
  var KERB_X = 89.5, STAND_X = 52, REACH_X = PULL_X - CAR_W / 2 + 9;

  /* ---------- Timeline: one segment after another; everything on screen is a function of the time ---------- */
  var SEGS = [], END = 0, OFFICE = null;
  function seg(o) { o.t0 = END; END += o.dur; SEGS.push(o); return o; }
  seg({ k: 'hold', s: 0, st: 0, dur: 2.2, cap: 'hold' });
  for (var i = 1; i <= LAST; i++) {
    var s0 = STATIONS[i - 1].km * KM, s1 = STATIONS[i].km * KM;
    seg({ k: 'drive', s0: s0, s1: s1, dur: 1.6 + (s1 - s0) / 520, cap: 'd' + i });
    if (i < LAST) STATIONS[i].seg = seg({ k: 'stop', s: s1, st: i, dur: STATIONS[i].to ? 3.2 : 2.6, cap: 's' + i });
    else OFFICE = seg({ k: 'office', s: s1, st: i, dur: 3.6, cap: 'office' });
  }
  // A pickup, in seconds from the moment the car stops
  var P = { open: [0, .6], walk: [.35, 1.15], gone: [1.05, 1.4], sit: [1.15, 1.6], close: [1.65, 2.2], slide: [2.35, 3.0] };
  var SOUNDS = [];
  RIDERS.forEach(function (r) { SOUNDS.push([r.seg.t0 + .02, 'door-open'], [r.seg.t0 + 2.15, 'door-close']); });
  SOUNDS.push([OFFICE.t0 + .02, 'door-open'], [OFFICE.t0 + 3.3, 'door-close']);

  function clamp(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  function ease(x) { return 0.5 - 0.5 * Math.cos(Math.PI * clamp(x)); }
  function ramp(x, w) { return ease((x - w[0]) / (w[1] - w[0])); }
  function lerp(a, b, t) { return a + (b - a) * t; }

  /* ---------- Sound: the trip's CC0 door recordings, same on/off setting ---------- */
  var KEY = 'rs-trip-sound', soundOn = true, clips = {};
  try { soundOn = localStorage.getItem(KEY) !== 'off'; } catch (e) {}
  function sound(name) {
    if (!soundOn) return;
    try {
      if (!clips[name]) { clips[name] = new Audio('assets/sfx/' + name + '.mp3'); clips[name].volume = name === 'door-open' ? .5 : .32; }
      clips[name].currentTime = 0;
      var p = clips[name].play(); if (p && p.catch) p.catch(function () {});
    } catch (e) {}
  }

  /* ---------- Roadside drawings (the same as trip.js, with rf- colours) ---------- */
  var FROND = '';
  for (var fi = 0; fi < 8; fi++) FROND += '<path class="' + (fi % 2 ? 'rf-frond2' : 'rf-frond') + '" transform="rotate(' + (fi * 45 + 20) + ' 12 12)" d="M12 12Q15 6.5 12 1Q9 6.5 12 12Z"/>';
  var SPRITES =
    '<symbol id="rfNeem" viewBox="0 0 24 24"><ellipse class="rf-shade" cx="13.5" cy="14.5" rx="10" ry="8.5"/>' +
      '<circle class="rf-leafd" cx="8.5" cy="13.5" r="6.5"/><circle class="rf-leafd" cx="15" cy="14.5" r="6"/><circle class="rf-leaf" cx="12" cy="9.5" r="7"/>' +
      '<circle class="rf-leaf" cx="7.5" cy="11" r="4.5"/><circle class="rf-leafhi" cx="10" cy="7.5" r="2.8"/><circle class="rf-leafhi" cx="14.8" cy="10" r="1.7"/></symbol>' +
    '<symbol id="rfPalm" viewBox="0 0 24 24"><ellipse class="rf-shade" cx="13.5" cy="14" rx="9" ry="7.5"/>' + FROND + '<circle class="rf-trunk" cx="12" cy="12" r="2"/></symbol>' +
    '<symbol id="rfBush" viewBox="0 0 16 12"><ellipse class="rf-shade" cx="8.8" cy="7.6" rx="7" ry="4.2"/><circle class="rf-leafd" cx="4.5" cy="7" r="3.6"/>' +
      '<circle class="rf-leafd" cx="11" cy="6.8" r="3.8"/><circle class="rf-leaf" cx="7.8" cy="4.8" r="3.6"/><circle class="rf-flower" cx="5" cy="5.4" r="1"/>' +
      '<circle class="rf-flower" cx="10.8" cy="4.8" r="1"/><circle class="rf-flower" cx="8.8" cy="8.2" r=".9"/><circle class="rf-flower" cx="3.6" cy="8.6" r=".8"/></symbol>' +
    '<symbol id="rfShop" viewBox="0 0 30 24"><rect class="rf-wall" x="1" y="4" width="28" height="20" rx="1.5"/><rect class="rf-sign" x="4" y="0" width="22" height="5" rx="1"/>' +
      '<rect class="rf-shopin" x="4" y="12" width="22" height="12"/><rect class="rf-edge" x="4" y="18.5" width="22" height="1.6"/>' +
      '<rect class="rf-sign" x="0" y="8" width="30" height="4"/><rect class="rf-awn-b" x="3.75" y="8" width="3.75" height="4"/><rect class="rf-awn-b" x="11.25" y="8" width="3.75" height="4"/>' +
      '<rect class="rf-awn-b" x="18.75" y="8" width="3.75" height="4"/><rect class="rf-awn-b" x="26.25" y="8" width="3.75" height="4"/></symbol>' +
    '<symbol id="rfFlat" viewBox="0 0 20 36"><rect class="rf-tank" x="11.5" y="0" width="6" height="5" rx="2"/><rect class="rf-edge" x="1" y="4.5" width="18" height="1.6"/>' +
      '<rect class="rf-wall" x="1.5" y="5.5" width="17" height="30.5" rx="1"/>' +
      '<rect class="rf-win" x="4" y="9" width="4.5" height="4.5" rx=".8"/><rect class="rf-winoff" x="11.5" y="9" width="4.5" height="4.5" rx=".8"/>' +
      '<rect class="rf-winoff" x="4" y="16" width="4.5" height="4.5" rx=".8"/><rect class="rf-win" x="11.5" y="16" width="4.5" height="4.5" rx=".8"/>' +
      '<rect class="rf-win" x="4" y="23" width="4.5" height="4.5" rx=".8"/><rect class="rf-win" x="11.5" y="23" width="4.5" height="4.5" rx=".8"/>' +
      '<rect class="rf-hdoor" x="7.5" y="29.5" width="5" height="6.5" rx=".8"/></symbol>' +
    '<symbol id="rfHouse" viewBox="0 0 24 20"><circle class="rf-leaf" cx="19.5" cy="2.6" r="2.4"/><rect class="rf-edge" x="0" y="3.5" width="24" height="2.6" rx=".8"/>' +
      '<rect class="rf-wall" x="1" y="5.5" width="22" height="14.5" rx="1"/><rect class="rf-hdoor" x="9.5" y="11" width="5" height="9" rx=".8"/>' +
      '<rect class="rf-win" x="3.5" y="9" width="4.5" height="4.5" rx=".8"/><rect class="rf-winoff" x="16" y="9" width="4.5" height="4.5" rx=".8"/></symbol>';
  var KINDS = [['rfNeem', 26, 26, 30], ['rfPalm', 26, 26, 16], ['rfBush', 20, 15, 22], ['rfShop', 34, 27, 12], ['rfFlat', 22, 40, 10], ['rfHouse', 30, 25, 10]];

  function el(name, attrs, parent) {
    var e = document.createElementNS(NS, name);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function rng(seed) { return function () { seed = (seed + 0x6D2B79F5) | 0; var t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function tag(parent, x, y, lines) {
    var w = 10 + Math.max.apply(null, lines.map(function (l) { return l.length; })) * 6, h = 6 + lines.length * 11;
    var g = el('g', { 'class': 'rf-tag', transform: 'translate(' + x + ' ' + y + ')' }, parent);
    el('rect', { x: 0, y: 0, width: w, height: h, rx: 3 }, g);
    lines.forEach(function (l, i) { var t = el('text', { x: 5, y: 12 + i * 11, 'class': i ? 't2' : '' }, g); t.textContent = l; });
    return g;
  }

  /* ---------- Build the film on first tap ---------- */
  var dlg, stage, scene, world, car, doors = {}, people = [], walkers = [], seats = [], capEl, meter = {}, stations, fill, endCard, pauseBtn, soundBtn;
  var vbH = 640, anchor = 384;

  function build() {
    dlg = document.createElement('div');
    dlg.className = 'rf';
    dlg.hidden = true;
    dlg.setAttribute('role', 'dialog');
    dlg.setAttribute('aria-modal', 'true');
    dlg.setAttribute('aria-labelledby', 'rfTitle');
    dlg.innerHTML =
      '<div class="rf-col">' +
        '<div class="rf-bar"><div><p class="rf-eyebrow">A morning ride · 24 km</p><h2 class="rf-title" id="rfTitle">Rahul\'s car, three riders</h2></div>' +
          '<div class="rf-btns">' +
            '<button class="icon-btn" type="button" data-a="sound" aria-label="Door sounds on or off"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5L6 9H3v6h3l5 4z"/><path class="on" d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/><path class="off" d="M16 9l5 6M21 9l-5 6"/></svg></button>' +
            '<button class="icon-btn" type="button" data-a="pause" aria-label="Pause"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect class="ps" x="6.5" y="5" width="3.6" height="14" rx="1"/><rect class="ps" x="13.9" y="5" width="3.6" height="14" rx="1"/><path class="pl" d="M8 5.5v13l10.5-6.5z"/></svg></button>' +
            '<button class="icon-btn" type="button" data-a="close" aria-label="Close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
          '</div></div>' +
        '<ol class="rf-line" aria-hidden="true"><span class="rf-track"><span class="rf-fill"></span></span>' +
          STATIONS.map(function (s) { return '<li><i></i><b>' + s.b + '</b><span>' + s.time + '</span></li>'; }).join('') + '</ol>' +
        '<div class="rf-stage"><svg class="rf-scene car-svg" role="img" aria-label="Seen from above: Rahul\'s car on the road to the office, stopping for each rider."></svg>' +
          '<div class="rf-end" hidden><p class="rf-end-k">Trip complete · 08:30</p><p class="rf-end-h">3 cars fewer on the road</p>' +
            '<dl><div><dt>Riders</dt><dd>3</dd></div><div><dt>Shared</dt><dd data-e="km"></dd></div><div><dt>To Rahul</dt><dd data-e="pay"></dd></div><div><dt>CO₂ kept out</dt><dd data-e="co2"></dd></div></dl>' +
            '<p class="rf-end-f">Example trip at <span data-e="rate"></span>/km, no commission. Each rider pays only for their own kilometres.</p>' +
            '<div class="rf-end-b"><button class="btn btn-ink" type="button" data-a="again">Ride again ↺</button><button class="btn btn-line" type="button" data-a="close">Close</button></div></div>' +
        '</div>' +
        '<p class="rf-cap" aria-live="polite"></p>' +
        '<dl class="rf-meter"><div><dt>Time</dt><dd data-m="clock"></dd></div><div><dt>On board</dt><dd data-m="riders"></dd></div>' +
          '<div><dt>Shared</dt><dd data-m="km"></dd></div><div class="co2"><dt>CO₂ kept out</dt><dd data-m="co2"></dd></div></dl>' +
      '</div>';
    document.body.appendChild(dlg);

    stage = dlg.querySelector('.rf-stage');
    scene = dlg.querySelector('.rf-scene');
    capEl = dlg.querySelector('.rf-cap');
    stations = dlg.querySelectorAll('.rf-line li');
    fill = dlg.querySelector('.rf-fill');
    endCard = dlg.querySelector('.rf-end');
    pauseBtn = dlg.querySelector('[data-a="pause"]');
    soundBtn = dlg.querySelector('[data-a="sound"]');
    ['clock', 'riders', 'km', 'co2'].forEach(function (k) { meter[k] = dlg.querySelector('[data-m="' + k + '"]'); });

    // The scene, in a 360-wide world. The car stays put; the road slides under it.
    el('defs', {}, scene).innerHTML = SPRITES;
    el('rect', { 'class': 'rf-ground', x: -40, y: -40, width: 440, height: 2400 }, scene);
    world = el('g', {}, scene);
    var top = -(ROUTE_KM * KM + 900), bottom = 900;
    el('rect', { 'class': 'rf-road', x: KERB_X + 2.5, y: top, width: 176, height: bottom - top }, world);
    el('rect', { 'class': 'rf-kerb', x: KERB_X, y: top, width: 2.5, height: bottom - top }, world);
    el('rect', { 'class': 'rf-kerb', x: KERB_X + 178.5, y: top, width: 2.5, height: bottom - top }, world);
    el('path', { 'class': 'rf-lane', d: 'M180 ' + bottom + 'V' + top }, world);

    // Places on the kerb side: the home, each stop, the office. The roadside leaves room for them.
    var keep = [[-110, 30]];
    var home = el('g', {}, world);
    el('use', { href: '#rfHouse', x: 8, y: -58, width: 72, height: 60, 'class': 'rf-c1' }, home);
    tag(home, 6, -92, ["RAHUL'S HOME", '07:40']);
    RIDERS.forEach(function (r) {
      var y = -r.km * KM + doorDy(r.seat);
      keep.push([y - 66, y + 26]);
      tag(world, 6, y - 50, [r.time + ' · ' + r.b.toUpperCase()]);
    });
    var oy = -ROUTE_KM * KM, ob = oy + 24; // office: front view, door at the bottom by the kerb
    keep.push([oy - 200, ob + 40]);
    var off = el('g', {}, world);
    el('rect', { 'class': 'rf-bldg', x: 8, y: ob - 172, width: 76, height: 172, rx: 3 }, off);
    for (var row = 0; row < 7; row++) for (var col = 0; col < 4; col++) {
      el('rect', { 'class': 'rf-bwin', x: 15 + col * 16, y: ob - 162 + row * 20, width: 10, height: 12, rx: 1.5 }, off);
    }
    el('rect', { 'class': 'rf-bdoor', x: 38, y: ob - 20, width: 16, height: 20, rx: 1.5 }, off);
    tag(off, 8, ob - 196, ['OFFICE · 08:30']);

    // Roadside, the same every time (seeded)
    var rand = rng(29);
    function pick() { var r = rand() * 100, a = 0; for (var i = 0; i < KINDS.length; i++) { a += KINDS[i][3]; if (r < a) return KINDS[i]; } return KINDS[0]; }
    [[2, KERB_X - 4], [KERB_X + 185, 358]].forEach(function (side, si) {
      for (var y = bottom - 60; y > top + 60; y -= 34 + rand() * 26) {
        var k = pick(), w = k[1], h = k[2], x = side[0] + rand() * Math.max(0, side[1] - side[0] - w);
        if (si === 0 && keep.some(function (z) { return y + h > z[0] && y < z[1]; })) continue;
        var a = { href: '#' + k[0], x: x.toFixed(1), y: y.toFixed(1), width: w, height: h };
        if (k[0] === 'rfShop' || k[0] === 'rfFlat' || k[0] === 'rfHouse') a['class'] = 'rf-c' + (1 + Math.floor(rand() * 4));
        el('use', a, world);
      }
    });

    // Riders waiting at their stops, and the same three walking into the office at the end
    RIDERS.forEach(function (r) {
      var g = el('g', {}, world);
      el('use', { href: '#ilPerson', x: -9, y: -19, width: 18, height: 37.8, 'class': r.pc + ' ' + r.sk }, g);
      people.push(g);
      var w = el('g', { opacity: 0 }, world);
      el('use', { href: '#ilPerson', x: -9, y: -19, width: 18, height: 37.8, 'class': r.pc + ' ' + r.sk }, w);
      walkers.push(w);
    });

    // The car: drawing, kerb-side doors, and who sits where (Rahul drives, front right)
    car = el('g', {}, scene);
    el('use', { href: '#car', width: 200, height: 404 }, car);
    Object.keys(DOOR).forEach(function (d) { doors[d] = el('rect', { 'class': 'rf-door', x: 13, y: DOOR[d][0], width: 9, height: DOOR[d][1], rx: 4.5 }, car); });
    function avatar(cls, ini, at) {
      var g = el('g', { transform: 'translate(' + at[0] + ' ' + at[1] + ')' }, car);
      el('circle', { r: 23, 'class': cls }, g);
      el('text', { 'class': 'rf-ini', y: 8 }, g).textContent = ini;
      return g;
    }
    avatar('av-sky', 'RK', SEAT.dr);
    RIDERS.forEach(function (r) { seats.push(avatar(r.av, r.ini, SEAT[r.seat])); });

    dlg.addEventListener('click', function (e) {
      var b = e.target.closest('[data-a]'); if (!b) return;
      var a = b.getAttribute('data-a');
      if (a === 'close') close();
      else if (a === 'pause') { if (playing) pause(); else play(); }
      else if (a === 'again') { restart(); play(); }
      else if (a === 'sound') { soundOn = !soundOn; try { localStorage.setItem(KEY, soundOn ? 'on' : 'off'); } catch (err) {} paintSound(); }
    });
    dlg.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.preventDefault(); close(); return; }
      if (e.key !== 'Tab') return;
      var f = [].filter.call(dlg.querySelectorAll('button'), function (b) { return b.offsetParent !== null; });
      if (!f.length) return;
      var i = f.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
    });
    window.addEventListener('resize', function () { if (!dlg.hidden) size(); });
    paintSound();
  }

  function paintSound() {
    soundBtn.classList.toggle('off', !soundOn);
    soundBtn.setAttribute('aria-pressed', soundOn ? 'true' : 'false');
    soundBtn.querySelector('.on').setAttribute('opacity', soundOn ? 1 : 0);
    soundBtn.querySelector('.off').setAttribute('opacity', soundOn ? 0 : 1);
  }
  function paintPause() {
    pauseBtn.setAttribute('aria-label', playing ? 'Pause' : 'Play');
    [].forEach.call(pauseBtn.querySelectorAll('.ps'), function (r) { r.setAttribute('opacity', playing ? 1 : 0); });
    pauseBtn.querySelector('.pl').setAttribute('opacity', playing ? 0 : 1);
  }
  function size() {
    var r = stage.getBoundingClientRect();
    vbH = 360 * r.height / Math.max(1, r.width);
    scene.setAttribute('viewBox', '0 0 360 ' + vbH.toFixed(1));
    anchor = Math.max(CAR_H / 2 + 70, vbH * 0.6);
    render(tau);
  }

  /* ---------- One frame: where everything is at time tau ---------- */
  var cap = '';
  function hm(min) { var h = Math.floor(min / 60), m = Math.round(min % 60); return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m; }
  function minutes(t) { var p = t.split(':'); return +p[0] * 60 + +p[1]; }
  function render(t) {
    var g = SEGS[0];
    for (var i = SEGS.length - 1; i >= 0; i--) if (t >= SEGS[i].t0) { g = SEGS[i]; break; }
    var lt = t - g.t0, s, pull = 1;
    if (g.k === 'drive') {
      s = g.s0 + (g.s1 - g.s0) * ease(lt / g.dur);
      pull = Math.max(1 - ramp(lt, [0, 1]), ramp(lt, [g.dur - 1, g.dur])); // leave the kerb, come back to it
    } else s = g.s;
    var km = s / KM, cx = lerp(LANE_X, PULL_X, pull);

    world.setAttribute('transform', 'translate(0 ' + (anchor + s).toFixed(2) + ')');
    car.setAttribute('transform', 'translate(' + (cx - CAR_W / 2).toFixed(2) + ' ' + (anchor - CAR_H / 2).toFixed(2) + ') scale(' + CAR_K + ')');

    var o = t - OFFICE.t0, atOffice = o >= 0;
    var doorOpen = { fl: 0, bl: 0 }, onBoard = 0, shared = 0;
    if (atOffice) { var od = ramp(o, [0, .6]) * (1 - ramp(o, [3, 3.5])); doorOpen.fl = od; doorOpen.bl = od; }
    RIDERS.forEach(function (r, ri) {
      var b = t - r.seg.t0;
      if (b >= 0 && b <= P.close[1]) doorOpen[r.seat] = Math.max(doorOpen[r.seat], ramp(b, P.open) * (1 - ramp(b, P.close)));
      // waiting at the stop, then walking to the door
      var wx = lerp(STAND_X, REACH_X, b > 0 ? ramp(b, P.walk) : 0), wy = -r.km * KM + doorDy(r.seat);
      people[ri].setAttribute('transform', 'translate(' + wx.toFixed(1) + ' ' + wy.toFixed(1) + ')');
      people[ri].setAttribute('opacity', b > 0 ? (1 - ramp(b, P.gone)).toFixed(3) : 1);
      // in the seat (You slides across to make room for Anita)
      var seat = SEAT[r.seat], sl = r.to && b > 0 ? ramp(b, P.slide) : 0;
      var at = r.to ? [lerp(seat[0], SEAT[r.to][0], sl), seat[1]] : seat;
      var inSeat = b > 0 ? ramp(b, P.sit) : 0;
      if (atOffice) inSeat *= 1 - ramp(o, [.45, .85]);
      seats[ri].setAttribute('transform', 'translate(' + at[0].toFixed(1) + ' ' + at[1] + ')');
      seats[ri].setAttribute('opacity', inSeat.toFixed(3));
      if (inSeat > .5) onBoard++;
      if (b > P.gone[1]) shared += Math.max(0, Math.min(km, ROUTE_KM) - r.km);
      // at the office: out of the kerb-side doors and into the building, one after another
      var st = ri * .3, door = r.seat === 'fl' ? 'fl' : 'bl';
      if (atOffice) {
        var go = ramp(o, [.8 + st, 2.6 + st]);
        var fx = lerp(REACH_X, 46, go), fy = lerp(-ROUTE_KM * KM + doorDy(door), -ROUTE_KM * KM + 14, go);
        walkers[ri].setAttribute('transform', 'translate(' + fx.toFixed(1) + ' ' + fy.toFixed(1) + ') scale(' + lerp(1, .8, go).toFixed(3) + ')');
        walkers[ri].setAttribute('opacity', (ramp(o, [.5 + st, .8 + st]) * (1 - ramp(o, [2.3 + st, 2.8 + st]))).toFixed(3));
      } else walkers[ri].setAttribute('opacity', 0);
    });
    Object.keys(doors).forEach(function (d) { doors[d].setAttribute('transform', 'rotate(' + (58 * doorOpen[d]).toFixed(1) + ' 17.5 ' + DOOR[d][0] + ')'); });

    // Metro line, meter, caption
    var idx = 0;
    for (var k = 0; k < STATIONS.length; k++) if (km >= STATIONS[k].km - 1e-6) idx = k;
    var frac = idx >= LAST ? 1 : (idx + (km - STATIONS[idx].km) / (STATIONS[idx + 1].km - STATIONS[idx].km)) / LAST;
    fill.style.width = (frac * 100).toFixed(2) + '%';
    for (var n = 0; n < stations.length; n++) {
      stations[n].classList.toggle('on', n <= idx);
      stations[n].classList.toggle('at', g.k !== 'drive' && g.st === n);
    }
    var m0 = minutes(STATIONS[idx].time), m1 = idx >= LAST ? m0 : minutes(STATIONS[idx + 1].time);
    var clock = idx >= LAST ? m0 : lerp(m0, m1, (km - STATIONS[idx].km) / (STATIONS[idx + 1].km - STATIONS[idx].km));
    meter.clock.textContent = hm(clock);
    meter.riders.textContent = (onBoard + 1) + ' of 4';
    meter.km.textContent = Math.round(shared) + ' km';
    meter.co2.textContent = (shared * KG_PER_KM).toFixed(1) + ' kg';
    if (g.cap !== cap) setCap(g.cap);
  }
  var capTimer = 0;
  function setCap(c) {
    cap = c;
    clearTimeout(capTimer);
    capEl.classList.add('fade');
    capTimer = setTimeout(function () { capEl.textContent = CAPS[c]; capEl.classList.remove('fade'); }, 300);
  }

  /* ---------- Play, pause, the end ---------- */
  var tau = 0, playing = false, raf = 0, last = 0, wasPlaying = false;
  function frame(now) {
    var dt = Math.min(.05, (now - last) / 1000), prev = tau;
    last = now;
    tau = Math.min(END, tau + dt);
    SOUNDS.forEach(function (e) { if (prev < e[0] && tau >= e[0]) sound(e[1]); });
    render(tau);
    if (tau >= END) { finish(); return; }
    raf = requestAnimationFrame(frame);
  }
  function play() {
    if (playing) return;
    if (tau >= END) restart();
    playing = true; last = performance.now();
    raf = requestAnimationFrame(frame);
    paintPause();
  }
  function pause() { playing = false; cancelAnimationFrame(raf); paintPause(); }
  function restart() {
    tau = 0; cap = '';
    endCard.classList.remove('show'); endCard.hidden = true;
    render(0);
  }
  function finish() {
    playing = false; paintPause();
    var input = document.getElementById('rate'), rate = input ? parseFloat(input.value) || 4 : 4, km = 0, pay = 0;
    RIDERS.forEach(function (r) { km += r.ride; pay += Math.max(10, Math.round(r.ride * rate)); });
    endCard.querySelector('[data-e="km"]').textContent = km + ' km';
    endCard.querySelector('[data-e="pay"]').textContent = '₹' + pay;
    endCard.querySelector('[data-e="co2"]').textContent = '≈ ' + Math.round(km * KG_PER_KM) + ' kg';
    endCard.querySelector('[data-e="rate"]').textContent = '₹' + (rate % 1 ? rate.toFixed(1) : rate);
    endCard.hidden = false;
    void endCard.offsetWidth;
    endCard.classList.add('show');
    endCard.querySelector('[data-a="again"]').focus({ preventScroll: true });
  }
  document.addEventListener('visibilitychange', function () {
    if (!dlg || dlg.hidden) return;
    if (document.hidden) { wasPlaying = playing; pause(); } else if (wasPlaying) play();
  });

  /* ---------- Open and close (the phone's Back button closes it too) ---------- */
  var pushed = false;
  function open() {
    if (!dlg) build();
    dlg.hidden = false;
    root.classList.add('rf-lock');
    restart();
    size();
    void dlg.offsetWidth;
    dlg.classList.add('show');
    try { history.pushState({ rf: 1 }, ''); pushed = true; } catch (e) {}
    dlg.querySelector('[data-a="close"]').focus({ preventScroll: true });
    play();
  }
  function shut() {
    pause();
    dlg.classList.remove('show');
    root.classList.remove('rf-lock');
    setTimeout(function () { if (!dlg.classList.contains('show')) dlg.hidden = true; }, 450);
    openBtn.focus({ preventScroll: true });
  }
  function close() {
    if (!dlg || dlg.hidden) return;
    if (pushed) { pushed = false; history.back(); } // popstate below shuts it
    else shut();
  }
  window.addEventListener('popstate', function () { if (dlg && !dlg.hidden && dlg.classList.contains('show')) { pushed = false; shut(); } });

  openBtn.addEventListener('click', open);
})();
