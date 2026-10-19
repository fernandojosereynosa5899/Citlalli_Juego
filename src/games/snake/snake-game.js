/**
 * CITLALLI ARCADE — Módulo Independiente 1:
 * "La Víborita: Estela de los Dioses" (src/games/snake/snake-game.js)
 *
 * Juego 100% encapsulado y desacoplado.
 * Consume window.CitlalliVFX / ../../engine/scenarios-vfx.js y
 * window.CitlalliAudio / ../../engine/audio-engine.js con fallbacks seguros integrados.
 */

// Paleta Oficial Citlalli Pixel Art
const PALETTE = {
  navyDeep: '#060B19',
  navyVelvet: '#0A1128',
  navyCard: '#111B3A',
  goldBright: '#FFD700',
  goldImperial: '#D4AF37',
  goldSoft: '#F3E5AB',
  goldDark: '#8A6D1B',
  roseGold: '#E6C2B8',
  roseBright: '#FF69B4',
  roseDeep: '#C86D7E',
  amber: '#FFBF00',
  mandarin: '#FF8C00',
  jasmine: '#FFFDF5',
  vanilla: '#F5DEB3',
  obsidian: '#181224',
  turquoise: '#40E0D0',
  smokeDark: '#2A1B3D',
  smokeCore: '#6B2D5C',
  white: '#FFFFFF'
};

// Catálogo de Notas Olfativas y Reliquias Citlalli para La Víborita
const INGREDIENTS = {
  mandarin: {
    id: 'mandarin',
    name: 'Mandarina Fresca',
    category: 'Nota de Salida',
    points: 15,
    color: '#FF8C00',
    glow: 'rgba(255, 140, 0, 0.55)',
    sparkType: 'mandarin',
    weight: 32,
    lore: 'Nota de Salida: Mandarina fresca bañada por el sol de Hidalgo; una chispa cítrica vibrante que abre la estela de Citlalli.'
  },
  rose: {
    id: 'rose',
    name: 'Rosa Rosada',
    category: 'Nota de Corazón',
    points: 25,
    color: '#FF69B4',
    glow: 'rgba(255, 105, 180, 0.55)',
    sparkType: 'rose',
    weight: 26,
    lore: 'Nota de Corazón: Rosa rosada aterciopelada que aporta feminidad regia, romance y sofisticación floral.'
  },
  jasmine: {
    id: 'jasmine',
    name: 'Jazmín Blanco',
    category: 'Nota de Corazón',
    points: 30,
    color: '#FFFDF5',
    glow: 'rgba(255, 253, 245, 0.6)',
    sparkType: 'jasmine',
    weight: 20,
    lore: 'Nota de Corazón: Jazmín blanco nocturno que florece bajo las estrellas, iluminando el corazón del perfume.'
  },
  vanilla: {
    id: 'vanilla',
    name: 'Vaina de Vainilla',
    category: 'Nota de Fondo',
    points: 40,
    color: '#F3E5AB',
    glow: 'rgba(243, 229, 171, 0.6)',
    sparkType: 'vanilla',
    weight: 14,
    lore: 'Nota de Fondo: Vaina de vainilla cálida y seductora que envuelve la piel con una dulzura dorada inolvidable.'
  },
  amber: {
    id: 'amber',
    name: 'Resina de Ámbar',
    category: 'Nota de Fondo',
    points: 50,
    color: '#FFBF00',
    glow: 'rgba(255, 191, 0, 0.65)',
    sparkType: 'amber',
    weight: 8,
    lore: 'Nota de Fondo: Resina de ámbar ancestral, el sello místico que prolonga la presencia de Citlalli durante horas.'
  },
  bottle: {
    id: 'bottle',
    name: 'Frasco Citlalli QM',
    category: 'Reliquia Real',
    points: 150,
    color: '#E6C2B8',
    glow: 'rgba(230, 194, 184, 0.85)',
    sparkType: 'gold',
    isSpecial: true,
    duration: 9.5,
    lore: 'El Frasco Citlalli con tapa de Estrella de 8 puntas y dije QM en oro rosa: una joya de alta perfumería mexicana.'
  },
  star: {
    id: 'star',
    name: 'Estrella de Citlalli',
    category: 'Poder Astral',
    points: 100,
    color: '#FFD700',
    glow: 'rgba(255, 215, 0, 0.9)',
    sparkType: 'astral',
    isSpecial: true,
    duration: 9.0,
    lore: '¡Fiebre de los Dioses! En náhuatl Citlalli significa Estrella: 8 segundos de puntos x2, estela divina e inmunidad astral.'
  }
};

// Matrices Pixel Art 12x12 para renderizado autónomo nítido de cada ingrediente
const PIXEL_SPRITES_12 = {
  mandarin: {
    palette: { '1': '#2E8B57', '2': '#3CB371', '3': '#FF8C00', '4': '#FFA500', '5': '#FFD700', '6': '#CC5500' },
    grid: [
      '.....12.....',
      '....1221....',
      '...334433...',
      '..34554433..',
      '.3455444436.',
      '.3444444436.',
      '.3444444336.',
      '.3344443366.',
      '..33333366..',
      '...633366...',
      '....6666....',
      '............'
    ]
  },
  rose: {
    palette: { '1': '#FF1493', '2': '#FF69B4', '3': '#FFB6C1', '4': '#8B004B', '5': '#2E8B57', '6': '#3CB371' },
    grid: [
      '....2332....',
      '..23144132..',
      '.2312332132.',
      '.2123113212.',
      '.2131441312.',
      '..21211212..',
      '...422224...',
      '....5565....',
      '...565565...',
      '.....55.....',
      '.....56.....',
      '............'
    ]
  },
  jasmine: {
    palette: { '1': '#FFFDF5', '2': '#E6E6FA', '3': '#FFD700', '4': '#DAA520', '5': '#2E8B57' },
    grid: [
      '.....11.....',
      '....1111....',
      '.11..12..11.',
      '111112211111',
      '.1122332211.',
      '...234432...',
      '..11233211..',
      '.1112112111.',
      '.11..55..11.',
      '.....55.....',
      '............',
      '............'
    ]
  },
  vanilla: {
    palette: { '1': '#4A2E1B', '2': '#6B4226', '3': '#8B5A2B', '4': '#F3E5AB', '5': '#FFD700' },
    grid: [
      '.........45.',
      '........454.',
      '......1235..',
      '.....1231...',
      '....12312...',
      '...123123...',
      '..1231231...',
      '.1231231....',
      '.121231.....',
      '411211......',
      '5411........',
      '............'
    ]
  },
  amber: {
    palette: { '1': '#8B4500', '2': '#CD6600', '3': '#FF8C00', '4': '#FFBF00', '5': '#FFF8DC' },
    grid: [
      '....3443....',
      '...345543...',
      '..23455432..',
      '.2344444432.',
      '.1234444321.',
      '.1233443321.',
      '..12333321..',
      '...122221...',
      '....1111....',
      '............',
      '............',
      '............'
    ]
  },
  bottle: {
    palette: { '1': '#FFD700', '2': '#D4AF37', '3': '#0A1128', '4': '#1E3A8A', '5': '#E6C2B8', '6': '#FFFDF5' },
    grid: [
      '.....11.....',
      '...116611...',
      '....2112....',
      '....2552....',
      '..223443255.',
      '.2346443325.',
      '.234411432..',
      '.234166132..',
      '.234411432..',
      '.233344332..',
      '..22222222..',
      '............'
    ]
  },
  star: {
    palette: { '1': '#FFD700', '2': '#FFFDF5', '3': '#D4AF37', '4': '#FFBF00' },
    grid: [
      '.....11.....',
      '..4..11..4..',
      '...4.12.4...',
      '....1221....',
      '.1112222111.',
      '112226622211',
      '.1112222111.',
      '....1221....',
      '...4.21.4...',
      '..4..11..4..',
      '.....11.....',
      '............'
    ]
  }
};

export class SnakeGame {
  /**
   * @param {HTMLCanvasElement|string} canvas Elemento canvas o selector CSS
   * @param {Object} callbacks { onScoreUpdate, onLoreUnlock, onBroadcastState, onGameOver }
   * @param {Object} options { scenarioId, mode, difficulty, vfx, audio }
   */
  constructor(canvas, callbacks = {}, options = {}) {
    this.canvas = typeof canvas === 'string' ? document.querySelector(canvas) : canvas;
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.callbacks = {
      onScoreUpdate: callbacks.onScoreUpdate || null,
      onLoreUnlock: callbacks.onLoreUnlock || null,
      onBroadcastState: callbacks.onBroadcastState || null,
      onGameOver: callbacks.onGameOver || null
    };

    // Configuración de partida
    this.scenarioId = options.scenarioId || 'hidalgo';
    this.mode = options.mode || '1p'; // '1p' | '2p_local' | 'vs_ai' | 'online'
    this.difficulty = options.difficulty || 'normal'; // 'normal' | 'fast' | 'god'

    // Referencias a motores externos (con auto-descubrimiento seguro)
    this.externalVFX = options.vfx || (typeof window !== 'undefined' ? window.CitlalliVFX : null);
    this.externalAudio = options.audio || (typeof window !== 'undefined' ? window.CitlalliAudio : null);
    this._tryLoadExternalEngines();

    // Dimensiones lógicas de la cuadrícula
    this.cols = 24;
    this.rows = 16;
    this.hudHeight = 54;

    // Estado general
    this.isRunning = false;
    this.isPaused = false;
    this.isGameOver = false;
    this.rafId = null;
    this.lastFrameTime = 0;
    this.moveAccumulatorP1 = 0;
    this.moveAccumulatorP2 = 0;
    this.elapsedTime = 0;
    this.matchTimeRemaining = 90; // Para modos competitivos 2P / VS IA

    // Puntuación y combos
    this.score = 0;
    this.p2Score = 0;
    this.combo = 1;
    this.comboTimer = 0;
    this.comboMaxWindow = 4.0; // 4 segundos para mantener racha
    this.feverTimer = 0;
    this.feverDuration = 8.0; // 8 segundos de Fiebre de los Dioses
    this.p2FeverTimer = 0;

    // Estadísticas detalladas
    this.stats = {
      ingredientsCollected: 0,
      p2IngredientsCollected: 0,
      maxCombo: 1,
      bottlesCollected: 0,
      starsCollected: 0,
      lastNote: null,
      unlockedNotes: new Set()
    };

    // Entidades del tablero
    this.snakeP1 = null;
    this.snakeP2 = null;
    this.remoteSnake = null;
    this.items = [];
    this.specialItem = null;
    this.obstacles = [];
    this.obstacleTimer = 0;

    // Efectos visuales locales (partículas, textos flotantes, estelas, shake)
    this.particles = [];
    this.floatingTexts = [];
    this.trails = [];
    this.shakeTimer = 0;
    this.shakeIntensity = 0;
    this.bgStars = this._createAmbientStars(45);

    // Audio WebAudio API local de respaldo
    this.audioCtx = null;

    // Enlace de eventos
    this._boundKeyDown = this._handleKeyDown.bind(this);
    this._boundResize = this._handleResize.bind(this);
    this._boundPointerDown = this._handlePointerDown.bind(this);

    this.init(options);
  }

  /**
   * Intenta importar dinámicamente los motores compartidos si no están aún en window
   */
  _tryLoadExternalEngines() {
    if (typeof window === 'undefined') return;
    if (!this.externalVFX) {
      import('../../engine/scenarios-vfx.js')
        .then((mod) => {
          this.externalVFX = window.CitlalliVFX || mod.CitlalliVFX || mod.default || mod;
        })
        .catch(() => {});
    }
    if (!this.externalAudio) {
      import('../../engine/audio-engine.js')
        .then((mod) => {
          this.externalAudio = window.CitlalliAudio || mod.CitlalliAudio || mod.default || mod;
        })
        .catch(() => {});
    }
  }

  /**
   * Inicializa o reconfigura la instancia sin iniciar aún el bucle si no se desea
   */
  init(options = {}) {
    if (options.scenarioId) this.scenarioId = options.scenarioId;
    if (options.mode) this.mode = options.mode;
    if (options.difficulty) this.difficulty = options.difficulty;

    this._setupCanvas();
    this._attachListeners();
    this._resetGameState();
    this._renderFrame(0);
    return this;
  }

  _setupCanvas() {
    if (!this.canvas) return;
    if (!this.canvas.width || this.canvas.width < 320) {
      this.canvas.width = 768;
    }
    if (!this.canvas.height || this.canvas.height < 240) {
      this.canvas.height = 534;
    }
    if (this.ctx) {
      this.ctx.imageSmoothingEnabled = false;
    }
  }

  _attachListeners() {
    if (typeof window === 'undefined') return;
    this._detachListeners();
    window.addEventListener('keydown', this._boundKeyDown, { passive: false });
    window.addEventListener('resize', this._boundResize);
    if (this.canvas) {
      this.canvas.addEventListener('pointerdown', this._boundPointerDown);
    }
  }

  _detachListeners() {
    if (typeof window === 'undefined') return;
    window.removeEventListener('keydown', this._boundKeyDown);
    window.removeEventListener('resize', this._boundResize);
    if (this.canvas) {
      this.canvas.removeEventListener('pointerdown', this._boundPointerDown);
    }
  }

  _handleResize() {
    if (this.ctx) {
      this.ctx.imageSmoothingEnabled = false;
    }
    if (!this.isRunning) {
      this._renderFrame(0);
    }
  }

  _handlePointerDown(e) {
    if (!this.canvas) return;
    if (this.isGameOver) {
      this.start();
      return;
    }
    if (!this.isRunning) {
      this.start();
      return;
    }
    // Permite dirigir a la serpiente P1 tocando hacia el cuadrante relativo a su cabeza
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    if (this.snakeP1 && this.snakeP1.segments.length > 0) {
      const metrics = this._getBoardMetrics();
      const head = this.snakeP1.segments[0];
      const headPxX = metrics.boardX + (head.x + 0.5) * metrics.cellW;
      const headPxY = metrics.boardY + (head.y + 0.5) * metrics.cellH;
      const dx = clickX - headPxX;
      const dy = clickY - headPxY;
      if (Math.abs(dx) > Math.abs(dy)) {
        this._queueDirection(this.snakeP1, dx > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 });
      } else {
        this._queueDirection(this.snakeP1, dy > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 });
      }
    }
  }

  _resetGameState() {
    this.score = 0;
    this.p2Score = 0;
    this.combo = 1;
    this.comboTimer = 0;
    this.feverTimer = 0;
    this.p2FeverTimer = 0;
    this.elapsedTime = 0;
    this.matchTimeRemaining = 90;
    this.moveAccumulatorP1 = 0;
    this.moveAccumulatorP2 = 0;
    this.isGameOver = false;
    this.winnerText = '';

    this.stats = {
      ingredientsCollected: 0,
      p2IngredientsCollected: 0,
      maxCombo: 1,
      bottlesCollected: 0,
      starsCollected: 0,
      lastNote: 'Mandarina Fresca',
      unlockedNotes: new Set()
    };

    // Crear Serpiente P1: Quetzal Astral Dorado
    this.snakeP1 = {
      id: 'p1',
      name: 'Quetzal Dorado',
      segments: [
        { x: 6, y: 8 },
        { x: 5, y: 8 },
        { x: 4, y: 8 },
        { x: 3, y: 8 }
      ],
      dir: { x: 1, y: 0 },
      nextDirs: [],
      alive: true,
      respawnShield: 0,
      lives: this.mode === '1p' ? 1 : 3,
      primaryColor: PALETTE.goldBright,
      secondaryColor: PALETTE.goldImperial,
      accentColor: PALETTE.turquoise
    };

    // Crear Serpiente P2 o IA si aplica
    if (this.mode === '2p_local' || this.mode === 'vs_ai') {
      const isAI = this.mode === 'vs_ai';
      this.snakeP2 = {
        id: isAI ? 'ai' : 'p2',
        name: isAI ? 'Sombra del Jaguar' : 'Serpiente Oro Rosa',
        isAI,
        segments: [
          { x: this.cols - 7, y: 8 },
          { x: this.cols - 6, y: 8 },
          { x: this.cols - 5, y: 8 },
          { x: this.cols - 4, y: 8 }
        ],
        dir: { x: -1, y: 0 },
        nextDirs: [],
        alive: true,
        respawnShield: 0,
        lives: 3,
        primaryColor: isAI ? '#241B35' : PALETTE.roseGold,
        secondaryColor: isAI ? PALETTE.goldImperial : PALETTE.roseBright,
        accentColor: isAI ? PALETTE.amber : PALETTE.jasmine
      };
    } else {
      this.snakeP2 = null;
    }

    this.remoteSnake = null;
    this.items = [];
    this.specialItem = null;
    this.obstacles = [];
    this.particles = [];
    this.floatingTexts = [];
    this.trails = [];

    // Generar obstáculos si la dificultad es fast o god
    this._spawnObstaclesForDifficulty();

    // Generar ingredientes iniciales (2 en modo 1p, 3 en duelo para mayor dinamismo)
    const targetItems = this.mode === '1p' ? 2 : 3;
    for (let i = 0; i < targetItems; i++) {
      this._spawnIngredient();
    }

    this._emitScoreUpdate();
  }

  /**
   * Inicia o reinicia la partida
   */
  start() {
    this._resetGameState();
    this.isRunning = true;
    this.isPaused = false;
    this.lastFrameTime = performance.now();
    this._playSound('start');

    if (this.rafId) cancelAnimationFrame(this.rafId);
    const loop = (now) => {
      if (!this.isRunning) return;
      const dt = Math.min(0.1, Math.max(0.001, (now - this.lastFrameTime) / 1000));
      this.lastFrameTime = now;

      if (!this.isPaused && !this.isGameOver) {
        this._update(dt);
      }
      this._renderFrame(dt);
      this.rafId = requestAnimationFrame(loop);
    };
    this.rafId = requestAnimationFrame(loop);
    return this;
  }

  pause() {
    if (!this.isRunning || this.isPaused) return;
    this.isPaused = true;
    this._playSound('pause');
    this._renderFrame(0);
  }

  resume() {
    if (!this.isRunning || !this.isPaused) return;
    this.isPaused = false;
    this.lastFrameTime = performance.now();
    this._playSound('resume');
  }

  togglePause() {
    if (this.isPaused) {
      this.resume();
    } else {
      this.pause();
    }
    return this.isPaused;
  }

  setScenario(scenarioId) {
    const valid = ['hidalgo', 'jaguar', 'velvet', 'penthouse'];
    this.scenarioId = valid.includes(scenarioId) ? scenarioId : 'hidalgo';
    const vfx = this.externalVFX || (typeof window !== 'undefined' ? window.CitlalliVFX : null);
    if (vfx && typeof vfx.setScenario === 'function') {
      try { vfx.setScenario(this.scenarioId); } catch (_) {}
    }
    if (!this.isRunning) {
      this._renderFrame(0);
    }
  }

  setMode(mode) {
    const valid = ['1p', '2p_local', 'vs_ai', 'online'];
    this.mode = valid.includes(mode) ? mode : '1p';
    this._resetGameState();
    if (!this.isRunning) {
      this._renderFrame(0);
    }
  }

  setDifficulty(diff) {
    const valid = ['normal', 'fast', 'god'];
    this.difficulty = valid.includes(diff) ? diff : 'normal';
    this._spawnObstaclesForDifficulty();
    if (!this.isRunning) {
      this._renderFrame(0);
    }
  }

  /**
   * Recibe progreso o estado de otro jugador en sala multijugador online
   */
  handleRemoteEvent(event) {
    if (!event || typeof event !== 'object') return;
    if (event.type === 'snake_state' || event.game === 'snake') {
      if (typeof event.score === 'number') {
        this.p2Score = event.score;
      }
      if (Array.isArray(event.segments)) {
        this.remoteSnake = {
          name: event.playerName || 'Rival Astral',
          segments: event.segments,
          primaryColor: PALETTE.roseGold,
          secondaryColor: PALETTE.roseBright
        };
      }
      this._emitScoreUpdate();
    } else if (event.type === 'score_update' && typeof event.score === 'number') {
      this.p2Score = event.score;
      this._emitScoreUpdate();
    }
  }

  /**
   * Soporte para cruceta táctil móvil ('up' | 'down' | 'left' | 'right' | 'action')
   */
  handleTouchDirection(dir) {
    if (!this.isRunning && dir === 'action') {
      this.start();
      return;
    }
    if (this.isGameOver && dir === 'action') {
      this.start();
      return;
    }
    if (!this.snakeP1) return;
    const map = {
      up: { x: 0, y: -1 },
      down: { x: 0, y: 1 },
      left: { x: -1, y: 0 },
      right: { x: 1, y: 0 }
    };
    if (map[dir]) {
      this._queueDirection(this.snakeP1, map[dir]);
    } else if (dir === 'action') {
      this.togglePause();
    }
  }

  getState() {
    return {
      score: this.score,
      p2Score: this.p2Score,
      mode: this.mode,
      scenarioId: this.scenarioId,
      difficulty: this.difficulty,
      isRunning: this.isRunning,
      isPaused: this.isPaused,
      stats: {
        ingredientsCollected: this.stats.ingredientsCollected,
        p2IngredientsCollected: this.stats.p2IngredientsCollected,
        maxCombo: this.stats.maxCombo,
        bottlesCollected: this.stats.bottlesCollected,
        starsCollected: this.stats.starsCollected,
        lastNote: this.stats.lastNote,
        feverActive: this.feverTimer > 0,
        combo: this.combo
      }
    };
  }

  destroy() {
    this.isRunning = false;
    this.isPaused = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this._detachListeners();
    if (this.audioCtx && typeof this.audioCtx.close === 'function') {
      this.audioCtx.close().catch(() => {});
      this.audioCtx = null;
    }
  }

  // =========================================================================
  // LÓGICA INTERNA DE JUEGO Y ACTUALIZACIÓN
  // =========================================================================

  _getStepInterval() {
    // Intervalo base según dificultad (segundos por celda)
    let base = 0.135;
    if (this.difficulty === 'fast') base = 0.098;
    if (this.difficulty === 'god') base = 0.076;

    // Ligera aceleración progresiva conforme crece la estela
    const speedUp = Math.min(0.028, this.stats.ingredientsCollected * 0.0008);
    let interval = Math.max(0.055, base - speedUp);

    // Durante Fiebre de los Dioses la serpiente se desliza un 15% más ágil
    if (this.feverTimer > 0) {
      interval *= 0.86;
    }
    return interval;
  }

  _update(dt) {
    this.elapsedTime += dt;

    // Sacudida de cámara
    if (this.shakeTimer > 0) {
      this.shakeTimer = Math.max(0, this.shakeTimer - dt);
    }

    // Temporizador de racha de combo (4 segundos)
    if (this.combo > 1 && this.comboTimer > 0) {
      this.comboTimer -= dt;
      if (this.comboTimer <= 0) {
        this.combo = 1;
        this.comboTimer = 0;
        this._emitScoreUpdate();
      }
    }

    // Temporizador de Fiebre de los Dioses (8 segundos)
    if (this.feverTimer > 0) {
      this.feverTimer = Math.max(0, this.feverTimer - dt);
      if (this.feverTimer === 0) {
        this._addFloatingText('FIN FIEBRE ASTRAL', this.cols / 2, 2, PALETTE.goldSoft);
        this._emitScoreUpdate();
      }
    }
    if (this.p2FeverTimer > 0) {
      this.p2FeverTimer = Math.max(0, this.p2FeverTimer - dt);
    }

    // Escudos de reaparición en modo 2P / VS IA
    if (this.snakeP1 && this.snakeP1.respawnShield > 0) {
      this.snakeP1.respawnShield = Math.max(0, this.snakeP1.respawnShield - dt);
    }
    if (this.snakeP2 && this.snakeP2.respawnShield > 0) {
      this.snakeP2.respawnShield = Math.max(0, this.snakeP2.respawnShield - dt);
    }

    // Temporizador de partida en modos de duelo (2p_local y vs_ai)
    if (this.mode === '2p_local' || this.mode === 'vs_ai') {
      this.matchTimeRemaining = Math.max(0, this.matchTimeRemaining - dt);
      if (this.matchTimeRemaining <= 0) {
        this._triggerGameOver('tiempo_agotado');
        return;
      }
    }

    // Expiración de ítem especial (Frasco QM o Estrella Citlalli)
    if (this.specialItem) {
      this.specialItem.remaining -= dt;
      if (this.specialItem.remaining <= 0) {
        this.specialItem = null;
      }
    }

    // Reubicación periódica de humo oscuro en dificultad Dios
    if (this.difficulty === 'god') {
      this.obstacleTimer += dt;
      if (this.obstacleTimer >= 12.0) {
        this.obstacleTimer = 0;
        this._shiftOneObstacle();
      }
    }

    // Avance de Serpiente P1
    const stepP1 = this._getStepInterval();
    this.moveAccumulatorP1 += dt;
    while (this.moveAccumulatorP1 >= stepP1 && !this.isGameOver) {
      this.moveAccumulatorP1 -= stepP1;
      this._stepSnake(this.snakeP1, true);
    }

    // Avance de Serpiente P2 / IA Jaguar
    if (this.snakeP2 && this.snakeP2.alive && !this.isGameOver) {
      const stepP2 = this.snakeP2.isAI ? stepP1 * 1.04 : stepP1;
      this.moveAccumulatorP2 += dt;
      while (this.moveAccumulatorP2 >= stepP2 && !this.isGameOver) {
        this.moveAccumulatorP2 -= stepP2;
        if (this.snakeP2.isAI) {
          this._computeJaguarAIDirection();
        }
        this._stepSnake(this.snakeP2, false);
      }
    }

    // Actualizar partículas, estelas y textos flotantes
    this._updateVFX(dt);
  }

  _stepSnake(snake, isP1) {
    if (!snake || !snake.alive) return;

    // Procesar siguiente dirección en cola
    if (snake.nextDirs.length > 0) {
      const candidate = snake.nextDirs.shift();
      if (candidate.x !== -snake.dir.x || candidate.y !== -snake.dir.y) {
        snake.dir = candidate;
      }
    }

    const head = snake.segments[0];
    let nextX = head.x + snake.dir.x;
    let nextY = head.y + snake.dir.y;

    const hasFever = isP1 ? this.feverTimer > 0 : this.p2FeverTimer > 0;

    // Verificar bordes: En Fiebre de los Dioses hay teletransporte astral (wrap-around)
    if (nextX < 0 || nextX >= this.cols || nextY < 0 || nextY >= this.rows) {
      if (hasFever) {
        nextX = (nextX + this.cols) % this.cols;
        nextY = (nextY + this.rows) % this.rows;
        this._spawnBurst(nextX, nextY, PALETTE.goldBright, 10, 'astral');
        this._playSound('teleport');
      } else {
        this._handleSnakeCollision(snake, isP1, 'borde');
        return;
      }
    }

    // Verificar obstáculos de humo oscuro
    const obstacleIndex = this.obstacles.findIndex((o) => o.x === nextX && o.y === nextY);
    if (obstacleIndex !== -1) {
      if (hasFever) {
        // Purifica el humo oscuro con luz astral
        const obs = this.obstacles[obstacleIndex];
        this.obstacles.splice(obstacleIndex, 1);
        if (isP1) {
          this.score += 25;
          this._addFloatingText('+25 HUMO PURIFICADO', obs.x, obs.y, PALETTE.turquoise);
        } else {
          this.p2Score += 25;
        }
        this._spawnBurst(obs.x, obs.y, PALETTE.turquoise, 16, 'astral');
        this._playSound('powerup');
        this._emitScoreUpdate();
      } else if (snake.respawnShield <= 0) {
        this._handleSnakeCollision(snake, isP1, 'humo_oscuro');
        return;
      }
    }

    // Verificar colisión con el propio cuerpo o con la otra serpiente
    if (snake.respawnShield <= 0 && !hasFever) {
      const hitsSelf = snake.segments
        .slice(0, -1)
        .some((seg) => seg.x === nextX && seg.y === nextY);
      if (hitsSelf) {
        this._handleSnakeCollision(snake, isP1, 'propio_cuerpo');
        return;
      }

      const otherSnake = isP1 ? this.snakeP2 : this.snakeP1;
      if (otherSnake && otherSnake.alive && otherSnake.respawnShield <= 0) {
        const hitsOther = otherSnake.segments.some((seg) => seg.x === nextX && seg.y === nextY);
        if (hitsOther) {
          this._handleSnakeCollision(snake, isP1, 'choque_rival');
          return;
        }
      }
    }

    // Dejar estela luminosa detrás
    const tail = snake.segments[snake.segments.length - 1];
    this.trails.push({
      x: tail.x,
      y: tail.y,
      color: hasFever ? PALETTE.goldBright : snake.primaryColor,
      alpha: hasFever ? 0.65 : 0.32,
      life: hasFever ? 0.55 : 0.28,
      maxLife: hasFever ? 0.55 : 0.28
    });

    // Avanzar cabeza
    snake.segments.unshift({ x: nextX, y: nextY });

    // Comprobar recolección de ingrediente normal
    let grew = false;
    const itemIdx = this.items.findIndex((it) => it.x === nextX && it.y === nextY);
    if (itemIdx !== -1) {
      const collected = this.items[itemIdx];
      this.items.splice(itemIdx, 1);
      this._collectItem(snake, isP1, collected);
      this._spawnIngredient();
      grew = true;
    }

    // Comprobar recolección de reliquia especial (Frasco QM o Estrella Citlalli)
    if (this.specialItem && this.specialItem.x === nextX && this.specialItem.y === nextY) {
      const special = this.specialItem;
      this.specialItem = null;
      this._collectItem(snake, isP1, special);
      grew = true;
    }

    if (!grew) {
      snake.segments.pop();
    }

    // Si estamos en modo online y es P1, difundir estado
    if (isP1 && this.mode === 'online' && typeof this.callbacks.onBroadcastState === 'function') {
      try {
        this.callbacks.onBroadcastState({
          type: 'snake_state',
          game: 'snake',
          score: this.score,
          segments: this.snakeP1.segments.slice(0, 12)
        });
      } catch (_) {}
    }
  }

  _collectItem(snake, isP1, item) {
    const def = INGREDIENTS[item.type] || INGREDIENTS.mandarin;

    if (isP1) {
      // Actualizar combo si come dentro de la ventana de 4s
      if (this.comboTimer > 0) {
        this.combo = Math.min(4, this.combo + 1);
      } else {
        this.combo = 1;
      }
      this.comboTimer = this.comboMaxWindow;
      if (this.combo > this.stats.maxCombo) {
        this.stats.maxCombo = this.combo;
      }

      const feverMult = this.feverTimer > 0 ? 2 : 1;
      const totalMultiplier = this.combo * feverMult;
      const earned = def.points * totalMultiplier;
      this.score += earned;
      this.stats.ingredientsCollected += 1;
      this.stats.lastNote = def.name;

      if (item.type === 'bottle') {
        this.stats.bottlesCollected += 1;
        this._triggerShake(6, 0.28);
      } else if (item.type === 'star') {
        this.stats.starsCollected += 1;
        this.feverTimer = this.feverDuration;
        this._triggerShake(8, 0.35);
        this._addFloatingText('¡FIEBRE DE LOS DIOSES x2!', item.x, Math.max(1, item.y - 1), PALETTE.goldBright);
      }

      const multTag = totalMultiplier > 1 ? ` (x${totalMultiplier})` : '';
      this._addFloatingText(`+${earned} ${def.name.split(' ')[0]}${multTag}`, item.x, item.y, def.color);

      // Desbloquear Lore Olfativo para la UI
      if (!this.stats.unlockedNotes.has(def.id)) {
        this.stats.unlockedNotes.add(def.id);
        if (typeof this.callbacks.onLoreUnlock === 'function') {
          try {
            this.callbacks.onLoreUnlock({
              id: def.id,
              name: def.name,
              category: def.category,
              lore: def.lore,
              color: def.color,
              points: def.points
            });
          } catch (_) {}
        }
      }
    } else {
      // Recolectado por P2 o IA Jaguar
      const feverMult = this.p2FeverTimer > 0 ? 2 : 1;
      const earned = def.points * feverMult;
      this.p2Score += earned;
      this.stats.p2IngredientsCollected += 1;
      if (item.type === 'star') {
        this.p2FeverTimer = this.feverDuration;
      }
      this._addFloatingText(`+${earned}`, item.x, item.y, snake.secondaryColor);
    }

    // Efectos de partículas y sonido
    this._spawnBurst(item.x, item.y, def.color, item.isSpecial ? 26 : 14, def.sparkType);
    this._playSound(item.isSpecial ? 'powerup' : 'collect', this.combo);

    // Cada 4 ingredientes recolectados en total, invocar el Frasco Citlalli QM o la Estrella de Citlalli
    const totalCollected = this.stats.ingredientsCollected + this.stats.p2IngredientsCollected;
    if (totalCollected > 0 && totalCollected % 4 === 0 && !this.specialItem) {
      this._spawnSpecialRelic(totalCollected % 8 === 0 ? 'star' : 'bottle');
    }

    this._emitScoreUpdate();
  }

  _handleSnakeCollision(snake, isP1, reason) {
    this._triggerShake(9, 0.35);
    const head = snake.segments[0];
    this._spawnBurst(head.x, head.y, snake.secondaryColor, 24, 'crash');
    this._playSound('crash');

    // En modo 1P termina la partida de inmediato
    if (this.mode === '1p' || this.mode === 'online') {
      snake.alive = false;
      this._triggerGameOver(reason);
      return;
    }

    // En modo 2P Local o VS IA: sistema de 3 vidas o penalización y reaparición
    snake.lives -= 1;
    if (snake.lives <= 0) {
      snake.alive = false;
      this._triggerGameOver(isP1 ? 'p1_eliminado' : 'p2_eliminado');
      return;
    }

    // Reaparecer con escudo astral temporal de 2.5 segundos
    const startX = isP1 ? 4 : this.cols - 5;
    const startY = isP1 ? 4 : this.rows - 5;
    const dirX = isP1 ? 1 : -1;
    snake.segments = [
      { x: startX, y: startY },
      { x: startX - dirX, y: startY },
      { x: startX - dirX * 2, y: startY }
    ];
    snake.dir = { x: dirX, y: 0 };
    snake.nextDirs = [];
    snake.respawnShield = 2.5;

    if (isP1) {
      this.combo = 1;
      this.comboTimer = 0;
      this._addFloatingText(`¡CUIDADO! (${snake.lives} VIDAS)`, startX, startY, PALETTE.roseBright);
    } else {
      this._addFloatingText(`${snake.name}: ${snake.lives} VIDAS`, startX, startY, snake.secondaryColor);
    }
    this._emitScoreUpdate();
  }

  _triggerGameOver(reason) {
    if (this.isGameOver) return;
    this.isGameOver = true;
    this.isRunning = false;
    this._playSound('gameover');

    let winner = 'p1';
    if (this.mode === '2p_local' || this.mode === 'vs_ai') {
      if (!this.snakeP1.alive && this.snakeP2 && this.snakeP2.alive) {
        winner = 'p2';
      } else if (this.snakeP1.alive && this.snakeP2 && !this.snakeP2.alive) {
        winner = 'p1';
      } else if (this.p2Score > this.score) {
        winner = 'p2';
      } else if (this.p2Score === this.score) {
        winner = 'draw';
      }
      if (winner === 'p1') this.winnerText = '¡VICTORIA PARA QUETZAL DORADO (J1)!';
      else if (winner === 'p2') this.winnerText = `¡VICTORIA PARA ${this.snakeP2.name.toUpperCase()}!`;
      else this.winnerText = '¡EMPATE ASTRAL EN EL TABLERO!';
    } else {
      this.winnerText = `ESTELA COMPLETADA — ${this.score} PTS`;
    }

    if (typeof this.callbacks.onGameOver === 'function') {
      try {
        this.callbacks.onGameOver({
          game: 'snake',
          score: this.score,
          p1Score: this.score,
          p2Score: this.p2Score,
          winner,
          reason,
          mode: this.mode,
          scenarioId: this.scenarioId,
          difficulty: this.difficulty,
          stats: {
            ingredientsCollected: this.stats.ingredientsCollected,
            maxCombo: this.stats.maxCombo,
            bottlesCollected: this.stats.bottlesCollected,
            starsCollected: this.stats.starsCollected
          }
        });
      } catch (_) {}
    }
  }

  /**
   * Heurística inteligente para "Sombra del Jaguar" (Modo VS IA)
   */
  _computeJaguarAIDirection() {
    const ai = this.snakeP2;
    if (!ai || !ai.alive || ai.segments.length === 0) return;

    const head = ai.segments[0];
    const possibleDirs = [
      { x: 1, y: 0 },
      { x: -1, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: -1 }
    ].filter((d) => !(d.x === -ai.dir.x && d.y === -ai.dir.y));

    // Elegir objetivo de mayor valor/cercanía
    const targets = [...this.items];
    if (this.specialItem) targets.push(this.specialItem);

    let bestTarget = targets[0] || { x: Math.floor(this.cols / 2), y: Math.floor(this.rows / 2) };
    let bestTargetScore = -Infinity;

    for (const t of targets) {
      const def = INGREDIENTS[t.type] || INGREDIENTS.mandarin;
      const dist = Math.abs(t.x - head.x) + Math.abs(t.y - head.y);
      const val = def.points * (t.isSpecial ? 2.5 : 1) - dist * 2.2;
      if (val > bestTargetScore) {
        bestTargetScore = val;
        bestTarget = t;
      }
    }

    // Evaluar seguridad y distancia de cada dirección candidata
    let chosenDir = ai.dir;
    let bestDirScore = -Infinity;

    for (const d of possibleDirs) {
      const nx = head.x + d.x;
      const ny = head.y + d.y;

      // Evitar paredes
      if (nx < 0 || nx >= this.cols || ny < 0 || ny >= this.rows) continue;

      // Evitar obstáculos de humo
      if (this.obstacles.some((o) => o.x === nx && o.y === ny)) continue;

      // Evitar colisión con sí misma o con P1
      const hitsSelf = ai.segments.slice(0, -1).some((s) => s.x === nx && s.y === ny);
      if (hitsSelf) continue;

      const hitsP1 =
        this.snakeP1 &&
        this.snakeP1.alive &&
        this.snakeP1.segments.some((s) => s.x === nx && s.y === ny);
      if (hitsP1) continue;

      // Contar celdas libres alrededor de (nx, ny) para no encerrarse
      let openNeighbors = 0;
      for (const nd of [
        { x: 1, y: 0 },
        { x: -1, y: 0 },
        { x: 0, y: 1 },
        { x: 0, y: -1 }
      ]) {
        const tx = nx + nd.x;
        const ty = ny + nd.y;
        if (
          tx >= 0 &&
          tx < this.cols &&
          ty >= 0 &&
          ty < this.rows &&
          !ai.segments.some((s) => s.x === tx && s.y === ty) &&
          !this.obstacles.some((o) => o.x === tx && o.y === ty)
        ) {
          openNeighbors += 1;
        }
      }

      const distToTarget = Math.abs(bestTarget.x - nx) + Math.abs(bestTarget.y - ny);
      const dirScore = -distToTarget * 3 + openNeighbors * 4 + (Math.random() * 0.8);

      if (dirScore > bestDirScore) {
        bestDirScore = dirScore;
        chosenDir = d;
      }
    }

    ai.dir = chosenDir;
  }

  // =========================================================================
  // GENERACIÓN DE INGREDIENTES Y OBSTÁCULOS
  // =========================================================================

  _isCellOccupied(x, y) {
    if (this.snakeP1 && this.snakeP1.segments.some((s) => s.x === x && s.y === y)) return true;
    if (this.snakeP2 && this.snakeP2.segments.some((s) => s.x === x && s.y === y)) return true;
    if (this.items.some((i) => i.x === x && i.y === y)) return true;
    if (this.specialItem && this.specialItem.x === x && this.specialItem.y === y) return true;
    if (this.obstacles.some((o) => o.x === x && o.y === y)) return true;
    return false;
  }

  _getRandomFreeCell(margin = 1) {
    for (let attempt = 0; attempt < 120; attempt++) {
      const x = margin + Math.floor(Math.random() * (this.cols - margin * 2));
      const y = margin + Math.floor(Math.random() * (this.rows - margin * 2));
      if (!this._isCellOccupied(x, y)) {
        return { x, y };
      }
    }
    return { x: Math.floor(this.cols / 2), y: Math.floor(this.rows / 2) };
  }

  _spawnIngredient() {
    const pool = ['mandarin', 'rose', 'jasmine', 'vanilla', 'amber'];
    const totalWeight = pool.reduce((acc, k) => acc + INGREDIENTS[k].weight, 0);
    let r = Math.random() * totalWeight;
    let selected = 'mandarin';
    for (const k of pool) {
      r -= INGREDIENTS[k].weight;
      if (r <= 0) {
        selected = k;
        break;
      }
    }
    const pos = this._getRandomFreeCell(1);
    this.items.push({
      x: pos.x,
      y: pos.y,
      type: selected,
      spawnTime: this.elapsedTime
    });
  }

  _spawnSpecialRelic(type = 'bottle') {
    const def = INGREDIENTS[type];
    const pos = this._getRandomFreeCell(2);
    this.specialItem = {
      x: pos.x,
      y: pos.y,
      type,
      isSpecial: true,
      duration: def.duration,
      remaining: def.duration,
      spawnTime: this.elapsedTime
    };
    this._spawnBurst(pos.x, pos.y, def.color, 18, 'gold');
    this._playSound('relic_spawn');
  }

  _spawnObstaclesForDifficulty() {
    this.obstacles = [];
    let count = 0;
    if (this.difficulty === 'fast') count = 4;
    if (this.difficulty === 'god') count = 9;

    for (let i = 0; i < count; i++) {
      const cell = this._getRandomFreeCell(3);
      // Evitar poner obstáculos justo frente a la cabeza inicial de P1 o P2
      if (cell.y === 8 && (cell.x < 10 || cell.x > this.cols - 10)) continue;
      this.obstacles.push({
        x: cell.x,
        y: cell.y,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  _shiftOneObstacle() {
    if (this.obstacles.length === 0) return;
    const idx = Math.floor(Math.random() * this.obstacles.length);
    const cell = this._getRandomFreeCell(2);
    // Evitar aparecer a menos de 2 celdas de la cabeza de P1
    if (this.snakeP1 && this.snakeP1.segments.length > 0) {
      const h = this.snakeP1.segments[0];
      if (Math.abs(cell.x - h.x) + Math.abs(cell.y - h.y) <= 2) return;
    }
    this.obstacles[idx] = { x: cell.x, y: cell.y, phase: Math.random() * Math.PI * 2 };
  }

  // =========================================================================
  // CONTROLES DE TECLADO
  // =========================================================================

  _queueDirection(snake, newDir) {
    if (!snake || !snake.alive) return;
    const lastScheduled = snake.nextDirs.length > 0 ? snake.nextDirs[snake.nextDirs.length - 1] : snake.dir;
    if (newDir.x === -lastScheduled.x && newDir.y === -lastScheduled.y) return;
    if (newDir.x === lastScheduled.x && newDir.y === lastScheduled.y) return;
    if (snake.nextDirs.length < 2) {
      snake.nextDirs.push(newDir);
    }
  }

  _handleKeyDown(e) {
    // Evitar capturar teclas si el usuario está escribiendo en un input o textarea
    const tag = e.target && e.target.tagName ? e.target.tagName.toLowerCase() : '';
    if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

    const key = e.key.toLowerCase();

    if (key === 'p' || key === 'escape') {
      if (this.isRunning) {
        e.preventDefault();
        this.togglePause();
      }
      return;
    }

    if ((key === ' ' || key === 'enter') && (!this.isRunning || this.isGameOver)) {
      e.preventDefault();
      this.start();
      return;
    }

    if (!this.isRunning || this.isPaused) return;

    // Controles WASD (Siempre para Jugador 1)
    if (key === 'w') {
      e.preventDefault();
      this._queueDirection(this.snakeP1, { x: 0, y: -1 });
    } else if (key === 's') {
      e.preventDefault();
      this._queueDirection(this.snakeP1, { x: 0, y: 1 });
    } else if (key === 'a') {
      e.preventDefault();
      this._queueDirection(this.snakeP1, { x: -1, y: 0 });
    } else if (key === 'd') {
      e.preventDefault();
      this._queueDirection(this.snakeP1, { x: 1, y: 0 });
    }

    // Controles de Flechas: En modo 2P Local controlan a la Serpiente Oro Rosa (J2);
    // en otros modos controlan también al Jugador 1
    const arrowTarget = this.mode === '2p_local' && this.snakeP2 ? this.snakeP2 : this.snakeP1;
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      this._queueDirection(arrowTarget, { x: 0, y: -1 });
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      this._queueDirection(arrowTarget, { x: 0, y: 1 });
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      this._queueDirection(arrowTarget, { x: -1, y: 0 });
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      this._queueDirection(arrowTarget, { x: 1, y: 0 });
    }
  }

  // =========================================================================
  // RENDERIZADO PIXEL ART EN CANVAS
  // =========================================================================

  _getBoardMetrics() {
    const w = this.canvas ? this.canvas.width : 768;
    const h = this.canvas ? this.canvas.height : 534;
    const padX = 24;
    const padBottom = 20;
    const boardY = this.hudHeight + 10;
    const availW = Math.max(240, w - padX * 2);
    const availH = Math.max(160, h - boardY - padBottom);
    const cellSize = Math.floor(Math.min(availW / this.cols, availH / this.rows));
    const boardW = cellSize * this.cols;
    const boardH = cellSize * this.rows;
    const boardX = Math.floor((w - boardW) / 2);

    return {
      canvasW: w,
      canvasH: h,
      boardX,
      boardY,
      boardW,
      boardH,
      cellW: cellSize,
      cellH: cellSize
    };
  }

  _renderFrame(dt) {
    if (!this.ctx || !this.canvas) return;
    const ctx = this.ctx;
    const m = this._getBoardMetrics();

    ctx.save();

    // Efecto de screen shake si está activo
    if (this.shakeTimer > 0) {
      const sx = (Math.random() - 0.5) * this.shakeIntensity * 2;
      const sy = (Math.random() - 0.5) * this.shakeIntensity * 2;
      ctx.translate(sx, sy);
    }

    // 1. Fondo Dinámico del Escenario Seleccionado
    this._drawScenarioBackdrop(ctx, m.canvasW, m.canvasH);

    // 2. Tablero Semitransparente Azul Marino con Borde Dorado y Grecas Prehispánicas
    this._drawLuxuryBoard(ctx, m);

    // 3. Estelas Luminosas de las Serpientes
    this._drawTrails(ctx, m);

    // 4. Obstáculos de Humo Oscuro (dificultad Fast / God)
    this._drawObstacles(ctx, m);

    // 5. Ingredientes Olfativos y Reliquias Especiales
    this._drawItems(ctx, m);

    // 6. Serpientes (Rival Online, P2/IA Jaguar y P1 Quetzal Dorado)
    if (this.remoteSnake) {
      this._drawSnake(ctx, m, this.remoteSnake, false);
    }
    if (this.snakeP2 && this.snakeP2.alive) {
      this._drawSnake(ctx, m, this.snakeP2, false);
    }
    if (this.snakeP1 && this.snakeP1.alive) {
      this._drawSnake(ctx, m, this.snakeP1, true);
    }

    // 7. Partículas y Textos Flotantes
    this._drawParticlesAndPopups(ctx, m);

    // 8. HUD Superior Integrado
    this._drawHUD(ctx, m);

    // 9. Overlays de Pausa / Inicio / Fin de Partida
    if (!this.isRunning && !this.isGameOver) {
      this._drawOverlayModal(
        ctx,
        m,
        'LA VÍBORITA: ESTELA DE LOS DIOSES',
        'Recolecta las notas olfativas de CITLALLI y desata la Fiebre Astral',
        'PRESIONA ESPACIO O TOCA PARA INICIAR'
      );
    } else if (this.isPaused) {
      this._drawOverlayModal(
        ctx,
        m,
        'PAUSA ASTRAL',
        'El aroma permanece suspendido en el cosmos',
        'PRESIONA P O ESPACIO PARA CONTINUAR'
      );
    } else if (this.isGameOver) {
      this._drawOverlayModal(
        ctx,
        m,
        'FIN DE LA PARTIDA',
        this.winnerText || `Puntaje Final: ${this.score} pts`,
        'PRESIONA ESPACIO O TOCA PARA JUGAR DE NUEVO'
      );
    }

    ctx.restore();
  }

  _drawScenarioBackdrop(ctx, w, h) {
    // Si window.CitlalliVFX expone drawScenarioBackground / drawScenario, lo invocamos con seguridad
    const vfx = this.externalVFX || (typeof window !== 'undefined' ? window.CitlalliVFX : null);
    let drewExternal = false;
    if (vfx) {
      try {
        if (typeof vfx.drawScenarioBackground === 'function') {
          vfx.drawScenarioBackground(ctx, w, h, this.scenarioId, this.elapsedTime * 1000, this.elapsedTime * 18);
          drewExternal = true;
        } else if (typeof vfx.drawScenario === 'function') {
          vfx.drawScenario(ctx, this.scenarioId, w, h, this.elapsedTime);
          drewExternal = true;
        } else if (typeof vfx.renderScenario === 'function') {
          vfx.renderScenario(ctx, this.scenarioId, w, h, this.elapsedTime);
          drewExternal = true;
        }
      } catch (_) {}
    }

    if (!drewExternal) {
      // Renderizador propio de los 4 escenarios dinámicos Citlalli
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      if (this.scenarioId === 'hidalgo') {
        grad.addColorStop(0, '#07122B');
        grad.addColorStop(0.55, '#16284C');
        grad.addColorStop(1, '#2D3A3A');
      } else if (this.scenarioId === 'jaguar') {
        grad.addColorStop(0, '#090614');
        grad.addColorStop(0.6, '#1B112C');
        grad.addColorStop(1, '#2E1A12');
      } else if (this.scenarioId === 'velvet') {
        grad.addColorStop(0, '#050918');
        grad.addColorStop(0.5, '#0A1128');
        grad.addColorStop(1, '#141E42');
      } else {
        // penthouse
        grad.addColorStop(0, '#040711');
        grad.addColorStop(0.65, '#0D1936');
        grad.addColorStop(1, '#1F2942');
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Estrellas / Luciérnagas ambientales
      for (const st of this.bgStars) {
        const pulse = 0.4 + 0.6 * Math.abs(Math.sin(this.elapsedTime * st.speed + st.phase));
        ctx.fillStyle = this.scenarioId === 'hidalgo' ? `rgba(255, 215, 0, ${pulse * 0.65})` : `rgba(255, 253, 245, ${pulse * 0.7})`;
        ctx.fillRect(Math.floor(st.x * w), Math.floor(st.y * h), st.size, st.size);
      }

      // Detalles icónicos por escenario
      if (this.scenarioId === 'jaguar') {
        // Silueta de pirámide escalonada al fondo
        ctx.fillStyle = 'rgba(212, 175, 55, 0.08)';
        for (let step = 0; step < 5; step++) {
          const sw = 260 - step * 44;
          const sh = 18;
          ctx.fillRect(Math.floor(w / 2 - sw / 2), h - (step + 1) * sh, sw, sh);
        }
      } else if (this.scenarioId === 'penthouse') {
        // Skyline nocturno dorado sutil
        ctx.fillStyle = 'rgba(212, 175, 55, 0.07)';
        const towers = [0.08, 0.18, 0.78, 0.88];
        towers.forEach((tx, idx) => {
          const tw = 42;
          const th = 90 + (idx % 2) * 35;
          ctx.fillRect(Math.floor(tx * w), h - th, tw, th);
        });
      }
    }
  }

  _drawLuxuryBoard(ctx, m) {
    const { boardX, boardY, boardW, boardH, cellW, cellH } = m;

    // Resplandor exterior si Fiebre de los Dioses está activa
    if (this.feverTimer > 0) {
      const glowPulse = 0.5 + 0.5 * Math.sin(this.elapsedTime * 8);
      ctx.strokeStyle = `rgba(255, 215, 0, ${0.45 + glowPulse * 0.45})`;
      ctx.lineWidth = 6;
      ctx.strokeRect(boardX - 5, boardY - 5, boardW + 10, boardH + 10);
    }

    // Fondo azul marino semitransparente de lujo
    ctx.fillStyle = 'rgba(8, 14, 34, 0.84)';
    ctx.fillRect(boardX, boardY, boardW, boardH);

    // Patrón de cuadrícula pixel art en damero sutil
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if ((r + c) % 2 === 0) {
          ctx.fillStyle = 'rgba(212, 175, 55, 0.032)';
          ctx.fillRect(boardX + c * cellW, boardY + r * cellH, cellW, cellH);
        }
      }
    }

    // Líneas finas de cuadrícula
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.075)';
    ctx.lineWidth = 1;
    for (let c = 1; c < this.cols; c++) {
      const x = Math.floor(boardX + c * cellW) + 0.5;
      ctx.beginPath();
      ctx.moveTo(x, boardY);
      ctx.lineTo(x, boardY + boardH);
      ctx.stroke();
    }
    for (let r = 1; r < this.rows; r++) {
      const y = Math.floor(boardY + r * cellH) + 0.5;
      ctx.beginPath();
      ctx.moveTo(boardX, y);
      ctx.lineTo(boardX + boardW, y);
      ctx.stroke();
    }

    // Marco Dorado Doble con Grecas Prehispánicas en las esquinas y bordes
    ctx.strokeStyle = PALETTE.goldImperial;
    ctx.lineWidth = 2;
    ctx.strokeRect(boardX - 2, boardY - 2, boardW + 4, boardH + 4);

    ctx.strokeStyle = 'rgba(230, 194, 184, 0.55)';
    ctx.lineWidth = 1;
    ctx.strokeRect(boardX - 6, boardY - 6, boardW + 12, boardH + 12);

    // Grecas escalonadas (xicalcoliuhqui simplificado) a lo largo del borde superior e inferior
    ctx.fillStyle = PALETTE.goldImperial;
    const stepCount = Math.floor(boardW / 32);
    for (let i = 0; i < stepCount; i++) {
      const gx = boardX + i * 32 + 8;
      // Greca superior
      ctx.fillRect(gx, boardY - 5, 12, 2);
      ctx.fillRect(gx + 4, boardY - 7, 4, 2);
      // Greca inferior
      ctx.fillRect(gx, boardY + boardH + 3, 12, 2);
      ctx.fillRect(gx + 4, boardY + boardH + 5, 4, 2);
    }

    // Esquinas ornamentales de estrella
    const corners = [
      [boardX - 6, boardY - 6],
      [boardX + boardW - 2, boardY - 6],
      [boardX - 6, boardY + boardH - 2],
      [boardX + boardW - 2, boardY + boardH - 2]
    ];
    ctx.fillStyle = PALETTE.goldBright;
    for (const [cx, cy] of corners) {
      ctx.fillRect(cx, cy, 8, 8);
      ctx.fillStyle = PALETTE.navyDeep;
      ctx.fillRect(cx + 2, cy + 2, 4, 4);
      ctx.fillStyle = PALETTE.goldBright;
    }
  }

  _drawTrails(ctx, m) {
    for (const tr of this.trails) {
      const px = m.boardX + tr.x * m.cellW;
      const py = m.boardY + tr.y * m.cellH;
      const ratio = Math.max(0, tr.life / tr.maxLife);
      ctx.save();
      ctx.globalAlpha = tr.alpha * ratio;
      ctx.fillStyle = tr.color;
      const inset = Math.floor(m.cellW * (0.32 - 0.12 * ratio));
      ctx.fillRect(px + inset, py + inset, m.cellW - inset * 2, m.cellH - inset * 2);
      ctx.restore();
    }
  }

  _drawObstacles(ctx, m) {
    const vfx = this.externalVFX || (typeof window !== 'undefined' ? window.CitlalliVFX : null);
    for (const obs of this.obstacles) {
      const px = m.boardX + obs.x * m.cellW;
      const py = m.boardY + obs.y * m.cellH;
      const pulse = 0.7 + 0.3 * Math.sin(this.elapsedTime * 4 + obs.phase);

      if (vfx && typeof vfx.drawSprite === 'function') {
        try {
          vfx.drawSprite(ctx, 'smoke_hazard', px + m.cellW / 2, py + m.cellH / 2, m.cellW - 2, {
            centered: true,
            alpha: 0.85 * pulse
          });
          continue;
        } catch (_) {}
      }

      // Respaldo: Nube de humo oscuro pixel art
      ctx.fillStyle = 'rgba(42, 27, 61, 0.9)';
      ctx.fillRect(px + 2, py + 2, m.cellW - 4, m.cellH - 4);
      ctx.fillStyle = `rgba(107, 45, 92, ${0.75 * pulse})`;
      ctx.fillRect(px + 5, py + 5, m.cellW - 10, m.cellH - 10);

      // Ojos de obsidiana rojiza en el humo
      ctx.fillStyle = '#FF4500';
      const eyeY = py + Math.floor(m.cellH * 0.4);
      ctx.fillRect(px + Math.floor(m.cellW * 0.3), eyeY, 3, 3);
      ctx.fillRect(px + Math.floor(m.cellW * 0.62), eyeY, 3, 3);
    }
  }

  _drawItems(ctx, m) {
    const allItems = [...this.items];
    if (this.specialItem) allItems.push(this.specialItem);

    for (const item of allItems) {
      const def = INGREDIENTS[item.type] || INGREDIENTS.mandarin;
      const px = m.boardX + item.x * m.cellW;
      const py = m.boardY + item.y * m.cellH;
      const floatY = Math.round(Math.sin(this.elapsedTime * 5 + item.x) * 2);

      // Aura brillante pulsante debajo del sprite
      const pulse = 0.55 + 0.45 * Math.sin(this.elapsedTime * 6 + item.y);
      ctx.save();
      ctx.fillStyle = def.glow;
      ctx.globalAlpha = 0.35 + pulse * 0.35;
      ctx.fillRect(px + 1, py + 1 + floatY, m.cellW - 2, m.cellH - 2);
      ctx.restore();

      // Dibujar sprite pixel art
      this._drawIngredientSprite(ctx, item.type, px + 2, py + 2 + floatY, m.cellW - 4, def.color);

      // Si es reliquia temporal (Frasco QM o Estrella Citlalli), mostrar barra de tiempo dorada
      if (item.isSpecial && item.duration > 0) {
        const pct = Math.max(0, item.remaining / item.duration);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(px + 2, py + m.cellH - 4, m.cellW - 4, 3);
        ctx.fillStyle = item.type === 'star' ? PALETTE.goldBright : PALETTE.roseGold;
        ctx.fillRect(px + 2, py + m.cellH - 4, Math.floor((m.cellW - 4) * pct), 3);
      }
    }
  }

  _drawIngredientSprite(ctx, type, x, y, size, glowColor = '#D4AF37') {
    const vfx = this.externalVFX || (typeof window !== 'undefined' ? window.CitlalliVFX : null);
    if (vfx && typeof vfx.drawSprite === 'function') {
      try {
        vfx.drawSprite(ctx, type, x + size / 2, y + size / 2, size, {
          centered: true,
          glow: true,
          glowColor
        });
        return;
      } catch (_) {}
    }

    const spriteDef = PIXEL_SPRITES_12[type] || PIXEL_SPRITES_12.mandarin;
    const rows = spriteDef.grid.length;
    const cols = spriteDef.grid[0].length;
    const pxSize = Math.max(1, size / cols);

    for (let r = 0; r < rows; r++) {
      const line = spriteDef.grid[r];
      for (let c = 0; c < cols; c++) {
        const ch = line[c];
        if (ch !== '.' && spriteDef.palette[ch]) {
          ctx.fillStyle = spriteDef.palette[ch];
          ctx.fillRect(
            Math.floor(x + c * pxSize),
            Math.floor(y + r * pxSize),
            Math.ceil(pxSize),
            Math.ceil(pxSize)
          );
        }
      }
    }
  }

  _drawSnake(ctx, m, snake, isP1) {
    if (!snake.segments || snake.segments.length === 0) return;

    // Parpadeo si tiene escudo de reaparición
    if (snake.respawnShield > 0 && Math.floor(this.elapsedTime * 12) % 2 === 0) {
      ctx.save();
      ctx.globalAlpha = 0.45;
    }

    const hasFever = isP1 ? this.feverTimer > 0 : this.p2FeverTimer > 0;
    const len = snake.segments.length;

    // Dibujar segmentos desde la cola hacia la cabeza
    for (let i = len - 1; i >= 0; i--) {
      const seg = snake.segments[i];
      const px = m.boardX + seg.x * m.cellW;
      const py = m.boardY + seg.y * m.cellH;

      if (i === 0) {
        // CABEZA DE LA SERPIENTE (Quetzal Dorado / Oro Rosa / Jaguar)
        const headColor = hasFever
          ? (Math.floor(this.elapsedTime * 15) % 2 === 0 ? '#FFFDF5' : PALETTE.goldBright)
          : snake.primaryColor;

        ctx.fillStyle = headColor;
        ctx.fillRect(px + 1, py + 1, m.cellW - 2, m.cellH - 2);

        // Penacho / Corona real en el borde posterior de la cabeza
        ctx.fillStyle = snake.accentColor || PALETTE.turquoise;
        ctx.fillRect(px + 3, py + 3, m.cellW - 6, m.cellH - 6);
        ctx.fillStyle = headColor;
        ctx.fillRect(px + 4, py + 4, m.cellW - 8, m.cellH - 8);

        // Ojos brillantes orientados según la dirección
        ctx.fillStyle = snake.isAI ? PALETTE.amber : '#0A1128';
        const eyeSize = Math.max(2, Math.floor(m.cellW * 0.16));
        const d = snake.dir || { x: 1, y: 0 };
        let e1x = px + Math.floor(m.cellW * 0.65);
        let e1y = py + Math.floor(m.cellH * 0.22);
        let e2x = px + Math.floor(m.cellW * 0.65);
        let e2y = py + Math.floor(m.cellH * 0.65);

        if (d.x === -1) {
          e1x = e2x = px + Math.floor(m.cellW * 0.2);
        } else if (d.y === -1) {
          e1x = px + Math.floor(m.cellW * 0.22);
          e2x = px + Math.floor(m.cellW * 0.65);
          e1y = e2y = py + Math.floor(m.cellH * 0.2);
        } else if (d.y === 1) {
          e1x = px + Math.floor(m.cellW * 0.22);
          e2x = px + Math.floor(m.cellW * 0.65);
          e1y = e2y = py + Math.floor(m.cellH * 0.68);
        }
        ctx.fillRect(e1x, e1y, eyeSize, eyeSize);
        ctx.fillRect(e2x, e2y, eyeSize, eyeSize);

        // Lengua bífida animada cada cierto pulso
        if (Math.floor(this.elapsedTime * 6) % 2 === 0) {
          ctx.fillStyle = PALETTE.roseBright;
          const tx = px + Math.floor(m.cellW / 2) + d.x * Math.floor(m.cellW * 0.55);
          const ty = py + Math.floor(m.cellH / 2) + d.y * Math.floor(m.cellH * 0.55);
          ctx.fillRect(tx - 1, ty - 1, 3, 3);
        }
      } else {
        // SEGMENTO DEL CUERPO CON ESCAMAS PIXEL ART
        const isEven = i % 2 === 0;
        let bodyColor = isEven ? snake.primaryColor : snake.secondaryColor;
        if (hasFever) {
          const feverColors = [PALETTE.goldBright, PALETTE.turquoise, PALETTE.roseGold, PALETTE.amber];
          bodyColor = feverColors[(i + Math.floor(this.elapsedTime * 12)) % feverColors.length];
        }

        const pad = i === len - 1 ? 4 : 2;
        ctx.fillStyle = bodyColor;
        ctx.fillRect(px + pad, py + pad, m.cellW - pad * 2, m.cellH - pad * 2);

        // Manchas de jaguar o detalle de escama interior
        ctx.fillStyle = snake.isAI ? PALETTE.goldBright : 'rgba(255, 255, 255, 0.28)';
        const corePad = Math.floor(m.cellW * 0.34);
        ctx.fillRect(px + corePad, py + corePad, m.cellW - corePad * 2, m.cellH - corePad * 2);
      }
    }

    if (snake.respawnShield > 0 && Math.floor(this.elapsedTime * 12) % 2 === 0) {
      ctx.restore();
    }
  }

  _drawHUD(ctx, m) {
    const w = m.canvasW;

    // Barra superior de lujo
    ctx.fillStyle = 'rgba(6, 11, 25, 0.92)';
    ctx.fillRect(0, 0, w, this.hudHeight);
    ctx.fillStyle = PALETTE.goldImperial;
    ctx.fillRect(0, this.hudHeight - 2, w, 2);

    ctx.textBaseline = 'middle';

    // Marcador Jugador 1
    ctx.font = 'bold 14px "Press Start 2P", "Courier New", monospace';
    ctx.fillStyle = PALETTE.goldBright;
    ctx.textAlign = 'left';
    ctx.fillText(`J1 QUETZAL: ${this.score}`, 18, 18);

    ctx.font = '11px "Courier New", monospace';
    ctx.fillStyle = PALETTE.goldSoft;
    ctx.fillText(`NOTA: ${this.stats.lastNote || 'Mandarina'}`, 18, 38);

    // Centro: Multiplicador de Combo o Fiebre de los Dioses
    ctx.textAlign = 'center';
    if (this.feverTimer > 0) {
      ctx.font = 'bold 13px "Press Start 2P", "Courier New", monospace';
      ctx.fillStyle = PALETTE.turquoise;
      ctx.fillText(`★ FIEBRE DE LOS DIOSES x2 (${this.feverTimer.toFixed(1)}s) ★`, w / 2, 18);

      // Barra de Fiebre
      const bw = 180;
      const pct = Math.max(0, this.feverTimer / this.feverDuration);
      ctx.fillStyle = 'rgba(255,255,255,0.18)';
      ctx.fillRect(w / 2 - bw / 2, 32, bw, 8);
      ctx.fillStyle = PALETTE.goldBright;
      ctx.fillRect(w / 2 - bw / 2, 32, Math.floor(bw * pct), 8);
    } else {
      ctx.font = 'bold 13px "Courier New", monospace';
      ctx.fillStyle = this.combo > 1 ? PALETTE.amber : PALETTE.roseGold;
      ctx.fillText(`COMBO OLFATIVO x${this.combo}`, w / 2, 18);

      // Barra de ventana de 4s de combo
      const bw = 150;
      const pct = this.comboTimer > 0 ? Math.max(0, this.comboTimer / this.comboMaxWindow) : 0;
      ctx.fillStyle = 'rgba(255,255,255,0.12)';
      ctx.fillRect(w / 2 - bw / 2, 32, bw, 6);
      if (pct > 0) {
        ctx.fillStyle = this.combo >= 3 ? PALETTE.roseBright : PALETTE.goldBright;
        ctx.fillRect(w / 2 - bw / 2, 32, Math.floor(bw * pct), 6);
      }
    }

    // Derecha: Modo 2P / VS IA / Online o Récord de Dificultad
    ctx.textAlign = 'right';
    if (this.mode === '2p_local' || this.mode === 'vs_ai' || this.mode === 'online') {
      const p2Label = this.mode === 'vs_ai' ? 'IA JAGUAR' : this.mode === '2p_local' ? 'J2 ORO ROSA' : 'RIVAL';
      ctx.font = 'bold 14px "Press Start 2P", "Courier New", monospace';
      ctx.fillStyle = PALETTE.roseGold;
      ctx.fillText(`${p2Label}: ${this.p2Score}`, w - 18, 18);

      ctx.font = '11px "Courier New", monospace';
      ctx.fillStyle = PALETTE.jasmine;
      if (this.mode === 'online') {
        ctx.fillText('SALA MULTIJUGADOR EN VIVO', w - 18, 38);
      } else {
        ctx.fillText(
          `TIEMPO: ${Math.ceil(this.matchTimeRemaining)}s | VIDAS J1:${this.snakeP1 ? this.snakeP1.lives : 0} J2:${this.snakeP2 ? this.snakeP2.lives : 0}`,
          w - 18,
          38
        );
      }
    } else {
      const diffLabels = { normal: 'CLÁSICO', fast: 'VELOZ', god: 'DIOS AZTECA' };
      ctx.font = 'bold 12px "Courier New", monospace';
      ctx.fillStyle = PALETTE.roseGold;
      ctx.fillText(`NIVEL: ${diffLabels[this.difficulty] || 'CLÁSICO'}`, w - 18, 18);
      ctx.font = '11px "Courier New", monospace';
      ctx.fillStyle = PALETTE.goldSoft;
      ctx.fillText(`NOTAS: ${this.stats.ingredientsCollected} | RACHA MÁX: x${this.stats.maxCombo}`, w - 18, 38);
    }
  }

  _drawOverlayModal(ctx, m, title, subtitle, actionLabel) {
    const { boardX, boardY, boardW, boardH } = m;
    ctx.save();
    ctx.fillStyle = 'rgba(6, 11, 25, 0.82)';
    ctx.fillRect(boardX, boardY, boardW, boardH);

    const boxW = Math.min(boardW - 32, 480);
    const boxH = 190;
    const bx = boardX + (boardW - boxW) / 2;
    const by = boardY + (boardH - boxH) / 2;

    ctx.fillStyle = PALETTE.navyVelvet;
    ctx.fillRect(bx, by, boxW, boxH);
    ctx.strokeStyle = PALETTE.goldBright;
    ctx.lineWidth = 3;
    ctx.strokeRect(bx, by, boxW, boxH);
    ctx.strokeStyle = PALETTE.roseGold;
    ctx.lineWidth = 1;
    ctx.strokeRect(bx + 5, by + 5, boxW - 10, boxH - 10);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.font = 'bold 16px "Press Start 2P", "Courier New", monospace';
    ctx.fillStyle = PALETTE.goldBright;
    ctx.fillText(title, bx + boxW / 2, by + 48);

    ctx.font = '13px "Courier New", monospace';
    ctx.fillStyle = PALETTE.jasmine;
    ctx.fillText(subtitle, bx + boxW / 2, by + 95);

    const blink = Math.floor(performance.now() / 450) % 2 === 0;
    ctx.font = 'bold 13px "Courier New", monospace';
    ctx.fillStyle = blink ? PALETTE.amber : PALETTE.roseGold;
    ctx.fillText(actionLabel, bx + boxW / 2, by + 142);

    ctx.restore();
  }

  // =========================================================================
  // SISTEMA DE PARTÍCULAS, TEXTOS FLOTANTES Y SONIDO
  // =========================================================================

  _createAmbientStars(count) {
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        x: Math.random(),
        y: Math.random(),
        size: Math.random() > 0.7 ? 3 : 2,
        speed: 1.5 + Math.random() * 2.5,
        phase: Math.random() * Math.PI * 2
      });
    }
    return arr;
  }

  _spawnBurst(gridX, gridY, color, count = 12, sparkType = 'gold') {
    const m = this._getBoardMetrics();
    const cx = m.boardX + (gridX + 0.5) * m.cellW;
    const cy = m.boardY + (gridY + 0.5) * m.cellH;

    // Notificar a motor VFX compartido si existe
    const vfx = this.externalVFX || (typeof window !== 'undefined' ? window.CitlalliVFX : null);
    if (vfx) {
      try {
        if (sparkType === 'astral' && typeof vfx.spawnPerfumeMist === 'function') {
          vfx.spawnPerfumeMist(cx, cy, count);
        } else if (typeof vfx.spawnParticles === 'function') {
          vfx.spawnParticles(cx, cy, color, count);
        }
      } catch (_) {}
    }

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = 45 + Math.random() * 110;
      this.particles.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 20,
        size: Math.random() > 0.4 ? 4 : 3,
        color: i % 3 === 0 ? PALETTE.goldBright : color,
        life: 0.45 + Math.random() * 0.35,
        maxLife: 0.8
      });
    }
  }

  _addFloatingText(text, gridX, gridY, color = PALETTE.goldBright) {
    const m = this._getBoardMetrics();
    const px = m.boardX + (gridX + 0.5) * m.cellW;
    const py = m.boardY + gridY * m.cellH;
    this.floatingTexts.push({
      text,
      x: Math.max(80, Math.min(m.canvasW - 80, px)),
      y: Math.max(this.hudHeight + 16, py),
      color,
      life: 1.15,
      maxLife: 1.15
    });
  }

  _triggerShake(intensity = 6, duration = 0.25) {
    this.shakeIntensity = intensity;
    this.shakeTimer = duration;
    const vfx = this.externalVFX || (typeof window !== 'undefined' ? window.CitlalliVFX : null);
    if (vfx && typeof vfx.triggerShake === 'function') {
      try { vfx.triggerShake(intensity, duration * 1000); } catch (_) {}
    }
  }

  _updateVFX(dt) {
    for (let i = this.trails.length - 1; i >= 0; i--) {
      this.trails[i].life -= dt;
      if (this.trails[i].life <= 0) this.trails.splice(i, 1);
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 140 * dt; // gravedad ligera
      p.life -= dt;
      if (p.life <= 0) this.particles.splice(i, 1);
    }

    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.y -= 28 * dt;
      ft.life -= dt;
      if (ft.life <= 0) this.floatingTexts.splice(i, 1);
    }
  }

  _drawParticlesAndPopups(ctx, m) {
    const vfx = this.externalVFX || (typeof window !== 'undefined' ? window.CitlalliVFX : null);
    if (vfx && typeof vfx.updateAndDraw === 'function') {
      try { vfx.updateAndDraw(ctx, 0.016); } catch (_) {}
    }

    for (const p of this.particles) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
      ctx.fillStyle = p.color;
      ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
      ctx.restore();
    }

    ctx.save();
    ctx.textAlign = 'center';
    ctx.font = 'bold 12px "Courier New", monospace';
    for (const ft of this.floatingTexts) {
      const alpha = Math.max(0, ft.life / ft.maxLife);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#000000';
      ctx.fillText(ft.text, Math.floor(ft.x) + 1, Math.floor(ft.y) + 1);
      ctx.fillStyle = ft.color;
      ctx.fillText(ft.text, Math.floor(ft.x), Math.floor(ft.y));
    }
    ctx.restore();
  }

  _emitScoreUpdate() {
    if (typeof this.callbacks.onScoreUpdate === 'function') {
      try {
        this.callbacks.onScoreUpdate({
          game: 'snake',
          score: this.score,
          p1Score: this.score,
          p2Score: this.p2Score,
          combo: this.combo,
          feverActive: this.feverTimer > 0,
          mode: this.mode,
          scenarioId: this.scenarioId,
          stats: { ...this.stats, unlockedNotes: Array.from(this.stats.unlockedNotes) }
        });
      } catch (_) {}
    }
  }

  _playSound(type, combo = 1) {
    const audio = this.externalAudio || (typeof window !== 'undefined' ? window.CitlalliAudio : null);
    if (audio && typeof audio.playSFX === 'function') {
      const sfxMap = {
        collect: 'pickup',
        powerup: 'bonus',
        relic_spawn: 'spray',
        crash: 'hit',
        gameover: 'gameover',
        teleport: 'reflex_flash',
        start: 'click',
        pause: 'click',
        resume: 'click'
      };
      try {
        audio.playSFX(sfxMap[type] || type);
        return;
      } catch (_) {}
    }

    // Sintetizador Chiptune 8-bit integrado de respaldo (Web Audio API)
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!this.audioCtx) this.audioCtx = new AudioCtx();
      if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      if (type === 'collect') {
        const baseFreq = 440 + Math.min(4, combo) * 85;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(baseFreq, now);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.45, now + 0.11);
        gain.gain.setValueAtTime(0.11, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'powerup' || type === 'relic_spawn') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.06);
        osc.frequency.setValueAtTime(783.99, now + 0.12);
        osc.frequency.setValueAtTime(1046.5, now + 0.18);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc.start(now);
        osc.stop(now + 0.28);
      } else if (type === 'crash' || type === 'gameover') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(65, now + 0.28);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === 'teleport' || type === 'start') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(330, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
        gain.gain.setValueAtTime(0.09, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
        osc.start(now);
        osc.stop(now + 0.16);
      }
    } catch (_) {}
  }
}

// Registro global seguro en window.CitlalliGames
if (typeof window !== 'undefined') {
  window.CitlalliGames = window.CitlalliGames || {};
  window.CitlalliGames.snake = SnakeGame;
}

export default SnakeGame;
