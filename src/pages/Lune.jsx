import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getMoonIndex, getSelectedTriplet, saveDream, seedIfEmpty, getUser } from '../utils/storage.js'
import { getLuneData } from '../utils/voyageLoader.js'
import { getCurrentVoyage } from '../utils/voyageConfig.js'
import { generateHypnoniris } from '../utils/hypnonirisGenerator.js'
import MoonProgressWidget from '../components/MoonProgressWidget.jsx'

export default function Lune() {
  const [moon, setMoon] = useState(1)
  const [triplet, setTriplet] = useState([])
  const [hypnoniris, setHypnoniris] = useState('')
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  const meta = useMemo(() => {
    const v = getCurrentVoyage()
    const lune = getLuneData(v, moon)
    if (lune) {
      return { 
        titre: lune?.gardien?.titre || `Lune ${moon}`, 
        gardianName: lune?.gardien?.nom || 'Sila',
        element: lune?.element || 'air',
        ressource: lune?.ressources_culturelles?.explication || '' 
      }
    }
    return { titre: `Lune ${moon}`, gardianName: 'Sila', element: 'air', ressource: '' }
  }, [moon])

  useEffect(() => {
    seedIfEmpty()
    const m = getMoonIndex()
    setMoon(m)
    const t = getSelectedTriplet()
    setTriplet(t)
    const u = getUser()
    setUser(u)
    
    // Redirect if no emojis selected
    if (!t || t.length < 3) {
      navigate('/navette')
      return
    }
    
    if (u && t && t.length === 3) {
      const savedHypnoniris = localStorage.getItem(`hypnoniris_moon_${m}`)
      if (savedHypnoniris) {
        setHypnoniris(savedHypnoniris)
      } else {
        const newHypnoniris = generateHypnoniris(t, meta.gardianName, meta.element)
        setHypnoniris(newHypnoniris)
        localStorage.setItem(`hypnoniris_moon_${m}`, newHypnoniris)
      }
    } else {
      setHypnoniris('')
    }
  }, [meta.gardianName, meta.element])

  const handleRegenerate = () => {
    if (!user || triplet.length < 3) return
    const newHypnoniris = generateHypnoniris(triplet, meta.gardianName, meta.element)
    setHypnoniris(newHypnoniris)
    localStorage.setItem(`hypnoniris_moon_${moon}`, newHypnoniris)
  }

  const handleSave = () => {
    const user = getUser()
    if (!user) {
      alert('Inscription locale requise pour sauvegarder.')
      return
    }
    saveDream({ moon, emojis: triplet, text: hypnoniris, author: user.name, authorId: user.id })
    alert('Hypnoniris sauvegardé dans la mémoire locale.')
  }

  const handleContinueToGuardian = () => {
    if (!hypnoniris) {
      alert('Veuillez générer votre hypnoniris d\'abord.')
      return
    }
    navigate('/guardian')
  }

  return (
    <div className="space-y-6">
      <MoonProgressWidget />

      {/* Moon Info */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl glass-strong border border-white/20 p-6 shadow-card relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 text-8xl opacity-10">🌙</div>
        <div className="relative z-10">
          <div className="inline-block px-3 py-1.5 rounded-full bg-gradient-to-r from-aurora-purple/20 to-aurora-blue/20 border border-white/10 mb-3">
            <span className="text-xs font-medium text-white">Lune {moon}/12</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{meta.titre}</h2>
          <p className="text-slate-300 text-sm leading-relaxed">{meta.ressource}</p>
        </div>
      </motion.section>

      {/* Hypnoniris Creation */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl bg-white text-slate-900 shadow-card-hover p-6 space-y-4"
      >
        <div className="text-center">
          <h3 className="text-lg font-bold text-slate-900 mb-2">Votre Hypnoniris</h3>
          <div className="text-4xl select-none mb-3">{triplet.join(' ') || '—'}</div>
          {!user && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 text-indigo-800 p-4 text-sm"
            >
              <p className="font-medium mb-2">✨ Inscription requise</p>
              <p className="text-xs text-indigo-700">
                Inscrivez-vous localement pour générer et sauvegarder vos hypnoniris.
              </p>
            </motion.div>
          )}
        </div>

        {hypnoniris && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-xl bg-gradient-to-br from-midnight-50 via-slate-50 to-indigo-50 border border-slate-200 p-6"
          >
            <pre className="whitespace-pre-wrap leading-relaxed text-slate-800 font-medium text-sm">
              {hypnoniris}
            </pre>
          </motion.div>
        )}

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleRegenerate}
            disabled={!user}
            className={`flex-1 min-w-[120px] rounded-xl px-4 py-3 font-medium transition-all duration-300 ${
              user 
                ? 'bg-gradient-to-r from-slate-900 to-slate-800 text-white hover:from-slate-800 hover:to-slate-700 shadow-md hover:shadow-lg' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            🔄 Regénérer
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            disabled={!user}
            className={`flex-1 min-w-[120px] rounded-xl px-4 py-3 font-medium transition-all duration-300 ${
              user 
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white hover:from-emerald-700 hover:to-emerald-600 shadow-md hover:shadow-lg' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            💾 Sauvegarder
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleContinueToGuardian} 
            disabled={!hypnoniris}
            className={`flex-1 min-w-[140px] rounded-xl px-4 py-3 transition-all duration-300 font-medium ${
              hypnoniris
                ? 'bg-gradient-to-r from-midnight-400 to-midnight-500 text-white hover:shadow-aurora'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            Rencontrer le gardien ✧
          </motion.button>
        </div>
      </motion.section>
    </div>
  )
}
