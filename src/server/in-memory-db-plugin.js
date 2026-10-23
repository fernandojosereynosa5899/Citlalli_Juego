/**
 * CITLALLI — Salón Arcade
 * Plugin de Vite para Base de Datos Volátil en Memoria RAM
 *
 * Middleware para Vite / Astro Dev Server que captura y procesa las peticiones REST
 * a los endpoints:
 *   - GET  /api/leaderboard & /api/records  -> Consulta récords en RAM (query ?game=...&limit=...)
 *   - POST /api/leaderboard & /api/records  -> Registra nuevo récord en RAM
 *   - GET  /api/avatars                     -> Catálogo oficial de 12 avatares Pixel Art
 *   - POST /api/reset                       -> Reinicia la memoria a los datos semilla de gala
 */

import {
  getLeaderboard,
  addRecord,
  getAvatars,
  resetToSeed
} from './in-memory-db.js';

/**
 * Lee y parsea el cuerpo JSON de una petición entrante de Node.js http.IncomingMessage.
 * @param {import('http').IncomingMessage} req
 * @returns {Promise<object>}
 */
function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      // Protección de sobrecarga de memoria: máx 512KB
      if (body.length > 512 * 1024) {
        req.destroy();
        reject(new Error('Cuerpo de la petición demasiado grande (máx 512KB)'));
      }
    });

    req.on('end', () => {
      if (!body || !body.trim()) {
        return resolve({});
      }
      try {
        const parsed = JSON.parse(body);
        resolve(parsed);
      } catch (err) {
        reject(new Error(`Formato JSON inválido: ${err.message}`));
      }
    });

    req.on('error', (err) => reject(err));
  });
}

function getGroupedRecords() {
  const all = getLeaderboard('all', 100);
  const toItem = (r) => ({
    username: r.playerName || 'Jugador Citlalli',
    valor: r.score,
    avatar: r.avatar || 'bottle',
    scenarioId: r.scenarioId || 'selva',
    fecha: r.date || new Date().toISOString().split('T')[0]
  });

  return {
    snake: all.filter((r) => r.gameId === 'snake').slice(0, 15).map(toItem),
    flappy: all.filter((r) => r.gameId === 'flappy').slice(0, 15).map(toItem),
    memorama: all
      .filter((r) => r.gameId === 'memory' || r.gameId === 'memorama')
      .slice(0, 15)
      .map(toItem),
    reflejos: all
      .filter((r) => r.gameId === 'reflex' || r.gameId === 'reflejos')
      .slice(0, 15)
      .map(toItem)
  };
}

/**
 * Vite Plugin que inyecta los endpoints de la API en memoria RAM durante el desarrollo.
 * @returns {import('vite').Plugin}
 */
export function inMemoryDbPlugin() {
  return {
    name: 'citlalli-in-memory-db-plugin',

    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        // Parsear URL de la petición
        const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
        const pathname = parsedUrl.pathname;

        // Si la ruta no comienza con /api/, pasar al siguiente middleware de Astro/Vite
        if (!pathname.startsWith('/api/')) {
          return next();
        }

        // Encabezados CORS universales
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

        // Manejo de preflight OPTIONS
        if (req.method === 'OPTIONS') {
          res.statusCode = 204;
          res.end();
          return;
        }

        // Tipo de contenido JSON
        res.setHeader('Content-Type', 'application/json; charset=utf-8');

        try {
          // ==================================================================
          // GET /api/leaderboard | GET /api/records
          // ==================================================================
          if ((pathname === '/api/leaderboard' || pathname === '/api/records') && req.method === 'GET') {
            const rawGame = parsedUrl.searchParams.get('game') || parsedUrl.searchParams.get('juego') || 'all';
            const aliasMap = { memorama: 'memory', reflejos: 'reflex' };
            const game = aliasMap[rawGame] || rawGame;

            const limitParam = parsedUrl.searchParams.get('limit') || '20';
            const limit = Math.max(1, parseInt(limitParam, 10) || 20);

            const grouped = getGroupedRecords();

            if (pathname === '/api/records' || parsedUrl.searchParams.get('format') === 'grouped') {
              res.statusCode = 200;
              res.end(
                JSON.stringify({
                  ok: true,
                  ip_servidor: 'localhost',
                  puerto: 4321,
                  records: grouped
                })
              );
              return;
            }

            const records = getLeaderboard(game, limit);

            res.statusCode = 200;
            res.end(
              JSON.stringify({
                ok: true,
                game,
                limit,
                total: records.length,
                records,
                grouped
              })
            );
            return;
          }

          // ==================================================================
          // POST /api/leaderboard | POST /api/records
          // ==================================================================
          if ((pathname === '/api/leaderboard' || pathname === '/api/records') && req.method === 'POST') {
            const payload = await readJsonBody(req);
            const rawGame = payload.gameId || payload.juego || 'snake';
            const aliasMap = { memorama: 'memory', reflejos: 'reflex' };
            const canonGame = aliasMap[rawGame] || rawGame;

            const entry = addRecord({
              playerName: payload.playerName || payload.username || 'Invitado Citlalli',
              avatar: payload.avatar || 'bottle',
              gameId: canonGame,
              score: payload.score !== undefined ? payload.score : (payload.valor || 0),
              scenarioId: payload.scenarioId || payload.mapa || 'selva',
              mode: payload.mode || '1p',
              rank: payload.rank,
              bestMs: payload.bestMs,
              stats: payload.stats
            });

            const grouped = getGroupedRecords();

            res.statusCode = 201;
            res.end(
              JSON.stringify({
                ok: true,
                entry,
                records: grouped
              })
            );
            return;
          }

          // ==================================================================
          // GET /api/avatars
          // ==================================================================
          if (pathname === '/api/avatars' && req.method === 'GET') {
            const avatars = getAvatars();

            res.statusCode = 200;
            res.end(
              JSON.stringify({
                ok: true,
                total: avatars.length,
                avatars
              })
            );
            return;
          }

          // ==================================================================
          // POST /api/reset
          // ==================================================================
          if (pathname === '/api/reset' && req.method === 'POST') {
            const resetResult = resetToSeed();

            res.statusCode = 200;
            res.end(
              JSON.stringify({
                ok: true,
                message: 'Base de datos en RAM reiniciada a los datos semilla de gala',
                count: resetResult.count
              })
            );
            return;
          }

          // Endpoint no encontrado dentro de /api/
          res.statusCode = 404;
          res.end(
            JSON.stringify({
              ok: false,
              error: `Ruta API no encontrada: ${req.method} ${pathname}`
            })
          );
        } catch (error) {
          console.error('[in-memory-db-plugin] Error al procesar petición API:', error);
          res.statusCode = 500;
          res.end(
            JSON.stringify({
              ok: false,
              error: error.message || 'Error interno del servidor en memoria RAM'
            })
          );
        }
      });
    }
  };
}

export default inMemoryDbPlugin;
