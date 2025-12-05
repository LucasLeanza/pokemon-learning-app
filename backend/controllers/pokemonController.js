const Pokemon = require('../models/Pokemon')

// ============================================
// CONTROLADOR: BUSCAR POKÉMON (AUTOCOMPLETADO)
// ============================================
/**
 * Busca pokémon por nombre para el autocompletado
 * 
 * Ruta: GET /api/pokemon/search?query=char
 * 
 * ¿Qué hace?
 * - Recibe un texto de búsqueda (ej: "char")
 * - Busca todos los pokémon cuyos nombres EMPIECEN con ese texto
 * - Devuelve máximo 10 resultados
 * - Solo devuelve: nombre, número y sprite (no toda la info)
 * 
 * Ejemplo de uso:
 * GET /api/pokemon/search?query=pika
 * Respuesta: [{ name: "pikachu", pokedexNumber: 25, sprite: "..." }]
 */

exports.searchPokemon = async (req, res) => {
  try {
    //Obtener el query parameter 'query' de la URL
    const { query } = req.query
    
    //Validad que se envió algo
    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        error: 'Debes proporcionar un término de búsqueda'
      })
    }

    //Validar que tenga al menos 2 caracteres (evitar búsquedas muy genéricas)
    if (query.length < 2) {
      return res.status(400).json({
        error: 'El término de búsqueda debe tener al menos 2 caracteres'
      })
    }

    console.log(`🔍 Buscando pokémon que empiecen con: "${query}"`)

    //Buscar en la base de datos
    //$regex busca usando expresion regular
    // ^${query} ^ significa "que empiece con"
    //$options: 'i' case-insensitive (no importan mayus/minus)
    const pokemons = await Pokemon.find({
      name: {
        $regex: `^${query}`,
        $options: 'i'
      }
    })
    .limit(10) //Máximo 10 resultados
    .select('name pokedexNumber sprite') //Solo estos campos
    .sort({ pokedexNumber: 1 }) //Ordenar por numero

    console.log(`✅ Encontrados: ${pokemons.length} pokémon`)

    //Enviar respuesta
    res.json(pokemons)
  } catch (error) {
    console.error('❌ Error en searchPokemon:', error)
    res.status(500).json({
      erorr: 'Error al buscar pokémon',
      message: error.message
    })
  }
}

// ============================================
// CONTROLADOR: OBTENER DETALLES DE UN POKÉMON
// ============================================

/**
 * Obtiene todos los detalles de un pokémon específico
 * 
 * Ruta: GET /api/pokemon/:name
 * 
 * ¿Qué hace?
 * - Recibe el nombre de un pokémon en la URL
 * - Busca ese pokémon en la base de datos
 * - Devuelve TODA su información (tipos, stats, debilidades, etc.)
 * 
 * Ejemplo de uso:
 * GET /api/pokemon/pikachu
 * Respuesta: { name: "pikachu", types: ["electric"], weakAgainst: ["ground"], ... }
 */

exports.getPokemonDetails = async (req, res) => {
  try {
    //Obtener el nombre de los parámetros de la URL
    const { name } = req.params

    console.log(`🔍 Buscando detalles de: "${name}"`)

    //Buscar al pokemon
    //$regex con ^ y $: busqueda exacta pero case-insensitive
    const pokemon = await Pokemon.findOne({
      name: {
        $regex: `^${name}`,
        $options: 'i'
      }
    })

    //Si no existe devuelvo 404
    if (!pokemon) {
      console.log(`⚠️ Pokémon "${name}" no encontrado`)
      return res.status(404).json({
        error: 'Pokémon no encontrado',
        name: name
      })
    }

    console.log(`✅ Encontrado: ${pokemon.displayName} (#${pokemon.pokedexNumber})`)

    //Enviar respuesta con todos los datos
    res.json(pokemon)

  } catch (error) {
    console.error('❌ Error en getPokemonDetails:', error)
    res.status(500).json({
      error: 'Error al obtener detalles del pokémon',
      message: error.message
    })
  }
}

// ============================================
// CONTROLADOR: OBTENER POKÉMON POR TIPO
// ============================================

/**
 * Obtiene todos los pokémon de un tipo específico
 * 
 * Ruta: GET /api/pokemon/type/:type
 * 
 * ¿Qué hace?
 * - Recibe un tipo (fire, water, etc.)
 * - Devuelve todos los pokémon que tengan ese tipo
 * 
 * Ejemplo de uso:
 * GET /api/pokemon/type/fire
 * Respuesta: [{ name: "charmander", ... }, { name: "vulpix", ... }]
 */

exports.getPokemonByType = async (req, res) => {
  try {
    const { type } = req.params

    console.log(`🔍 Buscando pokémon de tipo: "${type}"`)

    //Buscar todos los pokemon que tengan ese tipo
    const pokemons = await Pokemon.find({
      types: type.toLowerCase()
    })
    .select('name pokedexNumber sprite')
    .sort({ pokedexNumber: 1 })

    console.log(`✅ Encontrados: ${pokemons.length} pokémon de tipo ${type}`)

    res.json({
      type: type,
      count: pokemons.length,
      pokemons: pokemons
    })

  } catch (error) {
    console.error('❌ Error en getPokemonByType:', error)
    res.status(500).json({
      error: 'Error al buscar pokemon por tipo',
      message: error.message
    })
  }
}

// ============================================
// CONTROLADOR: OBTENER TODOS LOS POKÉMON
// ============================================

/**
 * Obtiene una lista paginada de todos los pokémon
 * 
 * Ruta: GET /api/pokemon?page=1&limit=20
 * 
 * ¿Qué hace?
 * - Devuelve pokémon con paginación
 * - Por defecto: página 1, 20 pokémon por página
 * 
 * Ejemplo de uso:
 * GET /api/pokemon?page=2&limit=50
 */

exports.getAllPokemon = async (req, res) => {
  try {
    //Obtener parametros de paginación de la query string
    const page = parseInt(req.query.page) || 1 //Pagina por defecto: 1
    const limit = parseInt(req.query.limit) || 20//Limite por defecto: 20

    //Calcular cuantps documentos saltar
    const skip = (page - 1) * limit

    console.log(`📄 Obteniendo página ${page}, ${limit} pokémon por página`)

    //Contar total de pokemon
    const total = await Pokemon.countDocuments()

    //Obtener pokemon de la pagina actual
    const pokemons = await Pokemon.find()
      .select('name pokedexNumber types sprite')
      .sort({ pokedexNumber: 1})
      .skip(skip)
      .limit(limit)

    //Calcular información de paginacion
    const totalPages = Math.ceil(total / limit)

    res.json({
      page: page,
      limit: limit,
      totalPages: totalPages,
      totalPokemon: totalPokemon,
      pokemons: pokemons
    })

  } catch (error) {
    console.error('❌ Error en getAllPokemon:', error)
    res.status(500).json({
      error: 'Error al obtener pokémon',
      message: error.message
    })
  }
}

// ============================================
// CONTROLADOR: OBTENER POKÉMON ALEATORIO
// ============================================

/**
 * Devuelve un pokémon al azar
 * 
 * Ruta: GET /api/pokemon/random
 * 
 * ¿Para qué sirve?
 * Por si quieres implementar una función "pokémon del día" o similar
 */

exports.getRandomPokemon = async (req, res) => {
  try {
    console.log('🎲 Obteniendo pokémon aleatorio...')

    //Contar total de pokemon
    const count = await Pokemon.countDocuments()

    //Generar numero aleatorio
    const random = Math.floor(Math.random() * count)

    //Obtener el pokemon en esa posición
    const pokemon = await Pokemon.findOne().skip(random)

    console.log(`✅ Pokémon aleatorio: ${pokemon.displayName}`)

    res.json(pokemon)

  } catch (error) {
    console.error('❌ Error en getRandomPokemon', error)
    res.status(500).json({
      error: 'Error al obtener pokémon aleatorio',
      message: error.message
    })
  }
}