/**
 * CITLALLI — "El Aroma de los Dioses"
 * Motor de Multijugador Simultáneo, Tabla de Récords, Generador de Tarjetas de Trofeo,
 * Constelación de 12 Logros y Modo Torneo "Copa Citlalli 1ZMEADMLSA".
 */

export const AVATARS_LIST = [
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

export const EMOTES_LIST = [
  {
    id: 'aroma',
    icon: '🧴',
    label: '¡Aroma de los Dioses!',
    color: '#E0A98B',
    sfx: 'powerup'
  },
  {
    id: 'jaguar',
    icon: '🐆',
    label: '¡Fuerza del Jaguar!',
    color: '#D4AF37',
    sfx: 'combo'
  },
  {
    id: 'stars',
    icon: '⭐',
    label: '¡El límite son las estrellas!',
    color: '#FFE57F',
    sfx: 'win'
  },
  {
    id: 'streak',
    icon: '🔥',
    label: '¡Racha Dorada!',
    color: '#FF8A50',
    sfx: 'collect'
  }
];

export const MYSTIC_RANKS = [
  {
    id: 'aprendiz',
    title: 'Aprendiz de Hidalgo',
    minScore: 0,
    color: '#C5B8A5',
    badge: '🌱',
    quote: 'El rocío de la mañana despierta las primeras flores en Hidalgo.'
  },
  {
    id: 'destilador',
    title: 'Destilador del Rocío',
    minScore: 180,
    color: '#E0A98B',
    badge: '🏺',
    quote: 'Dominas las vasijas de barro y el arte de extraer la pureza.'
  },
  {
    id: 'alquimista',
    title: 'Alquimista de Terciopelo',
    minScore: 380,
    color: '#F0C75E',
    badge: '✨',
    quote: 'Mandarina, rosa, jazmín, vainilla y ámbar danzan en tu creación.'
  },
  {
    id: 'caballero_jaguar',
    title: 'Caballero del Jaguar Dorado',
    minScore: 620,
    color: '#D4AF37',
    badge: '🐆',
    quote: 'Fuerza, elegancia nocturna y misticismo prehispánico en cada paso.'
  },
  {
    id: 'dios_estrellas',
    title: 'Dios de las Estrellas (Hombre Citlalli)',
    minScore: 900,
    color: '#FFF3B0',
    badge: '👑',
    quote: 'El límite son las estrellas. Portas el verdadero Aroma de los Dioses.'
  }
];

export const TOURNAMENT_GAMES = [
  {
    id: 'snake',
    step: 1,
    name: 'La Víborita: Estela de los Dioses',
    shortName: 'Víborita',
    icon: '🐍',
    scenarioId: 'hidalgo',
    description: 'Recolecta las notas olfativas en el valle estrellado de Hidalgo.'
  },
  {
    id: 'memory',
    step: 2,
    name: 'Memorama: Memoria Olfativa & Astral',
    shortName: 'Memorama',
    icon: '🃏',
    scenarioId: 'velvet',
    description: 'Empareja los símbolos sagrados en la Cámara de Terciopelo.'
  },
  {
    id: 'reflex',
    step: 3,
    name: 'Reflejos: Destilación Relámpago',
    shortName: 'Reflejos',
    icon: '⚡',
    scenarioId: 'jaguar',
    description: 'Atrapa la esencia dorada en milisegundos frente al Jaguar.'
  },
  {
    id: 'flappy',
    step: 4,
    name: 'Flappy Citlalli: El Límite son las Estrellas',
    shortName: 'Flappy Citlalli',
    icon: '🦅',
    scenarioId: 'penthouse',
    description: 'Eleva el frasco facetado sobre los rascacielos hacia el cosmos.'
  }
];

export const ACHIEVEMENTS_LIST = [
  {
    id: 'first_spray',
    title: 'Primera Gota de Rocío',
    description: 'Activa el atomizador sensorial de Citlalli o inicia tu primera partida.',
    icon: '💧',
    starCoords: { x: 12, y: 68 },
    points: 50
  },
  {
    id: 'alchemist_mix',
    title: 'Alquimista de Hidalgo',
    description: 'Destila tu propia mezcla en el Laboratorio Olfativo de David.',
    icon: '🏺',
    starCoords: { x: 22, y: 42 },
    points: 100
  },
  {
    id: 'five_notes',
    title: 'Maestro de las 5 Notas',
    description: 'Reúne Mandarina, Bergamota, Rosa/Jazmín, Vainilla y Ámbar en La Víborita.',
    icon: '🍊',
    starCoords: { x: 31, y: 25 },
    points: 120
  },
  {
    id: 'velvet_memory',
    title: 'Memoria de Terciopelo',
    description: 'Completa el Memorama Olfativo descubriendo todos los pares de lujo.',
    icon: '🃏',
    starCoords: { x: 42, y: 55 },
    points: 150
  },
  {
    id: 'lightning_reflex',
    title: 'Reflejo Relámpago (<220ms)',
    description: 'Atrapa una esencia en menos de 220 milisegundos en Destilación Relámpago.',
    icon: '⚡',
    starCoords: { x: 49, y: 20 },
    points: 180
  },
  {
    id: 'hidalgo_flight',
    title: 'Vuelo sobre Hidalgo',
    description: 'Cruza al menos 8 portales estelares en Flappy Citlalli.',
    icon: '🦅',
    starCoords: { x: 58, y: 46 },
    points: 150
  },
  {
    id: 'simultaneous_duel',
    title: 'Duelo Simultáneo',
    description: 'Compite en modo 2 Jugadores, contra la IA o en una Sala Multijugador en vivo.',
    icon: '⚔️',
    starCoords: { x: 66, y: 74 },
    points: 130
  },
  {
    id: 'golden_streak',
    title: 'Racha Dorada x5',
    description: 'Alcanza un multiplicador de combo x5 o lanza un Emote en la Sala Arcade.',
    icon: '🔥',
    starCoords: { x: 72, y: 30 },
    points: 140
  },
  {
    id: 'jaguar_awakening',
    title: 'Despertar del Jaguar Dorado',
    description: 'Supera los 500 puntos en cualquier juego o domina el Santuario del Jaguar.',
    icon: '🐆',
    starCoords: { x: 79, y: 58 },
    points: 200
  },
  {
    id: 'challenge_conqueror',
    title: 'Embajador de las Estrellas',
    description: 'Descarga tu Tarjeta de Trofeo PNG o comparte un enlace de Desafío Citlalli.',
    icon: '🏅',
    starCoords: { x: 85, y: 22 },
    points: 160
  },
  {
    id: 'copa_citlalli',
    title: 'Campeón Copa Citlalli',
    description: 'Completa las 4 etapas encadenadas del Torneo Copa Citlalli 1ZMEADMLSA.',
    icon: '🏆',
    starCoords: { x: 90, y: 48 },
    points: 300
  },
  {
    id: 'star_god',
    title: 'Dios de las Estrellas',
    description: 'Alcanza el rango místico supremo: "Dios de las Estrellas (Hombre Citlalli)".',
    icon: '👑',
    starCoords: { x: 95, y: 15 },
    points: 500
  }
];

const INITIAL_LEADERBOARD = [
  // Snake
  {
    id: 'seed-snake-1',
    gameId: 'snake',
    playerName: 'David de Hidalgo',
    avatar: 'bottle',
    score: 940,
    scenarioId: 'hidalgo',
    mode: '1p',
    rank: 'Dios de las Estrellas (Hombre Citlalli)',
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
    date: '2025-05-10',
    isSeed: true
  },

  // Memory
  {
    id: 'seed-memory-1',
    gameId: 'memory',
    playerName: 'Alejandro Velázquez',
    avatar: 'charm_qm',
    score: 960,
    scenarioId: 'velvet',
    mode: '1p',
    rank: 'Dios de las Estrellas (Hombre Citlalli)',
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
    date: '2025-05-11',
    isSeed: true
  },

  // Reflex
  {
    id: 'seed-reflex-1',
    gameId: 'reflex',
    playerName: 'El Hombre Citlalli',
    avatar: 'jaguar',
    score: 980,
    scenarioId: 'jaguar',
    mode: 'ai',
    rank: 'Dios de las Estrellas (Hombre Citlalli)',
    date: '2025-05-15',
    isSeed: true,
    bestMs: 168
  },
  {
    id: 'seed-reflex-2',
    gameId: 'reflex',
    playerName: 'Fernando Reynosa',
    avatar: 'star',
    score: 850,
    scenarioId: 'penthouse',
    mode: '2p',
    rank: 'Caballero del Jaguar Dorado',
    date: '2025-05-15',
    isSeed: true,
    bestMs: 184
  },
  {
    id: 'seed-reflex-3',
    gameId: 'reflex',
    playerName: 'Alejandro Velázquez',
    avatar: 'bottle',
    score: 790,
    scenarioId: 'jaguar',
    mode: '1p',
    rank: 'Caballero del Jaguar Dorado',
    date: '2025-05-14',
    isSeed: true,
    bestMs: 195
  },
  {
    id: 'seed-reflex-4',
    gameId: 'reflex',
    playerName: 'Guardián del Jaguar',
    avatar: 'jaguar',
    score: 630,
    scenarioId: 'jaguar',
    mode: '1p',
    rank: 'Caballero del Jaguar Dorado',
    date: '2025-05-11',
    isSeed: true,
    bestMs: 215
  },

  // Flappy
  {
    id: 'seed-flappy-1',
    gameId: 'flappy',
    playerName: 'Citlalli Astral',
    avatar: 'star',
    score: 920,
    scenarioId: 'hidalgo',
    mode: '1p',
    rank: 'Dios de las Estrellas (Hombre Citlalli)',
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
    date: '2025-05-13',
    isSeed: true
  },

  // Tournament (Copa Citlalli)
  {
    id: 'seed-tourney-1',
    gameId: 'tournament',
    playerName: 'El Hombre Citlalli',
    avatar: 'jaguar',
    score: 3420,
    scenarioId: 'penthouse',
    mode: 'tournament',
    rank: 'Dios de las Estrellas (Hombre Citlalli)',
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
    date: '2025-05-14',
    isSeed: true
  }
];

const STORAGE_KEYS = {
  LEADERBOARD: 'citlalli_leaderboard_v1',
  ACHIEVEMENTS: 'citlalli_achievements_v1',
  PROFILE: 'citlalli_player_profile_v1',
  ROOM_SYNC: 'citlalli_room_sync_v1',
  BONUS_POINTS: 'citlalli_alchemy_bonus_v1'
};

export class CitlalliMultiplayer {
  constructor() {
    this.channel = null;
    this.playerId = this._generateId('player');
    this.profile = {
      name: 'Viajero Estelar',
      avatar: 'bottle',
      roomCode: 'CITLALLI-01',
      alchemyBonus: 0,
      archetype: null
    };

    this.roomPlayers = new Map();
    this.simulatedRivalsEnabled = true;
    this.botTimer = null;

    this.leaderboard = [];
    this.unlockedAchievements = {};

    // Active challenge from URL (?challenge=snake&score=450&rival=Fernando&scenario=jaguar)
    this.activeChallenge = null;

    // Tournament state ("Copa Citlalli 1ZMEADMLSA")
    this.tournament = {
      active: false,
      currentStageIndex: 0,
      stageScores: {
        snake: 0,
        memory: 0,
        reflex: 0,
        flappy: 0
      },
      totalScore: 0,
      completed: false
    };

    // Event listeners
    this.listeners = {
      roomUpdate: new Set(),
      emote: new Set(),
      leaderboardUpdate: new Set(),
      achievementUnlocked: new Set(),
      challengeUpdate: new Set(),
      tournamentUpdate: new Set()
    };

    if (typeof window !== 'undefined') {
      this._initBrowser();
    }
  }

  _generateId(prefix = 'cit') {
    return `${prefix}-${Math.random().toString(36).substring(2, 8)}-${Date.now().toString(36).slice(-4)}`;
  }

  _initBrowser() {
    this._loadProfile();
    this._loadLeaderboard();
    this._loadAchievements();
    this.parseChallengeFromUrl();
    this._initNetworkChannel();
    this._seedSimulatedRivals();
    this._startHeartbeat();
  }

  /* ==========================================================================
   * PERFIL DE JUGADOR & BONO ALQUÍMICO
   * ========================================================================== */

  _loadProfile() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (saved) {
        const parsed = JSON.parse(saved);
        this.profile = { ...this.profile, ...parsed };
      }
    } catch (_) {
      // Fallback to default profile
    }
  }

  saveProfile(partial = {}) {
    this.profile = {
      ...this.profile,
      ...partial
    };
    if (this.profile.name) {
      this.profile.name = String(this.profile.name).trim().slice(0, 22) || 'Viajero Estelar';
    }
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(this.profile));
    } catch (_) {}

    this._updateSelfInRoom();
    this._broadcastPacket({
      type: 'PLAYER_PRESENCE',
      player: this._getSelfPlayerState()
    });
    return this.profile;
  }

  setAlchemyBonus(bonusPoints = 100, archetype = 'Alquimista Dorado') {
    this.profile.alchemyBonus = Math.max(this.profile.alchemyBonus || 0, bonusPoints);
    this.profile.archetype = archetype;
    this.saveProfile();
    this.unlockAchievement('alchemist_mix');
    return this.profile;
  }

  /* ==========================================================================
   * RANGOS MÍSTICOS
   * ========================================================================== */

  getMysticRank(score = 0, gameId = 'snake') {
    const normalizedScore = gameId === 'tournament' ? Math.round(score / 3.2) : score;
    let currentRank = MYSTIC_RANKS[0];
    let nextRank = MYSTIC_RANKS[1] || null;

    for (let i = 0; i < MYSTIC_RANKS.length; i++) {
      if (normalizedScore >= MYSTIC_RANKS[i].minScore) {
        currentRank = MYSTIC_RANKS[i];
        nextRank = MYSTIC_RANKS[i + 1] || null;
      }
    }

    const progressToNext = nextRank
      ? Math.min(
          100,
          Math.max(
            0,
            Math.round(
              ((normalizedScore - currentRank.minScore) /
                (nextRank.minScore - currentRank.minScore)) *
                100
            )
          )
        )
      : 100;

    return {
      ...currentRank,
      nextRank,
      progressToNext,
      normalizedScore
    };
  }

  getAvatarObject(avatarId) {
    if (!avatarId) return AVATARS_LIST[0];
    const direct = AVATARS_LIST.find((a) => a.id === avatarId);
    if (direct) return direct;
    const fuzzy = AVATARS_LIST.find(
      (a) => avatarId.startsWith(a.id) || avatarId.includes(a.id) || a.sprite.includes(avatarId)
    );
    return fuzzy || AVATARS_LIST[0];
  }

  /* ==========================================================================
   * SALAS MULTIJUGADOR EN TIEMPO REAL (BroadcastChannel + Storage + Bots)
   * ========================================================================== */

  _initNetworkChannel() {
    try {
      if ('BroadcastChannel' in window) {
        this.channel = new BroadcastChannel('citlalli_arcade_net');
        this.channel.onmessage = (event) => {
          if (event && event.data) {
            this._handleNetworkPacket(event.data);
          }
        };
      }
    } catch (_) {}

    window.addEventListener('storage', (event) => {
      if (event.key === STORAGE_KEYS.ROOM_SYNC && event.newValue) {
        try {
          const packet = JSON.parse(event.newValue);
          this._handleNetworkPacket(packet);
        } catch (_) {}
      } else if (event.key === STORAGE_KEYS.LEADERBOARD) {
        this._loadLeaderboard();
        this._emit('leaderboardUpdate', this.leaderboard);
      }
    });

    this._updateSelfInRoom();
    this._broadcastPacket({
      type: 'PLAYER_JOIN',
      player: this._getSelfPlayerState()
    });
  }

  _getSelfPlayerState(overrides = {}) {
    const existing = this.roomPlayers.get(this.playerId) || {};
    return {
      id: this.playerId,
      name: this.profile.name || 'Viajero Estelar',
      avatar: this.profile.avatar || 'bottle',
      roomCode: this.profile.roomCode || 'CITLALLI-01',
      gameId: existing.gameId || 'snake',
      scenarioId: existing.scenarioId || 'hidalgo',
      score: existing.score || 0,
      p2Score: existing.p2Score || 0,
      combo: existing.combo || 1,
      status: existing.status || 'En Sala',
      isSelf: true,
      isBot: false,
      lastSeen: Date.now(),
      ...overrides
    };
  }

  _updateSelfInRoom(overrides = {}) {
    const selfState = this._getSelfPlayerState(overrides);
    this.roomPlayers.set(this.playerId, selfState);
    this._emitRoomUpdate();
    return selfState;
  }

  _broadcastPacket(packet) {
    const payload = {
      ...packet,
      senderId: this.playerId,
      roomCode: this.profile.roomCode,
      timestamp: Date.now()
    };

    try {
      if (this.channel) {
        this.channel.postMessage(payload);
      }
    } catch (_) {}

    try {
      localStorage.setItem(STORAGE_KEYS.ROOM_SYNC, JSON.stringify(payload));
    } catch (_) {}
  }

  _handleNetworkPacket(packet) {
    if (!packet || packet.senderId === this.playerId) return;

    // Only sync room events for matching room code (except global leaderboard updates)
    if (packet.type === 'NEW_RECORD' && packet.entry) {
      this._mergeLeaderboardEntry(packet.entry);
      return;
    }

    if (packet.roomCode && packet.roomCode !== this.profile.roomCode) {
      return;
    }

    if (
      packet.type === 'PLAYER_JOIN' ||
      packet.type === 'PLAYER_PRESENCE' ||
      packet.type === 'GAME_STATE'
    ) {
      if (packet.player && packet.player.id) {
        this.roomPlayers.set(packet.player.id, {
          ...packet.player,
          isSelf: false,
          isBot: false,
          lastSeen: Date.now()
        });
        this._emitRoomUpdate();
      }
      if (packet.type === 'PLAYER_JOIN') {
        // Reply with our own presence so the new tab immediately sees us
        this._broadcastPacket({
          type: 'PLAYER_PRESENCE',
          player: this._getSelfPlayerState()
        });
      }
    } else if (packet.type === 'EMOTE' && packet.emoteData) {
      this._emit('emote', packet.emoteData);
    }
  }

  joinRoom(roomCode = 'CITLALLI-01') {
    const formatted = String(roomCode)
      .toUpperCase()
      .replace(/[^A-Z0-9-]/g, '')
      .slice(0, 16) || 'CITLALLI-01';

    this.profile.roomCode = formatted;
    this.saveProfile({ roomCode: formatted });

    // Clear old non-self players and re-seed bots for the new room
    for (const [id, p] of this.roomPlayers.entries()) {
      if (id !== this.playerId) {
        this.roomPlayers.delete(id);
      }
    }
    if (this.simulatedRivalsEnabled) {
      this._seedSimulatedRivals();
    }
    this._updateSelfInRoom({ roomCode: formatted });
    this._broadcastPacket({
      type: 'PLAYER_JOIN',
      player: this._getSelfPlayerState()
    });

    return formatted;
  }

  generateMysticRoomCode() {
    const prefixes = ['CITLALLI', 'JAGUAR', 'HIDALGO', 'ESTELAR', 'TERCIOPELO', 'QM'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const num = String(Math.floor(10 + Math.random() * 89));
    return this.joinRoom(`${prefix}-${num}`);
  }

  toggleSimulatedRivals(enabled) {
    this.simulatedRivalsEnabled = Boolean(enabled);
    if (!this.simulatedRivalsEnabled) {
      for (const [id, p] of this.roomPlayers.entries()) {
        if (p.isBot) this.roomPlayers.delete(id);
      }
    } else {
      this._seedSimulatedRivals();
    }
    this._emitRoomUpdate();
    return this.simulatedRivalsEnabled;
  }

  _seedSimulatedRivals() {
    if (!this.simulatedRivalsEnabled) return;
    const bots = [
      {
        id: 'bot-david',
        name: 'David (Hidalgo)',
        avatar: 'bottle',
        gameId: 'snake',
        scenarioId: 'hidalgo',
        score: 210,
        combo: 2,
        status: 'Destilando en vivo',
        isBot: true,
        isSelf: false,
        lastSeen: Date.now()
      },
      {
        id: 'bot-jaguar',
        name: 'Sombra del Jaguar',
        avatar: 'jaguar',
        gameId: 'reflex',
        scenarioId: 'jaguar',
        score: 340,
        combo: 3,
        status: 'En Duelo Astral',
        isBot: true,
        isSelf: false,
        lastSeen: Date.now()
      }
    ];

    for (const bot of bots) {
      if (!this.roomPlayers.has(bot.id)) {
        this.roomPlayers.set(bot.id, {
          ...bot,
          roomCode: this.profile.roomCode
        });
      }
    }
  }

  _startHeartbeat() {
    if (this.botTimer) clearInterval(this.botTimer);
    this.botTimer = setInterval(() => {
      const now = Date.now();
      let changed = false;

      // Prune stale remote tabs (>45s without heartbeat)
      for (const [id, player] of this.roomPlayers.entries()) {
        if (!player.isSelf && !player.isBot && now - (player.lastSeen || 0) > 45000) {
          this.roomPlayers.delete(id);
          changed = true;
        }
      }

      // Gently animate simulated rivals when user is playing
      const self = this.roomPlayers.get(this.playerId);
      if (this.simulatedRivalsEnabled && self) {
        for (const [, bot] of this.roomPlayers.entries()) {
          if (bot.isBot) {
            if (self.status === 'Jugando') {
              bot.gameId = self.gameId;
              bot.scenarioId = self.scenarioId;
              const delta = Math.floor(Math.random() * 25) - 4;
              const targetBase = Math.max(40, (self.score || 0) + delta);
              bot.score = Math.max(0, Math.round(bot.score * 0.75 + targetBase * 0.25));
              bot.combo = Math.max(1, Math.min(8, Math.round(bot.score / 140)));
              bot.status = 'Compitiendo en vivo';
              changed = true;
            }
          }
        }
      }

      if (changed) {
        this._emitRoomUpdate();
      }
    }, 2400);
  }

  broadcastGameState({
    gameId = 'snake',
    score = 0,
    p2Score = 0,
    combo = 1,
    scenarioId = 'hidalgo',
    status = 'Jugando'
  } = {}) {
    const updatedSelf = this._updateSelfInRoom({
      gameId,
      score: Math.max(0, Math.round(score)),
      p2Score: Math.max(0, Math.round(p2Score)),
      combo: Math.max(1, combo),
      scenarioId,
      status
    });

    if (combo >= 5) {
      this.unlockAchievement('golden_streak');
    }
    if (score >= 500) {
      this.unlockAchievement('jaguar_awakening');
    }

    this._broadcastPacket({
      type: 'GAME_STATE',
      player: updatedSelf
    });

    // Check active challenge progress
    if (this.activeChallenge && this.activeChallenge.active) {
      const beaten = score > this.activeChallenge.targetScore;
      if (beaten && !this.activeChallenge.completed) {
        this.activeChallenge.completed = true;
        this.unlockAchievement('challenge_conqueror');
      }
      this._emit('challengeUpdate', {
        ...this.activeChallenge,
        currentScore: score,
        beaten
      });
    }

    return updatedSelf;
  }

  sendEmote(emoteId = 'aroma') {
    const emoteObj = EMOTES_LIST.find((e) => e.id === emoteId) || EMOTES_LIST[0];
    const self = this._getSelfPlayerState();
    const emoteData = {
      id: this._generateId('emote'),
      playerId: self.id,
      playerName: self.name,
      avatar: self.avatar,
      emoteId: emoteObj.id,
      icon: emoteObj.icon,
      label: emoteObj.label,
      color: emoteObj.color,
      sfx: emoteObj.sfx,
      timestamp: Date.now()
    };

    this.unlockAchievement('golden_streak');
    this._emit('emote', emoteData);
    this._broadcastPacket({
      type: 'EMOTE',
      emoteData
    });

    return emoteData;
  }

  getRoomPlayers() {
    const list = Array.from(this.roomPlayers.values());
    return list.sort((a, b) => (b.score || 0) - (a.score || 0));
  }

  _emitRoomUpdate() {
    const players = this.getRoomPlayers();
    this._emit('roomUpdate', {
      roomCode: this.profile.roomCode,
      players
    });
  }

  /* ==========================================================================
   * TABLA DE RÉCORDS (LEADERBOARD) GLOBAL + POR JUEGO
   * ========================================================================== */

  _loadLeaderboard() {
    let stored = [];
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.LEADERBOARD);
      if (raw) {
        stored = JSON.parse(raw);
      }
    } catch (_) {}

    const map = new Map();
    for (const item of INITIAL_LEADERBOARD) {
      map.set(item.id, item);
    }
    if (Array.isArray(stored)) {
      for (const item of stored) {
        if (item && item.id) {
          map.set(item.id, item);
        }
      }
    }

    this.leaderboard = Array.from(map.values()).sort((a, b) => b.score - a.score);

    // Sincronización en segundo plano con la base de datos volátil en memoria RAM
    this._syncWithServerLeaderboard();
  }

  /**
   * Consulta el endpoint /api/leaderboard del servidor en RAM y fusiona los récords.
   * Si el servidor no responde (ej. offline o fuera del entorno dev), mantiene localStorage
   * de forma completamente transparente.
   */
  async _syncWithServerLeaderboard() {
    if (typeof window === 'undefined' || typeof fetch === 'undefined') return;
    try {
      const res = await fetch('/api/leaderboard?game=all&limit=100');
      if (res.ok) {
        const data = await res.json();
        if (data && data.ok && Array.isArray(data.records)) {
          const map = new Map();
          // Añadir datos actuales
          for (const item of this.leaderboard) {
            if (item && item.id) map.set(item.id, item);
          }
          // Fusionar datos del servidor RAM
          for (const srvItem of data.records) {
            if (srvItem && srvItem.id) map.set(srvItem.id, srvItem);
          }
          this.leaderboard = Array.from(map.values()).sort((a, b) => (b.score || 0) - (a.score || 0));
          this._saveLeaderboard();
          this._emit('leaderboardUpdate', this.leaderboard);
        }
      }
    } catch (_) {
      // Fallback transparente a datos en localStorage ya cargados
    }
  }

  /**
   * Envía un récord nuevo a la base de datos volátil en memoria RAM del servidor.
   * Si la petición falla, el juego continúa sin interrupciones con persistencia local.
   */
  async _sendRecordToServer(entry) {
    if (typeof window === 'undefined' || typeof fetch === 'undefined') return;
    try {
      const res = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          playerName: entry.playerName,
          avatar: entry.avatar,
          gameId: entry.gameId,
          score: entry.score,
          scenarioId: entry.scenarioId,
          mode: entry.mode,
          rank: entry.rank,
          bestMs: entry.bestMs ?? entry.stats?.bestMs ?? null,
          stats: entry.stats
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.ok && Array.isArray(data.records)) {
          const map = new Map();
          for (const item of this.leaderboard) {
            if (item && item.id) map.set(item.id, item);
          }
          for (const srvItem of data.records) {
            if (srvItem && srvItem.id) map.set(srvItem.id, srvItem);
          }
          this.leaderboard = Array.from(map.values()).sort((a, b) => (b.score || 0) - (a.score || 0));
          this._saveLeaderboard();
          this._emit('leaderboardUpdate', this.leaderboard);
        }
      }
    } catch (_) {
      // Fallback transparente
    }
  }

  _saveLeaderboard() {
    try {
      localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(this.leaderboard));
    } catch (_) {}
  }

  _mergeLeaderboardEntry(entry) {
    if (!entry || !entry.id) return;
    const exists = this.leaderboard.some((item) => item.id === entry.id);
    if (!exists) {
      this.leaderboard.push(entry);
      this.leaderboard.sort((a, b) => b.score - a.score);
      this._saveLeaderboard();
      this._emit('leaderboardUpdate', this.leaderboard);
    }
  }

  getLeaderboard({ gameId = 'all', scenarioId = 'all', limit = 12 } = {}) {
    let filtered = [...this.leaderboard];
    if (gameId && gameId !== 'all') {
      filtered = filtered.filter((item) => item.gameId === gameId);
    }
    if (scenarioId && scenarioId !== 'all') {
      filtered = filtered.filter((item) => item.scenarioId === scenarioId);
    }
    filtered.sort((a, b) => b.score - a.score);
    return filtered.slice(0, limit);
  }

  /**
   * Alias de conveniencia para registrar puntuación en la tabla de récords y servidor.
   */
  addScore(options = {}) {
    return this.submitScore(options);
  }

  submitScore({
    gameId = 'snake',
    score = 0,
    playerName = null,
    avatar = null,
    scenarioId = 'hidalgo',
    mode = '1p',
    stats = {},
    bestMs = null
  } = {}) {
    const finalScore = Math.max(0, Math.round(Number(score) || 0));
    const name = (playerName || this.profile.name || 'Viajero Estelar').trim();
    const chosenAvatar = avatar || this.profile.avatar || 'bottle';
    const rankInfo = this.getMysticRank(finalScore, gameId);

    const entry = {
      id: this._generateId('rec'),
      gameId,
      playerName: name,
      avatar: chosenAvatar,
      score: finalScore,
      scenarioId,
      mode,
      rank: rankInfo.title,
      rankId: rankInfo.id,
      badge: rankInfo.badge,
      bestMs: bestMs ?? stats?.bestMs ?? null,
      date: new Date().toISOString().slice(0, 10),
      isUser: true,
      stats
    };

    if (finalScore > 0) {
      this.leaderboard.push(entry);
      this.leaderboard.sort((a, b) => b.score - a.score);
      this._saveLeaderboard();
      this._broadcastPacket({
        type: 'NEW_RECORD',
        entry
      });
      this._emit('leaderboardUpdate', this.leaderboard);

      // Sincronización asíncrona con el servidor en memoria RAM
      this._sendRecordToServer(entry);
    }

    // Unlock achievements based on game & score
    this.unlockAchievement('first_spray');
    if (
      mode === '2p' ||
      mode === '2p_local' ||
      mode === 'ai' ||
      mode === 'vs_ai' ||
      mode === 'online'
    ) {
      this.unlockAchievement('simultaneous_duel');
    }
    if (finalScore >= 500 || scenarioId === 'jaguar') {
      this.unlockAchievement('jaguar_awakening');
    }
    if (rankInfo.id === 'dios_estrellas') {
      this.unlockAchievement('star_god');
    }
    if (gameId === 'snake' && (stats.notesCollected >= 5 || finalScore >= 300)) {
      this.unlockAchievement('five_notes');
    }
    if (gameId === 'memory' && (stats.pairsMatched >= 6 || finalScore >= 250)) {
      this.unlockAchievement('velvet_memory');
    }
    if (gameId === 'reflex' && ((stats.bestMs && stats.bestMs <= 220) || finalScore >= 400)) {
      this.unlockAchievement('lightning_reflex');
    }
    if (gameId === 'flappy' && (stats.gatesPassed >= 8 || finalScore >= 240)) {
      this.unlockAchievement('hidalgo_flight');
    }
    if (gameId === 'tournament') {
      this.unlockAchievement('copa_citlalli');
    }

    // Check active challenge
    if (
      this.activeChallenge &&
      this.activeChallenge.active &&
      finalScore > this.activeChallenge.targetScore
    ) {
      this.activeChallenge.completed = true;
      this.unlockAchievement('challenge_conqueror');
      this._emit('challengeUpdate', {
        ...this.activeChallenge,
        currentScore: finalScore,
        beaten: true
      });
    }

    this.broadcastGameState({
      gameId,
      score: finalScore,
      scenarioId,
      status: `Récord: ${finalScore} pts`
    });

    return {
      entry,
      rankInfo
    };
  }

  /* ==========================================================================
   * SISTEMA DE 12 LOGROS ("LA CONSTELACIÓN DE CITLALLI")
   * ========================================================================== */

  _loadAchievements() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      if (raw) {
        this.unlockedAchievements = JSON.parse(raw) || {};
      }
    } catch (_) {
      this.unlockedAchievements = {};
    }
  }

  _saveAchievements() {
    try {
      localStorage.setItem(
        STORAGE_KEYS.ACHIEVEMENTS,
        JSON.stringify(this.unlockedAchievements)
      );
    } catch (_) {}
  }

  unlockAchievement(achievementId) {
    const def = ACHIEVEMENTS_LIST.find((a) => a.id === achievementId);
    if (!def) return null;

    if (this.unlockedAchievements[achievementId]) {
      return null; // Already unlocked
    }

    const record = {
      id: achievementId,
      unlockedAt: new Date().toISOString()
    };
    this.unlockedAchievements[achievementId] = record;
    this._saveAchievements();

    this._emit('achievementUnlocked', {
      ...def,
      unlockedAt: record.unlockedAt,
      totalUnlocked: Object.keys(this.unlockedAchievements).length,
      totalAchievements: ACHIEVEMENTS_LIST.length
    });

    return def;
  }

  getAchievementsStatus() {
    return ACHIEVEMENTS_LIST.map((item) => ({
      ...item,
      unlocked: Boolean(this.unlockedAchievements[item.id]),
      unlockedAt: this.unlockedAchievements[item.id]?.unlockedAt || null
    }));
  }

  /* ==========================================================================
   * MODO TORNEO "COPA CITLALLI 1ZMEADMLSA" (4 JUEGOS ENCADENADOS)
   * ========================================================================== */

  startTournament() {
    this.tournament = {
      active: true,
      currentStageIndex: 0,
      stageScores: {
        snake: 0,
        memory: 0,
        reflex: 0,
        flappy: 0
      },
      totalScore: this.profile.alchemyBonus || 0,
      completed: false
    };
    this._emit('tournamentUpdate', this.getTournamentState());
    return this.getTournamentState();
  }

  recordTournamentStageScore(gameId, score = 0) {
    if (!this.tournament.active) return null;

    const cleanScore = Math.max(0, Math.round(Number(score) || 0));
    if (gameId in this.tournament.stageScores) {
      this.tournament.stageScores[gameId] = Math.max(
        this.tournament.stageScores[gameId],
        cleanScore
      );
    }

    const sumStages = Object.values(this.tournament.stageScores).reduce(
      (acc, v) => acc + v,
      0
    );
    this.tournament.totalScore = sumStages + (this.profile.alchemyBonus || 0);

    const currentStage = TOURNAMENT_GAMES[this.tournament.currentStageIndex];
    if (currentStage && currentStage.id === gameId) {
      if (this.tournament.currentStageIndex < TOURNAMENT_GAMES.length - 1) {
        this.tournament.currentStageIndex += 1;
      } else {
        this.tournament.completed = true;
        this.tournament.active = false;
        this.unlockAchievement('copa_citlalli');
        this.submitScore({
          gameId: 'tournament',
          score: this.tournament.totalScore,
          playerName: this.profile.name,
          avatar: this.profile.avatar,
          scenarioId: 'penthouse',
          mode: 'tournament'
        });
      }
    }

    const state = this.getTournamentState();
    this._emit('tournamentUpdate', state);
    return state;
  }

  cancelTournament() {
    this.tournament.active = false;
    const state = this.getTournamentState();
    this._emit('tournamentUpdate', state);
    return state;
  }

  getTournamentState() {
    const currentStage =
      TOURNAMENT_GAMES[this.tournament.currentStageIndex] || TOURNAMENT_GAMES[0];
    return {
      ...this.tournament,
      currentStage,
      stages: TOURNAMENT_GAMES.map((stage, idx) => ({
        ...stage,
        score: this.tournament.stageScores[stage.id] || 0,
        isCurrent: this.tournament.active && idx === this.tournament.currentStageIndex,
        isDone:
          this.tournament.completed || idx < this.tournament.currentStageIndex
      }))
    };
  }

  /* ==========================================================================
   * ENLACES DE DESAFÍO DIRECTO (?challenge=snake&score=450&rival=Fernando&scenario=jaguar)
   * ========================================================================== */

  generateChallengeUrl({
    gameId = 'snake',
    score = 450,
    playerName = null,
    scenarioId = 'jaguar'
  } = {}) {
    const rival = (playerName || this.profile.name || 'David').trim();
    const baseUrl =
      typeof window !== 'undefined'
        ? `${window.location.origin}${window.location.pathname}`
        : 'https://citlalli-perfume.local/';
    const params = new URLSearchParams({
      challenge: gameId,
      score: String(Math.max(50, Math.round(score))),
      rival,
      player: rival,
      scenario: scenarioId
    });
    this.unlockAchievement('challenge_conqueror');
    return `${baseUrl}?${params.toString()}#arcade-salon`;
  }

  parseChallengeFromUrl() {
    if (typeof window === 'undefined') return null;
    try {
      const params = new URLSearchParams(window.location.search);
      const challengeGame = params.get('challenge');
      if (!challengeGame) return null;

      const targetScore = Math.max(10, parseInt(params.get('score') || '450', 10) || 450);
      const rivalName =
        params.get('rival') || params.get('player') || 'El Hombre Citlalli';
      const scenarioId = params.get('scenario') || 'jaguar';

      this.activeChallenge = {
        active: true,
        gameId: challengeGame,
        targetScore,
        rivalName,
        scenarioId,
        currentScore: 0,
        completed: false
      };

      this._emit('challengeUpdate', this.activeChallenge);
      return this.activeChallenge;
    } catch (_) {
      return null;
    }
  }

  /* ==========================================================================
   * GENERADOR DE TARJETA DE TROFEO OFICIAL CITLALLI EN PNG (1080x600)
   * ========================================================================== */

  async generateTrophyCardPNG({
    playerName = null,
    gameName = 'La Víborita: Estela de los Dioses',
    gameId = 'snake',
    score = 750,
    rank = null,
    scenarioName = 'Noche Estrellada en Hidalgo',
    stats = {},
    verificationCode = null
  } = {}) {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');

    const name = (playerName || this.profile.name || 'Viajero Estelar').toUpperCase();
    const rankObj = this.getMysticRank(score, gameId);
    const rankTitle = rank || rankObj.title;
    const dateStr = new Date().toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    });
    const verif =
      verificationCode ||
      `CIT-${String(score).padStart(4, '0')}-${Math.random()
        .toString(36)
        .substring(2, 6)
        .toUpperCase()}-1ZME`;

    // 1. Fondo Azul Marino Terciopelo (#0A1124) con nebulosa dorada y oro rosa
    const bgGrad = ctx.createLinearGradient(0, 0, 1080, 600);
    bgGrad.addColorStop(0, '#060B18');
    bgGrad.addColorStop(0.5, '#0A1124');
    bgGrad.addColorStop(1, '#101B37');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1080, 600);

    // Resplandor radial dorado a la izquierda (emblema) y oro rosa a la derecha
    const glowLeft = ctx.createRadialGradient(230, 300, 20, 230, 300, 290);
    glowLeft.addColorStop(0, 'rgba(212, 175, 55, 0.25)');
    glowLeft.addColorStop(0.6, 'rgba(224, 169, 139, 0.08)');
    glowLeft.addColorStop(1, 'rgba(10, 17, 36, 0)');
    ctx.fillStyle = glowLeft;
    ctx.fillRect(0, 0, 1080, 600);

    const glowRight = ctx.createRadialGradient(820, 260, 20, 820, 260, 340);
    glowRight.addColorStop(0, 'rgba(224, 169, 139, 0.18)');
    glowRight.addColorStop(1, 'rgba(10, 17, 36, 0)');
    ctx.fillStyle = glowRight;
    ctx.fillRect(0, 0, 1080, 600);

    // 2. Constelación estelar de fondo
    ctx.save();
    for (let i = 0; i < 65; i++) {
      const sx = (i * 173 + 41) % 1040 + 20;
      const sy = (i * 97 + 29) % 560 + 20;
      const r = (i % 3) * 0.8 + 0.8;
      ctx.fillStyle = i % 4 === 0 ? '#FFE57F' : i % 2 === 0 ? '#E0A98B' : '#FFFFFF';
      ctx.globalAlpha = 0.2 + (i % 5) * 0.12;
      ctx.beginPath();
      ctx.arc(sx, sy, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // 3. Marco doble de lujo en Oro Metálico (#D4AF37) y Oro Rosa (#E0A98B)
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 4;
    ctx.strokeRect(24, 24, 1032, 552);

    ctx.strokeStyle = '#E0A98B';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(36, 36, 1008, 528);

    // Ornamentos geométricos en las 4 esquinas
    const corners = [
      [24, 24, 1, 1],
      [1056, 24, -1, 1],
      [24, 576, 1, -1],
      [1056, 576, -1, -1]
    ];
    for (const [cx, cy, dx, dy] of corners) {
      ctx.save();
      ctx.strokeStyle = '#FFE57F';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx + dx * 8, cy + dy * 28);
      ctx.lineTo(cx + dx * 28, cy + dy * 28);
      ctx.lineTo(cx + dx * 28, cy + dy * 8);
      ctx.stroke();
      ctx.restore();
    }

    // 4. Emblema Cósmico de Estrella de 8 Puntas y Frasco Facetado (Izquierda)
    this._drawEightPointStar(ctx, 215, 295, 118, 48, '#D4AF37', '#E0A98B');
    this._drawPerfumeBottleEmblem(ctx, 215, 295);

    // 5. Textos de Certificación Oficial (Derecha)
    ctx.textAlign = 'left';

    // Kicker superior
    ctx.fillStyle = '#E0A98B';
    ctx.font = '600 15px "Plus Jakarta Sans", "Segoe UI", sans-serif';
    ctx.fillText('CITLALLI EAU DE PARFUM  •  SALÓN ARCADE OFICIAL 1ZMEADMLSA', 400, 92);

    // Título principal
    ctx.fillStyle = '#D4AF37';
    ctx.font = 'bold 34px "Cinzel", Georgia, serif';
    ctx.fillText('CERTIFICADO DE RÉCORD ESTELAR', 400, 138);

    // Línea divisoria dorada
    const lineGrad = ctx.createLinearGradient(400, 155, 1000, 155);
    lineGrad.addColorStop(0, '#D4AF37');
    lineGrad.addColorStop(0.7, '#E0A98B');
    lineGrad.addColorStop(1, 'rgba(224,169,139,0)');
    ctx.fillStyle = lineGrad;
    ctx.fillRect(400, 155, 600, 2);

    // Jugador
    ctx.fillStyle = '#A9B6D3';
    ctx.font = '500 15px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('PORTADOR DE LA ESENCIA', 400, 196);

    ctx.fillStyle = '#F6EFE6';
    ctx.font = 'bold 38px "Cinzel", Georgia, serif';
    ctx.fillText(name.slice(0, 22), 400, 240);

    // Caja de Puntaje y Rango Místico
    ctx.fillStyle = 'rgba(212, 175, 55, 0.10)';
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.55)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(400, 265, 595, 145, 12);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#E0A98B';
    ctx.font = '600 14px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('PUNTAJE OFICIAL', 428, 300);

    ctx.fillStyle = '#FFE57F';
    ctx.font = 'bold 62px "Cinzel", Georgia, serif';
    ctx.fillText(`${score} PTS`, 428, 368);

    // Rango Místico y Escenario
    ctx.fillStyle = '#E0A98B';
    ctx.font = '600 14px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('RANGO MÍSTICO ALCANZADO', 705, 300);

    ctx.fillStyle = '#F6EFE6';
    ctx.font = 'bold 20px "Cinzel", Georgia, serif';
    ctx.fillText(rankTitle.slice(0, 28), 705, 334);

    ctx.fillStyle = '#D4AF37';
    ctx.font = '500 15px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`🎮 ${gameName.slice(0, 34)}`, 705, 365);

    ctx.fillStyle = '#A9B6D3';
    ctx.font = '400 14px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`🌌 Escenario: ${scenarioName}`, 705, 390);

    // Frase insignia
    ctx.fillStyle = '#F6EFE6';
    ctx.font = 'italic 24px "Cormorant Garamond", Georgia, serif';
    ctx.fillText('“El límite son las estrellas — El aroma de los dioses”', 400, 462);

    // Pie de certificado
    ctx.fillStyle = '#9BA8C7';
    ctx.font = '500 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`FECHA: ${dateStr}   |   CÓDIGO DE VERIFICACIÓN: ${verif}`, 400, 515);

    ctx.fillStyle = '#D4AF37';
    ctx.font = '600 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('HECHO EN MÉXICO  •  50 ML / 1.7 FL. OZ.  •  CITLALLI PARFUMS', 400, 540);

    this.unlockAchievement('challenge_conqueror');

    const dataUrl = canvas.toDataURL('image/png');
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));

    return {
      canvas,
      dataUrl,
      blob,
      verificationCode: verif
    };
  }

  _drawEightPointStar(ctx, cx, cy, outerR, innerR, strokeColor, secondColor) {
    ctx.save();
    ctx.translate(cx, cy);

    // Outer circle halo
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.35)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, outerR + 18, 0, Math.PI * 2);
    ctx.stroke();

    // 8-pointed star
    ctx.beginPath();
    const points = 8;
    for (let i = 0; i < points * 2; i++) {
      const r = i % 2 === 0 ? outerR : innerR;
      const angle = (i * Math.PI) / points - Math.PI / 2;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();

    const grad = ctx.createRadialGradient(0, 0, 10, 0, 0, outerR);
    grad.addColorStop(0, 'rgba(224, 169, 139, 0.35)');
    grad.addColorStop(0.6, 'rgba(212, 175, 55, 0.16)');
    grad.addColorStop(1, 'rgba(10, 17, 36, 0.85)');
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.strokeStyle = secondColor;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(0, 0, innerR + 12, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }

  _drawPerfumeBottleEmblem(ctx, cx, cy) {
    ctx.save();
    ctx.translate(cx, cy);

    // Faceted bottle body
    ctx.fillStyle = 'rgba(235, 172, 128, 0.88)';
    ctx.strokeStyle = '#FFE57F';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-26, -12);
    ctx.lineTo(26, -12);
    ctx.lineTo(34, 8);
    ctx.lineTo(24, 42);
    ctx.lineTo(-24, 42);
    ctx.lineTo(-34, 8);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Rose gold geometric cap
    ctx.fillStyle = '#E0A98B';
    ctx.strokeStyle = '#FFF3B0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(-16, -40, 32, 22, 4);
    ctx.fill();
    ctx.stroke();

    // Neck collar + QM charm
    ctx.fillStyle = '#D4AF37';
    ctx.fillRect(-10, -18, 20, 6);

    ctx.beginPath();
    ctx.arc(24, -8, 10, 0, Math.PI * 2);
    ctx.fillStyle = '#E0A98B';
    ctx.fill();
    ctx.strokeStyle = '#FFF3B0';
    ctx.stroke();

    ctx.fillStyle = '#0A1124';
    ctx.font = 'bold 9px "Cinzel", serif';
    ctx.textAlign = 'center';
    ctx.fillText('QM', 24, -5);

    ctx.fillStyle = '#0A1124';
    ctx.font = 'bold 11px "Cinzel", serif';
    ctx.fillText('CITLALLI', 0, 18);

    ctx.restore();
  }

  async downloadTrophyPNG(options = {}) {
    const result = await this.generateTrophyCardPNG(options);
    const link = document.createElement('a');
    const cleanName = (options.playerName || this.profile.name || 'citlalli')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-');
    link.download = `trofeo-citlalli-${cleanName}-${options.score || 0}.png`;
    link.href = result.dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return result;
  }

  async shareTrophy(options = {}) {
    const result = await this.generateTrophyCardPNG(options);
    const challengeUrl = this.generateChallengeUrl({
      gameId: options.gameId || 'snake',
      score: options.score || 500,
      playerName: options.playerName || this.profile.name,
      scenarioId: options.scenarioId || 'jaguar'
    });

    const shareText = `✨ ¡Logré ${options.score || 0} PTS en CITLALLI Arcade (${
      options.gameName || 'El Aroma de los Dioses'
    }) con rango "${
      options.rank || this.getMysticRank(options.score || 0).title
    }"! ¿Puedes superar mi récord estelar?`;

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        const shareData = {
          title: 'Trofeo Oficial CITLALLI — El Aroma de los Dioses',
          text: shareText,
          url: challengeUrl
        };
        if (result.blob && navigator.canShare) {
          const file = new File([result.blob], 'trofeo-citlalli.png', {
            type: 'image/png'
          });
          if (navigator.canShare({ files: [file] })) {
            shareData.files = [file];
          }
        }
        await navigator.share(shareData);
        return { shared: true, challengeUrl, result };
      } catch (_) {
        // Fallback to copy URL
      }
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(`${shareText} ${challengeUrl}`);
      } catch (_) {}
    }

    return { shared: false, copied: true, challengeUrl, shareText, result };
  }

  /* ==========================================================================
   * SUSCRIPCIÓN A EVENTOS
   * ========================================================================== */

  on(event, callback) {
    if (this.listeners[event] && typeof callback === 'function') {
      this.listeners[event].add(callback);
      return () => this.listeners[event].delete(callback);
    }
    return () => {};
  }

  _emit(event, payload) {
    if (!this.listeners[event]) return;
    for (const cb of this.listeners[event]) {
      try {
        cb(payload);
      } catch (err) {
        console.error(`[CitlalliMultiplayer] Error in ${event} listener:`, err);
      }
    }
  }
}

export const citlalliMultiplayer = new CitlalliMultiplayer();

if (typeof window !== 'undefined') {
  window.CitlalliMultiplayer = citlalliMultiplayer;
}

/**
 * Consulta el catálogo de 12 avatares Pixel Art oficiales desde el endpoint /api/avatars
 * de la base de datos en memoria RAM, con fallback transparente a AVATARS_LIST local.
 * @returns {Promise<Array<object>>}
 */
export async function fetchServerAvatars() {
  if (typeof window !== 'undefined' && typeof fetch !== 'undefined') {
    try {
      const res = await fetch('/api/avatars');
      if (res.ok) {
        const data = await res.json();
        if (data && data.ok && Array.isArray(data.avatars)) {
          return data.avatars;
        }
      }
    } catch (_) {
      // Fallback transparente
    }
  }
  return [...AVATARS_LIST];
}

/**
 * Consulta la tabla de récords desde el endpoint /api/leaderboard en memoria RAM,
 * con fallback transparente a la tabla del motor local / localStorage.
 * @param {string} [gameId='all'] Identificador de juego ('snake', 'memory', 'reflex', 'flappy', 'tournament', 'all')
 * @param {number} [limit=20] Número máximo de récords a obtener
 * @returns {Promise<Array<object>>}
 */
export async function fetchServerLeaderboard(gameId = 'all', limit = 20) {
  if (typeof window !== 'undefined' && typeof fetch !== 'undefined') {
    try {
      const params = new URLSearchParams({ game: gameId, limit: String(limit) });
      const res = await fetch(`/api/leaderboard?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.ok && Array.isArray(data.records)) {
          return data.records;
        }
      }
    } catch (_) {
      // Fallback transparente
    }
  }
  return citlalliMultiplayer.getLeaderboard({ gameId, limit });
}

