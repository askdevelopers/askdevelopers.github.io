/* RideSaathi home page: departure board, the car driving the line as you scroll, the fare ticket, the women-only
   switch and the India metro map (the trip down the margins is in trip.js). No inline scripts (strict CSP). Fare maths matches src/lib/match.ts. */
(function () {
  var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  /* ---------- Departure board: sample routes across India, swapped every few seconds ---------- */
  var ROUTES = [
    ['07:40', 'Whitefield → Manyata Tech Park', 'Bengaluru', '2 free'],
    ['08:05', 'Thane → BKC', 'Mumbai', '3 free'],
    ['08:15', 'Kharadi → Hinjewadi', 'Pune', '1 free'],
    ['08:30', 'Noida Sector 62 → Cyber City', 'Delhi NCR', '2 free'],
    ['SAT 06:30', 'Pune → Mumbai', 'Intercity', '3 free'],
    ['08:10', 'Kukatpally → HITEC City', 'Hyderabad', '2 free'],
    ['08:20', 'Velachery → Sholinganallur', 'Chennai', '1 free'],
    ['08:35', 'Howrah → Salt Lake Sector V', 'Kolkata', '3 free'],
    ['08:45', 'Bopal → SG Highway', 'Ahmedabad', '2 free'],
    ['FRI 18:00', 'Delhi → Jaipur', 'Intercity', '2 free'],
    ['08:25', 'Edappally → Infopark', 'Kochi', '1 free'],
    ['08:50', 'Gomti Nagar → Hazratganj', 'Lucknow', '2 free'],
    ['08:40', 'Vijay Nagar → Super Corridor', 'Indore', '3 free'],
    ['SUN 07:00', 'Bengaluru → Chennai', 'Intercity', '2 free'],
    ['09:00', 'Malviya Nagar → Sitapura', 'Jaipur', '1 free']
  ];

  function board() {
    var list = document.getElementById('dbRows');
    if (!list || reduce) return;
    var rows = list.querySelectorAll('li');
    var at = rows.length;
    setInterval(function () {
      if (document.hidden) return;
      rows.forEach(function (li, i) {
        setTimeout(function () {
          li.classList.add('out');
          setTimeout(function () {
            var r = ROUTES[(at + i) % ROUTES.length];
            var cells = li.children;
            for (var c = 0; c < 4; c++) cells[c].textContent = r[c];
            li.classList.remove('out');
          }, 520);
        }, i * 110);
      });
      at = (at + rows.length) % ROUTES.length;
    }, 6000);
  }

  /* ---------- The line: the car's position follows the scroll ---------- */
  function line() {
    var track = document.getElementById('lnTrack');
    if (!track) return;
    var stops = track.querySelectorAll('.ln-stops li');
    var ticking = false;
    function update() {
      ticking = false;
      var r = track.getBoundingClientRect();
      var vh = window.innerHeight || 800;
      var p;
      if (window.innerWidth >= 860) p = (vh * 0.85 - r.top) / (vh * 0.5);
      else p = (vh * 0.62 - r.top) / r.height;
      p = Math.max(0, Math.min(1, p));
      track.style.setProperty('--p', p.toFixed(4));
      stops.forEach(function (li, i) { li.classList.toggle('on', p >= i / (stops.length - 1) - 0.01); });
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  }

  /* ---------- Fair share: rate slider updates the ticket ---------- */
  var MIN_FARE = 10;
  function fare(km, rate) { return Math.max(MIN_FARE, Math.round(km * rate)); }
  function rupees(n) { return '₹' + (n % 1 ? n.toFixed(1) : String(n)); }

  function share() {
    var input = document.getElementById('rate');
    if (!input) return;
    var out = document.getElementById('rateOut');
    var cells = { you: document.getElementById('tkYou'), ani: document.getElementById('tkAni'), drv: document.getElementById('tkDrv') };
    var rateEl = document.getElementById('tkRate');
    function set(el, text) {
      if (el.textContent === text) return;
      el.textContent = text;
      el.classList.remove('tick'); void el.offsetWidth; el.classList.add('tick');
    }
    function update() {
      var rate = parseFloat(input.value);
      var you = fare(14, rate), ani = fare(7, rate);
      out.textContent = rupees(rate) + ' / km';
      rateEl.textContent = rupees(rate);
      set(cells.you, rupees(you));
      set(cells.ani, rupees(ani));
      set(cells.drv, rupees(you + ani));
      input.style.setProperty('--v', ((rate - 2) / 6 * 100).toFixed(1) + '%');
    }
    input.addEventListener('input', update);
    update();
  }

  /* ---------- Women-only switch ---------- */
  function women() {
    var sw = document.getElementById('womenSw');
    var fig = document.getElementById('sxFig');
    if (!sw || !fig) return;
    sw.addEventListener('click', function () {
      var on = sw.getAttribute('aria-checked') !== 'true';
      sw.setAttribute('aria-checked', on ? 'true' : 'false');
      fig.classList.toggle('on', on);
    });
  }

  /* ---------- India as a metro map (schematic: positions from real lat/lon, no borders drawn) ---------- */
  var CITIES = {
    del: ['Delhi NCR', 28.61, 77.21, 12, 5, 'start'],
    jai: ['Jaipur', 26.91, 75.79, -13, 5, 'end'],
    lko: ['Lucknow', 26.85, 80.95, 12, -4, 'start'],
    knp: ['Kanpur', 26.45, 80.33, -13, 12, 'end'],
    vns: ['Varanasi', 25.32, 82.97, 0, 26, 'middle'],
    pat: ['Patna', 25.59, 85.14, 0, -15, 'middle'],
    kol: ['Kolkata', 22.57, 88.36, -14, 5, 'end'],
    amd: ['Ahmedabad', 23.02, 72.57, 0, -16, 'middle'],
    srt: ['Surat', 21.17, 72.83, -13, 5, 'end'],
    ind: ['Indore', 22.72, 75.86, 13, -6, 'start'],
    ngp: ['Nagpur', 21.15, 79.09, 13, 5, 'start'],
    bom: ['Mumbai', 19.08, 72.88, -13, 5, 'end'],
    pnq: ['Pune', 18.52, 73.86, 13, 12, 'start'],
    hyd: ['Hyderabad', 17.39, 78.49, 13, 5, 'start'],
    blr: ['Bengaluru', 12.97, 77.59, -13, 5, 'end'],
    maa: ['Chennai', 13.08, 80.27, 13, 5, 'start'],
    cok: ['Kochi', 9.93, 76.27, 13, 5, 'start']
  };
  // Featured intercity corridors (src/data/cities.ts intercityPairs). Class picks the line colour.
  var LINES = [
    ['lko', 'knp', ''], ['bom', 'pnq', ''], ['amd', 'srt', 'alt'], ['vns', 'pat', 'alt2'], ['bom', 'srt', 'alt'],
    ['del', 'jai', ''], ['lko', 'vns', 'alt2'], ['blr', 'maa', 'alt3'], ['knp', 'vns', 'alt2'], ['srt', 'pnq', 'alt'],
    ['amd', 'ind', 'alt3'], ['srt', 'ind', 'alt3']
  ];
  function xy(c) { return [60 + (c[2] - 71.5) * 27.5, 34 + (29.2 - c[1]) * 29.5]; }

  function india() {
    var svg = document.getElementById('inMap');
    if (!svg) return;
    var NS = 'http://www.w3.org/2000/svg';
    function el(name, attrs, parent) {
      var e = document.createElementNS(NS, name);
      for (var k in attrs) e.setAttribute(k, attrs[k]);
      (parent || svg).appendChild(e);
      return e;
    }
    var degree = {};
    LINES.forEach(function (l, i) {
      var a = xy(CITIES[l[0]]), b = xy(CITIES[l[1]]);
      var path = el('path', { d: 'M' + a[0].toFixed(1) + ' ' + a[1].toFixed(1) + 'L' + b[0].toFixed(1) + ' ' + b[1].toFixed(1), pathLength: 1, 'class': ('cor ' + l[2]).trim() });
      path.style.transitionDelay = (i * 0.12).toFixed(2) + 's';
      degree[l[0]] = (degree[l[0]] || 0) + 1;
      degree[l[1]] = (degree[l[1]] || 0) + 1;
    });
    Object.keys(CITIES).forEach(function (id, i) {
      var c = CITIES[id], p = xy(c);
      var g = el('g', { 'class': 'stn' + (degree[id] > 1 ? ' hub' : '') });
      g.style.transitionDelay = (0.3 + i * 0.06).toFixed(2) + 's';
      el('circle', { cx: p[0].toFixed(1), cy: p[1].toFixed(1), r: degree[id] > 1 ? 9 : 7 }, g);
      var t = el('text', { x: (p[0] + c[3]).toFixed(1), y: (p[1] + c[4]).toFixed(1), 'text-anchor': c[5] }, g);
      t.textContent = c[0];
    });
    if ('IntersectionObserver' in window && !reduce) {
      var io = new IntersectionObserver(function (en) {
        if (en[0].isIntersecting) { svg.classList.add('in'); io.disconnect(); }
      }, { threshold: 0.25 });
      io.observe(svg);
    } else {
      svg.classList.add('in');
    }
  }

  function ready() { board(); line(); share(); women(); india(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready);
  else ready();
})();
