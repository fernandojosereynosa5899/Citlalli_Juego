/**
 * CITLALLI ("El Aroma de los Dioses") - Motor de Escenarios Pixel Art, Sprites y VFX
 * Archivo: src/engine/scenarios-vfx.js
 *
 * Provee:
 *  - SCENARIOS: Los 4 escenarios temáticos intercambiables en tiempo real.
 *  - LORE_ITEMS: Diccionario enciclopédico y olfativo de los 10 elementos de Citlalli.
 *  - citlalliVFX (y window.CitlalliVFX): Renderizador de fondos Parallax, diccionario
 *    de sprites Pixel Art pre-renderizados en offscreen canvas + carga desde
 *    /assets/pixel-art/sprites/, sistema de partículas, bruma oro rosa, textos
 *    flotantes y sacudida de pantalla (screen shake).
 */

export const SCENARIOS = [
  {
    id: 'hidalgo',
    name: 'Noche Estrellada en Hidalgo',
    shortName: 'Hidalgo Estelar',
    subtitle: 'El Árbol Ancestral de David y la Constelación Citlalli',
    lore: 'Inspirado en las noches tranquilas de Hidalgo, donde David descansaba bajo un gran árbol contemplando la inmensidad del cielo tras su jornada con el barro.',
    musicTrack: 'hidalgo',
    bgImage: '/assets/pixel-art/scenarios/scenario_hidalgo.png',
    palette: {
      skyTop: '#060B1A',
      skyMid: '#0F1E38',
      skyBottom: '#182E52',
      horizon: '#D4AF37',
      ground: '#08101E',
      accent: '#FFE885',
      secondary: '#E8A598'
    }
  },
  {
    id: 'jaguar',
    name: 'Santuario del Jaguar Dorado',
    shortName: 'Templo Jaguar',
    subtitle: 'Pirámide Prehispánica, Grecas y Braseros de Ámbar',
    lore: 'Evoca la fuerza mística del Jaguar Dorado y la herencia ancestral mexicana fusionada con resinas cálidas de ámbar y canela.',
    musicTrack: 'jaguar',
    bgImage: '/assets/pixel-art/scenarios/scenario_jaguar.png',
    palette: {
      skyTop: '#120A05',
      skyMid: '#26170B',
      skyBottom: '#3D2512',
      horizon: '#FF9800',
      ground: '#1A1108',
      accent: '#D4AF37',
      secondary: '#FFAB40'
    }
  },
  {
    id: 'velvet',
    name: 'Cámara Alquímica de Terciopelo',
    shortName: 'Cámara Terciopelo',
    subtitle: 'Terciopelo Azul Marino, Cuarzos y Destellos Oro Rosa',
    lore: 'El santuario interior del estuche Citlalli: terciopelo azul profundo donde reposa el frasco facetado junto al medallón QM y pétalos de rosa y jazmín.',
    musicTrack: 'velvet',
    bgImage: '/assets/pixel-art/scenarios/scenario_velvet.png',
    palette: {
      skyTop: '#091124',
      skyMid: '#132242',
      skyBottom: '#213561',
      horizon: '#E8A598',
      ground: '#0C162E',
      accent: '#E8A598',
      secondary: '#FFD1DC'
    }
  },
  {
    id: 'penthouse',
    name: 'Penthouse Nocturno Metropolitano',
    shortName: 'Penthouse Citlalli',
    subtitle: 'Horizonte de Rascacielos, Mármol Negro y Elegancia',
    lore: 'El dominio del Hombre Citlalli (25-40 años): exitoso, seguro de sí mismo y magnético. Donde la tradición se encuentra con la alta perfumería moderna.',
    musicTrack: 'penthouse',
    bgImage: '/assets/pixel-art/scenarios/scenario_penthouse.png',
    palette: {
      skyTop: '#05070F',
      skyMid: '#0D1426',
      skyBottom: '#16233E',
      horizon: '#D4AF37',
      ground: '#0A0C12',
      accent: '#D4AF37',
      secondary: '#82B1FF'
    }
  }
];

export const LORE_ITEMS = {
  bottle_citlalli: {
    id: 'bottle_citlalli',
    name: 'Frasco Facetado Citlalli',
    category: 'Reliquia Suprema',
    points: 100,
    color: '#E8A598',
    sprite: '/assets/pixel-art/sprites/bottle_citlalli.png',
    description: 'Cristal facetado con tapa cilíndrica oro rosa y el sello de los dioses (50 ml Eau de Parfum).'
  },
  charm_qm: {
    id: 'charm_qm',
    name: 'Medallón Dorado QM',
    category: 'Emblema de Lujo',
    points: 80,
    color: '#D4AF37',
    sprite: '/assets/pixel-art/sprites/charm_qm.png',
    description: 'Dije metálico redondo con el monograma QM que pende del cuello del frasco Citlalli.'
  },
  jaguar_gold: {
    id: 'jaguar_gold',
    name: 'Jaguar Dorado Prehispánico',
    category: 'Espíritu Guardián',
    points: 90,
    color: '#FFD54F',
    sprite: '/assets/pixel-art/sprites/jaguar_gold.png',
    description: 'Símbolo de poder, linaje y misterio nocturno en la cosmogonía prehispánica.'
  },
  star_citlalli: {
    id: 'star_citlalli',
    name: 'Estrella Celeste Citlalli',
    category: 'Luz del Cosmos',
    points: 75,
    color: '#FFE885',
    sprite: '/assets/pixel-art/sprites/star_citlalli.png',
    description: 'En náhuatl Citlalli significa "Estrella". Guía luminosa del lema: "El límite son las estrellas".'
  },
  mandarin: {
    id: 'mandarin',
    name: 'Mandarina Chispeante',
    category: 'Nota de Salida',
    points: 35,
    color: '#FF9800',
    sprite: '/assets/pixel-art/sprites/mandarin.png',
    description: 'Frescura cítrica luminosa que abre la experiencia olfativa con energía vibrante.'
  },
  rose_pink: {
    id: 'rose_pink',
    name: 'Rosa de Terciopelo',
    category: 'Nota de Corazón',
    points: 45,
    color: '#F48FB1',
    sprite: '/assets/pixel-art/sprites/rose_pink.png',
    description: 'Elegancia floral aterciopelada que aporta sofisticación y magnetismo en el corazón del perfume.'
  },
  jasmine_white: {
    id: 'jasmine_white',
    name: 'Jazmín Nocturno',
    category: 'Nota de Corazón',
    points: 45,
    color: '#FFFFFF',
    sprite: '/assets/pixel-art/sprites/jasmine_white.png',
    description: 'Flor blanca que florece bajo las estrellas, evocando pureza y misterio celestial.'
  },
  vanilla_pod: {
    id: 'vanilla_pod',
    name: 'Vainilla y Canela',
    category: 'Nota de Fondo',
    points: 55,
    color: '#8D6E63',
    sprite: '/assets/pixel-art/sprites/vanilla_pod.png',
    description: 'Acorde cálido y especiado que deja una estela seductora e inolvidable en la piel.'
  },
  amber_crystal: {
    id: 'amber_crystal',
    name: 'Resina de Ámbar Dorado',
    category: 'Nota de Fondo',
    points: 60,
    color: '#FFB300',
    sprite: '/assets/pixel-art/sprites/amber_crystal.png',
    description: 'Oro líquido ancestral que otorga fijación profunda, calidez solar y carácter divino.'
  },
  clay_vessel: {
    id: 'clay_vessel',
    name: 'Vasija de Barro de Hidalgo',
    category: 'Herencia de David',
    points: 65,
    color: '#A14A2A',
    sprite: '/assets/pixel-art/sprites/clay_vessel.png',
    description: 'Homenaje al oficio alfarero de David en Hidalgo: el origen humilde de un sueño estelar.'
  }
};

const PIXEL_PALETTE = {
  '.': null,
  G: '#D4AF37',
  Y: '#FFE885',
  D: '#997A15',
  R: '#E8A598',
  r: '#B86B5E',
  P: '#FFD1DC',
  N: '#0B1528',
  B: '#162A4A',
  C: '#64B5F6',
  L: '#B3E5FC',
  W: '#FFFFFF',
  O: '#FF9800',
  o: '#E65100',
  M: '#FFCC80',
  K: '#E91E63',
  k: '#AD1457',
  F: '#F48FB1',
  E: '#4CAF50',
  e: '#2E7D32',
  V: '#5D4037',
  v: '#8D6E63',
  T: '#A14A2A',
  t: '#6D2C15',
  S: '#37474F',
  s: '#263238',
  A: '#78909C',
  X: '#FF5252'
};

const SPRITE_MATRICES = {
  bottle_citlalli: [
    '.....RRRRRR.....',
    '....RPRRRRRr....',
    '....RRRRRRRR....',
    '.....rRRRRr.....',
    '......GGGGYY....',
    '....CCLLLLCCYY..',
    '...CWLCCCCLCC...',
    '..CWLLCCCCLLCC..',
    '..CWLGGYYGGLCC..',
    '..CWLGYWWYGLCC..',
    '..CWLGGYYGGLCC..',
    '..CCLLCCCCLLCC..',
    '..CCCLLLLLLCCC..',
    '...CCCCCCCCCC...',
    '....DDDDDDDD....',
    '....GGGGGGGG....'
  ],
  bottle_winged: [
    '.....RRRRRR.....',
    '.YY..RPRRRr..YY.',
    'YYYY..RRRR..YYYY',
    'YYGGY.GGGG.YGGYY',
    '.YGGGCCCCCCGGGY.',
    '..GGCWLLCCCCGG..',
    '.YYGCWLGGYGLCYY.',
    'YYYGCWLGYWYGLYYY',
    '.GGDCWLGGYGLCDG.',
    '..D.CCLLLLCC.D..',
    '.....CCCCCC.....',
    '....DDDDDDDD....',
    '....GGGGGGGG....',
    '................',
    '................',
    '................'
  ],
  charm_qm: [
    '......GGGG......',
    '....GGYYYYGG....',
    '...GYYDDDDYYG...',
    '..GYDDNNNNDDYG..',
    '.GYDNNYYYYNNDYG.',
    '.GYDNYN..NYNDYG.',
    'GYDNYN.YY.NYNDYG',
    'GYDNYN.YY.NYNDYG',
    'GYDNYN..Y.NYNDYG',
    'GYDNNYYYYYYNNDYG',
    '.GYDNN....NNDYG.',
    '.GYDDNNNNNNDDYG.',
    '..GYDDGGGGDDYG..',
    '...GYYGGGGYYG...',
    '....GGDDDDGG....',
    '......DDDD......'
  ],
  jaguar_gold: [
    '..GG........GG..',
    '.GYYG......GYYG.',
    '.GYDG.GGGG.GDYG.',
    '..GGGGYYYYGGGG..',
    '..GYYDYYYYDYYG..',
    '.GYYGGGGGGGGYYG.',
    '.GYGXXGGGGXXGYG.',
    'GYGGXXGYYGXXGGYG',
    'GYGGGGGGGGGGGGYG',
    'GYYGDDDDDDDDGYYG',
    '.GYGDWWGGWWDFYG.',
    '.GYYDGGGGGGDYYG.',
    '..GYYDDDDDDYYG..',
    '...GGYYYYYYGG...',
    '....DDDDDDDD....',
    '................'
  ],
  star_citlalli: [
    '.......YY.......',
    '.......YY.......',
    '..Y....GG....Y..',
    '...Y..GYYG..Y...',
    '....YGYYYYGY....',
    '.....GYYYYG.....',
    '....GYYWWYYG....',
    'YYGGGYYWWYYGGGYY',
    'YYGGGYYWWYYGGGYY',
    '....GYYWWYYG....',
    '.....GYYYYG.....',
    '....YGYYYYGY....',
    '...Y..GYYG..Y...',
    '..Y....GG....Y..',
    '.......YY.......',
    '.......YY.......'
  ],
  mandarin: [
    '.......EE.......',
    '......EEEE......',
    '....OOOOOOOO....',
    '..OOOMMMMMMOOO..',
    '.OOMMWOMMMOWMMO.',
    '.OMMWOOOMOOOWMO.',
    'OOMOOOOOMOOOOOMO',
    'OMWWWWWWWWWWWWMO',
    'OOMOOOOOMOOOOOMO',
    '.OMMWOOOMOOOWMO.',
    '.OOMMWOMMMOWMMO.',
    '..OOOMMMMMMOOO..',
    '...oooooooooo...',
    '.....oooooo.....',
    '................',
    '................'
  ],
  rose_pink: [
    '.....FFFFFF.....',
    '...FFKKKKKKFF...',
    '..FKKFFFFFFKKF..',
    '.FKKFFKKKKFFKKF.',
    '.FKFFKKkkkkFFKF.',
    'FKFFKkkFFFFkkFKF',
    'FKFKkkFFKKFFkFKF',
    'FKKkkFFKkkKFFKKF',
    '.FKKFFKKKKKKFKK.',
    '.FkkkkKKKKKKkkF.',
    '..EEkkkkkkkkEE..',
    '...EEEEkkEEEE...',
    '.....eeEEee.....',
    '.......EE.......',
    '.......ee.......',
    '......ee........'
  ],
  jasmine_white: [
    '......WWWW......',
    '.....WWWWWW.....',
    '.....WWLLWW.....',
    '.WWWW..LL..WWWW.',
    'WWWWWW.YY.WWWWWW',
    'WWLLWWGYYGWWLLWW',
    '.WWWW.YYYY.WWWW.',
    '.....GYYYYG.....',
    '..WWWW.YY.WWWW..',
    '.WWWWWW..WWWWWW.',
    '.WWLLWW..WWLLWW.',
    '..WWWW.EE.WWWW..',
    '.......EE.......',
    '......EEEE......',
    '.......ee.......',
    '................'
  ],
  vanilla_pod: [
    '............VV..',
    '...........VVV..',
    '...oooo...VVvV..',
    '..ooMMoo.VVvV...',
    '..oMvvMoVVvV....',
    '...ooooVVvV.....',
    '....ooVVvVoo....',
    '.....VVvVoooo...',
    '....VVvV.ooMMo..',
    '...VVvV..oMvvMo.',
    '..VVvV....oooo..',
    '.VVvV......YY...',
    '.VVV............',
    '.VV.............',
    '................',
    '................'
  ],
  amber_crystal: [
    '.......YY.......',
    '......YYYY......',
    '.....YYMMYY.....',
    '....YYMMMMYY....',
    '...YYMMWWMMYY...',
    '..OOMMWWWWMMOO..',
    '..OOMMMWWMMMOO..',
    '.OOOMMMMMMMMOOO.',
    '.OOOOMMMMMMOOOO.',
    '..OOOOMMMMOOOO..',
    '..ooooOOOOoooo..',
    '...ooooOOoooo...',
    '....oooooooo....',
    '.....oooooo.....',
    '......oooo......',
    '................'
  ],
  clay_vessel: [
    '....TTTTTTTT....',
    '...TvvvvvvvvT...',
    '....TTTTTTTT....',
    '.....TttttT.....',
    '...TTTGGGGTTT...',
    '..TTvvvvvvvvTT..',
    '.TTvTTTTTTTTvTT.',
    '.TTGGGGYYGGGGTT.',
    '.TTvTTTTTTTTvTT.',
    '.TTvvvvvvvvvvTT.',
    '..TTTTTTTTTTTT..',
    '..TTttttttttTT..',
    '...TTTttttTTT...',
    '....TTTTTTTT....',
    '.....tttttt.....',
    '................'
  ],
  snake_head_gold: [
    '.YY..........YY.',
    'YYYY..GGGG..YYYY',
    '.YYGGYYYYYYGGYY.',
    '..GGYYYYYYYYGG..',
    '.GYYYYDDDDYYYYG.',
    '.GYYGGGGGGGGYYG.',
    'GYYGLLGGGGLLGYYG',
    'GYYGLLGGGGLLGYYG',
    'GYYGGGGGGGGGGYYG',
    '.GYYYYGGGGYYYYG.',
    '.GGYYYYYYYYYYGG.',
    '..GGDDDDDDDDGG..',
    '...GGGGGGGGGG...',
    '......XXXX......',
    '.....XX..XX.....',
    '....XX....XX....'
  ],
  snake_head_rosegold: [
    '.PP..........PP.',
    'PPPP..RRRR..PPPP',
    '.PPrrRRRRRRrrPP.',
    '..rrRRRRRRRRrr..',
    '.rRRRRrrrrRRRRr.',
    '.rRRPPPPPPPPRRr.',
    'rRRPLLPPPPLLPRRr',
    'rRRPLLPPPPLLPRRr',
    'rRRPPPPPPPPPRRr.',
    '.rRRRRPPPPRRRRr.',
    '.rrRRRRRRRRRRrr.',
    '..rrrrrrrrrrrr..',
    '...RRRRRRRRRR...',
    '......YYYY......',
    '.....YY..YY.....',
    '....YY....YY....'
  ],
  smoke_hazard: [
    '.....AAAAAA.....',
    '...AASSSSSSAA...',
    '..ASSSSSSSSSSA..',
    '.ASSSssSSssSSSA.',
    '.ASSssXXXXssSSA.',
    'ASSSsXXssXXsSSSA',
    'ASSSSSSSSSSSSSSA',
    'ASSSssssssssSSSA',
    '.ASssssssssssSA.',
    '.AAssssssssssAA.',
    '..AASSSSSSSSAA..',
    '....AAAAAAAA....',
    '.....ss..ss.....',
    '....ss....ss....',
    '................',
    '................'
  ],
  card_back_velvet: [
    'GGGGGGGGGGGGGGGG',
    'GNNNNNNNNNNNNNNG',
    'GNBBBBBBBBBBBBNG',
    'GNBGGYYYYYYGGBNG',
    'GNBGYNNNNNNYGBNG',
    'GNBYN..YY..NYBNG',
    'GNBYN..YY..NYBNG',
    'GNBYNYYYYYYNYBNG',
    'GNBYNYYYYYYNYBNG',
    'GNBYN..YY..NYBNG',
    'GNBYN..YY..NYBNG',
    'GNBGYNNNNNNYGBNG',
    'GNBGGYYYYYYGGBNG',
    'GNBBBBBBBBBBBBNG',
    'GNNNNNNNNNNNNNNG',
    'GGGGGGGGGGGGGGGG'
  ]
};

const SPRITE_ALIASES = {
  bottle: 'bottle_citlalli',
  winged_bottle: 'bottle_winged',
  flappy_bottle: 'bottle_winged',
  charm: 'charm_qm',
  qm: 'charm_qm',
  jaguar: 'jaguar_gold',
  star: 'star_citlalli',
  rose: 'rose_pink',
  jasmine: 'jasmine_white',
  vanilla: 'vanilla_pod',
  amber: 'amber_crystal',
  vessel: 'clay_vessel',
  clay: 'clay_vessel',
  snake_gold: 'snake_head_gold',
  snake_rosegold: 'snake_head_rosegold',
  smoke: 'smoke_hazard',
  hazard: 'smoke_hazard',
  card_back: 'card_back_velvet'
};

class CitlalliVFXEngine {
  constructor() {
    this.spriteCanvases = {};
    this.spriteImages = {};
    this.scenarioImages = {};

    this.particles = [];
    this.floatingTexts = [];
    this.shootingStars = [];
    this.shakeTimeRemaining = 0;
    this.shakeDuration = 0;
    this.shakeIntensity = 0;

    // Estrellas de fondo deterministas para parallax suave
    this.starField = [];
    for (let i = 0; i < 68; i++) {
      this.starField.push({
        nx: ((i * 73 + 19) % 1000) / 1000,
        ny: ((i * 41 + 7) % 680) / 1000,
        size: (i % 3) + 1,
        phase: i * 0.75,
        speed: 0.12 + (i % 4) * 0.08,
        gold: i % 3 === 0
      });
    }

    if (typeof document !== 'undefined') {
      this._initSprites();
    }
  }

  _initSprites() {
    // 1. Pre-renderizar matrices 16x16 en offscreen canvas (64x64 crisp pixel art)
    const scale = 4;
    Object.keys(SPRITE_MATRICES).forEach((key) => {
      const grid = SPRITE_MATRICES[key];
      const canvas = document.createElement('canvas');
      canvas.width = 16 * scale;
      canvas.height = 16 * scale;
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = false;

      for (let y = 0; y < grid.length; y++) {
        const row = grid[y];
        for (let x = 0; x < row.length; x++) {
          const ch = row[x];
          const color = PIXEL_PALETTE[ch];
          if (color) {
            ctx.fillStyle = color;
            ctx.fillRect(x * scale, y * scale, scale, scale);
          }
        }
      }
      this.spriteCanvases[key] = canvas;

      // 2. Cargar también el PNG permanente desde /assets/pixel-art/sprites/
      if (typeof Image !== 'undefined') {
        const img = new Image();
        img.src = `/assets/pixel-art/sprites/${key}.png`;
        this.spriteImages[key] = img;
      }
    });

    // Cargar fondos PNG de escenarios como respaldo adicional
    if (typeof Image !== 'undefined') {
      SCENARIOS.forEach((sc) => {
        const img = new Image();
        img.src = sc.bgImage;
        this.scenarioImages[sc.id] = img;
      });
    }
  }

  resolveSpriteKey(key) {
    if (!key) return 'star_citlalli';
    if (SPRITE_MATRICES[key]) return key;
    if (SPRITE_ALIASES[key]) return SPRITE_ALIASES[key];
    return 'star_citlalli';
  }

  getSpriteCanvas(key) {
    const resolved = this.resolveSpriteKey(key);
    if (!this.spriteCanvases[resolved] && typeof document !== 'undefined') {
      this._initSprites();
    }
    return this.spriteCanvases[resolved] || null;
  }

  /**
   * Dibuja un sprite Pixel Art con soporte de rotación, volteo, brillo y opacidad.
   * Por defecto (options.centered = true), (x, y) es el centro del sprite.
   * Si options.centered === false, (x, y) es la esquina superior izquierda.
   */
  drawSprite(ctx, key, x, y, size = 32, options = {}) {
    if (!ctx) return;
    const resolved = this.resolveSpriteKey(key);
    const source =
      this.getSpriteCanvas(resolved) ||
      (this.spriteImages[resolved] && this.spriteImages[resolved].complete
        ? this.spriteImages[resolved]
        : null);

    if (!source) return;

    const {
      rotation = 0,
      flip = false,
      flipX = false,
      flipY = false,
      glow = false,
      glowColor = '#D4AF37',
      alpha = 1,
      centered = true
    } = options;

    ctx.save();
    ctx.imageSmoothingEnabled = false;
    if (alpha < 1) ctx.globalAlpha = Math.max(0, alpha);

    if (glow) {
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = 12;
    }

    const cx = centered ? x : x + size * 0.5;
    const cy = centered ? y : y + size * 0.5;

    ctx.translate(cx, cy);
    if (rotation) ctx.rotate(rotation);
    if (flip || flipX || flipY) {
      ctx.scale(flip || flipX ? -1 : 1, flipY ? -1 : 1);
    }

    ctx.drawImage(source, -size * 0.5, -size * 0.5, size, size);
    ctx.restore();
  }

  setScenario(scenarioId = 'hidalgo') {
    const found = SCENARIOS.find((s) => s.id === scenarioId);
    this.currentScenarioId = found ? found.id : 'hidalgo';
    return this.currentScenarioId;
  }

  /**
   * Renderiza cualquiera de los 4 escenarios Pixel Art con capas Parallax animadas,
   * estrellas parpadeantes, constelación de Citlalli y detalles arquitectónicos/naturales.
   */
  drawScenarioBackground(ctx, width, height, scenarioId = 'hidalgo', timeMs = 0, scrollOffset = 0) {
    if (!ctx) return;
    const sc = SCENARIOS.find((s) => s.id === scenarioId) || SCENARIOS[0];
    const t = (timeMs || (typeof performance !== 'undefined' ? performance.now() : Date.now())) * 0.001;

    ctx.save();
    ctx.imageSmoothingEnabled = false;

    // 1. Gradiente de Cielo Nocturno
    const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
    skyGrad.addColorStop(0, sc.palette.skyTop);
    skyGrad.addColorStop(0.6, sc.palette.skyMid);
    skyGrad.addColorStop(1, sc.palette.skyBottom);
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Campo de Estrellas Parallax y Constelación Citlalli
    for (let i = 0; i < this.starField.length; i++) {
      const st = this.starField[i];
      const sx = ((st.nx * width - scrollOffset * st.speed) % width + width) % width;
      const sy = st.ny * height;
      const twinkle = 0.45 + 0.55 * Math.sin(t * 2.4 + st.phase);
      ctx.fillStyle = st.gold
        ? `rgba(255, 232, 133, ${twinkle.toFixed(2)})`
        : `rgba(255, 255, 255, ${(twinkle * 0.85).toFixed(2)})`;
      const px = Math.floor(sx / 2) * 2;
      const py = Math.floor(sy / 2) * 2;
      ctx.fillRect(px, py, st.size * 2, st.size * 2);
    }

    // Constelación de la Estrella Citlalli de 8 puntas en el cielo superior derecho
    this._drawConstellation(ctx, width * 0.78, height * 0.22, t, sc.palette.accent);

    // 3. Capas específicas por escenario
    if (sc.id === 'hidalgo') {
      this._drawHidalgoLayers(ctx, width, height, t, scrollOffset);
    } else if (sc.id === 'jaguar') {
      this._drawJaguarLayers(ctx, width, height, t, scrollOffset);
    } else if (sc.id === 'velvet') {
      this._drawVelvetLayers(ctx, width, height, t, scrollOffset);
    } else if (sc.id === 'penthouse') {
      this._drawPenthouseLayers(ctx, width, height, t, scrollOffset);
    }

    ctx.restore();
  }

  _drawConstellation(ctx, cx, cy, t, accentColor) {
    const pts = [
      { x: -48, y: 14 },
      { x: -18, y: -12 },
      { x: 14, y: 6 },
      { x: 46, y: -18 },
      { x: 22, y: 28 }
    ];
    ctx.save();
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.24)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    pts.forEach((p, idx) => {
      if (idx === 0) ctx.moveTo(cx + p.x, cy + p.y);
      else ctx.lineTo(cx + p.x, cy + p.y);
    });
    ctx.stroke();

    pts.forEach((p, idx) => {
      const pulse = 2 + Math.sin(t * 3 + idx) * 1;
      ctx.fillStyle = accentColor || '#FFE885';
      ctx.fillRect(Math.floor(cx + p.x - pulse), Math.floor(cy + p.y - pulse), pulse * 2, pulse * 2);
    });
    ctx.restore();
  }

  _drawHidalgoLayers(ctx, w, h, t, scroll) {
    // Cerros lejanos de Hidalgo
    ctx.fillStyle = '#0B172B';
    for (let x = 0; x < w; x += 4) {
      const wx = x + scroll * 0.2;
      const hillY = h * 0.74 - Math.sin(wx * 0.008) * 28 - Math.cos(wx * 0.019) * 14;
      ctx.fillRect(x, Math.floor(hillY), 4, h - Math.floor(hillY));
    }

    // Silueta del Gran Árbol ancestral de David
    const treeX = Math.floor(w * 0.22);
    const groundY = Math.floor(h * 0.86);
    ctx.fillStyle = '#18100C';
    ctx.fillRect(treeX - 10, groundY - 95, 20, 95);
    ctx.fillRect(treeX - 18, groundY - 22, 36, 22);

    // Copa frondosa pixelada con destellos dorados
    ctx.fillStyle = '#0D212C';
    ctx.fillRect(treeX - 68, groundY - 145, 136, 56);
    ctx.fillRect(treeX - 52, groundY - 168, 104, 28);

    // Luciérnagas doradas flotando alrededor del árbol
    for (let i = 0; i < 12; i++) {
      const fx = (treeX - 60 + i * 28 + Math.sin(t * 1.5 + i) * 18 + w) % w;
      const fy = groundY - 40 - ((i * 19) % 110) + Math.cos(t * 2.1 + i) * 8;
      ctx.fillStyle = i % 2 === 0 ? '#FFE885' : '#E8A598';
      ctx.fillRect(Math.floor(fx), Math.floor(fy), 4, 4);
    }

    // Suelo de tierra y barro de Hidalgo
    ctx.fillStyle = '#070E1B';
    ctx.fillRect(0, groundY, w, h - groundY);
    ctx.fillStyle = '#D4AF37';
    ctx.fillRect(0, groundY, w, 2);
  }

  _drawJaguarLayers(ctx, w, h, t, scroll) {
    const groundY = Math.floor(h * 0.85);
    const pyrX = Math.floor(w * 0.5);

    // Pirámide escalonada prehispánica
    for (let step = 0; step < 6; step++) {
      const stepH = 18;
      const topY = groundY - (6 - step) * stepH;
      const halfW = 36 + step * 28;
      ctx.fillStyle = '#2D1C0E';
      ctx.fillRect(pyrX - halfW, topY, halfW * 2, stepH);
      ctx.fillStyle = '#D4AF37';
      ctx.fillRect(pyrX - halfW, topY, halfW * 2, 2);
    }

    // Escalinata central dorada
    ctx.fillStyle = '#7A561E';
    ctx.fillRect(pyrX - 18, groundY - 108, 36, 108);

    // Braseros ceremoniales de ámbar con chispas ascendentes
    [pyrX - 150, pyrX + 150].forEach((bx, idx) => {
      if (bx > 16 && bx < w - 16) {
        ctx.fillStyle = '#997A15';
        ctx.fillRect(bx - 12, groundY - 24, 24, 24);
        const flameH = 12 + Math.floor(Math.sin(t * 8 + idx) * 4);
        ctx.fillStyle = '#FF9800';
        ctx.fillRect(bx - 8, groundY - 24 - flameH, 16, flameH);
        ctx.fillStyle = '#FFE885';
        ctx.fillRect(bx - 4, groundY - 20 - flameH, 8, flameH - 4);
      }
    });

    // Piso con grecas prehispánicas doradas
    ctx.fillStyle = '#140C06';
    ctx.fillRect(0, groundY, w, h - groundY);
    ctx.fillStyle = '#D4AF37';
    ctx.fillRect(0, groundY, w, 2);
    const offset = Math.floor(scroll * 0.5) % 24;
    for (let x = -offset; x < w; x += 24) {
      ctx.fillRect(x, groundY + 6, 12, 4);
      ctx.fillRect(x + 4, groundY + 10, 8, 4);
    }
  }

  _drawVelvetLayers(ctx, w, h, t, scroll) {
    const groundY = Math.floor(h * 0.86);

    // Cortinajes de terciopelo azul marino
    ctx.fillStyle = 'rgba(10, 20, 44, 0.55)';
    for (let x = 0; x < w; x += 48) {
      const wave = Math.sin(t * 1.2 + x * 0.02) * 8;
      ctx.fillRect(x, 0, 24, groundY + wave);
    }

    // Columnas alquímicas con filetes Oro Rosa
    [w * 0.16, w * 0.5, w * 0.84].forEach((cx) => {
      const colX = Math.floor(cx);
      ctx.fillStyle = '#10203E';
      ctx.fillRect(colX - 14, Math.floor(h * 0.18), 28, groundY - Math.floor(h * 0.18));
      ctx.fillStyle = '#E8A598';
      ctx.fillRect(colX - 14, Math.floor(h * 0.18), 2, groundY - Math.floor(h * 0.18));
      ctx.fillRect(colX + 12, Math.floor(h * 0.18), 2, groundY - Math.floor(h * 0.18));
    });

    // Destellos flotantes de Oro Rosa
    for (let i = 0; i < 14; i++) {
      const sx = ((i * 67 + scroll * 0.3) % w + w) % w;
      const sy = h * 0.25 + ((i * 39) % Math.floor(h * 0.55)) + Math.sin(t * 2 + i) * 10;
      ctx.fillStyle = i % 2 === 0 ? '#E8A598' : '#FFD1DC';
      ctx.fillRect(Math.floor(sx), Math.floor(sy), 4, 4);
    }

    ctx.fillStyle = '#0A1328';
    ctx.fillRect(0, groundY, w, h - groundY);
    ctx.fillStyle = '#E8A598';
    ctx.fillRect(0, groundY, w, 2);
  }

  _drawPenthouseLayers(ctx, w, h, t, scroll) {
    const groundY = Math.floor(h * 0.84);
    const buildings = [
      { rx: 0.04, rw: 0.10, rh: 0.48 },
      { rx: 0.16, rw: 0.11, rh: 0.62 },
      { rx: 0.29, rw: 0.09, rh: 0.42 },
      { rx: 0.41, rw: 0.14, rh: 0.68 },
      { rx: 0.57, rw: 0.10, rh: 0.46 },
      { rx: 0.69, rw: 0.12, rh: 0.58 },
      { rx: 0.83, rw: 0.11, rh: 0.52 }
    ];

    buildings.forEach((b, idx) => {
      const bx = Math.floor(((b.rx * w - scroll * 0.15) % w + w) % w);
      const bw = Math.floor(b.rw * w);
      const bh = Math.floor(b.rh * h);
      const by = groundY - bh;

      ctx.fillStyle = '#0B101D';
      ctx.fillRect(bx, by, bw, bh);
      ctx.fillStyle = '#263554';
      ctx.fillRect(bx, by, bw, 2);
      ctx.fillRect(bx, by, 2, bh);

      // Ventanas doradas del skyline metropolitano
      ctx.fillStyle = '#D4AF37';
      for (let wy = by + 10; wy < groundY - 12; wy += 14) {
        for (let wx = bx + 8; wx < bx + bw - 10; wx += 12) {
          if ((wx + wy + idx) % 5 !== 0) {
            ctx.fillRect(wx, wy, 4, 6);
          }
        }
      }
    });

    // Terraza de mármol negro y barandal dorado
    ctx.fillStyle = '#080A10';
    ctx.fillRect(0, groundY, w, h - groundY);
    ctx.fillStyle = '#D4AF37';
    ctx.fillRect(0, groundY, w, 3);
  }

  /**
   * Genera una explosión de partículas Pixel Art.
   */
  spawnParticles(x, y, color = '#D4AF37', count = 14, opts = {}) {
    const speed = opts.speed || 130;
    const size = opts.size || 4;
    const life = opts.life || 0.65;
    const gravity = opts.gravity !== undefined ? opts.gravity : 180;

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const spd = speed * (0.4 + Math.random() * 0.75);
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        color: Array.isArray(color) ? color[i % color.length] : color,
        size: size + (i % 2) * 2,
        life,
        maxLife: life,
        gravity
      });
    }
  }

  /**
   * Genera una ráfaga de bruma aromática Oro Rosa y Dorado Citlalli.
   */
  spawnPerfumeMist(x, y, count = 24) {
    const palette = ['#E8A598', '#FFE885', '#FFD1DC', '#D4AF37', '#B3E5FC'];
    for (let i = 0; i < count; i++) {
      const angle = -Math.PI * 0.5 + (Math.random() - 0.5) * 1.4;
      const spd = 45 + Math.random() * 120;
      const life = 0.6 + Math.random() * 0.6;
      this.particles.push({
        x: x + (Math.random() - 0.5) * 16,
        y: y + (Math.random() - 0.5) * 10,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd - 20,
        color: palette[i % palette.length],
        size: 3 + (i % 3) * 2,
        life,
        maxLife: life,
        gravity: -35
      });
    }
  }

  /**
   * Genera texto flotante retro ("+100 PTS", "¡PAR ESTELAR!", "MANDARINA").
   */
  spawnFloatingText(x, y, text, color = '#FFE885', size = 14) {
    this.floatingTexts.push({
      x,
      y,
      vy: -48,
      text: String(text),
      color,
      size,
      life: 0.95,
      maxLife: 0.95
    });
  }

  /**
   * Activa una sacudida de pantalla (Screen Shake) para colisiones o récords.
   */
  triggerShake(intensity = 6, durationMs = 240) {
    this.shakeIntensity = Math.max(this.shakeIntensity, intensity);
    this.shakeDuration = durationMs / 1000;
    this.shakeTimeRemaining = this.shakeDuration;
  }

  /**
   * Devuelve el desplazamiento { x, y } actual de la sacudida de pantalla.
   */
  getShakeOffset() {
    if (this.shakeTimeRemaining <= 0) {
      return { x: 0, y: 0 };
    }
    const progress = this.shakeTimeRemaining / (this.shakeDuration || 0.25);
    const mag = this.shakeIntensity * progress;
    return {
      x: Math.round((Math.random() * 2 - 1) * mag),
      y: Math.round((Math.random() * 2 - 1) * mag)
    };
  }

  /**
   * Actualiza y dibuja todas las partículas y textos flotantes activos en el canvas.
   */
  updateAndDraw(ctx, dt = 0.016) {
    const safeDt = Math.min(0.1, Math.max(0.001, Number(dt) || 0.016));

    if (this.shakeTimeRemaining > 0) {
      this.shakeTimeRemaining = Math.max(0, this.shakeTimeRemaining - safeDt);
      if (this.shakeTimeRemaining <= 0) {
        this.shakeIntensity = 0;
      }
    }

    // Actualizar y dibujar partículas
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= safeDt;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }
      p.vy += (p.gravity || 0) * safeDt;
      p.x += p.vx * safeDt;
      p.y += p.vy * safeDt;

      if (ctx) {
        const alpha = Math.max(0, p.life / p.maxLife);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        const px = Math.floor(p.x / 2) * 2;
        const py = Math.floor(p.y / 2) * 2;
        ctx.fillRect(px, py, p.size, p.size);
        ctx.restore();
      }
    }

    // Actualizar y dibujar textos flotantes
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.life -= safeDt;
      if (ft.life <= 0) {
        this.floatingTexts.splice(i, 1);
        continue;
      }
      ft.y += ft.vy * safeDt;

      if (ctx) {
        const alpha = Math.max(0, ft.life / ft.maxLife);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.font = `bold ${ft.size}px "Press Start 2P", "Courier New", monospace`;
        ctx.textAlign = 'center';
        ctx.fillStyle = '#060B1A';
        ctx.fillText(ft.text, Math.round(ft.x) + 2, Math.round(ft.y) + 2);
        ctx.fillStyle = ft.color;
        ctx.fillText(ft.text, Math.round(ft.x), Math.round(ft.y));
        ctx.restore();
      }
    }
  }

  clear() {
    this.particles = [];
    this.floatingTexts = [];
    this.shakeTimeRemaining = 0;
    this.shakeIntensity = 0;
  }
}

export const citlalliVFX = new CitlalliVFXEngine();

if (typeof window !== 'undefined') {
  window.CitlalliVFX = citlalliVFX;
}

export default citlalliVFX;
