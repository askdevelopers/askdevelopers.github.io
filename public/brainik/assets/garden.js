// "Today's garden": a playable Stones puzzle on the website.
// The generator is a port of src/game/generator.ts in the app, so every board has exactly one solution.
// Runs fully in the browser; nothing is sent anywhere.
(function () {
  var boardEl = document.getElementById('board');
  if (!boardEl) return;

  // ---------- Generator (port of src/game/generator.ts) ----------
  function rng(seed) {
    var s = seed >>> 0 || 1;
    return function () {
      s = (s + 0x6d2b79f5) >>> 0;
      var t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function hashString(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619);
    return h >>> 0;
  }
  function solve(size, regions, limit, sol, wantDifferent) {
    var cols = new Array(size).fill(-1), found = 0, out = null;
    (function go(r, colMask, regMask) {
      if (found >= limit) return;
      if (r === size) {
        if (wantDifferent && cols.every(function (c, i) { return c === wantDifferent[i]; })) return;
        found++;
        if (!out) out = cols.slice();
        return;
      }
      var prev = r ? cols[r - 1] : -9;
      for (var c = 0; c < size && found < limit; c++) {
        if (colMask & (1 << c) || Math.abs(c - prev) <= 1) continue;
        var g = regions[r * size + c];
        if (regMask & (1 << g)) continue;
        cols[r] = c;
        go(r + 1, colMask | (1 << c), regMask | (1 << g));
      }
    })(0, 0, 0);
    if (sol && out) for (var i = 0; i < size; i++) sol[i] = out[i];
    return wantDifferent ? out : found;
  }
  function shuffled(n, rand) {
    var o = []; for (var i = 0; i < n; i++) o.push(i);
    for (var j = n - 1; j > 0; j--) { var k = Math.floor(rand() * (j + 1)); var t = o[j]; o[j] = o[k]; o[k] = t; }
    return o;
  }
  function randomSolution(size, rand) {
    var cols = [], used = {};
    function go(r) {
      if (r === size) return true;
      var order = shuffled(size, rand);
      for (var i = 0; i < order.length; i++) {
        var c = order[i];
        if (used[c] || (r && Math.abs(c - cols[r - 1]) <= 1)) continue;
        cols.push(c); used[c] = true;
        if (go(r + 1)) return true;
        cols.pop(); used[c] = false;
      }
      return false;
    }
    return go(0) ? cols : null;
  }
  function nbs(cell, size) {
    var r = Math.floor(cell / size), c = cell % size, out = [];
    [[r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]].forEach(function (p) {
      if (p[0] >= 0 && p[1] >= 0 && p[0] < size && p[1] < size) out.push(p[0] * size + p[1]);
    });
    return out;
  }
  function growRegions(size, sol, rand) {
    var n = size * size, reg = new Array(n).fill(-1), frontier = [];
    for (var r = 0; r < size; r++) { reg[r * size + sol[r]] = r; frontier.push([r * size + sol[r]]); }
    var weight = sol.map(function () { return 0.25 + rand() * 1.5; });
    var filled = size;
    while (filled < n) {
      var total = 0, g;
      for (g = 0; g < size; g++) if (frontier[g].length) total += weight[g];
      var pick = rand() * total;
      for (g = 0; g < size; g++) { if (!frontier[g].length) continue; pick -= weight[g]; if (pick <= 0) break; }
      if (g >= size) g = frontier.findIndex(function (f) { return f.length; });
      var f = frontier[g], k = Math.floor(rand() * f.length), cell = f[k];
      var open = nbs(cell, size).filter(function (i) { return reg[i] === -1; });
      if (!open.length) { f.splice(k, 1); continue; }
      var next = open[Math.floor(rand() * open.length)];
      reg[next] = g; f.push(next); filled++;
    }
    return reg;
  }
  function connected(size, reg, g) {
    var cells = []; reg.forEach(function (v, i) { if (v === g) cells.push(i); });
    if (!cells.length) return false;
    var seen = {}, stack = [cells[0]], count = 1; seen[cells[0]] = true;
    while (stack.length) {
      nbs(stack.pop(), size).forEach(function (i) { if (reg[i] === g && !seen[i]) { seen[i] = true; count++; stack.push(i); } });
    }
    return count === cells.length;
  }
  function makeUnique(size, sol, reg, rand) {
    for (var step = 0; step < 300; step++) {
      if (solve(size, reg, 2) === 1) return true;
      var rival = solve(size, reg, 1, null, sol);
      if (!rival) return true;
      var cells = rival.map(function (c, r) { return r * size + c; }).filter(function (i) { return sol[Math.floor(i / size)] !== i % size; });
      var cell = cells[Math.floor(rand() * cells.length)];
      var own = reg[cell];
      var targets = nbs(cell, size).map(function (i) { return reg[i]; }).filter(function (g) { return g !== own; });
      if (!targets.length) continue;
      var target = targets[Math.floor(rand() * targets.length)];
      if (sol[Math.floor(cell / size)] === cell % size) continue;
      reg[cell] = target;
      if (!connected(size, reg, own)) reg[cell] = own;
    }
    return solve(size, reg, 2) === 1;
  }
  function relabel(regions) {
    var map = {}, next = 0;
    return regions.map(function (g) { if (!(g in map)) map[g] = next++; return map[g]; });
  }
  function generate(size, seed) {
    var rand = rng(seed);
    for (var attempt = 0; attempt < 200; attempt++) {
      var sol = randomSolution(size, rand);
      if (!sol) continue;
      var regions = growRegions(size, sol, rand);
      if (makeUnique(size, sol, regions, rand)) {
        var check = new Array(size).fill(0);
        if (solve(size, regions, 2, check) === 1 && check.every(function (c, r) { return c === sol[r]; })) {
          return { size: size, regions: relabel(regions), solution: sol };
        }
      }
    }
    return null;
  }

  // ---------- Game state ----------
  var PLOT_NAMES = ['sage', 'clay', 'mist', 'straw', 'heather', 'stone', 'rose', 'lichen', 'sand'];
  var els = {
    date: document.getElementById('g-date'), time: document.getElementById('g-time'), msg: document.getElementById('g-msg'),
    undo: document.getElementById('g-undo'), hint: document.getElementById('g-hint'), clear: document.getElementById('g-clear'),
    solved: document.getElementById('solved'), solvedMeta: document.getElementById('solved-meta'),
    copy: document.getElementById('g-copy'), again: document.getElementById('g-again'),
  };
  var sizeBtns = document.querySelectorAll('.sizes button');
  var p, marks, cells, history, hints, startAt, timerId, done, focusIdx = 0, practice = false, size = 6, label = '';
  var defaultMsg = 'Tap once to cross a cell out, twice to place a stone.';

  function localDay(d) {
    d = d || new Date();
    var z = function (n) { return String(n).padStart(2, '0'); };
    return d.getFullYear() + '-' + z(d.getMonth() + 1) + '-' + z(d.getDate());
  }
  function fmt(s) { return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); }
  function say(text, kind) {
    els.msg.textContent = text || defaultMsg;
    els.msg.className = 'play-help' + (kind ? ' ' + kind : '');
  }
  function rcOf(i) { return [Math.floor(i / p.size), i % p.size]; }
  function blockedBy(stone) {
    var n = p.size, a = rcOf(stone), out = [];
    for (var i = 0; i < n * n; i++) {
      if (i === stone) continue;
      var b = rcOf(i);
      if (b[0] === a[0] || b[1] === a[1] || p.regions[i] === p.regions[stone] || (Math.abs(b[0] - a[0]) <= 1 && Math.abs(b[1] - a[1]) <= 1)) out.push(i);
    }
    return out;
  }
  function conflicts() {
    var bad = {}, stones = [];
    marks.forEach(function (m, i) { if (m === 2) stones.push(i); });
    for (var a = 0; a < stones.length; a++) for (var b = a + 1; b < stones.length; b++) {
      if (blockedBy(stones[a]).indexOf(stones[b]) >= 0) { bad[stones[a]] = true; bad[stones[b]] = true; }
    }
    return bad;
  }
  function isSolved() {
    for (var r = 0; r < p.size; r++) for (var c = 0; c < p.size; c++) if ((marks[r * p.size + c] === 2) !== (p.solution[r] === c)) return false;
    return true;
  }

  function build() {
    var n = p.size;
    boardEl.style.setProperty('--n', n);
    boardEl.classList.remove('won');
    boardEl.textContent = '';
    cells = [];
    for (var r = 0; r < n; r++) {
      var row = document.createElement('div');
      row.setAttribute('role', 'row');
      row.style.display = 'contents';
      for (var c = 0; c < n; c++) {
        var i = r * n + c, g = p.regions[i];
        var b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('role', 'gridcell');
        b.className = 'cell p' + (g % 9);
        if (r > 0 && p.regions[i - n] !== g) b.classList.add('et');
        if (c < n - 1 && p.regions[i + 1] !== g) b.classList.add('er');
        if (r < n - 1 && p.regions[i + n] !== g) b.classList.add('eb');
        if (c > 0 && p.regions[i - 1] !== g) b.classList.add('el');
        b.dataset.i = i;
        b.tabIndex = i === 0 ? 0 : -1;
        row.appendChild(b);
        cells.push(b);
      }
      boardEl.appendChild(row);
    }
    focusIdx = 0;
  }

  function paint() {
    var bad = conflicts(), n = p.size, k = 0;
    cells.forEach(function (b, i) {
      var m = marks[i];
      b.classList.toggle('x', m === 1);
      b.classList.toggle('s', m === 2);
      b.classList.toggle('bad', m === 2 && !!bad[i]);
      if (m === 2) b.style.setProperty('--i', k++);
      var rc = rcOf(i);
      b.setAttribute('aria-label', 'Row ' + (rc[0] + 1) + ', column ' + (rc[1] + 1) + ', ' + PLOT_NAMES[p.regions[i] % 9] + ' plot, ' + (m === 2 ? 'stone' : m === 1 ? 'crossed out' : 'empty'));
    });
    els.undo.disabled = !history.length || done;
    return bad;
  }

  function tick() { els.time.textContent = fmt(startAt ? Math.floor((Date.now() - startAt) / 1000) : 0); }
  function startTimer() {
    if (startAt) return;
    startAt = Date.now();
    timerId = setInterval(tick, 1000);
  }
  function stopTimer() { clearInterval(timerId); timerId = null; }

  function load(newSize, isPractice) {
    size = newSize;
    practice = !!isPractice;
    stopTimer();
    var day = localDay();
    var seed = practice ? (Math.random() * 4294967296) >>> 0 : hashString('brainik-web-' + day + '-' + size);
    p = generate(size, seed);
    if (!p) { say('Could not grow a garden. Try another size.', 'warn'); return; }
    marks = new Array(size * size).fill(0);
    history = []; hints = 0; startAt = 0; done = false;
    var d = new Date();
    label = practice ? 'Practice garden' : 'Today’s garden · ' + d.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'short' });
    els.date.textContent = label;
    els.solved.hidden = true;
    sizeBtns.forEach(function (b) { b.setAttribute('aria-checked', String(Number(b.dataset.size) === size)); });
    build();
    paint();
    tick();
    say();
  }

  function commit(next) {
    history.push(marks.slice());
    if (history.length > 300) history.shift();
    marks = next;
  }

  function after(i) {
    var bad = paint();
    if (isSolved()) return win();
    if (i != null && marks[i] === 2 && bad[i]) say('Those stones clash: same row, column, plot, or touching.', 'warn');
    else if (Object.keys(bad).length) say('Something clashes. Red stones break a rule.', 'warn');
    else say();
  }

  function tap(i) {
    if (done) return;
    startTimer();
    clearHint();
    var next = marks.slice();
    next[i] = (next[i] + 1) % 3;
    if (next[i] === 2) blockedBy(i).forEach(function (b) { if (next[b] === 0) next[b] = 1; });
    commit(next);
    after(i);
  }

  function win() {
    done = true;
    stopTimer();
    var secs = Math.max(1, Math.floor((Date.now() - startAt) / 1000));
    els.time.textContent = fmt(secs);
    boardEl.classList.add('won');
    els.solvedMeta.textContent = 'in ' + fmt(secs) + ' · ' + (hints ? hints + (hints === 1 ? ' hint' : ' hints') : 'no hints');
    els.solved.hidden = false;
    els.undo.disabled = true;
    say('Lovely. Every row, column and plot has its stone.', 'tip');
    els.copy.dataset.text = 'Brainik · ' + label + ' · ' + size + '×' + size + ' · ⏱ ' + fmt(secs) + ' · ' + (hints ? '💡' + hints : 'no hints') + '\nhttps://askdevelopers.github.io/brainik/';
    setTimeout(function () { els.copy.focus({ preventScroll: true }); }, 900);
  }

  var hinted = [];
  function clearHint() { hinted.forEach(function (b) { b.classList.remove('hint'); }); hinted = []; }
  function flash(list) { clearHint(); list.forEach(function (i) { cells[i].classList.add('hint'); hinted.push(cells[i]); }); }

  // Same teaching order as the app: point out a mistake, then the simplest forced move, else reveal one stone.
  function hint() {
    if (done) return;
    startTimer();
    var n = p.size, i;
    for (i = 0; i < n * n; i++) {
      var should = p.solution[Math.floor(i / n)] === i % n;
      if (marks[i] === 2 && !should) { hints++; flash([i]); return say('This stone can’t stay here. Something else must go in its row, column or plot.', 'tip'); }
      if (marks[i] === 1 && should) { hints++; flash([i]); return say('This crossed-out cell actually needs a stone.', 'tip'); }
    }
    var blocked = {};
    marks.forEach(function (m, j) { if (m === 2) blockedBy(j).forEach(function (b) { blocked[b] = true; }); });
    var open = function (j) { return marks[j] === 0 && !blocked[j]; };
    var groups = [];
    for (var g = 0; g < n; g++) groups.push({ name: 'plot', cells: p.regions.map(function (v, j) { return v === g ? j : -1; }).filter(function (j) { return j >= 0; }) });
    for (var r = 0; r < n; r++) { var row = []; for (var c = 0; c < n; c++) row.push(r * n + c); groups.push({ name: 'row', cells: row }); }
    for (var c2 = 0; c2 < n; c2++) { var col = []; for (var r2 = 0; r2 < n; r2++) col.push(r2 * n + c2); groups.push({ name: 'column', cells: col }); }
    for (var k = 0; k < groups.length; k++) {
      var gr = groups[k];
      if (gr.cells.some(function (j) { return marks[j] === 2; })) continue;
      var cand = gr.cells.filter(open);
      if (cand.length === 1) { hints++; flash([cand[0]]); return say('Only one cell is left in this ' + gr.name + '. The stone goes there.', 'tip'); }
    }
    var crossable = Object.keys(blocked).map(Number).filter(function (j) { return marks[j] === 0; });
    if (crossable.length) { hints++; flash(crossable); return say('These cells touch or share a line with a stone, so they can be crossed out.', 'tip'); }
    var best = null, bestSize = Infinity;
    for (var rr = 0; rr < n; rr++) {
      var cell = rr * n + p.solution[rr];
      if (marks[cell] === 2) continue;
      var sz = p.regions.filter(function (v) { return v === p.regions[cell]; }).length;
      if (sz < bestSize) { bestSize = sz; best = cell; }
    }
    if (best == null) return;
    hints++;
    var next = marks.slice();
    next[best] = 2;
    blockedBy(best).forEach(function (b) { if (next[b] === 0) next[b] = 1; });
    commit(next);
    flash([best]);
    after(best);
    if (!done) say('Here’s a stone to get you going.', 'tip');
  }

  // ---------- Events ----------
  boardEl.addEventListener('click', function (e) {
    var b = e.target.closest('.cell');
    if (!b) return;
    var i = Number(b.dataset.i);
    moveFocus(i, false);
    tap(i);
  });
  function moveFocus(i, focus) {
    if (cells[focusIdx]) cells[focusIdx].tabIndex = -1;
    focusIdx = i;
    cells[i].tabIndex = 0;
    if (focus) cells[i].focus();
  }
  boardEl.addEventListener('keydown', function (e) {
    var n = p.size, r = Math.floor(focusIdx / n), c = focusIdx % n;
    var map = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] };
    var d = map[e.key];
    if (d) {
      e.preventDefault();
      var nr = Math.min(n - 1, Math.max(0, r + d[0])), nc = Math.min(n - 1, Math.max(0, c + d[1]));
      moveFocus(nr * n + nc, true);
    }
  });
  els.undo.addEventListener('click', function () {
    if (!history.length || done) return;
    clearHint();
    marks = history.pop();
    after(null);
  });
  els.clear.addEventListener('click', function () {
    if (done || !marks.some(function (m) { return m; })) return;
    clearHint();
    commit(new Array(p.size * p.size).fill(0));
    after(null);
  });
  els.hint.addEventListener('click', hint);
  els.again.addEventListener('click', function () { load(size, true); boardEl.querySelector('.cell').focus({ preventScroll: true }); });
  els.copy.addEventListener('click', function () {
    var text = els.copy.dataset.text || '';
    var ok = function () { els.copy.textContent = 'Copied'; setTimeout(function () { els.copy.textContent = 'Copy result'; }, 1600); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(ok, function () { say(text, 'tip'); });
    else say(text, 'tip');
  });
  sizeBtns.forEach(function (b) {
    b.addEventListener('click', function () { load(Number(b.dataset.size), false); });
  });

  load(6, false);
})();
