/**
 * CITLALLI ARCADE — JUEGO 4: FLAPPY CITLALLI ("EL LÍMITE SON LAS ESTRELLAS")
 * Archivo: src/games/flappy/flappy-game.js
 * 100% Modular y Desacoplado (Regla de Oro)
 *
 * Características Principales:
 *  - Personaje: Frasco Alado de CITLALLI (cristal facetado, tapa oro rosa, dije redondo QM
 *    y alas pixel art de luz dorada) con estela de partículas de perfume oro rosa y ámbar.
 *  - Obstáculos: Columnas de Mármol Negro y Oro con Grecas Prehispánicas y Cabezas de
 *    Jaguar Dorado esculpidas en los extremos.
 *  - Ítems Flotantes: Estrellas de Citlalli (+25 pts), Mandarina / Rosas / Ámbar (+15 pts)
 *    y el Medallón QM (activa Escudo Estelar que resiste 1 impacto contra columna).
 *  - Modos:
 *    * 1P + Fantasma del Récord en vivo (segundo frasco translúcido volando en paralelo)
 *    * 2P Vuelo Simultáneo Local (J1: Espacio/W vs J2: Flecha Arriba/Enter)
 *    * VS IA Jaguar Alado
 *    * Online (sincronización de vuelo y puntuación vía handleRemoteEvent)
 *  - Lluvia de Estrellas Doradas y ascenso de Rango Místico cada 10 columnas superadas.
 */

const STORAGE_KEY_HIGH = 'citlalli_flappy_highscore_v1';
const STORAGE_KEY_BEST_COLS = 'citlalli_flappy_bestcols_v1';
const STORAGE_KEY_GHOST = 'citlalli_flappy_ghost_v1';

const SCENARIO_PARALLAX = {
  hidalgo: {
    name: 'Cielo de Hidalgo',
    skyTop: '#060718',
    skyMid: '#151338',
    skyBottom: '#261b47',
    mountainFar: '#100d29',
    mountainNear: '#1a1438',
    groundColor: '#0e0b1c',
    goldTrim: '#f4c56c',
    roseGold: '#e8a598',
    marbleDark: '#12101b',
    marbleVein: '#2d2640'
  },
  jaguar: {
    name: 'Templo del Jaguar',
    skyTop: '#0c0603',
    skyMid: '#241206',
    skyBottom: '#3b1d09',
    mountainFar: '#170b04',
    mountainNear: '#291407',
    groundColor: '#120804',
    goldTrim: '#ffae19',
    roseGold: '#f4c56c',
    marbleDark: '#160e08',
    marbleVein: '#382210'
  },
  velvet: {
    name: 'Salón Terciopelo QM',
    skyTop: '#13040f',
    skyMid: '#2c0a22',
    skyBottom: '#471236',
    mountainFar: '#1f0618',
    mountainNear: '#330b27',
    groundColor: '#160411',
    goldTrim: '#e8a598',
    roseGold: '#ff8da1',
    marbleDark: '#1c0916',
    marbleVein: '#421635'
  },
  penthouse: {
    name: 'Penthouse Estelar',
    skyTop: '#030812',
    skyMid: '#0b1b33',
    skyBottom: '#163256',
    mountainFar: '#081426',
    mountainNear: '#102340',
    groundColor: '#07101f',
    goldTrim: '#f4c56c',
    roseGold: '#7ce8ff',
    marbleDark: '#0b1422',
    marbleVein: '#1e3554'
  }
};

const RANKS_BY_COLUMNS = [
  { minCols: 0, title: 'Brisa Nocturna de Hidalgo' },
  { minCols: 10, title: 'Alquimista de las Alturas' },
  { minCols: 20, title: 'Guardián del Jaguar Dorado' },
  { minCols: 30, title: 'Soberano del Oro Rosa QM' },
  { minCols: 40, title: 'Citlalli: El Límite son las Estrellas ★' }
];

export class FlappyGame {
  constructor(canvas, callbacks = {}, options = {}) {
    this.canvas = null;
    this.ctx = null;
    this.callbacks = callbacks || {};
    this.options = options || {};

    this.width = 800;
    this.height = 520;
    this.groundHeight = 46;

    this.scenario = options.scenario || options.scenarioId || 'hidalgo';
    this.scenarioId = this.scenario;
    this.mode = options.mode || '1p'; // '1p' | '2p_local' | 'vs_ai' | 'online'
    this.difficulty = options.difficulty || 'normal'; // 'normal' | 'fast' | 'god'

    this.running = false;
    this.paused = false;
    this.gameOver = false;
    this.waitingFirstFlap = true;
    this.rafId = null;
    this.lastFrameTime = 0;
    this.elapsedTime = 0;
    this.distanceTraveled = 0;

    // Persistent records
    this.highScore = this._loadNumber(STORAGE_KEY_HIGH, 0);
    this.bestColumns = this._loadNumber(STORAGE_KEY_BEST_COLS, 0);
    this.savedGhostTrack = this._loadGhostTrack();
    this.currentRunTrack = [];
    this.ghostSampleTimer = 0;
    this.showGhost = true;

    // Players
    this.p1 = this._createFlyer('p1', 'Citlalli Dorado (J1)', '#f4c56c', '#e8a598', 165);
    this.p2 = this._createFlyer('p2', 'Citlalli Oro Rosa (J2)', '#e8a598', '#ff8da1', 120);
    this.ghost = {
      active: true,
      x: 155,
      y: 230,
      vy: 0,
      angle: 0,
      wingPhase: 0,
      label: 'FANTASMA RÉCORD',
      columns: this.bestColumns || 12
    };

    // World entities
    this.columns = [];
    this.collectibles = [];
    this.particles = [];
    this.floatingTexts = [];
    this.starShowerParticles = [];
    this.starShowerTimer = 0;
    this.bgStars = [];
    this.parallaxOffset = 0;
    this.columnSpawnTimer = 0;
    this.columnCounter = 0;

    this.screenShake = 0;
    this.flashAlpha = 0;
    this.flashColor = '#fff6b8';
    this.hudModeButtonRect = { x: 0, y: 0, w: 0, h: 0 };

    this.audioCtx = null;

    // Bound event handlers
    this._onKeyDown = this._handleKeyDown.bind(this);
    this._onPointerDown = this._handlePointerDown.bind(this);
    this._onContextMenu = (e) => {
      if (this.mode === '2p_local') e.preventDefault();
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
    return new FlappyGame(canvas, callbacks, options);
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
    }

    if (!this.canvas) return this;
    this.ctx = this.canvas.getContext('2d');
    this._handleResize();
    this._initStars();
    this._bindEvents();
    this._resetMatch();
    this._renderFrame(performance.now());
    return this;
  }

  _createFlyer(id, name, primaryColor, capColor, xPos) {
    return {
      id,
      name,
      primaryColor,
      capColor,
      x: xPos,
      y: 230,
      vy: 0,
      radius: 15,
      angle: 0,
      wingTimer: 0,
      charmAngle: 0,
      alive: true,
      shield: false,
      shieldPulse: 0,
      invulnerableTimer: 0,
      score: 0,
      columnsPassed: 0,
      itemsCollected: 0,
      rank: RANKS_BY_COLUMNS[0].title
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
    } catch (_) {}
  }

  _loadGhostTrack() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_GHOST);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (_) {
      return [];
    }
  }

  _saveGhostTrack(track) {
    try {
      localStorage.setItem(STORAGE_KEY_GHOST, JSON.stringify(track.slice(0, 600)));
    } catch (_) {}
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

  _initStars() {
    this.bgStars = [];
    for (let i = 0; i < 70; i++) {
      this.bgStars.push({
        x: Math.random() * this.width,
        y: Math.random() * (this.height - 100),
        size: Math.random() < 0.3 ? 3 : 2,
        speed: 8 + Math.random() * 18,
        twinkle: Math.random() * Math.PI * 2
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
    this._resetMatch();
    this.running = true;
    this.paused = false;
    this.gameOver = false;
    this.waitingFirstFlap = false;
    this.lastFrameTime = performance.now();

    // Give initial gentle upward flap
    this._flap(this.p1, true);
    if (this.mode === '2p_local' || this.mode === 'vs_ai') {
      this._flap(this.p2, true);
    }

    this._playSound('start');
    this._emitStateChange();

    if (this.rafId) cancelAnimationFrame(this.rafId);
    const loop = (now) => {
      if (!this.running) return;
      const dt = Math.min(0.05, Math.max(0.001, (now - this.lastFrameTime) / 1000));
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
    if (SCENARIO_PARALLAX[scenarioId]) {
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
      this._resetMatch();
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

  handleRemoteEvent(event) {
    if (!event || typeof event !== 'object') return;
    const { type, payload } = event;
    if (type === 'score_update' && typeof event.score === 'number') {
      this.p2.score = event.score;
      if (event.playerName) this.ghost.label = event.playerName;
      this._emitScoreUpdate();
    } else if (type === 'flappy_state' && payload) {
      this.ghost.active = true;
      this.ghost.label = payload.name || 'RIVAL ONLINE';
      this.ghost.y = payload.y ?? this.ghost.y;
      this.ghost.angle = payload.angle ?? 0;
      this.p2.score = payload.score ?? this.p2.score;
      this.p2.columnsPassed = payload.columns ?? this.p2.columnsPassed;
    } else if (type === 'flappy_flap' && payload) {
      if (this.mode === 'online') {
        this.ghost.y = payload.y ?? this.ghost.y;
        this.ghost.wingPhase = 1.0;
      }
    }
  }

  handleTouchDirection(dir) {
    if (!this.running || this.gameOver) {
      this.start();
      return;
    }
    if (this.paused) {
      this.resume();
      return;
    }
    if (dir === 'up' || dir === 'action' || dir === 'left') {
      this._flap(this.p1);
    } else if (dir === 'right' || dir === 'down') {
      if (this.mode === '2p_local') this._flap(this.p2);
      else this._flap(this.p1);
    }
  }

  getState() {
    return {
      game: 'flappy',
      running: this.running,
      paused: this.paused,
      gameOver: this.gameOver,
      scenario: this.scenario,
      mode: this.mode,
      difficulty: this.difficulty,
      score: this.p1.score,
      scoreP1: this.p1.score,
      scoreP2: this.p2.score,
      highScore: this.highScore,
      columnsPassed: this.p1.columnsPassed,
      bestColumns: this.bestColumns,
      shieldActive: this.p1.shield,
      rank: this.p1.rank
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
  // GAMEPLAY & PHYSICS ENGINE
  // =========================================================================

  _getPhysicsParams() {
    if (this.difficulty === 'god') {
      return {
        gravity: 960,
        flapImpulse: -335,
        scrollSpeed: 245,
        gapHeight: 124,
        columnSpacing: 1.32
      };
    }
    if (this.difficulty === 'fast') {
      return {
        gravity: 880,
        flapImpulse: -315,
        scrollSpeed: 205,
        gapHeight: 138,
        columnSpacing: 1.52
      };
    }
    return {
      gravity: 790,
      flapImpulse: -295,
      scrollSpeed: 172,
      gapHeight: 154,
      columnSpacing: 1.75
    };
  }

  _resetMatch() {
    const startY = Math.round((this.height - this.groundHeight) * 0.44);
    const p2Label =
      this.mode === '2p_local'
        ? 'Citlalli Oro Rosa (J2)'
        : this.mode === 'vs_ai'
        ? 'Jaguar Alado (IA)'
        : 'Fantasma del Récord';

    this.p1 = this._createFlyer('p1', 'Citlalli Dorado (J1)', '#f4c56c', '#e8a598', 168);
    this.p1.y = startY;

    this.p2 = this._createFlyer('p2', p2Label, '#e8a598', '#ff6b9d', 118);
    this.p2.y = startY + 16;
    this.p2.alive = this.mode === '2p_local' || this.mode === 'vs_ai';

    this.ghost = {
      active: this.showGhost && (this.mode === '1p' || this.mode === 'online'),
      x: 152,
      y: startY,
      vy: 0,
      angle: 0,
      wingPhase: 0,
      label: this.mode === 'online' ? 'RIVAL ONLINE' : `FANTASMA RÉCORD (${this.bestColumns} COL)`,
      columns: this.bestColumns
    };

    this.columns = [];
    this.collectibles = [];
    this.particles = [];
    this.floatingTexts = [];
    this.starShowerParticles = [];
    this.starShowerTimer = 0;
    this.elapsedTime = 0;
    this.distanceTraveled = 0;
    this.columnSpawnTimer = 0.9;
    this.columnCounter = 0;
    this.currentRunTrack = [];
    this.ghostSampleTimer = 0;
    this.screenShake = 0;
    this.flashAlpha = 0;
    this.gameOver = false;
  }

  _flap(flyer, silent = false) {
    if (!flyer || !flyer.alive) return;
    const phys = this._getPhysicsParams();
    flyer.vy = phys.flapImpulse;
    flyer.wingTimer = 0.22;
    flyer.charmAngle = -0.55;

    // Emit Rose-Gold & Amber Perfume Particle Trail
    for (let i = 0; i < 8; i++) {
      this.particles.push({
        x: flyer.x - 12 + (Math.random() - 0.5) * 8,
        y: flyer.y + 4 + (Math.random() - 0.5) * 10,
        vx: -60 - Math.random() * 75,
        vy: 25 + (Math.random() - 0.5) * 55,
        size: Math.random() < 0.5 ? 4 : 3,
        color: i % 2 === 0 ? flyer.primaryColor : flyer.capColor,
        life: 0.42 + Math.random() * 0.25,
        maxLife: 0.65
      });
    }

    if (!silent) {
      this._playSound('flap');
      if (this.mode === 'online' && flyer === this.p1) {
        this._broadcastRemote('flappy_flap', {
          y: Math.round(this.p1.y),
          score: this.p1.score,
          columns: this.p1.columnsPassed
        });
      }
    }
  }

  _spawnColumnPair() {
    const phys = this._getPhysicsParams();
    this.columnCounter += 1;

    const minTop = 88;
    const playableH = this.height - this.groundHeight;
    const maxTop = playableH - phys.gapHeight - 74;
    const gapTop = Math.round(minTop + Math.random() * Math.max(40, maxTop - minTop));
    const gapBottom = gapTop + phys.gapHeight;
    const colWidth = 62;
    const spawnX = this.width + 40;

    this.columns.push({
      id: this.columnCounter,
      x: spawnX,
      width: colWidth,
      gapTop,
      gapBottom,
      passedP1: false,
      passedP2: false,
      shatteredByP1: false,
      shatteredByP2: false
    });

    // Spawn floating Citlalli Collectible inside or between columns!
    const gapCenterY = (gapTop + gapBottom) / 2;
    const itemRoll = Math.random();
    let itemType = 'mandarin';
    let points = 15;
    let label = 'Mandarina +15';
    let color = '#ff9436';

    if (this.columnCounter % 7 === 0 || itemRoll < 0.14) {
      itemType = 'medallon_qm';
      points = 30;
      label = '¡ESCUDO ESTELAR QM!';
      color = '#7ce8ff';
    } else if (itemRoll < 0.42) {
      itemType = 'star';
      points = 25;
      label = 'Estrella Citlalli +25';
      color = '#fff3a1';
    } else if (itemRoll < 0.68) {
      itemType = 'rose';
      points = 15;
      label = 'Rosa Oro +15';
      color = '#ff5c8a';
    } else if (itemRoll < 0.85) {
      itemType = 'amber';
      points = 15;
      label = 'Ámbar Real +15';
      color = '#ffae19';
    }

    this.collectibles.push({
      x: spawnX + colWidth / 2,
      y: gapCenterY + (Math.random() - 0.5) * 34,
      baseY: gapCenterY,
      radius: 14,
      type: itemType,
      points,
      label,
      color,
      phase: Math.random() * Math.PI * 2
    });
  }

  _update(dt, now) {
    const phys = this._getPhysicsParams();
    // Gradually increase speed slightly every 10 columns
    const speedMultiplier = 1 + Math.min(0.35, Math.floor(this.p1.columnsPassed / 10) * 0.06);
    const currentScrollSpeed = phys.scrollSpeed * speedMultiplier;

    this.elapsedTime += dt;
    this.distanceTraveled += currentScrollSpeed * dt;
    this.parallaxOffset = (this.parallaxOffset + currentScrollSpeed * dt) % this.width;

    if (this.screenShake > 0) {
      this.screenShake = Math.max(0, this.screenShake - dt * 26);
    }
    if (this.flashAlpha > 0) {
      this.flashAlpha = Math.max(0, this.flashAlpha - dt * 1.8);
    }

    // Record P1 ghost sample every 0.08s
    this.ghostSampleTimer += dt;
    if (this.p1.alive && this.ghostSampleTimer >= 0.08) {
      this.ghostSampleTimer = 0;
      this.currentRunTrack.push(Math.round(this.p1.y));
    }

    // Update Ghost position in 1P mode
    if (this.ghost.active && this.mode === '1p') {
      const sampleIdx = Math.floor(this.elapsedTime / 0.08);
      if (this.savedGhostTrack.length > 0 && sampleIdx < this.savedGhostTrack.length) {
        const targetY = this.savedGhostTrack[sampleIdx];
        const prevY = this.ghost.y;
        this.ghost.y += (targetY - this.ghost.y) * 0.35;
        this.ghost.angle = Math.max(-0.4, Math.min(0.4, (this.ghost.y - prevY) * 0.06));
      } else {
        // Procedural Record Ghost navigating current columns smoothly
        const nextCol = this.columns.find((c) => c.x + c.width >= this.ghost.x - 10);
        const desiredY = nextCol
          ? (nextCol.gapTop + nextCol.gapBottom) / 2 + Math.sin(now * 0.005) * 14
          : (this.height - this.groundHeight) * 0.45 + Math.sin(now * 0.004) * 24;
        this.ghost.y += (desiredY - this.ghost.y) * Math.min(1, dt * 6.5);
        this.ghost.angle = Math.sin(now * 0.008) * 0.18;
      }
    }

    // Spawn columns
    this.columnSpawnTimer += dt;
    if (this.columnSpawnTimer >= phys.columnSpacing / speedMultiplier) {
      this.columnSpawnTimer = 0;
      this._spawnColumnPair();
    }

    // Update AI Flyer in vs_ai mode
    if (this.mode === 'vs_ai' && this.p2.alive) {
      this._updateAiFlyer(this.p2);
    }

    // Update Flyers physics
    this._updateFlyerPhysics(this.p1, dt, phys);
    if (this.mode === '2p_local' || this.mode === 'vs_ai') {
      this._updateFlyerPhysics(this.p2, dt, phys);
    }

    // Update Columns & check collisions
    for (let i = this.columns.length - 1; i >= 0; i--) {
      const col = this.columns[i];
      col.x -= currentScrollSpeed * dt;

      if (this.p1.alive) {
        this._checkColumnInteraction(this.p1, col);
      }
      if ((this.mode === '2p_local' || this.mode === 'vs_ai') && this.p2.alive) {
        this._checkColumnInteraction(this.p2, col);
      }

      if (col.x + col.width < -60) {
        this.columns.splice(i, 1);
      }
    }

    // Update Collectibles
    for (let i = this.collectibles.length - 1; i >= 0; i--) {
      const item = this.collectibles[i];
      item.x -= currentScrollSpeed * dt;
      item.y = item.baseY + Math.sin(now * 0.005 + item.phase) * 9;

      let collected = false;
      if (this.p1.alive && this._checkCircleOverlap(this.p1, item)) {
        this._collectItem(this.p1, item);
        collected = true;
      } else if (
        (this.mode === '2p_local' || this.mode === 'vs_ai') &&
        this.p2.alive &&
        this._checkCircleOverlap(this.p2, item)
      ) {
        this._collectItem(this.p2, item);
        collected = true;
      }

      if (collected || item.x < -40) {
        this.collectibles.splice(i, 1);
      }
    }

    // Update Star Shower celebration (every 10 columns)
    if (this.starShowerTimer > 0) {
      this.starShowerTimer = Math.max(0, this.starShowerTimer - dt);
      if (Math.random() < 0.45) {
        this.starShowerParticles.push({
          x: Math.random() * this.width,
          y: -10,
          vx: -60 - Math.random() * 80,
          vy: 140 + Math.random() * 140,
          size: Math.random() < 0.5 ? 4 : 3,
          life: 1.6
        });
      }
    }

    for (let i = this.starShowerParticles.length - 1; i >= 0; i--) {
      const sp = this.starShowerParticles[i];
      sp.x += sp.vx * dt;
      sp.y += sp.vy * dt;
      sp.life -= dt;
      if (sp.life <= 0 || sp.y > this.height) {
        this.starShowerParticles.splice(i, 1);
      }
    }

    // Update particles & floating texts
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
      if (p.life <= 0) this.particles.splice(i, 1);
    }

    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.y += ft.vy * dt;
      ft.life -= dt;
      if (ft.life <= 0) this.floatingTexts.splice(i, 1);
    }

    // Check if match is over
    const p1Dead = !this.p1.alive;
    const p2Dead = this.mode === '2p_local' || this.mode === 'vs_ai' ? !this.p2.alive : true;
    if (p1Dead && p2Dead) {
      this._triggerGameOver();
    }
  }

  _updateAiFlyer(ai) {
    const nextCol = this.columns.find((c) => c.x + c.width >= ai.x - 12);
    const targetY = nextCol
      ? nextCol.gapBottom - 44
      : (this.height - this.groundHeight) * 0.52;

    if (ai.y > targetY && ai.vy >= -60) {
      this._flap(ai, true);
    }
  }

  _updateFlyerPhysics(flyer, dt, phys) {
    if (!flyer.alive) return;

    flyer.vy += phys.gravity * dt;
    flyer.y += flyer.vy * dt;
    flyer.angle = Math.max(-0.52, Math.min(1.05, flyer.vy * 0.0022));

    if (flyer.wingTimer > 0) {
      flyer.wingTimer = Math.max(0, flyer.wingTimer - dt);
    }
    if (flyer.invulnerableTimer > 0) {
      flyer.invulnerableTimer = Math.max(0, flyer.invulnerableTimer - dt);
    }
    flyer.charmAngle += (0 - flyer.charmAngle) * Math.min(1, dt * 8);

    // Ceiling clamp
    if (flyer.y < 84) {
      flyer.y = 84;
      flyer.vy = Math.max(0, flyer.vy);
    }

    // Floor collision
    const floorY = this.height - this.groundHeight - flyer.radius;
    if (flyer.y >= floorY) {
      flyer.y = floorY;
      if (flyer.shield) {
        this._consumeShield(flyer);
        flyer.vy = phys.flapImpulse * 0.9;
      } else {
        this._killFlyer(flyer);
      }
    }
  }

  _checkColumnInteraction(flyer, col) {
    const passedFlag = flyer.id === 'p1' ? 'passedP1' : 'passedP2';
    const shatteredFlag = flyer.id === 'p1' ? 'shatteredByP1' : 'shatteredByP2';

    // Check passing column center for score & 10-column milestone
    if (!col[passedFlag] && flyer.x > col.x + col.width / 2) {
      col[passedFlag] = true;
      flyer.columnsPassed += 1;
      flyer.score += 10;
      flyer.rank = this._getRankForColumns(flyer.columnsPassed);

      if (flyer === this.p1) {
        if (this.p1.score > this.highScore) {
          this.highScore = this.p1.score;
          this._saveNumber(STORAGE_KEY_HIGH, this.highScore);
        }
        if (this.p1.columnsPassed > this.bestColumns) {
          this.bestColumns = this.p1.columnsPassed;
          this._saveNumber(STORAGE_KEY_BEST_COLS, this.bestColumns);
        }
      }

      // Every 10 columns: Golden Star Shower & Rank Ascension!
      if (flyer.columnsPassed > 0 && flyer.columnsPassed % 10 === 0) {
        this.starShowerTimer = 4.0;
        this.flashColor = '#fff4b8';
        this.flashAlpha = 0.45;
        this._playSound('milestone');
        this._addFloatingText(
          this.width / 2,
          135,
          `★ ¡${flyer.columnsPassed} COLUMNAS! LLUVIA DE ESTRELLAS CITLALLI ★`,
          '#fff3a1',
          2.0
        );
        this._addFloatingText(
          this.width / 2,
          162,
          `RANGO: ${flyer.rank.toUpperCase()}`,
          '#7ce8ff',
          2.0
        );
      } else {
        this._playSound('pass');
      }

      this._emitScoreUpdate();
    }

    if (col[shatteredFlag] || flyer.invulnerableTimer > 0) return;

    // Hitbox check against Top or Bottom Marble & Jaguar Column
    const hitR = flyer.radius - 3;
    const withinX = flyer.x + hitR > col.x && flyer.x - hitR < col.x + col.width;
    if (withinX) {
      const hitsTop = flyer.y - hitR < col.gapTop;
      const hitsBottom = flyer.y + hitR > col.gapBottom;
      if (hitsTop || hitsBottom) {
        if (flyer.shield) {
          col[shatteredFlag] = true;
          this._consumeShield(flyer);
        } else {
          this._killFlyer(flyer);
        }
      }
    }
  }

  _checkCircleOverlap(flyer, item) {
    const dx = flyer.x - item.x;
    const dy = flyer.y - item.y;
    const rSum = flyer.radius + item.radius;
    return dx * dx + dy * dy <= rSum * rSum;
  }

  _collectItem(flyer, item) {
    flyer.score += item.points;
    flyer.itemsCollected += 1;

    if (item.type === 'medallon_qm') {
      flyer.shield = true;
      this._playSound('shield');
    } else if (item.type === 'star') {
      this._playSound('milestone');
    } else {
      this._playSound('collect');
    }

    if (flyer === this.p1 && this.p1.score > this.highScore) {
      this.highScore = this.p1.score;
      this._saveNumber(STORAGE_KEY_HIGH, this.highScore);
    }

    this._spawnExplosion(item.x, item.y, item.color, 14);
    this._addFloatingText(item.x, item.y - 12, item.label, item.color, 1.15);
    this._emitScoreUpdate();
  }

  _consumeShield(flyer) {
    flyer.shield = false;
    flyer.invulnerableTimer = 1.1;
    this.screenShake = 9;
    this.flashColor = '#7ce8ff';
    this.flashAlpha = 0.45;
    this._spawnExplosion(flyer.x, flyer.y, '#7ce8ff', 24);
    this._addFloatingText(
      flyer.x,
      flyer.y - 24,
      '¡ESCUDO QM ABSORBIÓ EL IMPACTO!',
      '#7ce8ff',
      1.35
    );
    this._playSound('shield_break');
  }

  _killFlyer(flyer) {
    if (!flyer.alive) return;
    flyer.alive = false;
    this.screenShake = 12;
    this.flashColor = '#ff4b72';
    this.flashAlpha = 0.4;
    this._spawnExplosion(flyer.x, flyer.y, flyer.primaryColor, 26);
    this._addFloatingText(flyer.x, flyer.y - 16, `${flyer.name} CAYÓ`, '#ff6b8b', 1.4);
    this._playSound('crash');
  }

  _triggerGameOver() {
    this.gameOver = true;

    // Save Ghost track if P1 set a good run
    if (
      this.currentRunTrack.length > 20 &&
      (this.p1.columnsPassed >= this.bestColumns || this.savedGhostTrack.length === 0)
    ) {
      this.savedGhostTrack = [...this.currentRunTrack];
      this._saveGhostTrack(this.savedGhostTrack);
    }

    let winner = this.p1.name;
    if ((this.mode === '2p_local' || this.mode === 'vs_ai') && this.p2.score > this.p1.score) {
      winner = this.p2.name;
    }

    const payload = {
      game: 'flappy',
      mode: this.mode,
      scenario: this.scenario,
      winner,
      score: this.p1.score,
      scoreP1: this.p1.score,
      scoreP2: this.p2.score,
      highScore: this.highScore,
      columnsPassed: this.p1.columnsPassed,
      bestColumns: this.bestColumns,
      rank: this.p1.rank
    };

    if (typeof this.callbacks.onGameOver === 'function') {
      this.callbacks.onGameOver(payload);
    }
    if (typeof this.callbacks.onEnd === 'function') {
      this.callbacks.onEnd(payload);
    }
    this._emitStateChange();
  }

  _getRankForColumns(cols) {
    let current = RANKS_BY_COLUMNS[0].title;
    for (const r of RANKS_BY_COLUMNS) {
      if (cols >= r.minCols) current = r.title;
    }
    return current;
  }

  // =========================================================================
  // INPUT HANDLERS
  // =========================================================================

  _handleKeyDown(e) {
    if (!this.running) return;
    const key = e.key.toUpperCase();

    if (key === 'ESCAPE' || key === 'P') {
      this.togglePause();
      return;
    }

    if (this.gameOver) {
      if (key === ' ' || key === 'ENTER' || key === 'W' || key === 'ARROWUP') {
        e.preventDefault();
        this.start();
      }
      return;
    }

    if (this.paused) return;

    // Player 1 Flap: Space or W
    if (key === ' ' || key === 'W') {
      e.preventDefault();
      this._flap(this.p1);
      return;
    }

    // Player 2 Flap (or P1 in 1P mode): ArrowUp or Enter
    if (key === 'ARROWUP' || key === 'ENTER') {
      e.preventDefault();
      if (this.mode === '2p_local') {
        this._flap(this.p2);
      } else {
        this._flap(this.p1);
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

    // Check HUD Mode/Ghost button click
    const btn = this.hudModeButtonRect;
    if (x >= btn.x && x <= btn.x + btn.w && y >= btn.y && y <= btn.y + btn.h) {
      if (this.mode === '1p') {
        this.setMode('2p_local');
      } else {
        this.setMode('1p');
      }
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

    if (this.mode === '2p_local') {
      if (e.button === 2 || x > this.width / 2) {
        this._flap(this.p2);
      } else {
        this._flap(this.p1);
      }
    } else {
      this._flap(this.p1);
    }
  }

  // =========================================================================
  // RENDERING: PARALLAX, MARBLE & JAGUAR COLUMNS, WINGED BOTTLE
  // =========================================================================

  _renderFrame(now) {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const theme = SCENARIO_PARALLAX[this.scenario] || SCENARIO_PARALLAX.hidalgo;

    ctx.save();
    if (this.screenShake > 0) {
      ctx.translate(
        (Math.random() - 0.5) * this.screenShake,
        (Math.random() - 0.5) * this.screenShake
      );
    }

    this._drawParallaxBackground(ctx, theme, now);

    // Draw Marble & Pre-Hispanic Fretwork Columns with Golden Jaguar Heads
    for (const col of this.columns) {
      this._drawMarbleJaguarColumn(ctx, col, theme);
    }

    // Draw Floating Collectibles
    for (const item of this.collectibles) {
      this._drawCollectible(ctx, item, now);
    }

    // Draw Record Ghost (translucent Winged Bottle)
    if (this.ghost.active && (this.mode === '1p' || this.mode === 'online')) {
      this._drawGhostFlyer(ctx, now);
    }

    // Draw Player 2 / AI Winged Bottle
    if ((this.mode === '2p_local' || this.mode === 'vs_ai') && this.p2.alive) {
      this._drawWingedCitlalliBottle(ctx, this.p2, now);
    }

    // Draw Player 1 Winged Bottle
    if (this.p1.alive) {
      this._drawWingedCitlalliBottle(ctx, this.p1, now);
    }

    // Draw Ground Terrace with Golden Fretwork
    this._drawLuxuryGround(ctx, theme);

    // Draw Star Shower & Perfume Particles
    this._drawParticlesAndTexts(ctx);

    // Draw Top HUD
    this._drawTopHud(ctx, theme);

    if (this.flashAlpha > 0) {
      ctx.fillStyle = this.flashColor;
      ctx.globalAlpha = this.flashAlpha;
      ctx.fillRect(0, 0, this.width, this.height);
      ctx.globalAlpha = 1;
    }

    if (this.paused) {
      this._drawModal(
        ctx,
        'VUELO EN PAUSA',
        'Presiona [P] / [ESC] o haz clic para continuar el ascenso',
        theme
      );
    } else if (this.gameOver) {
      this._drawGameOverModal(ctx, theme);
    }

    ctx.restore();
  }

  _drawParallaxBackground(ctx, theme, now) {
    let drewExternalBg = false;
    if (typeof window !== 'undefined' && window.CitlalliVFX) {
      try {
        if (typeof window.CitlalliVFX.drawScenarioBackground === 'function') {
          window.CitlalliVFX.drawScenarioBackground(
            ctx,
            this.width,
            this.height,
            this.scenario,
            now,
            this.parallaxOffset
          );
          drewExternalBg = true;
        } else if (typeof window.CitlalliVFX.drawBackground === 'function') {
          window.CitlalliVFX.drawBackground(ctx, this.width, this.height, this.scenario, now * 0.001);
          drewExternalBg = true;
        }
      } catch (_) {}
    }

    if (drewExternalBg) return;

    const grad = ctx.createLinearGradient(0, 0, 0, this.height);
    grad.addColorStop(0, theme.skyTop);
    grad.addColorStop(0.55, theme.skyMid);
    grad.addColorStop(1, theme.skyBottom);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, this.width, this.height);

    // Twinkling stars
    for (const s of this.bgStars) {
      const sx = (s.x - this.parallaxOffset * 0.15 + this.width * 2) % this.width;
      const alpha = 0.35 + 0.65 * Math.abs(Math.sin(now * 0.002 + s.twinkle));
      ctx.fillStyle = '#fff6c4';
      ctx.globalAlpha = alpha;
      ctx.fillRect(Math.floor(sx), Math.floor(s.y), s.size, s.size);
    }
    ctx.globalAlpha = 1;

    // Far Parallax Mountains / Skyline
    const floorY = this.height - this.groundHeight;
    ctx.fillStyle = theme.mountainFar;
    for (let i = -1; i < 6; i++) {
      const mx = Math.floor(i * 180 - (this.parallaxOffset * 0.25) % 180);
      ctx.beginPath();
      ctx.moveTo(mx, floorY);
      ctx.lineTo(mx + 90, floorY - 125);
      ctx.lineTo(mx + 180, floorY);
      ctx.fill();
    }

    // Near Parallax Pre-Hispanic Pyramids / Penthouse Towers
    ctx.fillStyle = theme.mountainNear;
    for (let i = -1; i < 6; i++) {
      const px = Math.floor(i * 220 - (this.parallaxOffset * 0.5) % 220);
      ctx.fillRect(px + 20, floorY - 68, 120, 68);
      ctx.fillRect(px + 42, floorY - 94, 76, 26);
      ctx.fillRect(px + 62, floorY - 112, 36, 18);
    }
  }

  _drawMarbleJaguarColumn(ctx, col, theme) {
    const x = Math.floor(col.x);
    const w = col.width;
    const floorY = this.height - this.groundHeight;

    // Top Column Body (from y=70 to col.gapTop)
    const topH = Math.max(0, col.gapTop - 70);
    if (topH > 0) {
      this._drawMarbleShaft(ctx, x, 70, w, topH, theme);
      this._drawGoldenJaguarCapital(ctx, x, col.gapTop - 26, w, 26, theme, true);
    }

    // Bottom Column Body (from col.gapBottom to floorY)
    const botH = Math.max(0, floorY - col.gapBottom);
    if (botH > 0) {
      this._drawMarbleShaft(ctx, x, col.gapBottom, w, botH, theme);
      this._drawGoldenJaguarCapital(ctx, x, col.gapBottom, w, 26, theme, false);
    }
  }

  _drawMarbleShaft(ctx, x, y, w, h, theme) {
    // Black marble base
    ctx.fillStyle = theme.marbleDark;
    ctx.fillRect(x, y, w, h);

    // Subtle marble veining & golden borders
    ctx.fillStyle = theme.marbleVein;
    ctx.fillRect(x + 8, y, 6, h);
    ctx.fillRect(x + w - 14, y, 4, h);

    ctx.fillStyle = theme.goldTrim;
    ctx.fillRect(x, y, 3, h);
    ctx.fillRect(x + w - 3, y, 3, h);

    // Vertical Pre-Hispanic Stepped Fretwork (Grecas Doradas)
    ctx.fillStyle = 'rgba(244, 197, 108, 0.55)';
    for (let gy = y + 12; gy < y + h - 18; gy += 28) {
      ctx.fillRect(x + 18, gy, w - 36, 3);
      ctx.fillRect(x + 18, gy + 3, 4, 9);
      ctx.fillRect(x + w - 22, gy - 6, 4, 9);
    }
  }

  _drawGoldenJaguarCapital(ctx, x, y, w, h, theme, isTop) {
    // Capital block with sculpted Golden Jaguar Motif
    ctx.fillStyle = '#24180b';
    ctx.fillRect(x - 5, y, w + 10, h);
    ctx.strokeStyle = theme.goldTrim;
    ctx.lineWidth = 2;
    ctx.strokeRect(x - 5, y, w + 10, h);

    // Golden Jaguar Head Pixel Art Emblem in the center of the capital
    const cx = x + Math.floor(w / 2);
    const cy = y + Math.floor(h / 2);

    ctx.fillStyle = theme.goldTrim;
    ctx.fillRect(cx - 14, cy - 8, 28, 16);
    // Jaguar ears
    ctx.fillRect(cx - 16, cy - 11, 6, 5);
    ctx.fillRect(cx + 10, cy - 11, 6, 5);
    // Glowing emerald/cyan jaguar eyes
    ctx.fillStyle = '#50ff95';
    ctx.fillRect(cx - 9, cy - 4, 5, 4);
    ctx.fillRect(cx + 4, cy - 4, 5, 4);
    // Obsidian nose & fangs
    ctx.fillStyle = '#090714';
    ctx.fillRect(cx - 6, cy + 2, 12, 5);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(cx - 5, cy + 2, 2, 4);
    ctx.fillRect(cx + 3, cy + 2, 2, 4);
  }

  _drawWingedCitlalliBottle(ctx, flyer, now) {
    ctx.save();
    ctx.translate(Math.floor(flyer.x), Math.floor(flyer.y));

    // Blink when invulnerable after shield break
    if (flyer.invulnerableTimer > 0 && Math.floor(now / 60) % 2 === 0) {
      ctx.globalAlpha = 0.55;
    }

    // Active QM Stellar Shield Aura
    if (flyer.shield) {
      ctx.save();
      ctx.strokeStyle = '#7ce8ff';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, 0, flyer.radius + 9 + Math.sin(now * 0.01) * 2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = 'rgba(124, 232, 255, 0.14)';
      ctx.fill();
      ctx.restore();
    }

    ctx.rotate(flyer.angle);

    // 1. Pixel Art Golden Wings of Light (flapping)
    const wingLift = flyer.wingTimer > 0 ? -9 : Math.sin(now * 0.018) * 5;
    ctx.fillStyle = '#fff5b8';
    ctx.fillRect(-18, -8 + wingLift, 12, 5);
    ctx.fillRect(-23, -12 + wingLift, 10, 4);
    ctx.fillStyle = flyer.primaryColor;
    ctx.fillRect(-15, -3 + wingLift * 0.6, 10, 4);

    // 2. Faceted Crystal Perfume Bottle Body
    ctx.fillStyle = 'rgba(28, 20, 48, 0.92)';
    ctx.fillRect(-11, -10, 22, 22);
    ctx.strokeStyle = flyer.primaryColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(-11, -10, 22, 22);

    // Golden Fragrance Liquid inside
    ctx.fillStyle = flyer.primaryColor;
    ctx.fillRect(-8, -1, 16, 10);

    // Black & Gold Luxury Label "CITLALLI"
    ctx.fillStyle = '#090714';
    ctx.fillRect(-7, -6, 14, 7);
    ctx.fillStyle = '#fff5b8';
    ctx.fillRect(-5, -4, 10, 2);

    // 3. Rose-Gold Cap & Neck
    ctx.fillStyle = '#f4c56c';
    ctx.fillRect(-3, -13, 6, 3);
    ctx.fillStyle = flyer.capColor;
    ctx.fillRect(-6, -19, 12, 6);

    // 4. Swinging Round QM Medallion Charm
    ctx.save();
    ctx.translate(8, -10);
    ctx.rotate(flyer.charmAngle);
    ctx.fillStyle = '#f4c56c';
    ctx.fillRect(0, 0, 7, 7);
    ctx.fillStyle = '#090714';
    ctx.fillRect(2, 2, 3, 3);
    ctx.restore();

    ctx.restore();
  }

  _drawGhostFlyer(ctx, now) {
    ctx.save();
    ctx.globalAlpha = 0.42;
    ctx.translate(Math.floor(this.ghost.x), Math.floor(this.ghost.y));
    ctx.rotate(this.ghost.angle);

    // Translucent cyan/gold silhouette of the Winged Bottle
    const wingLift = Math.sin(now * 0.02) * 6;
    ctx.fillStyle = '#7ce8ff';
    ctx.fillRect(-18, -8 + wingLift, 12, 5);
    ctx.strokeStyle = '#7ce8ff';
    ctx.lineWidth = 2;
    ctx.strokeRect(-10, -9, 20, 20);
    ctx.fillRect(-5, -17, 10, 5);

    ctx.restore();

    // Floating Ghost tag
    ctx.save();
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = '#7ce8ff';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(this.ghost.label, this.ghost.x, this.ghost.y - 24);
    ctx.restore();
  }

  _drawCollectible(ctx, item, now) {
    ctx.save();
    ctx.translate(Math.floor(item.x), Math.floor(item.y));
    const pulse = 1 + 0.1 * Math.sin(now * 0.01 + item.phase);
    ctx.scale(pulse, pulse);

    if (item.type === 'medallon_qm') {
      // Glowing QM Shield Medallion
      ctx.beginPath();
      ctx.arc(0, 0, 13, 0, Math.PI * 2);
      ctx.fillStyle = '#112940';
      ctx.fill();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#7ce8ff';
      ctx.stroke();

      ctx.fillStyle = '#f4c56c';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('QM', 0, 3);
    } else if (item.type === 'star') {
      // 8-Pointed Star of Citlalli
      ctx.fillStyle = '#fff3a1';
      ctx.fillRect(-2, -12, 4, 24);
      ctx.fillRect(-12, -2, 24, 4);
      ctx.fillRect(-7, -7, 14, 14);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-3, -3, 6, 6);
    } else if (item.type === 'mandarin') {
      ctx.fillStyle = '#ff9436';
      ctx.fillRect(-9, -6, 18, 12);
      ctx.fillStyle = '#ffe0b2';
      ctx.fillRect(-5, -3, 4, 6);
      ctx.fillRect(1, -3, 4, 6);
    } else if (item.type === 'rose') {
      ctx.fillStyle = '#ff5c8a';
      ctx.fillRect(-8, -8, 16, 14);
      ctx.fillStyle = '#ffc1d6';
      ctx.fillRect(-4, -4, 8, 6);
    } else {
      // Amber drop
      ctx.fillStyle = '#ffae19';
      ctx.fillRect(-7, -8, 14, 16);
      ctx.fillStyle = '#fff3a1';
      ctx.fillRect(-3, -4, 4, 6);
    }

    ctx.restore();
  }

  _drawLuxuryGround(ctx, theme) {
    const floorY = this.height - this.groundHeight;
    ctx.fillStyle = theme.groundColor;
    ctx.fillRect(0, floorY, this.width, this.groundHeight);

    ctx.fillStyle = theme.goldTrim;
    ctx.fillRect(0, floorY, this.width, 3);

    // Scrolling Pre-Hispanic Fretwork along the terrace floor
    const step = 36;
    const offset = Math.floor(this.parallaxOffset) % step;
    ctx.fillStyle = 'rgba(244, 197, 108, 0.65)';
    for (let x = -offset; x < this.width + step; x += step) {
      ctx.fillRect(x + 4, floorY + 8, 20, 4);
      ctx.fillRect(x + 20, floorY + 12, 4, 10);
      ctx.fillRect(x + 10, floorY + 18, 10, 4);
    }

    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#e8a598';
    const controlsText =
      this.mode === '2p_local'
        ? 'J1 (DORADO): [ESPACIO] / [W] / CLIC IZQ   •   J2 (ORO ROSA): [FLECHA ARRIBA] / [ENTER] / CLIC DER'
        : 'ALETEAR: [ESPACIO] / [W] / CLIC / TAP   •   MEDALLÓN QM = ESCUDO CONTRA COLUMNA';
    ctx.fillText(controlsText, this.width / 2, this.height - 10);
  }

  _drawParticlesAndTexts(ctx) {
    // Golden Star Shower particles
    for (const sp of this.starShowerParticles) {
      ctx.fillStyle = '#fff5b8';
      ctx.fillRect(Math.floor(sp.x), Math.floor(sp.y), sp.size, sp.size);
    }

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

  _drawTopHud(ctx, theme) {
    ctx.fillStyle = 'rgba(7, 6, 18, 0.9)';
    ctx.fillRect(0, 0, this.width, 70);
    ctx.fillStyle = theme.goldTrim;
    ctx.fillRect(0, 68, this.width, 2);

    // Left: Player 1 Score, Columns, Shield
    ctx.textAlign = 'left';
    ctx.fillStyle = '#f4c56c';
    ctx.font = 'bold 14px monospace';
    const shieldBadge = this.p1.shield ? ' [🛡️ ESCUDO QM]' : '';
    ctx.fillText(`J1: ${this.p1.score} PTS (${this.p1.columnsPassed} COL)${shieldBadge}`, 16, 24);

    ctx.fillStyle = '#e8a598';
    ctx.font = '11px monospace';
    ctx.fillText(`RANGO: ${this.p1.rank}`, 16, 44);

    // Center: Mode Switcher Button (1P + Fantasma <-> 2P Vuelo Simultáneo)
    const cx = this.width / 2;
    const btnW = 264;
    const btnH = 26;
    const btnX = Math.round(cx - btnW / 2);
    const btnY = 22;
    this.hudModeButtonRect = { x: btnX, y: btnY, w: btnW, h: btnH };

    ctx.fillStyle = '#1b1433';
    ctx.fillRect(btnX, btnY, btnW, btnH);
    ctx.strokeStyle = '#f4c56c';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(btnX, btnY, btnW, btnH);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#fff5b8';
    ctx.font = 'bold 11px monospace';
    const modeText =
      this.mode === '2p_local'
        ? '👥 2P VUELO SIMULTÁNEO  ⇄  [1P + FANTASMA]'
        : '👻 1P + FANTASMA RÉCORD  ⇄  [MODO 2P LOCAL]';
    ctx.fillText(modeText, cx, btnY + 17);

    // Right: P2 Score or High Score & Record Columns
    ctx.textAlign = 'right';
    if (this.mode === '2p_local' || this.mode === 'vs_ai') {
      ctx.fillStyle = '#e8a598';
      ctx.font = 'bold 14px monospace';
      const p2Shield = this.p2.shield ? ' [🛡️]' : '';
      ctx.fillText(
        `J2: ${this.p2.score} PTS (${this.p2.columnsPassed} COL)${p2Shield}`,
        this.width - 16,
        24
      );
      ctx.fillStyle = '#f4c56c';
      ctx.font = '11px monospace';
      ctx.fillText(`RÉCORD: ${this.highScore} PTS`, this.width - 16, 44);
    } else {
      ctx.fillStyle = '#f4c56c';
      ctx.font = 'bold 14px monospace';
      ctx.fillText(`RÉCORD: ${this.highScore} PTS`, this.width - 16, 24);
      ctx.fillStyle = '#7ce8ff';
      ctx.font = '11px monospace';
      ctx.fillText(`MEJOR MARCA: ${this.bestColumns} COLUMNAS`, this.width - 16, 44);
    }
  }

  _drawModal(ctx, title, subtitle, theme) {
    ctx.fillStyle = 'rgba(5, 4, 14, 0.78)';
    ctx.fillRect(0, 0, this.width, this.height);

    const mw = Math.min(480, this.width - 40);
    const mh = 170;
    const mx = (this.width - mw) / 2;
    const my = (this.height - mh) / 2;

    ctx.fillStyle = '#120e24';
    ctx.fillRect(mx, my, mw, mh);
    ctx.strokeStyle = theme.goldTrim;
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
    const mh = 250;
    const mx = (this.width - mw) / 2;
    const my = (this.height - mh) / 2;

    ctx.fillStyle = '#120e26';
    ctx.fillRect(mx, my, mw, mh);
    ctx.strokeStyle = theme.goldTrim;
    ctx.lineWidth = 3;
    ctx.strokeRect(mx, my, mw, mh);

    const cx = this.width / 2;
    ctx.textAlign = 'center';
    ctx.fillStyle = '#f4c56c';
    ctx.font = 'bold 20px monospace';
    ctx.fillText('★ EL LÍMITE SON LAS ESTRELLAS ★', cx, my + 42);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px monospace';
    ctx.fillText(
      `J1: ${this.p1.score} PTS  •  COLUMNAS SUPERADAS: ${this.p1.columnsPassed}`,
      cx,
      my + 84
    );

    ctx.fillStyle = '#7ce8ff';
    ctx.font = 'bold 13px monospace';
    ctx.fillText(`RANGO ALCANZADO: ${this.p1.rank}`, cx, my + 114);

    if (this.mode === '2p_local' || this.mode === 'vs_ai') {
      const winner =
        this.p1.score >= this.p2.score ? '¡GANA JUGADOR 1 (DORADO)!' : `¡GANA ${this.p2.name.toUpperCase()}!`;
      ctx.fillStyle = '#e8a598';
      ctx.font = 'bold 13px monospace';
      ctx.fillText(
        `J2: ${this.p2.score} PTS (${this.p2.columnsPassed} COL) — ${winner}`,
        cx,
        my + 148
      );
    } else {
      ctx.fillStyle = '#e8a598';
      ctx.font = '13px monospace';
      ctx.fillText(
        `RÉCORD HISTÓRICO: ${this.highScore} PTS (${this.bestColumns} COLUMNAS)`,
        cx,
        my + 148
      );
    }

    ctx.fillStyle = '#fff5b8';
    ctx.font = 'bold 13px monospace';
    ctx.fillText(
      'Presiona [ESPACIO] / [W] o haz CLIC para volver a volar',
      cx,
      my + 208
    );
  }

  // =========================================================================
  // VFX & AUDIO HELPERS
  // =========================================================================

  _spawnExplosion(x, y, color, count = 16) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.35;
      const speed = 45 + Math.random() * 140;
      const life = 0.4 + Math.random() * 0.35;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() < 0.5 ? 4 : 3,
        color,
        life,
        maxLife: life
      });
    }
  }

  _addFloatingText(x, y, text, color = '#f4c56c', duration = 1.1) {
    this.floatingTexts.push({
      x,
      y,
      vy: -35,
      text,
      color,
      life: duration,
      maxLife: duration
    });
  }

  _playSound(type) {
    if (typeof window !== 'undefined' && window.CitlalliAudio) {
      try {
        const audio = window.CitlalliAudio;
        const fn = audio.playSFX || audio.playSfx;
        if (typeof fn === 'function') {
          const sfxMap = {
            flap: 'flap',
            pass: 'pickup',
            collect: 'pickup',
            shield: 'reflex_flash',
            milestone: 'victory',
            crash: 'hit',
            shield_break: 'hit',
            start: 'click'
          };
          fn.call(audio, sfxMap[type] || type);
          return;
        }
      } catch (_) {}
    }

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

      if (type === 'flap') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(540, now + 0.09);
        gain.gain.setValueAtTime(0.09, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === 'pass' || type === 'collect') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(587.33, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
        gain.gain.setValueAtTime(0.11, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);
        osc.start(now);
        osc.stop(now + 0.13);
      } else if (type === 'shield' || type === 'milestone') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.25);
        gain.gain.setValueAtTime(0.14, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.26);
        osc.start(now);
        osc.stop(now + 0.26);
      } else if (type === 'crash' || type === 'shield_break') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.linearRampToValueAtTime(75, now + 0.24);
        gain.gain.setValueAtTime(0.14, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
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
  window.CitlalliGames.flappy = FlappyGame;
}

export default FlappyGame;
