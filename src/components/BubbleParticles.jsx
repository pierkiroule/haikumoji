import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * BubbleParticles - Effet de particules de bulles flottantes
 * Pour le "souffleur de rêve"
 */
export default function BubbleParticles({ active = false, count = 25, continuous = false }) {
  const [particles, setParticles] = useState([])
  const nextIdRef = useRef(0)

  useEffect(() => {
    if (!active) {
      setParticles([])
      return
    }

    // Générer la première vague de particules
    const initialParticles = generateParticles(count)
    setParticles(initialParticles)

    if (!continuous) return

    // Mode continu : ajouter des bulles périodiquement
    const interval = setInterval(() => {
      setParticles(prev => {
        // Garder seulement les particules récentes (moins de 8 secondes)
        const now = Date.now()
        const kept = prev.filter(p => now - p.createdAt < 8000)
        // Ajouter 3-5 nouvelles bulles
        const newCount = 3 + Math.floor(Math.random() * 3)
        const newParticles = generateParticles(newCount)
        return [...kept, ...newParticles]
      })
    }, 800)

    return () => clearInterval(interval)
  }, [active, count, continuous])

  function generateParticles(n) {
    return Array.from({ length: n }, () => {
      const id = nextIdRef.current++
      return {
        id: `bubble-${id}`,
        createdAt: Date.now(),
        // Position de départ aléatoire autour du centre
        x: 50 + (Math.random() - 0.5) * 40,
        y: 50 + (Math.random() - 0.5) * 40,
        // Taille aléatoire
        size: 6 + Math.random() * 28,
        // Délai d'animation
        delay: Math.random() * 0.5,
        // Durée d'animation
        duration: 4 + Math.random() * 3,
        // Direction aléatoire avec mouvement latéral
        dx: (Math.random() - 0.5) * 80,
        dy: -60 - Math.random() * 120,
        // Rotation
        rotation: Math.random() * 360,
        // Couleurs variées (bleu clair, cyan, violet clair)
        color: Math.random() > 0.7 ? 'purple' : Math.random() > 0.5 ? 'cyan' : 'blue',
      }
    })
  }

  if (!active) return null

  const getGradient = (color) => {
    switch (color) {
      case 'purple':
        return 'radial-gradient(circle at 30% 30%, rgba(196, 181, 253, 0.9), rgba(147, 51, 234, 0.5))'
      case 'cyan':
        return 'radial-gradient(circle at 30% 30%, rgba(165, 243, 252, 0.9), rgba(34, 211, 238, 0.5))'
      default:
        return 'radial-gradient(circle at 30% 30%, rgba(191, 219, 254, 0.9), rgba(96, 165, 250, 0.5))'
    }
  }

  return (
    <div 
      className="absolute inset-0 pointer-events-none overflow-hidden rounded-full"
      style={{ zIndex: 10 }}
    >
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
              background: getGradient(particle.color),
              boxShadow: `0 0 ${particle.size * 0.5}px rgba(147, 197, 253, 0.7), inset -2px -2px 6px rgba(255, 255, 255, 0.6)`,
              border: '1px solid rgba(255, 255, 255, 0.3)',
            }}
            initial={{ 
              opacity: 0, 
              scale: 0,
              x: 0,
              y: 0,
              rotate: 0,
            }}
            animate={{
              opacity: [0, 0.9, 0.7, 0],
              scale: [0, 1, 1.3, 0.9],
              x: [0, particle.dx * 0.3, particle.dx],
              y: [0, particle.dy * 0.5, particle.dy],
              rotate: [particle.rotation, particle.rotation + 180],
            }}
            exit={{
              opacity: 0,
              scale: 0,
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              ease: "easeOut",
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
