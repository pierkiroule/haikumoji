import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { addStarSeed, getMoonIndex, getSelectedTriplet, nextMoon, seedIfEmpty, strengthenCosmojiCounts } from '../utils/storage.js'
import { getLuneData } from '../utils/voyageLoader.js'
import { getCurrentVoyage } from '../utils/voyageConfig.js'
import { getEmojiMetadata } from '../utils/cosmojiLoader.js'
import { generateShortScript } from '../utils/hypnonirisGenerator.js'
import MoonProgressWidget from '../components/MoonProgressWidget.jsx'

export default function Guardian() {
  const [triplet, setTriplet] = useState([])
  const [luneData, setLuneData] = useState(null)
  const [currentStep, setCurrentStep] = useState(1) // 1: Rencontre, 2: Sensations, 3: Script, 4: Impact
  const [sensations, setSensations] = useState('')
  const [showAurora, setShowAurora] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    seedIfEmpty()
    const voyage = getCurrentVoyage()
    const moon = getMoonIndex()
    const t = getSelectedTriplet()
    const data = getLuneData(voyage, moon)
    
    setTriplet(t)
    setLuneData(data)
    strengthenCosmojiCounts(t)
    
    // Aurora effect at start
    const timer = setTimeout(() => setShowAurora(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleCollectAndFinish = () => {
    if (!luneData) return
    
    const current = getMoonIndex()
    addStarSeed({ 
      moon: current, 
      guardianId: luneData.gardien.id, 
      emojis: triplet, 
      element: luneData.gardien.element,
      sensations: sensations
    })
    
    // Mark guardian as met
    localStorage.setItem(`guardian_met_moon_${current}`, 'true')
    
    // Progress to next moon
    try { nextMoon() } catch {}
    
    // Navigate to home or dreamgarden
    navigate('/dreamgarden')
  }

  if (!luneData) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-[60vh] flex items-center justify-center"
      >
        <div className="text-center">
          <div className="text-6xl mb-4">🌙</div>
          <p className="text-slate-300">Chargement de la rencontre...</p>
        </div>
      </motion.div>
    )
  }

  const guardian = luneData.gardien
  const sagesses = luneData.sagesses
  const rituel = luneData.rituel_de_nuit
  const script = luneData.script_onirique
  const astuces = luneData.astuces_chamaniques || []
  const invitation = luneData.invitation_ecriture

  // Générer le script court personnalisé avec les émojis
  const scriptPersonnalise = generateShortScript(triplet, guardian.nom)

  return (
    <div className="relative space-y-6 pb-20">
      <MoonProgressWidget />
      
      {/* Aurora overlay */}
      <AnimatePresence>
        {showAurora && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none fixed inset-0 z-0"
            style={{
              background: 'radial-gradient(120% 80% at 50% 0%, rgba(16,185,129,0.25), rgba(59,130,246,0.16) 40%, transparent 70%)',
              filter: 'blur(12px) saturate(150%)',
              mixBlendMode: 'screen'
            }}
          />
        )}
      </AnimatePresence>

      {/* Progress indicator */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-strong rounded-2xl border border-white/20 p-4"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-medium text-white">
            Rencontre chamanique - Étape {currentStep}/4
          </div>
          <div className="text-2xl">{guardian.emoji}</div>
        </div>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                step <= currentStep 
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500' 
                  : 'bg-white/20'
              }`}
            />
          ))}
        </div>
      </motion.div>

      {/* ÉTAPE 1 : Rencontre avec le Gardien */}
      <AnimatePresence mode="wait">
        {currentStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Présentation du gardien */}
            <motion.section className="rounded-2xl bg-white text-slate-900 shadow-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 text-9xl opacity-5">
                {guardian.emoji}
              </div>
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-700 text-sm font-medium mb-3">
                      Lune {getMoonIndex()}/12
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                      {guardian.titre}
                    </h1>
                    <p className="text-slate-600 text-lg">
                      {guardian.nom} • Élément : {guardian.element}
                    </p>
                  </div>
                  <div className="text-6xl">{guardian.emoji}</div>
                </div>

                <div className="rounded-xl bg-gradient-to-br from-slate-50 to-white border border-slate-200 p-6 mb-6">
                  <p className="text-slate-700 leading-relaxed italic">
                    {guardian.description}
                  </p>
                </div>

                {/* Vos émojis */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-slate-600 mb-2">Vos symboles cosmiques</h3>
                  <div className="flex gap-3">
                    {triplet.map((emoji, index) => {
                      const metadata = getEmojiMetadata(emoji)
                      return (
                        <motion.div
                          key={index}
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: index * 0.1, type: "spring" }}
                          className="flex-1 rounded-xl bg-gradient-to-br from-emerald-50 to-cyan-50 border border-emerald-200 p-4 text-center"
                        >
                          <div className="text-4xl mb-2">{emoji}</div>
                          {metadata && (
                            <div className="text-xs text-slate-600">{metadata.name}</div>
                          )}
                        </motion.div>
                      )
                    })}
                  </div>
                </div>

                {/* Message d'accueil */}
                <div className="rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-200 p-6 mb-6">
                  <p className="text-lg leading-relaxed text-slate-800">
                    "{sagesses.message_accueil}"
                  </p>
                </div>

                {/* Enseignement principal */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-slate-900">Enseignement chamanique</h3>
                  <p className="text-slate-700 leading-relaxed text-lg">
                    {sagesses.enseignement_principal}
                  </p>
                  <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4">
                    <p className="text-emerald-800 font-medium text-center">
                      💫 {sagesses.sagesse_courte}
                    </p>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNextStep}
                  className="mt-8 w-full rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-6 py-4 font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Continuer vers l'introspection →
                </motion.button>
              </div>
            </motion.section>
          </motion.div>
        )}

        {/* ÉTAPE 2 : Écriture des sensations */}
        {currentStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <motion.section className="rounded-2xl bg-white text-slate-900 shadow-2xl p-8">
              <div className="mb-6">
                <div className="text-4xl mb-4 text-center">{guardian.emoji}</div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center">
                  Exprime tes sensations
                </h2>
                <p className="text-slate-600 text-center">
                  {invitation?.question || "Quelles sensations positives t'inspirent ces 3 symboles ?"}
                </p>
              </div>

              {/* Les 3 émojis */}
              <div className="flex justify-center gap-4 mb-6">
                {triplet.map((emoji, index) => (
                  <div key={index} className="text-5xl">{emoji}</div>
                ))}
              </div>

              {/* Zone de texte */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Écris librement tes ressentis
                  </label>
                  <textarea
                    value={sensations}
                    onChange={(e) => setSensations(e.target.value)}
                    placeholder={invitation?.placeholder || "Ex : Le vent qui caresse, la plume qui danse, la lumière qui apaise..."}
                    className="w-full min-h-[160px] rounded-xl border-2 border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 p-4 text-slate-900 leading-relaxed transition-all resize-none"
                  />
                </div>

                {invitation?.guidance && (
                  <div className="rounded-xl bg-blue-50 border border-blue-200 p-4">
                    <p className="text-sm text-blue-800">
                      <span className="font-medium">💡 Inspiration :</span> {invitation.guidance}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-8">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCurrentStep(1)}
                  className="flex-1 rounded-xl bg-slate-200 text-slate-700 px-6 py-4 font-semibold hover:bg-slate-300 transition-all duration-300"
                >
                  ← Retour
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNextStep}
                  disabled={!sensations.trim()}
                  className={`flex-1 rounded-xl px-6 py-4 font-semibold transition-all duration-300 ${
                    sensations.trim()
                      ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg hover:shadow-xl'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Recevoir le script onirique →
                </motion.button>
              </div>
            </motion.section>
          </motion.div>
        )}

        {/* ÉTAPE 3 : Script Onirique Régénérateur */}
        {currentStep === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Script principal */}
            <motion.section className="rounded-2xl bg-gradient-to-br from-slate-900 to-midnight-900 text-white shadow-2xl p-8 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 right-10 text-9xl">{guardian.emoji}</div>
                <div className="absolute bottom-10 left-10 text-7xl">✨</div>
              </div>

              <div className="relative z-10">
                <div className="text-center mb-8">
                  <div className="inline-block px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-4">
                    <span className="text-sm font-medium">📜 Cadeau du Gardien</span>
                  </div>
                  <h2 className="text-3xl font-bold mb-2">{script?.titre || "Script Onirique"}</h2>
                  <p className="text-slate-300">Offert par {guardian.nom}</p>
                </div>

                {/* Le script */}
                <div className="rounded-2xl bg-white/5 border border-white/20 backdrop-blur-sm p-8 mb-6">
                  <pre className="whitespace-pre-wrap leading-loose text-lg font-light text-center text-white">
                    {script?.texte}
                  </pre>
                </div>

                {/* Script court personnalisé */}
                {scriptPersonnalise && (
                  <div className="rounded-xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-400/30 p-6 mb-6">
                    <div className="text-sm font-medium text-emerald-200 mb-3 text-center">
                      ✨ Script court pour l'endormissement
                    </div>
                    <pre className="text-white leading-relaxed whitespace-pre-wrap text-center">
                      {scriptPersonnalise}
                    </pre>
                  </div>
                )}

                {/* Instructions */}
                {script?.instructions && (
                  <div className="rounded-xl bg-white/10 border border-white/20 p-4 mb-6">
                    <p className="text-sm text-slate-200 leading-relaxed">
                      <span className="font-semibold text-white">Mode d'emploi :</span> {script.instructions}
                    </p>
                  </div>
                )}

                {/* Rituel de nuit */}
                <div className="rounded-xl bg-white/5 border border-white/20 p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <span>🌙</span>
                    {rituel?.titre || "Rituel de nuit"}
                  </h3>
                  <div className="space-y-3">
                    {rituel?.etapes?.map((etape, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-xs font-bold text-cyan-300">
                          {index + 1}
                        </div>
                        <p className="text-slate-200 leading-relaxed text-sm">{etape}</p>
                      </div>
                    ))}
                  </div>
                  {rituel?.duree && (
                    <div className="mt-4 text-sm text-slate-400">
                      ⏱️ Durée : {rituel.duree} • {rituel.moment_ideal}
                    </div>
                  )}
                </div>

                <div className="flex gap-3 mt-8">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCurrentStep(2)}
                    className="flex-1 rounded-xl bg-white/10 border border-white/20 text-white px-6 py-4 font-semibold hover:bg-white/20 transition-all duration-300"
                  >
                    ← Retour
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleNextStep}
                    className="flex-1 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-6 py-4 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Découvrir les astuces chamaniques →
                  </motion.button>
                </div>
              </div>
            </motion.section>
          </motion.div>
        )}

        {/* ÉTAPE 4 : Astuces & Collecte */}
        {currentStep === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Astuces chamaniques */}
            <motion.section className="rounded-2xl bg-white text-slate-900 shadow-2xl p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <span className="text-3xl">{guardian.emoji}</span>
                Astuces chamaniques de {guardian.nom}
              </h2>

              <div className="grid md:grid-cols-3 gap-4 mb-8">
                {astuces.map((astuce, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="rounded-xl bg-gradient-to-br from-slate-50 to-white border border-slate-200 p-6 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold mb-3">
                      {index + 1}
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">{astuce.titre}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{astuce.description}</p>
                  </motion.div>
                ))}
              </div>

              {/* Impact Cosmoji */}
              <div className="rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 p-6 mb-6">
                <h3 className="text-lg font-semibold text-purple-900 mb-3 flex items-center gap-2">
                  <span>✨</span>
                  Votre impact sur le Cosmoji collectif
                </h3>
                <p className="text-purple-800 mb-4">
                  Vos 3 émojis vont enrichir le réseau cosmique partagé par toute la communauté. 
                  Chaque choix renforce les connexions et inspire les futurs voyageurs.
                </p>
                <div className="flex justify-center gap-3 mb-3">
                  {triplet.map((emoji, index) => (
                    <motion.div
                      key={index}
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 10, -10, 0]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.3
                      }}
                      className="text-4xl"
                    >
                      {emoji}
                    </motion.div>
                  ))}
                </div>
                <p className="text-sm text-purple-700 text-center">
                  Ces symboles rejoignent le grand réseau onirique ✨
                </p>
              </div>

              {/* Collecte graine d'étoile */}
              <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 text-white p-8 text-center">
                <div className="text-6xl mb-4">⭐</div>
                <h3 className="text-2xl font-bold mb-2">Graine d'Étoile Prête</h3>
                <p className="text-emerald-100 mb-6">
                  Votre rencontre avec {guardian.nom} a produit une graine d'étoile unique. 
                  Elle marquera votre progression dans ce voyage et enrichira votre collection de graines d'étoiles.
                </p>
                
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCurrentStep(3)}
                    className="flex-1 rounded-xl bg-white/20 border border-white/30 text-white px-6 py-4 font-semibold hover:bg-white/30 transition-all duration-300"
                  >
                    ← Revoir le script
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCollectAndFinish}
                    className="flex-1 rounded-xl bg-white text-emerald-600 px-6 py-4 font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
                  >
                    ⭐ Collecter et terminer
                  </motion.button>
                </div>
              </div>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
