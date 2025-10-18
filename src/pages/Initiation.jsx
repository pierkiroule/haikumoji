import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getSelectedTriplet, saveDream, getUser } from '../utils/storage.js'

// Script onirique simple généré selon les réponses
function generateScript(triplet, answers) {
  const elements = {
    air: "le souffle du vent arctique",
    water: "les vagues de l'océan gelé",
    earth: "la terre ancestrale",
    fire: "la flamme du foyer"
  }

  const intentions = {
    clarity: "clarifier votre esprit",
    adventure: "explorer de nouveaux horizons",
    peace: "trouver la paix intérieure",
    connection: "vous connecter à l'univers"
  }

  const element = answers[1] || 'air'
  const intention = answers[0] || 'peace'

  return `Sous ${elements[element]}, respirez profondément.
Votre triangle ${triplet.join(' ')} brille dans la nuit étoilée.
Laissez ${intentions[intention]} guider vos rêves.
Que le sommeil vous apporte sagesse et régénération.`
}

export default function Initiation() {
  const [triplet, setTriplet] = useState([])
  const [answers, setAnswers] = useState([])
  const [script, setScript] = useState('')
  const [showScript, setShowScript] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const t = getSelectedTriplet()
    if (!t || t.length < 3) {
      navigate('/tirage')
      return
    }
    
    const savedAnswers = JSON.parse(localStorage.getItem('enigmes_answers') || '[]')
    if (savedAnswers.length < 3) {
      navigate('/enigmes')
      return
    }

    setTriplet(t)
    setAnswers(savedAnswers)
    
    setTimeout(() => {
      const generatedScript = generateScript(t, savedAnswers)
      setScript(generatedScript)
      setShowScript(true)
    }, 1500)
  }, [navigate])

  const handleShare = () => {
    const user = getUser()
    if (user) {
      saveDream({
        emojis: triplet,
        text: script,
        author: user.name,
        authorId: user.id
      })
    }
    navigate('/forum')
  }

  if (!triplet.length) return null

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header - Guide félicite */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6"
      >
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
          className="text-8xl mb-4"
        >
          ✨
        </motion.div>
        
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Félicitations, Voyageur Onirique
          </h1>
          <p className="text-xl text-emerald-400 font-medium">
            L'esprit a accepté votre triangle sacré {triplet.join(' ')}
          </p>
        </div>
      </motion.div>

      {/* Initiation du Guide */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl glass-strong border border-white/20 p-8 shadow-card space-y-6"
      >
        <div className="flex items-start gap-4">
          <div className="text-5xl flex-shrink-0">🌙</div>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">
              Message du Guide
            </h2>
            <div className="space-y-3 text-slate-300 leading-relaxed">
              <p>
                Vous avez su écouter l'esprit et répondre à ses énigmes avec votre cœur. 
                Cette connexion révèle votre ouverture à la culture onirique.
              </p>
              <p>
                Les rêves ne sont pas de simples images nocturnes. Ce sont des ponts vers 
                votre sagesse intérieure, des messagers de votre inconscient, des jardins 
                où cultiver votre bien-être.
              </p>
              <p className="font-medium text-white">
                Prendre soin de sa santé onirique, c'est :
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400">•</span>
                  <span>Honorer ses rêves en les écoutant et les notant</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400">•</span>
                  <span>Créer des rituels apaisants avant le sommeil</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400">•</span>
                  <span>Partager ses visions avec bienveillance</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400">•</span>
                  <span>Respecter le mystère et la poésie du monde nocturne</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Script Onirique */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: showScript ? 1 : 0, y: showScript ? 0 : 20 }}
        transition={{ delay: 0.6 }}
        className="rounded-2xl bg-gradient-to-br from-midnight-800 to-midnight-900 border-2 border-emerald-500/30 p-8 shadow-2xl"
      >
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">
              Votre Script Onirique
            </h2>
            <p className="text-slate-400 text-sm">
              Lisez ces mots avant de dormir pour apaiser votre esprit
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="rounded-xl bg-white/5 border border-white/10 p-6"
          >
            <pre className="whitespace-pre-wrap text-center leading-loose text-lg text-slate-200 font-light">
              {script}
            </pre>
          </motion.div>

          <div className="flex flex-col sm:flex-row gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigator.clipboard.writeText(script)}
              className="flex-1 rounded-xl glass-strong px-6 py-3 font-medium text-white hover:border-white/30 transition-all duration-300"
            >
              📋 Copier le script
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleShare}
              className="flex-1 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              💬 Partager au forum
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Encouragement */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="text-center text-slate-400 text-sm"
      >
        <p>
          Votre voyage onirique ne fait que commencer. 
          Partagez votre expérience et enrichissez-la avec la communauté ✨
        </p>
      </motion.div>
    </div>
  )
}
