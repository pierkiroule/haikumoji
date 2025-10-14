import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import EmojiNetwork from '../components/EmojiNetwork.jsx'
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

  return (
    <div className="space-y-6">
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl glass-strong border border-white/20 shadow-card p-6 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 text-8xl opacity-10">🚀</div>
        <div className="relative z-10">
          <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-aurora-blue/20 to-aurora-cyan/20 border border-white/10 mb-3">
            <span className="text-sm font-medium text-white">🌌 Cosmoniris</span>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Hublot Cosmoji</h2>
          
          <p className="text-slate-300 text-sm leading-relaxed mb-4">
            Voyage Inuit en 12 lunes : sélectionnez 3 émojis pour cette étape, puis explorez la Lune
            en cours et rencontrez un gardien onimoji inuit.
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

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl bg-white text-slate-900 shadow-card-hover p-6"
      >
        <div className="mb-4">
          <EmojiNetwork
            stats={stats}
            selectable={Boolean(user)}
            selected={picked}
            onToggle={handleToggle}
            maxNodes={30}
            maxLinks={200}
          />
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
          <div className="text-sm text-slate-600">
            <span className="font-medium">Sélection:</span>{' '}
            <span className="font-mono text-2xl ml-2">{picked.join(' ') || '—'}</span>
            <span className="ml-2 text-xs text-slate-500">({picked.length}/3)</span>
          </div>
          
          <motion.button
            whileHover={user && picked.length === 3 ? { scale: 1.02 } : {}}
            whileTap={user && picked.length === 3 ? { scale: 0.98 } : {}}
            onClick={goToLune}
            disabled={!user || picked.length !== 3}
            className={`rounded-xl px-6 py-3 font-semibold transition-all duration-300 ${
              user && picked.length === 3 
                ? 'bg-gradient-to-r from-midnight-400 to-midnight-500 text-white hover:shadow-aurora shadow-lg' 
                : 'glass text-slate-400 cursor-not-allowed border border-slate-200'
            }`}
          >
            Valider — Aller à la Lune 🌙
          </motion.button>
        </div>
      </motion.section>
    </div>
  )
}
