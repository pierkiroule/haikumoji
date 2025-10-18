import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { getSelectedTriplet, setSelectedTriplet, seedIfEmpty } from '../utils/storage.js'
import { incrementKdomojiStat } from '../utils/kdomojiManager.js'
import { useKdomoji } from '../components/KdomojiProvider.jsx'
import FloatingEmojiSelector from '../components/FloatingEmojiSelector.jsx'

// Liste des émojis populaires pour le tirage
const EMOJIS = [
  '🌙', '⭐', '✨', '🔮', '🌟', '💫',
  '🦉', '🐺', '🦌', '🐋', '🦅', '🐻',
  '❄️', '🌊', '🔥', '🌿', '🌸', '🍃',
  '🏔️', '🌲', '🌌', '☁️', '🌈', '💎',
  '🎨', '🎭', '🎪', '🎯', '🎲', '🎼'
]

export default function TirageSimple() {
  const [selected, setSelected] = useState([])
  const [showSelector, setShowSelector] = useState(true)
  const navigate = useNavigate()
  const { showKdomoji } = useKdomoji()

  useEffect(() => {
    seedIfEmpty()
    const saved = getSelectedTriplet()
    if (saved && saved.length === 3) {
      setSelected(saved)
      setShowSelector(false)
    }
  }, [])

  const handleSelectionComplete = (selection) => {
    setSelected(selection)
    setSelectedTriplet(selection)
    
    setTimeout(() => {
      setShowSelector(false)
    }, 3000)
    
    const newKdomojis = incrementKdomojiStat('trianglesCueilli')
    newKdomojis.forEach(k => showKdomoji(k))
  }

  const handleContinue = () => {
    navigate('/')
  }

  const handleReset = () => {
    setSelected([])
    setSelectedTriplet([])
    setShowSelector(true)
  }

  return (
    <div className="space-y-8 pb-16">
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
          Les émojis flottent dans le cercle sacré. 
          Sélectionnez 3 qui résonnent avec vous pour former votre triangle et éveiller l'esprit.
        </p>
      </motion.div>

      {/* Floating Emoji Selector */}
      <AnimatePresence mode="wait">
        {showSelector && (
          <motion.div
            key="selector"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <FloatingEmojiSelector 
              emojis={EMOJIS} 
              onSelectionComplete={handleSelectionComplete}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actions après sélection */}
      <AnimatePresence>
        {!showSelector && selected.length === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col gap-4 items-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleContinue}
              className="rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Retour à l'accueil ✧
            </motion.button>
            <button
              onClick={handleReset}
              className="text-slate-400 hover:text-slate-300 text-sm"
            >
              Choisir un nouveau triangle
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
