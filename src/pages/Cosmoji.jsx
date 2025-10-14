import { useEffect, useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import PantheonModal from '../components/PantheonModal.jsx'
import CosmojiEmblem from '../components/CosmojiEmblem.jsx'
import EmojiNetwork from '../components/EmojiNetwork.jsx'
import AuroraOverlay from '../components/AuroraOverlay.jsx'
import guardians from '../data/guardiansInuit.json'
import cosmojiData from '../data/cosmojiData.json'
import { computeEmojiStats, seedIfEmpty, setSelectedTriplet, getMoonIndex } from '../utils/storage.js'

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
      if (has) return prev.filter(e => e !== emoji)
      if (prev.length >= 3) return prev
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
      <div className="relative rounded-2xl bg-white text-slate-900 shadow-lg p-6">
        {/* Calm aurora overlay appears when exactly 3 selected */}
        <AuroraOverlay active={picked.length === 3} />
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-medium flex items-center gap-2">
            <span className="relative inline-flex items-center">
              <span className="text-2xl pr-2">○</span>
              <CosmojiEmblem size={24} />
            </span>
            Cosmojî – Réseau d'associations
          </h2>
          <button onClick={() => setOpen(true)} className="rounded-xl bg-slate-900 text-white px-3 py-1">Panthéon</button>
        </div>
        <p className="mt-2 text-sm text-slate-600">Chaque nœud représente un émoji (taille = occurrences). Les liens indiquent les co‑occurrences (épaisseur = force).</p>
        <div className="mt-4">
          <EmojiNetwork
            stats={stats}
            selectable
            selected={picked}
            onToggle={handleToggle}
            maxNodes={30}
            maxLinks={200}
            glow
            getNodeColor={(id, sel) => {
              const node = cosmojiData.nodes.find(n => n.id === id)
              if (!node) return undefined
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
              const col = palette[node.element] || { base: '#0ea5e9', dark: '#0284c7' }
              return {
                fill: sel ? col.base : '#0ea5e9',
                stroke: sel ? col.dark : '#0ea5e9',
                fillOpacity: sel ? 0.28 : 0.12,
                strokeOpacity: sel ? 0.75 : 0.45,
              }
            }}
          />
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="text-sm text-slate-600 select-none">
            Sélection: <span className="font-mono">{picked.join(' ') || '—'}</span>
          </div>
          <motion.button
            onClick={handleResonance}
            disabled={picked.length !== 3}
            whileTap={{ scale: 0.98 }}
            animate={picked.length === 3 && !prefersReduced ? { scale: [1, 1.04, 1] } : { scale: 1 }}
            transition={picked.length === 3 && !prefersReduced ? { duration: 2.4, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.2 }}
            className={`rounded-xl px-3 py-1 text-sm font-medium transition ${picked.length === 3 ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-slate-200 text-slate-500 cursor-not-allowed'}`}
          >
            Entrer en résonance ✧
          </motion.button>
        </div>
      </div>
      <div className="relative rounded-2xl bg-white text-slate-900 shadow-lg p-6">
        <button
          className="absolute top-4 left-4 rounded-xl bg-white/90 text-slate-900 backdrop-blur px-3 py-1 shadow border hover:bg-white"
          onClick={() => history.back()}
        >
          ← Retour
        </button>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-medium flex items-center gap-2">
            <span className="relative inline-flex items-center">
              <span className="text-2xl pr-2">○</span>
              <CosmojiEmblem size={24} />
            </span>
            Cosmojî – Tendances
          </h2>
          <button onClick={() => setOpen(true)} className="rounded-xl bg-slate-900 text-white px-3 py-1">Panthéon</button>
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <section>
            <h3 className="text-slate-600 mb-2">Top émojis</h3>
            <ul className="space-y-1">
              {stats.occurrences.slice(0, 8).map(({ items, count }, i) => (
                <li key={i} className="flex items-center justify-between">
                  <span className="select-none">{items[0]}</span>
                  <span className="text-slate-500">{count}</span>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h3 className="text-slate-600 mb-2">Top paires</h3>
            <ul className="space-y-1">
              {stats.pairs.slice(0, 8).map(({ items, count }, i) => (
                <li key={i} className="flex items-center justify-between">
                  <span className="select-none">{items.join(' ')}</span>
                  <span className="text-slate-500">{count}</span>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h3 className="text-slate-600 mb-2">Top triplets</h3>
            <ul className="space-y-1">
              {stats.triples.slice(0, 8).map(({ items, count }, i) => (
                <li key={i} className="flex items-center justify-between">
                  <span className="select-none">{items.join(' ')}</span>
                  <span className="text-slate-500">{count}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
      <PantheonModal open={open} onClose={() => setOpen(false)} />
    </div>
  )
}
