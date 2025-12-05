import { useState, useEffect, useRef } from 'react'
import { searchPokemon, getPokemonDetails } from '../services/pokemonService'
import './SearchBar.css'

/**
 * Componente de búsqueda con autocompletado
 * 
 * ¿Qué hace?
 * - Muestra un input de búsqueda
 * - Mientras escribes, busca pokémon que coincidan
 * - Muestra sugerencias en un dropdown
 * - Al hacer click en una sugerencia, obtiene los detalles completos
 * - Envía esos detalles al componente padre mediante onSelectPokemon
 */

function SearchBar({ onSelectPokemon }) {
  // ============================================
  // ESTADO DEL COMPONENTE
  // ============================================

  const [searchTerm, setSearchTerm] = useState('') //Lo que el usuario escribe
  const [suggestions, setSuggestions] = useState([]) //Lista de sugerencias
  const [showSuggestions, setShowSuggestions] = useState(false) //Mostrar/ocultar sugerencias
  const [isLoading, setIsLoading] = useState(false)
  const justSelectedRef = useRef(false) //Bandera para evitar búsqueda después de selección (usa ref en lugar de estado)

  // ============================================
  // EFECTO: BÚSQUEDA CON DEBOUNCE
  // ============================================
  
  /**
   * ¿Qué es debounce?
   * Es una técnica para NO hacer una petición por cada tecla que el usuario presiona.
   * 
   * Sin debounce:
   * Usuario escribe "pikachu" → 7 peticiones (p, pi, pik, pika, pikac, pikach, pikachu)
   * 
   * Con debounce:
   * Esperamos 300ms después de que el usuario DEJA de escribir → 1 petición
   */

  useEffect(() => {
    //Si acabamos de seleccionar un pokémon, no buscar
    if (justSelectedRef.current) {
      justSelectedRef.current = false
      return
    }

    //Si escribió menos de 2 caracteres, no buscar
    if (searchTerm.length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    //Esperar 300ms después de que el usuario deja de escribir
    const timeoutId = setTimeout(async () => {
      try {
        setIsLoading(true);

        //Hacer la búsqueda
        const results = await searchPokemon(searchTerm);

        setSuggestions(results);
        setShowSuggestions(true);

      } catch (error) {
        console.error('Error en búsqueda:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);  //300ms de delay

    //Cleanup: Si el usuario sigue escribiendo, cancelar el timeout anterior
    return () => clearTimeout(timeoutId);

  }, [searchTerm]);  //Se ejecuta cada vez que searchTerm cambia

  // ============================================
  // MANEJADORES DE EVENTOS
  // ============================================
  
  /**
   * Cuando el usuario selecciona un pokémon de las sugerencias
   */
  const handleSelectPokemon = async (pokemonName) => {
    try {
      //Marcar que acabamos de seleccionar para evitar que el useEffect busque
      justSelectedRef.current = true

      //Actualiza el input con el nombre seleccionado
      setSearchTerm(pokemonName)

      //Oculta las sugerencias
      setShowSuggestions(false)

      //Limpiar las sugerencias para evitar que se vuelvan a mostrar
      setSuggestions([])

      //Obtener los detalles completos del pokemon
      setIsLoading(true)
      const pokemonDetails = await getPokemonDetails(pokemonName)

      //Enviar los detalles al componente padre (App.jsx)
      onSelectPokemon(pokemonDetails)
    } catch (error) {
      console.error('Error obteniendo detalles:', error)
      alert('Error al cargar el pokémon. Intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Cuando el usuario hace click en el input
   */
  const handleInputFocus = () => {
    // Si hay sugerencias, mostrarlas
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  /**
   * Cuando el usuario presiona Enter en el input
   */
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && suggestions.length > 0) {
      //Seleccionar la primera sugerencia
      handleSelectPokemon(suggestions[0].name)
    }
  }

  // ============================================
  // RENDERIZADO
  // ============================================

  return (
    <div className="search-container">
      <div className="search-input-wrapper">
        <input 
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={handleInputFocus}
        onKeyPress={handleKeyPress}
        placeholder="Buscar Pokémon..."
        className="search-input"
        />

        {/*Indicador de carga*/}
        {isLoading && (
          <div className="search-loading">
            🔄
          </div>
        )}
      </div>

      {/* Dropdown de sugerencias */}
      {showSuggestions && suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((pokemon) => (
            <li key={pokemon.pokedexNumber} onClick={() => handleSelectPokemon(pokemon.name)} className="suggestion-item">
              <img src={pokemon.sprite} alt={pokemon.name} className="suggestion-sprite" />
              <div className="suggestion-info">
                <span className="suggestion-number">#{pokemon.pokedexNumber}</span>
                <span className="suggestion-name">{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/*Mensaje cuando no hay resultados*/}
      {showSuggestions && suggestions.length === 0 && searchTerm.length >= 2 && !isLoading && (
        <div className="no-results">
          No se encontraron pokémon con "{searchTerm}"
        </div>
      )}
    </div>
  )
}

export default SearchBar