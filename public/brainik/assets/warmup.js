// Brain warm-up: six quick rounds of Brainik games (Echo, Hue, Sums, Spot, Series, Glimpse),
// then a brain score, a rank and a skill map. Runs in the browser only; the last result is kept in
// this browser (localStorage 'bk-warmup') so the "See your mind grow" map can show it. Nothing is sent.
(function () {
  var wu = document.getElementById('wu');
  if (!wu) return;
  var stage = document.getElementById('wu-stage');
  var steps = Array.prototype.slice.call(document.querySelectorAll('#wu-steps li'));
  var bar = document.getElementById('wu-time');
  var scoreEl = document.getElementById('wu-score');
  var soundBtn = document.getElementById('wu-sound');

  // ---------- Small helpers ----------
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function rnd(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); }
  var timers = [];
  function later(fn, ms) { var id = setTimeout(fn, ms); timers.push(id); return id; }
  function cancelAll() { timers.forEach(clearTimeout); timers = []; }

  // ---------- Sound: soft sine tones, made on the fly (no files) ----------
  var soundOn = true, ctx = null;
  try { soundOn = localStorage.getItem('bk-sound') !== 'off'; } catch (e) {}
  function syncSound() {
    soundBtn.setAttribute('aria-pressed', String(soundOn));
    soundBtn.setAttribute('aria-label', soundOn ? 'Sound on' : 'Sound off');
    soundBtn.classList.toggle('muted', !soundOn);
  }
  syncSound();
  soundBtn.addEventListener('click', function () {
    soundOn = !soundOn;
    try { localStorage.setItem('bk-sound', soundOn ? 'on' : 'off'); } catch (e) {}
    syncSound();
  });
  function tone(freq, dur, when, type, vol) {
    if (!soundOn) return;
    try {
      if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === 'suspended') ctx.resume();
      var t0 = ctx.currentTime + (when || 0);
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.type = type || 'sine';
      o.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(vol || 0.07, t0 + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      o.connect(g); g.connect(ctx.destination);
      o.start(t0); o.stop(t0 + dur + 0.05);
    } catch (e) {}
  }
  var sfx = {
    good: function () { tone(660, 0.14); tone(880, 0.18, 0.07); },
    bad: function () { tone(196, 0.22, 0, 'triangle', 0.06); },
    tick: function () { tone(520, 0.06, 0, 'sine', 0.035); },
    done: function () { tone(523, 0.18); tone(659, 0.18, 0.09); tone(784, 0.3, 0.18); },
    finale: function () { [523, 659, 784, 1047].forEach(function (f, i) { tone(f, 0.35, i * 0.11, 'sine', 0.06); }); },
  };
  var PAD_TONES = [392, 494, 587, 698];

  // ---------- Timer bar ----------
  var timerEnd = 0, timerTotal = 0, timerRaf = 0, timerBackup = 0, onTimeUp = null;
  function startTimer(secs, cb) {
    timerTotal = secs * 1000;
    timerEnd = performance.now() + timerTotal;
    onTimeUp = cb;
    cancelAnimationFrame(timerRaf);
    clearTimeout(timerBackup);
    // The bar is drawn on animation frames; a plain timeout ends the round even when frames are paused.
    timerBackup = setTimeout(function () { cancelAnimationFrame(timerRaf); var f = onTimeUp; onTimeUp = null; if (f) f(); }, timerTotal + 50);
    (function loop(now) {
      var left = Math.max(0, timerEnd - now);
      bar.style.transform = 'scaleX(' + (left / timerTotal).toFixed(4) + ')';
      bar.classList.toggle('low', left < 3000);
      if (left <= 0) { var f = onTimeUp; onTimeUp = null; if (f) f(); return; }
      timerRaf = requestAnimationFrame(loop);
    })(performance.now());
  }
  function stopTimer(full) {
    cancelAnimationFrame(timerRaf);
    clearTimeout(timerBackup);
    onTimeUp = null;
    bar.classList.remove('low');
    bar.style.transform = full ? 'scaleX(1)' : 'scaleX(0)';
  }

  // ---------- Feedback ----------
  function flash(node, good) {
    node.classList.remove('ok', 'no');
    void node.offsetWidth;
    node.classList.add(good ? 'ok' : 'no');
  }
  var live = 0;
  function setLive(n, label) { live = n; scoreEl.textContent = label ? label.replace('{n}', n) : String(n); }

  // ---------- Rounds ----------
  var ROUNDS = [
    {
      id: 'echo', name: 'Echo', skill: 'Memory', how: 'Watch the pads light up, then tap them back in the same order.',
      norm: function (s) { return (s - 2) / 6; }, stat: function (s) { return s ? s + '-step pattern' : 'no pattern yet'; },
      run: function (api) {
        var grid = el('div', 'echo-pads');
        var pads = [0, 1, 2, 3].map(function (i) { var b = el('button', 'pad pad' + i); b.type = 'button'; b.setAttribute('aria-label', 'Pad ' + (i + 1)); grid.appendChild(b); return b; });
        var msg = el('p', 'wu-msg', 'Watch…');
        api.stage.appendChild(grid); api.stage.appendChild(msg);
        var seq = [rnd(0, 3), rnd(0, 3)], pos = 0, input = false, best = 0;
        setLive(0, 'Best {n}');
        function light(i, ms) {
          pads[i].classList.add('lit');
          tone(PAD_TONES[i], ms / 1000 + 0.05, 0, 'sine', 0.06);
          later(function () { pads[i].classList.remove('lit'); }, ms);
        }
        function play() {
          input = false; pos = 0;
          seq.push(rnd(0, 3));
          msg.textContent = 'Watch… ' + seq.length + ' steps';
          grid.classList.add('watching');
          var gap = Math.max(330, 560 - seq.length * 25);
          seq.forEach(function (p, k) { later(function () { light(p, gap * 0.7); }, 500 + k * gap); });
          later(function () { input = true; grid.classList.remove('watching'); msg.textContent = 'Your turn'; }, 500 + seq.length * gap);
        }
        pads.forEach(function (b, i) {
          b.addEventListener('click', function () {
            if (!input) return;
            light(i, 220);
            if (i !== seq[pos]) {
              input = false; flash(grid, false); sfx.bad();
              msg.textContent = 'So close. Best: ' + best + ' steps';
              return later(function () { api.end(best); }, 900);
            }
            pos++;
            if (pos === seq.length) {
              input = false; best = seq.length; setLive(best, 'Best {n}');
              flash(grid, true); later(sfx.good, 200);
              if (seq.length >= 9) return later(function () { api.end(best); }, 700);
              later(play, 800);
            }
          });
        });
        api.timer(45, function () { api.end(best); });
        play();
      },
    },
    {
      id: 'hue', name: 'Hue', skill: 'Focus', how: 'Does the word name the colour of its ink? Answer as many as you can.',
      norm: function (s) { return s / 9; }, stat: function (s) { return s + ' right'; },
      run: function (api) {
        var INKS = [{ n: 'RED', c: 'ink-red' }, { n: 'BLUE', c: 'ink-blue' }, { n: 'GREEN', c: 'ink-green' }, { n: 'GOLD', c: 'ink-gold' }];
        var word = el('div', 'hue-word');
        var row = el('div', 'wu-choices two');
        var yes = el('button', 'wu-choice', 'Same'); yes.type = 'button';
        var no = el('button', 'wu-choice', 'Different'); no.type = 'button';
        row.appendChild(yes); row.appendChild(no);
        var hint = el('p', 'wu-msg', 'Keys: ← same · → different');
        api.stage.appendChild(word); api.stage.appendChild(row); api.stage.appendChild(hint);
        var score = 0, match = false, busy = false;
        setLive(0);
        function next() {
          var w = pick(INKS);
          match = Math.random() < 0.5;
          var ink = match ? w : pick(INKS.filter(function (x) { return x !== w; }));
          word.textContent = w.n;
          word.className = 'hue-word ' + ink.c;
          busy = false;
        }
        function answer(saidSame) {
          if (busy) return;
          busy = true;
          var good = saidSame === match;
          if (good) { score++; setLive(score); sfx.good(); } else sfx.bad();
          flash(word, good);
          later(next, 180);
        }
        yes.addEventListener('click', function () { answer(true); });
        no.addEventListener('click', function () { answer(false); });
        api.keys(function (e) { if (e.key === 'ArrowLeft') answer(true); if (e.key === 'ArrowRight') answer(false); });
        next();
        api.timer(14, function () { api.end(score); });
      },
    },
    {
      id: 'sums', name: 'Sums', skill: 'Maths', how: 'Tap tiles that add up exactly to the target.',
      norm: function (s) { return s / 5; }, stat: function (s) { return s + ' targets hit'; },
      run: function (api) {
        var head = el('div', 'sum-head');
        var target = el('b', 'sum-target'); var now = el('span', 'sum-now');
        head.appendChild(target); head.appendChild(now);
        var grid = el('div', 'sum-grid');
        api.stage.appendChild(head); api.stage.appendChild(grid);
        var score = 0, goal = 0, sel = [], tiles = [];
        setLive(0);
        function next() {
          clear(grid); sel = [];
          var k = score < 2 ? 2 : 3;
          var parts = []; for (var i = 0; i < k; i++) parts.push(rnd(1, 9));
          goal = parts.reduce(function (a, b) { return a + b; }, 0);
          var nums = parts.slice(); while (nums.length < 6) nums.push(rnd(1, 9));
          shuffle(nums);
          target.textContent = goal; now.textContent = 'Pick tiles';
          tiles = nums.map(function (n) {
            var b = el('button', 'sum-tile', String(n)); b.type = 'button'; b.dataset.v = n;
            b.addEventListener('click', function () { tap(b); });
            grid.appendChild(b); return b;
          });
        }
        function total() { return sel.reduce(function (a, b) { return a + Number(b.dataset.v); }, 0); }
        function tap(b) {
          var i = sel.indexOf(b);
          if (i >= 0) { sel.splice(i, 1); b.classList.remove('on'); } else { sel.push(b); b.classList.add('on'); sfx.tick(); }
          var t = total();
          now.textContent = sel.length ? 'Now ' + t : 'Pick tiles';
          if (t === goal) { score++; setLive(score); sfx.good(); flash(grid, true); later(next, 260); }
          else if (t > goal) { sfx.bad(); flash(grid, false); later(function () { sel.forEach(function (x) { x.classList.remove('on'); }); sel = []; now.textContent = 'Too much. Try again'; }, 260); }
        }
        next();
        api.timer(20, function () { api.end(score); });
      },
    },
    {
      id: 'spot', name: 'Spot', skill: 'Perception', how: 'One tile is a slightly different shade. Find it, fast.',
      norm: function (s) { return s / 9; }, stat: function (s) { return s + ' found'; },
      run: function (api) {
        var grid = el('div', 'spot-grid');
        api.stage.appendChild(grid);
        var score = 0;
        setLive(0);
        function next() {
          clear(grid);
          var n = Math.min(6, 3 + Math.floor(score / 2));
          var h = rnd(0, 359), s = rnd(35, 55), l = rnd(45, 60);
          var d = Math.max(4, 16 - score * 1.4);
          var odd = rnd(0, n * n - 1);
          grid.style.setProperty('--n', n);
          for (var i = 0; i < n * n; i++) {
            var b = el('button', 'spot-tile'); b.type = 'button';
            b.setAttribute('aria-label', 'Tile ' + (i + 1));
            b.style.background = 'hsl(' + h + ' ' + s + '% ' + (i === odd ? l + d : l) + '%)';
            (function (isOdd, node) {
              node.addEventListener('click', function () {
                if (isOdd) { score++; setLive(score); sfx.good(); next(); }
                else { sfx.bad(); flash(node, false); }
              });
            })(i === odd, b);
            grid.appendChild(b);
          }
        }
        next();
        api.timer(16, function () { api.end(score); });
      },
    },
    {
      id: 'series', name: 'Series', skill: 'Reasoning', how: 'Crack the rule and pick the number that comes next.',
      norm: function (s) { return s / 5; }, stat: function (s) { return s + ' rules cracked'; },
      run: function (api) {
        var row = el('div', 'ser-row');
        var opts = el('div', 'wu-choices four');
        api.stage.appendChild(row); api.stage.appendChild(opts);
        var score = 0;
        setLive(0);
        function make() {
          var kind = rnd(0, 5), a = rnd(1, 9), d = rnd(2, 9), s = [];
          if (kind === 0) for (var i = 0; i < 5; i++) s.push(a + d * i);
          else if (kind === 1) for (i = 0; i < 5; i++) s.push(a * Math.pow(2, i));
          else if (kind === 2) { var b = rnd(1, 4); for (i = 0; i < 5; i++) s.push((b + i) * (b + i)); }
          else if (kind === 3) { var p = rnd(1, 5), q = rnd(6, 12); s.push(a); for (i = 1; i < 5; i++) s.push(s[i - 1] + (i % 2 ? p : q)); }
          else if (kind === 4) { s.push(a, rnd(1, 9)); for (i = 2; i < 5; i++) s.push(s[i - 1] + s[i - 2]); }
          else { var top = rnd(40, 90); for (i = 0; i < 5; i++) s.push(top - d * i); }
          return s;
        }
        function next() {
          clear(row); clear(opts);
          var s = make(), ans = s[4];
          s.slice(0, 4).forEach(function (n) { row.appendChild(el('i', null, String(n))); });
          row.appendChild(el('i', 'q', '?'));
          var set = [ans];
          while (set.length < 4) {
            var c = ans + pick([-3, -2, -1, 1, 2, 3, 4, -4, 5]) * (Math.abs(ans) > 30 ? rnd(1, 3) : 1);
            if (c > 0 && set.indexOf(c) < 0) set.push(c);
          }
          shuffle(set).forEach(function (n) {
            var b = el('button', 'wu-choice', String(n)); b.type = 'button';
            b.addEventListener('click', function () {
              if (n === ans) { score++; setLive(score); sfx.good(); flash(row, true); later(next, 260); }
              else { sfx.bad(); flash(b, false); b.disabled = true; }
            });
            opts.appendChild(b);
          });
        }
        next();
        api.timer(22, function () { api.end(score); });
      },
    },
    {
      id: 'glimpse', name: 'Glimpse', skill: 'Speed', how: 'Dots flash for a moment. How many did you see?',
      norm: function (s) { return s / 6; }, stat: function (s) { return s + ' counted right'; },
      run: function (api) {
        var field = el('div', 'glimpse-field');
        var opts = el('div', 'wu-choices four');
        api.stage.appendChild(field); api.stage.appendChild(opts);
        var score = 0, round = 0;
        setLive(0);
        function next() {
          clear(field); clear(opts);
          var n = rnd(3 + Math.min(3, round), 6 + Math.min(4, round));
          round++;
          var spots = [];
          for (var tries = 0; spots.length < n && tries < 400; tries++) {
            var x = rnd(8, 88), y = rnd(10, 84);
            if (spots.every(function (p) { return Math.abs(p[0] - x) > 11 || Math.abs(p[1] - y) > 14; })) spots.push([x, y]);
          }
          n = spots.length;
          spots.forEach(function (p) {
            var d = el('i', 'gdot'); d.style.left = p[0] + '%'; d.style.top = p[1] + '%'; field.appendChild(d);
          });
          var show = Math.max(380, 750 - round * 50);
          later(function () { field.classList.add('gone'); }, show);
          field.classList.remove('gone');
          var set = [n];
          while (set.length < 4) { var c = n + pick([-2, -1, 1, 2, 3]); if (c > 0 && set.indexOf(c) < 0) set.push(c); }
          set.sort(function (a, b) { return a - b; }).forEach(function (v) {
            var b = el('button', 'wu-choice', String(v)); b.type = 'button';
            b.addEventListener('click', function () {
              if (!field.classList.contains('gone')) return;
              var good = v === n;
              if (good) { score++; setLive(score); sfx.good(); } else sfx.bad();
              field.classList.remove('gone'); flash(b, good);
              later(next, good ? 300 : 700);
            });
            opts.appendChild(b);
          });
        }
        next();
        api.timer(18, function () { api.end(score); });
      },
    },
  ];

  // ---------- Flow ----------
  var results = [], idx = 0, keyHandler = null;
  document.addEventListener('keydown', function (e) { if (keyHandler) keyHandler(e); });

  // The console takes the colour family of the round being played (g-<id> classes in site.css).
  function setFam(id) {
    ROUNDS.forEach(function (r) { wu.classList.remove('g-' + r.id); });
    if (id) wu.classList.add('g-' + id);
    wu.setAttribute('data-game', id || 'result');
  }

  function setStep(i) {
    steps.forEach(function (s, k) { s.classList.toggle('now', k === i); s.classList.toggle('done', k < i); });
  }

  function start() {
    results = []; idx = 0;
    tone(1, 0.01); // unlock audio on the user's tap
    intro();
  }

  function intro() {
    cancelAll(); keyHandler = null;
    var r = ROUNDS[idx];
    setFam(r.id);
    setStep(idx);
    stopTimer(true);
    scoreEl.textContent = (idx + 1) + ' / 6';
    clear(stage);
    var box = el('div', 'wu-intro');
    var ring = el('div', 'wu-ring'); ring.appendChild(el('span', null, String(idx + 1)));
    box.appendChild(ring);
    box.appendChild(el('p', 'wu-kicker', r.skill));
    box.appendChild(el('p', 'wu-h', r.name));
    box.appendChild(el('p', 'wu-p', r.how));
    var go = el('button', 'btn btn-ink', 'Go'); go.type = 'button';
    box.appendChild(go);
    stage.appendChild(box);
    var begin = function () { cancelAll(); run(); };
    go.addEventListener('click', begin);
    later(begin, 3200);
    go.focus({ preventScroll: true });
  }

  function run() {
    var r = ROUNDS[idx], ended = false;
    clear(stage);
    var area = el('div', 'wu-play wu-' + r.id);
    stage.appendChild(area);
    r.run({
      stage: area,
      timer: function (secs, cb) { startTimer(secs, cb); },
      keys: function (fn) { keyHandler = fn; },
      end: function (score) {
        if (ended) return;
        ended = true; cancelAll(); keyHandler = null; stopTimer(false);
        results.push(score);
        sfx.done();
        idx++;
        if (idx < ROUNDS.length) later(intro, 450);
        else later(finish, 450);
      },
    });
  }

  // ---------- Result ----------
  var RANKS = ['Novice', 'Thinker', 'Strategist', 'Sage', 'Mastermind', 'Oracle'];
  function rankFor(avg) { return RANKS[Math.min(5, Math.floor(avg * 6.2))]; }
  var CENTER = [110, 105];
  var OUTER = [[110, 20], [188, 65], [188, 145], [110, 190], [32, 145], [32, 65]];
  function radarPoints(vals) {
    return vals.map(function (v, k) {
      var f = 0.12 + 0.88 * Math.max(0, Math.min(1, v));
      return (CENTER[0] + (OUTER[k][0] - CENTER[0]) * f).toFixed(1) + ',' + (CENTER[1] + (OUTER[k][1] - CENTER[1]) * f).toFixed(1);
    }).join(' ');
  }
  var SVGNS = 'http://www.w3.org/2000/svg';
  function svg(tag, attrs) { var n = document.createElementNS(SVGNS, tag); for (var k in attrs) n.setAttribute(k, attrs[k]); return n; }
  function radarSvg(vals) {
    var s = svg('svg', { viewBox: '0 0 220 205', class: 'radar wu-radar', role: 'img', 'aria-label': 'Your skill map' });
    var g = svg('g', { class: 'radar-grid' });
    [1, 0.66, 0.33].forEach(function (f) {
      g.appendChild(svg('polygon', { points: OUTER.map(function (p) { return (CENTER[0] + (p[0] - CENTER[0]) * f) + ',' + (CENTER[1] + (p[1] - CENTER[1]) * f); }).join(' ') }));
    });
    g.appendChild(svg('path', { d: 'M110 20V190M32 65l156 80M188 65 32 145' }));
    s.appendChild(g);
    s.appendChild(svg('polygon', { class: 'radar-fill', points: radarPoints(vals) }));
    var labels = svg('g', { class: 'radar-labels' });
    [[110, 13, 'middle'], [196, 62, 'start'], [196, 153, 'start'], [110, 202, 'middle'], [24, 153, 'end'], [24, 62, 'end']].forEach(function (p, k) {
      var t = svg('text', { x: p[0], y: p[1], 'text-anchor': p[2] }); t.textContent = ROUNDS[k].skill; labels.appendChild(t);
    });
    s.appendChild(labels);
    return s;
  }

  function finish() {
    keyHandler = null;
    setFam(null);
    setStep(ROUNDS.length);
    stopTimer(false);
    var norms = results.map(function (s, k) { return Math.max(0, Math.min(1, ROUNDS[k].norm(s))); });
    var avg = norms.reduce(function (a, b) { return a + b; }, 0) / norms.length;
    var score = Math.round(avg * 1000);
    var rank = rankFor(avg);
    var bestK = norms.indexOf(Math.max.apply(null, norms));
    scoreEl.textContent = 'Done';
    clear(stage);
    var box = el('div', 'wu-result');
    var left = el('div', 'wu-res-main');
    left.appendChild(el('p', 'wu-kicker', 'Your brain score'));
    var big = el('p', 'wu-big', '0'); left.appendChild(big);
    var r = el('p', 'wu-rank'); r.appendChild(document.createTextNode('Rank: ')); r.appendChild(el('b', null, rank)); left.appendChild(r);
    left.appendChild(el('p', 'wu-p', 'Strongest today: ' + ROUNDS[bestK].skill.toLowerCase() + '. The app keeps a map like this for all 11 games and watches it grow.'));
    var list = el('ul', 'wu-bars');
    ROUNDS.forEach(function (rd, k) {
      var li = el('li', 'g-' + rd.id);
      li.appendChild(el('span', 'wb-name', rd.skill));
      var track = el('span', 'wb-track'); var fill = el('i'); track.appendChild(fill); li.appendChild(track);
      li.appendChild(el('span', 'wb-stat', rd.stat(results[k])));
      list.appendChild(li);
      later(function () { fill.style.transform = 'scaleX(' + Math.max(0.04, norms[k]).toFixed(3) + ')'; }, 200 + k * 90);
    });
    left.appendChild(list);
    var actions = el('div', 'wu-actions');
    var copy = el('button', 'btn btn-sm btn-ink', 'Copy my result'); copy.type = 'button';
    var again = el('button', 'btn btn-sm btn-ghost', 'Play again'); again.type = 'button';
    actions.appendChild(copy); actions.appendChild(again);
    left.appendChild(actions);
    box.appendChild(left);
    var right = el('div', 'wu-res-map'); right.appendChild(radarSvg(norms));
    box.appendChild(right);
    stage.appendChild(box);
    sfx.finale();
    // Count the score up.
    var t0 = performance.now();
    later(function () { big.textContent = score; }, 1400); // lands on the real score even if frames are paused
    (function step(now) {
      var p = Math.max(0, Math.min(1, (now - t0) / 1200));
      big.textContent = Math.round(score * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    })(t0);
    var text = 'Brainik warm-up: ' + score + ' · ' + rank + '\n' + ROUNDS.map(function (rd, k) { return rd.skill + ' ' + Math.round(norms[k] * 10) + '/10'; }).join(' · ') + '\nhttps://askdevelopers.github.io/brainik/#warmup';
    copy.addEventListener('click', function () {
      var ok = function () { copy.textContent = 'Copied'; later(function () { copy.textContent = 'Copy my result'; }, 1600); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(ok, function () {});
    });
    again.addEventListener('click', start);
    try { localStorage.setItem('bk-warmup', JSON.stringify({ n: norms, s: score, r: rank })); } catch (e) {}
    showMap({ n: norms, s: score, r: rank });
  }

  // "See your mind grow" tile: show the visitor's own map once they've played.
  function showMap(res) {
    var fill = document.getElementById('map-fill'), note = document.getElementById('map-note');
    if (!fill || !res || !res.n || res.n.length !== 6) return;
    fill.setAttribute('points', radarPoints(res.n));
    document.getElementById('map').setAttribute('aria-label', 'Your skill map from the warm-up');
    if (note) note.textContent = 'This is your map from the warm-up: score ' + res.s + ', rank ' + res.r + '. In the app it fills in from every game you play.';
  }
  try { showMap(JSON.parse(localStorage.getItem('bk-warmup') || 'null')); } catch (e) {}

  document.getElementById('wu-go').addEventListener('click', start);
})();
