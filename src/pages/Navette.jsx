import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import EmojiBubble from '../components/EmojiBubble.jsx'
import StepGuide from '../components/StepGuide.jsx'
import SelectionPanel from '../components/SelectionPanel.jsx'
import { seedIfEmpty, confirmTriplet, getUser, addOnimoji } from '../utils/storage.js'
import { useNavigate } from 'react-router-dom'
import TagInputChips from '../components/TagInputChips.jsx'
import OnimojiFeed from '../components/OnimojiFeed.jsx'
import CosmojiBubbleModal from '../components/CosmojiBubbleModal.jsx'
import { getAllEmojis } from '../utils/cosmojiLoader.js'
import MoonProgressWidget from '../components/MoonProgressWidget.jsx'

export default function Navette() {
  const [picked, setPicked] = useState([])
  const [user, setUser] = useState(null)
  const [tags, setTags] = useState([])
  const [feedKey, setFeedKey] = useState(0)
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    seedIfEmpty()
    setUser(getUser())
  }, [])

  const handleOpenGuide = () => {
    if (picked.length !== 3) return
    setOpen(true)
  }

  const continueToGuardian = () => {
    if (picked.length !== 3) return
    // Confirme le trio (persist + réseau) pour cohérence avec Cosmoji
    confirmTriplet(picked)
    setOpen(false)
    navigate('/lune')
  }

  const emitOnimoji = () => {
    if (!user || picked.length !== 3) return
    try {
      addOnimoji({ emojis: picked, tags, author: user.name, authorId: user.id })
      setTags([])
      setFeedKey(k => k + 1)
    } catch {}
  }

  // Redirect to voyage/inuit if no user
  useEffect(() => {
    if (!user) {
      navigate('/voyage/inuit')
    }
  }, [user, navigate])

  const voyageSteps = [
    {
      id: 'select',
      icon: '✨',
      title: 'Choisir 3 émojis',
      description: 'Sélectionnez 3 émojis dans le hublot Cosmoji. Ils formeront la base de votre rêve.',
      tips: 'Cliquez dans le cercle effervescent (hublot) pour choisir vos 3 symboles.'
    },
    {
      id: 'lune',
      icon: '🌙',
      title: 'Créer votre hypnoniris',
      description: 'Votre trio d\'émojis générera un hypnoniris - un script onirique hypnotique pour l\'endormissement.',
      tips: 'Le texte sera généré en fonction de vos émojis et de la lune actuelle.'
    },
    {
      id: 'guardian',
      icon: '✧',
      title: 'Rencontrer le guide',
      description: 'Un gardien onimoji inuit (Sila, Sedna, Nanook...) vous accueillera pour un rituel d\'apaisement.',
      tips: 'Le gardien est choisi en fonction des émojis que vous avez sélectionnés et de la lune en cours.'
    }
  ]

  return (
    <div className="space-y-6">
      <MoonProgressWidget />
      
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
            🌙 Bienvenue à bord, {user?.name || 'Voyageur'} ! Le voyage Inuit se déroule en 12 lunes. À chaque lune, vous suivrez ce parcours en 3 étapes pour enrichir votre univers onirique.
          </p>
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

      {/* Hublot Cosmoji central */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl bg-white text-slate-900 shadow-card-hover p-6"
      >
        <div className="mb-6">
          <div className="flex items-center justify-center">
            <EmojiBubble 
              emojis={getAllEmojis()}
              selected={picked}
              setSelected={setPicked}
              maxSelected={3}
              size={380}
              emojiSize={34}
            />
          </div>
        </div>
        
        <div className="flex flex-col gap-4 pt-4 border-t border-slate-200">
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

          {/* Tags + actions */}
          <TagInputChips value={tags} onChange={setTags} placeholder="Ajouter vos mots-clés (optionnel)" />

          <div className="flex flex-col sm:flex-row gap-3">
            <motion.button
              whileHover={picked.length === 3 ? { scale: 1.02 } : {}}
              whileTap={picked.length === 3 ? { scale: 0.98 } : {}}
              onClick={emitOnimoji}
              disabled={picked.length !== 3}
              className={`flex-1 rounded-xl px-6 py-3 font-semibold transition-all duration-300 ${
                picked.length === 3 
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg' 
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              ✨ Émettre mon onimoji
            </motion.button>
            <motion.button
              whileHover={picked.length === 3 ? { scale: 1.02 } : {}}
              whileTap={picked.length === 3 ? { scale: 0.98 } : {}}
              onClick={handleOpenGuide}
              disabled={picked.length !== 3}
              className={`flex-1 rounded-xl px-6 py-3 font-semibold transition-all duration-300 ${
                picked.length === 3 
                  ? 'bg-gradient-to-r from-midnight-400 to-midnight-500 text-white shadow-lg' 
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              ✧ Générer l'énergie onirique
            </motion.button>
          </div>
        </div>
      </motion.section>

      {/* Panneau de sélection visuel */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <SelectionPanel 
          selected={picked}
          maxSelection={3}
          onClear={() => setPicked([])}
        />
      </motion.section>

      {/* Flux des onimojis */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl glass-strong border border-white/20 p-6"
      >
        <h3 className="text-white font-semibold mb-3">Flux des onimojis</h3>
        <OnimojiFeed refreshKey={feedKey} />
      </motion.section>

      {/* Modal bulle onirique */}
      <CosmojiBubbleModal 
        open={open} 
        onClose={() => setOpen(false)} 
        emojis={picked} 
        onContinue={continueToGuardian}
      />
    </div>
  )
}
