import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import HypnoticOrb from './HypnoticOrb.jsx'

export default function SpiritModal({ spirit, triangle, onClose }) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState([])
  
  if (!spirit) return null

  const slides = [
    { type: 'quote', title: 'Citation Onirique' },
    { type: 'presentation', title: 'Présentation de l\'Esprit' },
    { type: 'quiz', title: 'Mini Quiz' },
    { type: 'ritual', title: 'Rituel de Santé Onirique' }
  ]

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  const handleQuizAnswer = (questionIndex, answerIndex) => {
    const newAnswers = [...quizAnswers]
    newAnswers[questionIndex] = answerIndex
    setQuizAnswers(newAnswers)
  }

  const isQuizComplete = quizAnswers.length === spirit.quiz.length && 
                        quizAnswers.every(a => a !== undefined)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl glass-strong border border-purple-500/50 shadow-2xl"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full glass border border-white/20 flex items-center justify-center text-white hover:border-white/40 transition-all"
        >
          ✕
        </button>

        {/* Slides */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="p-8"
          >
            {/* Slide 1: Citation + Orb */}
            {currentSlide === 0 && (
              <div className="space-y-8 text-center">
                <div className="space-y-2">
                  <div className="text-sm text-purple-300 font-semibold uppercase tracking-wide">
                    Esprit Onirique
                  </div>
                  <h2 className="text-3xl font-bold text-white">
                    {spirit.name}
                  </h2>
                  <p className="text-cyan-300 text-sm">
                    {spirit.culture}
                  </p>
                </div>

                {/* Hypnotic Orb avec triangle */}
                <div className="py-8">
                  <HypnoticOrb triangle={triangle} />
                </div>

                {/* Citation */}
                <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
                  <div className="text-6xl mb-4">💫</div>
                  <p className="text-xl text-white italic leading-relaxed">
                    "{spirit.quote}"
                  </p>
                </div>
              </div>
            )}

            {/* Slide 2: Présentation */}
            {currentSlide === 1 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <div className="text-5xl mb-4">{getCultureEmoji(spirit.culture)}</div>
                  <h2 className="text-3xl font-bold text-white">
                    Je suis {spirit.name}
                  </h2>
                  <p className="text-cyan-300 text-sm">
                    {spirit.cultureDescription}
                  </p>
                </div>

                <div className="rounded-2xl bg-white/5 border border-white/10 p-6 space-y-4">
                  <div className="text-sm text-purple-300 font-semibold">
                    📖 Mon histoire
                  </div>
                  <p className="text-white leading-relaxed">
                    {spirit.presentation}
                  </p>
                </div>

                <div className="rounded-2xl glass border border-cyan-500/30 p-4">
                  <p className="text-sm text-slate-300 italic text-center">
                    🌍 Les esprits guides se réveillent de l'activité du Cosmoji pour remercier les gardiens de l'Onimoji psychoculturel
                  </p>
                </div>
              </div>
            )}

            {/* Slide 3: Quiz */}
            {currentSlide === 2 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <div className="text-5xl mb-4">🧠</div>
                  <h2 className="text-3xl font-bold text-white">
                    Testez vos connaissances
                  </h2>
                  <p className="text-slate-300 text-sm">
                    3 questions pour approfondir votre connexion avec {spirit.name}
                  </p>
                </div>

                <div className="space-y-4">
                  {spirit.quiz.map((q, qIndex) => (
                    <div key={qIndex} className="rounded-2xl bg-white/5 border border-white/10 p-5 space-y-3">
                      <div className="font-semibold text-white">
                        {qIndex + 1}. {q.question}
                      </div>
                      <div className="space-y-2">
                        {q.options.map((option, oIndex) => {
                          const isSelected = quizAnswers[qIndex] === oIndex
                          const isCorrect = oIndex === q.correctIndex
                          const showResult = isSelected && quizAnswers[qIndex] !== undefined
                          
                          return (
                            <button
                              key={oIndex}
                              onClick={() => handleQuizAnswer(qIndex, oIndex)}
                              className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all ${
                                isSelected && isCorrect
                                  ? 'bg-green-500/20 border-green-500 text-green-300'
                                  : isSelected && !isCorrect
                                  ? 'bg-red-500/20 border-red-500 text-red-300'
                                  : isSelected
                                  ? 'bg-purple-500/20 border-purple-500 text-white'
                                  : 'bg-white/5 border-white/20 text-slate-300 hover:border-white/40'
                              }`}
                            >
                              {option}
                              {showResult && isCorrect && ' ✓'}
                              {showResult && !isCorrect && ' ✗'}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {isQuizComplete && (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="rounded-2xl bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/50 p-4 text-center"
                  >
                    <div className="text-2xl mb-2">✨</div>
                    <p className="text-white font-semibold">
                      Bravo ! Vous avez terminé le quiz
                    </p>
                    <p className="text-sm text-slate-300 mt-1">
                      Découvrez maintenant le rituel de {spirit.name}
                    </p>
                  </motion.div>
                )}
              </div>
            )}

            {/* Slide 4: Rituel */}
            {currentSlide === 3 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <div className="text-5xl mb-4">🕯️</div>
                  <h2 className="text-3xl font-bold text-white">
                    Rituel de Santé Onirique
                  </h2>
                  <p className="text-cyan-300 text-sm">
                    Pratique inspirée de {spirit.name}
                  </p>
                </div>

                <div className="rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/50 p-6 space-y-4">
                  <div className="text-sm text-purple-300 font-semibold">
                    🌙 À pratiquer ce soir
                  </div>
                  <p className="text-white leading-relaxed">
                    {spirit.ritual}
                  </p>
                </div>

                <div className="rounded-2xl glass border border-white/20 p-4">
                  <p className="text-sm text-slate-300 text-center italic">
                    💫 Ce rituel vous aide à cultiver votre santé onirique et à créer une résonance entre la poétique du jour et l'onirique de la nuit
                  </p>
                </div>

                <button
                  onClick={onClose}
                  className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-6 py-4 font-semibold hover:shadow-lg transition-all"
                >
                  ✨ Merci {spirit.name}, à ce soir !
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="border-t border-white/10 p-6 flex items-center justify-between">
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className={`px-6 py-2 rounded-xl border font-semibold transition-all ${
              currentSlide === 0
                ? 'border-white/10 text-slate-500 cursor-not-allowed'
                : 'border-white/20 text-white hover:border-white/40'
            }`}
          >
            ← Précédent
          </button>

          <div className="flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentSlide
                    ? 'bg-purple-500 w-8'
                    : 'bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1 || (currentSlide === 2 && !isQuizComplete)}
            className={`px-6 py-2 rounded-xl border font-semibold transition-all ${
              currentSlide === slides.length - 1 || (currentSlide === 2 && !isQuizComplete)
                ? 'border-white/10 text-slate-500 cursor-not-allowed'
                : 'border-white/20 text-white hover:border-white/40'
            }`}
          >
            Suivant →
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

function getCultureEmoji(culture) {
  const emojiMap = {
    'Inuite': '🌌',
    'Africaine (Akan)': '🕸️',
    'Culture Pop (Matrix)': '💊',
    'Perse/Arabe': '📖',
    'Jeux Vidéo (Zelda)': '⚔️',
  }
  return emojiMap[culture] || '✨'
}
