/**
 * CITLALLI ARCADE — JUEGO 3: REFLEJOS DEL ALQUIMISTA & DUELO DE MAGNETISMO
 * Archivo: src/games/reflex/reflex-game.js
 * 100% Modular y Desacoplado (Regla de Oro)
 *
 * Incluye dos experiencias conmutables desde el HUD del canvas o vía API:
 *  1. "destilacion" (Modo Destilación Arcade - 1P / 2P Local / VS IA / Online):
 *     Orbes alquímicos con notas olfativas de Citlalli (mandarin, rose, jasmine,
 *     vanilla, amber, bottle, star) con anillo de tiempo y trampas de Humo Amargo (smoke).
 *     Mide milisegundos exactos de reacción en cada captura y el promedio de la partida.
 *  2. "duelo" (Modo Duelo Relámpago - El Relámpago de David - 5 Rondas de ms Puro):
 *     Silencio místico nocturno -> Destello de la Estrella de 8 Puntas y el Jaguar Dorado.
 *     Mide quién reacciona en menos milisegundos (J1: Tecla A / Clic Izq vs J2/IA: Tecla L / Clic Der),
 *     penaliza salidas en falso y corona al ganador de las 5 rondas.
 */

const STORAGE_KEY_HIGH = 'citlalli_reflex_highscore_v1';
const STORAGE_KEY_BEST_MS = 'citlalli_reflex_bestms_v1';

const NOTES_CATALOG = [
  { id: 'mandarin', label: 'Mandarina', points: 25, color: '#ff9436', glow: '#ffb86c', weight: 22 },
  { id: 'rose', label: 'Rosa Damascena', points: 30, color: '#ff5c8a', glow: '#ff9ebb', weight: 20 },
  { id: 'jasmine', label: 'Jazmín Real', points: 30, color: '#f5f0ff', glow: '#d8c8ff', weight: 18 },
  { id: 'vanilla', label: 'Vainilla Oro', points: 35, color: '#ffe082', glow: '#fff3c4', weight: 15 },
  { id: 'amber', label: 'Ámbar Místico', points: 45, color: '#ffae19', glow: '#ffd670', weight: 12 },
  { id: 'bottle', label: 'Frasco CITLALLI', points: 65, color: '#e8a598', glow: '#f4c56c', weight: 8 },
  { id: 'star', label: 'Estrella Citlalli', points: 80, color: '#fff3a1', glow: '#ffffff', weight: 5 },
  { id: 'smoke', label: 'Humo Amargo', points: -50, color: '#6e5678', glow: '#a3485e', weight: 18, isTrap: true }
];

const SCENARIO_THEMES = {
  hidalgo: {
    name: 'Cielo de Hidalgo',
    skyTop: '#060719',
    skyBottom: '#17153b',
    tableTop: '#161329',
    tableBorder: '#f4c56c',
    accent: '#f4c56c',
    secondary: '#e8a598',
    starColor: '#fff5b8'
  },
  jaguar: {
    name: 'Templo del Jaguar',
    skyTop: '#0d0704',
    skyBottom: '#291507',
    tableTop: '#1c1008',
    tableBorder: '#ffae19',
    accent: '#ffae19',
    secondary: '#50c878',
    starColor: '#ffd470'
  },
  velvet: {
    name: 'Salón Terciopelo QM',
    skyTop: '#140510',
    skyBottom: '#330c26',
    tableTop: '#21091a',
    tableBorder: '#e8a598',
    accent: '#e8a598',
    secondary: '#ff6b9d',
    starColor: '#ffd6e7'
  },
  penthouse: {
    name: 'Penthouse Estelar',
    skyTop: '#040914',
    skyBottom: '#102542',
    tableTop: '#0d1829',
    tableBorder: '#7ce8ff',
    accent: '#f4c56c',
    secondary: '#7ce8ff',
    starColor: '#e0faff'
  }
};

const KEY_GRID_1P = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
const KEY_GRID_1P_ALT = ['Q', 'W', 'E', 'A', 'S', 'D', 'Z', 'X', 'C'];
const KEY_GRID_2P_LEFT = ['Q', 'W', 'E', 'A', 'S', 'D'];
const KEY_GRID_2P_RIGHT = ['U', 'I', 'O', 'J', 'K', 'L'];

export class ReflexGame {
  constructor(canvas, callbacks = {}, options = {}) {
    this.canvas = null;
    this.ctx = null;
    this.callbacks = callbacks || {};
    this.options = options || {};

    this.width = 800;
    this.height = 520;

    this.scenario = options.scenario || options.scenarioId || 'hidalgo';
    this.scenarioId = this.scenario;
    this.mode = options.mode || '1p'; // '1p' | '2p_local' | 'vs_ai' | 'online'
    this.difficulty = options.difficulty || 'normal'; // 'normal' | 'fast' | 'god'
    this.subMode = options.subMode || 'destilacion'; // 'destilacion' | 'duelo'

    this.running = false;
    this.paused = false;
    this.gameOver = false;
    this.rafId = null;
    this.lastFrameTime = 0;
    this.elapsedTime = 0;

    // Persistent stats
    this.highScore = this._loadNumber(STORAGE_KEY_HIGH, 0);
    this.allTimeBestMs = this._loadNumber(STORAGE_KEY_BEST_MS, 999);

    // Match stats (Player 1 & Player 2 / AI)
    this.p1 = this._createPlayerState('Alquimista J1', '#f4c56c');
    this.p2 = this._createPlayerState('Jaguar Dorado', '#e8a598');

    // Mode 1: Destilacion state
    this.matchDuration = 45; // seconds
    this.timeLeft = 45;
    this.orbs = [];
    this.spawnTimer = 0;
    this.slowMoTimer = 0;

    // Mode 2: Duelo Relampago state (5 Rounds)
    this.duel = {
      round: 1,
      maxRounds: 5,
      phase: 'waiting', // 'intro' | 'waiting' | 'flash' | 'round_result' | 'match_over'
      phaseTimer: 0,
      targetWaitDuration: 2.5,
      flashTimestamp: 0,
      aiTargetMs: 260,
      aiTriggered: false,
      roundWinner: null,
      roundReason: '',
      history: [] // { round, winner, p1Ms, p2Ms, falseStart }
    };

    // Visual effects
    this.particles = [];
    this.floatingTexts = [];
    this.bgStars = [];
    this.screenShake = 0;
    this.flashAlpha = 0;
    this.flashColor = '#ffffff';
    this.hudToggleButtonRect = { x: 0, y: 0, w: 0, h: 0 };
    this.duelActionButtonRect = { x: 0, y: 0, w: 0, h: 0 };

    // Fallback WebAudio synth
    this.audioCtx = null;

    // Bound listeners
    this._onKeyDown = this._handleKeyDown.bind(this);
    this._onPointerDown = this._handlePointerDown.bind(this);
    this._onContextMenu = (e) => {
      if (this.subMode === 'duelo') e.preventDefault();
    };
    this._onResize = this._handleResize.bind(this);

    if (canvas) {
      this.init(canvas, callbacks, options);
    }
  }

  get score() {
    return this.p1 ? this.p1.score : 0;
  }

  get p2Score() {
    return this.p2 ? this.p2.score : 0;
  }

  get isRunning() {
    return this.running;
  }

  set isRunning(val) {
    this.running = Boolean(val);
  }

  get isPaused() {
    return this.paused;
  }

  static init(canvas, callbacks = {}, options = {}) {
    return new ReflexGame(canvas, callbacks, options);
  }

  init(canvas, callbacks = {}, options = {}) {
    if (canvas) this.canvas = canvas;
    if (callbacks && Object.keys(callbacks).length > 0) {
      this.callbacks = { ...this.callbacks, ...callbacks };
    }
    if (options && Object.keys(options).length > 0) {
      this.options = { ...this.options, ...options };
      if (options.scenario || options.scenarioId) {
        this.scenario = options.scenario || options.scenarioId;
        this.scenarioId = this.scenario;
      }
      if (options.mode) this.mode = options.mode;
      if (options.difficulty) this.difficulty = options.difficulty;
      if (options.subMode) this.subMode = options.subMode;
    }

    if (!this.canvas) return this;
    this.ctx = this.canvas.getContext('2d');
    this._handleResize();
    this._initBackgroundStars();
    this._bindEvents();
    this._resetMatchState();
    this._renderFrame(performance.now());
    return this;
  }

  _createPlayerState(name, color) {
    return {
      name,
      color,
      score: 0,
      streak: 0,
      maxStreak: 0,
      captures: 0,
      misses: 0,
      trapsHit: 0,
      totalMs: 0,
      lastMs: 0,
      bestMs: 999,
      avgMs: 0,
      lastVerdict: '',
      roundsWon: 0,
      duelCurrentMs: null,
      falseStart: false
    };
  }

  _loadNumber(key, fallback) {
    try {
      const val = localStorage.getItem(key);
      return val !== null ? Number(val) : fallback;
    } catch (_) {
      return fallback;
    }
  }

  _saveNumber(key, val) {
    try {
      localStorage.setItem(key, String(val));
    } catch (_) {
      // Ignore storage errors
    }
  }

  _handleResize() {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    if (this.canvas.width && this.canvas.height && rect.width === 0) {
      this.width = this.canvas.width;
      this.height = this.canvas.height;
    } else {
      this.width = this.canvas.width || Math.max(640, Math.floor(rect.width || 800));
      this.height = this.canvas.height || Math.max(420, Math.floor(rect.height || 520));
    }
    if (this.ctx) {
      this.ctx.imageSmoothingEnabled = false;
    }
  }

  _initBackgroundStars() {
    this.bgStars = [];
    for (let i = 0; i < 65; i++) {
      this.bgStars.push({
        x: Math.random() * this.width,
        y: Math.random() * (this.height * 0.72),
        size: Math.random() < 0.25 ? 3 : 2,
        phase: Math.random() * Math.PI * 2,
        speed: 1.5 + Math.random() * 2.5
      });
    }
  }

  _bindEvents() {
    this._unbindEvents();
    window.addEventListener('keydown', this._onKeyDown);
    window.addEventListener('resize', this._onResize);
    if (this.canvas) {
      this.canvas.addEventListener('pointerdown', this._onPointerDown);
      this.canvas.addEventListener('contextmenu', this._onContextMenu);
    }
  }

  _unbindEvents() {
    window.removeEventListener('keydown', this._onKeyDown);
    window.removeEventListener('resize', this._onResize);
    if (this.canvas) {
      this.canvas.removeEventListener('pointerdown', this._onPointerDown);
      this.canvas.removeEventListener('contextmenu', this._onContextMenu);
    }
  }

  start() {
    this._handleResize();
    this._resetMatchState();
    this.running = true;
    this.paused = false;
    this.gameOver = false;
    this.lastFrameTime = performance.now();

    if (this.subMode === 'destilacion') {
      this._spawnInitialOrbs();
    } else {
      this._startDuelRound(1);
    }

    this._playSound('start');
    this._emitStateChange();

    if (this.rafId) cancelAnimationFrame(this.rafId);
    const loop = (now) => {
      if (!this.running) return;
      const dt = Math.min(0.1, Math.max(0.001, (now - this.lastFrameTime) / 1000));
      this.lastFrameTime = now;
      if (!this.paused && !this.gameOver) {
        this._update(dt, now);
      }
      this._renderFrame(now);
      this.rafId = requestAnimationFrame(loop);
    };
    this.rafId = requestAnimationFrame(loop);
    return this;
  }

  pause() {
    if (!this.running || this.paused) return;
    this.paused = true;
    this._emitStateChange();
    this._renderFrame(performance.now());
  }

  resume() {
    if (!this.running || !this.paused) return;
    this.paused = false;
    this.lastFrameTime = performance.now();
    this._emitStateChange();
  }

  togglePause() {
    if (this.paused) this.resume();
    else this.pause();
    return this.paused;
  }

  setScenario(scenarioId) {
    if (SCENARIO_THEMES[scenarioId]) {
      this.scenario = scenarioId;
    } else {
      this.scenario = 'hidalgo';
    }
    this.scenarioId = this.scenario;
    this._renderFrame(performance.now());
  }

  setMode(mode) {
    const valid = ['1p', '2p_local', 'vs_ai', 'online'];
    this.mode = valid.includes(mode) ? mode : '1p';
    if (this.running) {
      this.start();
    } else {
      this._resetMatchState();
      this._renderFrame(performance.now());
    }
  }

  setDifficulty(diff) {
    const valid = ['normal', 'fast', 'god'];
    this.difficulty = valid.includes(diff) ? diff : 'normal';
    if (this.running) {
      this.start();
    }
  }

  setSubMode(subMode) {
    this.subMode = subMode === 'duelo' ? 'duelo' : 'destilacion';
    if (this.running) {
      this.start();
    } else {
      this._resetMatchState();
      this._renderFrame(performance.now());
    }
  }

  toggleSubMode() {
    this.setSubMode(this.subMode === 'destilacion' ? 'duelo' : 'destilacion');
    this._playSound('star');
  }

  handleRemoteEvent(event) {
    if (!event || typeof event !== 'object') return;
    const { type, payload } = event;
    if (type === 'score_update' && typeof event.score === 'number') {
      this.p2.score = event.score;
      if (event.playerName) this.p2.name = event.playerName;
      this._emitScoreUpdate();
    } else if (type === 'reflex_capture' && payload) {
      this.p2.score = payload.score ?? (this.p2.score + (payload.points || 30));
      this.p2.lastMs = payload.ms || 240;
      this.p2.avgMs = payload.avgMs || this.p2.lastMs;
      this.p2.streak = payload.streak || (this.p2.streak + 1);
      if (payload.slotIndex !== undefined) {
        const orb = this.orbs.find((o) => o.owner === 'p2' && o.slotIndex === payload.slotIndex);
        if (orb) this._resolveOrbCapture(orb, this.p2, payload.ms || 230, true);
      }
      this._emitScoreUpdate();
    } else if (type === 'reflex_duel_strike' && payload) {
      if (this.subMode === 'duelo') {
        this._registerDuelReaction('p2', payload.ms || Math.round(performance.now() - this.duel.flashTimestamp), true);
      }
    } else if (type === 'reflex_submode' && payload) {
      if (payload.subMode && payload.subMode !== this.subMode) {
        this.setSubMode(payload.subMode);
      }
    }
  }

  handleTouchDirection(dir) {
    if (!this.running || this.paused) return;
    if (this.subMode === 'duelo') {
      if (dir === 'left' || dir === 'up' || dir === 'action') {
        this._triggerDuelInput('p1');
      } else if (dir === 'right' || dir === 'down') {
        this._triggerDuelInput(this.mode === '2p_local' ? 'p2' : 'p1');
      }
      return;
    }

    // In destilacion mode, map directional touch to the oldest active non-smoke orb
    const candidateOrbs = this.orbs
      .filter((o) => !o.isTrap && (this.mode === '1p' || o.owner === 'p1'))
      .sort((a, b) => a.spawnTime - b.spawnTime);

    if (candidateOrbs.length > 0) {
      const target = candidateOrbs[0];
      const ms = Math.max(15, Math.round(performance.now() - target.spawnTime));
      this._resolveOrbCapture(target, this.p1, ms);
    }
  }

  getState() {
    return {
      game: 'reflex',
      running: this.running,
      paused: this.paused,
      gameOver: this.gameOver,
      scenario: this.scenario,
      mode: this.mode,
      difficulty: this.difficulty,
      subMode: this.subMode,
      timeLeft: Math.ceil(this.timeLeft),
      score: this.p1.score,
      scoreP1: this.p1.score,
      scoreP2: this.p2.score,
      highScore: this.highScore,
      streak: this.p1.streak,
      maxStreak: this.p1.maxStreak,
      avgMs: this.p1.avgMs,
      bestMs: this.p1.bestMs === 999 ? 0 : this.p1.bestMs,
      lastMs: this.p1.lastMs,
      rank: this._calculateRank(this.p1.score, this.p1.avgMs),
      duelRound: this.duel.round,
      duelP1Wins: this.p1.roundsWon,
      duelP2Wins: this.p2.roundsWon
    };
  }

  destroy() {
    this.running = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this._unbindEvents();
    if (this.audioCtx && this.audioCtx.state !== 'closed') {
      try {
        this.audioCtx.close();
      } catch (_) {}
    }
  }

  // =========================================================================
  // INTERNAL STATE & GAMEPLAY LOGIC
  // =========================================================================

  _resetMatchState() {
    const p2Name =
      this.mode === '2p_local'
        ? 'Alquimista J2'
        : this.mode === 'online'
        ? 'Rival Online'
        : 'IA Jaguar QM';
    this.p1 = this._createPlayerState('Alquimista J1', '#f4c56c');
    this.p2 = this._createPlayerState(p2Name, '#e8a598');

    this.matchDuration = 45;
    this.timeLeft = this.matchDuration;
    this.orbs = [];
    this.particles = [];
    this.floatingTexts = [];
    this.spawnTimer = 0;
    this.slowMoTimer = 0;
    this.screenShake = 0;
    this.flashAlpha = 0;
    this.gameOver = false;

    this.duel = {
      round: 1,
      maxRounds: 5,
      phase: 'waiting',
      phaseTimer: 0,
      targetWaitDuration: 2.2 + Math.random() * 2.2,
      flashTimestamp: 0,
      aiTargetMs: this._getAiReactionMs(),
      aiTriggered: false,
      roundWinner: null,
      roundReason: '',
      history: []
    };
  }

  _getDifficultyParams() {
    if (this.difficulty === 'god') {
      return {
        orbLifetime: 0.92,
        spawnInterval: 0.42,
        maxOrbsPerSide: 5,
        aiReactionMin: 145,
        aiReactionMax: 215
      };
    }
    if (this.difficulty === 'fast') {
      return {
        orbLifetime: 1.22,
        spawnInterval: 0.56,
        maxOrbsPerSide: 4,
        aiReactionMin: 210,
        aiReactionMax: 310
      };
    }
    return {
      orbLifetime: 1.6,
      spawnInterval: 0.72,
      maxOrbsPerSide: 4,
      aiReactionMin: 295,
      aiReactionMax: 440
    };
  }

  _getAiReactionMs() {
    const params = this._getDifficultyParams();
    return Math.round(
      params.aiReactionMin + Math.random() * (params.aiReactionMax - params.aiReactionMin)
    );
  }

  _getSlotsForOwner(owner) {
    const isSplit = this.mode !== '1p';
    const topMargin = 128;
    const bottomMargin = 48;
    const usableH = Math.max(220, this.height - topMargin - bottomMargin);

    if (!isSplit) {
      // 3x3 Sacred Alchemical Grid centered
      const slots = [];
      const gridW = Math.min(480, this.width * 0.68);
      const startX = (this.width - gridW) / 2;
      const stepX = gridW / 2;
      const stepY = usableH / 2.3;
      const startY = topMargin + 32;

      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          const idx = row * 3 + col;
          slots.push({
            slotIndex: idx,
            x: Math.round(startX + col * stepX),
            y: Math.round(startY + row * stepY),
            keyLabel: KEY_GRID_1P[idx],
            altKey: KEY_GRID_1P_ALT[idx],
            owner: 'p1'
          });
        }
      }
      return slots;
    }

    // Split screen: 2 rows x 3 cols on Left (P1) and Right (P2/AI)
    const halfW = this.width / 2;
    const sideOffset = owner === 'p1' ? 0 : halfW;
    const keys = owner === 'p1' ? KEY_GRID_2P_LEFT : KEY_GRID_2P_RIGHT;
    const padX = Math.max(54, halfW * 0.17);
    const spanX = halfW - padX * 2;
    const stepX = spanX / 2;
    const startY = topMargin + 52;
    const stepY = Math.min(135, usableH * 0.45);

    const slots = [];
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 3; col++) {
        const idx = row * 3 + col;
        slots.push({
          slotIndex: idx,
          x: Math.round(sideOffset + padX + col * stepX),
          y: Math.round(startY + row * stepY),
          keyLabel: keys[idx],
          altKey: keys[idx],
          owner
        });
      }
    }
    return slots;
  }

  _pickRandomNote() {
    const totalWeight = NOTES_CATALOG.reduce((acc, n) => acc + n.weight, 0);
    let r = Math.random() * totalWeight;
    for (const note of NOTES_CATALOG) {
      if (r < note.weight) return note;
      r -= note.weight;
    }
    return NOTES_CATALOG[0];
  }

  _spawnInitialOrbs() {
    this.orbs = [];
    this._spawnOrbForOwner('p1');
    this._spawnOrbForOwner('p1');
    if (this.mode !== '1p') {
      this._spawnOrbForOwner('p2');
      this._spawnOrbForOwner('p2');
    }
  }

  _spawnOrbForOwner(owner) {
    const params = this._getDifficultyParams();
    const ownerOrbs = this.orbs.filter((o) => o.owner === owner);
    if (ownerOrbs.length >= params.maxOrbsPerSide) return;

    const slots = this._getSlotsForOwner(owner);
    const occupiedIndices = new Set(ownerOrbs.map((o) => o.slotIndex));
    const freeSlots = slots.filter((s) => !occupiedIndices.has(s.slotIndex));
    if (freeSlots.length === 0) return;

    const slot = freeSlots[Math.floor(Math.random() * freeSlots.length)];
    const note = this._pickRandomNote();

    // Progressive speed-up as time goes down
    const progressFactor = Math.max(0.68, 1 - ((this.matchDuration - this.timeLeft) / this.matchDuration) * 0.28);
    const slowMoBonus = this.slowMoTimer > 0 ? 1.35 : 1.0;
    const durationSec = (note.isTrap ? params.orbLifetime * 0.95 : params.orbLifetime) * progressFactor * slowMoBonus;

    const now = performance.now();
    const aiTriggerMs =
      owner === 'p2' && this.mode === 'vs_ai'
        ? this._getAiReactionMs() + Math.round(Math.random() * 140)
        : null;

    this.orbs.push({
      id: `${owner}_${now}_${Math.random()}`,
      owner,
      slotIndex: slot.slotIndex,
      x: slot.x,
      y: slot.y,
      radius: this.mode === '1p' ? 34 : 29,
      keyLabel: slot.keyLabel,
      altKey: slot.altKey,
      noteId: note.id,
      label: note.label,
      points: note.points,
      color: note.color,
      glow: note.glow,
      isTrap: Boolean(note.isTrap),
      spawnTime: now,
      durationMs: Math.round(durationSec * 1000),
      elapsedMs: 0,
      aiTriggerMs,
      aiWillClickTrap: note.isTrap && Math.random() < (this.difficulty === 'god' ? 0.03 : 0.1)
    });
  }

  _update(dt, now) {
    this.elapsedTime += dt;
    if (this.screenShake > 0) {
      this.screenShake = Math.max(0, this.screenShake - dt * 28);
    }
    if (this.flashAlpha > 0) {
      this.flashAlpha = Math.max(0, this.flashAlpha - dt * 2.2);
    }
    if (this.slowMoTimer > 0) {
      this.slowMoTimer = Math.max(0, this.slowMoTimer - dt);
    }

    // Update particles & floating texts
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += (p.gravity || 0) * dt;
      p.life -= dt;
      if (p.life <= 0) this.particles.splice(i, 1);
    }

    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.y += ft.vy * dt;
      ft.life -= dt;
      if (ft.life <= 0) this.floatingTexts.splice(i, 1);
    }

    if (this.subMode === 'destilacion') {
      this._updateDestilacion(dt, now);
    } else {
      this._updateDuel(dt, now);
    }
  }

  _updateDestilacion(dt, now) {
    this.timeLeft = Math.max(0, this.timeLeft - dt);
    if (this.timeLeft <= 0) {
      this._finishMatch();
      return;
    }

    const params = this._getDifficultyParams();
    this.spawnTimer += dt;
    if (this.spawnTimer >= params.spawnInterval) {
      this.spawnTimer = 0;
      this._spawnOrbForOwner('p1');
      if (this.mode !== '1p') {
        this._spawnOrbForOwner('p2');
      }
    }

    for (let i = this.orbs.length - 1; i >= 0; i--) {
      const orb = this.orbs[i];
      orb.elapsedMs = now - orb.spawnTime;

      // Check AI auto-reaction in vs_ai mode
      if (
        orb.owner === 'p2' &&
        this.mode === 'vs_ai' &&
        orb.aiTriggerMs !== null &&
        orb.elapsedMs >= orb.aiTriggerMs
      ) {
        if (!orb.isTrap || orb.aiWillClickTrap) {
          this._resolveOrbCapture(orb, this.p2, Math.round(orb.elapsedMs));
          continue;
        } else {
          orb.aiTriggerMs = null; // AI wisely ignores the smoke trap
        }
      }

      // Check orb expiration
      if (orb.elapsedMs >= orb.durationMs) {
        this.orbs.splice(i, 1);
        if (!orb.isTrap) {
          const player = orb.owner === 'p1' ? this.p1 : this.p2;
          player.misses += 1;
          player.streak = 0;
          this._addFloatingText(orb.x, orb.y, 'EVAPORADO', '#9988aa', 0.8);
        }
      }
    }
  }

  _resolveOrbCapture(orb, player, reactionMs, isRemote = false) {
    const idx = this.orbs.indexOf(orb);
    if (idx !== -1) {
      this.orbs.splice(idx, 1);
    }

    if (orb.isTrap) {
      // Hit bitter smoke trap!
      player.score = Math.max(0, player.score + orb.points);
      player.streak = 0;
      player.trapsHit += 1;
      player.lastVerdict = '¡HUMO AMARGO! -50';
      this.screenShake = 10;
      this.flashColor = '#a33b5c';
      this.flashAlpha = 0.35;
      this._spawnBurst(orb.x, orb.y, '#7a4988', 18);
      this._addFloatingText(orb.x, orb.y - 10, '¡HUMO AMARGO! -50', '#ff5c8a', 1.25);
      this._playSound('trap');
      this._emitScoreUpdate();
      return;
    }

    // Valid olfactory note captured!
    player.captures += 1;
    player.streak += 1;
    if (player.streak > player.maxStreak) player.maxStreak = player.streak;

    player.lastMs = reactionMs;
    player.totalMs += reactionMs;
    player.avgMs = Math.round(player.totalMs / player.captures);
    if (reactionMs < player.bestMs) {
      player.bestMs = reactionMs;
    }
    if (player === this.p1 && reactionMs < this.allTimeBestMs) {
      this.allTimeBestMs = reactionMs;
      this._saveNumber(STORAGE_KEY_BEST_MS, this.allTimeBestMs);
    }

    // Reaction speed multiplier & verdict
    let speedMultiplier = 1.0;
    let verdict = `${reactionMs} ms — DESTILADO`;
    let verdictColor = '#f4c56c';

    if (reactionMs <= 220) {
      speedMultiplier = 2.0;
      verdict = `¡${reactionMs} ms! — REFLEJO DE DIOS ★`;
      verdictColor = '#7ce8ff';
    } else if (reactionMs <= 340) {
      speedMultiplier = 1.5;
      verdict = `¡${reactionMs} ms! — RELÁMPAGO QM`;
      verdictColor = '#fff3a1';
    } else if (reactionMs <= 490) {
      speedMultiplier = 1.25;
      verdict = `¡${reactionMs} ms! — ALQUIMISTA VELOZ`;
      verdictColor = '#e8a598';
    }

    const streakBonus = Math.min(50, (player.streak - 1) * 5);
    const totalPoints = Math.round(orb.points * speedMultiplier + streakBonus);
    player.score += totalPoints;
    player.lastVerdict = verdict;

    if (orb.noteId === 'star') {
      this.slowMoTimer = 3.2;
      this.flashColor = '#fff4b8';
      this.flashAlpha = 0.28;
      this._playSound('star');
    } else {
      this._playSound('capture', reactionMs);
    }

    if (player === this.p1 && player.score > this.highScore) {
      this.highScore = player.score;
      this._saveNumber(STORAGE_KEY_HIGH, this.highScore);
    }

    this._spawnBurst(orb.x, orb.y, orb.color, 16);
    this._addFloatingText(orb.x, orb.y - 14, `+${totalPoints} (${reactionMs} ms)`, verdictColor, 1.15);
    if (reactionMs <= 300) {
      this._addFloatingText(orb.x, orb.y + 8, verdict.split('—')[1].trim(), '#ffffff', 1.0);
    }

    if (!isRemote && this.mode === 'online' && player === this.p1) {
      this._broadcastRemote('reflex_capture', {
        slotIndex: orb.slotIndex,
        points: totalPoints,
        score: this.p1.score,
        ms: reactionMs,
        avgMs: this.p1.avgMs,
        streak: this.p1.streak
      });
    }

    this._emitScoreUpdate();
  }

  // =========================================================================
  // MODE 2: DUELO RELAMPAGO ("EL RELAMPAGO DE DAVID" - 5 ROUNDS)
  // =========================================================================

  _startDuelRound(roundNum) {
    this.duel.round = roundNum;
    this.duel.phase = 'waiting';
    this.duel.phaseTimer = 0;
    this.duel.targetWaitDuration = 1.8 + Math.random() * 2.7;
    this.duel.flashTimestamp = 0;
    this.duel.aiTargetMs = this._getAiReactionMs();
    this.duel.aiTriggered = false;
    this.duel.roundWinner = null;
    this.duel.roundReason = '';
    this.p1.duelCurrentMs = null;
    this.p2.duelCurrentMs = null;
    this.p1.falseStart = false;
    this.p2.falseStart = false;
  }

  _updateDuel(dt, now) {
    this.duel.phaseTimer += dt;

    if (this.duel.phase === 'waiting') {
      if (this.duel.phaseTimer >= this.duel.targetWaitDuration) {
        // Trigger the Golden Lightning of Citlalli!
        this.duel.phase = 'flash';
        this.duel.phaseTimer = 0;
        this.duel.flashTimestamp = now;
        this.flashColor = '#fff7c2';
        this.flashAlpha = 0.85;
        this.screenShake = 8;
        this._playSound('lightning');
        this._spawnBurst(this.width / 2, this.height * 0.44, '#f4c56c', 36);
      }
    } else if (this.duel.phase === 'flash') {
      const elapsedSinceFlashMs = now - this.duel.flashTimestamp;

      // AI reaction in 1p or vs_ai
      if (
        (this.mode === '1p' || this.mode === 'vs_ai') &&
        !this.duel.aiTriggered &&
        elapsedSinceFlashMs >= this.duel.aiTargetMs
      ) {
        this.duel.aiTriggered = true;
        this._registerDuelReaction('p2', Math.round(this.duel.aiTargetMs));
      }

      // Timeout if nobody reacts in 2000ms
      if (elapsedSinceFlashMs >= 2000) {
        this._concludeDuelRound('none', 'TIEMPO AGOTADO — LA ESTRELLA SE DESVANECIÓ');
      }
    } else if (this.duel.phase === 'round_result') {
      if (this.duel.phaseTimer >= 2.5) {
        if (this.duel.round < this.duel.maxRounds) {
          this._startDuelRound(this.duel.round + 1);
        } else {
          this.duel.phase = 'match_over';
          this._finishMatch();
        }
      }
    }
  }

  _triggerDuelInput(who) {
    if (this.gameOver) {
      this.start();
      return;
    }
    if (this.duel.phase === 'waiting') {
      // False start!
      const offender = who === 'p1' ? this.p1 : this.p2;
      const other = who === 'p1' ? 'p2' : 'p1';
      offender.falseStart = true;
      offender.score = Math.max(0, offender.score - 100);
      this.screenShake = 12;
      this.flashColor = '#ff3b5c';
      this.flashAlpha = 0.55;
      this._playSound('trap');
      this._concludeDuelRound(
        other,
        `¡SALIDA EN FALSO DE ${offender.name.toUpperCase()}! (-100 PTS)`
      );
      return;
    }

    if (this.duel.phase === 'flash') {
      const reactionMs = Math.max(12, Math.round(performance.now() - this.duel.flashTimestamp));
      this._registerDuelReaction(who, reactionMs);
    }
  }

  _registerDuelReaction(who, reactionMs, isRemote = false) {
    if (this.duel.phase !== 'flash') return;

    const player = who === 'p1' ? this.p1 : this.p2;
    player.duelCurrentMs = reactionMs;
    player.captures += 1;
    player.lastMs = reactionMs;
    player.totalMs += reactionMs;
    player.avgMs = Math.round(player.totalMs / player.captures);
    if (reactionMs < player.bestMs) player.bestMs = reactionMs;

    if (who === 'p1' && reactionMs < this.allTimeBestMs) {
      this.allTimeBestMs = reactionMs;
      this._saveNumber(STORAGE_KEY_BEST_MS, this.allTimeBestMs);
    }

    if (!isRemote && this.mode === 'online' && who === 'p1') {
      this._broadcastRemote('reflex_duel_strike', { ms: reactionMs, round: this.duel.round });
    }

    // First valid reaction wins the round immediately!
    const pointsEarned = Math.max(120, Math.round(450 - reactionMs));
    player.score += pointsEarned;
    player.streak += 1;
    if (player.streak > player.maxStreak) player.maxStreak = player.streak;

    if (who === 'p1' && player.score > this.highScore) {
      this.highScore = player.score;
      this._saveNumber(STORAGE_KEY_HIGH, this.highScore);
    }

    const tag =
      reactionMs <= 185
        ? '¡REFLEJO DE DIOS!'
        : reactionMs <= 250
        ? '¡RELÁMPAGO PURO!'
        : '¡IMPACTO ESTELAR!';

    this._playSound('star');
    this._concludeDuelRound(
      who,
      `${player.name.toUpperCase()} GANA LA RONDA EN ¡${reactionMs} ms! (${tag})`
    );
  }

  _concludeDuelRound(winnerKey, reasonText) {
    this.duel.phase = 'round_result';
    this.duel.phaseTimer = 0;
    this.duel.roundWinner = winnerKey;
    this.duel.roundReason = reasonText;

    if (winnerKey === 'p1') this.p1.roundsWon += 1;
    else if (winnerKey === 'p2') this.p2.roundsWon += 1;

    this.duel.history.push({
      round: this.duel.round,
      winner: winnerKey,
      p1Ms: this.p1.duelCurrentMs,
      p2Ms: this.p2.duelCurrentMs
    });

    this._emitScoreUpdate();
  }

  _finishMatch() {
    this.gameOver = true;
    this._playSound('victory');

    let winner = 'Jugador 1';
    if (this.subMode === 'duelo') {
      if (this.p2.roundsWon > this.p1.roundsWon) winner = this.p2.name;
      else if (this.p2.roundsWon === this.p1.roundsWon && this.p2.score > this.p1.score) {
        winner = this.p2.name;
      }
    } else if (this.mode !== '1p') {
      if (this.p2.score > this.p1.score) winner = this.p2.name;
    }

    const payload = {
      game: 'reflex',
      subMode: this.subMode,
      mode: this.mode,
      scenario: this.scenario,
      winner,
      score: this.p1.score,
      scoreP1: this.p1.score,
      scoreP2: this.p2.score,
      highScore: this.highScore,
      avgMs: this.p1.avgMs,
      bestMs: this.p1.bestMs === 999 ? 0 : this.p1.bestMs,
      rank: this._calculateRank(this.p1.score, this.p1.avgMs)
    };

    if (typeof this.callbacks.onGameOver === 'function') {
      this.callbacks.onGameOver(payload);
    }
    if (typeof this.callbacks.onEnd === 'function') {
      this.callbacks.onEnd(payload);
    }
    this._emitStateChange();
  }

  _calculateRank(score, avgMs) {
    if (score >= 1600 || (avgMs > 0 && avgMs <= 210 && score >= 800)) {
      return 'Citlalli Divina ★ QM';
    }
    if (score >= 1100 || (avgMs > 0 && avgMs <= 260 && score >= 500)) {
      return 'Jaguar Estelar de Oro';
    }
    if (score >= 650) {
      return 'Maestro Alquimista';
    }
    if (score >= 300) {
      return 'Destilador Lunar';
    }
    return 'Aprendiz del Ámbar';
  }

  // =========================================================================
  // INPUT HANDLERS (KEYBOARD, MOUSE, TOUCH)
  // =========================================================================

  _handleKeyDown(e) {
    if (!this.running) return;

    const key = e.key.toUpperCase();
    if (key === 'ESCAPE' || key === 'P') {
      this.togglePause();
      return;
    }
    if (key === 'TAB' || key === 'M') {
      e.preventDefault();
      this.toggleSubMode();
      return;
    }

    if (this.gameOver) {
      if (key === ' ' || key === 'ENTER') {
        e.preventDefault();
        this.start();
      }
      return;
    }

    if (this.paused) return;

    if (this.subMode === 'duelo') {
      if (key === 'A' || key === ' ' || key === 'W') {
        e.preventDefault();
        this._triggerDuelInput('p1');
      } else if (key === 'L' || key === 'ENTER' || key === 'ARROWUP') {
        e.preventDefault();
        if (this.mode === '2p_local') {
          this._triggerDuelInput('p2');
        } else {
          this._triggerDuelInput('p1');
        }
      }
      return;
    }

    // Mode 1: Destilacion hotkeys
    const now = performance.now();
    for (const orb of this.orbs) {
      if (orb.keyLabel === key || orb.altKey === key) {
        if (orb.owner === 'p2' && this.mode !== '2p_local') continue;
        const player = orb.owner === 'p1' ? this.p1 : this.p2;
        const ms = Math.max(12, Math.round(now - orb.spawnTime));
        this._resolveOrbCapture(orb, player, ms);
        break;
      }
    }
  }

  _handlePointerDown(e) {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.width / (rect.width || this.width);
    const scaleY = this.height / (rect.height || this.height);
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    // Check Top HUD Sub-Mode Toggle Button
    const btn = this.hudToggleButtonRect;
    if (x >= btn.x && x <= btn.x + btn.w && y >= btn.y && y <= btn.y + btn.h) {
      this.toggleSubMode();
      return;
    }

    if (!this.running || this.gameOver) {
      this.start();
      return;
    }

    if (this.paused) {
      this.resume();
      return;
    }

    if (this.subMode === 'duelo') {
      if (e.button === 2 || (this.mode === '2p_local' && x > this.width / 2)) {
        this._triggerDuelInput('p2');
      } else {
        this._triggerDuelInput('p1');
      }
      return;
    }

    // Check orb hit in Destilacion mode
    const now = performance.now();
    for (let i = this.orbs.length - 1; i >= 0; i--) {
      const orb = this.orbs[i];
      const dx = x - orb.x;
      const dy = y - orb.y;
      if (dx * dx + dy * dy <= (orb.radius + 14) * (orb.radius + 14)) {
        if (orb.owner === 'p2' && this.mode === 'vs_ai') continue;
        const player = orb.owner === 'p1' ? this.p1 : this.p2;
        const ms = Math.max(12, Math.round(now - orb.spawnTime));
        this._resolveOrbCapture(orb, player, ms);
        return;
      }
    }
  }

  // =========================================================================
  // RENDERING (LUXURY PIXEL ART & SCENARIOS)
  // =========================================================================

  _renderFrame(now) {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const theme = SCENARIO_THEMES[this.scenario] || SCENARIO_THEMES.hidalgo;

    ctx.save();
    if (this.screenShake > 0) {
      const sx = (Math.random() - 0.5) * this.screenShake;
      const sy = (Math.random() - 0.5) * this.screenShake;
      ctx.translate(sx, sy);
    }

    this._drawScenarioBackground(ctx, theme, now);

    if (this.subMode === 'destilacion') {
      this._drawDestilacionScene(ctx, theme, now);
    } else {
      this._drawDuelScene(ctx, theme, now);
    }

    this._drawParticlesAndTexts(ctx);
    this._drawTopHud(ctx, theme);

    if (this.flashAlpha > 0) {
      ctx.fillStyle = this.flashColor;
      ctx.globalAlpha = this.flashAlpha;
      ctx.fillRect(0, 0, this.width, this.height);
      ctx.globalAlpha = 1;
    }

    if (this.paused) {
      this._drawOverlayModal(
        ctx,
        'PAUSA ALQUÍMICA',
        'Presiona P / ESC o toca la pantalla para continuar',
        theme
      );
    } else if (this.gameOver) {
      this._drawGameOverModal(ctx, theme);
    }

    ctx.restore();
  }

  _drawScenarioBackground(ctx, theme, now) {
    // Integration with CitlalliVFX engine (drawScenarioBackground or drawBackground)
    let drewExternalBg = false;
    if (typeof window !== 'undefined' && window.CitlalliVFX) {
      try {
        if (typeof window.CitlalliVFX.drawScenarioBackground === 'function') {
          window.CitlalliVFX.drawScenarioBackground(ctx, this.width, this.height, this.scenario, now, now * 0.02);
          drewExternalBg = true;
        } else if (typeof window.CitlalliVFX.drawBackground === 'function') {
          window.CitlalliVFX.drawBackground(ctx, this.width, this.height, this.scenario, now * 0.001);
          drewExternalBg = true;
        }
      } catch (_) {}
    }

    if (!drewExternalBg) {
      // Fallback Pixel Art Sky Gradient
      const grad = ctx.createLinearGradient(0, 0, 0, this.height);
      grad.addColorStop(0, theme.skyTop);
      grad.addColorStop(0.7, theme.skyBottom);
      grad.addColorStop(1, theme.tableTop);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, this.width, this.height);

      // Twinkling stars
      for (const s of this.bgStars) {
        const alpha = 0.35 + 0.65 * Math.abs(Math.sin(now * 0.001 * s.speed + s.phase));
        ctx.fillStyle = theme.starColor;
        ctx.globalAlpha = alpha;
        ctx.fillRect(Math.floor(s.x), Math.floor(s.y), s.size, s.size);
      }
      ctx.globalAlpha = 1;
    }

    // Distant silhouette & luxury alchemical table
    const horizonY = Math.floor(this.height * 0.24);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.fillRect(0, horizonY, this.width, this.height - horizonY);

    // Pre-Hispanic Fretwork (Grecas Doradas) along the horizon bar
    ctx.fillStyle = theme.tableBorder;
    ctx.fillRect(0, horizonY, this.width, 3);
    for (let x = 0; x < this.width; x += 32) {
      ctx.fillRect(x + 4, horizonY - 6, 12, 6);
      ctx.fillRect(x + 8, horizonY - 10, 4, 4);
    }

    // Split divider in 2P / VS AI / Online
    if (this.mode !== '1p' && this.subMode === 'destilacion') {
      ctx.save();
      ctx.strokeStyle = theme.tableBorder;
      ctx.globalAlpha = 0.45;
      ctx.setLineDash([6, 6]);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(this.width / 2, horizonY);
      ctx.lineTo(this.width / 2, this.height);
      ctx.stroke();
      ctx.restore();
    }
  }

  _drawDestilacionScene(ctx, theme, now) {
    // Draw faint sacred geometry circles at all slots
    const slotsP1 = this._getSlotsForOwner('p1');
    const allSlots =
      this.mode === '1p' ? slotsP1 : [...slotsP1, ...this._getSlotsForOwner('p2')];

    for (const slot of allSlots) {
      ctx.save();
      ctx.strokeStyle = 'rgba(244, 197, 108, 0.16)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(slot.x, slot.y, this.mode === '1p' ? 34 : 29, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = 'rgba(244, 197, 108, 0.28)';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`[${slot.keyLabel}]`, slot.x, slot.y + 4);
      ctx.restore();
    }

    // Draw active alchemical orbs
    for (const orb of this.orbs) {
      const progress = Math.min(1, orb.elapsedMs / orb.durationMs);
      const remainingRatio = Math.max(0, 1 - progress);
      const pulse = 1 + 0.06 * Math.sin(now * 0.015);
      const r = orb.radius * pulse;

      ctx.save();

      // Outer closing time ring
      const ringRadius = orb.radius + 4 + remainingRatio * 18;
      ctx.beginPath();
      ctx.arc(
        orb.x,
        orb.y,
        ringRadius,
        -Math.PI / 2,
        -Math.PI / 2 + Math.PI * 2 * remainingRatio
      );
      ctx.strokeStyle = orb.isTrap
        ? '#ff4769'
        : remainingRatio < 0.3
        ? '#ff6b6b'
        : orb.glow;
      ctx.lineWidth = 3;
      ctx.stroke();

      // Orb body
      ctx.beginPath();
      ctx.arc(orb.x, orb.y, r, 0, Math.PI * 2);
      ctx.fillStyle = orb.isTrap ? 'rgba(48, 20, 46, 0.92)' : 'rgba(20, 16, 38, 0.92)';
      ctx.fill();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = orb.color;
      ctx.stroke();

      // Pixel-art note icon inside orb
      this._drawNotePixelIcon(ctx, orb.noteId, orb.x, orb.y - 2, orb.color);

      // Key badge & live ms counter
      ctx.fillStyle = '#090714';
      ctx.fillRect(orb.x - 14, orb.y + orb.radius - 8, 28, 15);
      ctx.strokeStyle = orb.color;
      ctx.lineWidth = 1;
      ctx.strokeRect(orb.x - 14, orb.y + orb.radius - 8, 28, 15);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(orb.keyLabel, orb.x, orb.y + orb.radius + 3);

      ctx.restore();
    }

    // Bottom Reaction Telemetry Bar
    ctx.fillStyle = 'rgba(8, 6, 18, 0.86)';
    ctx.fillRect(0, this.height - 38, this.width, 38);
    ctx.fillStyle = theme.tableBorder;
    ctx.fillRect(0, this.height - 38, this.width, 2);

    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#f4c56c';
    const p1Last = this.p1.lastMs ? `${this.p1.lastMs} ms` : '-- ms';
    const p1Avg = this.p1.avgMs ? `${this.p1.avgMs} ms` : '-- ms';
    ctx.fillText(
      `J1 ÚLTIMO: ${p1Last} | PROMEDIO: ${p1Avg} | RACHA: x${this.p1.streak}`,
      16,
      this.height - 14
    );

    if (this.mode !== '1p') {
      ctx.textAlign = 'right';
      ctx.fillStyle = '#e8a598';
      const p2Last = this.p2.lastMs ? `${this.p2.lastMs} ms` : '-- ms';
      const p2Avg = this.p2.avgMs ? `${this.p2.avgMs} ms` : '-- ms';
      ctx.fillText(
        `${this.p2.name.toUpperCase()} ÚLT: ${p2Last} | PROM: ${p2Avg}`,
        this.width - 16,
        this.height - 14
      );
    } else {
      ctx.textAlign = 'right';
      ctx.fillStyle = '#d8c8ff';
      ctx.fillText(
        this.p1.lastVerdict || 'ATRAPAR ORBES DORADOS (1-9 / CLIC) • EVITA EL HUMO AMARGO',
        this.width - 16,
        this.height - 14
      );
    }
  }

  _drawDuelScene(ctx, theme, now) {
    const cx = this.width / 2;
    const cy = this.height * 0.52;

    // Round progress bubbles
    for (let r = 1; r <= this.duel.maxRounds; r++) {
      const bx = cx - (this.duel.maxRounds - 1) * 22 + (r - 1) * 44;
      const by = 112;
      const hist = this.duel.history.find((h) => h.round === r);

      ctx.beginPath();
      ctx.arc(bx, by, 13, 0, Math.PI * 2);
      if (hist) {
        ctx.fillStyle =
          hist.winner === 'p1' ? '#f4c56c' : hist.winner === 'p2' ? '#e8a598' : '#555566';
      } else if (r === this.duel.round) {
        ctx.fillStyle = 'rgba(244, 197, 108, 0.35)';
      } else {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      }
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#f4c56c';
      ctx.stroke();

      ctx.fillStyle = hist ? '#090714' : '#ffffff';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(String(r), bx, by + 4);
    }

    if (this.duel.phase === 'waiting') {
      // Tense waiting aura
      const pulseR = 62 + Math.sin(now * 0.006) * 8;
      ctx.strokeStyle = 'rgba(244, 197, 108, 0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, pulseR, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#f4c56c';
      ctx.font = 'bold 20px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('SILENCIO EN EL CIELO DE HIDALGO...', cx, cy - 12);

      ctx.fillStyle = '#e8a598';
      ctx.font = 'bold 14px monospace';
      ctx.fillText('ESPERA EL RELÁMPAGO DE LA ESTRELLA CITLALLI', cx, cy + 16);

      ctx.fillStyle = '#ff6b8b';
      ctx.font = '12px monospace';
      ctx.fillText('¡No presiones antes del destello o habrá Salida en Falso!', cx, cy + 44);
    } else if (this.duel.phase === 'flash') {
      // Lightning bolt & Giant 8-pointed Star of Citlalli!
      ctx.save();
      ctx.strokeStyle = '#fff8bd';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(cx - 20, 80);
      ctx.lineTo(cx + 15, cy - 60);
      ctx.lineTo(cx - 10, cy - 40);
      ctx.lineTo(cx + 8, cy);
      ctx.stroke();

      this._drawNotePixelIcon(ctx, 'star', cx, cy - 10, '#fff7b0', 3.2);

      const liveMs = Math.round(now - this.duel.flashTimestamp);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 26px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`¡REACCIONA AHORA! (${liveMs} ms)`, cx, cy + 75);
      ctx.restore();
    } else if (this.duel.phase === 'round_result') {
      this._drawNotePixelIcon(ctx, 'bottle', cx, cy - 28, '#f4c56c', 2.4);
      ctx.fillStyle = '#fff5b8';
      ctx.font = 'bold 17px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(this.duel.roundReason, cx, cy + 38);

      const p1Text = this.p1.duelCurrentMs ? `${this.p1.duelCurrentMs} ms` : '--';
      const p2Text = this.p2.duelCurrentMs ? `${this.p2.duelCurrentMs} ms` : '--';
      ctx.fillStyle = '#7ce8ff';
      ctx.font = 'bold 14px monospace';
      ctx.fillText(
        `J1: ${p1Text}   vs   ${this.p2.name.toUpperCase()}: ${p2Text}`,
        cx,
        cy + 66
      );
    }

    // Bottom instructions for Duel
    ctx.fillStyle = 'rgba(8, 6, 18, 0.88)';
    ctx.fillRect(0, this.height - 38, this.width, 38);
    ctx.fillStyle = theme.tableBorder;
    ctx.fillRect(0, this.height - 38, this.width, 2);

    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#f4c56c';
    ctx.fillText(
      'J1: TECLA [A] / [ESPACIO] / CLIC IZQ   •   J2: TECLA [L] / [ENTER] / CLIC DER',
      cx,
      this.height - 14
    );
  }

  _drawNotePixelIcon(ctx, noteId, x, y, color, scale = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    if (noteId === 'star') {
      // 8-Pointed Star of Citlalli
      ctx.fillStyle = color;
      ctx.fillRect(-2, -14, 4, 28);
      ctx.fillRect(-14, -2, 28, 4);
      ctx.fillRect(-9, -9, 18, 18);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-4, -4, 8, 8);
    } else if (noteId === 'bottle') {
      // Faceted Citlalli Perfume Bottle with QM charm
      ctx.fillStyle = '#e8a598';
      ctx.fillRect(-5, -15, 10, 5); // Rose-gold cap
      ctx.fillStyle = '#f4c56c';
      ctx.fillRect(-2, -10, 4, 3); // Neck
      ctx.fillStyle = color;
      ctx.fillRect(-10, -7, 20, 20); // Crystal body
      ctx.fillStyle = '#090714';
      ctx.fillRect(-6, -2, 12, 8); // Label
      ctx.fillStyle = '#f4c56c';
      ctx.fillRect(7, -8, 6, 6); // QM Round Medallion
    } else if (noteId === 'mandarin') {
      ctx.fillStyle = '#ff9436';
      ctx.fillRect(-10, -6, 20, 12);
      ctx.fillRect(-6, -10, 12, 4);
      ctx.fillStyle = '#ffe0b2';
      ctx.fillRect(-6, -3, 4, 6);
      ctx.fillRect(2, -3, 4, 6);
    } else if (noteId === 'rose') {
      ctx.fillStyle = '#ff5c8a';
      ctx.fillRect(-8, -8, 16, 14);
      ctx.fillStyle = '#ff9ebb';
      ctx.fillRect(-4, -4, 8, 6);
      ctx.fillStyle = '#4caf50';
      ctx.fillRect(-2, 6, 4, 6);
    } else if (noteId === 'jasmine') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-3, -10, 6, 20);
      ctx.fillRect(-10, -3, 20, 6);
      ctx.fillStyle = '#f4c56c';
      ctx.fillRect(-3, -3, 6, 6);
    } else if (noteId === 'vanilla') {
      ctx.fillStyle = '#ffe082';
      ctx.fillRect(-9, -9, 18, 6);
      ctx.fillRect(-3, -11, 6, 22);
      ctx.fillStyle = '#ffae19';
      ctx.fillRect(-3, -3, 6, 6);
    } else if (noteId === 'amber') {
      ctx.fillStyle = '#ffae19';
      ctx.fillRect(-4, -12, 8, 4);
      ctx.fillRect(-8, -8, 16, 16);
      ctx.fillRect(-4, 8, 8, 4);
      ctx.fillStyle = '#fff3a1';
      ctx.fillRect(-4, -4, 4, 6);
    } else if (noteId === 'smoke') {
      // Bitter smoke cloud trap
      ctx.fillStyle = '#6e5678';
      ctx.fillRect(-12, -6, 24, 14);
      ctx.fillRect(-8, -11, 16, 6);
      ctx.fillStyle = '#ff4769';
      ctx.fillRect(-6, -3, 4, 4);
      ctx.fillRect(2, -3, 4, 4);
      ctx.fillRect(-4, 4, 8, 2);
    }

    ctx.restore();
  }

  _drawTopHud(ctx, theme) {
    // Top translucent luxury banner
    ctx.fillStyle = 'rgba(7, 6, 18, 0.9)';
    ctx.fillRect(0, 0, this.width, 78);
    ctx.fillStyle = theme.tableBorder;
    ctx.fillRect(0, 76, this.width, 2);

    // Left: Player 1 Score & Best/Avg ms
    ctx.textAlign = 'left';
    ctx.fillStyle = '#f4c56c';
    ctx.font = 'bold 14px monospace';
    ctx.fillText(`J1: ${this.p1.score} PTS`, 16, 24);

    ctx.fillStyle = '#e8a598';
    ctx.font = '11px monospace';
    const bestLabel = this.p1.bestMs < 999 ? `${this.p1.bestMs} ms` : '-- ms';
    const avgLabel = this.p1.avgMs > 0 ? `${this.p1.avgMs} ms` : '-- ms';
    ctx.fillText(`MEJOR: ${bestLabel} | PROM: ${avgLabel}`, 16, 44);
    ctx.fillStyle = '#a89cc8';
    ctx.fillText(`RANGO: ${this._calculateRank(this.p1.score, this.p1.avgMs)}`, 16, 62);

    // Center: Timer or Duel Score + Interactive Sub-Mode Switch Button
    const cx = this.width / 2;
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px monospace';
    if (this.subMode === 'destilacion') {
      ctx.fillText(`⏱ ${Math.ceil(this.timeLeft)}s`, cx, 24);
    } else {
      ctx.fillText(
        `RONDA ${this.duel.round}/${this.duel.maxRounds} (${this.p1.roundsWon} - ${this.p2.roundsWon})`,
        cx,
        24
      );
    }

    // Sub-Mode Switcher Button inside Canvas HUD
    const btnW = 286;
    const btnH = 26;
    const btnX = Math.round(cx - btnW / 2);
    const btnY = 38;
    this.hudToggleButtonRect = { x: btnX, y: btnY, w: btnW, h: btnH };

    ctx.fillStyle = '#1b1433';
    ctx.fillRect(btnX, btnY, btnW, btnH);
    ctx.strokeStyle = '#f4c56c';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(btnX, btnY, btnW, btnH);

    ctx.fillStyle = '#fff5b8';
    ctx.font = 'bold 11px monospace';
    const switchLabel =
      this.subMode === 'destilacion'
        ? '⚗️ DESTILACIÓN  ⇄  [CAMBIAR A DUELO ms]'
        : '⚡ DUELO ms PURO  ⇄  [CAMBIAR A DESTILACIÓN]';
    ctx.fillText(switchLabel, cx, btnY + 17);

    // Right: P2 / AI Score or High Score
    ctx.textAlign = 'right';
    if (this.mode !== '1p' || this.subMode === 'duelo') {
      ctx.fillStyle = '#e8a598';
      ctx.font = 'bold 14px monospace';
      ctx.fillText(`${this.p2.name}: ${this.p2.score} PTS`, this.width - 16, 24);
      ctx.fillStyle = '#d8c8ff';
      ctx.font = '11px monospace';
      const p2Best = this.p2.bestMs < 999 ? `${this.p2.bestMs} ms` : '-- ms';
      ctx.fillText(`MEJOR: ${p2Best} | RACHA: x${this.p2.streak}`, this.width - 16, 44);
      ctx.fillStyle = '#f4c56c';
      ctx.fillText(`RÉCORD: ${this.highScore}`, this.width - 16, 62);
    } else {
      ctx.fillStyle = '#f4c56c';
      ctx.font = 'bold 14px monospace';
      ctx.fillText(`RÉCORD: ${this.highScore} PTS`, this.width - 16, 24);
      ctx.fillStyle = '#7ce8ff';
      ctx.font = '11px monospace';
      const recordMs = this.allTimeBestMs < 999 ? `${this.allTimeBestMs} ms` : '-- ms';
      ctx.fillText(`RÉCORD REFLEJO: ${recordMs}`, this.width - 16, 44);
      ctx.fillStyle = '#e8a598';
      ctx.fillText(`ESCENARIO: ${theme.name.toUpperCase()}`, this.width - 16, 62);
    }
  }

  _drawParticlesAndTexts(ctx) {
    for (const p of this.particles) {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
      ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
    }
    ctx.globalAlpha = 1;

    for (const ft of this.floatingTexts) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, ft.life / ft.maxLife));
      ctx.font = 'bold 13px monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#000000';
      ctx.fillText(ft.text, ft.x + 1, ft.y + 1);
      ctx.fillStyle = ft.color;
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.restore();
    }
  }

  _drawOverlayModal(ctx, title, subtitle, theme) {
    ctx.fillStyle = 'rgba(5, 4, 14, 0.78)';
    ctx.fillRect(0, 0, this.width, this.height);

    const mw = Math.min(460, this.width - 40);
    const mh = 170;
    const mx = (this.width - mw) / 2;
    const my = (this.height - mh) / 2;

    ctx.fillStyle = '#120e24';
    ctx.fillRect(mx, my, mw, mh);
    ctx.strokeStyle = theme.tableBorder;
    ctx.lineWidth = 3;
    ctx.strokeRect(mx, my, mw, mh);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#f4c56c';
    ctx.font = 'bold 22px monospace';
    ctx.fillText(title, this.width / 2, my + 65);

    ctx.fillStyle = '#ffffff';
    ctx.font = '13px monospace';
    ctx.fillText(subtitle, this.width / 2, my + 110);
  }

  _drawGameOverModal(ctx, theme) {
    ctx.fillStyle = 'rgba(5, 4, 14, 0.84)';
    ctx.fillRect(0, 0, this.width, this.height);

    const mw = Math.min(520, this.width - 32);
    const mh = 260;
    const mx = (this.width - mw) / 2;
    const my = (this.height - mh) / 2;

    ctx.fillStyle = '#120e26';
    ctx.fillRect(mx, my, mw, mh);
    ctx.strokeStyle = theme.tableBorder;
    ctx.lineWidth = 3;
    ctx.strokeRect(mx, my, mw, mh);

    const cx = this.width / 2;
    ctx.textAlign = 'center';
    ctx.fillStyle = '#f4c56c';
    ctx.font = 'bold 20px monospace';
    ctx.fillText('★ DESTILACIÓN DE CITLALLI COMPLETADA ★', cx, my + 42);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px monospace';
    ctx.fillText(
      `PUNTUACIÓN J1: ${this.p1.score} PTS  |  RANGO: ${this._calculateRank(this.p1.score, this.p1.avgMs)}`,
      cx,
      my + 82
    );

    const bestLabel = this.p1.bestMs < 999 ? `${this.p1.bestMs} ms` : '-- ms';
    const avgLabel = this.p1.avgMs > 0 ? `${this.p1.avgMs} ms` : '-- ms';
    ctx.fillStyle = '#7ce8ff';
    ctx.font = 'bold 14px monospace';
    ctx.fillText(
      `MEJOR REFLEJO: ${bestLabel}   •   PROMEDIO: ${avgLabel}`,
      cx,
      my + 114
    );

    if (this.mode !== '1p' || this.subMode === 'duelo') {
      ctx.fillStyle = '#e8a598';
      ctx.font = '13px monospace';
      ctx.fillText(
        `${this.p2.name}: ${this.p2.score} PTS (Promedio: ${this.p2.avgMs || '--'} ms)`,
        cx,
        my + 146
      );
    }

    ctx.fillStyle = '#fff5b8';
    ctx.font = 'bold 13px monospace';
    ctx.fillText(
      'Presiona [ESPACIO] / [ENTER] o haz CLIC para jugar de nuevo',
      cx,
      my + 215
    );
  }

  // =========================================================================
  // VFX & AUDIO HELPERS
  // =========================================================================

  _spawnBurst(x, y, color, count = 14) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
      const speed = 40 + Math.random() * 130;
      const life = 0.35 + Math.random() * 0.4;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        gravity: 140,
        color,
        size: Math.random() < 0.4 ? 4 : 3,
        life,
        maxLife: life
      });
    }
  }

  _addFloatingText(x, y, text, color = '#f4c56c', duration = 1.0) {
    this.floatingTexts.push({
      x,
      y,
      vy: -38,
      text,
      color,
      life: duration,
      maxLife: duration
    });
  }

  _playSound(type, reactionMs = 300) {
    // 1. Try global CitlalliAudio engine if available
    if (typeof window !== 'undefined' && window.CitlalliAudio) {
      try {
        const audio = window.CitlalliAudio;
        const fn = audio.playSFX || audio.playSfx;
        if (typeof fn === 'function') {
          const sfxMap = {
            capture: 'reflex_hit',
            star: 'reflex_flash',
            lightning: 'reflex_flash',
            trap: 'hit',
            victory: 'victory',
            start: 'click'
          };
          fn.call(audio, sfxMap[type] || type);
          return;
        }
      } catch (_) {}
    }

    // 2. Built-in Chiptune WebAudio Synthesizer Fallback
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      if (!this.audioCtx) this.audioCtx = new AudioContextClass();
      if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      if (type === 'capture') {
        osc.type = 'triangle';
        const baseFreq = reactionMs <= 220 ? 880 : reactionMs <= 350 ? 660 : 523.25;
        osc.frequency.setValueAtTime(baseFreq, now);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.11);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'star' || type === 'lightning') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now);
        osc.frequency.exponentialRampToValueAtTime(1174.66, now + 0.22);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
        osc.start(now);
        osc.stop(now + 0.24);
      } else if (type === 'trap') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(190, now);
        osc.frequency.linearRampToValueAtTime(95, now + 0.22);
        gain.gain.setValueAtTime(0.14, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.23);
        osc.start(now);
        osc.stop(now + 0.23);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(660, now + 0.15);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
        osc.start(now);
        osc.stop(now + 0.16);
      }
    } catch (_) {}
  }

  _emitScoreUpdate() {
    const state = this.getState();
    if (typeof this.callbacks.onScore === 'function') this.callbacks.onScore(state);
    if (typeof this.callbacks.onScoreUpdate === 'function') this.callbacks.onScoreUpdate(state);
    if (typeof this.callbacks.onUpdate === 'function') this.callbacks.onUpdate(state);
  }

  _emitStateChange() {
    if (typeof this.callbacks.onStateChange === 'function') {
      this.callbacks.onStateChange(this.getState());
    }
  }

  _broadcastRemote(type, payload) {
    const evt = { type, payload, score: payload?.score ?? this.p1.score, timestamp: Date.now() };
    if (typeof this.callbacks.onBroadcastState === 'function') {
      this.callbacks.onBroadcastState(evt);
    } else if (typeof this.callbacks.onRemoteBroadcast === 'function') {
      this.callbacks.onRemoteBroadcast(evt);
    } else if (typeof this.callbacks.onNetworkEvent === 'function') {
      this.callbacks.onNetworkEvent(evt);
    } else if (typeof this.callbacks.sendRemoteEvent === 'function') {
      this.callbacks.sendRemoteEvent(evt);
    }
  }
}

if (typeof window !== 'undefined') {
  window.CitlalliGames = window.CitlalliGames || {};
  window.CitlalliGames.reflex = ReflexGame;
}

export default ReflexGame;
