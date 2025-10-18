import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { getSelectedTriplet, saveSelectedTriplet, seedIfEmpty, computeEmojiStats } from '../utils/storage.js'

// Liste des émojis populaires pour le tirage
const EMOJIS = [
  '🌙', '⭐', '✨', '🔮', '🌟', '💫',
  '🦉', '🐺', '🦌', '🐋', '🦅', '🐻',
  '❄️', '🌊', '🔥', '🌿', '🌸', '🍃',
  '🏔️', '🌲', '🌌', '☁️', '🌈', '💎',
  '🎨', '🎭', '🎪', '🎯', '🎲', '🎪'
]

export default function TirageSimple() {
  const [selected, setSelected] = useState([])
  const [showTriangle, setShowTriangle] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    seedIfEmpty()
    const saved = getSelectedTriplet()
    if (saved && saved.length === 3) {
      setSelected(saved)
      setShowTriangle(true)
    }
  }, [])

  const handleToggle = (emoji) => {
    setSelected(prev => {
      if (prev.includes(emoji)) {
        return prev.filter(e => e !== emoji)
      } else if (prev.length < 3) {
        const newSelection = [...prev, emoji]
        if (newSelection.length === 3) {
          saveSelectedTriplet(newSelection)
          setTimeout(() => setShowTriangle(true), 300)
        }
        return newSelection
      }
      return prev
    })
  }

  const handleContinue = () => {
    if (selected.length === 3) {
      navigate('/enigmes')
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="text-6xl mb-4">🔮</div>
        <h1 className="text-3xl md:text-4xl font-bold text-white">
          Tirage du Triangle Onirique
        </h1>
        <p className="text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Sélectionnez 3 émojis qui résonnent avec vous. 
          Ils formeront votre triangle sacré et réveilleront l'esprit.
        </p>
      </motion.div>

      {/* Selection Counter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center gap-3"
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl border-2 transition-all duration-300 ${
              selected[i] 
                ? 'bg-gradient-to-br from-midnight-400 to-midnight-500 border-white/30 shadow-lg' 
                : 'bg-white/5 border-white/10'
            }`}
            animate={selected[i] ? { scale: [1, 1.1, 1] } : {}}
          >
            {selected[i] || '○'}
          </motion.div>
        ))}
      </motion.div>

      {/* Emoji Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl glass-strong border border-white/20 p-6 shadow-card"
      >
        <div className="grid grid-cols-6 gap-3">
          {EMOJIS.map((emoji, i) => {
            const isSelected = selected.includes(emoji)
            const isDisabled = !isSelected && selected.length >= 3

            return (
              <motion.button
                key={emoji}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.02 }}
                whileHover={!isDisabled ? { scale: 1.2 } : {}}
                whileTap={!isDisabled ? { scale: 0.9 } : {}}
                onClick={() => !isDisabled && handleToggle(emoji)}
                disabled={isDisabled}
                className={`
                  aspect-square rounded-xl flex items-center justify-center text-3xl
                  transition-all duration-300
                  ${isSelected 
                    ? 'bg-gradient-to-br from-emerald-500 to-cyan-500 shadow-lg scale-110' 
                    : isDisabled
                    ? 'bg-white/5 opacity-30 cursor-not-allowed'
                    : 'bg-white/10 hover:bg-white/20 cursor-pointer'
                  }
                `}
              >
                {emoji}
              </motion.button>
            )
          })}
        </div>
      </motion.div>

      {/* Triangle Dansant */}
      <AnimatePresence>
        {showTriangle && selected.length === 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="rounded-2xl bg-gradient-to-br from-midnight-800 to-midnight-900 border-2 border-white/20 p-8 shadow-2xl"
          >
            <div className="text-center space-y-6">
              <h2 className="text-2xl font-bold text-white">
                Votre Triangle Sacré
              </h2>
              
              {/* Triangle Animation */}
              <div className="relative h-64 flex items-center justify-center">
                <svg width="240" height="240" viewBox="0 0 240 240" className="overflow-visible">
                  {/* Triangle vibrant */}
                  <motion.polygon
                    points="120,40 60,180 180,180"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="3"
                    animate={{
                      scale: [1, 1.05, 1],
                      rotate: [0, 2, -2, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    style={{ transformOrigin: '120px 120px' }}
                  />
                  
                  {/* Gradient */}
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#a78bfa" />
                      <stop offset="50%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                  </defs>

                  {/* Emojis aux sommets */}
                  {[
                    { emoji: selected[0], x: 120, y: 40 },
                    { emoji: selected[1], x: 60, y: 180 },
                    { emoji: selected[2], x: 180, y: 180 }
                  ].map((point, i) => (
                    <motion.g
                      key={i}
                      animate={{
                        y: [0, -8, 0],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.3,
                        ease: "easeInOut"
                      }}
                    >
                      <circle 
                        cx={point.x} 
                        cy={point.y} 
                        r="30" 
                        fill="#0ea5e9" 
                        fillOpacity="0.2"
                        stroke="#0ea5e9"
                        strokeWidth="2"
                      />
                      <text
                        x={point.x}
                        y={point.y}
                        textAnchor="middle"
                        dy="0.35em"
                        fontSize="32"
                      >
                        {point.emoji}
                      </text>
                    </motion.g>
                  ))}
                </svg>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-slate-300 text-lg"
              >
                Le triangle vibre et danse... L'esprit s'éveille ✨
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleContinue}
                className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-8 py-4 font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Rencontrer l'esprit ✧
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
