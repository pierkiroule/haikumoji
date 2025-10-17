import { useEffect, useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import PantheonModal from '../components/PantheonModal.jsx'
import CosmojiEmblem from '../components/CosmojiEmblem.jsx'
import EmojiNetwork from '../components/EmojiNetwork.jsx'
import AuroraOverlay from '../components/AuroraOverlay.jsx'
import SelectionPanel from '../components/SelectionPanel.jsx'
import { computeEmojiStats, seedIfEmpty, setSelectedTriplet, getMoonIndex } from '../utils/storage.js'
import { getEmojiMetadata } from '../utils/cosmojiLoader.js'

export default function Cosmoji() {
  const [open, setOpen] = useState(false)
  const [stats, setStats] = useState({ occurrences: [], pairs: [], triples: [] })
  const [picked, setPicked] = useState([]) // up to 3
  const navigate = useNavigate()
  const prefersReduced = useReducedMotion()

  useEffect(() => {
    seedIfEmpty()
    setStats(computeEmojiStats())
  }, [])

  const handleToggle = (emoji) => {
    setPicked(prev => {
      const has = prev.includes(emoji)
      if (has) {
        // Déselectionner
        return prev.filter(e => e !== emoji)
      }
      // Ne pas ajouter si déjà 3 sélectionnés
      if (prev.length >= 3) {
        return prev
      }
      // Ajouter le nouvel emoji
      return [...prev, emoji]
    })
  }

  // Pick 3 -> compute resonance and go to guardian encounter
  const handleResonance = () => {
    if (picked.length !== 3) return
    // Save selection to storage so the Guardian page can read it
    setSelectedTriplet(picked)
    // Navigate to guardian encounter
    navigate('/guardian')
  }

  return (
    <div className="space-y-6">
      {/* En-tête du hublot Cosmoji */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl glass-strong border border-white/20 shadow-card p-6 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 text-8xl opacity-10">🌌</div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <CosmojiEmblem size={32} />
            <div>
              <h1 className="text-2xl font-bold text-white">Hublot Cosmoji</h1>
              <p className="text-slate-300 text-sm">Le cœur de votre mission - Sélectionnez 3 émojis pour générer votre énergie onirique</p>
            </div>
          </div>
          <div className="rounded-xl bg-white/10 border border-white/20 p-4">
            <p className="text-slate-200 text-sm leading-relaxed">
              🌟 <strong>Réseau collectif évolutif :</strong> Ce hublot affiche 22 émojis de base. Au début, ils sont tous isolés. 
              À chaque sélection de trio par un voyageur, les connexions se créent et se renforcent. 
              Plus la communauté sélectionne, plus le réseau se densifie !
            </p>
          </div>
        </div>
      </motion.div>

      {/* Panneau de sélection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <SelectionPanel 
          selected={picked}
          maxSelection={3}
          onClear={() => setPicked([])}
        />
      </motion.div>

      {/* Réseau interactif */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative rounded-2xl bg-black text-white shadow-lg p-6"
      >
        {/* Calm aurora overlay appears when exactly 3 selected */}
        <AuroraOverlay active={picked.length === 3} />
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-white mb-1">Réseau d'associations</h2>
            <p className="text-sm text-slate-300">
              Taille du cercle = popularité • Épaisseur des liens = co-occurrences ≥ 3 • Nœuds isolés = pas encore sélectionnés
            </p>
          </div>
          <button 
            onClick={() => setOpen(true)} 
            className="rounded-xl bg-slate-900 text-white px-4 py-2 hover:bg-slate-800 transition-colors duration-200"
          >
            Panthéon
          </button>
        </div>
        
        {/* Légende des couleurs */}
        <div className="mb-4 flex flex-wrap gap-2 text-xs">
          {[
            { element: 'air', color: '#22d3ee', label: 'Air' },
            { element: 'water', color: '#60a5fa', label: 'Eau' },
            { element: 'fire', color: '#f59e0b', label: 'Feu' },
            { element: 'earth', color: '#86efac', label: 'Terre' },
            { element: 'ice', color: '#93c5fd', label: 'Glace' },
            { element: 'aurora', color: '#34d399', label: 'Aurore' },
          ].map(({ element, color, label }) => (
            <div key={element} className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-800 border border-slate-700">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: color }}
              />
              <span className="text-slate-200">{label}</span>
            </div>
          ))}
        </div>

        <div className="rounded-xl border-2 border-slate-800 overflow-hidden mb-4">
          <EmojiNetwork
            stats={stats}
            selectable
            selected={picked}
            onToggle={handleToggle}
            maxNodes={22}
            maxLinks={100}
            minCooccurrence={3}
            glow
            getNodeColor={(id, sel) => {
              const meta = getEmojiMetadata(id)
              if (!meta) return undefined
              const palette = {
                air: { base: '#22d3ee', dark: '#0891b2' },
                water: { base: '#60a5fa', dark: '#2563eb' },
                fire: { base: '#f59e0b', dark: '#d97706' },
                earth: { base: '#86efac', dark: '#16a34a' },
                ice: { base: '#93c5fd', dark: '#3b82f6' },
                aurora: { base: '#34d399', dark: '#10b981' },
                light: { base: '#f5d0fe', dark: '#e879f9' },
                animal: { base: '#fca5a5', dark: '#ef4444' },
              }
              const col = palette[meta.element] || { base: '#0ea5e9', dark: '#0284c7' }
              return {
                fill: sel ? col.base : '#0ea5e9',
                stroke: sel ? col.dark : '#0ea5e9',
                fillOpacity: sel ? 0.85 : 0.12,
                strokeOpacity: sel ? 1 : 0.45,
              }
            }}
          />
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <div className="text-sm text-slate-300">
            {picked.length === 0 ? (
              <span className="text-slate-400 italic">Cliquez sur 3 émojis pour créer votre trio cosmique et enrichir le réseau</span>
            ) : (
              <>
                <span className="font-medium">Sélection :</span>{' '}
                <span className="font-mono text-xl ml-2">{picked.join(' ')}</span>
                <span className="ml-2 text-xs text-slate-500">({picked.length}/3)</span>
              </>
            )}
          </div>
          
          <motion.button
            onClick={handleResonance}
            disabled={picked.length !== 3}
            whileHover={picked.length === 3 ? { scale: 1.02 } : {}}
            whileTap={picked.length === 3 ? { scale: 0.98 } : {}}
            animate={picked.length === 3 && !prefersReduced ? {
              boxShadow: [
                '0 4px 6px rgba(16, 185, 129, 0.3)',
                '0 8px 16px rgba(16, 185, 129, 0.5)',
                '0 4px 6px rgba(16, 185, 129, 0.3)',
              ]
            } : {}}
            transition={picked.length === 3 && !prefersReduced ? { duration: 2.4, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.2 }}
            className={`rounded-xl px-6 py-3 font-semibold transition-all duration-300 ${
              picked.length === 3 
                ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg' 
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            {picked.length === 3 ? '✧ Générer l\'énergie onirique' : `Choisir ${3 - picked.length} émoji${3 - picked.length > 1 ? 's' : ''}`}
          </motion.button>
        </div>
      </motion.div>
      {/* Statistiques et tendances */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl bg-white text-slate-900 shadow-lg p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <span className="text-xl">📊</span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Tendances de la communauté</h2>
            <p className="text-sm text-slate-600">Les combinaisons les plus populaires</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <section className="rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 p-4">
            <h3 className="text-sm font-semibold text-blue-700 mb-3 flex items-center gap-2">
              <span>⭐</span> Top émojis
            </h3>
            <ul className="space-y-2">
              {stats.occurrences.slice(0, 8).map(({ items, count }, i) => (
                <li key={i} className="flex items-center justify-between text-sm">
                  <span className="text-2xl select-none">{items[0]}</span>
                  <span className="font-medium text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full text-xs">
                    {count}
                  </span>
                </li>
              ))}
            </ul>
          </section>
          
          <section className="rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 p-4">
            <h3 className="text-sm font-semibold text-purple-700 mb-3 flex items-center gap-2">
              <span>🔗</span> Top paires
            </h3>
            <ul className="space-y-2">
              {stats.pairs.slice(0, 8).map(({ items, count }, i) => (
                <li key={i} className="flex items-center justify-between text-sm">
                  <span className="text-xl select-none">{items.join(' ')}</span>
                  <span className="font-medium text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full text-xs">
                    {count}
                  </span>
                </li>
              ))}
            </ul>
          </section>
          
          <section className="rounded-xl bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 p-4">
            <h3 className="text-sm font-semibold text-emerald-700 mb-3 flex items-center gap-2">
              <span>✨</span> Top triplets
            </h3>
            <ul className="space-y-2">
              {stats.triples.slice(0, 8).map(({ items, count }, i) => (
                <li key={i} className="flex items-center justify-between text-sm">
                  <span className="text-lg select-none">{items.join(' ')}</span>
                  <span className="font-medium text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full text-xs">
                    {count}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </motion.div>
      <PantheonModal open={open} onClose={() => setOpen(false)} />
    </div>
  )
}
