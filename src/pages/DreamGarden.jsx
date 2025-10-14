import { useEffect, useMemo, useState } from 'react'
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

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-white text-slate-900 shadow p-6">
        <h2 className="text-2xl font-medium">Jardin du Rêve</h2>
        <p className="text-slate-600 mt-1 text-sm">{seeds.length} graine(s) collectée(s) — Lune en cours : {moon}/12</p>
        {completed && (
          <div className="mt-3 rounded-xl bg-gradient-to-r from-emerald-200/60 via-sky-200/60 to-fuchsia-200/60 p-3 border border-white/50">
            <div className="text-slate-800">Aurora des Rêves — le cycle est complet. Respire sous le ciel ouvert.</div>
          </div>
        )}
      </section>

      <section className="rounded-2xl bg-white text-slate-900 shadow p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Array.from({ length: 12 }, (_, i) => i + 1).map((idx) => {
            const list = byMoon.get(String(idx)) || []
            const has = list.length > 0
            return (
              <div key={idx} className={`relative rounded-xl border p-3 h-24 flex flex-col items-center justify-center ${has ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
                <div className="text-xs text-slate-600 mb-1">Lune {idx}</div>
                {has ? (
                  <div className="text-xl select-none">{list[0].emojis?.join(' ')}</div>
                ) : (
                  <div className="text-slate-400 text-sm">—</div>
                )}
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
