import { useEffect, useMemo, useState } from 'react'
import PantheonModal from '../components/PantheonModal.jsx'
import EmojiNetwork from '../components/EmojiNetwork.jsx'
import { computeEmojiStats, seedIfEmpty, addHaiku, getUser } from '../utils/storage.js'

export default function Cosmoji() {
  const [open, setOpen] = useState(false)
  const [stats, setStats] = useState({ occurrences: [], pairs: [], triples: [] })
  const [picked, setPicked] = useState([]) // up to 3

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

  const handleCreateFromPicked = () => {
    if (picked.length !== 3) return
    const user = getUser() || { name: 'Anonyme', id: null }
    const text = ''
    addHaiku({ emojis: picked.slice(0, 3), text, author: user.name, authorId: user.id })
    setPicked([])
    setStats(computeEmojiStats())
    alert('Triplet ajouté au Cosmojî.')
  }

  return (
    <div className="space-y-6">
      <div className="relative rounded-2xl bg-white shadow-lg p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-medium">Cosmojî – Réseau d'associations</h2>
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
          />
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="text-sm text-slate-600 select-none">
            Sélection: <span className="font-mono">{picked.join(' ') || '—'}</span>
          </div>
          <button
            onClick={handleCreateFromPicked}
            disabled={picked.length !== 3}
            className={`rounded-xl px-3 py-1 text-sm font-medium transition ${picked.length === 3 ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-slate-200 text-slate-500 cursor-not-allowed'}`}
          >
            Créer un haïku avec ces 3
          </button>
        </div>
      </div>
      <div className="relative rounded-2xl bg-white shadow-lg p-6">
        <button
          className="absolute top-4 left-4 rounded-xl bg-white/80 backdrop-blur px-3 py-1 shadow border"
          onClick={() => history.back()}
        >
          ← Retour
        </button>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-medium">Cosmojî – Tendances</h2>
          <button onClick={() => setOpen(true)} className="rounded-xl bg-slate-900 text-white px-3 py-1">Panthéon</button>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
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
        </div>
      </div>
      <PantheonModal open={open} onClose={() => setOpen(false)} />
    </div>
  )
}
