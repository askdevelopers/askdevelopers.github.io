// PetPulse website mini game: play fetch.
// Pick a pet, then tap/click the lawn to throw (hold and drag to see the arc). Dogs run for the frisbee and can catch
// it mid-air; cats wait a moment, chase the rolling ball, pounce and bring it back.
// Runs only while something is moving (no idle loop). Pets and toys are moved with transforms set from JS.
(function () {
  var game = document.getElementById('playGame');
  var field = document.getElementById('field');
  if (!game || !field) return;

  var petEl = field.querySelector('.pet');
  var petFlip = petEl.querySelector('.pet-flip');
  var petImg = petEl.querySelector('img');
  var shadow = field.querySelector('.toy-shadow');
  var toys = { dog: field.querySelector('.toy.frisbee'), cat: field.querySelector('.toy.ball') };
  var aim = field.querySelector('.aim');
  var aimPath = aim.querySelector('path');
  var toastEl = field.querySelector('.toast');
  var autoBtn = document.getElementById('autoThrow');
  var stat = {};
  game.querySelectorAll('[data-stat]').forEach(function (el) { stat[el.getAttribute('data-stat')] = el; });

  // Your pets: a front-facing avatar while waiting, a side-view runner while fetching. mouth = where the toy sits
  // (x from the centre and height from the bottom, as a fraction of the sprite width; measured from the artwork).
  var DOG = { kind: 'dog', faces: 'right', size: 128, speed: 0.42, delay: 0,
    flight: function (d) { return 0.7 + d / 1100; }, arc: function (d) { return 60 + d * 0.22; } };
  var CAT = { kind: 'cat', faces: 'right', size: 118, speed: 0.6, delay: 0.45,
    flight: function (d) { return 0.55 + d / 950; }, arc: function (d) { return 38 + d * 0.3; } };
  var pet_ = function (base, o) { var r = {}; for (var k in base) r[k] = base[k]; for (k in o) r[k] = o[k]; return r; };
  var PETS = {
    golden: pet_(DOG, { name: 'Bella', run: 'golden-retriever', avatar: 'golden-retriever', mouth: [0.395, 0.52] }),
    lab: pet_(DOG, { name: 'Daisy', run: 'labrador', avatar: 'labrador', mouth: [0.395, 0.5] }),
    shepherd: pet_(DOG, { name: 'Rex', run: 'german-shepherd', avatar: 'german-shepherd-pup', mouth: [0.395, 0.47] }),
    white: pet_(CAT, { name: 'Snow', run: 'white-cat', avatar: 'white-cat', mouth: [0.395, 0.48] }),
    ragdoll: pet_(CAT, { name: 'Luna', run: 'ragdoll', avatar: 'ragdoll-fluffy', mouth: [0.395, 0.43] }),
    british: pet_(CAT, { name: 'Milo', run: 'british-shorthair', avatar: 'british-shorthair', mouth: [0.39, 0.47] })
  };
  var runSrc = function (c) { return 'assets/img/run/' + c.run + '.webp'; };
  var avatarSrc = function (c) { return 'assets/img/doodles/' + c.avatar + '.webp'; };
  // warm the image cache so the first switch to running is instant
  Object.keys(PETS).forEach(function (k) { var i = new Image(); i.src = runSrc(PETS[k]); });

  var W = 0, H = 0, P = { x: 0, y: 0 }, HOME = { x: 0, y: 0 }, K = 1;
  var petId = 'golden', cfg = PETS.golden, kind = 'dog', toyEl = toys.dog;
  var shownSrc = '';
  var pet = { x: 0, y: 0, face: 1, faceVis: 1, jump: 0, jumpT: -1, moving: false, gx: 0, gy: 0 };
  var toy = { x: 0, y: 0, h: 26, vx: 0, vy: 0, state: 'ready', t: 0, T: 1, sx: 0, sy: 0, tx: 0, ty: 0, arc: 0, dist: 0, drop: 0 };
  var waitT = 0, running = false, last = 0;
  var score = { fetch: 0, air: 0, best: 0 };
  try { score.best = parseInt(localStorage.getItem('pp-fetch-best') || '0', 10) || 0; } catch (e) {}

  /* ---------- layout ---------- */
  function measure() {
    W = field.clientWidth; H = field.clientHeight;
    K = Math.max(0.72, Math.min(1, W / 760)); // smaller pets on small screens
    if (cfg) petEl.style.width = Math.round(cfg.size * K) + 'px';
    P = { x: W / 2, y: H - 27 };
    HOME = { x: P.x + (W < 520 ? 64 : 86), y: P.y - 12 };
  }
  var depth = function (y) { return 0.68 + 0.32 * Math.max(0, Math.min(1, y / H)); };

  function choose(id) {
    petId = id; cfg = PETS[id]; kind = cfg.kind; toyEl = toys[kind];
    game.classList.toggle('cat', kind === 'cat');
    game.querySelectorAll('.pick-btn').forEach(function (b) {
      var on = b.getAttribute('data-pet') === id;
      b.classList.toggle('on', on); b.setAttribute('aria-checked', on ? 'true' : 'false');
    });
    petEl.classList.toggle('cat', kind === 'cat');
    shownSrc = '';
    reset();
  }

  function reset() {
    measure();
    pet.x = HOME.x; pet.y = HOME.y; pet.face = -1; pet.faceVis = -1; pet.jump = 0; pet.jumpT = -1; pet.moving = false;
    toy.state = 'ready'; toy.x = P.x; toy.y = P.y; toy.h = 26; toy.vx = toy.vy = 0;
    field.classList.remove('busy'); if (autoBtn) autoBtn.disabled = false;
    toyEl.classList.remove('spinning');
    render();
  }

  /* ---------- drawing ---------- */
  function render() {
    // sit as the avatar while waiting for a throw; run side-on while fetching
    var idle = toy.state === 'ready' && !pet.moving && pet.jumpT < 0;
    var src = idle ? avatarSrc(cfg) : runSrc(cfg);
    if (src !== shownSrc) { petImg.src = src; shownSrc = src; petEl.classList.toggle('sitting', idle); }
    var s = depth(pet.y);
    petEl.classList.toggle('run', pet.moving);
    petEl.style.transform = 'translate(' + pet.x.toFixed(1) + 'px,' + (pet.y - pet.jump).toFixed(1) + 'px) translate(-50%,-100%) scale(' + s.toFixed(3) + ')';
    petEl.style.transformOrigin = '50% 100%';
    petEl.style.zIndex = String(Math.round(pet.y));
    if (petEl.classList.contains('sitting')) petFlip.style.transform = 'none';
    else if (cfg.faces !== 'front') petFlip.style.transform = 'scaleX(' + (cfg.faces === 'right' ? pet.faceVis : -pet.faceVis).toFixed(3) + ')';
    else petFlip.style.transform = 'none';

    var ts = depth(toy.y);
    var lift = 1 + Math.min(toy.h, 220) / 420;
    toyEl.style.transform = 'translate(' + toy.x.toFixed(1) + 'px,' + (toy.y - toy.h).toFixed(1) + 'px) translate(-50%,-50%) scale(' + (ts * lift).toFixed(3) + ')';
    toyEl.style.zIndex = String(Math.round(toy.y) + (toy.state === 'carry' ? 2 : 1));
    var sh = Math.max(0.35, 1 - Math.min(toy.h, 200) / 260);
    shadow.style.transform = 'translate(' + toy.x.toFixed(1) + 'px,' + toy.y.toFixed(1) + 'px) translate(-50%,-50%) scale(' + (ts * sh).toFixed(3) + ')';
    shadow.style.opacity = toy.state === 'carry' ? '0' : String(0.25 + 0.75 * sh);
    shadow.style.zIndex = String(Math.round(toy.y) - 1);
  }

  /* ---------- messages ---------- */
  var toastTimer = 0;
  function toast(msg, ms) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, ms || 1600);
  }
  var pick = function (a) { return a[Math.floor(Math.random() * a.length)]; };
  function updateStats() {
    stat.fetch && (stat.fetch.textContent = score.fetch);
    game.querySelectorAll('[data-plural]').forEach(function (el) { var n = score[el.getAttribute('data-plural')]; el.textContent = n === 1 ? el.getAttribute('data-one') : el.getAttribute('data-many'); });
    stat.air && (stat.air.textContent = score.air);
    stat.best && (stat.best.textContent = score.best);
  }

  /* ---------- throwing ---------- */
  function clampTarget(x, y) {
    x = Math.max(30, Math.min(W - 30, x));
    y = Math.max(58, Math.min(H - 78, y));
    var dx = x - P.x, dy = y - P.y, d = Math.hypot(dx, dy);
    if (d < 90) { var k = 90 / (d || 1); x = P.x + dx * k; y = P.y + (dy || -1) * k; y = Math.min(y, H - 78); }
    return { x: x, y: y };
  }

  function throwTo(x, y) {
    if (toy.state !== 'ready') return;
    var t = clampTarget(x, y);
    var d = Math.hypot(t.x - P.x, t.y - P.y);
    toy.state = 'flight'; toy.t = 0; toy.sx = P.x; toy.sy = P.y; toy.tx = t.x; toy.ty = t.y; toy.dist = d;
    toy.T = cfg.flight(d); toy.arc = cfg.arc(d);
    toyEl.classList.add('spinning');
    field.classList.add('busy', 'played'); if (autoBtn) autoBtn.disabled = true;
    waitT = cfg.delay;
    var f = t.x > pet.x ? 1 : -1, mw = cfg.faces === 'front' ? 0 : cfg.mouth[0] * cfg.size * K * depth(t.y);
    pet.gx = t.x - f * mw; pet.gy = t.y;
    var meters = Math.max(1, Math.round((d / W) * 30));
    if (meters > score.best) { score.best = meters; try { localStorage.setItem('pp-fetch-best', String(meters)); } catch (e) {} }
    updateStats();
    if (kind === 'cat' && Math.random() < 0.5) toast(pick([cfg.name + ' is thinking about it…', cfg.name + ' watches it go…']), 1000);
    start();
  }

  /* ---------- simulation ---------- */
  function start() { if (!running) { running = true; last = performance.now(); requestAnimationFrame(tick); } }

  function moveToward(tx, ty, speed, dt) {
    var dx = tx - pet.x, dy = ty - pet.y, d = Math.hypot(dx, dy);
    if (d < 1) { pet.moving = false; return d; }
    var step = Math.min(d, speed * dt);
    pet.x += (dx / d) * step; pet.y += (dy / d) * step;
    if (Math.abs(dx) > 2) pet.face = dx > 0 ? 1 : -1;
    pet.moving = true;
    return d - step;
  }

  function mouth() {
    var s = depth(pet.y), w = cfg.size * K * s;
    var mx = cfg.faces === 'front' ? 0 : cfg.mouth[0] * w * pet.faceVis;
    return { x: pet.x + mx, y: pet.y, h: cfg.mouth[1] * w + pet.jump };
  }

  function grab(inAir) {
    toy.state = 'carry';
    toyEl.classList.remove('spinning');
    if (inAir) {
      score.air++; pet.jumpT = 0;
      toast(pick(['Mid-air catch!', 'What a leap!', cfg.name + ' nailed it!']));
    } else {
      toast(kind === 'cat' ? pick(['Pounce! ' + cfg.name + ' has it.', 'Got it! ' + cfg.name + ' trots back.']) : pick(['Got it! Bringing it back…', 'Good find, ' + cfg.name + '!']));
    }
    updateStats();
  }

  function tick(now) {
    var dt = Math.min(0.05, (now - last) / 1000); last = now;
    var run = Math.max(300, W * cfg.speed);

    // leap (dog mid-air catch): one smooth arc
    // turn around smoothly; the carried toy follows the head through the turn
    pet.faceVis += (pet.face - pet.faceVis) * Math.min(1, dt * 11);
    if (pet.jumpT >= 0) {
      pet.jumpT += dt;
      var u = Math.min(1, pet.jumpT / 0.42);
      pet.jump = Math.sin(Math.PI * u) * 22;
      if (u >= 1) { pet.jumpT = -1; pet.jump = 0; }
    }

    if (toy.state === 'flight') {
      toy.t += dt;
      var v = Math.min(1, toy.t / toy.T);
      toy.x = toy.sx + (toy.tx - toy.sx) * v;
      toy.y = toy.sy + (toy.ty - toy.sy) * v;
      toy.h = 26 * (1 - v) + toy.arc * 4 * v * (1 - v);
      // the pet sets off (the cat after a moment's thought)
      if (waitT > 0) { waitT -= dt; pet.moving = false; }
      else if (kind === 'dog') { var rem0 = moveToward(pet.gx, pet.gy, run, dt); if (rem0 < 1) pet.face = toy.tx > pet.x ? 1 : -1; }
      else moveToward(toy.x, toy.y, run, dt);
      // dog can snatch the frisbee on the way down
      if (kind === 'dog' && v > 0.5 && toy.h < 52) {
        var m = mouth();
        if (Math.hypot(m.x - toy.x, m.y - toy.y) < 26 * depth(pet.y)) grab(true);
      }
      if (toy.state === 'flight' && v >= 1) {
        toy.state = 'ground'; toy.h = 0;
        var dx = toy.tx - toy.sx, dy = toy.ty - toy.sy, d = Math.hypot(dx, dy) || 1;
        var roll = kind === 'cat' ? 0.9 * toy.dist + 60 : 90; // ball rolls on, frisbee skids a little
        toy.vx = (dx / d) * roll; toy.vy = (dy / d) * roll;
        if (kind === 'dog') toyEl.classList.remove('spinning');
      }
    } else if (toy.state === 'ground') {
      var fr = kind === 'cat' ? 1.5 : 5;
      toy.vx *= Math.exp(-fr * dt); toy.vy *= Math.exp(-fr * dt);
      toy.x += toy.vx * dt; toy.y += toy.vy * dt;
      if (toy.x < 22) { toy.x = 22; toy.vx = Math.abs(toy.vx) * 0.6; }
      if (toy.x > W - 22) { toy.x = W - 22; toy.vx = -Math.abs(toy.vx) * 0.6; }
      if (toy.y < 50) { toy.y = 50; toy.vy = Math.abs(toy.vy) * 0.6; }
      if (toy.y > H - 60) { toy.y = H - 60; toy.vy = -Math.abs(toy.vy) * 0.6; }
      if (Math.hypot(toy.vx, toy.vy) < 8) { toy.vx = toy.vy = 0; toyEl.classList.remove('spinning'); }
      if (waitT > 0) { waitT -= dt; pet.moving = false; }
      else {
        var left = moveToward(toy.x, toy.y, run, dt);
        var mm = mouth();
        if (left < 4 || Math.hypot(mm.x - toy.x, mm.y - toy.y) < 26 * depth(pet.y)) grab(false);
      }
    } else if (toy.state === 'carry') {
      var rem = moveToward(HOME.x, HOME.y, run * 0.72, dt);
      var c = mouth();
      toy.x = c.x; toy.y = c.y; toy.h = c.h;
      if (rem < 1 && pet.jumpT < 0) {
        pet.moving = false; pet.face = -1;
        toy.state = 'drop'; toy.drop = 0; toy.sx = toy.x; toy.sy = toy.y; toy.arc = toy.h;
      }
    } else if (toy.state === 'drop') {
      // the pet nudges the toy back to your feet
      toy.drop += dt;
      var q = Math.min(1, toy.drop / 0.45), e = q * q * (3 - 2 * q);
      toy.x = toy.sx + (P.x - toy.sx) * e;
      toy.y = toy.sy + (P.y - toy.sy) * e;
      toy.h = toy.arc + (26 - toy.arc) * e;
      if (q >= 1) {
        toy.state = 'ready'; score.fetch++; updateStats();
        field.classList.remove('busy'); if (autoBtn) autoBtn.disabled = false;
        toast(pick(['Ready. Throw again!', 'Again, again!', cfg.name + ' wants another throw']), 1400);
      }
    }

    render();
    if (toy.state !== 'ready' || pet.jumpT >= 0 || Math.abs(pet.face - pet.faceVis) > 0.01) requestAnimationFrame(tick);
    else running = false;
  }

  /* ---------- input ---------- */
  var aiming = false;
  function local(e) { var r = field.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
  function drawAim(p) {
    var t = clampTarget(p.x, p.y), d = Math.hypot(t.x - P.x, t.y - P.y);
    var peak = cfg.arc(d) * 2, cx = (P.x + t.x) / 2, cy = (P.y - 26 + t.y) / 2 - peak;
    aim.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    aimPath.setAttribute('d', 'M' + P.x + ' ' + (P.y - 26) + ' Q' + cx.toFixed(1) + ' ' + cy.toFixed(1) + ' ' + t.x.toFixed(1) + ' ' + t.y.toFixed(1));
  }
  field.addEventListener('pointerdown', function (e) {
    if (toy.state !== 'ready') { toast(cfg.name + ' is still on it…', 1000); return; }
    aiming = true; field.setPointerCapture && field.setPointerCapture(e.pointerId);
    drawAim(local(e)); aim.classList.add('on');
  });
  field.addEventListener('pointermove', function (e) { if (aiming) drawAim(local(e)); });
  field.addEventListener('pointerup', function (e) {
    if (!aiming) return; aiming = false; aim.classList.remove('on');
    var p = local(e); throwTo(p.x, p.y);
  });
  field.addEventListener('pointercancel', function () { aiming = false; aim.classList.remove('on'); });

  if (autoBtn) autoBtn.addEventListener('click', function () {
    throwTo(40 + Math.random() * (W - 80), 70 + Math.random() * (H * 0.5));
  });
  game.querySelectorAll('.pick-btn').forEach(function (b) {
    b.addEventListener('click', function () { if (b.getAttribute('data-pet') !== petId) choose(b.getAttribute('data-pet')); });
  });
  window.addEventListener('resize', function () { if (toy.state === 'ready') reset(); else measure(); });

  updateStats();
  choose('golden');
})();
