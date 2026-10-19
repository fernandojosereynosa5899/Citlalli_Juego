/**
 * CITLALLI — Controlador Maestro del Salón Arcade, Audio Chiptune,
 * Multijugador Simultáneo, Tabla de Récords, Trofeos PNG y Torneo Copa Citlalli.
 */

import citlalliAudio, { CITLALLI_TRACKS } from '../engine/audio-engine.js';
import { SCENARIOS, LORE_ITEMS, citlalliVFX } from '../engine/scenarios-vfx.js';
import {
  citlalliMultiplayer,
  AVATARS_LIST,
  TOURNAMENT_GAMES
} from '../engine/multiplayer-leaderboard.js';

import SnakeGame from '../games/snake/snake-game.js';
import MemoryGame from '../games/memory/memory-game.js';
import ReflexGame from '../games/reflex/reflex-game.js';
import FlappyGame from '../games/flappy/flappy-game.js';

const GAME_CATALOG = {
  snake: {
    id: 'snake',
    title: '🐍 La Víborita: Estela de los Dioses',
    shortName: 'Víborita',
    ClassRef: SnakeGame,
    controlsText:
      '<span><strong>J1:</strong> WASD / Flechas / Clic</span><span><strong>J2 Local:</strong> Flechas</span><span><strong>Pausa:</strong> P</span>'
  },
  memory: {
    id: 'memory',
    title: '🃏 Memorama: Memoria Olfativa & Astral',
    shortName: 'Memorama',
    ClassRef: MemoryGame,
    controlsText:
      '<span><strong>Cartas:</strong> Clic / Tocar o WASD + Enter</span><span><strong>Poder:</strong> Botón Brisa de Hidalgo</span>'
  },
  reflex: {
    id: 'reflex',
    title: '⚡ Reflejos: Destilación Relámpago & Duelo ms',
    shortName: 'Reflejos',
    ClassRef: ReflexGame,
    controlsText:
      '<span><strong>Orbes:</strong> Clic o Teclas 1-9 / QWEASD</span><span><strong>Duelo ms:</strong> J1 (Tecla A) vs J2 (Tecla L)</span>'
  },
  flappy: {
    id: 'flappy',
    title: '🦅 Flappy Citlalli: El Límite son las Estrellas',
    shortName: 'Flappy Citlalli',
    ClassRef: FlappyGame,
    controlsText:
      '<span><strong>J1 Aleteo:</strong> Espacio / W / Clic</span><span><strong>J2 Local:</strong> Flecha Arriba / Enter</span>'
  }
};

const SCENARIO_LABELS = {
  hidalgo: '🌌 Noche Estrellada en Hidalgo',
  jaguar: '🐆 Santuario del Jaguar Dorado',
  velvet: '💎 Cámara Alquímica de Terciopelo',
  penthouse: '🏙️ Penthouse Nocturno Citlalli'
};

const MODE_LABELS = {
  '1p': '👤 1 Jugador',
  '2p_local': '👥 2J Simultáneos',
  vs_ai: '🤖 vs IA Jaguar',
  online: '🌐 Sala en Vivo'
};

class CitlalliArcadeController {
  constructor() {
    this.canvas = document.getElementById('citlalli-arcade-canvas');
    this.activeGameId = 'snake';
    this.activeScenarioId = 'hidalgo';
    this.activeMode = '1p';
    this.activeDifficulty = 'normal';
    this.currentGameInstance = null;

    this.lastScoreState = {
      gameId: 'snake',
      gameName: GAME_CATALOG.snake.title,
      score: 750,
      p2Score: 0,
      combo: 1,
      scenarioId: 'hidalgo',
      scenarioName: 'Noche Estrellada en Hidalgo',
      rank: 'Caballero del Jaguar Dorado'
    };

    this.leaderboardFilterGame = 'all';
    this.leaderboardFilterScenario = 'all';
    this.lastBroadcastTime = 0;

    if (this.canvas) {
      this.init();
    }
  }

  init() {
    // Exponer motores globalmente
    window.CitlalliAudio = citlalliAudio;
    window.CitlalliVFX = citlalliVFX;
    window.CitlalliMultiplayer = citlalliMultiplayer;
    window.CitlalliGames = {
      snake: SnakeGame,
      memory: MemoryGame,
      reflex: ReflexGame,
      flappy: FlappyGame
    };

    this._bindGameTabs();
    this._bindScenarioButtons();
    this._bindCabinetControls();
    this._bindTouchDPad();
    this._bindAudioConsole();
    this._bindMultiplayerPanel();
    this._bindLoreCodex();
    this._bindLeaderboardAndTrophies();
    this._bindTournamentControls();
    this._bindChallengeBanner();

    // Sincronizar estado inicial de multijugador, tabla de récords y logros
    this._renderRoomPlayers({
      roomCode: citlalliMultiplayer.profile.roomCode,
      players: citlalliMultiplayer.getRoomPlayers()
    });
    this._renderLeaderboard();
    this._renderAchievements();
    this._refreshTrophyPreview();

    // Si la URL trae un desafío activo (?challenge=snake&score=450&rival=Fernando&scenario=jaguar)
    if (citlalliMultiplayer.activeChallenge?.active) {
      const ch = citlalliMultiplayer.activeChallenge;
      if (GAME_CATALOG[ch.gameId]) {
        this.activeGameId = ch.gameId;
      }
      if (SCENARIO_LABELS[ch.scenarioId]) {
        this.activeScenarioId = ch.scenarioId;
      }
      this._updateChallengeBannerUI(ch);
    }

    // Montar el juego inicial en el canvas
    this.mountGame(this.activeGameId, { autoStart: false });
    this._startEqualizerLoop();
  }

  /* ==========================================================================
   * MONTAJE Y CICLO DE VIDA DE LOS 4 JUEGOS MODULARES
   * ========================================================================== */

  mountGame(gameId, { autoStart = false } = {}) {
    if (!GAME_CATALOG[gameId] || !this.canvas) return;

    // 1. Destruir instancia previa limpiamente
    if (this.currentGameInstance) {
      try {
        if (typeof this.currentGameInstance.destroy === 'function') {
          this.currentGameInstance.destroy();
        } else {
          this.currentGameInstance.isRunning = false;
          this.currentGameInstance.running = false;
          if (this.currentGameInstance.rafId) {
            cancelAnimationFrame(this.currentGameInstance.rafId);
          }
          if (typeof this.currentGameInstance._detachListeners === 'function') {
            this.currentGameInstance._detachListeners();
          }
        }
      } catch (err) {
        console.warn('[ArcadeController] Error cleaning previous game:', err);
      }
      this.currentGameInstance = null;
    }

    this.activeGameId = gameId;
    const gameMeta = GAME_CATALOG[gameId];

    // 2. Actualizar UI de pestañas, marquesina y leyenda de controles
    document.querySelectorAll('.game-tab-card').forEach((btn) => {
      const sel = btn.getAttribute('data-game-select');
      const isTourneyBtn = sel === 'tournament';
      const active = isTourneyBtn
        ? citlalliMultiplayer.tournament.active
        : sel === gameId && !citlalliMultiplayer.tournament.active;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
    });

    const titleEl = document.getElementById('cabinet-active-game-title');
    if (titleEl) titleEl.textContent = gameMeta.title;

    const legendEl = document.getElementById('arcade-controls-legend');
    if (legendEl) legendEl.innerHTML = gameMeta.controlsText;

    const reflexSubBtn = document.getElementById('btn-reflex-submode');
    if (reflexSubBtn) {
      reflexSubBtn.classList.toggle('hidden', gameId !== 'reflex');
    }

    // 3. Reajustar resolución limpia del canvas
    this.canvas.width = 800;
    this.canvas.height = 534;

    // 4. Callbacks unificados para cualquiera de los 4 juegos
    const callbacks = {
      onScoreUpdate: (state) => this._handleGameScoreUpdate(gameId, state),
      onScore: (state) => this._handleGameScoreUpdate(gameId, state),
      onUpdate: (state) => this._handleGameScoreUpdate(gameId, state),
      onLoreUnlock: (loreItem) => this._handleLoreUnlock(loreItem),
      onBroadcastState: (pkt) => this._handleGameBroadcast(gameId, pkt),
      onRemoteBroadcast: (pkt) => this._handleGameBroadcast(gameId, pkt),
      onGameOver: (finalState) => this._handleGameOver(gameId, finalState)
    };

    const options = {
      scenarioId: this.activeScenarioId,
      scenario: this.activeScenarioId,
      mode: this.activeMode,
      difficulty: this.activeDifficulty,
      vfx: citlalliVFX,
      audio: citlalliAudio
    };

    // 5. Instanciar el juego seleccionado
    const GameClass = gameMeta.ClassRef;
    this.currentGameInstance = new GameClass(this.canvas, callbacks, options);

    // Actualizar HUD a estado inicial
    this._updateHudUI({
      score: 0,
      p2Score: 0,
      combo: 1,
      gameId
    });

    citlalliMultiplayer.broadcastGameState({
      gameId,
      score: 0,
      scenarioId: this.activeScenarioId,
      status: autoStart ? 'Jugando' : 'En Cabina'
    });

    if (autoStart && this.currentGameInstance) {
      this.currentGameInstance.start();
    }
  }

  _handleGameScoreUpdate(gameId, state = {}) {
    const score = Number(state.score ?? state.scoreP1 ?? state.p1Score ?? 0);
    const p2Score = Number(state.p2Score ?? state.scoreP2 ?? 0);
    const combo = Number(state.combo ?? state.streak ?? 1) || 1;

    this._updateHudUI({ score, p2Score, combo, gameId });

    // Si en Reflejos logra <220ms, desbloquear logro
    if (gameId === 'reflex' && state.bestMs && state.bestMs > 0 && state.bestMs <= 220) {
      citlalliMultiplayer.unlockAchievement('lightning_reflex');
    }

    // Si en Flappy supera 8 columnas, desbloquear logro
    if (gameId === 'flappy' && (state.columnsPassed >= 8 || score >= 200)) {
      citlalliMultiplayer.unlockAchievement('hidalgo_flight');
    }

    // Si en Memorama empareja cartas, actualizar lore si viene incluido
    if (state.stats?.lastNote) {
      this._inspectLoreByKeyword(state.stats.lastNote);
    }

    // Throttled broadcast a la sala multijugador
    const now = performance.now();
    if (now - this.lastBroadcastTime > 380) {
      this.lastBroadcastTime = now;
      citlalliMultiplayer.broadcastGameState({
        gameId,
        score,
        p2Score,
        combo,
        scenarioId: this.activeScenarioId,
        status: 'Jugando'
      });
    }
  }

  _handleGameOver(gameId, finalState = {}) {
    const score = Number(
      finalState.score ??
        finalState.scoreP1 ??
        finalState.p1Score ??
        this.currentGameInstance?.score ??
        this.currentGameInstance?.p1?.score ??
        0
    );

    const stats = finalState.stats || {
      bestMs: finalState.bestMs || this.currentGameInstance?.p1?.bestMs || null,
      gatesPassed:
        finalState.columnsPassed || this.currentGameInstance?.p1?.columnsPassed || 0,
      pairsMatched:
        finalState.p1Pairs || this.currentGameInstance?.stats?.pairsFound || 0,
      notesCollected:
        finalState.stats?.ingredientsCollected ||
        this.currentGameInstance?.stats?.ingredientsCollected ||
        0
    };

    const { rankInfo } = citlalliMultiplayer.submitScore({
      gameId,
      score,
      scenarioId: this.activeScenarioId,
      mode: this.activeMode,
      stats
    });

    const gameTitle = GAME_CATALOG[gameId]?.title || 'CITLALLI Arcade';
    const scenarioName =
      SCENARIOS.find((s) => s.id === this.activeScenarioId)?.name ||
      'Noche Estrellada en Hidalgo';

    this.lastScoreState = {
      gameId,
      gameName: gameTitle,
      score: Math.max(score, 100),
      scenarioId: this.activeScenarioId,
      scenarioName,
      rank: rankInfo.title
    };

    this._refreshTrophyPreview();

    if (typeof window.showCitlalliToast === 'function') {
      window.showCitlalliToast({
        title: `PARTIDA FINALIZADA • ${score} PTS`,
        message: `Rango alcanzado: ${rankInfo.badge} ${rankInfo.title}. ¡Tu Tarjeta de Trofeo PNG está lista!`,
        icon: '🏅',
        type: 'gold',
        duration: 4800
      });
    }

    // Si estamos en el Modo Torneo Copa Citlalli, registrar puntaje de etapa
    if (citlalliMultiplayer.tournament.active) {
      const tState = citlalliMultiplayer.recordTournamentStageScore(gameId, score);
      this._updateTournamentUI(tState);
      if (tState && tState.completed) {
        this.lastScoreState = {
          gameId: 'tournament',
          gameName: '🏆 Copa Citlalli 1ZMEADMLSA (4 Juegos)',
          score: tState.totalScore,
          scenarioId: 'penthouse',
          scenarioName: 'Campeonato Oficial Citlalli',
          rank: citlalliMultiplayer.getMysticRank(tState.totalScore, 'tournament').title
        };
        this._refreshTrophyPreview();
        if (typeof window.showCitlalliToast === 'function') {
          window.showCitlalliToast({
            title: '🏆 ¡CAMPEÓN DE LA COPA CITLALLI 1ZMEADMLSA!',
            message: `Puntaje Acumulado Final: ${tState.totalScore} PTS. ¡Descarga tu Certificado Imperial abajo!`,
            icon: '👑',
            type: 'gold',
            duration: 6500
          });
        }
      }
    }
  }

  _handleGameBroadcast(gameId, pkt) {
    // Reenviar estado a la sala si estamos en modo online
    if (pkt && typeof pkt === 'object') {
      const score = Number(pkt.score ?? pkt.payload?.score ?? 0);
      if (score > 0) {
        citlalliMultiplayer.broadcastGameState({
          gameId,
          score,
          scenarioId: this.activeScenarioId,
          status: 'Jugando'
        });
      }
    }
  }

  _updateHudUI({ score = 0, p2Score = 0, combo = 1, gameId = this.activeGameId }) {
    const p1El = document.getElementById('hud-p1-score');
    const p2El = document.getElementById('hud-p2-score');
    const comboEl = document.getElementById('hud-combo-val');
    const rankEl = document.getElementById('hud-mystic-rank');

    if (p1El) p1El.textContent = `${Math.round(score)} PTS`;
    if (p2El) p2El.textContent = `${Math.round(p2Score)} PTS`;
    if (comboEl) comboEl.textContent = `x${Math.max(1, combo)}`;

    const rankObj = citlalliMultiplayer.getMysticRank(score, gameId);
    if (rankEl) {
      rankEl.textContent = `${rankObj.badge} ${rankObj.title}`;
    }
  }

  /* ==========================================================================
   * CONTROLES DEL GABINETE, ESCENARIOS Y D-PAD TÁCTIL
   * ========================================================================== */

  _bindGameTabs() {
    document.querySelectorAll('.game-tab-card').forEach((btn) => {
      btn.addEventListener('click', () => {
        const selected = btn.getAttribute('data-game-select');
        if (selected === 'tournament') {
          this.startCopaCitlalli();
          return;
        }
        if (citlalliMultiplayer.tournament.active) {
          citlalliMultiplayer.cancelTournament();
          this._updateTournamentUI(citlalliMultiplayer.getTournamentState());
        }
        this.mountGame(selected, { autoStart: false });
      });
    });
  }

  setScenario(scenarioId) {
    if (!SCENARIO_LABELS[scenarioId]) return;
    this.activeScenarioId = scenarioId;

    document.querySelectorAll('.scenario-card-btn').forEach((btn) => {
      btn.classList.toggle(
        'active',
        btn.getAttribute('data-scenario-btn') === scenarioId
      );
    });

    const pill = document.getElementById('cabinet-active-scenario-pill');
    if (pill) pill.textContent = SCENARIO_LABELS[scenarioId];

    if (citlalliVFX && typeof citlalliVFX.setScenario === 'function') {
      citlalliVFX.setScenario(scenarioId);
    }

    if (this.currentGameInstance && typeof this.currentGameInstance.setScenario === 'function') {
      this.currentGameInstance.setScenario(scenarioId);
    }

    // Cambiar pista musical Chiptune automáticamente si está sonando
    if (citlalliAudio) {
      citlalliAudio.currentTrackId = scenarioId;
      if (citlalliAudio.isPlaying) {
        citlalliAudio.playMusic(scenarioId);
      }
      this._updateAudioTrackUI(scenarioId);
    }
  }

  _bindScenarioButtons() {
    document.querySelectorAll('.scenario-card-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const sc = btn.getAttribute('data-scenario-btn');
        this.setScenario(sc);
      });
    });

    // Escuchar eventos desde Storytelling o Campaña ("Jugar en Hidalgo", "Escenario Jaguar", etc.)
    window.addEventListener('citlalli:select-scenario', (e) => {
      if (e.detail && e.detail.scenarioId) {
        this.setScenario(e.detail.scenarioId);
      }
    });
  }

  _bindCabinetControls() {
    const modeSelect = document.getElementById('arcade-mode-select');
    const diffSelect = document.getElementById('arcade-difficulty-select');
    const startBtn = document.getElementById('btn-arcade-start');
    const pauseBtn = document.getElementById('btn-arcade-pause');
    const reflexSubBtn = document.getElementById('btn-reflex-submode');

    if (modeSelect) {
      modeSelect.addEventListener('change', () => {
        this.activeMode = modeSelect.value;
        const modePill = document.getElementById('cabinet-active-mode-pill');
        if (modePill) modePill.textContent = MODE_LABELS[this.activeMode] || '👤 1 Jugador';

        if (this.activeMode !== '1p') {
          citlalliMultiplayer.unlockAchievement('simultaneous_duel');
        }

        if (this.currentGameInstance && typeof this.currentGameInstance.setMode === 'function') {
          this.currentGameInstance.setMode(this.activeMode);
        }
      });
    }

    if (diffSelect) {
      diffSelect.addEventListener('change', () => {
        this.activeDifficulty = diffSelect.value;
        if (
          this.currentGameInstance &&
          typeof this.currentGameInstance.setDifficulty === 'function'
        ) {
          this.currentGameInstance.setDifficulty(this.activeDifficulty);
        }
      });
    }

    if (startBtn) {
      startBtn.addEventListener('click', () => {
        if (this.currentGameInstance && typeof this.currentGameInstance.start === 'function') {
          this.currentGameInstance.start();
          citlalliMultiplayer.unlockAchievement('first_spray');
        }
      });
    }

    if (pauseBtn) {
      pauseBtn.addEventListener('click', () => {
        if (
          this.currentGameInstance &&
          typeof this.currentGameInstance.togglePause === 'function'
        ) {
          const paused = this.currentGameInstance.togglePause();
          pauseBtn.textContent = paused ? '▶ Reanudar' : '⏸ Pausa';
        }
      });
    }

    if (reflexSubBtn) {
      reflexSubBtn.addEventListener('click', () => {
        if (
          this.activeGameId === 'reflex' &&
          this.currentGameInstance &&
          typeof this.currentGameInstance.toggleSubMode === 'function'
        ) {
          this.currentGameInstance.toggleSubMode();
        }
      });
    }
  }

  _bindTouchDPad() {
    document.querySelectorAll('[data-dpad]').forEach((btn) => {
      btn.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        const dir = btn.getAttribute('data-dpad');
        if (!this.currentGameInstance) return;

        if (typeof this.currentGameInstance.handleTouchDirection === 'function') {
          this.currentGameInstance.handleTouchDirection(dir);
        }
      });
    });

    const sprayDpadBtn = document.getElementById('btn-dpad-spray');
    if (sprayDpadBtn) {
      sprayDpadBtn.addEventListener('click', () => {
        if (
          this.activeGameId === 'memory' &&
          this.currentGameInstance &&
          typeof this.currentGameInstance.activateBreezeOfHidalgo === 'function'
        ) {
          this.currentGameInstance.activateBreezeOfHidalgo();
        } else if (typeof window.triggerCitlalliAtomizer === 'function') {
          const rect = this.canvas.getBoundingClientRect();
          window.triggerCitlalliAtomizer(
            rect.left + rect.width / 2,
            rect.top + rect.height / 2,
            false
          );
        }
      });
    }
  }

  /* ==========================================================================
   * CONSOLA DE AUDIO CHIPTUNE & ECUALIZADOR DE 16 BANDAS
   * ========================================================================== */

  _bindAudioConsole() {
    const toggleBtn = document.getElementById('btn-audio-toggle');
    const muteBtn = document.getElementById('btn-audio-mute');
    const sfxBtn = document.getElementById('btn-audio-sfx-test');
    const crtBtn = document.getElementById('btn-crt-toggle');
    const viewport = document.getElementById('arcade-screen-viewport');

    if (toggleBtn) {
      toggleBtn.classList.toggle('active', Boolean(citlalliAudio.isPlaying));
      toggleBtn.addEventListener('click', () => {
        if (!citlalliAudio.isPlaying) {
          citlalliAudio.playMusic(this.activeScenarioId);
          toggleBtn.textContent = '⏹ Detener 8-Bit';
          toggleBtn.classList.add('active');
        } else {
          citlalliAudio.stopMusic();
          toggleBtn.textContent = '▶ Música 8-Bit';
          toggleBtn.classList.remove('active');
        }
        this._updateAudioTrackUI(this.activeScenarioId);
      });
    }

    if (muteBtn) {
      muteBtn.addEventListener('click', () => {
        const muted = citlalliAudio.toggleMute();
        muteBtn.textContent = muted ? '🔇 Silenciado' : '🔊 Sonido Activo';
        muteBtn.classList.toggle('active', !muted);
      });
    }

    if (sfxBtn) {
      sfxBtn.addEventListener('click', () => {
        citlalliAudio.playSFX('spray');
        if (typeof window.triggerCitlalliAtomizer === 'function') {
          const rect = sfxBtn.getBoundingClientRect();
          window.triggerCitlalliAtomizer(rect.left, rect.top, false);
        }
      });
    }

    if (crtBtn && viewport) {
      crtBtn.addEventListener('click', () => {
        viewport.classList.toggle('crt-enabled');
        const active = viewport.classList.contains('crt-enabled');
        crtBtn.classList.toggle('active', active);
      });
    }

    // Botón Pantalla Completa
    const fsBtn = document.getElementById('btn-fullscreen-toggle');
    if (fsBtn && viewport) {
      fsBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
          viewport.requestFullscreen?.() || viewport.webkitRequestFullscreen?.();
          fsBtn.classList.add('active');
        } else {
          document.exitFullscreen?.() || document.webkitExitFullscreen?.();
          fsBtn.classList.remove('active');
        }
      });

      document.addEventListener('fullscreenchange', () => {
        const isFs = Boolean(document.fullscreenElement);
        fsBtn.classList.toggle('active', isFs);
        fsBtn.textContent = isFs ? '⛶ Salir de Pantalla' : '⛶ Pantalla Completa';
      });
    }

    // Control Deslizante de Volumen
    const volSlider = document.getElementById('arcade-volume-slider');
    const volLabel = document.getElementById('arcade-volume-label');
    if (volSlider) {
      volSlider.addEventListener('input', () => {
        const val = Number(volSlider.value);
        if (volLabel) volLabel.textContent = `${val}%`;
        if (citlalliAudio && typeof citlalliAudio.setVolume === 'function') {
          citlalliAudio.setVolume(val / 100);
        }
      });
    }

    // Atajos Globales de Teclado (Accesibilidad y Agilidad)
    window.addEventListener('keydown', (e) => {
      // Ignorar si el usuario está escribiendo en un input o textarea
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      const key = e.key.toLowerCase();
      if (key === '1') this.mountGame('snake', { autoStart: true });
      else if (key === '2') this.mountGame('memory', { autoStart: true });
      else if (key === '3') this.mountGame('reflex', { autoStart: true });
      else if (key === '4') this.mountGame('flappy', { autoStart: true });
      else if (key === 'h') this.setScenario('hidalgo');
      else if (key === 'j') this.setScenario('jaguar');
      else if (key === 'v') this.setScenario('velvet');
      else if (key === 'm') citlalliAudio.toggleMute();
      else if (key === 'c' && crtBtn) crtBtn.click();
      else if (key === 'f' && fsBtn) fsBtn.click();
      else if (key === 't') this.startCopaCitlalli();
    });
  }

  _updateAudioTrackUI(trackId) {
    const track = CITLALLI_TRACKS[trackId] || CITLALLI_TRACKS.hidalgo;
    const titleEl = document.getElementById('audio-track-title');
    const subEl = document.getElementById('audio-track-subtitle');
    const bpmEl = document.getElementById('audio-bpm-badge');

    if (titleEl) titleEl.textContent = track.title;
    if (subEl) subEl.textContent = track.subtitle;
    if (bpmEl) bpmEl.textContent = `${track.bpm} BPM`;
  }

  _startEqualizerLoop() {
    const container = document.getElementById('arcade-eq-bars');
    if (!container) return;
    const bars = Array.from(container.querySelectorAll('.eq-bar'));

    const updateEq = () => {
      const spectrum = citlalliAudio.getSpectrumData();
      for (let i = 0; i < bars.length; i++) {
        const val = spectrum[i] || 0;
        const pct = Math.max(12, Math.min(100, Math.round(val * 100)));
        bars[i].style.height = `${pct}%`;
      }
      requestAnimationFrame(updateEq);
    };
    requestAnimationFrame(updateEq);
  }

  /* ==========================================================================
   * SALA MULTIJUGADOR EN VIVO Y EMOTES PIXEL ART
   * ========================================================================== */

  _bindMultiplayerPanel() {
    const nameInput = document.getElementById('mp-player-name');
    const roomInput = document.getElementById('mp-room-code-input');
    const joinBtn = document.getElementById('btn-mp-join-room');
    const randomBtn = document.getElementById('btn-mp-random-room');
    const botsCheckbox = document.getElementById('mp-bots-checkbox');

    if (nameInput) {
      nameInput.value = citlalliMultiplayer.profile.name || 'Viajero Estelar';
      nameInput.addEventListener('change', () => {
        citlalliMultiplayer.saveProfile({ name: nameInput.value });
        this._refreshTrophyPreview();
      });
    }

    if (roomInput) {
      roomInput.value = citlalliMultiplayer.profile.roomCode || 'CITLALLI-01';
    }

    document.querySelectorAll('.avatar-pick-btn').forEach((btn) => {
      const avId = btn.getAttribute('data-avatar-id');
      btn.classList.toggle('active', avId === citlalliMultiplayer.profile.avatar);
      btn.addEventListener('click', () => {
        document
          .querySelectorAll('.avatar-pick-btn')
          .forEach((b) => b.classList.toggle('active', b === btn));
        citlalliMultiplayer.saveProfile({ avatar: avId });
      });
    });

    if (joinBtn && roomInput) {
      joinBtn.addEventListener('click', () => {
        const code = citlalliMultiplayer.joinRoom(roomInput.value);
        roomInput.value = code;
        if (typeof window.showCitlalliToast === 'function') {
          window.showCitlalliToast({
            title: `SALA ACTIVA: ${code}`,
            message:
              'Sincronización en tiempo real activada. Abre otra pestaña con este código para competir en simultáneo.',
            icon: '🌐',
            type: 'gold'
          });
        }
      });
    }

    if (randomBtn && roomInput) {
      randomBtn.addEventListener('click', () => {
        const code = citlalliMultiplayer.generateMysticRoomCode();
        roomInput.value = code;
      });
    }

    if (botsCheckbox) {
      botsCheckbox.addEventListener('change', () => {
        citlalliMultiplayer.toggleSimulatedRivals(botsCheckbox.checked);
      });
    }

    // Botones de Emotes Pixel Art
    document.querySelectorAll('.btn-emote').forEach((btn) => {
      btn.addEventListener('click', () => {
        const emoteId = btn.getAttribute('data-emote');
        citlalliMultiplayer.sendEmote(emoteId);
      });
    });

    // Suscribirse a actualizaciones de sala y emotes
    citlalliMultiplayer.on('roomUpdate', (data) => this._renderRoomPlayers(data));
    citlalliMultiplayer.on('emote', (emoteData) => this._spawnFloatingEmote(emoteData));
  }

  _renderRoomPlayers({ roomCode, players = [] }) {
    const codeEl = document.getElementById('race-room-code');
    const leaderEl = document.getElementById('race-leader-label');
    const barsEl = document.getElementById('live-race-bars');
    const listEl = document.getElementById('mp-connected-players');

    if (codeEl) codeEl.textContent = roomCode || 'CITLALLI-01';

    const maxScore = Math.max(300, ...players.map((p) => p.score || 0));
    if (leaderEl && players.length > 0) {
      leaderEl.textContent = `Líder: ${players[0].name} (${players[0].score || 0} PTS)`;
    }

    // 1. Barras de Carrera en Vivo en el HUD del Gabinete
    if (barsEl) {
      barsEl.innerHTML = players
        .slice(0, 4)
        .map((p) => {
          const av = citlalliMultiplayer.getAvatarObject(p.avatar);
          const pct = Math.min(100, Math.max(6, Math.round(((p.score || 0) / maxScore) * 100)));
          const barColor = p.isSelf
            ? 'linear-gradient(90deg, #D4AF37, #FFE57F)'
            : 'linear-gradient(90deg, #E0A98B, #D4AF37)';
          return `
            <div class="race-bar-row">
              <span class="race-player-tag">${av.emoji} ${p.name}${p.isSelf ? ' (Tú)' : ''}</span>
              <div class="race-track-bg">
                <div class="race-track-fill" style="width:${pct}%; background:${barColor}"></div>
              </div>
              <span class="race-player-pts">${p.score || 0} pts</span>
            </div>
          `;
        })
        .join('');
    }

    // 2. Lista de Jugadores en el Sidebar Multijugador
    if (listEl) {
      listEl.innerHTML = players
        .map((p) => {
          const av = citlalliMultiplayer.getAvatarObject(p.avatar);
          return `
            <div class="mp-player-item">
              <div class="mp-player-left">
                <img src="${av.sprite}" alt="${av.name}" width="22" height="22" style="image-rendering:pixelated" />
                <div>
                  <strong style="color:${p.isSelf ? '#FFE57F' : '#F6EFE6'}">${p.name}${
            p.isSelf ? ' (Tú)' : ''
          }</strong>
                  <small style="display:block;color:#A9B6D3;font-size:0.66rem">${
                    p.status || 'En Sala'
                  }</small>
                </div>
              </div>
              <span class="mp-player-score">${p.score || 0} PTS</span>
            </div>
          `;
        })
        .join('');
    }

    // Si estamos en modo online, enviar el puntaje del mejor rival al juego activo como p2Score
    const bestRival = players.find((p) => !p.isSelf);
    if (bestRival && this.activeMode === 'online' && this.currentGameInstance) {
      if (typeof this.currentGameInstance.handleRemoteEvent === 'function') {
        this.currentGameInstance.handleRemoteEvent({
          type: 'score_update',
          score: bestRival.score || 0,
          playerName: bestRival.name
        });
      }
    }
  }

  _spawnFloatingEmote(emoteData) {
    if (citlalliAudio) {
      citlalliAudio.playSFX('emote');
    }

    const layer = document.getElementById('arcade-emote-layer');
    if (layer) {
      const bubble = document.createElement('div');
      bubble.className = 'floating-emote-bubble';
      const leftPct = 15 + Math.floor(Math.random() * 65);
      bubble.style.left = `${leftPct}%`;
      bubble.innerHTML = `${emoteData.icon} <strong>${emoteData.playerName}:</strong> ${emoteData.label}`;
      layer.appendChild(bubble);
      setTimeout(() => bubble.remove(), 2900);
    }
  }

  /* ==========================================================================
   * CÓDICE DE LORE OLFATIVO EN VIVO
   * ========================================================================== */

  _bindLoreCodex() {
    document.querySelectorAll('.lore-sprite-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const loreId = btn.getAttribute('data-lore-id');
        if (LORE_ITEMS[loreId]) {
          this._handleLoreUnlock(LORE_ITEMS[loreId]);
        }
      });
    });
  }

  _inspectLoreByKeyword(keyword = '') {
    const lower = String(keyword).toLowerCase();
    if (lower.includes('mandarin')) this._handleLoreUnlock(LORE_ITEMS.mandarin);
    else if (lower.includes('rosa') || lower.includes('rose'))
      this._handleLoreUnlock(LORE_ITEMS.rose_pink);
    else if (lower.includes('jazm')) this._handleLoreUnlock(LORE_ITEMS.jasmine_white);
    else if (lower.includes('vainill')) this._handleLoreUnlock(LORE_ITEMS.vanilla_pod);
    else if (lower.includes('ámbar') || lower.includes('ambar'))
      this._handleLoreUnlock(LORE_ITEMS.amber_crystal);
    else if (lower.includes('frasco') || lower.includes('bottle'))
      this._handleLoreUnlock(LORE_ITEMS.bottle_citlalli);
    else if (lower.includes('jaguar')) this._handleLoreUnlock(LORE_ITEMS.jaguar_gold);
  }

  _handleLoreUnlock(item) {
    if (!item) return;
    const aliasMap = {
      bottle: 'bottle_citlalli',
      charm: 'charm_qm',
      medallon_qm: 'charm_qm',
      jaguar: 'jaguar_gold',
      star: 'star_citlalli',
      rose: 'rose_pink',
      jasmine: 'jasmine_white',
      vanilla: 'vanilla_pod',
      amber: 'amber_crystal',
      vessel: 'clay_vessel',
      clay: 'clay_vessel'
    };
    const resolvedKey = aliasMap[item.id] || item.id;
    const catalogRef = LORE_ITEMS[resolvedKey] || null;
    const spriteUrl = item.sprite || catalogRef?.sprite || null;

    const imgEl = document.getElementById('lore-active-sprite');
    const catEl = document.getElementById('lore-active-category');
    const nameEl = document.getElementById('lore-active-name');
    const descEl = document.getElementById('lore-active-desc');

    if (imgEl && spriteUrl) imgEl.src = spriteUrl;
    if (catEl) catEl.textContent = item.category || catalogRef?.category || 'Esencia Sagrada';
    if (nameEl) nameEl.textContent = item.name || catalogRef?.name || 'Reliquia Citlalli';
    if (descEl) {
      descEl.textContent = item.description || item.lore || catalogRef?.description || '';
    }
  }

  /* ==========================================================================
   * MODO TORNEO: COPA CITLALLI 1ZMEADMLSA (4 JUEGOS ENCADENADOS)
   * ========================================================================== */

  _bindTournamentControls() {
    const nextBtn = document.getElementById('btn-tourney-next');
    const cancelBtn = document.getElementById('btn-tourney-cancel');

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const currentScore =
          this.currentGameInstance?.score ??
          this.currentGameInstance?.p1?.score ??
          0;
        const state = citlalliMultiplayer.recordTournamentStageScore(
          this.activeGameId,
          currentScore
        );
        this._updateTournamentUI(state);
        if (state && state.active && state.currentStage) {
          this.mountGame(state.currentStage.id, { autoStart: true });
        }
      });
    }

    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        const state = citlalliMultiplayer.cancelTournament();
        this._updateTournamentUI(state);
      });
    }
  }

  startCopaCitlalli() {
    const state = citlalliMultiplayer.startTournament();
    this._updateTournamentUI(state);
    this.mountGame(TOURNAMENT_GAMES[0].id, { autoStart: true });

    if (typeof window.showCitlalliToast === 'function') {
      window.showCitlalliToast({
        title: '🏆 INICIA LA COPA CITLALLI 1ZMEADMLSA',
        message:
          'Etapa 1/4: La Víborita. Tus puntajes en los 4 juegos se sumarán para el Gran Trofeo.',
        icon: '🏆',
        type: 'gold',
        duration: 5000
      });
    }
  }

  _updateTournamentUI(state) {
    const banner = document.getElementById('arcade-tournament-banner');
    if (!banner || !state) return;

    banner.classList.toggle('hidden', !state.active && !state.completed);

    const totalEl = document.getElementById('tourney-total-score');
    if (totalEl) totalEl.textContent = `${state.totalScore || 0} PTS`;

    ['snake', 'memory', 'reflex', 'flappy'].forEach((gId) => {
      const el = document.getElementById(`tourney-score-${gId}`);
      if (el) el.textContent = `${state.stageScores?.[gId] || 0} pts`;
    });

    document.querySelectorAll('[data-tourney-step]').forEach((pill) => {
      const stepId = pill.getAttribute('data-tourney-step');
      pill.classList.toggle('active', state.currentStage?.id === stepId && state.active);
    });
  }

  /* ==========================================================================
   * DESAFÍO ACTIVO POR URL (?challenge=...)
   * ========================================================================== */

  _bindChallengeBanner() {
    const dismissBtn = document.getElementById('challenge-dismiss-btn');
    if (dismissBtn) {
      dismissBtn.addEventListener('click', () => {
        const banner = document.getElementById('arcade-challenge-banner');
        if (banner) banner.classList.add('hidden');
      });
    }

    citlalliMultiplayer.on('challengeUpdate', (ch) => {
      this._updateChallengeBannerUI(ch);
    });
  }

  _updateChallengeBannerUI(ch) {
    const banner = document.getElementById('arcade-challenge-banner');
    if (!banner || !ch || !ch.active) return;

    banner.classList.remove('hidden');
    const titleEl = document.getElementById('challenge-banner-title');
    const subEl = document.getElementById('challenge-banner-sub');
    const curEl = document.getElementById('challenge-current-pts');
    const tarEl = document.getElementById('challenge-target-pts');
    const fillEl = document.getElementById('challenge-progress-fill');

    const gName = GAME_CATALOG[ch.gameId]?.shortName || 'CITLALLI Arcade';
    if (titleEl) {
      titleEl.textContent = ch.beaten
        ? `🏆 ¡DESAFÍO SUPERADO! Venciste los ${ch.targetScore} PTS de ${ch.rivalName}`
        : `⚡ DESAFÍO ACTIVO EN ${gName.toUpperCase()}: Supera los ${ch.targetScore} PTS de ${ch.rivalName}`;
    }
    if (subEl) {
      subEl.textContent = ch.beaten
        ? '¡Has conquistado el reto estelar! Descarga tu Tarjeta de Trofeo PNG para presumir tu victoria.'
        : `Escenario sugerido: ${SCENARIO_LABELS[ch.scenarioId] || 'Hidalgo Estelar'}.`;
    }
    if (curEl) curEl.textContent = `Tu Puntaje: ${ch.currentScore || 0} PTS`;
    if (tarEl) tarEl.textContent = `Meta: ${ch.targetScore} PTS`;
    if (fillEl) {
      const pct = Math.min(
        100,
        Math.round(((ch.currentScore || 0) / Math.max(1, ch.targetScore)) * 100)
      );
      fillEl.style.width = `${pct}%`;
    }
  }

  /* ==========================================================================
   * TABLA DE RÉCORDS, TARJETA DE TROFEO PNG Y CONSTELACIÓN DE 12 LOGROS
   * ========================================================================== */

  _bindLeaderboardAndTrophies() {
    document.querySelectorAll('.lb-filter-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.leaderboardFilterGame = btn.getAttribute('data-lb-game') || 'all';
        document
          .querySelectorAll('.lb-filter-btn')
          .forEach((b) => b.classList.toggle('active', b === btn));
        this._renderLeaderboard();
      });
    });

    const scFilter = document.getElementById('lb-scenario-filter');
    if (scFilter) {
      scFilter.addEventListener('change', () => {
        this.leaderboardFilterScenario = scFilter.value || 'all';
        this._renderLeaderboard();
      });
    }

    // Botón rápido debajo del gabinete para ir a la Tarjeta de Trofeo
    const openTrophyBtn = document.getElementById('btn-open-trophy-modal');
    if (openTrophyBtn) {
      openTrophyBtn.addEventListener('click', () => {
        const currentScore =
          this.currentGameInstance?.score ??
          this.currentGameInstance?.p1?.score ??
          0;
        if (currentScore > 0) {
          this.lastScoreState.score = currentScore;
          this.lastScoreState.gameId = this.activeGameId;
          this.lastScoreState.gameName = GAME_CATALOG[this.activeGameId]?.title;
        }
        this._refreshTrophyPreview();
        document
          .getElementById('trophy-generator-card')
          ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }

    // Botón Descargar PNG (1080x600)
    const downloadBtn = document.getElementById('btn-download-trophy-png');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', async () => {
        await citlalliMultiplayer.downloadTrophyPNG({
          playerName: citlalliMultiplayer.profile.name,
          ...this.lastScoreState
        });
        if (typeof window.showCitlalliToast === 'function') {
          window.showCitlalliToast({
            title: 'TARJETA DE TROFEO PNG DESCARGADA',
            message: 'Tu certificado oficial de 1080×600 ha sido guardado en tu dispositivo.',
            icon: '🏅',
            type: 'gold'
          });
        }
      });
    }

    // Botón Compartir Nativo
    const shareBtn = document.getElementById('btn-native-share-trophy');
    if (shareBtn) {
      shareBtn.addEventListener('click', async () => {
        const res = await citlalliMultiplayer.shareTrophy({
          playerName: citlalliMultiplayer.profile.name,
          ...this.lastScoreState
        });
        if (res.copied && typeof window.showCitlalliToast === 'function') {
          window.showCitlalliToast({
            title: 'ENLACE DE RÉCORD COPIADO',
            message: 'El texto y link de tu desafío se copiaron al portapapeles.',
            icon: '📲',
            type: 'gold'
          });
        }
      });
    }

    // Botón WhatsApp Challenge
    const waBtn = document.getElementById('btn-whatsapp-challenge');
    if (waBtn) {
      waBtn.addEventListener('click', () => {
        const url = citlalliMultiplayer.generateChallengeUrl({
          gameId: this.lastScoreState.gameId || this.activeGameId,
          score: this.lastScoreState.score || 500,
          playerName: citlalliMultiplayer.profile.name,
          scenarioId: this.activeScenarioId
        });
        const text = `✨ ¡Logré ${this.lastScoreState.score || 500} PTS en CITLALLI Arcade (${
          this.lastScoreState.gameName
        })! ¿Puedes superar mi récord estelar? Entra aquí: ${url}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
      });
    }

    // Botones Copiar Link de Desafío Directo
    const copyChallengeBtns = [
      document.getElementById('btn-copy-challenge-link'),
      document.getElementById('btn-copy-challenge-url-card')
    ];
    copyChallengeBtns.forEach((btn) => {
      if (!btn) return;
      btn.addEventListener('click', async () => {
        const scoreToChallenge =
          (this.currentGameInstance?.score ??
            this.currentGameInstance?.p1?.score ??
            0) ||
          this.lastScoreState.score ||
          500;
        const url = citlalliMultiplayer.generateChallengeUrl({
          gameId: this.activeGameId,
          score: scoreToChallenge,
          playerName: citlalliMultiplayer.profile.name,
          scenarioId: this.activeScenarioId
        });
        try {
          await navigator.clipboard.writeText(url);
        } catch (_) {}
        if (typeof window.showCitlalliToast === 'function') {
          window.showCitlalliToast({
            title: '🔗 LINK DE DESAFÍO COPIADO',
            message: `Comparte este enlace para retar a tus amigos a superar ${scoreToChallenge} PTS: ${url}`,
            icon: '⚡',
            type: 'gold',
            duration: 5200
          });
        }
      });
    });

    citlalliMultiplayer.on('leaderboardUpdate', () => this._renderLeaderboard());
    citlalliMultiplayer.on('achievementUnlocked', (ach) => {
      this._renderAchievements();
      if (typeof window.showCitlalliToast === 'function') {
        window.showCitlalliToast({
          title: `⭐ ESTRELLA DESBLOQUEADA: ${ach.title.toUpperCase()}`,
          message: ach.description,
          icon: ach.icon || '🌟',
          type: 'gold',
          duration: 5000
        });
      }
    });
  }

  _renderLeaderboard() {
    const tbody = document.getElementById('leaderboard-tbody');
    if (!tbody) return;

    const entries = citlalliMultiplayer.getLeaderboard({
      gameId: this.leaderboardFilterGame,
      scenarioId: this.leaderboardFilterScenario,
      limit: 12
    });

    const gameNamesShort = {
      snake: '🐍 Víborita',
      memory: '🃏 Memorama',
      reflex: '⚡ Reflejos',
      flappy: '🦅 Flappy',
      tournament: '🏆 Copa Citlalli'
    };

    tbody.innerHTML = entries
      .map((item, idx) => {
        const av = citlalliMultiplayer.getAvatarObject(item.avatar);
        const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`;
        const gLabel = gameNamesShort[item.gameId] || item.gameId;
        const scLabel = SCENARIO_LABELS[item.scenarioId] || item.scenarioId;

        return `
          <tr class="${item.isUser ? 'lb-row-user' : ''}">
            <td><strong>${medal}</strong></td>
            <td>
              <div style="display:flex;align-items:center;gap:0.45rem">
                <img src="${av.sprite}" alt="${av.name}" width="22" height="22" style="image-rendering:pixelated" />
                <strong>${item.playerName}</strong>
              </div>
            </td>
            <td>
              <div>${gLabel}</div>
              <small style="color:#A9B6D3;font-size:0.72rem">${scLabel}</small>
            </td>
            <td><span class="lb-score-strong">${item.score} PTS</span></td>
            <td><span style="color:#E0A98B;font-size:0.78rem">${item.rank}</span></td>
            <td>
              <button
                type="button"
                class="btn-row-trophy"
                data-trophy-name="${item.playerName}"
                data-trophy-score="${item.score}"
                data-trophy-game="${gLabel}"
                data-trophy-rank="${item.rank}"
                data-trophy-scenario="${scLabel}"
              >
                🏅 Trofeo
              </button>
            </td>
          </tr>
        `;
      })
      .join('');

    tbody.querySelectorAll('.btn-row-trophy').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.lastScoreState = {
          playerName: btn.getAttribute('data-trophy-name'),
          score: Number(btn.getAttribute('data-trophy-score') || 500),
          gameName: btn.getAttribute('data-trophy-game'),
          rank: btn.getAttribute('data-trophy-rank'),
          scenarioName: btn.getAttribute('data-trophy-scenario')
        };
        this._refreshTrophyPreview(this.lastScoreState.playerName);
      });
    });
  }

  async _refreshTrophyPreview(overridePlayerName = null) {
    const previewImg = document.getElementById('trophy-card-preview-img');
    if (!previewImg) return;

    const res = await citlalliMultiplayer.generateTrophyCardPNG({
      playerName: overridePlayerName || citlalliMultiplayer.profile.name,
      gameName: this.lastScoreState.gameName,
      gameId: this.lastScoreState.gameId,
      score: this.lastScoreState.score,
      rank: this.lastScoreState.rank,
      scenarioName: this.lastScoreState.scenarioName
    });

    if (res && res.dataUrl) {
      previewImg.src = res.dataUrl;
    }
  }

  _renderAchievements() {
    const grid = document.getElementById('achievements-grid');
    const countEl = document.getElementById('achievements-unlocked-count');
    if (!grid) return;

    const list = citlalliMultiplayer.getAchievementsStatus();
    const unlockedCount = list.filter((a) => a.unlocked).length;

    if (countEl) {
      countEl.textContent = `${unlockedCount} / ${list.length}`;
    }

    grid.innerHTML = list
      .map(
        (ach) => `
        <div class="achievement-star-card ${ach.unlocked ? 'unlocked' : ''}">
          <div class="ach-icon">${ach.icon}</div>
          <div class="ach-body">
            <strong>${ach.unlocked ? '★ ' : '☆ '}${ach.title}</strong>
            <p>${ach.description}</p>
          </div>
        </div>
      `
      )
      .join('');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.citlalliArcadeController = new CitlalliArcadeController();
});
