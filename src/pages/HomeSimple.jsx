import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { getUser, getSelectedTriplet, saveRitualSession, getTodayRitual } from '../utils/storage.js'
import SpiritModal from '../components/SpiritModal.jsx'
import { selectSpiritForTriangle } from '../utils/spiritSelector.js'

export default function HomeSimple() {
  const [user, setUser] = useState(null)
  const [triangle, setTriangle] = useState([])
  const [seedPhrase, setSeedPhrase] = useState('')
  const [todayRitual, setTodayRitual] = useState(null)
  const [showSeedForm, setShowSeedForm] = useState(false)
  const [showSpiritModal, setShowSpiritModal] = useState(false)
  const [selectedSpirit, setSelectedSpirit] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const u = getUser()
    setUser(u)
    setTriangle(getSelectedTriplet())
    
    const ritual = getTodayRitual()
    setTodayRitual(ritual)
    
    if (ritual && ritual.seedPhrase) {
      setSeedPhrase(ritual.seedPhrase)
    }
  }, [])

  const today = new Date().toLocaleDateString('fr-FR', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long',
    year: 'numeric'
  })

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6"
      >
        <motion.div
          animate={{
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="text-7xl mb-4"
        >
          🌘•°
        </motion.div>

        <div className="space-y-6">
          <h1 className="text-5xl md:text-6xl font-display font-light text-white tracking-wide">
            Onimoji
          </h1>
          <p className="text-xl text-cyan-300 font-light">
            Prendre soin de sa santé onirique et de celle des autres
          </p>
          <div className="text-base md:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed space-y-4 font-light">
            <p>
              Rêver, c'est respirer l'invisible.<br/>
              Chaque nuit, notre monde intérieur se tisse de symboles, d'émotions et de mémoire.
            </p>
            <p>
              Prendre soin de sa santé onirique,<br/>
              c'est écouter ces mouvements discrets du sommeil<br/>
              qui relient le corps, le cœur et le monde.
            </p>
            <p>
              Mais c'est aussi préserver les cultures du rêve :<br/>
              celles des peuples qui, depuis toujours,<br/>
              honorent le rêve comme un langage du vivant,<br/>
              un lien entre humains, nature et esprits.
            </p>
            <p className="text-cyan-200 font-medium">
              Onimoji fait revivre cette tradition.<br/>
              Un espace pour partager, explorer et réenchanter nos rêves,<br/>
              ensemble.
            </p>
            <p className="text-slate-400 italic">
              Parce qu'une société sans rêve s'éteint lentement.<br/>
              Une humanité qui rêve ensemble se réaccorde. 🌙
            </p>
          </div>
        </div>

        {/* Date du jour */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="inline-block rounded-2xl glass border border-white/20 px-6 py-3"
        >
          <div className="text-sm text-slate-400 mb-1">Aujourd'hui</div>
          <div className="text-white font-medium capitalize">{today}</div>
        </motion.div>
      </motion.div>

      {/* Triangle du jour */}
      {triangle.length === 3 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-3xl glass-strong border border-purple-500/30 p-8 space-y-6"
        >
          <div className="text-center space-y-4">
            <div className="text-sm text-purple-300 font-semibold">
              ✨ Votre Onimoji du jour
            </div>
            {/* Triangle avec bulles reliées */}
            <div className="flex justify-center py-6">
              <svg width="300" height="260" viewBox="0 0 300 260" className="max-w-full">
                <defs>
                  <linearGradient id="lineGradientHome" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.6" />
                    <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.6" />
                  </linearGradient>
                  <filter id="glowHome">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>

                {/* Les 3 lignes du triangle */}
                <motion.line
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  x1="150" y1="40" x2="80" y2="180"
                  stroke="url(#lineGradientHome)"
                  strokeWidth="2"
                  filter="url(#glowHome)"
                  strokeLinecap="round"
                />
                <motion.line
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  x1="80" y1="180" x2="220" y2="180"
                  stroke="url(#lineGradientHome)"
                  strokeWidth="2"
                  filter="url(#glowHome)"
                  strokeLinecap="round"
                />
                <motion.line
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                  x1="220" y1="180" x2="150" y2="40"
                  stroke="url(#lineGradientHome)"
                  strokeWidth="2"
                  filter="url(#glowHome)"
                  strokeLinecap="round"
                />

                {/* Remplissage semi-transparent */}
                <motion.polygon
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  points="150,40 80,180 220,180"
                  fill="url(#lineGradientHome)"
                />

                {/* Les 3 bulles emoji */}
                {/* Bulle haut */}
                <motion.g
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                >
                  <circle
                    cx="150" cy="40"
                    r="32"
                    fill="rgba(139, 92, 246, 0.2)"
                    stroke="#a78bfa"
                    strokeWidth="2"
                    filter="url(#glowHome)"
                  />
                  <text
                    x="150" y="40"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="28"
                  >
                    {triangle[0]}
                  </text>
                </motion.g>

                {/* Bulle bas gauche */}
                <motion.g
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                >
                  <circle
                    cx="80" cy="180"
                    r="32"
                    fill="rgba(139, 92, 246, 0.2)"
                    stroke="#a78bfa"
                    strokeWidth="2"
                    filter="url(#glowHome)"
                  />
                  <text
                    x="80" y="180"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="28"
                  >
                    {triangle[1]}
                  </text>
                </motion.g>

                {/* Bulle bas droite */}
                <motion.g
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
                >
                  <circle
                    cx="220" cy="180"
                    r="32"
                    fill="rgba(139, 92, 246, 0.2)"
                    stroke="#a78bfa"
                    strokeWidth="2"
                    filter="url(#glowHome)"
                  />
                  <text
                    x="220" y="180"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="28"
                  >
                    {triangle[2]}
                  </text>
                </motion.g>
              </svg>
            </div>
          </div>

          {/* Phrase d'amorce */}
          {todayRitual && todayRitual.seedPhrase ? (
            <div className="space-y-3">
              <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                <div className="text-xs text-purple-300 font-semibold mb-2">
                  💫 Votre amorce poétique
                </div>
                <p className="text-white leading-relaxed italic">
                  "{todayRitual.seedPhrase}"
                </p>
              </div>
              <div className="flex gap-3">
                <Link
                  to="/etoiles"
                  className="flex-1 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-6 py-3 font-semibold text-center hover:shadow-lg transition-all"
                >
                  ⭐ Tisser une étoile
                </Link>
                <button
                  onClick={() => setShowSeedForm(true)}
                  className="flex-1 rounded-xl glass border border-white/20 text-white px-6 py-3 font-semibold text-center hover:border-white/40 transition-all"
                >
                  ✏️ Modifier l'amorce
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {!showSeedForm ? (
                <>
                  <p className="text-sm text-slate-300 text-center">
                    Amorcez une phrase poétique pour tisser votre rituel du jour
                  </p>
                  <button
                    onClick={() => setShowSeedForm(true)}
                    className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-6 py-3 font-semibold hover:shadow-lg transition-all"
                  >
                    ✨ Amorcer ma phrase poétique
                  </button>
                </>
              ) : null}
            </div>
          )}

          {/* Formulaire d'amorce */}
          <AnimatePresence>
            {showSeedForm && (
              <SeedPhraseForm
                triangle={triangle}
                initialPhrase={seedPhrase}
                onSave={(phrase) => {
                  saveRitualSession({
                    triangle,
                    seedPhrase: phrase,
                    date: new Date().toISOString().split('T')[0]
                  })
                  setTodayRitual({ triangle, seedPhrase: phrase })
                  setSeedPhrase(phrase)
                  setShowSeedForm(false)
                }}
                onCancel={() => setShowSeedForm(false)}
              />
            )}
          </AnimatePresence>

          <div className="pt-4 border-t border-white/10 space-y-3">
            <button
              onClick={() => {
                const spirit = selectSpiritForTriangle(triangle)
                setSelectedSpirit(spirit)
                setShowSpiritModal(true)
              }}
              className="block w-full rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-6 py-3 font-semibold text-center hover:shadow-lg transition-all"
            >
              🌟 Rencontrer l'esprit onirique de votre Onimoji
            </button>
            <Link
              to="/tirage"
              className="block w-full rounded-xl glass border border-white/20 text-white px-6 py-3 font-semibold text-center hover:border-white/40 transition-all"
            >
              🔮 Tisser un nouveau triangle
            </Link>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-3xl glass-strong border border-cyan-500/30 p-8 text-center space-y-6"
        >
          <div className="text-6xl">🔮✨</div>
          <div className="space-y-2">
            <h3 className="text-2xl font-display font-light text-white">
              Commencez votre rituel
            </h3>
            <p className="text-slate-300 max-w-lg mx-auto font-light">
              Tissez votre premier triangle stellaire pour entamer votre voyage onirique.
            </p>
          </div>
          <Link
            to="/tirage"
            className="inline-block rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-8 py-4 font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            ✨ Tisser mon Onimoji du jour
          </Link>
        </motion.div>
      )}

      {/* 3 Piliers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-3xl glass-strong border border-white/20 p-8 space-y-6"
      >
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">💫</div>
          <h3 className="text-2xl font-bold text-white">
            Les 3 Piliers d'Onimoji
          </h3>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Link
            to="/tirage"
            className="group text-center space-y-3 p-6 rounded-2xl glass border border-white/10 hover:border-cyan-500/30 transition-all"
          >
            <div className="text-5xl group-hover:scale-110 transition-transform">🔮</div>
            <h4 className="font-semibold text-white text-lg">Rituel Quotidien</h4>
            <p className="text-sm text-slate-300 font-light">
              Tissez votre triangle stellaire et amorcez une phrase poétique inspirante
            </p>
          </Link>

          <Link
            to="/etoiles"
            className="group text-center space-y-3 p-6 rounded-2xl glass border border-white/10 hover:border-purple-500/30 transition-all"
          >
            <div className="text-5xl group-hover:scale-110 transition-transform">⭐</div>
            <h4 className="font-semibold text-white text-lg">Étoiles Collaboratives</h4>
            <p className="text-sm text-slate-300">
              Co-créez des étoiles oniriques en superposant vos triangles et textes
            </p>
          </Link>

          <Link
            to="/cosmoji"
            className="group text-center space-y-3 p-6 rounded-2xl glass border border-white/10 hover:border-cyan-500/30 transition-all"
          >
            <div className="text-5xl group-hover:scale-110 transition-transform">🔭</div>
            <h4 className="font-semibold text-white text-lg">Observatoire Cosmoji</h4>
            <p className="text-sm text-slate-300">
              Visualisez le réseau vivant d'énergie onirique collective
            </p>
          </Link>
        </div>
      </motion.div>

      {/* Philosophy */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="rounded-3xl bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-purple-500/20 p-8 space-y-6"
      >
        <div className="text-center space-y-3">
          <div className="text-5xl">🌙💭</div>
          <h3 className="text-2xl font-bold text-white">
            Résonance Poétique ↔ Onirique
          </h3>
          <p className="text-slate-200 max-w-2xl mx-auto leading-relaxed">
            Onimoji vous aide à cultiver votre santé onirique en créant un pont quotidien 
            entre l'inspiration poétique du jour et les rêves de la nuit. 
            Pas d'injonction, juste de la résonance.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 pt-4">
          <div className="rounded-2xl bg-white/5 p-4 space-y-2">
            <div className="text-3xl">🌅</div>
            <h4 className="font-semibold text-white">Poétique du Jour</h4>
            <p className="text-sm text-slate-300">
              Cueillez votre triangle emoji qui résonne avec votre état présent
            </p>
          </div>
          <div className="rounded-2xl bg-white/5 p-4 space-y-2">
            <div className="text-3xl">🌌</div>
            <h4 className="font-semibold text-white">Onirique de Nuit</h4>
            <p className="text-sm text-slate-300">
              Laissez les symboles nourrir vos rêves et enrichir votre santé onirique
            </p>
          </div>
        </div>
      </motion.div>

      {user && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-sm text-slate-400"
        >
          Bon rituel {user.name} 🌙
        </motion.p>
      )}

      {/* Spirit Modal */}
      <AnimatePresence>
        {showSpiritModal && selectedSpirit && (
          <SpiritModal
            spirit={selectedSpirit}
            triangle={triangle}
            onClose={() => setShowSpiritModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function SeedPhraseForm({ triangle, initialPhrase, onSave, onCancel }) {
  const [phrase, setPhrase] = useState(initialPhrase || '')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (phrase.trim()) {
      onSave(phrase.trim())
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="rounded-2xl bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-purple-500/30 p-6 space-y-4"
    >
      <div className="text-center">
        <div className="text-sm font-semibold text-purple-300 mb-2">
          💫 Amorcez votre phrase poétique
        </div>
        <p className="text-xs text-slate-400">
          Cette amorce sera le point de départ pour tisser des étoiles oniriques
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <textarea
            value={phrase}
            onChange={(e) => setPhrase(e.target.value)}
            placeholder="Commencez une phrase inspirante qui résonne avec votre triangle..."
            className="w-full rounded-xl bg-white/5 border border-white/10 text-white px-4 py-3 min-h-[100px] focus:outline-none focus:border-purple-500/50 transition-colors resize-none placeholder:text-slate-500"
            autoFocus
          />
          <div className="text-xs text-slate-500 mt-1">
            {phrase.length} caractères
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={!phrase.trim()}
            className="flex-1 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-6 py-3 font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ✨ Sauvegarder
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-xl glass border border-white/20 text-white px-6 py-3 font-semibold hover:border-white/40 transition-all"
          >
            Annuler
          </button>
        </div>
      </form>
    </motion.div>
  )
}
