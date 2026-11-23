/* RideSaathi home page: the morning trip. A road leaves Rahul's home, winds down the page margins and crosses the
   page only in the empty space between sections, and ends at the office. The car follows your scroll, slows for
   each rider, opens the door on their side and they get in; at the office everyone gets out and walks inside.
   Wide screens only (the margins need room). Door sounds are CC0 recordings, with an on/off button.
   No inline scripts (strict CSP). */
(function () {
  var NS = 'http://www.w3.org/2000/svg';
  var root = document.documentElement;
  var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  /* The route, top to bottom. `cross` = the road crosses the page in the gap between two sections.
     Riders always stand on the outer side of the road (towards the screen edge), so the door they use follows from
     the lane: left lane = car's right side, right lane = car's left side (the car drives down the page). */
  // Home-page sections the route is laid out around. Scoped to <main>'s own sections, because other scripts add
  // short classes such as "in" to revealed elements.
  var S = {
    board: 'main > section.db-band', line: 'main > section#line', fare: 'main > section.fs', impact: 'main > section.zs',
    safety: 'main > section.sx', india: 'main > section[aria-labelledby="inTitle"]', langs: 'main > section.lx',
    faq: 'main > section.fq', next: 'main > section.nx', footer: 'body > footer.site-footer'
  };
  var PLAN = [
    { home: S.board, lane: 'R', name: "Rahul's home", time: '07:40' },
    { cross: [S.board, S.line] },
    { stop: S.line, f: 0.8, name: 'You', time: '07:52', pc: 'pc-sun', sk: 'sk-1', seat: 'br', color: 'var(--sun)' },
    { cross: [S.fare, S.impact] },
    { stop: S.safety, f: 0.36, name: 'Anita', time: '08:01', pc: 'pc-lilac', sk: 'sk-2', seat: 'bl', color: 'var(--lilac)' },
    { cross: [S.safety, S.india] },
    { cross: [S.india, S.langs] },
    { stop: S.langs, f: 0.3, name: 'Vikram', time: '08:09', pc: 'pc-mint', sk: 'sk-3', seat: 'fl', color: 'var(--mint)' },
    // The office stands in its own strip after "Coming soon", just above the footer (trip.css opens the room).
    { office: [S.next, S.footer], name: 'Office', time: '08:30' }
  ];

  /* Car drawing (#car, viewBox 200×404, nose up). Seats: front left, driver (front right, India drives on the
     left), back left, back right. Doors hinge at their front edge. */
  var SEAT = { fl: [75, 205], dr: [125, 205], bl: [75, 291], br: [125, 291] };
  var DOOR = { fl: ['l', 164, 76], bl: ['l', 246, 62], fr: ['r', 164, 76], br: ['r', 246, 62] };
  var DOOR_OF = { fl: 'fl', bl: 'bl', br: 'br', dr: 'fr' };
  var BASE_W = 52; // car width in px on a wide screen

  /* Roadside drawings (original). Plants are seen from above like the road; buildings stand on the kerb, seen
     from the front like the home and the office. Colours come from trip.css (day and night). */
  var FROND = '';
  for (var fi = 0; fi < 8; fi++) FROND += '<path class="' + (fi % 2 ? 'tm-frond2' : 'tm-frond') + '" transform="rotate(' + (fi * 45 + 20) + ' 12 12)" d="M12 12Q15 6.5 12 1Q9 6.5 12 12Z"/>';
  var ROADSIDE =
    '<symbol id="tmNeem" viewBox="0 0 24 24"><ellipse class="tm-shade" cx="13.5" cy="14.5" rx="10" ry="8.5"/>' +
      '<circle class="tm-leafd" cx="8.5" cy="13.5" r="6.5"/><circle class="tm-leafd" cx="15" cy="14.5" r="6"/><circle class="tm-leaf" cx="12" cy="9.5" r="7"/>' +
      '<circle class="tm-leaf" cx="7.5" cy="11" r="4.5"/><circle class="tm-leafhi" cx="10" cy="7.5" r="2.8"/><circle class="tm-leafhi" cx="14.8" cy="10" r="1.7"/></symbol>' +
    '<symbol id="tmPalm" viewBox="0 0 24 24"><ellipse class="tm-shade" cx="13.5" cy="14" rx="9" ry="7.5"/>' + FROND + '<circle class="tm-trunk" cx="12" cy="12" r="2"/></symbol>' +
    '<symbol id="tmBush" viewBox="0 0 16 12"><ellipse class="tm-shade" cx="8.8" cy="7.6" rx="7" ry="4.2"/><circle class="tm-leafd" cx="4.5" cy="7" r="3.6"/>' +
      '<circle class="tm-leafd" cx="11" cy="6.8" r="3.8"/><circle class="tm-leaf" cx="7.8" cy="4.8" r="3.6"/><circle class="tm-flower" cx="5" cy="5.4" r="1"/>' +
      '<circle class="tm-flower" cx="10.8" cy="4.8" r="1"/><circle class="tm-flower" cx="8.8" cy="8.2" r=".9"/><circle class="tm-flower" cx="3.6" cy="8.6" r=".8"/></symbol>' +
    // A corner shop: sign board, striped awning, open front with a counter
    '<symbol id="tmShop" viewBox="0 0 30 24"><rect class="tm-bw-wall" x="1" y="4" width="28" height="20" rx="1.5"/><rect class="tm-bw-sign" x="4" y="0" width="22" height="5" rx="1"/>' +
      '<rect class="tm-shopin" x="4" y="12" width="22" height="12"/><rect class="tm-bw-edge" x="4" y="18.5" width="22" height="1.6"/>' +
      '<rect class="tm-awn-a" x="0" y="8" width="30" height="4"/><rect class="tm-awn-b" x="3.75" y="8" width="3.75" height="4"/><rect class="tm-awn-b" x="11.25" y="8" width="3.75" height="4"/>' +
      '<rect class="tm-awn-b" x="18.75" y="8" width="3.75" height="4"/><rect class="tm-awn-b" x="26.25" y="8" width="3.75" height="4"/></symbol>' +
    // A block of flats with the black water tank on the roof
    '<symbol id="tmFlat" viewBox="0 0 20 36"><rect class="tm-tank" x="11.5" y="0" width="6" height="5" rx="2"/><rect class="tm-bw-edge" x="1" y="4.5" width="18" height="1.6"/>' +
      '<rect class="tm-bw-wall" x="1.5" y="5.5" width="17" height="30.5" rx="1"/>' +
      '<rect class="tm-bwl" x="4" y="9" width="4.5" height="4.5" rx=".8"/><rect class="tm-bwo" x="11.5" y="9" width="4.5" height="4.5" rx=".8"/>' +
      '<rect class="tm-bwo" x="4" y="16" width="4.5" height="4.5" rx=".8"/><rect class="tm-bwl" x="11.5" y="16" width="4.5" height="4.5" rx=".8"/>' +
      '<rect class="tm-bwl" x="4" y="23" width="4.5" height="4.5" rx=".8"/><rect class="tm-bwl" x="11.5" y="23" width="4.5" height="4.5" rx=".8"/>' +
      '<rect class="tm-door" x="7.5" y="29.5" width="5" height="6.5" rx=".8"/></symbol>' +
    // A low house with a flat roof, a parapet and a pot plant on top
    '<symbol id="tmHouse" viewBox="0 0 24 20"><circle class="tm-leaf" cx="19.5" cy="2.6" r="2.4"/><rect class="tm-bw-edge" x="0" y="3.5" width="24" height="2.6" rx=".8"/>' +
      '<rect class="tm-bw-wall" x="1" y="5.5" width="22" height="14.5" rx="1"/><rect class="tm-door" x="9.5" y="11" width="5" height="9" rx=".8"/>' +
      '<rect class="tm-bwl" x="3.5" y="9" width="4.5" height="4.5" rx=".8"/><rect class="tm-bwo" x="16" y="9" width="4.5" height="4.5" rx=".8"/></symbol>';
  // On straight runs the car rides a little below the middle of the screen, leaving room above it for pickups
  // and for catching up when you scroll quickly.
  var LEAD = 0.62;

  /* ---------- Sound: two short CC0 recordings, played only after the visitor has clicked or tapped something ---------- */
  var KEY = 'rs-trip-sound';
  var soundOn = true;
  try { soundOn = localStorage.getItem(KEY) !== 'off'; } catch (e) {}
  var clips = {};
  function clip(name, vol) {
    if (!clips[name]) {
      try { clips[name] = new Audio('assets/sfx/' + name + '.mp3'); clips[name].preload = 'auto'; clips[name].volume = vol; } catch (e) { return null; }
    }
    return clips[name];
  }
  function activated() { return !navigator.userActivation || navigator.userActivation.hasBeenActive; }
  function play(name) {
    if (!soundOn || !activated()) return;
    var a = clip(name, name === 'door-open' ? 0.5 : 0.32);
    if (!a) return;
    try { a.currentTime = 0; var p = a.play(); if (p && p.catch) p.catch(function () {}); } catch (e) {}
  }

  function svgEl(name, attrs, parent) {
    var e = document.createElementNS(NS, name);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function div(cls, parent, html) {
    var e = document.createElement('div');
    e.className = cls;
    if (html) e.innerHTML = html;
    (parent || document.body).appendChild(e);
    return e;
  }
  function person(cls, pc, sk, parent) {
    return div('trip-who ' + cls, parent, '<svg viewBox="0 0 20 42"><use class="' + pc + ' ' + sk + '" href="#ilPerson"/></svg>');
  }

  /* ---------- Where the page has ink: one box per section, from the elements that actually draw something ---------- */
  var GRAPHIC = /^(svg|img|canvas|button|input|select|textarea|video|picture|iframe|hr)$/i;
  function inkBox(sec, W) {
    var box = null, clipCache = new Map();
    function clipOf(el) { // the visible area left by ancestors that clip (overflow other than visible)
      var r = null;
      for (var p = el.parentElement; p && p !== sec; p = p.parentElement) {
        var c = clipCache.get(p);
        if (c === undefined) {
          var cs = getComputedStyle(p);
          c = (cs.overflowX !== 'visible' || cs.overflowY !== 'visible') ? p.getBoundingClientRect() : null;
          clipCache.set(p, c);
        }
        if (c) r = r ? { left: Math.max(r.left, c.left), top: Math.max(r.top, c.top), right: Math.min(r.right, c.right), bottom: Math.min(r.bottom, c.bottom) } : c;
      }
      return r;
    }
    var all = sec.getElementsByTagName('*');
    for (var i = 0; i < all.length; i++) {
      var el = all[i];
      if (el.ownerSVGElement) continue; // parts of an svg: the svg itself counts
      var draws = GRAPHIC.test(el.tagName);
      if (!draws) {
        for (var n = el.firstChild; n; n = n.nextSibling) if (n.nodeType === 3 && /\S/.test(n.nodeValue)) { draws = true; break; }
      }
      var cs = null;
      if (!draws) {
        cs = getComputedStyle(el);
        draws = (cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'transparent') || cs.backgroundImage !== 'none' ||
          parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth) + parseFloat(cs.borderLeftWidth) + parseFloat(cs.borderRightWidth) > 0 ||
          cs.boxShadow !== 'none';
      }
      if (!draws) continue;
      var r = el.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) continue;
      if (r.width > W - 40) continue; // full-bleed bands are background, not ink
      if ((cs || getComputedStyle(el)).visibility === 'hidden') continue;
      var c = clipOf(el);
      var q = { left: r.left, top: r.top, right: r.right, bottom: r.bottom };
      if (c) { q.left = Math.max(q.left, c.left); q.top = Math.max(q.top, c.top); q.right = Math.min(q.right, c.right); q.bottom = Math.min(q.bottom, c.bottom); }
      if (q.right - q.left < 1 || q.bottom - q.top < 1) continue;
      if (!box) box = q;
      else { box.left = Math.min(box.left, q.left); box.top = Math.min(box.top, q.top); box.right = Math.max(box.right, q.right); box.bottom = Math.max(box.bottom, q.bottom); }
    }
    if (!box) return null;
    var y = window.scrollY;
    return { left: Math.max(0, box.left), right: Math.min(W, box.right), top: box.top + y, bottom: box.bottom + y };
  }

  /* ---------- Path pieces: straight lines and quarter arcs, so every point and heading is exact ---------- */
  function Line(x0, y0, x1, y1) { this.x0 = x0; this.y0 = y0; this.x1 = x1; this.y1 = y1; this.len = Math.hypot(x1 - x0, y1 - y0); }
  Line.prototype.at = function (t) { return [this.x0 + (this.x1 - this.x0) * t, this.y0 + (this.y1 - this.y0) * t, Math.atan2(this.y1 - this.y0, this.x1 - this.x0)]; };
  Line.prototype.d = function () { return 'L' + this.x1.toFixed(1) + ' ' + this.y1.toFixed(1); };
  function Arc(cx, cy, r, a0, a1) { this.cx = cx; this.cy = cy; this.r = r; this.a0 = a0; this.a1 = a1; this.len = Math.abs(a1 - a0) * r; }
  Arc.prototype.at = function (t) {
    var a = this.a0 + (this.a1 - this.a0) * t, s = this.a1 > this.a0 ? 1 : -1;
    return [this.cx + this.r * Math.cos(a), this.cy + this.r * Math.sin(a), Math.atan2(s * Math.cos(a), -s * Math.sin(a))];
  };
  Arc.prototype.d = function () {
    var e = this.at(1);
    return 'A' + this.r.toFixed(1) + ' ' + this.r.toFixed(1) + ' 0 0 ' + (this.a1 > this.a0 ? 1 : 0) + ' ' + e[0].toFixed(1) + ' ' + e[1].toFixed(1);
  };
  var Q = Math.PI / 2;

  function trip() {
    var mq = window.matchMedia('(min-width: 1180px)');
    var layer = div('trip', null);
    layer.setAttribute('aria-hidden', 'true');
    var map = svgEl('svg', { 'class': 'trip-map' }, layer);
    var car = div('trip-car', layer);
    // Night lights, under the car and outside its shadow filter: two soft headlight beams ahead (the drawing's nose
    // points up, so "ahead" is negative y) and a red glow behind the tail lights. Hidden by day (trip.css).
    var lights = svgEl('svg', { 'class': 'tc-lights', viewBox: '0 0 200 404' }, car);
    lights.innerHTML = '<defs><radialGradient id="tcBeamG" cx=".5" cy=".5" r=".5" fx=".5" fy=".97"><stop offset="0" class="tc-b0"/><stop offset="1" class="tc-b1"/></radialGradient>' +
      '<radialGradient id="tcTailG"><stop offset="0" class="tc-tg0"/><stop offset="1" class="tc-tg1"/></radialGradient></defs>' +
      '<g class="tc-beam"><ellipse cx="58" cy="-112" rx="62" ry="128" fill="url(#tcBeamG)"/><ellipse cx="142" cy="-112" rx="62" ry="128" fill="url(#tcBeamG)"/></g>' +
      '<g class="tc-tailglow"><ellipse cx="62" cy="394" rx="30" ry="20" fill="url(#tcTailG)"/><ellipse cx="138" cy="394" rx="30" ry="20" fill="url(#tcTailG)"/></g>';
    var csvg = svgEl('svg', { viewBox: '0 0 200 404' }, car);
    svgEl('use', { href: '#car' }, csvg);
    svgEl('rect', { 'class': 'tc-hl', x: 50, y: 13, width: 22, height: 6, rx: 3 }, csvg);
    svgEl('rect', { 'class': 'tc-hl', x: 128, y: 13, width: 22, height: 6, rx: 3 }, csvg);
    // Flash the headlights twice as the car pulls up for a rider (shows at night only).
    var flashT = [];
    var sig = null; // the traffic signal: { L: distance along the road, g: its drawing, state }
    function flash() {
      flashT.forEach(clearTimeout); flashT = [];
      [0, 150, 330, 480].forEach(function (ms, i) { flashT.push(setTimeout(function () { car.classList.toggle('flash', i % 2 === 0); }, ms)); });
    }
    var slots = {}, doors = {}, avs = {};
    Object.keys(DOOR).forEach(function (k) {
      var d = DOOR[k], x = d[0] === 'l' ? 18 : 168;
      slots[k] = svgEl('rect', { 'class': 'tc-slot', x: x, y: d[1], width: 14, height: d[2], rx: 4 }, csvg);
    });
    Object.keys(DOOR).forEach(function (k) {
      var d = DOOR[k], x = d[0] === 'l' ? 13 : 173;
      var g = svgEl('rect', { 'class': 'tc-door ' + d[0], x: x, y: d[1], width: 14, height: d[2], rx: 5 }, csvg);
      g.style.transformOrigin = (x + 7) + 'px ' + (d[1] + 4) + 'px';
      doors[k] = g;
    });
    Object.keys(SEAT).forEach(function (k) {
      avs[k] = svgEl('circle', { 'class': 'tc-av' + (k === 'dr' ? ' on pc-sky' : ''), cx: SEAT[k][0], cy: SEAT[k][1], r: 19 }, csvg);
    });
    var tag = div('trip-tag', layer);

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'trip-snd';
    btn.setAttribute('aria-label', 'Car door sounds');
    btn.title = 'Car door sounds';
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5L6 9H3v6h3l5 4z"/><path class="on" d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/><path class="off" d="M16 9.5l5 5M21 9.5l-5 5"/></svg>';
    document.body.appendChild(btn);
    function paintBtn() { btn.setAttribute('aria-pressed', soundOn ? 'true' : 'false'); btn.classList.toggle('muted', !soundOn); }
    paintBtn();
    btn.addEventListener('click', function () {
      soundOn = !soundOn;
      try { localStorage.setItem(KEY, soundOn ? 'on' : 'off'); } catch (e) {}
      paintBtn();
      if (soundOn) play('door-close');
    });

    // Riders, stops and the two buildings (built once; positions are set in layout()).
    var stops = [], home = null, office = null;
    PLAN.forEach(function (p) {
      if (p.stop) {
        var s = { p: p, who: person('', p.pc, p.sk, layer), lab: div('trip-lab', layer, '<b>' + p.name + '</b>' + p.time), seat: p.seat, door: DOOR_OF[p.seat], inside: false, timers: [] };
        avs[p.seat].classList.add(p.pc);
        stops.push(s);
      } else if (p.home) home = { p: p, lab: div('trip-lab', layer, '<b>' + p.name + '</b>' + p.time) };
      else if (p.office) office = { p: p, lab: div('trip-lab', layer, '<b>' + p.name + '</b>' + p.time), arrived: false, timers: [], out: [] };
    });
    office.out = stops.map(function (s) { return person('exit', s.p.pc, s.p.sk, layer); });
    // The cars these riders would each have driven alone: they fade in behind Rahul's car at the office, then clear.
    office.ghosts = stops.map(function (s0, i) {
      var g = div('trip-ghost', layer);
      g.style.setProperty('--i', i);
      svgEl('use', { href: '#car' }, svgEl('svg', { viewBox: '0 0 200 404' }, g));
      return g;
    });

    /* Trip summary at the office: the example trip's numbers, using the same fare rule as the fare-share ticket
       (driver's rate from its slider, ₹10 minimum) and the Impact page's 0.12 kg CO₂ per car-km. */
    var RIDES = [['You', 14], ['Anita', 7], ['Vikram', 4]], KG_PER_KM = 0.12;
    var sum = document.createElement('section');
    sum.className = 'trip-sum';
    sum.setAttribute('aria-label', 'Trip summary');
    sum.innerHTML = '<p class="tsum-k"><i></i>Trip complete · 08:30</p><p class="tsum-h">3 cars fewer on the road</p>' +
      '<dl class="tsum-d"><div><dt>Riders</dt><dd>3</dd></div><div><dt>Shared</dt><dd data-km></dd></div>' +
      '<div><dt>To Rahul</dt><dd data-pay></dd></div><div><dt>CO₂ saved</dt><dd data-co2></dd></div></dl>' +
      '<p class="tsum-f"><span>Example trip at <b data-rate></b>/km, no commission.</span><button type="button" class="tsum-again">Ride again ↺</button></p>';
    document.body.appendChild(sum);
    function fillSummary() {
      var input = document.getElementById('rate'), rate = input ? parseFloat(input.value) || 4 : 4, km = 0, pay = 0;
      RIDES.forEach(function (r) { km += r[1]; pay += Math.max(10, Math.round(r[1] * rate)); });
      sum.querySelector('[data-km]').textContent = km + ' km';
      sum.querySelector('[data-pay]').textContent = '₹' + pay;
      sum.querySelector('[data-co2]').textContent = '≈ ' + Math.round(km * KG_PER_KM) + ' kg';
      sum.querySelector('[data-rate]').textContent = '₹' + (rate % 1 ? rate.toFixed(1) : rate);
    }
    fillSummary();
    sum.querySelector('.tsum-again').addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    });

    var on = false, pieces = [], total = 0, anchors = [], k = 1, CW = BASE_W, CL = BASE_W * 2.02, Lmin = 0, Lmax = 0;
    var L = 0, v = 0, hold = 0, raf = 0, last = 0, tagTimer = 0, ready = false;

    function pointAt(len) {
      var acc = 0;
      for (var i = 0; i < pieces.length; i++) {
        var pc = pieces[i];
        if (len <= acc + pc.len || i === pieces.length - 1) return pc.at(Math.max(0, Math.min(1, (len - acc) / (pc.len || 1))));
        acc += pc.len;
      }
      return [0, 0, 0];
    }
    // First distance along the road whose point is at or below page height y (the road never climbs).
    function firstAt(y) {
      var lo = 0, hi = total;
      for (var i = 0; i < 28; i++) { var mid = (lo + hi) / 2; if (pointAt(mid)[1] < y) lo = mid; else hi = mid; }
      return hi;
    }
    // Car-local point (drawing units) → page point, for a car at `pose` ([x, y, heading]).
    function carToPage(lx, ly, pose) {
      var s = CW / 200, a = pose[2] + Q, dx = (lx - 100) * s, dy = (ly - 202) * s;
      return [pose[0] + dx * Math.cos(a) - dy * Math.sin(a), pose[1] + dx * Math.sin(a) + dy * Math.cos(a)];
    }
    // Labels: centred on x, sitting on y.
    function place(el, x, y) { el.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px) translate(-50%,-100%)'; }

    function layout() {
      // Open the destination strip first (trip.css), so everything below is measured with it in place.
      root.classList.toggle('trip-room', mq.matches);
      var W = root.clientWidth;
      var secs = {}, ok = mq.matches;
      if (ok) {
        PLAN.forEach(function (p) {
          [].concat(p.home || [], p.stop || [], p.cross || [], p.office || []).forEach(function (sel) {
            if (secs[sel] === undefined) { var el = document.querySelector(sel); secs[sel] = el ? inkBox(el, W) : null; }
          });
        });
        for (var sel in secs) if (!secs[sel]) ok = false;
      }
      var cL = W, cR = 0;
      if (ok) for (var s2 in secs) { cL = Math.min(cL, secs[s2].left); cR = Math.max(cR, secs[s2].right); }
      var off = Math.min(cL, W - cR) / 2; // lane centre to the nearest ink
      // Car size from the margin: car + open door + a rider beside it must fit between the lane and the edge.
      CW = Math.min(BASE_W, (off - 4) / 1.12);
      if (!ok || CW < 34) { on = false; root.classList.remove('trip-on', 'trip-room'); return; }
      k = CW / BASE_W; CL = CW * 2.02;
      var RW = Math.round(CW * 0.74), r = Math.min(70, off - 6);
      var lanes = { L: cL / 2, R: cR + (W - cR) / 2 };
      var vh = window.innerHeight, docH = root.scrollHeight;

      // Crossing heights: the middle of the empty gap between two sections. Too small a gap: no trip.
      function gapY(a, b) {
        var top = secs[a].bottom, bot = secs[b].top;
        if (bot - top < CW + 24) ok = false;
        return (top + bot) / 2;
      }

      pieces = []; anchors = [];
      var crossings = []; // anchor index where each crossing starts, and the gap's centre line
      var lane = home.p.lane, x = lanes[lane];
      var houseH = 54 * k, y0 = secs[home.p.home].top + houseH + 4, y = y0, len = 0;
      var marks = []; // places with drawings next to the road (no trees there)
      function push(pc) { pieces.push(pc); len += pc.len; }
      function down(toY) { if (toY > y) { push(new Line(x, y, x, toY)); y = toY; anchors.push([y, len]); } }
      anchors.push([y, 0]);
      var stopAt = {};
      // The office: its road runs along the strip above the footer, and the office stands a quarter of the way in.
      var officeP = PLAN[PLAN.length - 1], oh = 96 * k;
      var footTop = document.querySelector(officeP.office[1]).getBoundingClientRect().top + window.scrollY;
      var officeY = footTop - Math.max(30, RW / 2 + 16);
      var ox = cL + (cR - cL) * 0.22;
      if (officeY - RW / 2 - oh - 34 < secs[officeP.office[0]].bottom + 6) ok = false; // strip too short
      function crossY(p) { return p.office ? officeY : gapY(p.cross[0], p.cross[1]); }
      PLAN.forEach(function (p, i) {
        if (p.cross || p.office) {
          var yc = crossY(p);
          // At the office the car parks just past the door, so the door stays in view.
          var nx = p.office ? ox + CL * 0.55 : lanes[lane === 'R' ? 'L' : 'R'], dir = nx > x ? 1 : -1;
          down(yc - r);
          crossings.push({ a: anchors.length - 1, yc: yc, end: !!p.office });
          // Quarter turn out of the lane, across the gap, and (except at the office) a quarter turn back down.
          push(new Arc(x + dir * r, yc - r, r, dir > 0 ? Math.PI : 0, Q));
          // At the office the road runs on past the lane so the parked car sits right in front of the door.
          var endX = p.office ? nx + dir * (CL / 2 + 6) : nx - dir * r;
          push(new Line(x + dir * r, yc, endX, yc));
          if (!p.office) push(new Arc(nx - dir * r, yc + r, r, -Q, dir > 0 ? 0 : -Math.PI));
          x = nx; lane = lane === 'R' ? 'L' : 'R'; y = p.office ? yc : yc + r;
          anchors.push([y, len]);
          if (p.office) office.at = [x, yc, dir];
        } else if (p.stop) {
          // A stop sits in the straight run that holds it; keep it clear of the bends at both ends.
          var b = secs[p.stop], want = b.top + (b.bottom - b.top) * p.f;
          var next = PLAN[i + 1], limit = next && (next.cross || next.office) ? crossY(next) - r - CL : want;
          var sy = Math.max(y + CL * 1.3, Math.min(want, limit));
          down(sy);
          stopAt[p.name] = { L: len, x: x, y: sy, lane: lane };
        }
      });
      if (!ok) { on = false; root.classList.remove('trip-on', 'trip-room'); return; }
      total = len;
      Lmin = CL / 2 + 2; Lmax = total - CL / 2 - 6;

      on = true;
      root.classList.add('trip-on');
      layer.style.setProperty('--k', k.toFixed(3));
      layer.style.setProperty('--cw', CW.toFixed(1) + 'px');
      layer.style.setProperty('--cl', CL.toFixed(1) + 'px');
      layer.style.setProperty('--rw', RW + 'px');

      // Road, lane paint and trees, drawn in page coordinates.
      var top = y0 - houseH - 40, bottom = office.at[1] + 40;
      map.setAttribute('width', W); map.setAttribute('height', bottom - top);
      map.setAttribute('viewBox', '0 ' + top.toFixed(1) + ' ' + W + ' ' + (bottom - top).toFixed(1));
      map.style.top = top + 'px';
      var d = 'M' + lanes[home.p.lane].toFixed(1) + ' ' + y0.toFixed(1) + pieces.map(function (pc) { return pc.d(); }).join('');
      map.innerHTML = '';
      svgEl('path', { 'class': 'tm-road', d: d, 'stroke-width': RW }, map);
      svgEl('path', { 'class': 'tm-lane', d: d, 'stroke-dasharray': (9 * k).toFixed(1) + ' ' + (12 * k).toFixed(1) }, map);
      // Street lamps (night only, see trip.css): filled in after the trees, drawn above the road and below the car.
      var defs = svgEl('defs', {}, map);
      defs.innerHTML = '<radialGradient id="tmLampG"><stop offset="0" class="tm-l0"/><stop offset=".55" class="tm-l0 tm-lmid"/><stop offset="1" class="tm-l1"/></radialGradient>' + ROADSIDE;
      var groundG = svgEl('g', { 'class': 'tm-ground' }, map); // rail tracks and the zebra crossing, on the tarmac
      var lampG = svgEl('g', { 'class': 'tm-lamps' }, map);

      // Home: a small house whose door opens onto the road.
      var hx = lanes[home.p.lane], hy = y0 - houseH - 2;
      var hg = svgEl('g', { 'class': 'tm-home', transform: 'translate(' + (hx - 30 * k).toFixed(1) + ' ' + hy.toFixed(1) + ') scale(' + k.toFixed(3) + ')' }, map);
      hg.innerHTML = '<rect class="tm-roof" x="40" y="6" width="7" height="14" rx="1"/><path class="tm-roof" d="M1 27L30 4L59 27Z"/><rect class="tm-wall" x="8" y="25" width="44" height="31" rx="2"/>' +
        '<rect class="tm-win" x="13" y="31" width="9" height="9" rx="1.5"/><rect class="tm-win" x="38" y="31" width="9" height="9" rx="1.5"/><rect class="tm-door" x="25" y="37" width="10" height="19" rx="1.5"/>' +
        '<circle class="tm-tree" cx="-4" cy="44" r="7"/><circle class="tm-tree2" cx="-4" cy="38" r="4"/>';
      marks.push([hx, hy, houseH + 10]);
      place(home.lab, hx, hy - 6);

      // Office: a block with the RideSaathi sign on its roof, standing on the road where it ends.
      var oy = office.at[1] - RW / 2;
      var og = svgEl('g', { 'class': 'tm-office', transform: 'translate(' + (ox - 28 * k).toFixed(1) + ' ' + (oy - oh).toFixed(1) + ') scale(' + k.toFixed(3) + ')' }, map);
      var wins = '';
      for (var row = 0; row < 4; row++) for (var col = 0; col < 3; col++) wins += '<rect class="tm-bwin" x="' + (9 + col * 14) + '" y="' + (26 + row * 13) + '" width="10" height="8" rx="1.5"/>';
      og.innerHTML = '<rect class="tm-bldg" x="2" y="18" width="52" height="78" rx="3"/>' + wins +
        '<rect class="tm-glass" x="19" y="78" width="18" height="18" rx="1.5"/><path class="tm-frame" d="M28 78V96"/>' +
        '<rect class="tm-mast" x="27" y="12" width="2" height="7"/><circle class="tm-glow" cx="28" cy="7" r="15"/><rect class="tm-logo" x="18" y="0" width="20" height="14" rx="3.5"/>' +
        '<path class="tm-logo-line" d="M28 1V13"/><circle class="tm-logo-dot" cx="28" cy="7" r="3.6"/>' +
        '<circle class="tm-tree" cx="-12" cy="86" r="9"/><circle class="tm-tree2" cx="-12" cy="77" r="5.5"/><circle class="tm-tree2" cx="68" cy="89" r="6.5"/>';
      office.g = og;
      var bw = og.querySelectorAll('.tm-bwin');
      office.wins = [bw[10], bw[6], bw[2]]; // a desk on each floor, bottom up
      office.door = [ox, oy - 2 * k];
      office.ox = ox;
      marks.push([ox, oy - oh, oh + RW]);
      place(office.lab, ox, oy - oh - 6);

      // Stops: the rider waits beside the door they will use, with a small sign behind them.
      stops.forEach(function (s) {
        var st = stopAt[s.p.name];
        s.L = st.L; s.lane = st.lane;
        var pose = [st.x, st.y, Q];
        var side = st.lane === 'L' ? -1 : 1; // towards the screen edge
        var dp = carToPage(100, SEAT[s.seat][1], pose);
        var pw = 14 * k, ph = 29.4 * k;
        var standX = st.x + side * (CW / 2 + 13 * k + pw / 2 + 2), walkX = st.x + side * (CW / 2 + 2 + pw / 2);
        s.who.style.left = (standX - pw / 2).toFixed(1) + 'px';
        s.who.style.top = (dp[1] - ph + 6 * k).toFixed(1) + 'px';
        s.who.style.setProperty('--walk', (walkX - standX).toFixed(1) + 'px');
        place(s.lab, st.x, st.y - CL / 2 - 10);
        marks.push([st.x, st.y - CL, CL * 2]);
      });

      // Exit walkers start beside their door when the car is parked at the office.
      var endPose = pointAt(Lmax);
      office.out.forEach(function (el, i) {
        var s = stops[i], d2 = DOOR[s.door];
        var p = carToPage(d2[0] === 'l' ? 8 : 192, d2[1] + d2[2] / 2, endPose);
        var pw = 14 * k, ph = 29.4 * k;
        el.style.left = (p[0] - pw / 2).toFixed(1) + 'px';
        el.style.top = (p[1] - ph + 4 * k).toFixed(1) + 'px';
        el.style.setProperty('--gx', (office.door[0] - p[0]).toFixed(1) + 'px');
        el.style.setProperty('--gy', (office.door[1] - p[1]).toFixed(1) + 'px');
      });
      // Ghost cars queue on the road behind the parked car; the summary sits in the strip above them.
      office.ghosts.forEach(function (g, i) {
        g.style.transform = 'translate(' + (endPose[0] - office.at[2] * CL * 1.2 * (i + 1)).toFixed(1) + 'px,' + endPose[1].toFixed(1) + 'px)';
      });
      var sumW = Math.min(330, cR - (ox + 44 * k) - 8);
      sum.style.width = sumW + 'px';
      sum.style.left = (ox + 44 * k).toFixed(1) + 'px';
      sum.style.top = (oy - 12 - sum.offsetHeight).toFixed(1) + 'px';

      // A traffic signal with a zebra crossing on the longest straight run, and a railway level crossing on the
      // next one, each clear of the stops and of the bends.
      function hitMark(x0, ya, yb) {
        for (var m = 0; m < marks.length; m++) if (Math.abs(marks[m][0] - x0) < 4 && yb > marks[m][1] - 14 && ya < marks[m][1] + marks[m][2] + 14) return true;
        return false;
      }
      var acc0 = 0, runs = [];
      pieces.forEach(function (pc) { pc.s = acc0; acc0 += pc.len; if (pc instanceof Line && pc.x0 === pc.x1 && pc.len > CL * 4) runs.push(pc); });
      runs.sort(function (a, b) { return b.len - a.len; });
      var sigG = svgEl('g', {}, map), feats = [];
      runs.forEach(function (pc) {
        if (feats.length > 1) return;
        [0.5, 0.35, 0.65].some(function (f) {
          var fy = pc.y0 + pc.len * f;
          if (fy - pc.y0 < CL * 1.5 || pc.y1 - fy < CL * 1.5 || hitMark(pc.x0, fy - 44 * k, fy + 44 * k)) return false;
          feats.push({ pc: pc, y: fy });
          marks.push([pc.x0, fy - 44 * k, 88 * k]);
          return true;
        });
      });
      sig = null;
      var lk = k * 1.35; // signal, barriers and the crossing sign, a little larger than the map scale
      feats.forEach(function (ft, i) {
        var x0 = ft.pc.x0, fy = ft.y, sd = x0 < W / 2 ? -1 : 1, e = RW / 2;
        if (i === 0) { // the signal: stop line, zebra stripes and the signal head on the kerb before them
          svgEl('rect', { 'class': 'tm-zebra', x: (x0 - e + 2 * k).toFixed(1), y: (fy - 10 * k).toFixed(1), width: (RW - 4 * k).toFixed(1), height: (1.6 * k).toFixed(1) }, groundG);
          for (var zx = x0 - e + 3 * k; zx < x0 + e - 5 * k; zx += 6 * k) svgEl('rect', { 'class': 'tm-zebra', x: zx.toFixed(1), y: (fy - 5 * k).toFixed(1), width: (3.2 * k).toFixed(1), height: (11 * k).toFixed(1) }, groundG);
          var g = svgEl('g', { 'class': 'tm-sig red', transform: 'translate(' + (x0 + sd * (e + 7 * k)).toFixed(1) + ' ' + (fy - 7 * k).toFixed(1) + ') scale(' + lk.toFixed(3) + ')' }, sigG);
          g.innerHTML = '<rect class="tm-spole" x="-.9" y="-18" width="1.8" height="18"/><rect class="tm-shead" x="-4" y="-35" width="8" height="18" rx="2"/>' +
            '<circle class="tm-sgl r" cy="-30.5" r="5.5"/><circle class="tm-sgl a" cy="-26" r="5.5"/><circle class="tm-sgl g" cy="-21.5" r="5.5"/>' +
            '<circle class="tm-sl tm-sr" cy="-30.5" r="1.9"/><circle class="tm-sl tm-sa" cy="-26" r="1.9"/><circle class="tm-sl tm-sg" cy="-21.5" r="1.9"/>';
          sig = { L: ft.pc.s + (fy - ft.pc.y0), g: g, state: 'red' };
        } else { // the level crossing: sleepers and rails across the margin, boom barriers up on both sides
          var xa = sd < 0 ? 0 : cR + 8, xb = sd < 0 ? cL - 8 : W;
          for (var sx = xa + 2 * k; sx < xb - 2 * k; sx += 6 * k) {
            if (Math.abs(sx - x0) < e + 1) continue;
            svgEl('rect', { 'class': 'tm-sleeper', x: sx.toFixed(1), y: (fy - 6.5 * k).toFixed(1), width: (2.6 * k).toFixed(1), height: (13 * k).toFixed(1), rx: (0.6 * k).toFixed(1) }, groundG);
          }
          [-4, 4].forEach(function (dy) { svgEl('path', { 'class': 'tm-rail', 'stroke-width': (1.4 * k).toFixed(2), d: 'M' + xa.toFixed(1) + ' ' + (fy + dy * k).toFixed(1) + 'H' + xb.toFixed(1) }, groundG); });
          [[-1, -1], [1, 1]].forEach(function (b) {
            var bg = svgEl('g', { transform: 'translate(' + (x0 + b[0] * (e + 5 * k)).toFixed(1) + ' ' + (fy + b[1] * 12 * k).toFixed(1) + ') scale(' + lk.toFixed(3) + ')' }, sigG);
            bg.innerHTML = '<rect class="tm-boom-w" x="-1" y="-29" width="2" height="23" rx="1"/><rect class="tm-boom-r" x="-1" y="-27" width="2" height="4"/><rect class="tm-boom-r" x="-1" y="-19" width="2" height="4"/>' +
              '<rect class="tm-bpost" x="-1.8" y="-7" width="3.6" height="7" rx=".8"/>';
          });
          var xg = svgEl('g', { transform: 'translate(' + (x0 + sd * (e + 15 * k)).toFixed(1) + ' ' + (fy - 8 * k).toFixed(1) + ') scale(' + lk.toFixed(3) + ')' }, sigG);
          xg.innerHTML = '<rect class="tm-spole" x="-.7" y="-16" width="1.4" height="16"/><path class="tm-xb-o" d="M-5 -21L5 -13M5 -21L-5 -13"/><path class="tm-xb" d="M-5 -21L5 -13M5 -21L-5 -13"/>';
        }
      });

      /* Roadside: trees, palms, bushes and small buildings on the straight runs, both sides, where nothing else is
         drawn and the margin has room. Buildings mostly on the side towards the screen edge, to keep the side
         next to the text calm. The mix is fixed by position, so it doesn't change between visits. */
      var tg = svgEl('g', { 'class': 'tm-trees' }, map);
      var step = 66 * k;
      var KINDS = { neem: ['tmNeem', 25, 25], palm: ['tmPalm', 27, 27], bush: ['tmBush', 19, 14], shop: ['tmShop', 36, 29], flat: ['tmFlat', 26, 47], house: ['tmHouse', 31, 26] };
      function rnd(n) { var s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); }
      pieces.forEach(function (pc) {
        if (!(pc instanceof Line) || pc.x0 !== pc.x1) return;
        var outer = pc.x0 < W / 2 ? -1 : 1;
        for (var ty = pc.y0 + step / 2; ty < pc.y1 - 10; ty += step) {
          [-1, 1].forEach(function (sd, j) {
            var yy = ty + (j ? step / 2 : 0);
            if (yy > pc.y1 - 10) return;
            var r1 = rnd(Math.round(yy) * 3 + j), r2 = rnd(Math.round(yy) * 7 + j + 1);
            var kind = r1 < (sd === outer ? 0.42 : 0.14) ? (r2 < 0.4 ? 'shop' : r2 < 0.7 ? 'house' : 'flat') : (r2 < 0.5 ? 'neem' : r2 < 0.78 ? 'palm' : 'bush');
            var kd = KINDS[kind], w = kd[1] * k, h = kd[2] * k, bld = kind === 'shop' || kind === 'house' || kind === 'flat';
            var tx = pc.x0 + sd * (RW / 2 + (bld ? 9 : 3) * k + w / 2);
            if (tx - w / 2 < 4 || tx + w / 2 > W - 4 || (tx + w / 2 > cL - 6 && tx - w / 2 < cR + 6)) {
              kind = 'bush'; kd = KINDS.bush; w = kd[1] * k; h = kd[2] * k; bld = false; tx = pc.x0 + sd * (RW / 2 + 3 * k + w / 2);
              if (tx - w / 2 < 4 || tx + w / 2 > W - 4 || (tx + w / 2 > cL - 6 && tx - w / 2 < cR + 6)) return;
            }
            // Buildings stand on the kerb (their base on the row line); plants are seen from above, centred on it.
            var top2 = bld ? yy + 10 * k - h : yy - h / 2;
            if (hitMark(pc.x0, top2, top2 + h)) return;
            svgEl('use', { href: '#' + kd[0], 'class': 'tm-c' + (1 + Math.floor(r1 * 97) % 4), x: (tx - w / 2).toFixed(1), y: top2.toFixed(1), width: w.toFixed(1), height: h.toFixed(1) }, tg);
          });
        }
      });

      // Street lamps on the straight runs, on the side towards the screen edge, in every other gap between that
      // side's trees: a post at the kerb, an arm over the road and a warm pool of light on the tarmac.
      var pools = svgEl('g', {}, lampG), poles = svgEl('g', {}, lampG);
      pieces.forEach(function (pc) {
        if (!(pc instanceof Line) || pc.x0 !== pc.x1) return;
        var sd = pc.x0 < W / 2 ? -1 : 1;
        for (var ly = pc.y0 + step * (sd < 0 ? 1 : 0.5); ly < pc.y1 - 18 * k; ly += step * 2) {
          var px = pc.x0 + sd * (RW / 2 + 4 * k), hx = pc.x0 + sd * (RW / 2 - 8 * k);
          if (px - 4 < 0 || px + 4 > W) continue;
          var hit = false;
          for (var m = 0; m < marks.length; m++) if (Math.abs(marks[m][0] - pc.x0) < 4 && ly > marks[m][1] - 14 && ly < marks[m][1] + marks[m][2] + 14) hit = true;
          if (hit) continue;
          svgEl('circle', { cx: (pc.x0 + sd * RW * 0.1).toFixed(1), cy: ly.toFixed(1), r: (RW * 0.9).toFixed(1), fill: 'url(#tmLampG)' }, pools);
          svgEl('path', { 'class': 'tm-arm', d: 'M' + px.toFixed(1) + ' ' + ly.toFixed(1) + 'H' + hx.toFixed(1) }, poles);
          svgEl('circle', { 'class': 'tm-post', cx: px.toFixed(1), cy: ly.toFixed(1), r: (2.2 * k).toFixed(1) }, poles);
          svgEl('circle', { 'class': 'tm-bulb', cx: hx.toFixed(1), cy: ly.toFixed(1), r: (2.6 * k).toFixed(1) }, poles);
        }
      });

      /* Scroll → distance along the road. Anchors start as page heights (on the straight runs the car sits LEAD of
         the way down the screen). Each crossing then gets its own, longer stretch of scrolling: the car sets off
         when the gap is 85% of the way down the screen and is across by the time the gap is 30% from the top, so
         the whole crossing plays out in view at normal reading speed. Straight runs share what is left. */
      var maxScroll = Math.max(1, docH - vh), maxC = maxScroll + LEAD * vh;
      crossings.forEach(function (cr) {
        // The drive into the office runs earlier (gap from the bottom edge to just above the middle), so the
        // drop-off plays in view even if you scroll straight on to the questions.
        // (Anchor = scrollY + LEAD·vh, so "gap at f of the screen" is anchor yc + (LEAD − f)·vh.)
        anchors[cr.a][0] = cr.yc + (LEAD - (cr.end ? 0.95 : 0.85)) * vh;
        anchors[cr.a + 1][0] = cr.yc + (LEAD - (cr.end ? 0.45 : 0.3)) * vh;
      });
      var lastA = anchors.length - 1;
      anchors[lastA][0] = Math.min(anchors[lastA][0], maxC - 8);
      // Crossings keep their windows (only nudged apart if two would overlap); stops and straight runs fit in
      // between them, as early as that room allows.
      var minStep = 60, hard = {}, ai;
      crossings.forEach(function (cr) { hard[cr.a] = hard[cr.a + 1] = true; });
      var prevHard = -Infinity;
      for (ai = 0; ai <= lastA; ai++) if (hard[ai]) { anchors[ai][0] = Math.max(anchors[ai][0], prevHard + minStep); prevHard = anchors[ai][0]; }
      for (ai = 0; ai <= lastA; ai++) {
        if (hard[ai]) continue;
        var nh = ai + 1; while (nh <= lastA && !hard[nh]) nh++;
        var lo = ai > 0 ? anchors[ai - 1][0] + minStep : -Infinity;
        var hi = nh <= lastA ? anchors[nh][0] - minStep * (nh - ai) : Infinity;
        var c = Math.min(Math.max(anchors[ai][0], lo), hi);
        if (c < lo) c = anchors[ai - 1][0] + (anchors[nh][0] - anchors[ai - 1][0]) / (nh - ai + 1); // squeezed: share it
        anchors[ai][0] = c;
      }
      layout.maxScroll = maxScroll;
      layout.short = anchors[lastA][0] > maxC - 4;
      if (!ready) { L = target(); ready = true; settle(true); }
      else settle(true);
      render();
      kick();
    }

    function target() {
      var c = window.scrollY + window.innerHeight * LEAD, t;
      if (c <= anchors[0][0]) t = 0;
      else {
        t = anchors[anchors.length - 1][1];
        for (var i = 1; i < anchors.length; i++) {
          if (c <= anchors[i][0]) {
            var a = anchors[i - 1], b = anchors[i];
            t = a[1] + (b[1] - a[1]) * ((c - a[0]) / Math.max(1, b[0] - a[0]));
            break;
          }
        }
      }
      var nearBottom = 1 - (layout.maxScroll - window.scrollY) / 260;
      if (layout.short && nearBottom > 0) t = t + (total - t) * Math.min(1, nearBottom);
      return Math.max(Lmin, Math.min(Lmax, t));
    }

    /* ---------- Riders getting in and out ---------- */
    function clear(o) { o.timers.forEach(clearTimeout); o.timers = []; }
    function later(o, ms, fn) { o.timers.push(setTimeout(fn, ms)); }
    function say(text, color) {
      tag.innerHTML = '<i></i>' + text;
      tag.style.setProperty('--tag-c', color || 'var(--line)');
      tag.classList.add('show');
      clearTimeout(tagTimer);
      tagTimer = setTimeout(function () { tag.classList.remove('show'); }, 2000);
    }
    function boardNow(s, inside) {
      clear(s);
      s.inside = inside;
      s.who.classList.remove('walk', 'quick');
      s.who.classList.toggle('gone', inside);
      avs[s.seat].classList.toggle('on', inside && !office.arrived);
      doors[s.door].classList.remove('open'); slots[s.door].classList.remove('open');
      s.lab.classList.toggle('passed', inside);
    }
    /* A pickup: door opens, rider walks over and sits, door closes. The full version (~1.9 s) when you are reading;
       a quick one (~0.85 s) when you are scrolling on, so the car never gets left behind. */
    var boarding = null; // the stop being picked up right now
    function doorShut(s) {
      if (!doors[s.door].classList.contains('open')) return;
      doors[s.door].classList.remove('open'); slots[s.door].classList.remove('open'); play('door-close');
      say(s.p.name === 'You' ? 'You got in' : s.p.name + ' got in', s.p.color);
    }
    function pickup(s, now, quick) {
      clear(s);
      s.inside = true;
      boarding = s;
      s.lab.classList.add('passed');
      car.classList.toggle('quick', !!quick);
      s.who.classList.toggle('quick', !!quick);
      var t = quick ? [0, 80, 330, 420, 560, 850] : [150, 450, 1000, 1130, 1300, 1700];
      hold = now + t[5];
      flash();
      later(s, t[0], function () { doors[s.door].classList.add('open'); slots[s.door].classList.add('open'); play('door-open'); });
      later(s, t[1], function () { s.who.classList.add('walk'); });
      later(s, t[2], function () { s.who.classList.add('gone'); });
      later(s, t[3], function () { avs[s.seat].classList.add('on'); });
      later(s, t[4], function () { doorShut(s); });
      later(s, t[5], function () { boarding = null; });
    }
    // Finish a pickup on the spot (the car is about to slide off the screen, or you scrolled far ahead).
    function finishPickup(s) {
      clear(s);
      s.who.classList.add('walk', 'gone');
      avs[s.seat].classList.add('on');
      doorShut(s);
      boarding = null;
    }
    function arrive(animate) {
      clear(office);
      office.arrived = true;
      if (!animate) {
        stops.forEach(function (s) { avs[s.seat].classList.remove('on'); });
        office.wins.forEach(function (w) { w.classList.add('lit'); });
        office.g.classList.add('lit'); fillSummary(); sum.classList.add('show');
        return;
      }
      var ds = stops.map(function (s) { return s.door; });
      later(office, 250, function () { ds.forEach(function (d) { doors[d].classList.add('open'); slots[d].classList.add('open'); }); play('door-open'); });
      later(office, 650, function () { stops.forEach(function (s) { avs[s.seat].classList.remove('on'); }); office.out.forEach(function (el) { el.classList.add('show'); }); });
      later(office, 950, function () { office.out.forEach(function (el) { el.classList.add('walk'); }); });
      later(office, 1500, function () { ds.forEach(function (d) { doors[d].classList.remove('open'); slots[d].classList.remove('open'); }); play('door-close'); });
      // At their desks: a window lights up on each floor, then the RideSaathi sign on the roof glows.
      office.wins.forEach(function (w, i) { later(office, 1950 + i * 260, function () { w.classList.add('lit'); }); });
      later(office, 2300, function () { office.out.forEach(function (el) { el.classList.add('gone'); }); });
      later(office, 2750, function () { office.g.classList.add('lit'); });
      // The three cars that stayed at home appear behind Rahul's car, then clear one by one; the summary comes in.
      later(office, 2900, function () { office.ghosts.forEach(function (g) { g.classList.add('show'); }); });
      later(office, 3300, function () { fillSummary(); sum.classList.add('show'); });
      later(office, 5400, function () { office.ghosts.forEach(function (g) { g.classList.add('gone'); }); });
    }
    function leaveOffice() {
      clear(office);
      office.arrived = false;
      office.out.forEach(function (el) { el.classList.remove('show', 'walk', 'gone'); });
      office.ghosts.forEach(function (g) { g.classList.remove('show', 'gone'); });
      office.wins.forEach(function (w) { w.classList.remove('lit'); });
      if (office.g) office.g.classList.remove('lit');
      sum.classList.remove('show');
      stops.forEach(function (s) { avs[s.seat].classList.toggle('on', s.inside); doors[s.door].classList.remove('open'); slots[s.door].classList.remove('open'); });
    }
    // Make rider state match the car's position without animation (first paint, jumps, resizes, reduced motion).
    function settle(quiet) {
      if (quiet) { hold = 0; boarding = null; }
      stops.forEach(function (s) { var inside = L >= s.L - 1; if (inside !== s.inside || quiet) boardNow(s, inside); });
      var at = L >= Lmax - 1;
      if (at && !office.arrived) arrive(false);
      if (!at && office.arrived) leaveOffice();
    }

    function onScreen(y) { return y > window.scrollY + 40 && y < window.scrollY + window.innerHeight - 40; }

    function render() {
      var p = pointAt(L);
      car.style.transform = 'translate(' + p[0].toFixed(1) + 'px,' + p[1].toFixed(1) + 'px) rotate(' + ((p[2] + Q) * 180 / Math.PI).toFixed(2) + 'deg)';
      var hw = (tag.offsetWidth || 100) / 2 + 6;
      var tx = Math.max(hw, Math.min(root.clientWidth - hw, p[0]));
      var ty = Math.abs(Math.sin(p[2])) > 0.5 ? p[1] + CL / 2 + 12 : p[1] + CW / 2 + 12; // below the car
      tag.style.transform = 'translate(' + tx.toFixed(1) + 'px,' + ty.toFixed(1) + 'px) translateX(-50%)';
      // The signal turns green as the car comes up to it, amber once it is through, then red again.
      if (sig) {
        var dl = L - sig.L, st = dl < -280 * k || dl > 380 * k ? 'red' : dl > 120 * k ? 'amber' : 'green';
        if (st !== sig.state) { sig.g.classList.remove('red', 'amber', 'green'); sig.g.classList.add(st); sig.state = st; }
      }
    }

    var ACC = 2400, VMAX = 1600, DEC = 1000;
    var scrollSpeed = 0, lastScroll = window.scrollY;
    function frame(now) {
      raf = 0;
      if (!on) return;
      var dt = Math.min(0.05, (now - (last || now)) / 1000);
      last = now;
      // How fast you are scrolling down (smoothed), to pick a full or a quick pickup.
      var sdy = window.scrollY - lastScroll; lastScroll = window.scrollY;
      if (dt > 0) scrollSpeed += (Math.max(0, sdy / dt) - scrollSpeed) * Math.min(1, dt * 4);
      var T = target(), braking = false, vh = window.innerHeight;

      if (reduce) { L = T; v = 0; settle(false); render(); return; }
      if (Math.abs(T - L) > 2200) { // a big jump (link, keyboard): skip ahead without the show
        stops.concat(office).forEach(clear); hold = 0; boarding = null;
        L = T - Math.sign(T - L) * 260; v = 0; settle(true);
      }
      // Keep the car in view. The road only ever runs down the page, so the part on screen is one stretch of it.
      // If you scroll faster than the car can drive (or jump), it skips ahead out of sight to just beyond the
      // screen edge and drives straight back in. Riders it passed are already seated.
      var top = window.scrollY - CL * 0.6, bottom = window.scrollY + vh + CL * 0.6, skip = -1;
      if (T > L && pointAt(L)[1] < top) skip = Math.min(T, firstAt(top));
      else if (T < L && pointAt(L)[1] > bottom) skip = Math.max(T, firstAt(bottom));
      if (skip >= 0 && Math.abs(skip - L) > 1) {
        if (boarding) finishPickup(boarding);
        hold = 0; L = Math.max(Lmin, Math.min(Lmax, skip)); settle(false);
      }
      if (hold && T < L - 2) { // scrolling back during a pickup: let the car go
        hold = 0; boarding = null; stops.forEach(function (s) { if (s.timers.length) boardNow(s, true); });
      }
      if (hold) {
        v = 0; braking = true;
        // Never leave the car behind: wrap up the pickup if it is about to slide off the top, or you are far ahead.
        var carY = pointAt(L)[1] - window.scrollY;
        if (boarding && (carY < 0.15 * vh || T - L > 1.2 * vh)) { finishPickup(boarding); hold = now + 120; }
        if (now >= hold) hold = 0;
      } else {
        // Head for the scroll position, braking early enough never to overshoot it (no reversing). The further
        // behind the car is, the faster it may go, so it catches up instead of dropping off the screen.
        var gap = Math.abs(T - L), behind = Math.max(0, T - L - 0.2 * vh);
        var nearTop = T > L && pointAt(L)[1] - window.scrollY < 0.25 * vh; // about to be left behind
        if (nearTop) behind = Math.max(behind, 0.3 * vh);
        var vmax = Math.min(3600, VMAX + behind * 5), dec = behind > 0 ? 1600 : DEC;
        var vd = Math.sign(T - L) * Math.min(vmax, gap * 5, Math.sqrt(2 * ACC * 0.8 * gap));
        // Ease into the next waiting rider and into the office.
        if (vd > 0) {
          var stopL = Lmax;
          for (var i = 0; i < stops.length; i++) if (!stops[i].inside && stops[i].L > L) { stopL = Math.min(stopL, stops[i].L); break; }
          var cap = Math.sqrt(2 * dec * Math.max(0, stopL - L)) + 12;
          if (vd > cap) { vd = cap; braking = cap < v; }
        }
        var acc = behind > 0 ? 3200 : ACC;
        v += Math.max(-acc * dt, Math.min(acc * dt, vd - v));
        var next = L + v * dt;
        stops.forEach(function (s) {
          if (!s.inside && L < s.L && next >= s.L) {
            // Full pickup if it fits before the car would reach the top of the screen at your scroll speed.
            var sy = pointAt(s.L)[1];
            if (onScreen(sy)) {
              var room = (sy - window.scrollY - 0.15 * vh) / Math.max(1, scrollSpeed);
              next = s.L; v = 0; pickup(s, now, scrollSpeed > 60 && room < 1.8); braking = true;
            }
            else boardNow(s, true);
          } else if (s.inside && next < s.L - 1 && L >= s.L - 1) boardNow(s, false);
        });
        L = Math.max(Lmin, Math.min(Lmax, next));
        if (L >= Lmax - 1 && !office.arrived) arrive(onScreen(pointAt(L)[1]));
        else if (L < Lmax - 1 && office.arrived) leaveOffice();
      }
      car.classList.toggle('brake', braking || (Math.abs(v) < 4 && Math.abs(T - L) < 2));
      render();
      if (hold || Math.abs(T - L) > 0.4 || Math.abs(v) > 2) kick();
      else last = 0;
    }
    function kick() { if (!raf && on) raf = requestAnimationFrame(frame); }

    var lt = 0;
    function relayout() { clearTimeout(lt); lt = setTimeout(layout, 120); }
    window.addEventListener('scroll', kick, { passive: true });
    window.addEventListener('resize', relayout);
    window.addEventListener('load', layout);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);
    if ('ResizeObserver' in window) { var main = document.querySelector('main'); if (main) new ResizeObserver(relayout).observe(main); }
    if (mq.addEventListener) mq.addEventListener('change', layout);
    layout();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', trip);
  else trip();
})();
