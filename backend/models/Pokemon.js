const mongoose = require('mongoose')

const pokemonSchema = new mongoose.Schema({
  //ID numérico del pokemon
  pokedexNumber: {
    type: Number,
    required: [true, 'El numero de Pokédex es obligatorio'],
    unique: true,
    min: [1, 'El numero debe ser al menos 1']
  },

  //Nombre en ingles
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    unique: true,
    lowercase: true,
    trim: true
  },

  //Tipos del pokemon
  types: {
    type: [String], //Array de Strings
    required: true,
    validate: {
      validator: function(array) {
        //Un pokemon debe tener al menos 1 tipo y máximo 2
        return array.length >= 1 && array.length <= 2;
      },
      message: 'Un Pokémon debe tener entre 1 y 2 tipos'
    }
  },
  //URL del sprite del pokemon
  sprite: {
    type: String,
    required: true
  },
  //Sprite alternativo (shiny, atrás, etc.)
  spriteShiny: {
    type: String,
    default: null
  },
  //Altura en decímetros (10 = 1 metro)
  height: {
    type: Number,
    required: true
  },
  //Peso en hectogramos (10 = 1kg)
  weight: {
    type: Number,
    required: true
  },
  //Estadisticas base del pokemon
  stats: {
    hp: {type: Number, required: true},
    attack: {type: Number, required: true},
    defense: {type: Number, required: true},
    specialAttack: {type: Number, required: true},
    specialDefense: {type: Number, required: true},
    speed: {type: Number, required: true},
  },

  //Tipos contra los que es fuerte (hace daño x2)
  strongAgainst: {
    type: [String],
    default: []
  },
  //Tipos contra los que es debil (recibe daño x2)
  weakAgainst: {
    type: [String],
    default: []
  },
  //Tipos contra los que es resistente (recibe daño x0.5)
  resistantTo: {
    type: [String],
    default: []
  },
  //Tipos contra los que es Inmune (recibe daño x0)
  immuneTo: {
    type: [String],
    default: []
  }
}, {
  //Opciones del schema
  timestamps: true, //Agrega automaticamente createdAt y updatedAt
  collection: 'pokemons' //Nombre de la colección en MongoDB
})

//INDICES PARA BÚSQUEDA RÁPIDA

//Indice de texto para busqueda por nombre
pokemonSchema.index({name: 'text'})

// //Indice simple para busqueda exacta por nombre
// pokemonSchema.index({name: 1})

// //Indice para busqueda por numero de Pokedex
// pokemonSchema.index({pokedexNumber: 1})

//METODOS VIRTUALES
/**
 * Un metodo virtual es un campo calculado que NO se guarda en la base de datos
 * pero se puede acceder a el como si fuera un campo normal.
 */

//Método virtual para obtener el nombre capitalizado
pokemonSchema.virtual('displayName').get(function() {
  return this.name.charAt(0).toUpperCase() + this.name.slice(1)
})

//Método virtual para calcular el total de stats
pokemonSchema.virtual('totalStats').get(function() {
  return this.stats.hp +
         this.stats.attack +
         this.stats.defense +
         this.stats.specialAttack +
         this.stats.specialDefense +
         this.stats.speed; 
})

//METODOS DE INSTANCIA
/**
 * Los métodos de instancia son funciones que se pueden llamar en un momento específico.
 * 
 * Ejemplo:
 * const pikachu = await Pokemon.findOne({name: 'pikachu'})
 * pikachu.getEffectivenessAgainst('water')
 */

//Metodo para obtener la efectividad contra un tipo específico
pokemonSchema.methods.getEffectivenessAgainst = function(targetType) {
  if (this.strongAgainst.includes(targetType)) {
    return 'supper-effective' //Daño x2
  }
  if (this.weakAgainst.includes(targetType)) {
    return 'not-very-effective' //Daño x0.5
  }
  if (this.immuneTo.includes(targetType)) {
    return 'no-effect' //Daño x0
  }
  return 'normal' // Daño x1
}

//METODOS ESTÁTICOS
/**
 * Los métodos estáticos son funciones que se llaman en el MODELO, no en el documento.
 * 
 * Ejemplo:
 * await Pokemon.findByType('fire')
 */


//Encontrar todos los pokemon de un tipo específico
pokemonSchema.statics.findByType = function(type) {
  return this.find({ types: type })
}

//Buscar pokemon por rango de numero
pokemonSchema.statics.findByPokedexRange = function (start, end) {
  return this.find({
    pokedexNumber: { $gte: start, $lte: end }
  })
}

//MIDDLEWARE DE MONGOOSE
/**
 * Los Middleware de Mongoose son funciones que se ejecutan automaticamente en ciertos momentos:
 * (pre-save)
 * (post-save)
 * (pre-remove)
 * etc.
 */

//Middleware pre-save
pokemonSchema.pre('save', function(next) {
  this.name = this.name.toLowerCase()

  console.log(`💾 Guardando pokémon: ${this.displayName} (#${this.pokedexNumber})`)

  next()
})

//Middleware post-save
pokemonSchema.post('save', function(doc) {
  console.log(`✅ Pokémon guardado exitosamente: ${doc.displayName}`)
})

//CONFIGURACION DE JSON
/**
 * Personalizar como se convierte el documento a JSON
 * Util para las respuestas de la API
 */
pokemonSchema.set('toJSON', {
  virtuals: true, //Incluir campos virtuales
  transform: function(doc, ret) {
    //'ret' es el objeto que se convertira a JSON

    //Eliminar campos que no quiero enviar al frontend
    delete ret.__v; //version interna de Mongoose
    
    //renombrar _id a id
    ret.id = ret._id
    delete ret._id
    
    return ret
  }
})

//CREAR Y EXPORTAR EL MODELO
/**
 * Un modelo es una clase compilada a partir del Schema
 * El modelo se usa para:
 * - Crear documentos: new Pokemon({...})
 * - Hacer queries: Pokemon.find({...})
 * - Actualizar: Pokemon.updateOne({...})
 * - Eliminar: Pokemon.deleteOne({...})
 */

const Pokemon = mongoose.model('Pokemon', pokemonSchema)

module.exports = Pokemon;