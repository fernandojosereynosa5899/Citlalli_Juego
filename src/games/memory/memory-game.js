/**
 * CITLALLI ARCADE — Módulo Independiente 2:
 * "Memorama: Memoria Olfativa & Astral" (src/games/memory/memory-game.js)
 *
 * Juego 100% encapsulado y desacoplado.
 * Consume window.CitlalliVFX / ../../engine/scenarios-vfx.js y
 * window.CitlalliAudio / ../../engine/audio-engine.js con fallbacks seguros integrados.
 */

const PALETTE = {
  navyDeep: '#050915',
  navyVelvet: '#0A1128',
  navyCardBack: '#0D1736',
  navyCardFace: '#14224A',
  goldBright: '#FFD700',
  goldImperial: '#D4AF37',
  goldSoft: '#F3E5AB',
  roseGold: '#E6C2B8',
  roseBright: '#FF69B4',
  amber: '#FFBF00',
  mandarin: '#FF8C00',
  jasmine: '#FFFDF5',
  turquoise: '#40E0D0',
  clay: '#C87544',
  obsidian: '#181224'
};

// Los 10 Pares Oficiales del Universo Citlalli
const CARD_CATALOG = [
  {
    id: 'bottle',
    name: 'Frasco Citlalli',
    category: 'Símbolo',
    points: 120,
    color: '#FFD700',
    lore: 'Frasco Citlalli: Cristal azul noche coronado por la estrella de 8 puntas y el dije QM en oro rosa; joya de la alta perfumería mexicana.'
  },
  {
    id: 'charm_qm',
    name: 'Dije QM Oro Rosa',
    category: 'Símbolo',
    points: 110,
    color: '#E6C2B8',
    lore: 'Dije QM en Oro Rosa: El emblema grabado que abraza el cuello del frasco, símbolo de distinción, linaje y elegancia atemporal.'
  },
  {
    id: 'jaguar',
    name: 'Jaguar Prehispánico',
    category: 'Origen',
    points: 115,
    color: '#FFBF00',
    lore: 'Jaguar Dorado: Guardián sagrado del México antiguo; representa la fuerza interior, el misterio nocturno y el porte indomable.'
  },
  {
    id: 'star',
    name: 'Estrella Citlalli',
    category: 'Símbolo',
    points: 115,
    color: '#FFFDF5',
    lore: 'Estrella de 8 Puntas: En náhuatl "Citlalli" significa Estrella; la luz cósmica que guía cada paso con brillo propio.'
  },
  {
    id: 'mandarin',
    name: 'Mandarina de Salida',
    category: 'Salida',
    points: 90,
    color: '#FF8C00',
    lore: 'Nota de Salida — Mandarina Fresca: Explosión cítrica luminosa que despierta los sentidos en el primer instante.'
  },
  {
    id: 'rose',
    name: 'Rosa de Corazón',
    category: 'Corazón',
    points: 100,
    color: '#FF69B4',
    lore: 'Nota de Corazón — Rosa Rosada: Pétalos aterciopelados que infunden romance, delicadeza y magnetismo floral.'
  },
  {
    id: 'jasmine',
    name: 'Jazmín Blanco',
    category: 'Corazón',
    points: 100,
    color: '#FFFDF5',
    lore: 'Nota de Corazón — Jazmín Blanco: Flor estelar que se abre al anochecer, aportando opulencia luminosa y pureza.'
  },
  {
    id: 'vanilla',
    name: 'Vaina de Vainilla',
    category: 'Fondo',
    points: 105,
    color: '#F3E5AB',
    lore: 'Nota de Fondo — Vainilla Artesanal: Calidez cremosa y envolvente que deja una caricia dorada sobre la piel.'
  },
  {
    id: 'amber',
    name: 'Ámbar Dorado',
    category: 'Fondo',
    points: 110,
    color: '#FFBF00',
    lore: 'Nota de Fondo — Resina de Ámbar: El acorde profundo y seductor que sella la permanencia eterna de Citlalli.'
  },
  {
    id: 'vessel',
    name: 'Vasija de David',
    category: 'Origen',
    points: 120,
    color: '#C87544',
    lore: 'Vasija de Barro de David: Homenaje a las raíces de Hidalgo y al arte de moldear con las manos la esencia de nuestra tierra.'
  }
];

// Sprites Pixel Art 12x12 para las 10 cartas
const CARD_SPRITES_12 = {
  bottle: {
    palette: { '1': '#FFD700', '2': '#D4AF37', '3': '#0A1128', '4': '#2563EB', '5': '#E6C2B8', '6': '#FFFDF5' },
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
  charm_qm: {
    palette: { '1': '#E6C2B8', '2': '#D88A8A', '3': '#FFFDF5', '4': '#8B4557', '5': '#FFD700' },
    grid: [
      '.....55.....',
      '....5..5....',
      '....1111....',
      '..11333311..',
      '.1344114431.',
      '.1341441431.',
      '.1344114431.',
      '.1314224131.',
      '..11222211..',
      '...111111...',
      '.....22.....',
      '............'
    ]
  },
  jaguar: {
    palette: { '1': '#FFD700', '2': '#D4AF37', '3': '#181224', '4': '#FF4500', '5': '#FFFDF5', '6': '#40E0D0' },
    grid: [
      '.11......11.',
      '123111111321',
      '121132231121',
      '112311113211',
      '124412214421',
      '121113311121',
      '.1223663221.',
      '.1321111231.',
      '..15333351..',
      '...122221...',
      '....1111....',
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
      '112222222211',
      '.1112222111.',
      '....1221....',
      '...4.21.4...',
      '..4..11..4..',
      '.....11.....',
      '............'
    ]
  },
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
  vessel: {
    palette: { '1': '#8B3A1E', '2': '#C87544', '3': '#E29564', '4': '#FFD700', '5': '#40E0D0' },
    grid: [
      '...224422...',
      '....1221....',
      '...123321...',
      '..12333321..',
      '.1245445421.',
      '.1233333321.',
      '.1244224421.',
      '..12222221..',
      '...112211...',
      '....1111....',
      '............',
      '............'
    ]
  }
};

export class MemoryGame {
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

    this.scenarioId = options.scenarioId || 'hidalgo';
    this.mode = options.mode || '1p'; // '1p' | '2p_local' | 'vs_ai' | 'online'
    this.difficulty = options.difficulty || 'normal'; // 'normal' (12) | 'fast' (16) | 'god' (20)

    this.externalVFX = options.vfx || (typeof window !== 'undefined' ? window.CitlalliVFX : null);
    this.externalAudio = options.audio || (typeof window !== 'undefined' ? window.CitlalliAudio : null);
    this._tryLoadExternalEngines();

    this.hudHeight = 58;
    this.isRunning = false;
    this.isPaused = false;
    this.isGameOver = false;
    this.rafId = null;
    this.lastFrameTime = 0;
    this.elapsedTime = 0;

    // Puntuación, turnos y combos
    this.score = 0;
    this.p2Score = 0;
    this.p1Pairs = 0;
    this.p2Pairs = 0;
    this.combo = 1;
    this.p2Combo = 1;
    this.currentTurn = 'p1'; // 'p1' | 'p2'
    this.timeRemaining = 120;

    // Poder Especial: "Brisa de Hidalgo" (1 vez por partida)
    this.breezeAvailable = true;
    this.breezeHighlightTimer = 0;
    this.breezeHighlightedIds = [];
    this.breezeButtonRect = { x: 0, y: 0, w: 0, h: 0 };

    // Estado del tablero de cartas
    this.cols = 4;
    this.rows = 3;
    this.cards = [];
    this.flippedCards = [];
    this.lockBoardTimer = 0;
    this.cursorIndex = 0; // Cursor P1 (WASD / Flechas)
    this.p2CursorIndex = 1; // Cursor P2 opcional

    // Memoria de la IA Jaguar (almacena índices vistos)
    this.aiMemory = new Map();
    this.aiThinkTimer = 0;
    this.aiPlannedPick = null;

    // Estadísticas
    this.stats = {
      pairsFound: 0,
      totalPairs: 6,
      moves: 0,
      maxCombo: 1,
      breezeUsed: false,
      lastMatchedName: null
    };

    // Partículas y textos flotantes
    this.particles = [];
    this.floatingTexts = [];
    this.bgStars = this._createAmbientStars(42);
    this.audioCtx = null;

    // Event listeners
    this._boundKeyDown = this._handleKeyDown.bind(this);
    this._boundPointerDown = this._handlePointerDown.bind(this);
    this._boundPointerMove = this._handlePointerMove.bind(this);
    this._boundResize = this._handleResize.bind(this);

    this.init(options);
  }

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

  init(options = {}) {
    if (options.scenarioId) this.scenarioId = options.scenarioId;
    if (options.mode) this.mode = options.mode;
    if (options.difficulty) this.difficulty = options.difficulty;

    this._setupCanvas();
    this._attachListeners();
    this._resetBoard();
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
      this.canvas.addEventListener('pointermove', this._boundPointerMove);
    }
  }

  _detachListeners() {
    if (typeof window === 'undefined') return;
    window.removeEventListener('keydown', this._boundKeyDown);
    window.removeEventListener('resize', this._boundResize);
    if (this.canvas) {
      this.canvas.removeEventListener('pointerdown', this._boundPointerDown);
      this.canvas.removeEventListener('pointermove', this._boundPointerMove);
    }
  }

  _handleResize() {
    if (this.ctx) this.ctx.imageSmoothingEnabled = false;
    if (!this.isRunning) this._renderFrame(0);
  }

  _resetBoard() {
    // Determinar cantidad de pares según dificultad: normal (6), fast (8), god (10)
    let pairCount = 6;
    this.cols = 4;
    this.rows = 3;
    this.timeRemaining = 95;

    if (this.difficulty === 'fast') {
      pairCount = 8;
      this.cols = 4;
      this.rows = 4;
      this.timeRemaining = 115;
    } else if (this.difficulty === 'god') {
      pairCount = 10;
      this.cols = 5;
      this.rows = 4;
      this.timeRemaining = 135;
    }

    const selectedDefs = CARD_CATALOG.slice(0, pairCount);
    const deck = [];
    selectedDefs.forEach((def) => {
      deck.push({ ...def }, { ...def });
    });

    // Barajado Fisher-Yates
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = deck[i];
      deck[i] = deck[j];
      deck[j] = tmp;
    }

    this.cards = deck.map((def, index) => ({
      index,
      pairId: def.id,
      name: def.name,
      category: def.category,
      points: def.points,
      color: def.color,
      lore: def.lore,
      isFlipped: false,
      isMatched: false,
      matchedBy: null,
      flipProgress: 0, // 0 = reverso (caja azul marino), 1 = anverso (nota olfativa)
      targetFlip: 0,
      hoverBounce: 0
    }));

    this.score = 0;
    this.p2Score = 0;
    this.p1Pairs = 0;
    this.p2Pairs = 0;
    this.combo = 1;
    this.p2Combo = 1;
    this.currentTurn = 'p1';
    this.flippedCards = [];
    this.lockBoardTimer = 0;
    this.cursorIndex = 0;
    this.breezeAvailable = true;
    this.breezeHighlightTimer = 0;
    this.breezeHighlightedIds = [];
    this.aiMemory.clear();
    this.aiThinkTimer = 0;
    this.aiPlannedPick = null;
    this.isGameOver = false;
    this.winnerText = '';

    this.stats = {
      pairsFound: 0,
      totalPairs: pairCount,
      moves: 0,
      maxCombo: 1,
      breezeUsed: false,
      lastMatchedName: null
    };

    this.particles = [];
    this.floatingTexts = [];
    this._emitScoreUpdate();
  }

  start() {
    this._resetBoard();
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
    if (this.isPaused) this.resume();
    else this.pause();
    return this.isPaused;
  }

  setScenario(scenarioId) {
    const valid = ['hidalgo', 'jaguar', 'velvet', 'penthouse'];
    this.scenarioId = valid.includes(scenarioId) ? scenarioId : 'hidalgo';
    const vfx = this.externalVFX || (typeof window !== 'undefined' ? window.CitlalliVFX : null);
    if (vfx && typeof vfx.setScenario === 'function') {
      try { vfx.setScenario(this.scenarioId); } catch (_) {}
    }
    if (!this.isRunning) this._renderFrame(0);
  }

  setMode(mode) {
    const valid = ['1p', '2p_local', 'vs_ai', 'online'];
    this.mode = valid.includes(mode) ? mode : '1p';
    this._resetBoard();
    if (!this.isRunning) this._renderFrame(0);
  }

  setDifficulty(diff) {
    const valid = ['normal', 'fast', 'god'];
    this.difficulty = valid.includes(diff) ? diff : 'normal';
    this._resetBoard();
    if (!this.isRunning) this._renderFrame(0);
  }

  /**
   * Poder Especial "Brisa de Hidalgo": Vislumbra un destello astral en un par oculto (1 vez por partida)
   */
  activateBreezeOfHidalgo() {
    if (!this.isRunning || this.isPaused || this.isGameOver || !this.breezeAvailable) return false;

    // Buscar un par que aún no haya sido emparejado
    const unmatched = this.cards.filter((c) => !c.isMatched && !c.isFlipped);
    if (unmatched.length < 2) return false;

    const targetPairId = unmatched[0].pairId;
    const pairCards = this.cards.filter((c) => c.pairId === targetPairId);

    this.breezeAvailable = false;
    this.stats.breezeUsed = true;
    this.breezeHighlightedIds = pairCards.map((c) => c.index);
    this.breezeHighlightTimer = 2.4;

    const m = this._getGridMetrics();
    for (const c of pairCards) {
      const rect = this._getCardRect(c.index, m);
      this._spawnCardSparks(rect.x + rect.w / 2, rect.y + rect.h / 2, PALETTE.turquoise, 18);
    }
    this._addFloatingText('✦ BRISA DE HIDALGO: DESTELLO ASTRAL ✦', m.canvasW / 2, this.hudHeight + 22, PALETTE.turquoise);
    this._playSound('breeze');
    this._emitScoreUpdate();
    return true;
  }

  handleRemoteEvent(event) {
    if (!event || typeof event !== 'object') return;
    if (event.type === 'memory_state' || event.game === 'memory') {
      if (typeof event.score === 'number') this.p2Score = event.score;
      if (typeof event.pairs === 'number') this.p2Pairs = event.pairs;
      this._emitScoreUpdate();
    } else if (event.type === 'score_update' && typeof event.score === 'number') {
      this.p2Score = event.score;
      this._emitScoreUpdate();
    }
  }

  handleTouchDirection(dir) {
    if ((!this.isRunning || this.isGameOver) && dir === 'action') {
      this.start();
      return;
    }
    if (!this.isRunning || this.isPaused) return;

    const total = this.cards.length;
    if (dir === 'left') {
      this.cursorIndex = (this.cursorIndex - 1 + total) % total;
      this._playSound('cursor');
    } else if (dir === 'right') {
      this.cursorIndex = (this.cursorIndex + 1) % total;
      this._playSound('cursor');
    } else if (dir === 'up') {
      this.cursorIndex = (this.cursorIndex - this.cols + total) % total;
      this._playSound('cursor');
    } else if (dir === 'down') {
      this.cursorIndex = (this.cursorIndex + this.cols) % total;
      this._playSound('cursor');
    } else if (dir === 'action') {
      this._selectCard(this.cursorIndex, false);
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
        ...this.stats,
        p1Pairs: this.p1Pairs,
        p2Pairs: this.p2Pairs,
        combo: this.combo,
        breezeAvailable: this.breezeAvailable,
        timeRemaining: Math.ceil(this.timeRemaining)
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
  // LÓGICA INTERNA DE ACTUALIZACIÓN, VOLTEO Y TURNOS
  // =========================================================================

  _update(dt) {
    this.elapsedTime += dt;

    // Contrarreloj en modo 1P o límite de duelo
    if (this.timeRemaining > 0) {
      this.timeRemaining = Math.max(0, this.timeRemaining - dt);
      if (this.timeRemaining <= 0) {
        this._finishGame('tiempo_agotado');
        return;
      }
    }

    // Temporizador del destello "Brisa de Hidalgo"
    if (this.breezeHighlightTimer > 0) {
      this.breezeHighlightTimer = Math.max(0, this.breezeHighlightTimer - dt);
      if (this.breezeHighlightTimer === 0) {
        this.breezeHighlightedIds = [];
      }
    }

    // Animar interpolación suave de volteo de cada carta (scaleX)
    for (const card of this.cards) {
      const diff = card.targetFlip - card.flipProgress;
      if (Math.abs(diff) > 0.005) {
        card.flipProgress += Math.sign(diff) * Math.min(Math.abs(diff), dt * 5.2);
      } else {
        card.flipProgress = card.targetFlip;
      }
    }

    // Si hay 2 cartas volteadas no coincidentes esperando cerrarse
    if (this.lockBoardTimer > 0) {
      this.lockBoardTimer -= dt;
      if (this.lockBoardTimer <= 0) {
        this.lockBoardTimer = 0;
        for (const c of this.flippedCards) {
          if (!c.isMatched) {
            c.isFlipped = false;
            c.targetFlip = 0;
          }
        }
        this.flippedCards = [];

        // Cambiar de turno en modos 2P Local o VS IA Jaguar
        if (this.mode === '2p_local' || this.mode === 'vs_ai') {
          this.currentTurn = this.currentTurn === 'p1' ? 'p2' : 'p1';
          if (this.mode === 'vs_ai' && this.currentTurn === 'p2') {
            this.aiThinkTimer = 0.55;
          }
        }
      }
    }

    // Turno automático de la IA Jaguar en modo 'vs_ai'
    if (
      this.mode === 'vs_ai' &&
      this.currentTurn === 'p2' &&
      this.lockBoardTimer <= 0 &&
      !this.isGameOver
    ) {
      this.aiThinkTimer -= dt;
      if (this.aiThinkTimer <= 0) {
        this._executeJaguarAIStep();
      }
    }

    // Actualizar partículas y popups
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 120 * dt;
      p.life -= dt;
      if (p.life <= 0) this.particles.splice(i, 1);
    }

    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.y -= 26 * dt;
      ft.life -= dt;
      if (ft.life <= 0) this.floatingTexts.splice(i, 1);
    }
  }

  _selectCard(index, isAIAction = false) {
    if (!this.isRunning || this.isPaused || this.isGameOver) return;
    if (this.lockBoardTimer > 0) return;
    if (this.mode === 'vs_ai' && this.currentTurn === 'p2' && !isAIAction) return;

    const card = this.cards[index];
    if (!card || card.isFlipped || card.isMatched) return;

    card.isFlipped = true;
    card.targetFlip = 1;
    this.flippedCards.push(card);

    // Registrar en memoria de la IA Jaguar
    this._recordCardInAIMemory(card);

    const m = this._getGridMetrics();
    const rect = this._getCardRect(index, m);
    this._spawnCardSparks(rect.x + rect.w / 2, rect.y + rect.h / 2, PALETTE.goldBright, 10);
    this._playSound('flip');

    if (this.flippedCards.length === 2) {
      this.stats.moves += 1;
      const [first, second] = this.flippedCards;

      if (first.pairId === second.pairId) {
        // ¡PAR ENCONTRADO!
        first.isMatched = true;
        second.isMatched = true;
        first.matchedBy = this.currentTurn;
        second.matchedBy = this.currentTurn;
        this.flippedCards = [];
        this.stats.pairsFound += 1;
        this.stats.lastMatchedName = first.name;

        // Quitar de la memoria de la IA
        this.aiMemory.delete(first.pairId);

        const r1 = this._getCardRect(first.index, m);
        const r2 = this._getCardRect(second.index, m);
        this._spawnCardSparks(r1.x + r1.w / 2, r1.y + r1.h / 2, first.color, 22);
        this._spawnCardSparks(r2.x + r2.w / 2, r2.y + r2.h / 2, second.color, 22);

        if (this.currentTurn === 'p1') {
          const speedBonus = Math.floor(this.timeRemaining * 0.4);
          const earned = (first.points + speedBonus) * this.combo;
          this.score += earned;
          this.p1Pairs += 1;
          if (this.combo > this.stats.maxCombo) this.stats.maxCombo = this.combo;

          this._addFloatingText(
            `+${earned} ${first.name.toUpperCase()} (x${this.combo})`,
            (r1.x + r2.x + r1.w) / 2,
            Math.min(r1.y, r2.y),
            first.color
          );
          this.combo = Math.min(5, this.combo + 1);
        } else {
          const earned = first.points * this.p2Combo;
          this.p2Score += earned;
          this.p2Pairs += 1;
          this._addFloatingText(
            `+${earned} (${this.mode === 'vs_ai' ? 'JAGUAR' : 'J2'})`,
            (r1.x + r2.x + r1.w) / 2,
            Math.min(r1.y, r2.y),
            PALETTE.roseGold
          );
          this.p2Combo = Math.min(5, this.p2Combo + 1);
          if (this.mode === 'vs_ai') {
            this.aiThinkTimer = 0.65;
          }
        }

        this._playSound('match', this.currentTurn === 'p1' ? this.combo : this.p2Combo);

        // Invocar callback de Lore Olfativo & Astral
        if (typeof this.callbacks.onLoreUnlock === 'function') {
          try {
            this.callbacks.onLoreUnlock({
              id: first.pairId,
              name: first.name,
              category: first.category,
              lore: first.lore,
              color: first.color,
              points: first.points
            });
          } catch (_) {}
        }

        // Sincronizar con sala online
        if (this.mode === 'online' && typeof this.callbacks.onBroadcastState === 'function') {
          try {
            this.callbacks.onBroadcastState({
              type: 'memory_state',
              game: 'memory',
              score: this.score,
              pairs: this.p1Pairs
            });
          } catch (_) {}
        }

        this._emitScoreUpdate();

        // Comprobar si se completaron todos los pares
        if (this.stats.pairsFound >= this.stats.totalPairs) {
          // Bono por tiempo restante en 1P
          if (this.mode === '1p') {
            const timeBonus = Math.floor(this.timeRemaining * 5);
            this.score += timeBonus;
          }
          this._finishGame('completado');
        }
      } else {
        // No coinciden: romper racha del jugador actual y cerrar tras 0.85s
        if (this.currentTurn === 'p1') {
          this.combo = 1;
        } else {
          this.p2Combo = 1;
        }
        this.lockBoardTimer = 0.85;
        this._playSound('mismatch');
        this._emitScoreUpdate();
      }
    }
  }

  _recordCardInAIMemory(card) {
    if (!this.aiMemory.has(card.pairId)) {
      this.aiMemory.set(card.pairId, new Set());
    }
    this.aiMemory.get(card.pairId).add(card.index);
  }

  _executeJaguarAIStep() {
    const available = this.cards.filter((c) => !c.isMatched && !c.isFlipped);
    if (available.length === 0) return;

    // Si la IA aún no ha volteado la primera carta del turno
    if (this.flippedCards.length === 0) {
      // ¿Recuerda algún par completo?
      let knownPairIndices = null;
      const rememberChance = this.difficulty === 'god' ? 0.92 : this.difficulty === 'fast' ? 0.75 : 0.55;

      if (Math.random() < rememberChance) {
        for (const [, idxSet] of this.aiMemory.entries()) {
          const validIdxs = Array.from(idxSet).filter(
            (idx) => !this.cards[idx].isMatched && !this.cards[idx].isFlipped
          );
          if (validIdxs.length >= 2) {
            knownPairIndices = validIdxs;
            break;
          }
        }
      }

      if (knownPairIndices) {
        this.aiPlannedPick = knownPairIndices[1];
        this.cursorIndex = knownPairIndices[0];
        this._selectCard(knownPairIndices[0], true);
      } else {
        this.aiPlannedPick = null;
        const randomCard = available[Math.floor(Math.random() * available.length)];
        this.cursorIndex = randomCard.index;
        this._selectCard(randomCard.index, true);
      }
      this.aiThinkTimer = 0.55;
    } else if (this.flippedCards.length === 1) {
      // Segunda carta del turno de la IA
      const firstCard = this.flippedCards[0];
      let targetIdx = this.aiPlannedPick;

      if (targetIdx === null || this.cards[targetIdx].isFlipped || this.cards[targetIdx].isMatched) {
        // Revisar si la pareja de la primera carta ya fue vista antes
        const seenSet = this.aiMemory.get(firstCard.pairId);
        if (seenSet) {
          const matchCandidate = Array.from(seenSet).find(
            (idx) => idx !== firstCard.index && !this.cards[idx].isMatched && !this.cards[idx].isFlipped
          );
          if (matchCandidate !== undefined) {
            targetIdx = matchCandidate;
          }
        }
      }

      if (targetIdx === null || targetIdx === undefined) {
        const randomCard = available[Math.floor(Math.random() * available.length)];
        targetIdx = randomCard.index;
      }

      this.aiPlannedPick = null;
      this.cursorIndex = targetIdx;
      this._selectCard(targetIdx, true);
    }
  }

  _finishGame(reason) {
    if (this.isGameOver) return;
    this.isGameOver = true;
    this.isRunning = false;
    this._playSound(reason === 'completado' ? 'victory' : 'gameover');

    let winner = 'p1';
    if (this.mode === '2p_local' || this.mode === 'vs_ai') {
      if (this.p2Pairs > this.p1Pairs || (this.p2Pairs === this.p1Pairs && this.p2Score > this.score)) {
        winner = 'p2';
      } else if (this.p1Pairs === this.p2Pairs && this.score === this.p2Score) {
        winner = 'draw';
      }
      const p2Name = this.mode === 'vs_ai' ? 'IA JAGUAR' : 'JUGADOR 2 (ORO ROSA)';
      if (winner === 'p1') {
        this.winnerText = `¡VICTORIA J1! (${this.p1Pairs} PARES — ${this.score} PTS)`;
      } else if (winner === 'p2') {
        this.winnerText = `¡VICTORIA ${p2Name}! (${this.p2Pairs} PARES — ${this.p2Score} PTS)`;
      } else {
        this.winnerText = `¡EMPATE ASTRAL A ${this.p1Pairs} PARES!`;
      }
    } else {
      this.winnerText =
        reason === 'completado'
          ? `¡MEMORIA ASTRAL PERFECTA! PUNTAJE: ${this.score}`
          : `TIEMPO AGOTADO (${this.stats.pairsFound}/${this.stats.totalPairs} PARES) — ${this.score} PTS`;
    }

    if (typeof this.callbacks.onGameOver === 'function') {
      try {
        this.callbacks.onGameOver({
          game: 'memory',
          score: this.score,
          p1Score: this.score,
          p2Score: this.p2Score,
          p1Pairs: this.p1Pairs,
          p2Pairs: this.p2Pairs,
          winner,
          reason,
          mode: this.mode,
          scenarioId: this.scenarioId,
          difficulty: this.difficulty,
          stats: { ...this.stats }
        });
      } catch (_) {}
    }
  }

  // =========================================================================
  // ENTRADA DE TECLADO Y RATÓN / TOQUE
  // =========================================================================

  _handleKeyDown(e) {
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

    // Activar poder "Brisa de Hidalgo" con tecla B o Shift
    if (key === 'b' || key === 'shift') {
      e.preventDefault();
      this.activateBreezeOfHidalgo();
      return;
    }

    const total = this.cards.length;
    if (key === 'a' || e.key === 'ArrowLeft') {
      e.preventDefault();
      this.cursorIndex = (this.cursorIndex - 1 + total) % total;
      this._playSound('cursor');
    } else if (key === 'd' || e.key === 'ArrowRight') {
      e.preventDefault();
      this.cursorIndex = (this.cursorIndex + 1) % total;
      this._playSound('cursor');
    } else if (key === 'w' || e.key === 'ArrowUp') {
      e.preventDefault();
      this.cursorIndex = (this.cursorIndex - this.cols + total) % total;
      this._playSound('cursor');
    } else if (key === 's' || e.key === 'ArrowDown') {
      e.preventDefault();
      this.cursorIndex = (this.cursorIndex + this.cols) % total;
      this._playSound('cursor');
    } else if (key === ' ' || key === 'enter') {
      e.preventDefault();
      this._selectCard(this.cursorIndex, false);
    }
  }

  _getCanvasCoords(e) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  }

  _handlePointerMove(e) {
    if (!this.isRunning || this.isPaused || !this.canvas) return;
    const pt = this._getCanvasCoords(e);
    const m = this._getGridMetrics();

    for (let i = 0; i < this.cards.length; i++) {
      const r = this._getCardRect(i, m);
      if (pt.x >= r.x && pt.x <= r.x + r.w && pt.y >= r.y && pt.y <= r.y + r.h) {
        this.cursorIndex = i;
        break;
      }
    }
  }

  _handlePointerDown(e) {
    if (!this.canvas) return;
    if (!this.isRunning || this.isGameOver) {
      this.start();
      return;
    }
    if (this.isPaused) {
      this.resume();
      return;
    }

    const pt = this._getCanvasCoords(e);

    // Comprobar clic en el botón del poder "Brisa de Hidalgo"
    const br = this.breezeButtonRect;
    if (
      this.breezeAvailable &&
      pt.x >= br.x &&
      pt.x <= br.x + br.w &&
      pt.y >= br.y &&
      pt.y <= br.y + br.h
    ) {
      this.activateBreezeOfHidalgo();
      return;
    }

    // Comprobar clic en alguna carta
    const m = this._getGridMetrics();
    for (let i = 0; i < this.cards.length; i++) {
      const r = this._getCardRect(i, m);
      if (pt.x >= r.x && pt.x <= r.x + r.w && pt.y >= r.y && pt.y <= r.y + r.h) {
        this.cursorIndex = i;
        this._selectCard(i, false);
        return;
      }
    }
  }

  // =========================================================================
  // RENDERIZADO DE CARTAS DE LUJO, ESCENARIOS Y HUD
  // =========================================================================

  _getGridMetrics() {
    const w = this.canvas ? this.canvas.width : 768;
    const h = this.canvas ? this.canvas.height : 534;
    const padX = 36;
    const topY = this.hudHeight + 18;
    const availW = Math.max(260, w - padX * 2);
    const availH = Math.max(180, h - topY - 22);

    const gapX = 14;
    const gapY = 12;
    const maxCardW = Math.floor((availW - gapX * (this.cols - 1)) / this.cols);
    const maxCardH = Math.floor((availH - gapY * (this.rows - 1)) / this.rows);

    const cardH = Math.min(maxCardH, Math.floor(maxCardW * 1.15));
    const cardW = Math.min(maxCardW, Math.floor(cardH * 0.92));

    const totalGridW = cardW * this.cols + gapX * (this.cols - 1);
    const totalGridH = cardH * this.rows + gapY * (this.rows - 1);
    const startX = Math.floor((w - totalGridW) / 2);
    const startY = topY + Math.floor((availH - totalGridH) / 2);

    return {
      canvasW: w,
      canvasH: h,
      startX,
      startY,
      cardW,
      cardH,
      gapX,
      gapY
    };
  }

  _getCardRect(index, m) {
    const col = index % this.cols;
    const row = Math.floor(index / this.cols);
    return {
      x: m.startX + col * (m.cardW + m.gapX),
      y: m.startY + row * (m.cardH + m.gapY),
      w: m.cardW,
      h: m.cardH
    };
  }

  _renderFrame() {
    if (!this.ctx || !this.canvas) return;
    const ctx = this.ctx;
    const m = this._getGridMetrics();

    ctx.save();

    // 1. Fondo Dinámico del Escenario Seleccionado
    this._drawScenarioBackdrop(ctx, m.canvasW, m.canvasH);

    // 2. Cartas con Animación de Escala Horizontal y Diseño Caja Citlalli
    for (let i = 0; i < this.cards.length; i++) {
      this._drawCard(ctx, this.cards[i], i, m);
    }

    // 3. Partículas de Chispas Doradas y Textos Flotantes
    this._drawParticlesAndPopups(ctx);

    // 4. HUD Superior con Botón "Brisa de Hidalgo", Turnos y Combos
    this._drawHUD(ctx, m);

    // 5. Modal de Inicio / Pausa / Fin
    if (!this.isRunning && !this.isGameOver) {
      this._drawOverlayModal(
        ctx,
        m,
        'MEMORAMA: MEMORIA OLFATIVA & ASTRAL',
        'Descubre los pares sagrados de la colección CITLALLI',
        'HAZ CLIC O PRESIONA ESPACIO PARA COMENZAR'
      );
    } else if (this.isPaused) {
      this._drawOverlayModal(
        ctx,
        m,
        'PAUSA OLFATIVA',
        'Las notas de Citlalli aguardan en su cofre de terciopelo',
        'PRESIONA P O HAZ CLIC PARA CONTINUAR'
      );
    } else if (this.isGameOver) {
      this._drawOverlayModal(
        ctx,
        m,
        'PARTIDA FINALIZADA',
        this.winnerText,
        'HAZ CLIC O PRESIONA ESPACIO PARA JUGAR DE NUEVO'
      );
    }

    ctx.restore();
  }

  _drawScenarioBackdrop(ctx, w, h) {
    const vfx = this.externalVFX || (typeof window !== 'undefined' ? window.CitlalliVFX : null);
    let drewExternal = false;
    if (vfx) {
      try {
        if (typeof vfx.drawScenarioBackground === 'function') {
          vfx.drawScenarioBackground(ctx, w, h, this.scenarioId, this.elapsedTime * 1000, this.elapsedTime * 15);
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
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      if (this.scenarioId === 'hidalgo') {
        grad.addColorStop(0, '#07122C');
        grad.addColorStop(0.6, '#152A50');
        grad.addColorStop(1, '#263942');
      } else if (this.scenarioId === 'jaguar') {
        grad.addColorStop(0, '#090614');
        grad.addColorStop(0.6, '#1C112E');
        grad.addColorStop(1, '#2D1B14');
      } else if (this.scenarioId === 'velvet') {
        grad.addColorStop(0, '#040814');
        grad.addColorStop(0.5, '#0A1128');
        grad.addColorStop(1, '#142046');
      } else {
        grad.addColorStop(0, '#040712');
        grad.addColorStop(0.6, '#0F1B3A');
        grad.addColorStop(1, '#1E2A48');
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      for (const st of this.bgStars) {
        const pulse = 0.35 + 0.65 * Math.abs(Math.sin(this.elapsedTime * st.speed + st.phase));
        ctx.fillStyle = `rgba(255, 215, 0, ${pulse * 0.55})`;
        ctx.fillRect(Math.floor(st.x * w), Math.floor(st.y * h), st.size, st.size);
      }
    }
  }

  _drawCard(ctx, card, index, m) {
    const rect = this._getCardRect(index, m);
    const cx = rect.x + rect.w / 2;
    const cy = rect.y + rect.h / 2;

    // Escala horizontal durante el giro: 1 -> 0 (en flipProgress=0.5) -> 1
    const scaleX = Math.max(0.04, Math.abs(1 - card.flipProgress * 2));
    const showFront = card.flipProgress >= 0.5;
    const isSelectedCursor = this.cursorIndex === index && this.isRunning;
    const isBreezeHighlighted =
      this.breezeHighlightTimer > 0 && this.breezeHighlightedIds.includes(index);

    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(scaleX, 1);

    const hw = rect.w / 2;
    const hh = rect.h / 2;

    // Resplandor especial si está iluminada por "Brisa de Hidalgo" o cursor activo
    if (isBreezeHighlighted) {
      ctx.strokeStyle = PALETTE.turquoise;
      ctx.lineWidth = 4;
      ctx.strokeRect(-hw - 4, -hh - 4, rect.w + 8, rect.h + 8);
    } else if (isSelectedCursor) {
      ctx.strokeStyle = this.currentTurn === 'p2' ? PALETTE.roseBright : PALETTE.goldBright;
      ctx.lineWidth = 3;
      ctx.strokeRect(-hw - 3, -hh - 3, rect.w + 6, rect.h + 6);
    }

    if (!showFront) {
      // =====================================================================
      // REVERSO DE LA CARTA: Caja de Terciopelo Azul Marino de CITLALLI
      // con marco dorado, esquinas de nubes y estrella de 8 puntas central
      // =====================================================================
      ctx.fillStyle = PALETTE.navyCardBack;
      ctx.fillRect(-hw, -hh, rect.w, rect.h);

      // Marco exterior dorado imperial
      ctx.strokeStyle = PALETTE.goldImperial;
      ctx.lineWidth = 2;
      ctx.strokeRect(-hw + 2, -hh + 2, rect.w - 4, rect.h - 4);

      // Marco interior fino en oro rosa
      ctx.strokeStyle = 'rgba(230, 194, 184, 0.5)';
      ctx.lineWidth = 1;
      ctx.strokeRect(-hw + 6, -hh + 6, rect.w - 12, rect.h - 12);

      // Esquinas de nubes doradas pixel art
      ctx.fillStyle = PALETTE.goldImperial;
      const cOff = 8;
      // Arriba-Izquierda
      ctx.fillRect(-hw + cOff, -hh + cOff, 8, 3);
      ctx.fillRect(-hw + cOff, -hh + cOff, 3, 8);
      // Arriba-Derecha
      ctx.fillRect(hw - cOff - 8, -hh + cOff, 8, 3);
      ctx.fillRect(hw - cOff - 3, -hh + cOff, 3, 8);
      // Abajo-Izquierda
      ctx.fillRect(-hw + cOff, hh - cOff - 3, 8, 3);
      ctx.fillRect(-hw + cOff, hh - cOff - 8, 3, 8);
      // Abajo-Derecha
      ctx.fillRect(hw - cOff - 8, hh - cOff - 3, 8, 3);
      ctx.fillRect(hw - cOff - 3, hh - cOff - 8, 3, 8);

      // Estrella de 8 puntas de CITLALLI en el centro
      const starSize = Math.min(rect.w, rect.h) * 0.34;
      this._drawEightPointStar(ctx, 0, -4, starSize, isBreezeHighlighted ? PALETTE.turquoise : PALETTE.goldBright);

      // Inscripción CITLALLI
      ctx.font = 'bold 8px "Courier New", monospace';
      ctx.fillStyle = PALETTE.goldSoft;
      ctx.textAlign = 'center';
      ctx.fillText('CITLALLI', 0, hh - 13);
    } else {
      // =====================================================================
      // ANVERSO DE LA CARTA: Sprite Pixel Art, Nombre en Dorado y Categoría
      // =====================================================================
      ctx.fillStyle = card.isMatched ? 'rgba(20, 42, 78, 0.95)' : PALETTE.navyCardFace;
      ctx.fillRect(-hw, -hh, rect.w, rect.h);

      ctx.strokeStyle = card.isMatched ? PALETTE.goldBright : card.color;
      ctx.lineWidth = card.isMatched ? 3 : 2;
      ctx.strokeRect(-hw + 2, -hh + 2, rect.w - 4, rect.h - 4);

      // Etiqueta superior de categoría (*Salida*, *Corazón*, *Fondo*, *Origen*, *Símbolo*)
      ctx.fillStyle = 'rgba(6, 11, 25, 0.75)';
      ctx.fillRect(-hw + 4, -hh + 4, rect.w - 8, 15);
      ctx.font = 'bold 9px "Courier New", monospace';
      ctx.fillStyle = PALETTE.roseGold;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(card.category.toUpperCase(), 0, -hh + 11.5);

      // Sprite Pixel Art central
      const spriteSize = Math.floor(Math.min(rect.w * 0.56, rect.h * 0.46));
      this._drawCardSprite(ctx, card.pairId, -spriteSize / 2, -spriteSize / 2 - 4, spriteSize, card.color);

      // Nombre en dorado en la base de la carta
      ctx.font = 'bold 9px "Courier New", monospace';
      ctx.fillStyle = PALETTE.goldBright;
      ctx.fillText(card.name, 0, hh - 13);
    }

    ctx.restore();
  }

  _drawEightPointStar(ctx, cx, cy, size, color) {
    const r = Math.floor(size / 2);
    ctx.fillStyle = color;
    // Rayos principales vertical y horizontal
    ctx.fillRect(cx - 2, cy - r, 4, r * 2);
    ctx.fillRect(cx - r, cy - 2, r * 2, 4);
    // Rayos diagonales escalonados
    const d = Math.floor(r * 0.65);
    ctx.fillRect(cx - d, cy - d, d * 2, 3);
    ctx.fillRect(cx - d, cy + d - 3, d * 2, 3);
    ctx.fillRect(cx - 4, cy - 4, 8, 8);
    ctx.fillStyle = PALETTE.jasmine;
    ctx.fillRect(cx - 2, cy - 2, 4, 4);
  }

  _drawCardSprite(ctx, id, x, y, size, glowColor = '#D4AF37') {
    const vfx = this.externalVFX || (typeof window !== 'undefined' ? window.CitlalliVFX : null);
    if (vfx && typeof vfx.drawSprite === 'function') {
      try {
        vfx.drawSprite(ctx, id, x + size / 2, y + size / 2, size, {
          centered: true,
          glow: true,
          glowColor
        });
        return;
      } catch (_) {}
    }

    const sprite = CARD_SPRITES_12[id] || CARD_SPRITES_12.bottle;
    const rows = sprite.grid.length;
    const cols = sprite.grid[0].length;
    const px = Math.max(1, size / cols);

    for (let r = 0; r < rows; r++) {
      const line = sprite.grid[r];
      for (let c = 0; c < cols; c++) {
        const ch = line[c];
        if (ch !== '.' && sprite.palette[ch]) {
          ctx.fillStyle = sprite.palette[ch];
          ctx.fillRect(
            Math.floor(x + c * px),
            Math.floor(y + r * px),
            Math.ceil(px),
            Math.ceil(px)
          );
        }
      }
    }
  }

  _drawHUD(ctx, m) {
    const w = m.canvasW;

    ctx.fillStyle = 'rgba(5, 9, 21, 0.94)';
    ctx.fillRect(0, 0, w, this.hudHeight);
    ctx.fillStyle = PALETTE.goldImperial;
    ctx.fillRect(0, this.hudHeight - 2, w, 2);

    ctx.textBaseline = 'middle';

    // Izquierda: Puntos y Pares de J1
    ctx.textAlign = 'left';
    ctx.font = 'bold 13px "Press Start 2P", "Courier New", monospace';
    ctx.fillStyle = this.currentTurn === 'p1' ? PALETTE.goldBright : PALETTE.goldSoft;
    ctx.fillText(`J1: ${this.score} PTS (${this.p1Pairs}/${this.stats.totalPairs})`, 16, 18);

    ctx.font = '11px "Courier New", monospace';
    ctx.fillStyle = PALETTE.roseGold;
    ctx.fillText(
      `RACHA: x${this.combo} | TIEMPO: ${Math.ceil(this.timeRemaining)}s`,
      16,
      40
    );

    // Centro: Botón interactivo "Brisa de Hidalgo" (1 vez por partida)
    const btnW = 206;
    const btnH = 30;
    const btnX = Math.floor(w / 2 - btnW / 2);
    const btnY = 14;
    this.breezeButtonRect = { x: btnX, y: btnY, w: btnW, h: btnH };

    ctx.fillStyle = this.breezeAvailable ? 'rgba(20, 56, 82, 0.9)' : 'rgba(25, 28, 42, 0.6)';
    ctx.fillRect(btnX, btnY, btnW, btnH);
    ctx.strokeStyle = this.breezeAvailable ? PALETTE.turquoise : 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(btnX, btnY, btnW, btnH);

    ctx.textAlign = 'center';
    ctx.font = 'bold 11px "Courier New", monospace';
    ctx.fillStyle = this.breezeAvailable ? PALETTE.turquoise : 'rgba(255,255,255,0.38)';
    ctx.fillText(
      this.breezeAvailable ? '✦ BRISA DE HIDALGO [B]' : '✦ BRISA UTILIZADA',
      btnX + btnW / 2,
      btnY + btnH / 2
    );

    // Derecha: Estado de Modo 2P / VS IA Jaguar o Progreso 1P
    ctx.textAlign = 'right';
    if (this.mode === '2p_local' || this.mode === 'vs_ai' || this.mode === 'online') {
      const rivalName = this.mode === 'vs_ai' ? 'IA JAGUAR' : this.mode === '2p_local' ? 'J2 ORO ROSA' : 'RIVAL';
      ctx.font = 'bold 13px "Press Start 2P", "Courier New", monospace';
      ctx.fillStyle = this.currentTurn === 'p2' ? PALETTE.roseBright : PALETTE.roseGold;
      ctx.fillText(`${rivalName}: ${this.p2Score} (${this.p2Pairs})`, w - 16, 18);

      ctx.font = 'bold 11px "Courier New", monospace';
      ctx.fillStyle = this.currentTurn === 'p1' ? PALETTE.goldBright : PALETTE.roseBright;
      ctx.fillText(
        `TURNO ACTUAL: ${this.currentTurn === 'p1' ? 'JUGADOR 1' : rivalName}`,
        w - 16,
        40
      );
    } else {
      ctx.font = 'bold 12px "Courier New", monospace';
      ctx.fillStyle = PALETTE.goldSoft;
      ctx.fillText(`PARES: ${this.stats.pairsFound} / ${this.stats.totalPairs}`, w - 16, 18);
      ctx.font = '11px "Courier New", monospace';
      ctx.fillStyle = PALETTE.jasmine;
      ctx.fillText(`MOVIMIENTOS: ${this.stats.moves}`, w - 16, 40);
    }
  }

  _drawOverlayModal(ctx, m, title, subtitle, actionLabel) {
    const w = m.canvasW;
    const h = m.canvasH;
    ctx.save();
    ctx.fillStyle = 'rgba(5, 9, 21, 0.84)';
    ctx.fillRect(0, this.hudHeight, w, h - this.hudHeight);

    const boxW = Math.min(w - 40, 510);
    const boxH = 190;
    const bx = (w - boxW) / 2;
    const by = this.hudHeight + (h - this.hudHeight - boxH) / 2;

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

    ctx.font = 'bold 15px "Press Start 2P", "Courier New", monospace';
    ctx.fillStyle = PALETTE.goldBright;
    ctx.fillText(title, bx + boxW / 2, by + 48);

    ctx.font = '13px "Courier New", monospace';
    ctx.fillStyle = PALETTE.jasmine;
    ctx.fillText(subtitle, bx + boxW / 2, by + 96);

    const blink = Math.floor(performance.now() / 450) % 2 === 0;
    ctx.font = 'bold 13px "Courier New", monospace';
    ctx.fillStyle = blink ? PALETTE.amber : PALETTE.roseGold;
    ctx.fillText(actionLabel, bx + boxW / 2, by + 144);

    ctx.restore();
  }

  // =========================================================================
  // PARTÍCULAS Y AUDIO
  // =========================================================================

  _createAmbientStars(count) {
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        x: Math.random(),
        y: Math.random(),
        size: Math.random() > 0.7 ? 3 : 2,
        speed: 1.4 + Math.random() * 2.2,
        phase: Math.random() * Math.PI * 2
      });
    }
    return arr;
  }

  _spawnCardSparks(x, y, color, count = 14) {
    const vfx = this.externalVFX || (typeof window !== 'undefined' ? window.CitlalliVFX : null);
    if (vfx) {
      try {
        if (typeof vfx.spawnParticles === 'function') {
          vfx.spawnParticles(x, y, color, count);
        } else if (typeof vfx.burst === 'function') {
          vfx.burst(x, y, color, count);
        }
      } catch (_) {}
    }

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
      const speed = 40 + Math.random() * 95;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 25,
        size: Math.random() > 0.5 ? 4 : 3,
        color: i % 2 === 0 ? PALETTE.goldBright : color,
        life: 0.45 + Math.random() * 0.35,
        maxLife: 0.8
      });
    }
  }

  _addFloatingText(text, x, y, color = PALETTE.goldBright) {
    const w = this.canvas ? this.canvas.width : 768;
    this.floatingTexts.push({
      text,
      x: Math.max(110, Math.min(w - 110, x)),
      y: Math.max(this.hudHeight + 20, y),
      color,
      life: 1.25,
      maxLife: 1.25
    });
  }

  _drawParticlesAndPopups(ctx) {
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
      ctx.globalAlpha = Math.max(0, ft.life / ft.maxLife);
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
          game: 'memory',
          score: this.score,
          p1Score: this.score,
          p2Score: this.p2Score,
          p1Pairs: this.p1Pairs,
          p2Pairs: this.p2Pairs,
          combo: this.combo,
          breezeAvailable: this.breezeAvailable,
          mode: this.mode,
          scenarioId: this.scenarioId,
          stats: { ...this.stats }
        });
      } catch (_) {}
    }
  }

  _playSound(type, combo = 1) {
    const audio = this.externalAudio || (typeof window !== 'undefined' ? window.CitlalliAudio : null);
    if (audio && typeof audio.playSFX === 'function') {
      const sfxMap = {
        flip: 'flip',
        match: 'match',
        mismatch: 'mismatch',
        breeze: 'spray',
        victory: 'victory',
        gameover: 'gameover',
        cursor: 'click',
        start: 'click',
        pause: 'click',
        resume: 'click'
      };
      try {
        audio.playSFX(sfxMap[type] || type);
        return;
      } catch (_) {}
    }

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

      if (type === 'flip' || type === 'cursor') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(type === 'flip' ? 520 : 380, now);
        osc.frequency.exponentialRampToValueAtTime(type === 'flip' ? 760 : 440, now + 0.07);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'match' || type === 'breeze' || type === 'victory') {
        const base = 440 + Math.min(5, combo) * 60;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(base, now);
        osc.frequency.setValueAtTime(base * 1.25, now + 0.07);
        osc.frequency.setValueAtTime(base * 1.5, now + 0.14);
        gain.gain.setValueAtTime(0.11, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'mismatch' || type === 'gameover') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(240, now);
        osc.frequency.exponentialRampToValueAtTime(130, now + 0.18);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.19);
        osc.start(now);
        osc.stop(now + 0.19);
      }
    } catch (_) {}
  }
}

// Registro global seguro en window.CitlalliGames
if (typeof window !== 'undefined') {
  window.CitlalliGames = window.CitlalliGames || {};
  window.CitlalliGames.memory = MemoryGame;
}

export default MemoryGame;
