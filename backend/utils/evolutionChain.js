const axios = require('axios')

const POKEAPI_BASE = 'https://pokeapi.co/api/v2'

/**
 * Obtiene la cadena evolutiva completa de un Pokémon
 * 
 * @param {number} pokemonId ID del Pokémon
 * @returns {Object} Objeto con información de evoluciones
 * 
 * ¿Cómo funciona la PokeAPI con evoluciones?
 * 1. Primero se obtienen los datos del Pokémon: /pokemon/{id}
 * 2. Esos datos tienen una URL a la especie: species.url
 * 3. La especie tiene una URL a la cadena evolutiva: evolution_chain.url
 * 4. La cadena evolutiva tiene TODA la familia evolutiva
 */

async function getEvolutionChain(pokemonId) {
  try {
    console.log(`🔄Obteniendo cadena evolutiva de Pokémon: #${pokemonId}...`)

    //1.Obtener datos del pokemon
    const pokemonResponse = await axios.get(`${POKEAPI_BASE}/pokemon/${pokemonId}`)
    const pokemon = pokemonResponse.data

    //2.Obtener datos de la especie
    const speciesResponse = await axios.get(pokemon.species.url)
    const species = speciesResponse.data

    //3.Obtener cadena evolutiva
    const evolutionResponse = await axios.get(species.evolution_chain.url)
    const chain = evolutionResponse.data.chain

    //4.Procesar la cadena evolutiva.
    /**
     * La cadena viene en este formato:
     * {
     *   species: { name: "bulbasaur" },
     *   evolves_to: [
     *     {
     *       species: { name: "ivysaur" },
     *       evolves_to: [
     *         { species: { name: "venusaur" }, evolves_to: [] }
     *       ]
     *     }
     *   ]
     * }
     */
    //Extraer toda la familia evolutiva en una lista plana
    const evolutionFamily = []

    function extractEvolutions(chainLink, stage = 1) {
      const speciesName = chainLink.species.name
      const speciesUrl = chainLink.species.url
      const speciesId = parseInt(speciesUrl.split('/').slice(-2, -1)[0])

      //Obtener método de evolucion
      let evolutionMethod = 'level';
      let evolutionLevel = null;

      if (chainLink.evolution_details && chainLink.evolution_details.length > 0) {
        const details = chainLink.evolution_details[0]

        if (details.trigger.name === 'level-up') {
          evolutionMethod = 'level'
          evolutionLevel = details.min_level
        } else if (details.trigger.name === 'use-item') {
          evolutionMethod = 'stone'
        } else if (details.trigger.name === 'trade') {
          evolutionMethod = 'trade';
        } else {
          evolutionMethod = details.trigger.name
        }
      }

      evolutionFamily.push({
        name: speciesName,
        pokedexNumber: speciesId,
        stage: stage,
        method: evolutionMethod,
        level: evolutionLevel
      })

      //Recursivamente obtener evoluciones siguientes
      if (chainLink.evolves_to && chainLink.evolves_to.length > 0) {
        chainLink.evolves_to.forEach(nextLink => {
          extractEvolutions(nextLink, stage + 1)
        })
      }
    }

    extractEvolutions(chain)

    //5.Encontrar posicion del pokemon actual

    const currentPokemonIndex = evolutionFamily.findIndex(
      evo => evo.pokedexNumber === pokemonId
    )

    if (currentPokemonIndex === -1) {
      console.log(`⚠️ Pokémon #${pokemonId} no encontrado en su cadena evolutiva`)
      return null
    }

    const currentPokemon = evolutionFamily[currentPokemonIndex]

    //6.Construir objeto de evoluciones con TODA la familia evolutiva

    //Agrupar por etapas (stage 1, stage 2, stage 3, etc.)
    const stages = {}
    evolutionFamily.forEach(evo => {
      if (!stages[evo.stage]) {
        stages[evo.stage] = []
      }
      stages[evo.stage].push({
        name: evo.name,
        pokedexNumber: evo.pokedexNumber,
        sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evo.pokedexNumber}.png`,
        level: evo.level,
        method: evo.method,
        isCurrentPokemon: evo.pokedexNumber === pokemonId
      })
    })

    //Convertir a array de etapas ordenadas
    const fullChain = Object.keys(stages)
      .sort((a, b) => parseInt(a) - parseInt(b))
      .map(stage => stages[stage])

    const evolutionData = {
      fullChain: fullChain, // Nuevo: toda la cadena completa
      currentStage: currentPokemon.stage, // Etapa actual del pokemon
      isFinal: currentPokemon.stage === Math.max(...Object.keys(stages).map(s => parseInt(s)))
    }

    console.log(`✅ Cadena evolutiva obtenida para ${pokemon.name}`)

    return evolutionData

  } catch (error) {
    console.error(`❌ Error obteniendo evoluciones de Pokémon #${pokemonId}:`, error.message)
    return null
  }
}

module.exports = {
  getEvolutionChain
}