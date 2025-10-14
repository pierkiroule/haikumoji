import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getMoonIndex, nextMoon, getSelectedTriplet, saveDream, seedIfEmpty, getUser } from '../utils/storage.js'
import corpus from '../data/corpus.json'
import inuitLunes from '../data/inuit_lunes.json'

function generateDreamText(selected, c) {
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]
  const [e1, e2, e3] = (selected || []).slice(0, 3)
  const line1 = `${pick(c.openings)} — ${e1 || ''}`.trim()
  const line2 = `${pick(c.middles)} — ${e2 || ''}`.trim()
  const line3 = `${pick(c.closings)} — ${e3 || ''}`.trim()
  return `${line1}\n${line2}\n${line3}`
}

export default function Lune() {
  const [moon, setMoon] = useState(1)
  const [triplet, setTriplet] = useState([])
  const [text, setText] = useState('')
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    seedIfEmpty()
    const m = getMoonIndex()
    setMoon(m)
    const t = getSelectedTriplet()
    setTriplet(t)
    const u = getUser()
    setUser(u)
    if (u) {
      setText(generateDreamText(t, corpus))
    } else {
      setText('')
    }
  }, [])

  const meta = useMemo(() => inuitLunes[String(moon)] || { titre: `Lune ${moon}`, ressource: '' }, [moon])

  const handleSave = () => {
    const user = getUser()
    if (!user) {
      alert('Inscription locale requise pour sauvegarder un rêve.')
      return
    }
    saveDream({ moon, emojis: triplet, text, author: user.name, authorId: user.id })
    alert('Rêve sauvegardé dans la mémoire locale.')
  }

  const handleNext = () => {
    const nm = nextMoon()
    setMoon(nm)
    const t = getSelectedTriplet()
    if (user) {
      setText(generateDreamText(t, corpus))
    } else {
      setText('')
    }
  }

  return (
    <div className="space-y-6">
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
          <p className="text-slate-300 text-sm leading-relaxed mb-4">{meta.ressource}</p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/guardian')}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-midnight-400 to-midnight-500 text-white px-5 py-2.5 hover:shadow-aurora transition-all duration-300 font-medium"
          >
            Rencontrer le gardien ✧
          </motion.button>
        </div>
      </motion.section>

      {/* Dream Composition */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl bg-white text-slate-900 shadow-card-hover p-6 space-y-4"
      >
        <div className="text-center">
          <div className="text-4xl select-none mb-3">{triplet.join(' ') || '—'}</div>
          {!user && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 text-indigo-800 p-4 text-sm"
            >
              <p className="font-medium mb-2">✨ Inscription requise</p>
              <p className="text-xs text-indigo-700">
                Inscrivez-vous localement pour générer et sauvegarder vos rêves.
              </p>
            </motion.div>
          )}
        </div>

        {text && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-xl bg-gradient-to-br from-slate-50 to-white border border-slate-200 p-6"
          >
            <pre className="whitespace-pre-wrap leading-relaxed text-slate-800 text-center font-medium">
              {text}
            </pre>
          </motion.div>
        )}

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              if (!user) { alert('Inscription locale requise.'); return }
              setText(generateDreamText(triplet, corpus))
            }}
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
            onClick={handleNext} 
            className="flex-1 min-w-[140px] rounded-xl bg-gradient-to-r from-midnight-400 to-midnight-500 text-white px-4 py-3 hover:shadow-aurora transition-all duration-300 font-medium"
          >
            Lune suivante →
          </motion.button>
        </div>
      </motion.section>
    </div>
  )
}
