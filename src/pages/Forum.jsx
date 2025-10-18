import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getDreams, seedIfEmpty, getUser } from '../utils/storage.js'
import OnimojiTriad from '../components/OnimojiTriad.jsx'

export default function Forum() {
  const [onimojis, setOnimojis] = useState([])
  const [selectedOnimoji, setSelectedOnimoji] = useState(null)
  const [enrichments, setEnrichments] = useState({})
  const [newEnrichment, setNewEnrichment] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    seedIfEmpty()
    setOnimojis(getDreams())
    setUser(getUser())
    
    // Load enrichments from localStorage
    const saved = localStorage.getItem('onimoji_enrichments')
    if (saved) {
      setEnrichments(JSON.parse(saved))
    }
  }, [])

  const handleAddEnrichment = (onimojiId) => {
    if (!newEnrichment.trim() || !user) return

    const newEnrichments = {
      ...enrichments,
      [onimojiId]: [
        ...(enrichments[onimojiId] || []),
        {
          id: Date.now(),
          text: newEnrichment,
          author: user.name,
          date: new Date().toISOString()
        }
      ]
    }

    setEnrichments(newEnrichments)
    localStorage.setItem('onimoji_enrichments', JSON.stringify(newEnrichments))
    setNewEnrichment('')
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="text-6xl mb-4">💬</div>
        <h1 className="text-3xl md:text-4xl font-bold text-white">
          Forum de Co-Création
        </h1>
        <p className="text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Partagez vos onimojis et enrichissez-les collectivement. 
          Ensemble, créons des versions augmentées par la sagesse humaine.
        </p>
      </motion.div>

      {/* Onimojis Feed */}
      <div className="grid gap-6">
        {onimojis.map((onimoji, index) => (
          <motion.div
            key={onimoji.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="rounded-2xl glass-strong border border-white/20 p-6 shadow-card hover:shadow-card-hover transition-all duration-300"
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start gap-4">
                <OnimojiTriad emojis={onimoji.emojis} size={80} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-white font-medium">{onimoji.author}</span>
                    <span className="text-xs text-slate-500">•</span>
                    <span className="text-xs text-slate-500">
                      {new Date(onimoji.timestamp).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <div className="text-sm text-slate-400">
                    {onimoji.emojis.join(' ')}
                  </div>
                </div>
              </div>

              {/* Script original */}
              <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                <pre className="whitespace-pre-wrap text-slate-200 leading-relaxed text-sm">
                  {onimoji.text}
                </pre>
              </div>

              {/* Enrichissements */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white">
                    💎 Enrichissements ({(enrichments[onimoji.id] || []).length})
                  </h3>
                  <button
                    onClick={() => setSelectedOnimoji(
                      selectedOnimoji === onimoji.id ? null : onimoji.id
                    )}
                    className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    {selectedOnimoji === onimoji.id ? '− Réduire' : '+ Ajouter'}
                  </button>
                </div>

                {/* Liste des enrichissements */}
                <AnimatePresence>
                  {(enrichments[onimoji.id] || []).map((enrich) => (
                    <motion.div
                      key={enrich.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3"
                    >
                      <div className="flex items-start gap-2">
                        <div className="text-emerald-400 text-xs mt-1">✨</div>
                        <div className="flex-1">
                          <p className="text-sm text-slate-200">{enrich.text}</p>
                          <p className="text-xs text-slate-500 mt-1">
                            — {enrich.author}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Formulaire d'enrichissement */}
                <AnimatePresence>
                  {selectedOnimoji === onimoji.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2"
                    >
                      <textarea
                        value={newEnrichment}
                        onChange={(e) => setNewEnrichment(e.target.value)}
                        placeholder="Proposez une amélioration, une variante, une métaphore complémentaire..."
                        className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors resize-none"
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedOnimoji(null)}
                          className="px-4 py-2 rounded-lg glass text-sm text-white hover:glass-strong transition-all"
                        >
                          Annuler
                        </button>
                        <button
                          onClick={() => handleAddEnrichment(onimoji.id)}
                          disabled={!newEnrichment.trim() || !user}
                          className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-sm font-medium hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                          ✨ Enrichir
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        ))}

        {onimojis.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 text-slate-400"
          >
            <div className="text-6xl mb-4">🌙</div>
            <p>Aucun onimoji partagé pour le moment.</p>
            <p className="text-sm mt-2">Soyez le premier à partager votre voyage !</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
