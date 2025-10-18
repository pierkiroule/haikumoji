import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { getUser, getMoonIndex } from '../utils/storage.js'
import { VOYAGES } from '../data/voyages.js'

export default function HomeSimple() {
  const [user, setUser] = useState(null)
  const [currentMoon, setCurrentMoon] = useState(1)

  useEffect(() => {
    const u = getUser()
    setUser(u)
    setCurrentMoon(getMoonIndex())
  }, [])

  const availableVoyages = VOYAGES.filter(v => v.status === 'available')
  const comingSoonVoyages = VOYAGES.filter(v => v.status === 'coming_soon')

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
          🌌🛸✨
        </motion.div>

        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Onimoji Voyages
          </h1>
          <p className="text-xl text-cyan-300 font-medium">
            Agence de Voyages Spatio-Temporels Oniriques
          </p>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Explorez les cultures oniriques du monde entier. Rencontrez des guides ancestraux, 
            découvrez des pratiques millénaires et enrichissez votre santé onirique à travers 
            des voyages initiatiques en 12 étapes.
          </p>
        </div>
      </motion.div>

      {/* Available Voyages */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">
            🚀 Voyages Disponibles
          </h2>
          <p className="text-slate-400">Embarquez dès maintenant</p>
        </div>

        <div className="grid gap-6">
          {availableVoyages.map((voyage, index) => (
            <VoyageCard 
              key={voyage.id} 
              voyage={voyage} 
              currentMoon={currentMoon}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>

      {/* Coming Soon Voyages */}
      {comingSoonVoyages.length > 0 && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">
              🔮 Prochainement
            </h2>
            <p className="text-slate-400">De nouveaux horizons oniriques</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {comingSoonVoyages.map((voyage, index) => (
              <ComingSoonCard 
                key={voyage.id} 
                voyage={voyage}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      )}

      {/* Philosophy Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="rounded-3xl glass-strong border border-white/20 p-8 space-y-6"
      >
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">💫</div>
          <h3 className="text-2xl font-bold text-white">
            Pourquoi voyager dans les cultures oniriques ?
          </h3>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center space-y-2">
            <div className="text-4xl">🌍</div>
            <h4 className="font-semibold text-white">Diversité Culturelle</h4>
            <p className="text-sm text-slate-300">
              Chaque culture a développé ses propres sagesses oniriques depuis des millénaires
            </p>
          </div>

          <div className="text-center space-y-2">
            <div className="text-4xl">🛡️</div>
            <h4 className="font-semibold text-white">Santé Onirique</h4>
            <p className="text-sm text-slate-300">
              Apprenez à prendre soin de vos rêves comme de votre santé physique
            </p>
          </div>

          <div className="text-center space-y-2">
            <div className="text-4xl">🎓</div>
            <h4 className="font-semibold text-white">Transmission Vivante</h4>
            <p className="text-sm text-slate-300">
              Rencontrez 12 guides par voyage qui vous transmettront leurs enseignements
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
          Bon retour {user.name} 🌙
        </motion.p>
      )}
    </div>
  )
}

function VoyageCard({ voyage, currentMoon, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="rounded-3xl glass-strong border border-white/20 overflow-hidden hover:border-white/40 transition-all duration-300"
    >
      <div className={`h-2 bg-gradient-to-r ${voyage.gradient}`} />
      
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="text-6xl">{voyage.icon}</div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-white mb-1">
              {voyage.name}
            </h3>
            <p className="text-lg text-cyan-300 mb-2">
              {voyage.subtitle}
            </p>
            <p className="text-slate-300 leading-relaxed">
              {voyage.description}
            </p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-3 gap-4 py-4 border-y border-white/10">
          <div className="text-center">
            <div className="text-2xl mb-1">{voyage.backgroundEmoji}</div>
            <div className="text-xs text-slate-400">Région</div>
            <div className="text-sm text-white font-medium">{voyage.region}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">🗓️</div>
            <div className="text-xs text-slate-400">Étapes</div>
            <div className="text-sm text-white font-medium">{voyage.stepsCount} lunes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">🧙</div>
            <div className="text-xs text-slate-400">Progression</div>
            <div className="text-sm text-white font-medium">
              {currentMoon}/{voyage.stepsCount}
            </div>
          </div>
        </div>

        {/* CTA */}
        <Link
          to={`/voyage/${voyage.id}`}
          className={`block w-full rounded-2xl bg-gradient-to-r ${voyage.gradient} text-white px-8 py-4 font-semibold text-center shadow-lg hover:shadow-xl transition-all duration-300`}
        >
          ✨ Embarquer pour le voyage {voyage.name}
        </Link>

        {/* Progress hint */}
        <div className="text-xs text-center text-slate-500">
          {currentMoon === 1 
            ? "Commencez votre initiation avec le premier guide" 
            : `Vous êtes à la lune ${currentMoon} - continuez votre périple`
          }
        </div>
      </div>
    </motion.div>
  )
}

function ComingSoonCard({ voyage, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="rounded-3xl glass border border-white/10 overflow-hidden opacity-60"
    >
      <div className={`h-2 bg-gradient-to-r ${voyage.gradient} opacity-50`} />
      
      <div className="p-6 space-y-4">
        <div className="flex items-start gap-3">
          <div className="text-4xl filter grayscale">{voyage.icon}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl font-bold text-white">
                {voyage.name}
              </h3>
              <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Bientôt
              </span>
            </div>
            <p className="text-sm text-slate-300 mb-2">
              {voyage.subtitle}
            </p>
            <p className="text-xs text-slate-400">
              {voyage.description}
            </p>
          </div>
        </div>

        <div className="text-center py-2 border-t border-white/10">
          <p className="text-xs text-slate-500">
            {voyage.region} • {voyage.stepsCount} étapes • En préparation
          </p>
        </div>
      </div>
    </motion.div>
  )
}
