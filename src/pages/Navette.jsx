import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import EmojiNetwork from '../components/EmojiNetwork.jsx'
import StepGuide from '../components/StepGuide.jsx'
import SelectionPanel from '../components/SelectionPanel.jsx'
import { computeEmojiStats, seedIfEmpty, setSelectedTriplet, getUser, saveUser } from '../utils/storage.js'
import { useNavigate } from 'react-router-dom'

export default function Navette() {
  const [stats, setStats] = useState({ occurrences: [], pairs: [], triples: [] })
  const [picked, setPicked] = useState([])
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    seedIfEmpty()
    setStats(computeEmojiStats())
    setUser(getUser())
  }, [])

  const handleToggle = (emoji) => {
    if (!user) return
    setPicked(prev => {
      const has = prev.includes(emoji)
      if (has) return prev.filter(e => e !== emoji)
      if (prev.length >= 3) return prev
      return [...prev, emoji]
    })
  }

  const goToLune = () => {
    if (picked.length !== 3) return
    setSelectedTriplet(picked)
    navigate('/lune')
  }

  const handleSignup = () => {
    const created = saveUser({ name: 'Voyageur' })
    setUser(created)
  }

  const voyageSteps = [
    {
      id: 'select',
      icon: '✨',
      title: 'Choisir 3 émojis',
      description: 'Sélectionnez 3 émojis qui résonnent avec votre état onirique du moment. Ces symboles cosmiques formeront la base de votre rêve.',
      tips: 'Cliquez sur les émojis dans le réseau ci-dessous. Les émojis sélectionnés apparaîtront en vert brillant avec un halo lumineux.'
    },
    {
      id: 'lune',
      icon: '🌙',
      title: 'Créer votre haïku',
      description: 'Votre trio d\'émojis générera un haïku unique inspiré par la sagesse inuite et la poésie onirique.',
      tips: 'Vous pourrez regénérer le texte autant de fois que vous le souhaitez jusqu\'à trouver celui qui vous parle.'
    },
    {
      id: 'guardian',
      icon: '✧',
      title: 'Rencontrer le gardien',
      description: 'Un gardien onimoji inuit (Sila, Sedna, Nanook...) vous accueillera pour un rituel d\'apaisement.',
      tips: 'Le gardien est choisi en fonction des émojis que vous avez sélectionnés et de la lune en cours.'
    }
  ]

  return (
    <div className="space-y-6">
      {/* En-tête avec contexte */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl glass-strong border border-white/20 shadow-card p-6 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 text-8xl opacity-10">🚀</div>
        <div className="relative z-10">
          <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-aurora-blue/20 to-aurora-cyan/20 border border-white/10 mb-3">
            <span className="text-sm font-medium text-white">🌌 Navette Cosmoniris</span>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Hublot Cosmoji</h2>
          
          <p className="text-slate-300 text-sm leading-relaxed mb-4">
            Bienvenue à bord ! Le voyage Inuit se déroule en 12 lunes. À chaque lune, vous suivrez ce parcours en 3 étapes pour cultiver votre jardin onirique.
          </p>
          
          {!user && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-white/20 p-4"
            >
              <p className="text-white text-sm font-medium mb-3">
                ✨ Vous êtes en visite. Pour sélectionner et générer un rêve, inscrivez-vous localement.
              </p>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSignup} 
                className="rounded-xl bg-gradient-to-r from-midnight-400 to-midnight-500 text-white px-5 py-2.5 font-medium hover:shadow-aurora transition-all duration-300"
              >
                S'inscrire localement
              </motion.button>
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Guide pas à pas */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <StepGuide 
          currentStep={1} 
          steps={voyageSteps}
        />
      </motion.section>

      {/* Panneau de sélection amélioré */}
      {user && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <SelectionPanel 
            selected={picked}
            maxSelection={3}
            onClear={() => setPicked([])}
          />
        </motion.section>
      )}

      {/* Réseau d'émojis avec instructions */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl bg-white text-slate-900 shadow-card-hover p-6"
      >
        <div className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">Réseau Cosmoji</h3>
              <p className="text-sm text-slate-600">
                Cliquez sur 3 émojis. Taille = popularité • Liens = associations fréquentes
              </p>
            </div>
            {!user && (
              <div className="text-sm text-amber-600 bg-amber-50 px-4 py-2 rounded-xl border border-amber-200">
                🔒 Inscription requise
              </div>
            )}
          </div>

          <EmojiNetwork
            stats={stats}
            selectable={Boolean(user)}
            selected={picked}
            onToggle={handleToggle}
            maxNodes={30}
            maxLinks={200}
            glow
            getNodeColor={(id, sel) => ({
              fill: sel ? '#10b981' : '#0ea5e9',
              stroke: sel ? '#059669' : '#0284c7',
              fillOpacity: sel ? 0.85 : 0.12,
              strokeOpacity: sel ? 1 : 0.45,
            })}
          />
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
          <div className="text-sm text-slate-600">
            {picked.length === 0 ? (
              <span className="text-slate-400 italic">Aucun émoji sélectionné</span>
            ) : (
              <>
                <span className="font-medium">Votre sélection :</span>{' '}
                <span className="font-mono text-2xl ml-2">{picked.join(' ')}</span>
                <span className="ml-2 text-xs text-slate-500">({picked.length}/3)</span>
              </>
            )}
          </div>
          
          <motion.button
            whileHover={user && picked.length === 3 ? { scale: 1.02 } : {}}
            whileTap={user && picked.length === 3 ? { scale: 0.98 } : {}}
            onClick={goToLune}
            disabled={!user || picked.length !== 3}
            animate={user && picked.length === 3 ? {
              boxShadow: [
                '0 4px 6px rgba(6, 182, 212, 0.3)',
                '0 8px 16px rgba(6, 182, 212, 0.5)',
                '0 4px 6px rgba(6, 182, 212, 0.3)',
              ]
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
            className={`rounded-xl px-6 py-3 font-semibold transition-all duration-300 ${
              user && picked.length === 3 
                ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {picked.length === 3 ? '✨ Valider et continuer' : `Sélectionnez ${3 - picked.length} émoji(s)`}
          </motion.button>
        </div>
      </motion.section>
    </div>
  )
}
