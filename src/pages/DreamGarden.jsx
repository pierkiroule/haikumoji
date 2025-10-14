import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { getStarSeeds, getMoonIndex, seedIfEmpty } from '../utils/storage.js'

export default function DreamGarden() {
  const [seeds, setSeeds] = useState([])
  const [moon, setMoon] = useState(1)

  useEffect(() => {
    seedIfEmpty()
    setSeeds(getStarSeeds())
    setMoon(getMoonIndex())
  }, [])

  const byMoon = useMemo(() => {
    const m = new Map()
    for (const s of seeds) {
      const key = String(s.moon)
      m.set(key, [...(m.get(key) || []), s])
    }
    return m
  }, [seeds])

  const completed = seeds.length >= 12
  const progress = (seeds.length / 12) * 100

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl glass-strong border border-white/20 shadow-card p-6 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 text-8xl opacity-10">🌱</div>
        <div className="relative z-10">
          <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-white/10 mb-3">
            <span className="text-sm font-medium text-white">🌿 Votre parcours</span>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Jardin du Rêve</h2>
          
          <div className="flex items-center gap-4 text-sm text-slate-300 mb-4">
            <span className="font-medium">{seeds.length} graine(s) collectée(s)</span>
            <span className="text-slate-400">•</span>
            <span>Lune en cours : <span className="font-bold text-white">{moon}/12</span></span>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Progression du cycle</span>
              <span className="font-medium text-white">{Math.round(progress)}%</span>
            </div>
            <div className="h-3 bg-midnight-900/50 rounded-full overflow-hidden border border-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-500 rounded-full"
              />
            </div>
          </div>
          
          {completed && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-xl bg-gradient-to-r from-emerald-200/60 via-sky-200/60 to-fuchsia-200/60 p-4 border border-white/50"
            >
              <div className="text-slate-900 font-medium text-center">
                ✨ Aurora des Rêves — le cycle est complet. Respire sous le ciel ouvert. 🌌
              </div>
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Seeds Grid */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl bg-white text-slate-900 shadow-card-hover p-6"
      >
        <h3 className="text-lg font-semibold mb-4 text-slate-900">Vos graines étoilées</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {Array.from({ length: 12 }, (_, i) => i + 1).map((idx) => {
            const list = byMoon.get(String(idx)) || []
            const has = list.length > 0
            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ scale: 1.05, y: -4 }}
                className={`relative rounded-2xl border-2 p-4 h-28 flex flex-col items-center justify-center transition-all duration-300 ${
                  has 
                    ? 'bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-300 shadow-md' 
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="text-xs font-medium text-slate-600 mb-2">Lune {idx}</div>
                {has ? (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: idx * 0.05 + 0.2, type: "spring" }}
                    className="text-2xl select-none"
                  >
                    {list[0].emojis?.join(' ')}
                  </motion.div>
                ) : (
                  <div className="text-slate-300 text-3xl">○</div>
                )}
                {has && (
                  <motion.div
                    className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-lg"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: idx * 0.05 + 0.3, type: "spring" }}
                  >
                    <span className="text-white text-xs">✓</span>
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </div>
      </motion.section>
    </div>
  )
}
