import { useState, useEffect } from "react";
import SearchBar from './components/SearchBar'
import PokemonProfile from './components/PokemonProfile'
import ThemeToggle from "./components/ThemeToggle";
import { getPokemonDetails } from "./services/pokemonService";
import './App.css'

/**
 * Componente principal de la aplicación
 * 
 * ¿Qué hace?
 * - Mantiene el estado del pokémon seleccionado
 * - Renderiza el SearchBar y el PokemonProfile
 * - Pasa datos entre componentes
 */

function App() {
  // ============================================
  // ESTADO
  // ============================================

  //Pokemon actualmente seleccionado (null al inicio)
  const [selectedPokemon, setSelectedPokemon] = useState(null)
  const [isDarkMode, setIsDarkMode] = useState(false)

  // ============================================
  // EFECTOS
  // ============================================

  useEffect(() => {
    // Verificar tema inicial
    const checkTheme = () => {
      setIsDarkMode(document.body.classList.contains('dark-mode'))
    }

    checkTheme()

    // Observer para detectar cambios en la clase del body
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    })

    return () => observer.disconnect()
  }, [])

  // ============================================
  // MANEJADORES
  // ============================================
  
  /**
   * Se ejecuta cuando el usuario selecciona un pokémon en el SearchBar
   * @param {Object} pokemon Datos completos del pokémon
   */

  const handleSelectPokemon = (pokemon) => {
    console.log('Pokémon seleccionado:', pokemon)
    setSelectedPokemon(pokemon)
  }

  const handleSelectPokemonByName = async (pokemonName) => {
    try {
      const pokemon = await getPokemonDetails(pokemonName);
      setSelectedPokemon(pokemon);
      // Scroll suave hacia arriba
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error cargando pokémon:', error);
    }
  };

  // ============================================
  // RENDERIZADO
  // ============================================

  const pokeballImage = isDarkMode
    ? "https://images.wikidexcdn.net/mwuploads/wikidex/thumb/f/f3/latest/20210504000522/Ultra_Ball_GO.png/60px-Ultra_Ball_GO.png"
    : "https://images.wikidexcdn.net/mwuploads/wikidex/b/b7/latest/20241009141717/Master_Ball_GO.png"

  return (
    <div className="app">
      {/*BOTON DE TEMA*/}
      <ThemeToggle />

      {/*HEADER*/}
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">
            <img
              src={pokeballImage}
              alt="Pokeball"
              className="pokeball-icon"
            />
            Guía de Aprendizaje Pokémon
          </h1>
          <p className="app-subtitle">
            Aprende las fortalezas y debilidades de cada Pokémon
          </p>
        </div>
      </header>

      {/*CONTENIDO PRINCIPAL*/}
      <main className="app-main">
        {/*BARRA DE BÚSQUEDA*/}
        <div className="search-section">
          <SearchBar onSelectPokemon={handleSelectPokemon}/>
        </div>

        {/*PERFIL DEL POKEMON*/}
        <div className="profile-section">
          <PokemonProfile pokemon={selectedPokemon} onSelectPokemon={handleSelectPokemonByName}/>
        </div>
      </main>

      {/*PIE DE PÁGINA*/}
      <footer className="app-footer">
        <p>
          Datos obtenidos de <a href="https://pokeapi.co" target="_blank" rel="noopener noreferrer">PokéAPI</a>
        </p>
        <p className="footer-note">
          Hecho por Lucas Leanza para aprender el stack MERN
        </p>
      </footer>
    </div>
  )
}

export default App