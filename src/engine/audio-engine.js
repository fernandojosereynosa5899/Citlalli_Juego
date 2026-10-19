/**
 * CITLALLI ("El Aroma de los Dioses") - Motor Musical Chiptune 8-Bit/16-Bit y SFX
 * Sintetizador multipista en tiempo real basado 100% en Web Audio API.
 * Incluye 4 composiciones originales para cada escenario de Citlalli,
 * 15 efectos de sonido (SFX) y analizador de espectro de 16 bandas en vivo.
 */

const NOTE_FREQS = {
  REST: 0,
  C2: 65.41, D2: 73.42, E2: 82.41, F2: 87.31, G2: 98.00, A2: 110.00, B2: 123.47,
  C3: 130.81, Cs3: 138.59, D3: 146.83, Ds3: 155.56, E3: 164.81, F3: 174.61, Fs3: 185.00, G3: 196.00, Gs3: 207.65, A3: 220.00, Bb3: 233.08, B3: 246.94,
  C4: 261.63, Cs4: 277.18, D4: 293.66, Ds4: 311.13, E4: 329.63, F4: 349.23, Fs4: 369.99, G4: 392.00, Gs4: 415.30, A4: 440.00, Bb4: 466.16, B4: 493.88,
  C5: 523.25, Cs5: 554.37, D5: 587.33, Ds5: 622.25, E5: 659.25, F5: 698.46, Fs5: 739.99, G5: 783.99, Gs5: 830.61, A5: 880.00, Bb5: 932.33, B5: 987.77,
  C6: 1046.50, D6: 1174.66, E6: 1318.51, G6: 1567.98, A6: 1760.00
};

/**
 * 4 Composiciones Originales Multipista para los Escenarios de CITLALLI
 * Cada paso equivale a una semicorchea (16th note); 32 pasos por bucle.
 */
export const CITLALLI_TRACKS = {
  hidalgo: {
    id: 'hidalgo',
    title: 'Noche Estrellada en Hidalgo',
    subtitle: 'El Sueño de David bajo el Árbol Ancestral',
    bpm: 112,
    leadWave: 'triangle',
    arpWave: 'sine',
    bassWave: 'triangle',
    lead: [
      'A4', 'REST', 'C5', 'E5', 'A5', 'REST', 'G5', 'E5',
      'F5', 'REST', 'E5', 'D5', 'C5', 'REST', 'B4', 'C5',
      'D5', 'REST', 'F5', 'A5', 'G5', 'REST', 'E5', 'C5',
      'B4', 'C5', 'D5', 'B4', 'A4', 'REST', 'E4', 'REST'
    ],
    arp: [
      'A4', 'C5', 'E5', 'A5', 'E5', 'C5', 'A4', 'E5',
      'F4', 'A4', 'C5', 'F5', 'C5', 'A4', 'F4', 'C5',
      'D4', 'F4', 'A4', 'D5', 'C4', 'E4', 'G4', 'C5',
      'E4', 'Gs4', 'B4', 'E5', 'A4', 'C5', 'E5', 'A5'
    ],
    bass: [
      'A2', 'REST', 'A2', 'E3', 'A2', 'REST', 'A2', 'G2',
      'F2', 'REST', 'F2', 'C3', 'F2', 'REST', 'F2', 'E2',
      'D2', 'REST', 'D2', 'A2', 'C2', 'REST', 'C2', 'G2',
      'E2', 'REST', 'E2', 'B2', 'A2', 'REST', 'A2', 'E2'
    ],
    drums: [
      'K', '.', 'H', '.', 'S', '.', 'H', '.',
      'K', '.', 'K', 'H', 'S', '.', 'H', '.',
      'K', '.', 'H', '.', 'S', '.', 'H', '.',
      'K', 'H', 'S', 'H', 'K', 'S', 'H', 'H'
    ]
  },

  jaguar: {
    id: 'jaguar',
    title: 'Santuario del Jaguar Dorado',
    subtitle: 'Fuerza Prehispánica y Resina de Ámbar',
    bpm: 128,
    leadWave: 'square',
    arpWave: 'triangle',
    bassWave: 'sawtooth',
    lead: [
      'E4', 'E4', 'G4', 'A4', 'B4', 'REST', 'D5', 'B4',
      'A4', 'G4', 'E4', 'G4', 'A4', 'REST', 'E4', 'REST',
      'E5', 'REST', 'D5', 'B4', 'A4', 'B4', 'G4', 'A4',
      'F4', 'G4', 'E4', 'D4', 'E4', 'REST', 'E4', 'REST'
    ],
    arp: [
      'E4', 'B4', 'E5', 'B4', 'E4', 'B4', 'D5', 'B4',
      'A4', 'E5', 'A5', 'E5', 'A4', 'E5', 'G5', 'E5',
      'E4', 'B4', 'E5', 'G5', 'D4', 'A4', 'D5', 'F5',
      'B3', 'Fs4', 'B4', 'D5', 'E4', 'B4', 'E5', 'B4'
    ],
    bass: [
      'E2', 'E2', 'B2', 'E2', 'E2', 'G2', 'A2', 'B2',
      'A2', 'A2', 'E3', 'A2', 'A2', 'G2', 'F2', 'E2',
      'E2', 'E2', 'B2', 'E2', 'D2', 'D2', 'A2', 'D2',
      'B2', 'A2', 'G2', 'F2', 'E2', 'B2', 'E2', 'REST'
    ],
    drums: [
      'K', 'H', 'K', 'H', 'S', 'H', 'K', 'H',
      'K', 'K', 'H', 'S', 'K', 'H', 'S', 'H',
      'K', 'H', 'K', 'H', 'S', 'H', 'K', 'H',
      'K', 'S', 'K', 'S', 'K', 'K', 'S', 'H'
    ]
  },

  velvet: {
    id: 'velvet',
    title: 'Cámara Alquímica de Terciopelo',
    subtitle: 'Rosa, Jazmín, Mandarina y Oro Rosa',
    bpm: 118,
    leadWave: 'sine',
    arpWave: 'triangle',
    bassWave: 'triangle',
    lead: [
      'Fs5', 'REST', 'E5', 'Cs5', 'B4', 'REST', 'Cs5', 'E5',
      'Fs5', 'A5', 'Gs5', 'Fs5', 'E5', 'REST', 'Cs5', 'REST',
      'D5', 'REST', 'Fs5', 'A5', 'Gs5', 'REST', 'E5', 'B4',
      'Cs5', 'D5', 'E5', 'Cs5', 'Fs4', 'REST', 'Fs4', 'REST'
    ],
    arp: [
      'Fs4', 'A4', 'Cs5', 'Fs5', 'Cs5', 'A4', 'Fs4', 'Cs5',
      'D4', 'Fs4', 'A4', 'D5', 'A4', 'Fs4', 'D4', 'A4',
      'B3', 'D4', 'Fs4', 'B4', 'Gs4', 'B4', 'E5', 'Gs5',
      'A4', 'Cs5', 'Fs5', 'A5', 'Fs5', 'Cs5', 'A4', 'Fs4'
    ],
    bass: [
      'Fs2', 'REST', 'Cs3', 'Fs2', 'D2', 'REST', 'A2', 'D2',
      'A2', 'REST', 'E3', 'A2', 'E2', 'REST', 'B2', 'E2',
      'B2', 'REST', 'Fs3', 'B2', 'Cs3', 'REST', 'Gs3', 'Cs3',
      'Fs2', 'REST', 'Cs3', 'A2', 'Fs2', 'REST', 'Cs2', 'REST'
    ],
    drums: [
      'K', '.', 'H', 'H', 'S', '.', 'H', '.',
      'K', '.', 'H', '.', 'S', 'H', 'H', '.',
      'K', '.', 'H', 'H', 'S', '.', 'H', '.',
      'K', 'H', 'S', '.', 'K', 'H', 'S', 'H'
    ]
  },

  penthouse: {
    id: 'penthouse',
    title: 'Penthouse Nocturno Metropolitano',
    subtitle: 'Elegancia Magnética del Hombre Citlalli',
    bpm: 124,
    leadWave: 'square',
    arpWave: 'sine',
    bassWave: 'sawtooth',
    lead: [
      'C5', 'REST', 'Ds5', 'F5', 'G5', 'REST', 'Bb5', 'G5',
      'F5', 'Ds5', 'C5', 'Ds5', 'F5', 'REST', 'G5', 'REST',
      'Gs5', 'REST', 'G5', 'F5', 'Ds5', 'REST', 'D5', 'C5',
      'Bb4', 'C5', 'D5', 'Ds5', 'C5', 'REST', 'C5', 'REST'
    ],
    arp: [
      'C4', 'Ds4', 'G4', 'C5', 'Ds5', 'C5', 'G4', 'Ds4',
      'Gs3', 'C4', 'Ds4', 'Gs4', 'C5', 'Gs4', 'Ds4', 'C4',
      'F4', 'Gs4', 'C5', 'F5', 'G4', 'B4', 'D5', 'G5',
      'C4', 'Ds4', 'G4', 'C5', 'G4', 'Ds4', 'C4', 'G4'
    ],
    bass: [
      'C2', 'C2', 'G2', 'C2', 'C2', 'C2', 'Bb2', 'G2',
      'Gs2', 'Gs2', 'Ds3', 'Gs2', 'Bb2', 'Bb2', 'F2', 'G2',
      'F2', 'F2', 'C3', 'F2', 'G2', 'G2', 'D3', 'G2',
      'C2', 'G2', 'C3', 'Bb2', 'G2', 'F2', 'Ds2', 'D2'
    ],
    drums: [
      'K', 'H', 'S', 'H', 'K', 'K', 'S', 'H',
      'K', 'H', 'S', 'H', 'K', 'S', 'H', 'H',
      'K', 'H', 'S', 'H', 'K', 'K', 'S', 'H',
      'K', 'S', 'K', 'S', 'K', 'K', 'S', 'S'
    ]
  }
};

class CitlalliAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.musicGain = null;
    this.sfxGain = null;
    this.analyser = null;
    this.noiseBuffer = null;
    this.freqData = null;

    this.isInitialized = false;
    this.isMuted = false;
    this.isPlaying = false;
    this.volume = 0.7;
    this.currentTrackId = 'hidalgo';
    this.stepIndex = 0;
    this.stepTimer = null;
  }

  /**
   * Inicializa el contexto Web Audio tras el primer gesto del usuario o llamada explícita.
   */
  init() {
    if (typeof window === 'undefined') return false;
    if (this.isInitialized && this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return true;
    }

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return false;

      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.musicGain = this.ctx.createGain();
      this.sfxGain = this.ctx.createGain();
      this.analyser = this.ctx.createAnalyser();

      this.analyser.fftSize = 64;
      this.analyser.smoothingTimeConstant = 0.78;
      this.freqData = new Uint8Array(this.analyser.frequencyBinCount);

      this.masterGain.gain.value = this.isMuted ? 0 : this.volume;
      this.musicGain.gain.value = 0.42;
      this.sfxGain.gain.value = 0.85;

      this.musicGain.connect(this.masterGain);
      this.sfxGain.connect(this.masterGain);
      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);

      // Generar buffer de ruido blanco para percusión Chiptune y atomizador de perfume
      const sampleRate = this.ctx.sampleRate;
      const bufferLength = sampleRate * 1.0;
      this.noiseBuffer = this.ctx.createBuffer(1, bufferLength, sampleRate);
      const data = this.noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferLength; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      this.isInitialized = true;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return true;
    } catch (e) {
      console.warn('[CitlalliAudio] Web Audio API no disponible:', e);
      return false;
    }
  }

  /**
   * Inicia o cambia la música Chiptune según el escenario activo.
   */
  playMusic(trackId = 'hidalgo') {
    this.init();
    const resolvedTrack = CITLALLI_TRACKS[trackId] ? trackId : 'hidalgo';
    if (this.isPlaying && this.currentTrackId === resolvedTrack) {
      return;
    }

    this.stopMusic();
    this.currentTrackId = resolvedTrack;
    this.isPlaying = true;
    this.stepIndex = 0;

    const track = CITLALLI_TRACKS[this.currentTrackId];
    const stepDurationMs = (60 / track.bpm / 4) * 1000;

    const tick = () => {
      if (!this.isPlaying) return;
      if (!this.isMuted && this.ctx && this.ctx.state === 'running') {
        this._playStep(track, this.stepIndex, stepDurationMs / 1000);
      }
      this.stepIndex = (this.stepIndex + 1) % track.lead.length;
    };

    tick();
    this.stepTimer = setInterval(tick, stepDurationMs);
  }

  playTrack(trackId = 'hidalgo') {
    return this.playMusic(trackId);
  }

  stopMusic() {
    this.isPlaying = false;
    if (this.stepTimer) {
      clearInterval(this.stepTimer);
      this.stepTimer = null;
    }
  }

  stopTrack() {
    return this.stopMusic();
  }

  _playStep(track, stepIdx, stepSec) {
    const now = this.ctx.currentTime;

    // 1. Melodía Principal
    const leadNote = track.lead[stepIdx % track.lead.length];
    if (leadNote && leadNote !== 'REST' && NOTE_FREQS[leadNote]) {
      this._triggerTone({
        freq: NOTE_FREQS[leadNote],
        type: track.leadWave || 'square',
        startTime: now,
        duration: stepSec * 1.45,
        gainVal: 0.16,
        dest: this.musicGain
      });
    }

    // 2. Arpegio Estelar
    const arpNote = track.arp[stepIdx % track.arp.length];
    if (arpNote && arpNote !== 'REST' && NOTE_FREQS[arpNote]) {
      this._triggerTone({
        freq: NOTE_FREQS[arpNote],
        type: track.arpWave || 'triangle',
        startTime: now,
        duration: stepSec * 0.85,
        gainVal: 0.10,
        dest: this.musicGain
      });
    }

    // 3. Línea de Bajo
    const bassNote = track.bass[stepIdx % track.bass.length];
    if (bassNote && bassNote !== 'REST' && NOTE_FREQS[bassNote]) {
      this._triggerTone({
        freq: NOTE_FREQS[bassNote],
        type: track.bassWave || 'triangle',
        startTime: now,
        duration: stepSec * 1.2,
        gainVal: 0.18,
        dest: this.musicGain
      });
    }

    // 4. Percusión Chiptune
    const drum = track.drums[stepIdx % track.drums.length];
    if (drum === 'K') {
      this._triggerKick(now);
    } else if (drum === 'S') {
      this._triggerSnare(now);
    } else if (drum === 'H') {
      this._triggerHiHat(now);
    }
  }

  _triggerTone({ freq, endFreq, type = 'square', startTime, duration = 0.12, gainVal = 0.2, dest }) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);
    if (endFreq) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), startTime + duration);
    }

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.linearRampToValueAtTime(gainVal, startTime + Math.min(0.012, duration * 0.2));
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(dest || this.sfxGain);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.015);
  }

  _triggerKick(startTime) {
    this._triggerTone({
      freq: 135,
      endFreq: 36,
      type: 'sine',
      startTime,
      duration: 0.11,
      gainVal: 0.28,
      dest: this.musicGain
    });
  }

  _triggerSnare(startTime) {
    if (!this.ctx || !this.noiseBuffer) return;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(650, startTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.14, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.09);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    src.start(startTime);
    src.stop(startTime + 0.095);
  }

  _triggerHiHat(startTime) {
    if (!this.ctx || !this.noiseBuffer) return;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(5200, startTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.05, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.04);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    src.start(startTime);
    src.stop(startTime + 0.045);
  }

  /**
   * Reproduce uno de los 15 efectos de sonido (SFX) diseñados para CITLALLI.
   */
  playSFX(name = 'click') {
    this.init();
    if (this.isMuted || !this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    const now = this.ctx.currentTime;

    switch (name) {
      case 'spray': {
        // Atomizador de Perfume: bruma filtrada + destello de cristal
        if (this.noiseBuffer) {
          const src = this.ctx.createBufferSource();
          src.buffer = this.noiseBuffer;
          const filter = this.ctx.createBiquadFilter();
          filter.type = 'bandpass';
          filter.Q.value = 3.5;
          filter.frequency.setValueAtTime(1600, now);
          filter.frequency.exponentialRampToValueAtTime(4800, now + 0.24);

          const gain = this.ctx.createGain();
          gain.gain.setValueAtTime(0.001, now);
          gain.gain.linearRampToValueAtTime(0.28, now + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.26);

          src.connect(filter);
          filter.connect(gain);
          gain.connect(this.sfxGain);
          src.start(now);
          src.stop(now + 0.28);
        }
        this._triggerTone({ freq: 1046.5, endFreq: 1760, type: 'sine', startTime: now + 0.04, duration: 0.18, gainVal: 0.14 });
        break;
      }

      case 'collect':
      case 'pickup': {
        // Recolección de nota olfativa (Mandarina, Rosa, Jazmín, Vainilla, Ámbar)
        this._triggerTone({ freq: NOTE_FREQS.E5, type: 'triangle', startTime: now, duration: 0.07, gainVal: 0.22 });
        this._triggerTone({ freq: NOTE_FREQS.Gs5, type: 'triangle', startTime: now + 0.06, duration: 0.07, gainVal: 0.22 });
        this._triggerTone({ freq: NOTE_FREQS.B5, type: 'square', startTime: now + 0.12, duration: 0.14, gainVal: 0.18 });
        break;
      }

      case 'powerup':
      case 'combo':
      case 'bonus': {
        // Estrella Citlalli / Medallón QM / Reliquia Dorada
        const notes = ['C5', 'E5', 'G5', 'B5', 'E6'];
        notes.forEach((n, i) => {
          this._triggerTone({
            freq: NOTE_FREQS[n],
            type: 'triangle',
            startTime: now + i * 0.045,
            duration: 0.15,
            gainVal: 0.22
          });
        });
        break;
      }

      case 'flip': {
        // Giro de carta en el Memorama de Terciopelo
        this._triggerTone({ freq: 340, endFreq: 680, type: 'sine', startTime: now, duration: 0.08, gainVal: 0.18 });
        break;
      }

      case 'match': {
        // Par de cartas encontrado
        this._triggerTone({ freq: NOTE_FREQS.A4, type: 'triangle', startTime: now, duration: 0.10, gainVal: 0.22 });
        this._triggerTone({ freq: NOTE_FREQS.Cs5, type: 'triangle', startTime: now + 0.07, duration: 0.10, gainVal: 0.22 });
        this._triggerTone({ freq: NOTE_FREQS.E5, type: 'triangle', startTime: now + 0.14, duration: 0.12, gainVal: 0.22 });
        this._triggerTone({ freq: NOTE_FREQS.A5, type: 'sine', startTime: now + 0.21, duration: 0.26, gainVal: 0.26 });
        break;
      }

      case 'mismatch': {
        // Par incorrecto
        this._triggerTone({ freq: NOTE_FREQS.Eb4 || 311.13, type: 'sawtooth', startTime: now, duration: 0.11, gainVal: 0.13 });
        this._triggerTone({ freq: NOTE_FREQS.C4, type: 'sawtooth', startTime: now + 0.10, duration: 0.16, gainVal: 0.13 });
        break;
      }

      case 'flap': {
        // Aleteo del Frasco Alado Citlalli
        this._triggerTone({ freq: 260, endFreq: 590, type: 'triangle', startTime: now, duration: 0.10, gainVal: 0.20 });
        break;
      }

      case 'hit': {
        // Choque contra obstáculo / humo
        this._triggerTone({ freq: 180, endFreq: 48, type: 'sawtooth', startTime: now, duration: 0.22, gainVal: 0.28 });
        this._triggerSnare(now);
        break;
      }

      case 'reflex_flash': {
        // Aparición de estrella fugaz en Caza Estelar
        this._triggerTone({ freq: 1174.66, endFreq: 1567.98, type: 'sine', startTime: now, duration: 0.09, gainVal: 0.16 });
        break;
      }

      case 'reflex_hit': {
        // Captura relámpago de estrella fugaz
        this._triggerTone({ freq: NOTE_FREQS.G5, type: 'triangle', startTime: now, duration: 0.06, gainVal: 0.22 });
        this._triggerTone({ freq: NOTE_FREQS.D6, type: 'sine', startTime: now + 0.05, duration: 0.16, gainVal: 0.25 });
        break;
      }

      case 'win':
      case 'victory': {
        // Fanfarria Imperial de Récord / Victoria
        const fanfare = [
          { n: 'C5', t: 0.0, d: 0.11 },
          { n: 'E5', t: 0.10, d: 0.11 },
          { n: 'G5', t: 0.20, d: 0.11 },
          { n: 'C6', t: 0.30, d: 0.22 },
          { n: 'G5', t: 0.50, d: 0.12 },
          { n: 'C6', t: 0.62, d: 0.42 }
        ];
        fanfare.forEach((item) => {
          this._triggerTone({
            freq: NOTE_FREQS[item.n],
            type: 'square',
            startTime: now + item.t,
            duration: item.d,
            gainVal: 0.20
          });
        });
        break;
      }

      case 'gameover': {
        // Cadencia descendente nostálgica
        const notes = ['A4', 'G4', 'F4', 'E4'];
        notes.forEach((n, i) => {
          this._triggerTone({
            freq: NOTE_FREQS[n],
            type: 'triangle',
            startTime: now + i * 0.14,
            duration: i === 3 ? 0.38 : 0.14,
            gainVal: 0.20
          });
        });
        break;
      }

      case 'countdown': {
        this._triggerTone({ freq: NOTE_FREQS.A4, type: 'square', startTime: now, duration: 0.09, gainVal: 0.18 });
        break;
      }

      case 'emote': {
        this._triggerTone({ freq: NOTE_FREQS.C5, type: 'sine', startTime: now, duration: 0.08, gainVal: 0.18 });
        this._triggerTone({ freq: NOTE_FREQS.G5, type: 'sine', startTime: now + 0.07, duration: 0.14, gainVal: 0.20 });
        break;
      }

      case 'click':
      default: {
        this._triggerTone({ freq: 740, endFreq: 980, type: 'sine', startTime: now, duration: 0.045, gainVal: 0.14 });
        break;
      }
    }
  }

  playSfx(name = 'click') {
    return this.playSFX(name);
  }

  /**
   * Devuelve 16 barras normalizadas (0..1) para el ecualizador del gabinete arcade.
   */
  getSpectrumData() {
    const bars = new Array(16).fill(0);
    if (this.analyser && this.freqData && !this.isMuted && this.ctx && this.ctx.state === 'running') {
      this.analyser.getByteFrequencyData(this.freqData);
      for (let i = 0; i < 16; i++) {
        const val = this.freqData[i * 2] || 0;
        bars[i] = Math.min(1, val / 255);
      }
      if (this.isPlaying && bars.every((v) => v < 0.02)) {
        const t = performance.now() * 0.006;
        for (let i = 0; i < 16; i++) {
          bars[i] = 0.15 + 0.35 * Math.abs(Math.sin(t + i * 0.55));
        }
      }
      return bars;
    }

    if (this.isPlaying && !this.isMuted) {
      const t = (typeof performance !== 'undefined' ? performance.now() : Date.now()) * 0.006;
      for (let i = 0; i < 16; i++) {
        bars[i] = 0.12 + 0.32 * Math.abs(Math.sin(t + i * 0.5));
      }
    }
    return bars;
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, Number(val) || 0));
    if (this.masterGain && this.ctx && !this.isMuted) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
    return this.volume;
  }

  getTrackMeta(trackId = this.currentTrackId) {
    return CITLALLI_TRACKS[trackId] || CITLALLI_TRACKS.hidalgo;
  }

  getState() {
    const track = this.getTrackMeta(this.currentTrackId);
    return {
      isInitialized: this.isInitialized,
      isPlaying: this.isPlaying,
      isMuted: this.isMuted,
      volume: this.volume,
      currentTrackId: this.currentTrackId,
      trackTitle: track.title,
      trackSubtitle: track.subtitle,
      bpm: track.bpm
    };
  }
}

export const citlalliAudio = new CitlalliAudioEngine();

if (typeof window !== 'undefined') {
  window.CitlalliAudio = citlalliAudio;
}

export default citlalliAudio;
