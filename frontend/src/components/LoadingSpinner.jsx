import './LoadingSpinner.css'

/**
 * Componente de loading con Master Ball animada
 * Se ve profesional y temático de Pokémon
 */
function LoadingSpinner({ size = 'medium' }) {
  return (
    <div className={`loading-spinner loading-spinner--${size}`}>
      <img
        src="https://images.wikidexcdn.net/mwuploads/wikidex/b/b7/latest/20241009141717/Master_Ball_GO.png"
        alt="Loading..."
        className="pokeball-image"
      />
    </div>
  )
}

export default LoadingSpinner
