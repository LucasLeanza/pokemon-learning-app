const express = require('express');
const router = express.Router();

// Importar controladores
const pokemonController = require('../controllers/pokemonController');

// ============================================
// DEFINIR RUTAS
// ============================================

/**
 * ¿Qué es una ruta?
 * Una ruta conecta una URL con una función del controlador.
 * 
 * Formato:
 * router.MÉTODO('URL', controlador.función)
 * 
 * Métodos HTTP:
 * - GET: Obtener datos
 * - POST: Crear datos
 * - PUT/PATCH: Actualizar datos
 * - DELETE: Eliminar datos
 */

// ============================================
// RUTA: BUSCAR POKÉMON (AUTOCOMPLETADO)
// ============================================

/**
 * GET /api/pokemon/search?query=char
 * 
 * Query parameters:
 * - query: texto de búsqueda
 * 
 * Ejemplo:
 * GET /api/pokemon/search?query=pika
 */
router.get('/search', pokemonController.searchPokemon);

// ============================================
// RUTA: POKÉMON ALEATORIO
// ============================================

/**
 * GET /api/pokemon/random
 * 
 * ⚠️ IMPORTANTE: Esta ruta DEBE estar ANTES de '/:name'
 * Porque si no, Express pensará que "random" es un nombre de pokémon
 */
router.get('/random', pokemonController.getRandomPokemon);

// ============================================
// RUTA: POKÉMON POR TIPO
// ============================================

/**
 * GET /api/pokemon/type/:type
 * 
 * Parámetros:
 * - type: tipo del pokémon (fire, water, etc.)
 * 
 * Ejemplo:
 * GET /api/pokemon/type/electric
 */
router.get('/type/:type', pokemonController.getPokemonByType);

// ============================================
// RUTA: OBTENER TODOS LOS POKÉMON
// ============================================

/**
 * GET /api/pokemon
 * 
 * Query parameters opcionales:
 * - page: número de página (default: 1)
 * - limit: pokémon por página (default: 20)
 * 
 * Ejemplo:
 * GET /api/pokemon?page=2&limit=50
 */
router.get('/', pokemonController.getAllPokemon);

// ============================================
// RUTA: DETALLES DE UN POKÉMON ESPECÍFICO
// ============================================

/**
 * GET /api/pokemon/:name
 * 
 * Parámetros:
 * - name: nombre del pokémon
 * 
 * Ejemplo:
 * GET /api/pokemon/pikachu
 * 
 * ⚠️ IMPORTANTE: Esta ruta debe ser la ÚLTIMA
 * porque es la más genérica (captura cualquier cosa)
 */
router.get('/:name', pokemonController.getPokemonDetails);

// ============================================
// EXPORTAR ROUTER
// ============================================

module.exports = router;