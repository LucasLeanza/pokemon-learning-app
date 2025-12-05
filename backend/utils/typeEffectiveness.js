// ============================================
// TABLA DE EFECTIVIDAD DE TIPOS DE POKÉMON
// ============================================

const TYPE_CHART = {
  normal: {
    superEffective: [],
    notVeryEffective: ['rock', 'steel'],
    noEffect: ['ghost']
  },
  fire: {
    superEffective: ['grass', 'ice', 'bug', 'steel'],
    notVeryEffective: ['fire', 'water', 'rock', 'dragon'],
    noEffect: []
  },
  water: {
    superEffective: ['fire', 'ground', 'rock'],
    notVeryEffective: ['water', 'grass', 'dragon'],
    noEffect: []
  },
  electric: {
    superEffective: ['water', 'flying'],
    notVeryEffective: ['electric', 'grass', 'dragon'],
    noEffect: ['ground']
  },
  grass: {
    superEffective: ['water', 'ground', 'rock'],
    notVeryEffective: ['fire', 'grass', 'poison', 'flying', 'bug', 'dragon', 'steel'],
    noEffect: []
  },
  ice: {
    superEffective: ['grass', 'ground', 'flying', 'dragon'],
    notVeryEffective: ['fire', 'water', 'ice', 'steel'],
    noEffect: []
  },
  fighting: {
    superEffective: ['normal', 'ice', 'rock', 'dark', 'steel'],
    notVeryEffective: ['poison', 'flying', 'psychic', 'bug', 'fairy'],
    noEffect: ['ghost']
  },
  poison: {
    superEffective: ['grass', 'fairy'],
    notVeryEffective: ['poison', 'ground', 'rock', 'ghost'],
    noEffect: ['steel']
  },
  ground: {
    superEffective: ['fire', 'electric', 'poison', 'rock', 'steel'],
    notVeryEffective: ['grass', 'bug'],
    noEffect: ['flying']
  },
  flying: {
    superEffective: ['grass', 'fighting', 'bug'],
    notVeryEffective: ['electric', 'rock', 'steel'],
    noEffect: []
  },
  psychic: {
    superEffective: ['fighting', 'poison'],
    notVeryEffective: ['psychic', 'steel'],
    noEffect: ['dark']
  },
  bug: {
    superEffective: ['grass', 'psychic', 'dark'],
    notVeryEffective: ['fire', 'fighting', 'poison', 'flying', 'ghost', 'steel', 'fairy'],
    noEffect: []
  },
  rock: {
    superEffective: ['fire', 'ice', 'flying', 'bug'],
    notVeryEffective: ['fighting', 'ground', 'steel'],
    noEffect: []
  },
  ghost: {
    superEffective: ['psychic', 'ghost'],
    notVeryEffective: ['dark'],
    noEffect: ['normal']
  },
  dragon: {
    superEffective: ['dragon'],
    notVeryEffective: ['steel'],
    noEffect: ['fairy']
  },
  dark: {
    superEffective: ['psychic', 'ghost'],
    notVeryEffective: ['fighting', 'dark', 'fairy'],
    noEffect: []
  },
  steel: {
    superEffective: ['ice', 'rock', 'fairy'],
    notVeryEffective: ['fire', 'water', 'electric', 'steel'],
    noEffect: []
  },
  fairy: {
    superEffective: ['fighting', 'dragon', 'dark'],
    notVeryEffective: ['fire', 'poison', 'steel'],
    noEffect: []
  }
};

// ============================================
// TABLA INVERSA: DEFENSIVA
// ============================================

const DEFENSIVE_CHART = {
  normal: {
    weakTo: ['fighting'],
    resistantTo: [],
    immuneTo: ['ghost']
  },
  fire: {
    weakTo: ['water', 'ground', 'rock'],
    resistantTo: ['fire', 'grass', 'ice', 'bug', 'steel', 'fairy'],
    immuneTo: []
  },
  water: {
    weakTo: ['electric', 'grass'],
    resistantTo: ['fire', 'water', 'ice', 'steel'],
    immuneTo: []
  },
  electric: {
    weakTo: ['ground'],
    resistantTo: ['electric', 'flying', 'steel'],
    immuneTo: []
  },
  grass: {
    weakTo: ['fire', 'ice', 'poison', 'flying', 'bug'],
    resistantTo: ['water', 'electric', 'grass', 'ground'],
    immuneTo: []
  },
  ice: {
    weakTo: ['fire', 'fighting', 'rock', 'steel'],
    resistantTo: ['ice'],
    immuneTo: []
  },
  fighting: {
    weakTo: ['flying', 'psychic', 'fairy'],
    resistantTo: ['bug', 'rock', 'dark'],
    immuneTo: []
  },
  poison: {
    weakTo: ['ground', 'psychic'],
    resistantTo: ['grass', 'fighting', 'poison', 'bug', 'fairy'],
    immuneTo: []
  },
  ground: {
    weakTo: ['water', 'grass', 'ice'],
    resistantTo: ['poison', 'rock'],
    immuneTo: ['electric']
  },
  flying: {
    weakTo: ['electric', 'ice', 'rock'],
    resistantTo: ['grass', 'fighting', 'bug'],
    immuneTo: ['ground']
  },
  psychic: {
    weakTo: ['bug', 'ghost', 'dark'],
    resistantTo: ['fighting', 'psychic'],
    immuneTo: []
  },
  bug: {
    weakTo: ['fire', 'flying', 'rock'],
    resistantTo: ['grass', 'fighting', 'ground'],
    immuneTo: []
  },
  rock: {
    weakTo: ['water', 'grass', 'fighting', 'ground', 'steel'],
    resistantTo: ['normal', 'fire', 'poison', 'flying'],
    immuneTo: []
  },
  ghost: {
    weakTo: ['ghost', 'dark'],
    resistantTo: ['poison', 'bug'],
    immuneTo: ['normal', 'fighting']
  },
  dragon: {
    weakTo: ['ice', 'dragon', 'fairy'],
    resistantTo: ['fire', 'water', 'electric', 'grass'],
    immuneTo: []
  },
  dark: {
    weakTo: ['fighting', 'bug', 'fairy'],
    resistantTo: ['ghost', 'dark'],
    immuneTo: ['psychic']
  },
  steel: {
    weakTo: ['fire', 'fighting', 'ground'],
    resistantTo: ['normal', 'grass', 'ice', 'flying', 'psychic', 'bug', 'rock', 'dragon', 'steel', 'fairy'],
    immuneTo: ['poison']
  },
  fairy: {
    weakTo: ['poison', 'steel'],
    resistantTo: ['fighting', 'bug', 'dark'],
    immuneTo: ['dragon']
  }
};

// ============================================
// FUNCIÓN: CALCULAR EFECTIVIDAD OFENSIVA
// ============================================

/** 
 * Calcula contra qué tipos un Pokémon es fuerte (ofensivamente)
 * basandose en sus tipos
 * 
 * @param {Array<string>} pokemonTypes
 * @returns {Object} - Objeto con strongAgainst, weakAgainst, noEffect
 * 
 * Funcionalidad:
 * Si un pokemon tiene tipo fuego y volador:
 * 1. Busca en TYPE_CHART['fire'] que tipos son superEffective
 * 2. Busca en TYPE_CHART['flying'] que tipos son superEffective
 * 3. Combina ambos (Sin duplicados)
*/

function calculateOffensiveEffectiveness(pokemonTypes) {
  const strongAgainst = new Set(); //Set evita duplicados automaticamente
  const weakAgainst = new Set();
  const noEffect = new Set();

  //Iterar sobre cada tipo del Pokemon
  pokemonTypes.forEach(type => {
    const typeData = TYPE_CHART[type]

    if (typeData) {
      //Agregar tipos contra los que es super efectivo
      typeData.superEffective.forEach(t => strongAgainst.add(t))

      //Agregar tipos contra los que NO es muy efectivo
      typeData.notVeryEffective.forEach(t => weakAgainst.add(t))

      //Agregar tipos contra los que no tiene efecto
      typeData.noEffect.forEach(t => noEffect.add(t))
    }
  })

  //Convertir Sets a Arrays para guardar en MongoDB
  return {
    strongAgainst: Array.from(strongAgainst),
    weakAgainst: Array.from(weakAgainst),
    immuneTo: Array.from(noEffect)
  }
}

// ============================================
// FUNCIÓN: CALCULAR EFECTIVIDAD DEFENSIVA
// ============================================

/**Calcula contra que tipos un pokemon es debil (defensivamente)
 * 
 * @param {Array<string>} pokemonTypes
 * @return {Object} Objeto con weakTo, resistantTo, immuneTo
 * 
 * Funcionalidad:
 * Si un pokemon tiene tipo fuego y volador:
 * 1. Busca en DEFENSIVE_CHART['fire'] qué tipos le hacen débil
 * 2. Busca en DEFENSIVE_CHART['flying'] qué tipos le hacen debil
 * 3. Calcula multiplicadores combinados (x4, x2, x1, x0.5, x0.25, x0)
 * 
 * Ejemplo: Charizard(Fuego/Volador)
 * - Fuego es débil a roca (x2)
 * - Volador es débil a roca (x2)
 * - Combinado: Roca hace x4 a Charizard (SUPERMEGADÉBIL)
 */

function calculateDefensiveEffectiveness(pokemonTypes) {
  //Mapa para acumular multiplicadores
  const typeMultipliers = {}

  //Inicializar todos los tipos con multiplicador 1 (neutral)
  Object.keys(DEFENSIVE_CHART).forEach(type => {
    typeMultipliers[type] = 1;
  })

  //Calcular multiplicadores para cada tipo del Pokémon
  pokemonTypes.forEach(pokemonType => {
    const defenseData = DEFENSIVE_CHART[pokemonType]

    if (defenseData) {
      //Multiplicar por 2 los tipos a los que es debil
      defenseData.weakTo.forEach(attackType => {
        typeMultipliers[attackType] *= 2;
      })

      //Multiplicar por 0.5 los tipos a los que es resistente
      defenseData.resistantTo.forEach(attackType => {
        typeMultipliers[attackType] *= 0.5;
      })

      //Multiplicar por 0 los tipos a los que es inmune
      defenseData.immuneTo.forEach(attackType => {
        typeMultipliers[attackType] = 0
      })
    }
  })

  //Clasificar tipos segun el multiplicador final
  const weakTo = []
  const resistantTo = []
  const immuneTo = []

  Object.entries(typeMultipliers).forEach(([type, multiplier]) => {
    if (multiplier >= 2) {
      weakTo.push(type);
    } else if (multiplier > 0 && multiplier < 1) {
      resistantTo.push(type)
    } else if (multiplier === 0) {
      immuneTo.push(type)
    }
  })

  return {
    weakTo,
    resistantTo,
    immuneTo
  }
}

// ============================================
// FUNCIÓN: CALCULAR TODAS LAS RELACIONES
// ============================================

/**
 * Función principal que calcula tanto efectividad ofensiva como defensiva
 * 
 * @param {Array<string>} pokemonTypes
 * @returns {Object} Objeto completo con todas las relaciones
 * 
 * Esta funcion se usa cuando se guarde un Pokemon en la base de datos.
 */

function calculateTypeRelations(pokemonTypes) {
  const offensive = calculateOffensiveEffectiveness(pokemonTypes)
  const defensive = calculateDefensiveEffectiveness(pokemonTypes)

  return {
    //Ofensivo: Que tan bien ataca
    strongAgainst: offensive.strongAgainst,

    //Defensivo: que tan bien se defiende
    weakAgainst: defensive.weakTo,
    resistantTo: defensive.resistantTo,
    immuneTo: defensive.immuneTo
  }
}

// ============================================
// FUNCIÓN: OBTENER COLOR DEL TIPO
// ============================================

/**
 * Devuelve el color asociado a cada tipo para el frontend
 * (Colores oficiales en los juegos de pokemon)
 */

const TYPE_COLORS = {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  electric: '#F8D030',
  grass: '#78C850',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0',
  fairy: '#EE99AC'
}

function getTypeColor(type) {
  return TYPE_COLORS[type] || '#777777' //Gris por defecto
}

// ============================================
// EXPORTAR FUNCIONES
// ============================================

module.exports = {
  TYPE_CHART,
  DEFENSIVE_CHART,
  calculateTypeRelations,
  calculateOffensiveEffectiveness,
  calculateDefensiveEffectiveness,
  getTypeColor
}