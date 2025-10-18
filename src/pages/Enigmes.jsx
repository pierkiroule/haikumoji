import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getSelectedTriplet } from '../utils/storage.js'

const ENIGMES = [
  {
    question: "Que cherchez-vous dans vos rêves ?",
    options: [
      { text: "La clarté et la compréhension", value: "clarity" },
      { text: "L'aventure et l'exploration", value: "adventure" },
      { text: "La paix et le repos", value: "peace" },
      { text: "La connexion avec les autres", value: "connection" }
    ]
  },
  {
    question: "Quel élément vous appelle le plus ?",
    options: [
      { text: "L'air - légèreté et liberté", value: "air" },
      { text: "L'eau - fluidité et émotion", value: "water" },
      { text: "La terre - stabilité et ancrage", value: "earth" },
      { text: "Le feu - transformation et énergie", value: "fire" }
    ]
  },
  {
    question: "Comment souhaitez-vous prendre soin de vos rêves ?",
    options: [
      { text: "En les écrivant chaque matin", value: "write" },
      { text: "En méditant avant de dormir", value: "meditate" },
      { text: "En créant des rituels apaisants", value: "ritual" },
      { text: "En les partageant avec d'autres", value: "share" }
    ]
  }
]

export default function Enigmes() {
  const [currentEnigme, setCurrentEnigme] = useState(0)
  const [answers, setAnswers] = useState([])
  const [triplet, setTriplet] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const t = getSelectedTriplet()
    if (!t || t.length < 3) {
      navigate('/tirage')
      return
    }
    setTriplet(t)
  }, [navigate])

  const handleAnswer = (value) => {
    const newAnswers = [...answers, value]
    setAnswers(newAnswers)

    if (currentEnigme < ENIGMES.length - 1) {
      setTimeout(() => setCurrentEnigme(currentEnigme + 1), 500)
    } else {
      localStorage.setItem('enigmes_answers', JSON.stringify(newAnswers))
      setTimeout(() => navigate('/initiation'), 800)
    }
  }

  if (!triplet.length) return null

  const enigme = ENIGMES[currentEnigme]

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <motion.div
          animate={{
            rotate: [0, 5, -5, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="text-7xl mb-4"
        >
          👁️
        </motion.div>
        <h1 className="text-3xl md:text-4xl font-bold text-white">
          L'Esprit Vous Interroge
        </h1>
        <p className="text-slate-300 leading-relaxed">
          Votre triangle {triplet.join(' ')} a réveillé l'esprit. 
          Répondez à ses énigmes pour recevoir son initiation.
        </p>
      </motion.div>

      {/* Progress */}
      <div className="flex justify-center gap-2">
        {ENIGMES.map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all duration-500 ${
              i < currentEnigme ? 'w-12 bg-emerald-500' :
              i === currentEnigme ? 'w-16 bg-cyan-500' :
              'w-12 bg-white/20'
            }`}
          />
        ))}
      </div>

      {/* Enigme */}
      <motion.div
        key={currentEnigme}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="rounded-2xl bg-gradient-to-br from-midnight-800 to-midnight-900 border-2 border-white/20 p-8 shadow-2xl"
      >
        <div className="space-y-6">
          <div className="text-center">
            <div className="inline-block px-4 py-2 rounded-full bg-white/10 text-white/70 text-sm font-medium mb-4">
              Énigme {currentEnigme + 1} / {ENIGMES.length}
            </div>
            <h2 className="text-2xl font-bold text-white">
              {enigme.question}
            </h2>
          </div>

          <div className="grid gap-3">
            {enigme.options.map((option, i) => (
              <motion.button
                key={option.value}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAnswer(option.value)}
                className="group rounded-xl glass p-4 hover:glass-strong transition-all duration-300 text-left border border-white/10 hover:border-white/30"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-midnight-400 to-midnight-500 flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform duration-300">
                    {String.fromCharCode(65 + i)}
                  </div>
                  <span className="text-white font-medium">{option.text}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Triangle reminder */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass">
          <span className="text-sm text-slate-400">Votre triangle :</span>
          <span className="text-2xl">{triplet.join(' ')}</span>
        </div>
      </motion.div>
    </div>
  )
}
