import './PokemonProfile.css'

/**
 * Componente que muestra el perfil completo de un pokémon
 * 
 * Props:
 * - pokemon: objeto con todos los datos del pokémon
 */

function PokemonProfile({ pokemon }) {
  //Si no hay pokemon seleccionado, mostrar mensaje
  if (!pokemon) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🔍</div>
        <h2>¡Busca un Pokémon!</h2>
        <p>Usa el buscador de arriba para encontrar información sobre cualquier Pokémon</p>
      </div>
    )
  }

  // ============================================
  // FUNCIONES AUXILIARES
  // ============================================
  /**
  * Obtiene el color según el tipo del pokémon
  */

  const getTypeColor = (type) => {
    const colors = {
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
    return colors[type] || '#777'
  }

    /**
  * Obtiene el icono según el tipo del pokémon
  */
  const getTypeIcon = (type) => {
    const icons = {
      normal: 'https://duiker101.github.io/pokemon-type-svg-icons/icons/normal.svg',
      fighting: 'https://duiker101.github.io/pokemon-type-svg-icons/icons/fighting.svg',
      flying: 'https://duiker101.github.io/pokemon-type-svg-icons/icons/flying.svg',
      poison: 'https://duiker101.github.io/pokemon-type-svg-icons/icons/poison.svg',
      ground: 'https://duiker101.github.io/pokemon-type-svg-icons/icons/ground.svg',
      rock: 'https://duiker101.github.io/pokemon-type-svg-icons/icons/rock.svg',
      bug: 'https://duiker101.github.io/pokemon-type-svg-icons/icons/bug.svg',
      ghost: 'https://duiker101.github.io/pokemon-type-svg-icons/icons/ghost.svg',
      steel: 'https://duiker101.github.io/pokemon-type-svg-icons/icons/steel.svg',
      fire: 'https://duiker101.github.io/pokemon-type-svg-icons/icons/fire.svg',
      water: 'https://duiker101.github.io/pokemon-type-svg-icons/icons/water.svg',
      grass: 'https://duiker101.github.io/pokemon-type-svg-icons/icons/grass.svg',
      electric: 'https://duiker101.github.io/pokemon-type-svg-icons/icons/electric.svg',
      psychic: 'https://duiker101.github.io/pokemon-type-svg-icons/icons/psychic.svg',
      ice: 'https://duiker101.github.io/pokemon-type-svg-icons/icons/ice.svg',
      dragon: 'https://duiker101.github.io/pokemon-type-svg-icons/icons/dragon.svg',
      dark: 'https://duiker101.github.io/pokemon-type-svg-icons/icons/dark.svg',
      fairy: 'https://duiker101.github.io/pokemon-type-svg-icons/icons/fairy.svg'
    }
    return icons[type] || ''
  }


  // ============================================
  // RENDERIZADO
  // ============================================

  return (
    <div className="pokemon-profile">
      {/*ENCABEZADO*/}
      <div className="pokemon-header">
        <img src={pokemon.sprite} alt={pokemon.name} className="pokemon-image" />
        <div className="pokemon-title">
          <h1 className="pokemon-name">{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h1>
          <p className="pokemon-number">#{String(pokemon.pokedexNumber).padStart(3, '0')}</p>
        </div>
      </div>

      {/*TIPOS*/}
      <div className="pokemon-section">
        <h3 className="section-title">Tipos</h3>
        <div className="type-badges">
          {pokemon.types.map((type) => (
            <span className="type-badge" key={type} style={{ backgroundColor: getTypeColor(type) }}>
              <img src={getTypeIcon(type)} alt={type} className="type-icon"/>
              {type.toUpperCase()}
            </span>
          ))}
        </div>
      </div>

      {/*EFECTIVIDAD*/}
      <div className="pokemon-section effectiveness-section">
        {/*FUERTE CONTRA*/}
        <div className="effectiveness-group">
          <h3 className="section-title strong-title">💪 Fuerte Contra</h3>
          <p className="effectiveness-description">
            Este Pokémon hace <strong>daño x2</strong> contra:
          </p>
          <div className="type-list">
            {pokemon.strongAgainst && pokemon.strongAgainst.length > 0 ? (
              pokemon.strongAgainst.map((type) => (
                <span className="type-badge type-small" key={type} style={{ backgroundColor: getTypeColor(type) }}>
                  <img src={getTypeIcon(type)} alt={type} className="type-icon-small"/>
                  {type}
                </span>
              ))
            ) : (
              <p className="no-types">No tiene ventajas ofensivas especiales</p>
            )}
          </div>
        </div>

        {/*DEBIL CONTRA*/}
        <div className="effectiveness-group">
          <h3 className="section-title weak-title">⚠️Débil Contra</h3>
          <p className="effectiveness-description">
            Este Pokémon recibe <strong>daño x2</strong> de:
          </p>
          <div className="type-list">
            {pokemon.weakAgainst && pokemon.weakAgainst.length > 0 ? (
              pokemon.weakAgainst.map((type) => (
                <span className="type-badge type-small" key={type} style={{ backgroundColor: getTypeColor(type) }}>
                  <img src={getTypeIcon(type)} alt={type} className="type-icon-small"/>
                  {type}
                </span>
              ))
            ) : (
              <p className="no-types">No tiene debilidades</p>
            )}
          </div>
        </div>

        {/*RESISTENTE A*/}
        <div className="effectiveness-group">
          <h3 className="section-title resistant-title">🛡️ Resistente A</h3>
          <p className="effectiveness-description">
            Este Pokémon recibe <strong>daño x0.5</strong> de:
          </p>
          <div className="type-list">
            {pokemon.resistantTo && pokemon.resistantTo.length > 0 ? (
              pokemon.resistantTo.map((type) => (
                <span className="type-badge type-small" key={type} style={{ backgroundColor: getTypeColor(type) }}>
                  <img src={getTypeIcon(type)} alt={type} className="type-icon-small"/>
                  {type}
                </span>
              ))
            ) : (
              <p className="no-types">No tiene resistencias especiales</p>
            )}
          </div>
        </div>

        {/*INMUNE A*/}
        {pokemon.immuneTo && pokemon.immuneTo.length > 0 && (
          <div className="effectiveness-group">
            <h3 className="section-title immune-title">✨ Inmune A</h3>
            <p className="effectiveness-description">
              Este Pokémon <strong>NO recibe daño</strong> de:
            </p>
            <div className="type-list">
              {pokemon.immuneTo.map((type) => (
                <span className="type-badge type-small" key={type} style={{ backgroundColor: getTypeColor(type) }}>
                  <img src={getTypeIcon(type)} alt={type} className="type-icon-small"/>
                  {type}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/*ESTADISTICAS*/}
      <div className="pokemon-section">
        <h3 className="section-title">📊Estadísticas Base</h3>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-name">💗HP</span>
            <span className="stat-value">{pokemon.stats.hp}</span>
          </div>
          <div className="stat-item">
            <span className="stat-name">⚔️Ataque</span>
            <span className="stat-value">{pokemon.stats.attack}</span>
          </div>
          <div className="stat-item">
            <span className="stat-name">🛡️Defensa</span>
            <span className="stat-value">{pokemon.stats.defense}</span>
          </div>
          <div className="stat-item">
            <span className="stat-name">⭐At. Esp.</span>
            <span className="stat-value">{pokemon.stats.specialAttack}</span>
          </div>
          <div className="stat-item">
            <span className="stat-name">🛡️Def. Esp.</span>
            <span className="stat-value">{pokemon.stats.specialDefense}</span>
          </div>
          <div className="stat-item">
            <span className="stat-name">⚡Velocidad</span>
            <span className="stat-value">{pokemon.stats.speed}</span>
          </div>
        </div>
      </div>

      {/*INFO FÍSICA*/}
      <div className="pokemon-section">
        <h3 className="section-title">📄Información</h3>
        <div className="physical-info">
          <div className="info-item">
            <span className="info-label">📏Altura:</span>
            <span className="info-value">{pokemon.height / 10}m</span>
          </div>
          <div className="info-item">
            <span className="info-label">⚖️Peso:</span>
            <span className="info-value">{pokemon.weight / 10}kg</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PokemonProfile;