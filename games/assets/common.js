// Outils partagés par tous les jeux.
(function () {
  const $ = (sel, root = document) => root.querySelector(sel);

  const esc = (s) => String(s).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

  // Minuscules, sans accents ni tirets : « Égypte » == « egypte ».
  const norm = (s) => String(s)
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[-'’]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function weightedPick(list, weightFn) {
    const total = list.reduce((s, x) => s + weightFn(x), 0);
    let r = Math.random() * total;
    for (const x of list) {
      r -= weightFn(x);
      if (r <= 0) return x;
    }
    return list[list.length - 1];
  }

  // Tire des pays en favorisant les plus importants, sans répéter les derniers sortis.
  function makePicker(pool) {
    const recent = [];
    const memory = Math.min(15, Math.floor(pool.length / 2));
    return function () {
      const cands = pool.filter((c) => !recent.includes(c));
      const c = weightedPick(cands.length ? cands : pool, (x) => x.weight);
      recent.push(c);
      if (recent.length > memory) recent.shift();
      return c;
    };
  }

  // Choisit n mauvaises réponses, de préférence sur le même continent.
  // labelFn sert à éviter deux réponses identiques à l'écran.
  // Si pool ne suffit pas, on complète avec fallbackPool.
  function pickDistractors(answer, pool, n, labelFn, fallbackPool) {
    const label = labelFn || ((c) => c.code);
    const picked = [];
    const fits = (x) => x !== answer && label(x) !== label(answer) && !Data.areLookalikes(x, answer) &&
      picked.every((p) => x !== p && label(x) !== label(p) && !Data.areLookalikes(x, p));
    [pool, fallbackPool || []].forEach((source) => {
      let cands = source.filter(fits);
      while (picked.length < n && cands.length) {
        const c = weightedPick(cands, (x) => (x.weight + 1) * (x.region === answer.region ? 3 : 1));
        picked.push(c);
        cands = cands.filter(fits);
      }
    });
    return picked;
  }

  // localStorage peut être indisponible (navigation privée…) : on ne plante jamais.
  const store = {
    get(key, fallback) {
      try {
        const v = localStorage.getItem('geo:' + key);
        return v === null ? fallback : JSON.parse(v);
      } catch (e) { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem('geo:' + key, JSON.stringify(value)); } catch (e) { /* ignoré */ }
    },
  };

  // Petits sons générés (pas de fichiers audio).
  const Sound = {
    ctx: null,
    muted: store.get('muted', false),
    play(type) {
      if (this.muted) return;
      try {
        this.ctx = this.ctx || new (window.AudioContext || window.webkitAudioContext)();
        const tunes = {
          good: [[660, 'sine'], [880, 'sine']],
          bad: [[240, 'square'], [180, 'square']],
          end: [[523, 'sine'], [659, 'sine'], [784, 'sine'], [1046, 'sine']],
          fall: [[400, 'triangle'], [300, 'triangle'], [200, 'triangle'], [120, 'triangle']],
        }[type];
        const t0 = this.ctx.currentTime;
        tunes.forEach(([freq, wave], i) => {
          const o = this.ctx.createOscillator();
          const g = this.ctx.createGain();
          const t = t0 + i * 0.09;
          o.type = wave;
          o.frequency.value = freq;
          g.gain.setValueAtTime(0.0001, t);
          g.gain.exponentialRampToValueAtTime(wave === 'square' ? 0.06 : 0.18, t + 0.01);
          g.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
          o.connect(g).connect(this.ctx.destination);
          o.start(t);
          o.stop(t + 0.15);
        });
      } catch (e) { /* pas de son, tant pis */ }
    },
  };

  function initMuteButton() {
    const btn = $('#mute');
    if (!btn) return;
    const paint = () => {
      btn.textContent = Sound.muted ? '🔇' : '🔊';
      btn.setAttribute('aria-label', Sound.muted ? 'Activer le son' : 'Couper le son');
    };
    btn.onclick = () => {
      Sound.muted = !Sound.muted;
      store.set('muted', Sound.muted);
      paint();
    };
    paint();
  }

  // Boutons de choix des continents. Renvoie une fonction qui donne la sélection.
  function regionPicker(container, regions = Data.REGIONS, storageKey = 'regions') {
    let selected = store.get(storageKey, regions.map((r) => r.key));
    container.insertAdjacentHTML('beforeend', '<p class="setting-label">Continents</p><div class="chips"></div>');
    const chips = container.querySelector('.chips');
    regions.forEach((r) => {
      const b = document.createElement('button');
      b.className = 'chip' + (selected.includes(r.key) ? ' on' : '');
      b.textContent = r.emoji + ' ' + r.key;
      b.onclick = () => {
        selected = selected.includes(r.key) ? selected.filter((k) => k !== r.key) : selected.concat(r.key);
        b.classList.toggle('on', selected.includes(r.key));
        store.set(storageKey, selected);
      };
      chips.appendChild(b);
    });
    return () => selected;
  }

  // Sélecteur Facile / Moyen / Difficile. Renvoie une fonction qui donne le choix.
  function segmented(container, options, storageKey, onChange) {
    let value = store.get(storageKey, options[0].key);
    if (!options.some((o) => o.key === value)) value = options[0].key;
    container.insertAdjacentHTML('beforeend', '<p class="setting-label">Difficulté</p><div class="segmented" role="radiogroup"></div><p class="seg-help"></p>');
    const seg = container.querySelector('.segmented');
    const help = container.querySelector('.seg-help');
    const paint = () => {
      seg.querySelectorAll('button').forEach((b) => {
        b.classList.toggle('on', b.dataset.key === value);
        b.setAttribute('aria-checked', b.dataset.key === value);
      });
      help.textContent = options.find((o) => o.key === value).help || '';
    };
    options.forEach((o) => {
      const b = document.createElement('button');
      b.dataset.key = o.key;
      b.setAttribute('role', 'radio');
      b.textContent = o.label;
      b.onclick = () => {
        value = o.key;
        store.set(storageKey, value);
        paint();
        onChange && onChange(value);
      };
      seg.appendChild(b);
    });
    paint();
    return () => value;
  }

  // Grille de boutons-réponses. onAnswer(ok) est appelé une seule fois.
  function renderChoices(container, items, correctIdx, contentFn, onAnswer, extraClass) {
    const grid = document.createElement('div');
    grid.className = 'choices ' + (extraClass || '');
    items.forEach((it, i) => {
      const b = document.createElement('button');
      b.className = 'choice';
      b.innerHTML = contentFn(it);
      b.onclick = () => {
        if (grid.classList.contains('locked')) return;
        grid.classList.add('locked');
        const ok = i === correctIdx;
        b.classList.add(ok ? 'good' : 'bad');
        if (!ok) grid.children[correctIdx].classList.add('good', 'reveal');
        onAnswer(ok);
      };
      grid.appendChild(b);
    });
    container.appendChild(grid);
    return grid;
  }

  function preloadFlags(countries) {
    countries.forEach((c) => { const img = new Image(); img.src = Data.flagSrc(c); });
  }

  // Liste « À retenir » des erreurs, sans doublons.
  function reviewHTML(review) {
    const seen = new Set();
    const items = review.filter((r) => !seen.has(r.left) && seen.add(r.left));
    if (!items.length) return '';
    return '<div class="review"><h3>📚 À retenir</h3><ul>' +
      items.map((r) => `<li><span>${r.left}</span><b>${r.right}</b></li>`).join('') +
      '</ul></div>';
  }

  /*
   * Moteur des quiz chronométrés (jeux 1, 2, 4 et 5).
   * cfg = {
   *   gameId, emoji, title, rules, duration (s),
   *   renderSettings(container, refreshBest)  // réglages sur l'écran d'accueil
   *   modeKey()                              // sépare les records par difficulté
   *   prepare()                              // renvoie un message d'erreur ou rien
   *   ask(stage, done)                       // affiche une question ; done(ok, {left, right})
   * }
   */
  function TimedQuiz(cfg) {
    const app = $('#app');
    const duration = cfg.duration || 60;
    let st = null;

    const bestKey = () => 'best:' + cfg.gameId + (cfg.modeKey ? ':' + cfg.modeKey() : '');

    function showStart() {
      app.innerHTML = `
        <section class="card">
          <div class="big-emoji">${cfg.emoji}</div>
          <h2>${esc(cfg.title)}</h2>
          <p class="rules">${cfg.rules}</p>
          <div id="settings"></div>
          <p class="best" id="best"></p>
          <button class="btn primary big" id="go">Jouer !</button>
          <p class="error-msg" id="err"></p>
        </section>`;
      const refreshBest = () => {
        const b = store.get(bestKey(), 0);
        $('#best').textContent = b ? `🏆 Record : ${b} point${b > 1 ? 's' : ''}` : '';
      };
      if (cfg.renderSettings) cfg.renderSettings($('#settings'), refreshBest);
      refreshBest();
      $('#go').onclick = start;
    }

    function start() {
      const err = cfg.prepare ? cfg.prepare() : null;
      if (err) {
        const e = $('#err');
        if (e) e.textContent = err;
        return;
      }
      st = { score: 0, combo: 0, maxCombo: 0, good: 0, bad: 0, review: [], over: false, qid: 0, endAt: performance.now() + duration * 1000 };
      app.innerHTML = `
        <section class="play">
          <div class="hud">
            <div class="hud-item" id="time-box"><span class="lbl">⏱️ Temps</span><b id="time"></b></div>
            <div class="hud-item"><span class="lbl">⭐ Points</span><b id="score">0</b></div>
            <div class="hud-item" id="combo-box"><span class="lbl">🔥 Combo</span><b id="combo">0</b></div>
          </div>
          <div class="timebar"><div id="timefill"></div></div>
          <div id="stage" class="stage"></div>
          <div id="pop" class="pop"></div>
        </section>`;
      tick();
      st.timer = setInterval(tick, 100);
      next();
    }

    function tick() {
      const left = Math.max(0, st.endAt - performance.now());
      const s = Math.ceil(left / 1000);
      $('#time').textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
      $('#timefill').style.width = (left / (duration * 10)) + '%';
      $('#time-box').classList.toggle('warn', s <= 10);
      if (left <= 0) finish();
    }

    function next() {
      if (st.over) return;
      const token = ++st.qid;
      cfg.ask($('#stage'), (ok, review) => {
        if (st.over || token !== st.qid) return;
        answer(ok, review);
      });
    }

    function pop(text, kind) {
      const p = $('#pop');
      p.textContent = text;
      p.className = 'pop ' + kind;
      void p.offsetWidth; // relance l'animation
      p.classList.add('show');
    }

    function answer(ok, review) {
      if (ok) {
        st.combo++;
        st.maxCombo = Math.max(st.maxCombo, st.combo);
        st.score += st.combo;
        st.good++;
        pop('+' + st.combo, 'good');
        Sound.play('good');
      } else {
        st.combo = 0;
        st.score = Math.max(0, st.score - 1);
        st.bad++;
        if (review) st.review.push(review);
        pop('-1', 'bad');
        Sound.play('bad');
      }
      $('#score').textContent = st.score;
      $('#combo').textContent = st.combo ? 'x' + st.combo : '0';
      $('#combo-box').classList.toggle('combo-hot', st.combo >= 3);
      const game = st;
      setTimeout(() => { if (game === st) next(); }, ok ? 700 : 1800);
    }

    function finish() {
      if (st.over) return;
      st.over = true;
      clearInterval(st.timer);
      Sound.play('end');
      const key = bestKey();
      const prev = store.get(key, 0);
      const record = st.score > prev;
      if (record) store.set(key, st.score);
      app.innerHTML = `
        <section class="card">
          <div class="big-emoji">⏰</div>
          <h2>Temps écoulé !</h2>
          <div class="final-score">${st.score}</div>
          <div class="final-unit">point${st.score > 1 ? 's' : ''}</div>
          ${record && st.score > 0 ? '<div class="record">🏆 Nouveau record !</div>' : (prev ? `<p class="best">🏆 Record : ${prev}</p>` : '')}
          <div class="stats">
            <span>✅ ${st.good} bonne${st.good > 1 ? 's' : ''}</span>
            <span>❌ ${st.bad} erreur${st.bad > 1 ? 's' : ''}</span>
            <span>🔥 Meilleur combo : ${st.maxCombo}</span>
          </div>
          ${reviewHTML(st.review)}
          <div class="btn-row">
            <button class="btn primary big" id="again">Rejouer</button>
          </div>
          <div class="btn-row">
            <button class="btn ghost" id="settings-btn">Changer les réglages</button>
            <a class="btn ghost" href="index.html">Menu</a>
          </div>
        </section>`;
      $('#again').onclick = start;
      $('#settings-btn').onclick = showStart;
    }

    initMuteButton();
    showStart();
  }

  window.Game = {
    $, esc, norm, shuffle, weightedPick, makePicker, pickDistractors,
    store, Sound, initMuteButton, regionPicker, segmented, renderChoices,
    preloadFlags, reviewHTML, TimedQuiz,
  };
})();
