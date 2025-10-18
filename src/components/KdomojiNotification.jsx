import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function KdomojiNotification({ kdomoji, onClose, onViewDetails }) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Auto-dismiss après 8 secondes si pas d'interaction
    const timer = setTimeout(() => {
      handleClose()
    }, 8000)

    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300) // Attendre la fin de l'animation
  }

  if (!kdomoji) return null

  const rarityColors = {
    common: 'from-blue-500/20 to-cyan-500/20 border-blue-500/50',
    rare: 'from-purple-500/20 to-pink-500/20 border-purple-500/50',
    epic: 'from-orange-500/20 to-red-500/20 border-orange-500/50',
    legendary: 'from-yellow-500/20 to-amber-500/20 border-yellow-500/50',
  }

  const rarityGlow = {
    common: '0 0 20px rgba(59, 130, 246, 0.3)',
    rare: '0 0 30px rgba(168, 85, 247, 0.4)',
    epic: '0 0 40px rgba(249, 115, 22, 0.5)',
    legendary: '0 0 50px rgba(234, 179, 8, 0.6)',
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.95 }}
          transition={{ type: 'spring', damping: 15 }}
          className="fixed top-4 right-4 z-50 max-w-md"
          style={{ boxShadow: rarityGlow[kdomoji.rarity] }}
        >
          <div className={`rounded-2xl glass-strong border-2 bg-gradient-to-br ${rarityColors[kdomoji.rarity]} p-6 space-y-4`}>
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <motion.div
                  className="text-5xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {kdomoji.emoji}
                </motion.div>
                <div>
                  <div className="text-xs text-purple-300 font-semibold uppercase tracking-wide">
                    Kdomoji - Cadeau du Cosmoji
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    {kdomoji.title}
                  </h3>
                  <div className="text-xs text-slate-400 capitalize">
                    {kdomoji.rarity}
                  </div>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-full glass border border-white/20 flex items-center justify-center text-white hover:border-white/40 transition-all"
              >
                ✕
              </button>
            </div>

            {/* Message */}
            <p className="text-white text-sm leading-relaxed">
              {kdomoji.message}
            </p>

            {/* Resource Type Badge */}
            <div className="flex items-center gap-2">
              <div className="px-3 py-1 rounded-full glass border border-white/20 text-xs text-purple-300 font-semibold">
                {getResourceTypeIcon(kdomoji.resourceType)} {getResourceTypeLabel(kdomoji.resourceType)}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => onViewDetails(kdomoji)}
                className="flex-1 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-4 py-2 font-semibold text-sm hover:shadow-lg transition-all"
              >
                ✨ Découvrir le cadeau
              </button>
              <button
                onClick={handleClose}
                className="px-4 py-2 rounded-xl glass border border-white/20 text-white text-sm font-semibold hover:border-white/40 transition-all"
              >
                Plus tard
              </button>
            </div>

            {/* Sparkles animation */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full bg-yellow-300"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function getResourceTypeIcon(type) {
  const icons = {
    audio: '🎵',
    visual: '🎨',
    text: '📖',
    technique: '🧘',
    achievement: '🏆',
  }
  return icons[type] || '✨'
}

function getResourceTypeLabel(type) {
  const labels = {
    audio: 'Audio',
    visual: 'Visuel',
    text: 'Texte',
    technique: 'Technique',
    achievement: 'Succès',
  }
  return labels[type] || 'Ressource'
}
