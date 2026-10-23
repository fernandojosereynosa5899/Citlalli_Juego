/**
 * CITLALLI — Controlador Maestro del Salón Arcade Pixel Art
 * Motor limpio, simplificado y ergonómico inspirado en 'Multigames'
 *
 * Contiene:
 * - 4 Minijuegos en Canvas HTML5 Puro (Snake, Flappy Bird, Memorama, Reflejos)
 * - 5 Mapas Mesoamericanos (Selva de Jade, Pirámide Solar, Espacio Citlalli, Maizal Sagrado, Cenote Sagrado)
 * - Carrusel 3D con navegación por teclado (◀ ▶ / Enter), ratón y gestos táctiles
 * - Sincronización en tiempo real con la Base de Datos en Memoria RAM (/api/leaderboard y /api/records)
 * - Modal de Récords con Insignia de Premio al Campeón #1
 */

// ==================== SISTEMA DE RÉCORDS (RAM + LOCALSTORAGE + BROADCAST) ====================
const STORAGE_KEY_RECORDS = 'citlalli_multigames_records_v2';
const STORAGE_KEY_USER = 'citlalli_multigames_user_v2';
const canalLocal = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('citlalli_records_channel') : null;

function obtenerEstructuraVacia() {
  return { snake: [], flappy: [], memorama: [], reflejos: [] };
}

function leerRecordsLocales() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_RECORDS);
    if (!raw) return obtenerEstructuraVacia();
    const parsed = JSON.parse(raw);
    return {
      snake: Array.isArray(parsed.snake) ? parsed.snake : [],
      flappy: Array.isArray(parsed.flappy) ? parsed.flappy : [],
      memorama: Array.isArray(parsed.memorama) ? parsed.memorama : [],
      reflejos: Array.isArray(parsed.reflejos) ? parsed.reflejos : []
    };
  } catch (_e) {
    return obtenerEstructuraVacia();
  }
}

function guardarRecordsLocales(data) {
  try {
    localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(data));
  } catch (_e) {}
}

function fusionarListasRecords(localData, remotoData) {
  const resultado = obtenerEstructuraVacia();
  ['snake', 'flappy', 'memorama', 'reflejos'].forEach((juego) => {
    const menorEsMejor = juego === 'memorama';
    const mapa = new Map();
    const combinar = [
      ...(localData[juego] || []),
      ...(remotoData[juego] || [])
    ];

    combinar.forEach((item) => {
      if (!item || !item.username || typeof item.valor !== 'number') return;
      const clave = item.username.trim().toLowerCase();
      if (!mapa.has(clave)) {
        mapa.set(clave, {
          username: item.username.trim(),
          valor: item.valor,
          avatar: item.avatar || 'bottle',
          scenarioId: item.scenarioId || 'selva'
        });
      } else {
        const actual = mapa.get(clave);
        if ((menorEsMejor && item.valor < actual.valor) || (!menorEsMejor && item.valor > actual.valor)) {
          actual.valor = item.valor;
          actual.username = item.username.trim();
          if (item.avatar) actual.avatar = item.avatar;
        }
      }
    });

    const arr = Array.from(mapa.values());
    arr.sort((a, b) => (menorEsMejor ? a.valor - b.valor : b.valor - a.valor));
    resultado[juego] = arr.slice(0, 15);
  });
  return resultado;
}

async function sincronizarConServidorRed() {
  const statusText = document.getElementById('lan-status-text');
  try {
    const res = await fetch('/api/records', { cache: 'no-store' });
    if (res.ok) {
      const payload = await res.json();
      if (payload && payload.records) {
        const fusionados = fusionarListasRecords(leerRecordsLocales(), payload.records);
        guardarRecordsLocales(fusionados);
        if (statusText) {
          statusText.textContent = `🟢 Sincronizado en Vivo con Base de Datos en Memoria RAM (/api/leaderboard)`;
        }
        return fusionados;
      }
    }
  } catch (_err) {
    if (statusText) {
      statusText.textContent = '🟡 Modo Local Activo (Base de Datos en Memoria RAM conectada)';
    }
  }
  return leerRecordsLocales();
}

async function registrarRecordJugador(juego, valor) {
  const nombre = (estado.username || 'Fernando').trim();
  if (!nombre || valor <= 0) return;

  const actual = leerRecordsLocales();
  const nuevo = fusionarListasRecords(actual, {
    [juego]: [{
      username: nombre,
      valor: Number(valor),
      avatar: estado.avatar,
      scenarioId: estado.mapaActual
    }]
  });

  guardarRecordsLocales(nuevo);
  if (canalLocal) {
    canalLocal.postMessage({ tipo: 'nuevo_record', records: nuevo });
  }

  // Notificación flotante de récord
  mostrarNotificacionPuntaje(`¡Récord guardado en ${juego.toUpperCase()}! ${valor} pts`);

  // Sincronizar también con la API en memoria RAM
  try {
    const res = await fetch('/api/records', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        juego,
        username: nombre,
        valor: Number(valor),
        avatar: estado.avatar,
        mapa: estado.mapaActual
      })
    });
    if (res.ok) {
      const payload = await res.json();
      if (payload && payload.records) {
        guardarRecordsLocales(fusionarListasRecords(nuevo, payload.records));
      }
    }
  } catch (_e) {}
}

if (canalLocal) {
  canalLocal.onmessage = (ev) => {
    if (ev.data && ev.data.records) {
      const f = fusionarListasRecords(leerRecordsLocales(), ev.data.records);
      guardarRecordsLocales(f);
      if (document.getElementById('records-backdrop')?.classList.contains('open')) {
        renderizarModalRecords();
      }
    }
  };
}

function mostrarNotificacionPuntaje(texto) {
  const toast = document.createElement('div');
  toast.className = 'arcade-score-toast';
  toast.innerHTML = `<span>👑</span> <strong>${texto}</strong>`;
  toast.style.cssText = `
    position: fixed;
    top: 90px;
    right: 20px;
    background: #0E1730;
    color: #F4DFAC;
    border: 2px solid #D4AF37;
    border-radius: 6px;
    padding: 12px 18px;
    font-family: var(--font-pixel, "Silkscreen", monospace);
    font-size: 13px;
    font-weight: 700;
    box-shadow: 0 8px 24px rgba(0,0,0,0.5);
    z-index: 150;
    display: flex;
    align-items: center;
    gap: 10px;
    animation: screenSlideZoomIn 0.3s ease forwards;
  `;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-15px)';
    setTimeout(() => toast.remove(), 400);
  }, 2600);
}

// ==================== SPRITES PIXEL ART (SVG PURO) ====================
const SPRITES = {
  frascoCitlalli: (size = 115, rociando = false) => `
    <svg class="pixel-svg" width="${Math.round(size * 0.85)}" height="${size}" viewBox="0 0 34 40" shape-rendering="crispEdges">
      ${
        rociando
          ? `
        <rect x="2" y="4" width="2" height="2" fill="#F4DC9B"/>
        <rect x="5" y="2" width="3" height="2" fill="#F2CDB6"/>
        <rect x="27" y="3" width="3" height="2" fill="#F4DC9B"/>
        <rect x="30" y="6" width="2" height="2" fill="#FFFFFF"/>
      `
          : ''
      }
      <rect x="12" y="2" width="10" height="1" fill="#9E6B52"/>
      <rect x="13" y="3" width="8" height="1" fill="#F6EFE4"/>
      <rect x="10" y="4" width="14" height="4" fill="#F2CDB6"/>
      <rect x="12" y="4" width="10" height="4" fill="#D9A689"/>
      <rect x="11" y="8" width="12" height="1" fill="#6E4735"/>
      <rect x="14" y="9" width="6" height="4" fill="#D9A689"/>
      <rect x="20" y="13" width="4" height="2" fill="#D9B468"/>
      <rect x="23" y="15" width="6" height="6" fill="#9C7A32"/>
      <rect x="24" y="16" width="4" height="4" fill="#F4DC9B"/>
      <rect x="9" y="14" width="16" height="2" fill="#F6EFE4"/>
      <rect x="7" y="16" width="20" height="20" fill="#D9A689"/>
      <rect x="7" y="16" width="2" height="19" fill="#FFFFFF"/>
      <rect x="10" y="17" width="14" height="17" fill="#F3DFD0"/>
      <rect x="11" y="18" width="3" height="15" fill="#FFF6F0"/>
      <rect x="16" y="20" width="2" height="1" fill="#B38740"/>
      <rect x="16" y="23" width="2" height="1" fill="#D9B468"/>
      <rect x="16" y="26" width="2" height="1" fill="#B38740"/>
      <rect x="16" y="29" width="2" height="1" fill="#D9B468"/>
      <rect x="8" y="36" width="18" height="2" fill="#F6EFE4"/>
    </svg>`,

  estucheAzul: (size = 110) => `
    <svg class="pixel-svg" width="${Math.round(size * 0.76)}" height="${size}" viewBox="0 0 28 38" shape-rendering="crispEdges">
      <rect x="12" y="1" width="4" height="3" fill="#1D3160"/>
      <rect x="4" y="4" width="3" height="32" fill="#091126"/>
      <rect x="7" y="4" width="18" height="32" fill="#16264C"/>
      <rect x="8" y="6" width="4" height="1" fill="#D9B468"/>
      <rect x="20" y="6" width="4" height="1" fill="#D9B468"/>
      <rect x="9" y="18" width="14" height="3" fill="#F4DC9B"/>
      <rect x="8" y="33" width="4" height="1" fill="#D9B468"/>
      <rect x="20" y="33" width="4" height="1" fill="#D9B468"/>
    </svg>`,

  serpientePerfumeIcono: (size = 112) => `
    <svg class="pixel-svg" width="${size}" height="${size}" viewBox="0 0 36 28" shape-rendering="crispEdges">
      <rect x="1" y="18" width="2" height="1" fill="#46B88F"/>
      <rect x="3" y="17" width="3" height="2" fill="#52C79F"/>
      <rect x="6" y="16" width="4" height="3" fill="#68D3B0"/>
      <rect x="8" y="12" width="3" height="5" fill="#52C79F"/>
      <rect x="10" y="11" width="6" height="3" fill="#68D3B0"/>
      <rect x="11" y="12" width="4" height="1" fill="#F4DFAC"/>
      <rect x="16" y="10" width="5" height="5" fill="#9CF0D2"/>
      <rect x="21" y="11" width="2" height="3" fill="#9CF0D2"/>
      <rect x="18" y="10" width="2" height="1" fill="#F4DFAC"/>
      <rect x="19" y="10" width="1" height="1" fill="#0B1917"/>
      <rect x="18" y="14" width="2" height="1" fill="#F4DFAC"/>
      <rect x="19" y="14" width="1" height="1" fill="#0B1917"/>
      <rect x="23" y="12" width="2" height="1" fill="#FF5C72"/>
      <rect x="25" y="11" width="1" height="1" fill="#FF5C72"/>
      <rect x="25" y="13" width="1" height="1" fill="#FF5C72"/>
      <rect x="28" y="8" width="4" height="2" fill="#F2CDB6"/>
      <rect x="29" y="10" width="2" height="2" fill="#D9A689"/>
      <rect x="27" y="12" width="6" height="8" fill="#D9A689"/>
      <rect x="28" y="13" width="4" height="6" fill="#F3DFD0"/>
      <rect x="32" y="13" width="2" height="2" fill="#F4DC9B"/>
    </svg>`,

  medallonQM: (size = 72) => `
    <svg class="pixel-svg" width="${size}" height="${size}" viewBox="0 0 20 20" shape-rendering="crispEdges">
      <rect x="8" y="1" width="4" height="2" fill="#D9B468"/>
      <rect x="5" y="4" width="10" height="12" fill="#9C7A32"/>
      <rect x="4" y="6" width="12" height="8" fill="#9C7A32"/>
      <rect x="6" y="5" width="8" height="10" fill="#F4DC9B"/>
      <rect x="7" y="8" width="2" height="4" fill="#6E5219"/>
      <rect x="11" y="8" width="2" height="4" fill="#6E5219"/>
    </svg>`,

  coronaDorada: (size = 72) => `
    <svg class="pixel-svg" width="${size}" height="${size}" viewBox="0 0 20 20" shape-rendering="crispEdges">
      <rect x="3" y="6" width="2" height="8" fill="#F4DC9B"/>
      <rect x="9" y="4" width="2" height="10" fill="#F4DC9B"/>
      <rect x="15" y="6" width="2" height="8" fill="#F4DC9B"/>
      <rect x="5" y="9" width="10" height="5" fill="#D9B468"/>
      <rect x="3" y="14" width="14" height="3" fill="#9C7A32"/>
      <rect x="9" y="11" width="2" height="2" fill="#E07A9B"/>
    </svg>`,

  diamantePixel: (size = 72) => `
    <svg class="pixel-svg" width="${size}" height="${size}" viewBox="0 0 20 20" shape-rendering="crispEdges">
      <rect x="6" y="3" width="8" height="3" fill="#B5F3FF"/>
      <rect x="4" y="6" width="12" height="4" fill="#6ADCF0"/>
      <rect x="6" y="10" width="8" height="4" fill="#38B6D4"/>
      <rect x="8" y="14" width="4" height="3" fill="#2389A3"/>
      <rect x="6" y="6" width="3" height="2" fill="#FFFFFF"/>
    </svg>`,

  dianaReflejos: (size = 96) => `
    <svg class="pixel-svg" width="${size}" height="${size}" viewBox="0 0 24 24" shape-rendering="crispEdges">
      <rect x="11" y="1" width="2" height="22" fill="#6ADCF0"/>
      <rect x="1" y="11" width="22" height="2" fill="#6ADCF0"/>
      <rect x="5" y="5" width="14" height="14" fill="#132B3D"/>
      <rect x="6" y="6" width="12" height="12" fill="#6ADCF0"/>
      <rect x="8" y="8" width="8" height="8" fill="#F4DC9B"/>
      <rect x="10" y="10" width="4" height="4" fill="#FFFFFF"/>
    </svg>`
};

// ==================== DATOS DE LOS 4 MINIJUEGOS ====================
const JUEGOS = [
  {
    id: 'snake',
    numero: '01',
    categoria: 'ARCADE · SERPIENTE',
    titulo: 'Juego de Serpiente',
    descripcion: 'Guía a la serpiente pixelada por el tablero para comer los frascos de perfume CITLALLI y superar el récord.',
    icono: () => SPRITES.serpientePerfumeIcono(116)
  },
  {
    id: 'flappy',
    numero: '02',
    categoria: 'ACCIÓN · VUELO',
    titulo: 'Flappy Bird',
    descripcion: 'El frasco de perfume CITLALLI vuela y rocía una nube de perfume cada vez que salta entre las columnas.',
    icono: () => SPRITES.frascoCitlalli(110, true)
  },
  {
    id: 'memorama',
    numero: '03',
    categoria: 'MEMORIA · 5 PARES',
    titulo: 'Memorama',
    descripcion: 'Voltea las cartas y encuentra los 5 pares de la colección atelier en el menor número de intentos.',
    icono: () => SPRITES.medallonQM(98)
  },
  {
    id: 'reflejos',
    numero: '04',
    categoria: 'RAPIDEZ · PUNTERÍA',
    titulo: 'Reflejos',
    descripcion: 'Pon a prueba tu velocidad haciendo clic en cada objetivo antes de que cambie de posición contra reloj en 20s.',
    icono: () => SPRITES.dianaReflejos(98)
  }
];

// ==================== 5 MAPAS MESOAMERICANOS CITLALLI ====================
const MAPAS_MESOAMERICA = {
  selva: {
    id: 'selva',
    nombre: 'Selva de Jade',
    icono: '🌿',
    subtitulo: 'MESOAMÉRICA · SELVA SAGRADA',
    desc: 'Árboles sagrados de Ceiba, orquídeas y lianas donde brota el rocío de Citlalli.',
    bgSky: '#0B1D16',
    bgBoard: '#122E23',
    border: '#48C78E',
    accent: '#8EF0BA',
    secondary: '#D9B468',
    gridLine: '#1B4738',
    pipeName: 'Troncos de Ceiba milenaria con lianas y musgo'
  },
  piramide: {
    id: 'piramide',
    nombre: 'Pirámide Solar',
    icono: '🏛️',
    subtitulo: 'MESOAMÉRICA · TEMPLO DEL SOL',
    desc: 'Templos piramidales de piedra labrada bañados por el oro del sol y copal sagrado.',
    bgSky: '#2B1115',
    bgBoard: '#3D1A1F',
    border: '#D9B468',
    accent: '#F4DFAC',
    secondary: '#E86F51',
    gridLine: '#5E2E35',
    pipeName: 'Columnas de piedra labrada con relieves y grecas'
  },
  espacio: {
    id: 'espacio',
    nombre: 'Espacio Citlalli',
    icono: '🌌',
    subtitulo: 'MESOAMÉRICA · CITLALLI CÓSMICO',
    desc: 'Citlalli (estrella en náhuatl), constelaciones mesoamericanas y polvo astral.',
    bgSky: '#090F24',
    bgBoard: '#141C3B',
    border: '#7B68EE',
    accent: '#C7B8EA',
    secondary: '#F4DFAC',
    gridLine: '#272E63',
    pipeName: 'Obeliscos de cristal estelar con energía cósmica'
  },
  maizal: {
    id: 'maizal',
    nombre: 'Maizal Sagrado',
    icono: '🌽',
    subtitulo: 'MESOAMÉRICA · MILPA DE TONACAYÓTL',
    desc: 'Campos sagrados de maíz dorado bajo un cálido atardecer, cuna de vida y perfume.',
    bgSky: '#261A0C',
    bgBoard: '#3B2A15',
    border: '#E0A838',
    accent: '#F5D66E',
    secondary: '#8CB83E',
    gridLine: '#5C411D',
    pipeName: 'Atados de cañaverales con mazorcas de maíz dorado'
  },
  cenote: {
    id: 'cenote',
    nombre: 'Cenote Sagrado',
    icono: '💧',
    subtitulo: 'MESOAMÉRICA · AGUAS DE CHAAC',
    desc: 'Aguas cristalinas turquesas en cavernas místicas que purifican la esencia.',
    bgSky: '#071D24',
    bgBoard: '#0D2E38',
    border: '#48C2D6',
    accent: '#8CE5F5',
    secondary: '#F4DFAC',
    gridLine: '#174C5B',
    pipeName: 'Estalactitas y estalagmitas de piedra caliza con gotas'
  }
};

function generarBarraSelectoraMapasHTML(funcionNombre) {
  const activeCfg = MAPAS_MESOAMERICA[estado.mapaActual] || MAPAS_MESOAMERICA.selva;
  return `
    <div class="map-selector-bar">
      <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
        <span class="map-selector-label">🗺️ MAPA MESOAMÉRICA:</span>
        <div class="map-pills-row">
          ${Object.values(MAPAS_MESOAMERICA)
            .map(
              (m) => `
            <button class="map-pill ${m.id === estado.mapaActual ? 'active' : ''}" type="button" onclick="${funcionNombre}('${m.id}')">
              ${m.icono} ${m.nombre}
            </button>
          `
            )
            .join('')}
        </div>
      </div>
      <div class="map-desc-pill">
        <strong style="color:var(--gold-bright, #D4AF37)">${activeCfg.icono} ${activeCfg.subtitulo}:</strong> ${activeCfg.desc}
      </div>
    </div>
  `;
}

// ==================== ESTADO DEL ARCADE ====================
let storedUser = null;
try {
  const raw = localStorage.getItem(STORAGE_KEY_USER);
  if (raw) storedUser = JSON.parse(raw);
} catch (_e) {}

const estado = {
  vista: 'carrusel',
  username: (storedUser && storedUser.name) ? storedUser.name : 'FERNANDO',
  avatar: (storedUser && storedUser.avatar) ? storedUser.avatar : 'bottle',
  emoji: (storedUser && storedUser.emoji) ? storedUser.emoji : '🧴',
  mapaActual: 'selva',
  carruselIdx: 0,
  cleanupJuego: null,
  transicionando: false
};

// Elementos del DOM
const screenEl = document.getElementById('arcade-screen');
const fxLayer = document.getElementById('arcade-fx-layer');
const btnVolver = document.getElementById('btn-volver-menu');
const userTextEl = document.getElementById('user-indicator-text');
const userAvatarEl = document.getElementById('user-avatar-mini');

function actualizarPildoraUsuario() {
  if (userTextEl) userTextEl.textContent = `JUGADOR: ${estado.username.toUpperCase()}`;
  if (userAvatarEl) userAvatarEl.textContent = estado.emoji;
}

function lanzarDestellosTransicion() {
  if (!fxLayer) return;
  fxLayer.innerHTML = '';
  for (let i = 0; i < 16; i++) {
    const dot = document.createElement('span');
    dot.className = 'fx-mist-dot';
    dot.style.left = `${15 + Math.random() * 70}%`;
    dot.style.top = `${20 + Math.random() * 60}%`;
    dot.style.setProperty('--tx', `${(Math.random() - 0.5) * 140}px`);
    dot.style.setProperty('--ty', `${-30 - Math.random() * 90}px`);
    fxLayer.appendChild(dot);
  }
  setTimeout(() => {
    if (fxLayer) fxLayer.innerHTML = '';
  }, 700);
}

function cambiarVentanaConAnimacion(renderFn, modoLaunch = false) {
  if (estado.transicionando || !screenEl) return;
  estado.transicionando = true;
  lanzarDestellosTransicion();
  screenEl.classList.remove('anim-screen-enter', 'anim-screen-exit', 'anim-game-launch');
  screenEl.classList.add(modoLaunch ? 'anim-game-launch' : 'anim-screen-exit');

  setTimeout(() => {
    limpiarJuegoActivo();
    renderFn();
    screenEl.classList.remove('anim-screen-exit', 'anim-game-launch');
    void screenEl.offsetWidth;
    screenEl.classList.add('anim-screen-enter');
    estado.transicionando = false;
  }, 280);
}

function limpiarJuegoActivo() {
  if (typeof estado.cleanupJuego === 'function') {
    estado.cleanupJuego();
    estado.cleanupJuego = null;
  }
}

// Botón Volver al Menú
if (btnVolver) {
  btnVolver.addEventListener('click', () => {
    cambiarVentanaConAnimacion(() => renderCarrusel(), false);
  });
}

// ==================== MODAL DE RÉCORDS ====================
const backdropRecords = document.getElementById('records-backdrop');
const btnOpenRecords = document.getElementById('btn-open-records');
const btnTopbarRecords = document.getElementById('btn-topbar-records');
const btnCloseRecords = document.getElementById('btn-close-records');
const btnRefreshRecords = document.getElementById('btn-refresh-records');

async function renderizarModalRecords() {
  const container = document.getElementById('records-grid-container');
  if (!container) return;

  const data = await sincronizarConServidorRed();
  const configs = [
    { id: 'snake', titulo: '🐍 01 · Juego de Serpiente', unidad: 'pts', criterio: 'Mayor puntuación' },
    { id: 'flappy', titulo: '✨ 02 · Flappy Bird', unidad: 'pts', criterio: 'Mayor puntuación' },
    { id: 'memorama', titulo: '🃏 03 · Memorama', unidad: 'intentos', criterio: 'Menos intentos gana' },
    { id: 'reflejos', titulo: '🎯 04 · Reflejos', unidad: 'pts', criterio: 'Mayor puntuación' }
  ];

  container.innerHTML = configs
    .map((cfg) => {
      const lista = data[cfg.id] || [];
      const itemsHtml =
        lista.length === 0
          ? `<li class="record-item" style="opacity:0.7">Sin récords registrados aún. ¡Juega para ser el #1!</li>`
          : lista
              .slice(0, 6)
              .map((item, idx) => {
                const esCampeon = idx === 0;
                return `
                  <li class="record-item ${esCampeon ? 'is-champion' : ''}">
                    <span>
                      ${esCampeon ? '👑 #1' : `#${idx + 1}`} &nbsp;·&nbsp;
                      <strong>${item.username}</strong>
                      ${esCampeon ? `<span class="prize-tag">PREMIO</span>` : ''}
                    </span>
                    <strong>${item.valor} ${cfg.unidad}</strong>
                  </li>
                `;
              })
              .join('');

      return `
        <div class="record-game-box" data-g="${cfg.id}">
          <div class="record-game-title">
            <span>${cfg.titulo}</span>
            <small style="font-size:10px;opacity:0.8">${cfg.criterio}</small>
          </div>
          <ul class="record-list">${itemsHtml}</ul>
        </div>
      `;
    })
    .join('');
}

function abrirModalRecords() {
  if (backdropRecords) {
    backdropRecords.classList.add('open');
    renderizarModalRecords();
  }
}

function cerrarModalRecords() {
  if (backdropRecords) backdropRecords.classList.remove('open');
}

if (btnOpenRecords) btnOpenRecords.addEventListener('click', abrirModalRecords);
if (btnTopbarRecords) btnTopbarRecords.addEventListener('click', abrirModalRecords);
if (btnCloseRecords) btnCloseRecords.addEventListener('click', cerrarModalRecords);
if (btnRefreshRecords) btnRefreshRecords.addEventListener('click', renderizarModalRecords);
if (backdropRecords) {
  backdropRecords.addEventListener('click', (e) => {
    if (e.target === backdropRecords) cerrarModalRecords();
  });
}

// ==================== MODAL DE PERFIL / CAMBIO DE NOMBRE ====================
const backdropUser = document.getElementById('user-modal-backdrop');
const btnEditUser = document.getElementById('btn-edit-user');
const btnCloseUserModal = document.getElementById('btn-close-user-modal');
const formEditUser = document.getElementById('form-edit-user');
const inputEditUsername = document.getElementById('input-edit-username');
const avatarOptions = document.querySelectorAll('.avatar-option');

function abrirModalUsuario() {
  if (!backdropUser) return;
  if (inputEditUsername) inputEditUsername.value = estado.username;
  avatarOptions.forEach((btn) => {
    btn.classList.toggle('active', btn.getAttribute('data-avatar') === estado.avatar);
  });
  backdropUser.classList.add('open');
  if (inputEditUsername) inputEditUsername.focus();
}

function cerrarModalUsuario() {
  if (backdropUser) backdropUser.classList.remove('open');
}

if (btnEditUser) btnEditUser.addEventListener('click', abrirModalUsuario);
if (btnCloseUserModal) btnCloseUserModal.addEventListener('click', cerrarModalUsuario);
if (backdropUser) {
  backdropUser.addEventListener('click', (e) => {
    if (e.target === backdropUser) cerrarModalUsuario();
  });
}

avatarOptions.forEach((btn) => {
  btn.addEventListener('click', () => {
    avatarOptions.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    estado.avatar = btn.getAttribute('data-avatar') || 'bottle';
    estado.emoji = btn.getAttribute('data-emoji') || '🧴';
  });
});

if (formEditUser) {
  formEditUser.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = inputEditUsername?.value?.trim();
    if (val) {
      estado.username = val;
      actualizarPildoraUsuario();
      try {
        localStorage.setItem(
          STORAGE_KEY_USER,
          JSON.stringify({ name: estado.username, avatar: estado.avatar, emoji: estado.emoji })
        );
      } catch (_e) {}
      cerrarModalUsuario();
      mostrarNotificacionPuntaje(`Perfil actualizado: ${estado.username.toUpperCase()}`);
    }
  });
}

// ==================== CARRUSEL 3D (MENÚ PRINCIPAL) ====================
window.cambiarMapaGlobal = (mid) => {
  estado.mapaActual = mid;
  renderCarrusel();
};

function renderCarrusel() {
  estado.vista = 'carrusel';
  if (btnVolver) btnVolver.style.display = 'none';
  actualizarPildoraUsuario();

  screenEl.innerHTML = `
    <div class="carousel-header-text">
      <div class="eyebrow-tag">MENÚ PRINCIPAL · 4 MINIJUEGOS PIXEL ART</div>
      <h2>Selecciona tu Aventura</h2>
    </div>
    ${generarBarraSelectoraMapasHTML('window.cambiarMapaGlobal')}
    <div class="carousel-3d-viewport" id="carousel-stage"></div>
    <div class="carousel-nav">
      <button class="btn-pixel" id="c-prev" type="button">◀ Anterior</button>
      <span id="c-indicator">01 / 04</span>
      <button class="btn-pixel" id="c-next" type="button">Siguiente ▶</button>
    </div>
    <div style="margin-top:16px;font-size:12px;color:var(--text-muted);letter-spacing:0.1em;text-align:center">
      USA LAS FLECHAS ◀ ▶ Y HAZ DOBLE CLIC (O PULSA JUGAR) EN LA TARJETA CENTRAL
    </div>
  `;

  const stage = document.getElementById('carousel-stage');
  const ind = document.getElementById('c-indicator');

  function renderTarjetas() {
    if (!stage || !ind) return;
    stage.innerHTML = '';
    ind.textContent = `0${estado.carruselIdx + 1} / 04`;

    JUEGOS.forEach((j, idx) => {
      let offset = idx - estado.carruselIdx;
      if (offset > 2) offset -= 4;
      if (offset < -2) offset += 4;
      const dist = Math.abs(offset);
      const esCentro = offset === 0;

      const card = document.createElement('article');
      card.className = `c-card ${esCentro ? 'is-center' : ''}`;
      card.setAttribute('data-game', j.id);
      card.style.transform = `translateX(${offset * 68}%) translateZ(${-dist * 185}px) rotateY(${-offset * 17}deg) scale(${1 - dist * 0.14})`;
      card.style.opacity = dist <= 1 ? (esCentro ? '1' : '0.62') : '0';
      card.style.zIndex = String(10 - dist);
      card.style.pointerEvents = dist <= 1 ? 'auto' : 'none';

      card.innerHTML = `
        <div class="c-card-top">
          <strong>${j.numero}</strong>
          <span>${j.categoria}</span>
        </div>
        <div class="c-card-art">${j.icono()}</div>
        <div class="c-card-body">
          <h3>${j.titulo}</h3>
          <p>${j.descripcion}</p>
        </div>
        <div class="c-card-cta">
          <span>${esCentro ? '▶ JUGAR AHORA (O DOBLE CLIC)' : 'CLIC PARA SELECCIONAR'}</span>
          <span>▶</span>
        </div>
      `;

      card.addEventListener('click', () => {
        if (!esCentro) {
          estado.carruselIdx = idx;
          renderTarjetas();
        }
      });

      card.addEventListener('dblclick', () => {
        if (esCentro) seleccionarModoJuego(j.id);
      });

      card.querySelector('.c-card-cta')?.addEventListener('click', (ev) => {
        if (esCentro) {
          ev.stopPropagation();
          seleccionarModoJuego(j.id);
        }
      });

      stage.appendChild(card);
    });
  }

  const rotar = (dir) => {
    estado.carruselIdx = (estado.carruselIdx + dir + JUEGOS.length) % JUEGOS.length;
    renderTarjetas();
  };

  document.getElementById('c-prev')?.addEventListener('click', () => rotar(-1));
  document.getElementById('c-next')?.addEventListener('click', () => rotar(1));

  const keyHandler = (e) => {
    if (backdropRecords?.classList.contains('open') || backdropUser?.classList.contains('open')) return;
    if (e.key === 'ArrowLeft') rotar(-1);
    if (e.key === 'ArrowRight') rotar(1);
    if (e.key === 'Enter') seleccionarModoJuego(JUEGOS[estado.carruselIdx].id);
  };
  window.addEventListener('keydown', keyHandler);
  estado.cleanupJuego = () => window.removeEventListener('keydown', keyHandler);

  renderTarjetas();
}

function seleccionarModoJuego(id) {
  cambiarVentanaConAnimacion(() => {
    estado.vista = id;
    if (btnVolver) btnVolver.style.display = 'inline-block';
    if (id === 'snake') iniciarSnake();
    else if (id === 'flappy') iniciarFlappy();
    else if (id === 'memorama') iniciarMemorama();
    else iniciarReflejos();
  }, true);
}

// ==================== JUEGO 1: JUEGO DE SERPIENTE (SNAKE) ====================
window.cambiarMapaSnake = (mid) => {
  estado.mapaActual = mid;
  iniciarSnake();
};

function iniciarSnake() {
  const cfgMapa = MAPAS_MESOAMERICA[estado.mapaActual] || MAPAS_MESOAMERICA.selva;
  screenEl.innerHTML = `
    <div class="game-wrapper env-snake" style="border-color:${cfgMapa.border};background:${cfgMapa.bgSky}">
      <div class="game-hud">
        <span class="hud-title">🐍 01 · JUEGO DE SERPIENTE  |  ${cfgMapa.icono} ${cfgMapa.nombre.toUpperCase()}</span>
        <span class="hud-score" id="snake-score">PERFUMES: 0000</span>
        <button class="btn-pixel" id="snake-reset" type="button">↻ Reiniciar</button>
      </div>
      ${generarBarraSelectoraMapasHTML('window.cambiarMapaSnake')}
      <div class="game-canvas-box">
        <canvas class="pixel-board" id="snake-canvas" width="576" height="448" style="border-color:${cfgMapa.border};background:${cfgMapa.bgBoard}"></canvas>
      </div>
      <div class="dpad-row">
        <button class="btn-pixel" data-dir="L">◀</button>
        <button class="btn-pixel" data-dir="U">▲</button>
        <button class="btn-pixel" data-dir="D">▼</button>
        <button class="btn-pixel" data-dir="R">▶</button>
      </div>
    </div>
  `;

  const canvas = document.getElementById('snake-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const scoreEl = document.getElementById('snake-score');
  const COLS = 18, ROWS = 14, CW = 32, CH = 32;

  let snake = [
    { x: 8, y: 7 },
    { x: 7, y: 7 },
    { x: 6, y: 7 },
    { x: 5, y: 7 }
  ];
  let dir = { x: 1, y: 0 };
  let perfume = { x: 13, y: 7 };
  let sprayParticles = [];
  let score = 0;
  let tickCount = 0;
  let over = false;

  function setDir(nx, ny) {
    if (nx !== -dir.x || ny !== -dir.y) dir = { x: nx, y: ny };
  }

  function crearExplosionPerfume(px, py) {
    for (let i = 0; i < 12; i++) {
      sprayParticles.push({
        x: px,
        y: py,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        life: 7,
        color: i % 2 === 0 ? '#F4DFAC' : '#F2CDB6'
      });
    }
  }

  function dibujarFrascoPerfumeCanvas(gx, gy) {
    const x = gx * CW;
    const y = gy * CH;
    ctx.fillStyle = '#F2CDB6';
    ctx.fillRect(x + 10, y + 3, 12, 4);
    ctx.fillStyle = '#9E6B52';
    ctx.fillRect(x + 12, y + 7, 8, 3);
    ctx.fillStyle = '#DBA88B';
    ctx.fillRect(x + 6, y + 10, 20, 19);
    ctx.fillStyle = '#F7E7DA';
    ctx.fillRect(x + 9, y + 12, 14, 15);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x + 10, y + 13, 3, 12);
    ctx.fillStyle = '#F4DFAC';
    ctx.fillRect(x + 24, y + 12, 5, 5);
  }

  function dibujarSerpientePixelDelgada() {
    const G = 14;
    const half = G / 2;

    // 1. Capa de borde oscuro continuo
    ctx.fillStyle = '#081C18';
    for (let i = 0; i < snake.length; i++) {
      const cur = snake[i];
      const cx = cur.x * CW + 16;
      const cy = cur.y * CH + 16;
      const isTail = i === snake.length - 1;
      const r = isTail ? 5 : half + 2;
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

      if (i > 0) {
        const prev = snake[i - 1];
        const px = prev.x * CW + 16;
        const py = prev.y * CH + 16;
        const minX = Math.min(cx, px) - (isTail ? 5 : half + 2);
        const minY = Math.min(cy, py) - (isTail ? 5 : half + 2);
        const w = Math.abs(cx - px) + (isTail ? 10 : (half + 2) * 2);
        const h = Math.abs(cy - py) + (isTail ? 10 : (half + 2) * 2);
        ctx.fillRect(minX, minY, w, h);
      }
    }

    // 2. Capa interior de escamas esmeralda
    for (let i = snake.length - 1; i >= 1; i--) {
      const cur = snake[i];
      const prev = snake[i - 1];
      const cx = cur.x * CW + 16;
      const cy = cur.y * CH + 16;
      const px = prev.x * CW + 16;
      const py = prev.y * CH + 16;
      const isTail = i === snake.length - 1;
      const hIn = isTail ? 4 : half;

      ctx.fillStyle = i % 2 === 0 ? '#52C79F' : '#68D3B0';
      const minX = Math.min(cx, px) - hIn;
      const minY = Math.min(cy, py) - hIn;
      const w = Math.abs(cx - px) + hIn * 2;
      const h = Math.abs(cy - py) + hIn * 2;
      ctx.fillRect(minX, minY, w, h);

      if (isTail) {
        const tx = cur.x - prev.x;
        const ty = cur.y - prev.y;
        ctx.fillStyle = '#46B88F';
        ctx.fillRect(cx + tx * 5 - 3, cy + ty * 5 - 3, 6, 6);
        ctx.fillRect(cx + tx * 9 - 2, cy + ty * 9 - 2, 4, 4);
      } else {
        ctx.fillStyle = i % 2 === 0 ? '#A8F5DC' : '#F4DFAC';
        ctx.fillRect(cx - 2, cy - 2, 4, 4);
      }
    }

    // 3. Cabeza estilizada
    const head = snake[0];
    const hx = head.x * CW + 16;
    const hy = head.y * CH + 16;

    ctx.fillStyle = '#081C18';
    ctx.fillRect(hx - 10, hy - 10, 20, 20);
    ctx.fillStyle = '#82E8C4';
    ctx.fillRect(hx - 8, hy - 8, 16, 16);
    ctx.fillStyle = '#9CF0D2';
    ctx.fillRect(hx + dir.x * 5 - 6, hy + dir.y * 5 - 6, 12, 12);

    const perpX = -dir.y;
    const perpY = dir.x;
    const eye1X = hx + perpX * 5 - dir.x * 2;
    const eye1Y = hy + perpY * 5 - dir.y * 2;
    const eye2X = hx - perpX * 5 - dir.x * 2;
    const eye2Y = hy - perpY * 5 - dir.y * 2;

    ctx.fillStyle = '#F4DFAC';
    ctx.fillRect(eye1X - 2, eye1Y - 2, 4, 4);
    ctx.fillRect(eye2X - 2, eye2Y - 2, 4, 4);
    ctx.fillStyle = '#081C18';
    ctx.fillRect(eye1X - 1, eye1Y - 1, 2, 2);
    ctx.fillRect(eye2X - 1, eye2Y - 1, 2, 2);

    if (tickCount % 3 !== 0) {
      const tx = hx + dir.x * 12;
      const ty = hy + dir.y * 12;
      ctx.fillStyle = '#FF5C72';
      ctx.fillRect(tx - 1, ty - 1, 3, 3);
      ctx.fillRect(tx + dir.x * 3 + perpX * 2 - 1, ty + dir.y * 3 + perpY * 2 - 1, 2, 2);
      ctx.fillRect(tx + dir.x * 3 - perpX * 2 - 1, ty + dir.y * 3 - perpY * 2 - 1, 2, 2);
    }
  }

  function step() {
    if (over) return;
    tickCount++;
    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
    if (
      head.x < 0 ||
      head.x >= COLS ||
      head.y < 0 ||
      head.y >= ROWS ||
      snake.some((s) => s.x === head.x && s.y === head.y)
    ) {
      over = true;
      if (score > 0) registrarRecordJugador('snake', score);
      draw();
      return;
    }
    snake.unshift(head);
    if (head.x === perfume.x && head.y === perfume.y) {
      score += 100;
      if (scoreEl) scoreEl.textContent = `PERFUMES: ${String(score).padStart(4, '0')}`;
      registrarRecordJugador('snake', score);
      crearExplosionPerfume(perfume.x * CW + 16, perfume.y * CH + 16);
      do {
        perfume = {
          x: Math.floor(Math.random() * COLS),
          y: Math.floor(Math.random() * ROWS)
        };
      } while (snake.some((s) => s.x === perfume.x && s.y === perfume.y));
    } else {
      snake.pop();
    }
    draw();
  }

  function draw() {
    const cfg = MAPAS_MESOAMERICA[estado.mapaActual] || MAPAS_MESOAMERICA.selva;
    ctx.fillStyle = cfg.bgBoard;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = cfg.gridLine || 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1;
    for (let c = 0; c <= COLS; c++) {
      ctx.beginPath();
      ctx.moveTo(c * CW, 0);
      ctx.lineTo(c * CW, 448);
      ctx.stroke();
    }
    for (let r = 0; r <= ROWS; r++) {
      ctx.beginPath();
      ctx.moveTo(0, r * CH);
      ctx.lineTo(576, r * CH);
      ctx.stroke();
    }

    dibujarFrascoPerfumeCanvas(perfume.x, perfume.y);
    dibujarSerpientePixelDelgada();

    sprayParticles.forEach((sp) => {
      ctx.fillStyle = sp.color;
      ctx.fillRect(sp.x, sp.y, 5, 5);
      sp.x += sp.vx;
      sp.y += sp.vy;
      sp.life--;
    });
    sprayParticles = sprayParticles.filter((sp) => sp.life > 0);

    if (over) {
      ctx.fillStyle = 'rgba(11, 25, 23, 0.94)';
      ctx.fillRect(108, 150, 360, 145);
      ctx.strokeStyle = cfg.border;
      ctx.lineWidth = 3;
      ctx.strokeRect(108, 150, 360, 145);
      ctx.fillStyle = cfg.accent;
      ctx.font = 'bold 20px Consolas, monospace';
      ctx.textAlign = 'center';
      ctx.fillText('FIN DE LA PARTIDA', 288, 200);
      ctx.fillStyle = cfg.secondary;
      ctx.font = '16px Consolas, monospace';
      ctx.fillText(`Récord guardado: ${score} pts`, 288, 235);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText('Pulsa Reiniciar para jugar otra vez', 288, 265);
    }
  }

  const timer = setInterval(step, 125);
  const onKey = (e) => {
    const map = {
      ArrowUp: [0, -1], w: [0, -1], W: [0, -1],
      ArrowDown: [0, 1], s: [0, 1], S: [0, 1],
      ArrowLeft: [-1, 0], a: [-1, 0], A: [-1, 0],
      ArrowRight: [1, 0], d: [1, 0], D: [1, 0]
    };
    if (map[e.key]) {
      e.preventDefault();
      setDir(map[e.key][0], map[e.key][1]);
    }
  };
  window.addEventListener('keydown', onKey);

  document.querySelectorAll('[data-dir]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const d = btn.getAttribute('data-dir');
      if (d === 'U') setDir(0, -1);
      if (d === 'D') setDir(0, 1);
      if (d === 'L') setDir(-1, 0);
      if (d === 'R') setDir(1, 0);
    });
  });

  document.getElementById('snake-reset')?.addEventListener('click', () => {
    snake = [
      { x: 8, y: 7 },
      { x: 7, y: 7 },
      { x: 6, y: 7 },
      { x: 5, y: 7 }
    ];
    dir = { x: 1, y: 0 };
    score = 0;
    over = false;
    if (scoreEl) scoreEl.textContent = 'PERFUMES: 0000';
    draw();
  });

  draw();
  estado.cleanupJuego = () => {
    clearInterval(timer);
    window.removeEventListener('keydown', onKey);
  };
}

// ==================== JUEGO 2: FLAPPY BIRD ====================
window.cambiarMapaFlappy = (mid) => {
  estado.mapaActual = mid;
  iniciarFlappy();
};

function iniciarFlappy() {
  const cfgMapa = MAPAS_MESOAMERICA[estado.mapaActual] || MAPAS_MESOAMERICA.selva;
  screenEl.innerHTML = `
    <div class="game-wrapper env-flappy" style="border-color:${cfgMapa.border};background:${cfgMapa.bgSky}">
      <div class="game-hud">
        <span class="hud-title">✨ 02 · FLAPPY BIRD (PERFUME CITLALLI)  |  ${cfgMapa.icono} ${cfgMapa.nombre.toUpperCase()}</span>
        <span class="hud-score" id="flappy-score">PUNTOS: 00</span>
        <button class="btn-pixel" id="flappy-reset" type="button">↻ Reiniciar</button>
      </div>
      ${generarBarraSelectoraMapasHTML('window.cambiarMapaFlappy')}
      <div class="game-canvas-box">
        <canvas class="pixel-board" id="flappy-canvas" width="620" height="410" style="border-color:${cfgMapa.border};background:${cfgMapa.bgBoard}"></canvas>
      </div>
      <div style="text-align:center;margin-top:12px;font-size:13px;color:var(--text-main,#F6EFE6);letter-spacing:0.08em">
        HAZ CLIC O PULSA ESPACIO PARA SALTAR Y ROCIAR PERFUME  |  ESQUIVA: <strong style="color:${cfgMapa.border}">${cfgMapa.pipeName}</strong>
      </div>
    </div>
  `;

  const canvas = document.getElementById('flappy-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const scoreEl = document.getElementById('flappy-score');

  let y = 195, vy = 0, score = 0, playing = false, over = false;
  let sprayTimer = 0;
  let mistPuffs = [];
  let pipes = [{ x: 470, gapY: 195, passed: false }];

  function emitirSprayPerfume() {
    sprayTimer = 10;
    for (let i = 0; i < 14; i++) {
      mistPuffs.push({
        x: 132 - Math.random() * 14,
        y: y - 16 + (Math.random() - 0.5) * 14,
        vx: -2.4 - Math.random() * 3.2,
        vy: (Math.random() - 0.5) * 2.8,
        size: 4 + Math.floor(Math.random() * 5),
        alpha: 1.0,
        color: i % 3 === 0 ? '#FFFFFF' : i % 2 === 0 ? '#F4DFAC' : '#F2CDB6'
      });
    }
  }

  function jump() {
    if (over) {
      y = 195; vy = 0; score = 0; playing = false; over = false;
      mistPuffs = [];
      pipes = [{ x: 470, gapY: 195, passed: false }];
      if (scoreEl) scoreEl.textContent = 'PUNTOS: 00';
      return;
    }
    playing = true;
    vy = -6.4;
    emitirSprayPerfume();
  }

  function dibujarFondoFlappy() {
    const map = estado.mapaActual;
    const cfg = MAPAS_MESOAMERICA[map] || MAPAS_MESOAMERICA.selva;
    ctx.fillStyle = cfg.bgSky;
    ctx.fillRect(0, 0, 620, 410);

    if (map === 'selva') {
      for (let bx = 0; bx < 620; bx += 80) {
        ctx.fillStyle = '#0F281E';
        ctx.fillRect(bx, 330, 65, 80);
        ctx.fillStyle = '#143D2E';
        ctx.fillRect(bx + 10, 290, 45, 50);
      }
      ctx.fillStyle = 'rgba(110, 240, 186, 0.12)';
      ctx.fillRect(40, 30, 160, 22);
      ctx.fillRect(360, 50, 180, 26);
    } else if (map === 'piramide') {
      const cx = 310;
      const steps = [
        [cx - 220, cx + 220, 370, 410],
        [cx - 170, cx + 170, 330, 370],
        [cx - 120, cx + 120, 290, 330],
        [cx - 75, cx + 75, 250, 290],
        [cx - 40, cx + 40, 220, 250]
      ];
      ctx.fillStyle = '#381419';
      steps.forEach(([x1, x2, y1, y2]) => {
        ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
      });
      ctx.fillStyle = 'rgba(244, 223, 172, 0.18)';
      ctx.fillRect(cx - 35, 212, 70, 8);
      ctx.fillStyle = '#E86F51';
      ctx.fillRect(cx - 15, 204, 30, 8);
    } else if (map === 'espacio') {
      ctx.fillStyle = 'rgba(123, 104, 238, 0.16)';
      ctx.fillRect(100, 40, 420, 200);

      const stars = [
        [35, 40, 3, '#F4DFAC'], [110, 70, 2, '#FFFFFF'], [190, 30, 4, '#F4DFAC'],
        [290, 80, 2, '#C7B8EA'], [420, 35, 3, '#FFFFFF'], [530, 65, 4, '#F4DFAC'],
        [70, 160, 2, '#C7B8EA'], [260, 190, 3, '#FFFFFF'], [460, 170, 2, '#F4DFAC'],
        [140, 280, 3, '#FFFFFF'], [380, 300, 4, '#F4DFAC'], [540, 280, 2, '#C7B8EA']
      ];
      stars.forEach(([sx, sy, sz, sc]) => {
        ctx.fillStyle = sc;
        ctx.fillRect(sx, sy, sz, sz);
      });
    } else if (map === 'maizal') {
      ctx.fillStyle = '#D9822B';
      ctx.beginPath();
      ctx.arc(480, 70, 36, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#33210C';
      ctx.fillRect(0, 340, 620, 70);
      for (let mx = 10; mx < 620; mx += 26) {
        ctx.fillStyle = '#638428';
        ctx.fillRect(mx, 305, 5, 35);
        ctx.fillStyle = '#E0A838';
        ctx.fillRect(mx - 3, 290, 11, 16);
      }
    } else {
      ctx.fillStyle = '#05131A';
      ctx.beginPath();
      ctx.moveTo(0, 0); ctx.lineTo(160, 0); ctx.lineTo(100, 50); ctx.lineTo(0, 60);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(620, 0); ctx.lineTo(460, 0); ctx.lineTo(520, 60); ctx.lineTo(620, 70);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = 'rgba(106, 220, 240, 0.15)';
      ctx.beginPath();
      ctx.moveTo(240, 0); ctx.lineTo(380, 0); ctx.lineTo(440, 360); ctx.lineTo(180, 360);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#0A262E';
      ctx.fillRect(0, 365, 620, 45);
      ctx.fillStyle = '#48C2D6';
      ctx.fillRect(0, 365, 620, 3);
    }
  }

  function dibujarColumnaFlappyTematica(pipe) {
    const map = estado.mapaActual;
    const x = pipe.x;
    const gapY = pipe.gapY;
    const gapHalf = 66;
    const yTop = gapY - gapHalf;
    const yBottom = gapY + gapHalf;
    const w = 54;

    if (map === 'selva') {
      ctx.fillStyle = '#382619';
      ctx.fillRect(x, 0, w, yTop);
      ctx.strokeStyle = '#22150C';
      ctx.lineWidth = 3;
      ctx.strokeRect(x, 0, w, yTop);

      ctx.fillStyle = '#2A1B11';
      ctx.fillRect(x - 5, yTop - 18, w + 10, 18);
      ctx.fillStyle = '#48C78E';
      ctx.fillRect(x - 5, yTop - 4, w + 10, 4);

      ctx.fillStyle = '#382619';
      ctx.fillRect(x, yBottom, w, 410 - yBottom);
      ctx.strokeRect(x, yBottom, w, 410 - yBottom);

      ctx.fillStyle = '#2A1B11';
      ctx.fillRect(x - 5, yBottom, w + 10, 18);
      ctx.fillStyle = '#48C78E';
      ctx.fillRect(x - 5, yBottom, w + 10, 4);
    } else if (map === 'piramide') {
      ctx.fillStyle = '#4A4335';
      ctx.fillRect(x, 0, w, yTop);
      ctx.strokeStyle = '#2B261D';
      ctx.lineWidth = 3;
      ctx.strokeRect(x, 0, w, yTop);

      ctx.fillStyle = '#615846';
      ctx.fillRect(x - 6, yTop - 20, w + 12, 20);
      ctx.fillStyle = '#D9B468';
      ctx.fillRect(x - 4, yTop - 14, w + 8, 4);

      ctx.fillStyle = '#4A4335';
      ctx.fillRect(x, yBottom, w, 410 - yBottom);
      ctx.strokeRect(x, yBottom, w, 410 - yBottom);

      ctx.fillStyle = '#615846';
      ctx.fillRect(x - 6, yBottom, w + 12, 20);
      ctx.fillStyle = '#D9B468';
      ctx.fillRect(x - 4, yBottom + 10, w + 8, 4);
    } else if (map === 'espacio') {
      ctx.fillStyle = '#1E163B';
      ctx.fillRect(x + 2, 0, w - 4, yTop);
      ctx.strokeStyle = '#7B68EE';
      ctx.lineWidth = 2;
      ctx.strokeRect(x + 2, 0, w - 4, yTop);

      ctx.fillStyle = '#9C8CF5';
      ctx.fillRect(x + w / 2 - 5, 0, 10, yTop - 12);
      ctx.fillStyle = '#F4DFAC';
      ctx.fillRect(x + w / 2 - 4, yTop - 12, 8, 8);

      ctx.fillStyle = '#1E163B';
      ctx.fillRect(x + 2, yBottom, w - 4, 410 - yBottom);
      ctx.strokeRect(x + 2, yBottom, w - 4, 410 - yBottom);

      ctx.fillStyle = '#9C8CF5';
      ctx.fillRect(x + w / 2 - 5, yBottom + 12, 10, 410 - yBottom - 12);
      ctx.fillStyle = '#F4DFAC';
      ctx.fillRect(x + w / 2 - 4, yBottom + 4, 8, 8);
    } else if (map === 'maizal') {
      ctx.fillStyle = '#46601E';
      ctx.fillRect(x + 4, 0, w - 8, yTop);
      ctx.strokeStyle = '#28380F';
      ctx.lineWidth = 2;
      ctx.strokeRect(x + 4, 0, w - 8, yTop);

      ctx.fillStyle = '#E0A838';
      ctx.fillRect(x - 2, yTop - 24, w + 4, 24);

      ctx.fillStyle = '#46601E';
      ctx.fillRect(x + 4, yBottom, w - 8, 410 - yBottom);
      ctx.strokeRect(x + 4, yBottom, w - 8, 410 - yBottom);

      ctx.fillStyle = '#E0A838';
      ctx.fillRect(x - 2, yBottom, w + 4, 24);
    } else {
      ctx.fillStyle = '#1B3940';
      ctx.beginPath();
      ctx.moveTo(x, 0); ctx.lineTo(x + w, 0); ctx.lineTo(x + w / 2, yTop);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#6ADCF0';
      ctx.beginPath();
      ctx.arc(x + w / 2, yTop + 3, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#1B3940';
      ctx.beginPath();
      ctx.moveTo(x + w / 2, yBottom); ctx.lineTo(x + w, 410); ctx.lineTo(x, 410);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#6ADCF0';
      ctx.beginPath();
      ctx.arc(x + w / 2, yBottom - 3, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function tick() {
    if (playing && !over) {
      vy += 0.36;
      y += vy;
      if (sprayTimer > 0) sprayTimer--;

      pipes.forEach((p) => {
        p.x -= 3.3;
        if (!p.passed && p.x < 130) {
          p.passed = true;
          score++;
          if (scoreEl) scoreEl.textContent = `PUNTOS: ${String(score).padStart(2, '0')}`;
          registrarRecordJugador('flappy', score);
        }
      });
      if (pipes[0].x < -60) pipes.shift();
      if (pipes[pipes.length - 1].x < 340) {
        pipes.push({ x: 630, gapY: 105 + Math.random() * 200, passed: false });
      }
      if (y < 22 || y > 388) {
        over = true;
        if (score > 0) registrarRecordJugador('flappy', score);
      }
      pipes.forEach((p) => {
        if (p.x > 100 && p.x < 172 && (y < p.gapY - 64 || y > p.gapY + 64)) {
          over = true;
          if (score > 0) registrarRecordJugador('flappy', score);
        }
      });
    }

    dibujarFondoFlappy();

    pipes.forEach((p) => {
      dibujarColumnaFlappyTematica(p);
    });

    mistPuffs.forEach((m) => {
      m.x += m.vx;
      m.y += m.vy;
      m.alpha -= 0.045;
      ctx.globalAlpha = Math.max(0, m.alpha);
      ctx.fillStyle = m.color;
      ctx.fillRect(m.x, m.y, m.size, m.size);
    });
    ctx.globalAlpha = 1.0;
    mistPuffs = mistPuffs.filter((m) => m.alpha > 0);

    const bx = 128;
    const by = y;
    const pressOffset = sprayTimer > 0 ? 3 : 0;

    ctx.fillStyle = '#F2CDB6';
    ctx.fillRect(bx + 6, by - 22 + pressOffset, 18, 6);
    ctx.fillStyle = '#9E6B52';
    ctx.fillRect(bx + 9, by - 16 + pressOffset, 12, 4);

    if (sprayTimer > 0) {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(bx - 10, by - 21, 8, 3);
      ctx.fillStyle = '#F4DFAC';
      ctx.fillRect(bx - 18, by - 24, 6, 6);
    }

    ctx.fillStyle = '#DBA88B';
    ctx.fillRect(bx, by - 12, 30, 30);
    ctx.fillStyle = '#F7E7DA';
    ctx.fillRect(bx + 4, by - 9, 22, 24);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(bx + 6, by - 7, 4, 20);
    ctx.fillStyle = '#F4DFAC';
    ctx.fillRect(bx + 28, by - 6, 8, 8);

    const cfg = MAPAS_MESOAMERICA[estado.mapaActual] || MAPAS_MESOAMERICA.selva;
    if (!playing && !over) {
      ctx.fillStyle = 'rgba(10, 15, 25, 0.75)';
      ctx.fillRect(60, 330, 500, 42);
      ctx.strokeStyle = cfg.border;
      ctx.lineWidth = 2;
      ctx.strokeRect(60, 330, 500, 42);
      ctx.fillStyle = cfg.accent;
      ctx.font = 'bold 15px Consolas, monospace';
      ctx.textAlign = 'center';
      ctx.fillText('ESPACIO O CLIC PARA VOLAR Y ROCIAR PERFUME', 310, 357);
    } else if (over) {
      ctx.fillStyle = 'rgba(10, 15, 25, 0.94)';
      ctx.fillRect(140, 135, 340, 145);
      ctx.strokeStyle = cfg.border;
      ctx.lineWidth = 3;
      ctx.strokeRect(140, 135, 340, 145);
      ctx.fillStyle = cfg.accent;
      ctx.font = 'bold 20px Consolas, monospace';
      ctx.textAlign = 'center';
      ctx.fillText('FIN DEL VUELO CITLALLI', 310, 185);
      ctx.fillStyle = cfg.secondary;
      ctx.font = '16px Consolas, monospace';
      ctx.fillText(`Puntaje obtenido: ${score} pts`, 310, 222);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText('Clic o Espacio para reintentar', 310, 255);
    }
  }

  const timer = setInterval(tick, 28);
  canvas.addEventListener('click', jump);
  const onKey = (e) => {
    if (e.code === 'Space') {
      e.preventDefault();
      jump();
    }
  };
  window.addEventListener('keydown', onKey);
  document.getElementById('flappy-reset')?.addEventListener('click', () => {
    over = true;
    jump();
  });

  tick();
  estado.cleanupJuego = () => {
    clearInterval(timer);
    window.removeEventListener('keydown', onKey);
  };
}

// ==================== JUEGO 3: MEMORAMA ====================
window.cambiarMapaMemorama = (mid) => {
  estado.mapaActual = mid;
  iniciarMemorama();
};

function iniciarMemorama() {
  const cfgMapa = MAPAS_MESOAMERICA[estado.mapaActual] || MAPAS_MESOAMERICA.selva;
  const paresBase = [
    { id: 'frasco', nombre: 'FRASCO CITLALLI', svg: SPRITES.frascoCitlalli(72, false) },
    { id: 'estuche', nombre: 'ESTUCHE AZUL', svg: SPRITES.estucheAzul(72) },
    { id: 'qm', nombre: 'MEDALLÓN QM', svg: SPRITES.medallonQM(62) },
    { id: 'corona', nombre: 'CORONA DORADA', svg: SPRITES.coronaDorada(62) },
    { id: 'diamante', nombre: 'DIAMANTE PIXEL', svg: SPRITES.diamantePixel(62) }
  ];

  let cartas = [...paresBase, ...paresBase]
    .map((p, i) => ({ ...p, uid: i, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort);
  let abiertas = [];
  let resueltas = new Set();
  let intentos = 0;
  let bloqueado = false;

  screenEl.innerHTML = `
    <div class="game-wrapper env-memorama" style="border-color:${cfgMapa.border};background:${cfgMapa.bgSky}">
      <div class="game-hud">
        <span class="hud-title">🃏 03 · MEMORAMA  |  ${cfgMapa.icono} ${cfgMapa.nombre.toUpperCase()}</span>
        <span class="hud-score" id="memo-score">INTENTOS: 00</span>
        <button class="btn-pixel" id="memo-reset" type="button">↻ Mezclar Cartas</button>
      </div>
      ${generarBarraSelectoraMapasHTML('window.cambiarMapaMemorama')}
      <div class="memo-grid" id="memo-grid"></div>
    </div>
  `;

  const grid = document.getElementById('memo-grid');
  const scoreEl = document.getElementById('memo-score');

  function render() {
    if (!grid) return;
    grid.innerHTML = '';
    cartas.forEach((c, idx) => {
      const esAbierta = abiertas.includes(idx);
      const esResuelta = resueltas.has(idx);
      const btn = document.createElement('button');
      btn.className = `memo-tile ${esAbierta ? 'flipped' : ''} ${esResuelta ? 'matched' : ''}`;
      btn.style.borderColor = esResuelta ? '#48C78E' : cfgMapa.border;
      btn.style.background = esAbierta || esResuelta ? '#1B2A42' : cfgMapa.bgBoard;

      if (esAbierta || esResuelta) {
        btn.innerHTML = `${c.svg}<span style="color:#FFFFFF">${c.nombre}</span>`;
      } else {
        btn.innerHTML = `<strong style="color:${cfgMapa.secondary};font-size:14px">CITLALLI</strong><span style="color:${cfgMapa.accent};opacity:0.9;font-size:12px">${cfgMapa.icono} QM · PIXEL</span>`;
      }
      btn.addEventListener('click', () => voltear(idx));
      grid.appendChild(btn);
    });
  }

  function voltear(idx) {
    if (bloqueado || abiertas.includes(idx) || resueltas.has(idx)) return;
    abiertas.push(idx);
    render();
    if (abiertas.length === 2) {
      intentos++;
      if (scoreEl) scoreEl.textContent = `INTENTOS: ${String(intentos).padStart(2, '0')}`;
      const [a, b] = abiertas;
      if (cartas[a].id === cartas[b].id) {
        resueltas.add(a);
        resueltas.add(b);
        abiertas = [];
        lanzarDestellosTransicion();
        if (resueltas.size === 10) {
          registrarRecordJugador('memorama', intentos);
        }
        render();
      } else {
        bloqueado = true;
        setTimeout(() => {
          abiertas = [];
          bloqueado = false;
          render();
        }, 700);
      }
    }
  }

  document.getElementById('memo-reset')?.addEventListener('click', iniciarMemorama);
  render();
}

// ==================== JUEGO 4: REFLEJOS ====================
window.cambiarMapaReflejos = (mid) => {
  estado.mapaActual = mid;
  iniciarReflejos();
};

function iniciarReflejos() {
  const cfgMapa = MAPAS_MESOAMERICA[estado.mapaActual] || MAPAS_MESOAMERICA.selva;
  screenEl.innerHTML = `
    <div class="game-wrapper env-reflejos" style="border-color:${cfgMapa.border};background:${cfgMapa.bgSky}">
      <div class="game-hud">
        <span class="hud-title">🎯 04 · REFLEJOS  |  ${cfgMapa.icono} ${cfgMapa.nombre.toUpperCase()}</span>
        <span class="hud-score" id="reflex-hud">PUNTOS: 0000 | 20s</span>
        <button class="btn-pixel" id="reflex-reset" type="button">↻ Nueva Ronda</button>
      </div>
      ${generarBarraSelectoraMapasHTML('window.cambiarMapaReflejos')}
      <div class="game-canvas-box">
        <canvas class="pixel-board" id="reflex-canvas" width="620" height="400" style="border-color:${cfgMapa.border};background:${cfgMapa.bgBoard}"></canvas>
      </div>
    </div>
  `;

  const canvas = document.getElementById('reflex-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const hudEl = document.getElementById('reflex-hud');

  let tiempo = 20, puntos = 0;
  let target = { x: 310, y: 200, r: 32, color: cfgMapa.border };
  const colores = [cfgMapa.border, cfgMapa.accent, cfgMapa.secondary, '#FFFFFF'];

  function mover() {
    target = {
      x: 65 + Math.random() * 490,
      y: 65 + Math.random() * 270,
      r: 32,
      color: colores[Math.floor(Math.random() * colores.length)]
    };
    dibujar();
  }

  function dibujar() {
    const cfg = MAPAS_MESOAMERICA[estado.mapaActual] || MAPAS_MESOAMERICA.selva;
    ctx.fillStyle = cfg.bgBoard;
    ctx.fillRect(0, 0, 620, 400);
    if (hudEl) hudEl.textContent = `PUNTOS: ${String(puntos).padStart(4, '0')} | ${tiempo}s`;

    ctx.fillStyle = cfg.border;
    ctx.fillRect(0, 0, (tiempo / 20) * 620, 8);

    if (tiempo > 0) {
      ctx.strokeStyle = target.color;
      ctx.lineWidth = 3;
      ctx.strokeRect(target.x - 32, target.y - 32, 64, 64);
      ctx.fillStyle = target.color;
      ctx.fillRect(target.x - 16, target.y - 16, 32, 32);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(target.x - 6, target.y - 6, 10, 10);
    } else {
      ctx.fillStyle = 'rgba(8, 21, 31, 0.94)';
      ctx.fillRect(140, 135, 340, 135);
      ctx.strokeStyle = cfg.border;
      ctx.lineWidth = 3;
      ctx.strokeRect(140, 135, 340, 135);
      ctx.fillStyle = cfg.accent;
      ctx.font = 'bold 20px Consolas, monospace';
      ctx.textAlign = 'center';
      ctx.fillText('TIEMPO TERMINADO', 310, 188);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '16px Consolas, monospace';
      ctx.fillText(`Récord guardado: ${puntos} pts · Pulsa Nueva Ronda`, 310, 230);
    }
  }

  canvas.addEventListener('click', (e) => {
    if (tiempo <= 0) return;
    const rect = canvas.getBoundingClientRect();
    const sx = (e.clientX - rect.left) * (canvas.width / rect.width);
    const sy = (e.clientY - rect.top) * (canvas.height / rect.height);
    if (Math.abs(sx - target.x) <= 36 && Math.abs(sy - target.y) <= 36) {
      puntos += 100;
      registrarRecordJugador('reflejos', puntos);
      mover();
    }
  });

  const tReloj = setInterval(() => {
    if (tiempo > 0) {
      tiempo--;
      if (tiempo === 0 && puntos > 0) {
        registrarRecordJugador('reflejos', puntos);
      }
      dibujar();
    }
  }, 1000);

  const tMover = setInterval(() => {
    if (tiempo > 0) mover();
  }, 950);

  document.getElementById('reflex-reset')?.addEventListener('click', () => {
    tiempo = 20;
    puntos = 0;
    mover();
  });

  mover();
  estado.cleanupJuego = () => {
    clearInterval(tReloj);
    clearInterval(tMover);
  };
}

// ==================== INICIALIZACIÓN AL CARGAR LA PÁGINA ====================
function initArcade() {
  actualizarPildoraUsuario();
  renderCarrusel();
  sincronizarConServidorRed();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initArcade);
} else {
  initArcade();
}

export default {
  estado,
  renderCarrusel,
  seleccionarModoJuego,
  iniciarSnake,
  iniciarFlappy,
  iniciarMemorama,
  iniciarReflejos
};
