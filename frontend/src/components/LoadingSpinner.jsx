import { useEffect, useState } from 'react'
import './LoadingSpinner.css'

/**
 * Componente de loading con Master Ball (modo claro) o Ultra Ball (modo oscuro)
 * Se ve profesional y temático de Pokémon
 */
function LoadingSpinner({ size = 'medium' }) {
  const [isDarkMode, setIsDarkMode] = useState(false)

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

  const pokeballImage = isDarkMode
    ? "https://images.wikidexcdn.net/mwuploads/wikidex/thumb/f/f3/latest/20210504000522/Ultra_Ball_GO.png/60px-Ultra_Ball_GO.png"
    : "https://images.wikidexcdn.net/mwuploads/wikidex/b/b7/latest/20241009141717/Master_Ball_GO.png"

  return (
    <div className={`loading-spinner loading-spinner--${size}`}>
      <img
        src={pokeballImage}
        alt="Loading..."
        className="pokeball-image"
      />
    </div>
  )
}

export default LoadingSpinner
