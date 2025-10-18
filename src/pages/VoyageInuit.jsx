import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { GUIDES_INUITS, getGuideByNumber } from '../data/guidesInuits.js'
import { getUser, saveUser, getMoonIndex, setMoonIndex } from '../utils/storage.js'

export default function VoyageInuit() {
  const [currentMoon, setCurrentMoon] = useState(1)
  const [selectedGuide, setSelectedGuide] = useState(null)
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    let u = getUser()
    if (!u) {
      u = saveUser({ id: 'user-' + Date.now(), name: 'Voyageur Anonyme' })
    }
    setUser(u)
    
    const moon = getMoonIndex()
    setCurrentMoon(moon)
  }, [])

  const currentGuide = getGuideByNumber(currentMoon)
  const unlockedGuides = GUIDES_INUITS.filter(g => g.number <= currentMoon)
  const nextGuide = getGuideByNumber(currentMoon + 1)

  const handleCompleteStep = () => {
    if (currentMoon < 12) {
      const newMoon = currentMoon + 1
      setMoonIndex(newMoon)
      setCurrentMoon(newMoon)
      setSelectedGuide(null)
    }
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="text-6xl mb-4">❄️🌌🐋</div>
        <h1 className="text-4xl md:text-5xl font-bold text-white">
          Voyage Inuit
        </h1>
        <p className="text-xl text-cyan-300">
          Odyssée glaciale des rêves arctiques
        </p>
        <div className="text-slate-300">
          Lune {currentMoon} / 12 • Progression {Math.round((currentMoon / 12) * 100)}%
        </div>
      </motion.div>

      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        className="rounded-full h-4 bg-white/10 overflow-hidden"
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(currentMoon / 12) * 100}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"
        />
      </motion.div>

      {/* Current Guide */}
      {currentGuide && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl glass-strong border border-cyan-500/30 p-8 space-y-6"
        >
          <div className="flex items-start gap-6">
            <div className="text-7xl">{currentGuide.emoji}</div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-3xl font-bold text-white">
                  {currentGuide.name}
                </h2>
                <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-sm border border-cyan-500/30">
                  Lune {currentGuide.number}
                </span>
              </div>
              <p className="text-xl text-cyan-300 mb-3">{currentGuide.title}</p>
              <p className="text-slate-300 leading-relaxed">{currentGuide.story}</p>
            </div>
          </div>

          {/* Teaching */}
          <div className="rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 p-6 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-3xl">📖</span>
              <h3 className="text-2xl font-bold text-white">
                {currentGuide.teaching.title}
              </h3>
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="text-sm font-semibold text-cyan-300 mb-1">Enseignement</div>
                <p className="text-slate-200 leading-relaxed">
                  {currentGuide.teaching.description}
                </p>
              </div>
              
              <div>
                <div className="text-sm font-semibold text-cyan-300 mb-1">Pratique</div>
                <p className="text-slate-200 leading-relaxed">
                  {currentGuide.teaching.practice}
                </p>
              </div>
              
              <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                <div className="text-sm font-semibold text-purple-300 mb-2">💫 Sagesse</div>
                <p className="text-white italic leading-relaxed">
                  "{currentGuide.teaching.wisdom}"
                </p>
              </div>
            </div>
          </div>

          {/* Symboles */}
          <div>
            <div className="text-sm font-semibold text-slate-400 mb-2">Symboles sacrés</div>
            <div className="flex gap-3">
              {currentGuide.symbolEmojis.map((emoji, i) => (
                <div
                  key={i}
                  className="w-16 h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl"
                >
                  {emoji}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-white/10">
            <button
              onClick={() => navigate('/tirage')}
              className="flex-1 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-6 py-4 font-semibold hover:shadow-lg transition-all"
            >
              🔮 Tirer mes émojis
            </button>
            {currentMoon < 12 && (
              <button
                onClick={handleCompleteStep}
                className="flex-1 rounded-xl glass-strong border border-emerald-500/30 text-white px-6 py-4 font-semibold hover:border-emerald-500/50 transition-all"
              >
                ✅ Terminer cette lune
              </button>
            )}
          </div>

          {nextGuide && currentMoon < 12 && (
            <div className="text-center text-sm text-slate-500">
              Prochaine rencontre : {nextGuide.name} - {nextGuide.title}
            </div>
          )}
        </motion.div>
      )}

      {/* Guides Timeline */}
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-2">
            🗺️ Chronologie des Guides
          </h3>
          <p className="text-slate-400">
            {unlockedGuides.length} / 12 guides rencontrés
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {GUIDES_INUITS.map((guide) => {
            const isUnlocked = guide.number <= currentMoon
            const isCurrent = guide.number === currentMoon
            
            return (
              <motion.div
                key={guide.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: guide.number * 0.05 }}
                onClick={() => isUnlocked && setSelectedGuide(guide)}
                className={`rounded-2xl p-4 cursor-pointer transition-all duration-300 ${
                  isCurrent 
                    ? 'glass-strong border-2 border-cyan-500 shadow-lg shadow-cyan-500/20' 
                    : isUnlocked
                    ? 'glass border border-white/20 hover:border-white/40'
                    : 'glass border border-white/10 opacity-40 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`text-4xl ${isUnlocked ? '' : 'filter grayscale'}`}>
                    {guide.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-slate-400">
                        Lune {guide.number}
                      </span>
                      {isCurrent && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300">
                          Actuelle
                        </span>
                      )}
                    </div>
                    <div className="font-semibold text-white truncate">
                      {guide.name}
                    </div>
                    <div className="text-xs text-slate-400 truncate">
                      {guide.title}
                    </div>
                  </div>
                  {!isUnlocked && (
                    <div className="text-xl">🔒</div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Guide Detail Modal */}
      <AnimatePresence>
        {selectedGuide && selectedGuide.number !== currentMoon && (
          <GuideDetailModal
            guide={selectedGuide}
            onClose={() => setSelectedGuide(null)}
          />
        )}
      </AnimatePresence>

      {/* Completion Message */}
      {currentMoon === 12 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/30 p-8 text-center space-y-4"
        >
          <div className="text-6xl mb-4">🎉🌟✨</div>
          <h3 className="text-3xl font-bold text-white">
            Félicitations, Voyageur !
          </h3>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Vous avez complété votre odyssée glaciale inuite. Les 12 gardiens vous ont transmis leurs sagesses ancestrales. 
            Votre santé onirique s'est enrichie de cette culture millénaire.
          </p>
          <button
            onClick={() => navigate('/')}
            className="rounded-2xl bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-8 py-4 font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            🌌 Explorer d'autres voyages
          </button>
        </motion.div>
      )}
    </div>
  )
}

function GuideDetailModal({ guide, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl glass-strong border border-white/20 p-8 space-y-6"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="text-6xl">{guide.emoji}</div>
            <div>
              <h2 className="text-2xl font-bold text-white">{guide.name}</h2>
              <p className="text-cyan-300">{guide.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-2xl text-slate-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <p className="text-slate-300 leading-relaxed">{guide.story}</p>

        <div className="rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 p-6 space-y-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span>📖</span>
            {guide.teaching.title}
          </h3>
          
          <div>
            <div className="text-sm font-semibold text-cyan-300 mb-1">Enseignement</div>
            <p className="text-slate-200">{guide.teaching.description}</p>
          </div>
          
          <div>
            <div className="text-sm font-semibold text-cyan-300 mb-1">Pratique</div>
            <p className="text-slate-200">{guide.teaching.practice}</p>
          </div>
          
          <div className="rounded-xl bg-white/5 p-4">
            <div className="text-sm font-semibold text-purple-300 mb-2">💫 Sagesse</div>
            <p className="text-white italic">"{guide.teaching.wisdom}"</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full rounded-xl glass-strong px-6 py-3 text-white hover:border-white/30 transition-all"
        >
          Fermer
        </button>
      </motion.div>
    </motion.div>
  )
}
