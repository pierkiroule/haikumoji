import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import guardians from '../data/guardiansInuit.json'
import { addStarSeed, getMoonIndex, getSelectedTriplet, nextMoon, seedIfEmpty, strengthenCosmojiCounts } from '../utils/storage.js'

function pickGuardianByResonance(triplet) {
  // Map emojis to candidate guardians by matching element or emoji
  const elementsOfEmoji = {
    '🌬️': 'air', '❄️': 'ice', '🐋': 'animal', '🌊': 'water', '🔥': 'fire',
    '🌙': 'light', '🛶': 'earth', '🌌': 'aurora', '🧊': 'ice', '🌈': 'light',
    '🐚': 'water', '🪶': 'air', '🌞': 'light', '💧': 'water', '🌿': 'earth',
    '🍂': 'earth', '🌑': 'light', '☁️': 'air', '🦭': 'animal', '🪵': 'earth',
    '🌕': 'light', '🌠': 'light', '🌧️': 'water', '🎵': 'air', '🐦': 'air',
    '🪞': 'water', '🪷': 'water', '💫': 'aurora', '⭐': 'light', '🏔️': 'ice',
  }
  const counts = new Map()
  for (const e of triplet) {
    const el = elementsOfEmoji[e]
    if (!el) continue
    for (const g of guardians) {
      if (g.emoji === e) {
        counts.set(g.id, (counts.get(g.id) || 0) + 3)
      }
      if (g.element === el) {
        counts.set(g.id, (counts.get(g.id) || 0) + 1)
      }
    }
  }
  // Tie-breaker: pick current moon guardian if present
  const moon = getMoonIndex()
  const moonGuardian = guardians.find(g => g.id === moon)
  if (moonGuardian) {
    counts.set(moonGuardian.id, (counts.get(moonGuardian.id) || 0) + 1)
  }
  // Select max score
  let best = guardians[0]
  let bestScore = -Infinity
  for (const g of guardians) {
    const s = counts.get(g.id) || 0
    if (s > bestScore) { best = g; bestScore = s }
  }
  return best
}

export default function Guardian() {
  const [triplet, setTriplet] = useState([])
  const [guardian, setGuardian] = useState(null)
  const [aurora, setAurora] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    seedIfEmpty()
    const t = getSelectedTriplet()
    setTriplet(t)
    const g = pickGuardianByResonance(t)
    setGuardian(g)
    // Strengthen co-occurrence stats based on selection
    strengthenCosmojiCounts(t)
    // Small timed aurora effect
    const id = setTimeout(() => setAurora(false), 1600)
    return () => clearTimeout(id)
  }, [])

  const handleCollect = () => {
    if (!guardian) return
    const current = getMoonIndex()
    addStarSeed({ moon: current, guardianId: guardian.id, emojis: triplet, element: guardian.element })
    // Progress to next moon after collecting
    try { nextMoon() } catch {}
    alert('Une graine d’étoile a rejoint votre Jardin du Rêve.')
    navigate('/dreamgarden')
  }

  if (!guardian) {
    return (
      <div className="rounded-2xl bg-white text-slate-900 shadow p-6 text-center">Aucun gardien trouvé.</div>
    )
  }

  return (
    <div className="relative space-y-6">
      {/* Aurora overlay */}
      {aurora && (
        <div className="pointer-events-none absolute -inset-2 rounded-3xl opacity-80"
             style={{
               background: 'radial-gradient(120% 80% at 50% 0%, rgba(16,185,129,0.25), rgba(59,130,246,0.16) 40%, transparent 70%)',
               filter: 'blur(8px) saturate(120%)',
               mixBlendMode: 'screen'
             }}
        />
      )}

      <section className="relative rounded-2xl bg-white text-slate-900 shadow p-6 overflow-hidden">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-medium">Rencontre — {guardian.title}</h2>
          <div className="text-2xl select-none">{guardian.emoji}</div>
        </div>
        <p className="text-slate-600 mt-2">{guardian.name} · Élement : {guardian.element}</p>
        <p className="mt-4 text-lg leading-relaxed">“{guardian.message}”</p>
        <div className="mt-4 text-2xl select-none">{triplet.join(' ')}</div>
        <div className="mt-6 flex items-center gap-3">
          <button onClick={handleCollect} className="rounded-xl bg-emerald-600 text-white px-4 py-2 hover:bg-emerald-700 transition">Collecter une graine ✧</button>
          <button onClick={() => navigate('/cosmoji')} className="rounded-xl bg-slate-900 text-white px-4 py-2">Retour au Cosmoji</button>
        </div>
      </section>

      <section className="rounded-2xl bg-white text-slate-900 shadow p-6">
        <h3 className="text-lg font-medium">Rituel de nuit</h3>
        <p className="mt-2 text-slate-700">{guardian.ritual}</p>
      </section>
    </div>
  )
}
