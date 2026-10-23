/**
 * CITLALLI — Salón Arcade
 * Base de Datos Volátil en Memoria RAM (In-Memory Database)
 *
 * Esta base de datos vive exclusivamente en la memoria RAM del proceso de Node.js / Vite.
 * Se inicializa al arrancar la aplicación (`npm run dev`), almacena récords y avatares oficiales,
 * y se destruye por completo sin persistencia en disco ni huella al apagarse el servidor.
 */

// ============================================================================
// CATÁLOGO OFICIAL DE 12 AVATARES PIXEL ART
// ============================================================================

export const OFFICIAL_AVATARS = [
  {
    id: 'bottle',
    name: 'Frasco Citlalli',
    emoji: '🧴',
    sprite: '/assets/pixel-art/sprites/bottle_citlalli.png',
    color: '#E0A98B',
    description: 'El frasco facetado de vidrio artesanal con el aroma de los dioses.'
  },
  {
    id: 'charm_qm',
    name: 'Medallón QM',
    emoji: '🪙',
    sprite: '/assets/pixel-art/sprites/charm_qm.png',
    color: '#F3C6A5',
    description: 'Medallón en oro rosa con la marca sagrada de la casa.'
  },
  {
    id: 'jaguar',
    name: 'Jaguar Dorado',
    emoji: '🐆',
    sprite: '/assets/pixel-art/sprites/jaguar_gold.png',
    color: '#D4AF37',
    description: 'Espíritu guerrero que custodia el ámbar y la noche en Hidalgo.'
  },
  {
    id: 'star',
    name: 'Estrella Citlalli',
    emoji: '⭐',
    sprite: '/assets/pixel-art/sprites/star_citlalli.png',
    color: '#FFE57F',
    description: 'Guía astral en el firmamento nocturno de los valles hidalguenses.'
  },
  {
    id: 'mandarin',
    name: 'Mandarina Cítrica',
    emoji: '🍊',
    sprite: '/assets/pixel-art/sprites/mandarin.png',
    color: '#FFA726',
    description: 'Nota de salida chispeante y luminosa cosechada en el rocío matinal.'
  },
  {
    id: 'rose',
    name: 'Rosa Rosada',
    emoji: '🌹',
    sprite: '/assets/pixel-art/sprites/rose_pink.png',
    color: '#F48FB1',
    description: 'Corazón floral aterciopelado que evoca el romance eterno.'
  },
  {
    id: 'jasmine',
    name: 'Jazmín Blanco',
    emoji: '🌸',
    sprite: '/assets/pixel-art/sprites/jasmine_white.png',
    color: '#FFFFFF',
    description: 'Flor nocturna de elegancia pura recogida bajo el manto de estrellas.'
  },
  {
    id: 'vanilla',
    name: 'Vaina de Vainilla',
    emoji: '🍦',
    sprite: '/assets/pixel-art/sprites/vanilla_pod.png',
    color: '#FFE082',
    description: 'Calidez dulce y reconfortante de la vainilla de Papantla ancestral.'
  },
  {
    id: 'amber',
    name: 'Cristal de Ámbar',
    emoji: '💎',
    sprite: '/assets/pixel-art/sprites/amber_crystal.png',
    color: '#FFB300',
    description: 'Resina mística fosilizada que sella la fijación divina en la piel.'
  },
  {
    id: 'vessel',
    name: 'Vasija de David',
    emoji: '🏺',
    sprite: '/assets/pixel-art/sprites/clay_vessel.png',
    color: '#BCAAA4',
    description: 'Artesanía de barro cocido donde reposa la maceración sagrada.'
  },
  {
    id: 'snake',
    name: 'Quetzal Dorado',
    emoji: '🐍',
    sprite: '/assets/pixel-art/sprites/snake_head_gold.png',
    color: '#FFD54F',
    description: 'La serpiente emplumada que teje la estela aromática de los dioses.'
  },
  {
    id: 'winged_bottle',
    name: 'Frasco Alado',
    emoji: '🪽',
    sprite: '/assets/pixel-art/sprites/bottle_winged.png',
    color: '#80DEEA',
    description: 'El frasco celestial que surca los cielos hacia el límite de las estrellas.'
  }
];

// ============================================================================
// DATOS SEMILLA DE GALA DEL EQUIPO Y LORE OFICIAL
// ============================================================================

export const SEED_RECORDS = [
  // --- Snake (La Víborita: Estela de los Dioses) ---
  {
    id: 'seed-snake-1',
    gameId: 'snake',
    playerName: 'David de Hidalgo',
    avatar: 'bottle',
    score: 940,
    scenarioId: 'hidalgo',
    mode: '1p',
    rank: 'Dios de las Estrellas (Hombre Citlalli)',
    bestMs: null,
    date: '2025-05-14',
    isSeed: true
  },
  {
    id: 'seed-snake-2',
    gameId: 'snake',
    playerName: 'Fernando Reynosa',
    avatar: 'jaguar',
    score: 780,
    scenarioId: 'jaguar',
    mode: '2p',
    rank: 'Caballero del Jaguar Dorado',
    bestMs: null,
    date: '2025-05-15',
    isSeed: true
  },
  {
    id: 'seed-snake-3',
    gameId: 'snake',
    playerName: 'Alejandro Velázquez',
    avatar: 'star',
    score: 720,
    scenarioId: 'penthouse',
    mode: '1p',
    rank: 'Caballero del Jaguar Dorado',
    bestMs: null,
    date: '2025-05-15',
    isSeed: true
  },
  {
    id: 'seed-snake-4',
    gameId: 'snake',
    playerName: 'El Hombre Citlalli',
    avatar: 'charm_qm',
    score: 640,
    scenarioId: 'velvet',
    mode: 'ai',
    rank: 'Caballero del Jaguar Dorado',
    bestMs: null,
    date: '2025-05-12',
    isSeed: true
  },
  {
    id: 'seed-snake-5',
    gameId: 'snake',
    playerName: 'Guardián del Jaguar',
    avatar: 'jaguar',
    score: 480,
    scenarioId: 'jaguar',
    mode: '1p',
    rank: 'Alquimista de Terciopelo',
    bestMs: null,
    date: '2025-05-10',
    isSeed: true
  },

  // --- Memory (Memorama Olfativo & Astral) ---
  {
    id: 'seed-memory-1',
    gameId: 'memory',
    playerName: 'Alejandro Velázquez',
    avatar: 'charm_qm',
    score: 960,
    scenarioId: 'velvet',
    mode: '1p',
    rank: 'Dios de las Estrellas (Hombre Citlalli)',
    bestMs: null,
    date: '2025-05-15',
    isSeed: true
  },
  {
    id: 'seed-memory-2',
    gameId: 'memory',
    playerName: 'Fernando Reynosa',
    avatar: 'bottle',
    score: 840,
    scenarioId: 'hidalgo',
    mode: '2p',
    rank: 'Caballero del Jaguar Dorado',
    bestMs: null,
    date: '2025-05-15',
    isSeed: true
  },
  {
    id: 'seed-memory-3',
    gameId: 'memory',
    playerName: 'Citlalli Astral',
    avatar: 'star',
    score: 710,
    scenarioId: 'hidalgo',
    mode: '1p',
    rank: 'Caballero del Jaguar Dorado',
    bestMs: null,
    date: '2025-05-13',
    isSeed: true
  },
  {
    id: 'seed-memory-4',
    gameId: 'memory',
    playerName: 'David de Hidalgo',
    avatar: 'bottle',
    score: 590,
    scenarioId: 'velvet',
    mode: 'ai',
    rank: 'Alquimista de Terciopelo',
    bestMs: null,
    date: '2025-05-11',
    isSeed: true
  },

  // --- Reflex (Destilación Relámpago) ---
  {
    id: 'seed-reflex-1',
    gameId: 'reflex',
    playerName: 'El Hombre Citlalli',
    avatar: 'jaguar',
    score: 980,
    bestMs: 168,
    scenarioId: 'jaguar',
    mode: 'ai',
    rank: 'Dios de las Estrellas (Hombre Citlalli)',
    date: '2025-05-15',
    isSeed: true
  },
  {
    id: 'seed-reflex-2',
    gameId: 'reflex',
    playerName: 'Fernando Reynosa',
    avatar: 'star',
    score: 850,
    bestMs: 184,
    scenarioId: 'penthouse',
    mode: '2p',
    rank: 'Caballero del Jaguar Dorado',
    date: '2025-05-15',
    isSeed: true
  },
  {
    id: 'seed-reflex-3',
    gameId: 'reflex',
    playerName: 'Alejandro Velázquez',
    avatar: 'bottle',
    score: 790,
    bestMs: 195,
    scenarioId: 'jaguar',
    mode: '1p',
    rank: 'Caballero del Jaguar Dorado',
    date: '2025-05-14',
    isSeed: true
  },
  {
    id: 'seed-reflex-4',
    gameId: 'reflex',
    playerName: 'Guardián del Jaguar',
    avatar: 'jaguar',
    score: 630,
    bestMs: 215,
    scenarioId: 'jaguar',
    mode: '1p',
    rank: 'Caballero del Jaguar Dorado',
    date: '2025-05-11',
    isSeed: true
  },

  // --- Flappy Citlalli (El Límite son las Estrellas) ---
  {
    id: 'seed-flappy-1',
    gameId: 'flappy',
    playerName: 'Citlalli Astral',
    avatar: 'star',
    score: 920,
    scenarioId: 'hidalgo',
    mode: '1p',
    rank: 'Dios de las Estrellas (Hombre Citlalli)',
    bestMs: null,
    date: '2025-05-15',
    isSeed: true
  },
  {
    id: 'seed-flappy-2',
    gameId: 'flappy',
    playerName: 'David de Hidalgo',
    avatar: 'bottle',
    score: 810,
    scenarioId: 'penthouse',
    mode: '1p',
    rank: 'Caballero del Jaguar Dorado',
    bestMs: null,
    date: '2025-05-14',
    isSeed: true
  },
  {
    id: 'seed-flappy-3',
    gameId: 'flappy',
    playerName: 'Fernando Reynosa',
    avatar: 'charm_qm',
    score: 740,
    scenarioId: 'penthouse',
    mode: '2p',
    rank: 'Caballero del Jaguar Dorado',
    bestMs: null,
    date: '2025-05-14',
    isSeed: true
  },
  {
    id: 'seed-flappy-4',
    gameId: 'flappy',
    playerName: 'Alejandro Velázquez',
    avatar: 'jaguar',
    score: 690,
    scenarioId: 'jaguar',
    mode: '1p',
    rank: 'Caballero del Jaguar Dorado',
    bestMs: null,
    date: '2025-05-13',
    isSeed: true
  },

  // --- Tournament (Copa Citlalli 1ZMEADMLSA) ---
  {
    id: 'seed-tourney-1',
    gameId: 'tournament',
    playerName: 'El Hombre Citlalli',
    avatar: 'jaguar',
    score: 3420,
    scenarioId: 'penthouse',
    mode: 'tournament',
    rank: 'Dios de las Estrellas (Hombre Citlalli)',
    bestMs: null,
    date: '2025-05-15',
    isSeed: true
  },
  {
    id: 'seed-tourney-2',
    gameId: 'tournament',
    playerName: 'Fernando Reynosa',
    avatar: 'bottle',
    score: 3180,
    scenarioId: 'jaguar',
    mode: 'tournament',
    rank: 'Dios de las Estrellas (Hombre Citlalli)',
    bestMs: null,
    date: '2025-05-15',
    isSeed: true
  },
  {
    id: 'seed-tourney-3',
    gameId: 'tournament',
    playerName: 'Alejandro Velázquez',
    avatar: 'charm_qm',
    score: 3090,
    scenarioId: 'velvet',
    mode: 'tournament',
    rank: 'Dios de las Estrellas (Hombre Citlalli)',
    bestMs: null,
    date: '2025-05-15',
    isSeed: true
  },
  {
    id: 'seed-tourney-4',
    gameId: 'tournament',
    playerName: 'David de Hidalgo',
    avatar: 'star',
    score: 2890,
    scenarioId: 'hidalgo',
    mode: 'tournament',
    rank: 'Caballero del Jaguar Dorado',
    bestMs: null,
    date: '2025-05-14',
    isSeed: true
  }
];

// ============================================================================
// HELPER: CÁLCULO DE RANGOS MÍSTICOS
// ============================================================================

function calculateMysticRank(score = 0, gameId = 'snake') {
  const normalized = gameId === 'tournament' ? Math.round(score / 3.2) : score;
  if (normalized >= 900) return 'Dios de las Estrellas (Hombre Citlalli)';
  if (normalized >= 620) return 'Caballero del Jaguar Dorado';
  if (normalized >= 380) return 'Alquimista de Terciopelo';
  if (normalized >= 180) return 'Destilador del Rocío';
  return 'Aprendiz de Hidalgo';
}

// ============================================================================
// CLASE GESTORA DE LA BASE DE DATOS EN MEMORIA RAM
// ============================================================================

export class InMemoryDatabase {
  constructor() {
    /** @type {Array<object>} Almacén volátil de récords en memoria RAM */
    this.records = [];
    /** @type {Map<string, object>} Catálogo oficial indexado por ID de avatar */
    this.avatarsMap = new Map();

    this._initAvatars();
    this.resetToSeed();
  }

  _initAvatars() {
    this.avatarsMap.clear();
    for (const av of OFFICIAL_AVATARS) {
      this.avatarsMap.set(av.id, { ...av });
    }
  }

  /**
   * Reinicia la memoria RAM a los datos semilla oficiales.
   * Elimina cualquier dato temporal previo y repuebla con los récords de gala.
   */
  resetToSeed() {
    this.records = SEED_RECORDS.map((rec) => ({ ...rec }));
    return { ok: true, count: this.records.length };
  }

  /**
   * Obtiene la lista de avatares pixel art oficiales disponibles.
   * @returns {Array<object>}
   */
  getAvatars() {
    return OFFICIAL_AVATARS.map((av) => ({ ...av }));
  }

  /**
   * Obtiene la tabla de récords filtrada por juego y ordenada por puntuación descendente.
   * @param {string|object} [gameId='all'] Identificador del juego o mapa de opciones
   * @param {number} [limit=20] Límite de récords a devolver
   * @returns {Array<object>}
   */
  getLeaderboard(gameId = 'all', limit = 20) {
    let targetGame = 'all';
    let targetLimit = 20;

    if (typeof gameId === 'object' && gameId !== null) {
      targetGame = gameId.gameId || gameId.game || 'all';
      targetLimit = parseInt(gameId.limit, 10) || 20;
    } else {
      targetGame = typeof gameId === 'string' ? gameId : 'all';
      targetLimit = parseInt(limit, 10) || 20;
    }

    if (isNaN(targetLimit) || targetLimit <= 0) {
      targetLimit = 20;
    }
    targetLimit = Math.min(targetLimit, 100);

    let filtered = [...this.records];
    if (targetGame && targetGame !== 'all') {
      filtered = filtered.filter((r) => r.gameId === targetGame);
    }

    // Ordenar de mayor a menor puntuación; en caso de empate, por fecha o mejor tiempo
    filtered.sort((a, b) => {
      const diff = (b.score || 0) - (a.score || 0);
      if (diff !== 0) return diff;
      if (a.bestMs && b.bestMs) return a.bestMs - b.bestMs;
      return (b.createdAt || 0) - (a.createdAt || 0);
    });

    return filtered.slice(0, targetLimit).map((r) => ({ ...r }));
  }

  /**
   * Agrega un nuevo récord a la memoria RAM.
   * Valida parámetros, asigna rango místico, fecha y un ID único volátil.
   * @param {object} param0
   * @returns {object} Registro insertado
   */
  addRecord({
    playerName,
    avatar,
    gameId = 'snake',
    score = 0,
    scenarioId = 'hidalgo',
    mode = '1p',
    rank = null,
    bestMs = null,
    stats = {}
  } = {}) {
    // Sanitización y validación
    const cleanName = String(playerName || 'Viajero Estelar').trim().slice(0, 32) || 'Viajero Estelar';
    const cleanGameId = String(gameId || 'snake').trim().toLowerCase();
    const cleanScore = Math.max(0, Math.round(Number(score) || 0));
    const cleanScenarioId = String(scenarioId || 'hidalgo').trim().toLowerCase();
    const cleanMode = String(mode || '1p').trim().toLowerCase();

    // Validar avatar existente en el catálogo oficial
    const cleanAvatarId = String(avatar || 'bottle').trim();
    const validAvatar = this.avatarsMap.has(cleanAvatarId) ? cleanAvatarId : 'bottle';

    // Rango místico
    const finalRank = rank && typeof rank === 'string' && rank.trim()
      ? rank.trim()
      : calculateMysticRank(cleanScore, cleanGameId);

    // Milisegundos de reacción (para juego reflex)
    const cleanBestMs = bestMs !== null && !isNaN(Number(bestMs)) ? Math.round(Number(bestMs)) : null;

    const newRecord = {
      id: `ram-rec-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      playerName: cleanName,
      avatar: validAvatar,
      gameId: cleanGameId,
      score: cleanScore,
      scenarioId: cleanScenarioId,
      mode: cleanMode,
      rank: finalRank,
      bestMs: cleanBestMs,
      stats: typeof stats === 'object' && stats !== null ? { ...stats } : {},
      date: new Date().toISOString().slice(0, 10),
      createdAt: Date.now(),
      isSeed: false
    };

    this.records.push(newRecord);

    return { ...newRecord };
  }
}

// ============================================================================
// INSTANCIA SINGLETON Y FUNCIONES DE ACCESO RÁPIDO
// ============================================================================

export const inMemoryDb = new InMemoryDatabase();

export function getLeaderboard(gameId = 'all', limit = 20) {
  return inMemoryDb.getLeaderboard(gameId, limit);
}

export function addRecord(record) {
  return inMemoryDb.addRecord(record);
}

export function getAvatars() {
  return inMemoryDb.getAvatars();
}

export function resetToSeed() {
  return inMemoryDb.resetToSeed();
}

export default inMemoryDb;
