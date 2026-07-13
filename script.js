/* ═══════════════════════════════════════════════════════════
   script.js — Logique interactive du site
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── VARIABLES À PERSONNALISER ─── */
  const PRENOM_1 = 'Samuel';
  const PRENOM_2 = 'Dune';

  // Date de nos prochaines retrouvailles (fin du temps d'éloignement)
  const DATE_RETOUAILLES = new Date('2026-08-30T00:00:00');

  // Date de début de notre histoire — personnalise cette date
  const START_DATE = new Date('2024-06-15T00:00:00');

  // Fréquence cardiaque moyenne (bpm) pour le calcul des battements
  const BPM_MOYEN = 70;

  // Paires du memory — remplace emoji par image: 'images/photo.jpg'
  const MEMORY_PAIRS = [
    { id: 'heart', label: 'Cœur', emoji: '💓' },
    { id: 'star', label: 'Étoile', emoji: '✨' },
    { id: 'moon', label: 'Nuit', emoji: '🌙' },
    { id: 'coffee', label: 'Café', emoji: '☕' },
    { id: 'music', label: 'Musique', emoji: '🎵' },
    { id: 'sunset', label: 'Coucher de soleil', emoji: '🌅' },
  ];

  // Citations du jour — à personnaliser
  const CITATIONS = [
    '« Chaque seconde avec toi est une étoile de plus dans mon ciel. »',
    '« Tu es mon remix préféré dans cette playlist de vie. »',
    '« Même les nuits les plus sombres brillent quand tu es là. »',
    '« Nos cœurs battent au même BPM, et c\'est le meilleur morceau. »',
    '« La ville rose n\'a jamais été aussi rose depuis que tu es là. »',
    '« On n\'a pas besoin de demain pour savoir qu\'on est faits l\'un pour l\'autre. »',
  ];

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─── COMPTE À REBOURS ─── */
  const units = {
    days: { front: 'cd-days', back: 'cd-days-back', card: '[data-unit="days"] .flip-card' },
    hours: { front: 'cd-hours', back: 'cd-hours-back', card: '[data-unit="hours"] .flip-card' },
    minutes: { front: 'cd-minutes', back: 'cd-minutes-back', card: '[data-unit="minutes"] .flip-card' },
    seconds: { front: 'cd-seconds', back: 'cd-seconds-back', card: '[data-unit="seconds"] .flip-card' },
  };

  let prevValues = { days: null, hours: null, minutes: null, seconds: null };

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function getTimeRemaining() {
    const now = new Date();
    const diff = DATE_RETOUAILLES - now;

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
    }

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
      expired: false,
    };
  }

  function flipCard(unit, newValue) {
    const config = units[unit];
    const card = document.querySelector(config.card);
    const backEl = document.getElementById(config.back);
    const frontEl = document.getElementById(config.front);

    if (!card || !backEl || !frontEl) return;

    backEl.textContent = pad(newValue);

    if (prefersReducedMotion) {
      frontEl.textContent = pad(newValue);
      return;
    }

    card.classList.add('flipping');

    card.addEventListener('transitionend', function handler() {
      card.removeEventListener('transitionend', handler);
      frontEl.textContent = pad(newValue);
      card.classList.remove('flipping');
    }, { once: true });
  }

  function updateCountdown() {
    const time = getTimeRemaining();

    Object.keys(units).forEach((unit) => {
      const val = time[unit];
      if (prevValues[unit] !== val) {
        if (prevValues[unit] !== null) {
          flipCard(unit, val);
        } else {
          document.getElementById(units[unit].front).textContent = pad(val);
          document.getElementById(units[unit].back).textContent = pad(val);
        }
        prevValues[unit] = val;
      }
    });

    if (time.expired) {
      clearInterval(countdownInterval);
      document.querySelector('.countdown-section .section-subtitle').textContent =
        'On est enfin réunis — plus besoin de compter le temps d\'éloignement.';
    }
  }

  const countdownInterval = setInterval(updateCountdown, 1000);
  updateCountdown();

  /* ─── LAB STATS — Cartes flip data-driven ─── */
  /**
   * Ajoute une carte : copie un objet ci-dessous, change id / label / compute / backLines.
   * liveUpdate: true → recalcul chaque seconde (ex. battements de cœur).
   */
  const LAB_STATS_CARDS = [
    {
      id: 'nights',
      ariaLabel: 'Nuits étoilées',
      ornamentLeft: '✦',
      ornamentRight: '✦',
      label: 'nuits étoilées',
      liveUpdate: false,
      compute(elapsed) {
        return Math.floor(elapsed.totalSeconds / 86400);
      },
      backLines: [
        { type: 'title', text: '🔭 Calcul astro-sentimental' },
        { type: 'formula', text: 'N = (t_actuel − t_départ) / 86400s' },
        { type: 'text', text: 'Chaque nuit sous le même ciel = 1 unité d\'amour cumulée' },
        { type: 'text', text: 'Constante orbitale : irréversible' },
        { type: 'text', text: 'Probabilité de fin : 0%' },
      ],
    },
    {
      id: 'heartbeats',
      ariaLabel: 'Battements de cœur',
      ornamentLeft: '♡',
      ornamentRight: '♡',
      label: 'battements de cœur',
      liveUpdate: true,
      compute(elapsed) {
        return Math.floor(elapsed.totalSeconds * (BPM_MOYEN / 60));
      },
      backLines: [
        { type: 'title', text: '🫀 Théorème cardiaque' },
        { type: 'formula', text: 'B = Δt × 70 bpm (moyenne)' },
        { type: 'text', text: 'Fréquence stable depuis le jour J' },
        { type: 'text', text: 'Amplitude en hausse constante' },
        { type: 'text', text: 'Aucune anomalie détectée — juste toi.' },
      ],
    },
  ];

  function getElapsedSinceStart() {
    const now = new Date();
    const diffMs = Math.max(0, now - START_DATE);
    const totalSeconds = Math.floor(diffMs / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalDays = Math.floor(totalSeconds / 86400);

    return { diffMs, totalSeconds, totalMinutes, totalDays };
  }

  function formatLabNumber(n) {
    return n.toLocaleString('fr-FR');
  }

  function renderLabBackLines(lines) {
    return lines
      .map((line) => {
        const cls = `lab-back-${line.type}`;
        const tag = line.type === 'formula' ? 'code' : 'p';
        return `<${tag} class="${cls}">${line.text}</${tag}>`;
      })
      .join('');
  }

  function renderLabStatCard(config) {
    const col = document.createElement('div');
    col.className = 'column is-5-tablet is-12-mobile';

    col.innerHTML = `
      <div class="stat-flip-card reveal" data-stat-id="${config.id}" tabindex="0" role="button"
           aria-label="${config.ariaLabel} — survoler pour voir l'analyse">
        <div class="stat-flip-inner">
          <div class="stat-flip-face stat-flip-front stat-card lab-stat-front">
            <p class="lab-stat-value">
              <span class="lab-ornament" aria-hidden="true">${config.ornamentLeft}</span>
              <span class="lab-stat-number" data-stat-value="${config.id}">0</span>
              <span class="lab-ornament" aria-hidden="true">${config.ornamentRight}</span>
            </p>
            <span class="lab-stat-label">${config.label}</span>
          </div>
          <div class="stat-flip-face stat-flip-back stat-card lab-stat-back">
            ${renderLabBackLines(config.backLines)}
          </div>
        </div>
      </div>
    `;

    return col;
  }

  function renderLabStatsGrid() {
    const grid = document.getElementById('lab-stats-grid');
    if (!grid) return;

    LAB_STATS_CARDS.forEach((config) => {
      grid.appendChild(renderLabStatCard(config));
    });
  }

  function updateLabStats() {
    const elapsed = getElapsedSinceStart();

    LAB_STATS_CARDS.forEach((config) => {
      const el = document.querySelector(`[data-stat-value="${config.id}"]`);
      if (!el) return;
      el.textContent = formatLabNumber(config.compute(elapsed));
    });
  }

  function initLabStats() {
    renderLabStatsGrid();
    updateLabStats();

    const hasLiveCards = LAB_STATS_CARDS.some((c) => c.liveUpdate);
    if (hasLiveCards) {
      setInterval(updateLabStats, 1000);
    }

    initStatFlipCards();
  }

  function initStatFlipCards() {
    const cards = document.querySelectorAll('.stat-flip-card');
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (canHover) return;

    cards.forEach((card) => {
      card.addEventListener('click', () => {
        const isFlipped = card.classList.toggle('is-flipped');
        card.setAttribute('aria-pressed', isFlipped ? 'true' : 'false');
      });
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.stat-flip-card')) {
        cards.forEach((card) => {
          card.classList.remove('is-flipped');
          card.setAttribute('aria-pressed', 'false');
        });
      }
    });
  }

  /* ─── CITATION DU JOUR ─── */
  function initQuote() {
    const el = document.getElementById('quote-text');
    if (!el) return;
    const idx = Math.floor(Math.random() * CITATIONS.length);
    el.textContent = CITATIONS[idx];
  }

  /* ─── SCROLL REVEAL ─── */
  function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');

    if (prefersReducedMotion) {
      reveals.forEach((el) => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    reveals.forEach((el) => observer.observe(el));
  }

  /* ─── MINI-JEU MEMORY ─── */
  function shuffle(array) {
    const arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function initMemoryGame() {
    const board = document.getElementById('memory-board');
    const movesEl = document.getElementById('memory-moves');
    const pairsEl = document.getElementById('memory-pairs');
    const winEl = document.getElementById('memory-win');
    const restartBtn = document.getElementById('memory-restart');

    if (!board) return;

    let moves = 0;
    let matchedPairs = 0;
    let flipped = [];
    let locked = false;

    function updateHud() {
      movesEl.textContent = moves;
      pairsEl.textContent = matchedPairs;
    }

    function buildFrontContent(pair) {
      if (pair.image) {
        return `<img src="${pair.image}" alt="${pair.label}" loading="lazy">`;
      }
      return `<span class="memory-emoji">${pair.emoji}</span><span class="memory-label">${pair.label}</span>`;
    }

    function createCard(pair, index) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'memory-card';
      btn.dataset.pairId = pair.id;
      btn.setAttribute('role', 'gridcell');
      btn.setAttribute('aria-label', 'Carte cachée');
      btn.innerHTML = `
        <div class="memory-card-inner">
          <div class="memory-face memory-back">
            <span class="memory-back-icon" aria-hidden="true">✦</span>
          </div>
          <div class="memory-face memory-front">
            ${buildFrontContent(pair)}
          </div>
        </div>
      `;

      btn.addEventListener('click', () => handleFlip(btn));
      return btn;
    }

    function handleFlip(card) {
      if (locked) return;
      if (card.classList.contains('is-flipped') || card.classList.contains('is-matched')) return;
      if (flipped.length >= 2) return;

      card.classList.add('is-flipped');
      card.setAttribute('aria-label', 'Carte retournée');
      flipped.push(card);

      if (flipped.length === 2) {
        moves++;
        updateHud();
        checkMatch();
      }
    }

    function checkMatch() {
      const [a, b] = flipped;
      const match = a.dataset.pairId === b.dataset.pairId;

      if (match) {
        locked = true;
        setTimeout(() => {
          a.classList.add('is-matched');
          b.classList.add('is-matched');
          a.disabled = true;
          b.disabled = true;
          matchedPairs++;
          updateHud();
          flipped = [];
          locked = false;

          if (matchedPairs === MEMORY_PAIRS.length) {
            winEl.hidden = false;
            winEl.classList.add('visible');
          }
        }, 400);
      } else {
        locked = true;
        setTimeout(() => {
          a.classList.remove('is-flipped');
          b.classList.remove('is-flipped');
          a.setAttribute('aria-label', 'Carte cachée');
          b.setAttribute('aria-label', 'Carte cachée');
          flipped = [];
          locked = false;
        }, 900);
      }
    }

    function resetGame() {
      moves = 0;
      matchedPairs = 0;
      flipped = [];
      locked = false;
      winEl.hidden = true;
      winEl.classList.remove('visible');
      updateHud();
      board.innerHTML = '';

      const cards = shuffle(
        MEMORY_PAIRS.flatMap((pair) => [
          { ...pair, uid: `${pair.id}-a` },
          { ...pair, uid: `${pair.id}-b` },
        ])
      );

      cards.forEach((pair, i) => {
        board.appendChild(createCard(pair, i));
      });
    }

    restartBtn.addEventListener('click', resetGame);
    resetGame();
  }

  /* ─── INIT ─── */
  function init() {
    initQuote();
    initLabStats();
    initScrollReveal();
    initMemoryGame();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
