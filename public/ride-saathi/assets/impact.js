/* RideSaathi impact page: the zoom-out figure follows the step you are reading, and the pump meter follows the
   sliders. No inline scripts (strict CSP). The sums match the "How we count" section on the page. */
(function () {
  var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var NS = 'http://www.w3.org/2000/svg';

  /* How we count (keep in step with impact.html and the home-page teaser). */
  var KG_PER_KM = 0.12;      // petrol car, middle of the India GHG Program range (0.111–0.140)
  var KG_PER_LITRE = 2.27;   // CO2 per litre of petrol (TERI)
  var WEEKS = 48;            // a working year, leaving four weeks for holidays

  /* ---------- Zoom out ---------- */
  // Half-width of the view at each level: the car, your route, city, state, India, Earth.
  var VIEW = [6.5, 21, 63, 188, 562, 1690];
  var SCALE = ['about 2 m', 'about 1 km', 'about 10 km', 'about 100 km', 'about 1,000 km', 'about 5,000 km'];

  // Small seeded random, so the dots land in the same places on every visit.
  var seed = 7;
  function rnd() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }

  function scatter(group, n, rMin, rMax, size, cls, gap, keepOut) {
    if (!group) return;
    var placed = [];
    var tries = 0;
    while (placed.length < n && tries < n * 60) {
      tries++;
      var a = rnd() * Math.PI * 2;
      var d = rMin + Math.sqrt(rnd()) * (rMax - rMin);
      var s = typeof size === 'number' ? size : size[0] + rnd() * (size[1] - size[0]);
      var x = Math.cos(a) * d, y = Math.sin(a) * d;
      if (d + s > rMax) continue;
      if (keepOut && keepOut(x, y, s)) continue;
      var ok = placed.every(function (p) { return Math.hypot(p[0] - x, p[1] - y) > p[2] + s + gap; });
      if (!ok) continue;
      placed.push([x, y, s]);
      var c = document.createElementNS(NS, 'circle');
      c.setAttribute('cx', x.toFixed(2)); c.setAttribute('cy', y.toFixed(2)); c.setAttribute('r', s.toFixed(2));
      c.setAttribute('class', cls);
      group.appendChild(c);
    }
    return placed;
  }

  function zoom() {
    var svg = document.getElementById('zm');
    var steps = document.querySelectorAll('#zmSteps li');
    var scaleEl = document.getElementById('zmScale');
    if (!svg || !steps.length) return;

    // City: other shared cars. State: other cities. India: other states, each with a few cars of their own.
    scatter(document.getElementById('zmL2'), 46, 18.5, 46, 0.9, 'zm-dot', 1.4, function (x, y) { return y < -34 && Math.abs(x) < 17; });
    var towns = scatter(document.getElementById('zmL3'), 11, 58, 138, [6, 15], 'zm-town', 6) || [];
    var g3 = document.getElementById('zmL3');
    towns.forEach(function (t) {
      for (var i = 0; i < 4; i++) {
        var a = rnd() * Math.PI * 2, d = Math.sqrt(rnd()) * t[2] * 0.7;
        var c = document.createElementNS(NS, 'circle');
        c.setAttribute('cx', (t[0] + Math.cos(a) * d).toFixed(2)); c.setAttribute('cy', (t[1] + Math.sin(a) * d).toFixed(2));
        c.setAttribute('r', '1.4'); c.setAttribute('class', 'zm-dot');
        g3.appendChild(c);
      }
    });
    scatter(document.getElementById('zmL4'), 12, 160, 420, [28, 62], 'zm-town st', 12);

    var level = 0, view = VIEW[0], anim = 0;
    function setView(v) { svg.setAttribute('viewBox', (-v).toFixed(3) + ' ' + (-v).toFixed(3) + ' ' + (2 * v).toFixed(3) + ' ' + (2 * v).toFixed(3)); }
    function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

    function go(next) {
      if (next === level) return;
      level = next;
      svg.setAttribute('data-level', String(next));
      steps.forEach(function (li) { li.classList.toggle('on', li.getAttribute('data-level') === String(next)); });
      if (scaleEl) scaleEl.textContent = SCALE[next];
      var from = view, to = VIEW[next];
      cancelAnimationFrame(anim);
      if (reduce) { view = to; setView(to); return; }
      var t0 = 0, dur = 1300;
      var lf = Math.log(from), lt = Math.log(to);
      function frame(ts) {
        if (!t0) t0 = ts;
        var k = Math.min(1, (ts - t0) / dur);
        view = Math.exp(lf + (lt - lf) * ease(k));
        setView(view);
        if (k < 1) anim = requestAnimationFrame(frame);
      }
      anim = requestAnimationFrame(frame);
    }

    // On phones the figure is pinned over the top half, so a step counts as "being read" lower down the screen.
    var narrow = !(window.matchMedia && window.matchMedia('(min-width: 900px)').matches);
    steps[0].classList.add('on');
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) go(parseInt(en.target.getAttribute('data-level'), 10));
        });
      }, { rootMargin: narrow ? '-72% 0px -26% 0px' : '-48% 0px -48% 0px', threshold: 0 });
      steps.forEach(function (li) { io.observe(li); });
    } else {
      steps.forEach(function (li) { li.classList.add('on'); });
    }
  }

  /* ---------- The pump ---------- */
  function grouped(n) { return Math.round(n).toLocaleString('en-IN'); }

  function pump() {
    var km = document.getElementById('pmKm');
    var days = document.getElementById('pmDays');
    var park = document.getElementById('pmPark');
    if (!km || !days || !park) return;
    var out = { km: document.getElementById('pmKmOut'), days: document.getElementById('pmDaysOut'), park: document.getElementById('pmParkOut') };
    var cell = { co2: document.getElementById('pmCo2'), fuel: document.getElementById('pmFuel'), parking: document.getElementById('pmParking'),
      trip: document.getElementById('pmTrip'), kmYear: document.getElementById('pmKmYear') };

    function set(el, text) {
      if (el.textContent === text) return;
      el.textContent = text;
      if (reduce) return;
      el.classList.remove('tick'); void el.offsetWidth; el.classList.add('tick');
    }
    function fill(input) {
      var min = +input.min, max = +input.max;
      input.style.setProperty('--v', ((input.value - min) / (max - min) * 100).toFixed(1) + '%');
    }
    function update() {
      var k = +km.value, d = +days.value, p = +park.value;
      var kmYear = k * 2 * d * WEEKS;
      var co2 = kmYear * KG_PER_KM;
      out.km.textContent = k + ' km';
      out.days.textContent = d + (d === 1 ? ' day' : ' days');
      out.park.textContent = '₹' + p;
      set(cell.co2, grouped(co2));
      set(cell.fuel, grouped(co2 / KG_PER_LITRE));
      set(cell.parking, grouped(p * d * WEEKS));
      cell.trip.textContent = (k * KG_PER_KM).toFixed(1) + ' kg CO₂';
      cell.kmYear.textContent = grouped(kmYear) + ' km';
      [km, days, park].forEach(fill);
    }
    [km, days, park].forEach(function (el) { el.addEventListener('input', update); });
    update();
  }

  function ready() { zoom(); pump(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready);
  else ready();
})();
