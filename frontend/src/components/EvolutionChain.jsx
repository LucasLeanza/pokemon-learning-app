import './EvolutionChain.css';

/**
 * Componente para mostrar la cadena evolutiva de un Pokémon
 *
 * Props:
 * - evolutions: objeto con fullChain (array de etapas), currentStage, isFinal
 * - onSelectPokemon: función para seleccionar otro pokémon
 */

function EvolutionChain({ evolutions, onSelectPokemon }) {
  // Si no hay datos de evoluciones, no mostrar nada
  if (!evolutions || !evolutions.fullChain) {
    return null;
  }

  // Si solo hay una etapa con un pokémon, no tiene evoluciones
  const hasEvolutions = evolutions.fullChain.length > 1;

  if (!hasEvolutions) {
    return (
      <div className="evolution-section">
        <h3 className="section-title">🔄 Cadena Evolutiva</h3>
        <p className="no-evolutions">
          Este Pokémon no tiene evoluciones conocidas
        </p>
      </div>
    );
  }

  // ============================================
  // FUNCIÓN: OBTENER MÉTODO DE EVOLUCIÓN
  // ============================================
  
  const getEvolutionMethodText = (method, level) => {
    switch (method) {
      case 'level':
        return level ? `Nivel ${level}` : 'Subir de nivel';
      case 'stone':
        return 'Piedra evolutiva';
      case 'trade':
        return 'Intercambio';
      case 'friendship':
        return 'Amistad';
      default:
        return 'Método especial';
    }
  };

  // ============================================
  // RENDERIZADO
  // ============================================

  return (
    <div className="evolution-section">
      <h3 className="section-title">🔄 Cadena Evolutiva</h3>

      <div className="evolution-chain">
        {evolutions.fullChain.map((stage, stageIndex) => (
          <div key={stageIndex} className="evolution-stage">
            {/* Grupo de Pokémon de esta etapa */}
            <div className="evolution-stage-group">
              {stage.map((pokemon) => (
                <div key={pokemon.pokedexNumber} className="evolution-item">
                  <div
                    className={`evolution-card ${
                      pokemon.isCurrentPokemon ? 'current' : 'clickable'
                    }`}
                    onClick={() => !pokemon.isCurrentPokemon && onSelectPokemon(pokemon.name)}
                  >
                    {pokemon.isCurrentPokemon && (
                      <div className="current-badge">Actual</div>
                    )}
                    <img
                      src={pokemon.sprite}
                      alt={pokemon.name}
                      className="evolution-sprite"
                    />
                    <p className="evolution-number">
                      #{String(pokemon.pokedexNumber).padStart(3, '0')}
                    </p>
                    <p className="evolution-name">
                      {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
                    </p>
                  </div>

                  {/* Método de evolución (solo si no es la primera etapa) */}
                  {stageIndex > 0 && pokemon.method && (
                    <div className="evolution-method">
                      {getEvolutionMethodText(pokemon.method, pokemon.level)}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Flecha hacia la siguiente etapa */}
            {stageIndex < evolutions.fullChain.length - 1 && (
              <div className="evolution-arrow">
                <span>→</span>
              </div>
            )}
          </div>
        ))}

        {/* Badge de evolución final */}
        {evolutions.isFinal && (
          <div className="final-evolution-badge">
            ✨ Evolución Final
          </div>
        )}
      </div>
    </div>
  );
}

export default EvolutionChain;