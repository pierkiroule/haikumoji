import { motion } from 'framer-motion'

// Composant pour visualiser une étoile collaborative comme réseau de triangles superposés
export default function StarNetwork({ contributions, size = 60, showEmojis = true }) {
  if (!contributions || contributions.length === 0) {
    return null
  }

  // Extraire tous les triangles
  const triangles = contributions.map(c => c.triangle).filter(t => t && t.length === 3)
  
  if (triangles.length === 0) return null

  const svgSize = size
  const center = svgSize / 2
  const radius = size * 0.35 // Rayon pour positionner les émojis
  
  // Calculer la rotation pour chaque triangle afin de créer une étoile
  const getRotation = (index) => {
    if (triangles.length === 1) return 0
    if (triangles.length === 2) return index * 180 // Étoile de David
    return index * (360 / triangles.length) // Distribution équitable
  }

  // Positionner un emoji sur un triangle à une position donnée (0 = haut, 1 = bas gauche, 2 = bas droite)
  const getEmojiPosition = (triangleRotation, emojiIndex) => {
    // Angles de base pour un triangle équilatéral (haut, bas-gauche, bas-droite)
    const baseAngles = [-90, 150, 30] // En degrés
    const angle = (baseAngles[emojiIndex] + triangleRotation) * (Math.PI / 180)
    
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle)
    }
  }

  return (
    <svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`} className="max-w-full">
      <defs>
        <linearGradient id={`starGradient-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.8" />
        </linearGradient>
        
        <filter id={`starGlow-${size}`}>
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Centre lumineux */}
      <motion.circle
        cx={center}
        cy={center}
        r={size * 0.08}
        fill="white"
        opacity="0.9"
        filter={`url(#starGlow-${size})`}
        animate={{
          r: [size * 0.08, size * 0.12, size * 0.08],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Dessiner les triangles superposés */}
      {triangles.map((triangle, triangleIndex) => {
        const rotation = getRotation(triangleIndex)
        const positions = [0, 1, 2].map(i => getEmojiPosition(rotation, i))

        return (
          <g key={triangleIndex}>
            {/* Lignes du triangle */}
            {[0, 1, 2].map((i) => {
              const j = (i + 1) % 3
              return (
                <motion.line
                  key={`line-${triangleIndex}-${i}`}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.6 }}
                  transition={{ delay: triangleIndex * 0.2 + i * 0.1, duration: 0.5 }}
                  x1={positions[i].x}
                  y1={positions[i].y}
                  x2={positions[j].x}
                  y2={positions[j].y}
                  stroke={`url(#starGradient-${size})`}
                  strokeWidth="1.5"
                  filter={`url(#starGlow-${size})`}
                  strokeLinecap="round"
                />
              )
            })}

            {/* Emojis si activé */}
            {showEmojis && triangle.map((emoji, emojiIndex) => {
              const pos = positions[emojiIndex]
              return (
                <motion.g
                  key={`emoji-${triangleIndex}-${emojiIndex}`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: triangleIndex * 0.2 + emojiIndex * 0.1, type: "spring" }}
                >
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={size * 0.12}
                    fill="rgba(139, 92, 246, 0.3)"
                    stroke="#a78bfa"
                    strokeWidth="1"
                    filter={`url(#starGlow-${size})`}
                  />
                  <text
                    x={pos.x}
                    y={pos.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={size * 0.18}
                  >
                    {emoji}
                  </text>
                </motion.g>
              )
            })}
          </g>
        )
      })}
    </svg>
  )
}
