import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
      <section className="rounded-2xl bg-white text-slate-900 shadow p-6">
        <h2 className="text-2xl font-medium">{meta.titre}</h2>
        <p className="text-slate-600 mt-1 text-sm">{meta.ressource}</p>
        <div className="mt-3">
          <button
            onClick={() => navigate('/guardian')}
            className="rounded-xl bg-indigo-600 text-white px-3 py-2 text-sm hover:bg-indigo-700"
          >
            Rencontrer le gardien ✧
          </button>
        </div>
      </section>

      <section className="rounded-2xl bg-white text-slate-900 shadow p-6">
        <div className="text-3xl select-none">{triplet.join(' ') || '—'}</div>
        {!user && (
          <div className="mt-3 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-800 p-3 text-sm">
            Inscrivez-vous localement pour générer et sauvegarder un rêve.
          </div>
        )}
        <pre className="mt-3 whitespace-pre-wrap leading-relaxed text-slate-800">{text}</pre>
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={() => {
              if (!user) { alert('Inscription locale requise.'); return }
              setText(generateDreamText(triplet, corpus))
            }}
            disabled={!user}
            className={`rounded-xl px-3 py-2 ${user ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-500 cursor-not-allowed'}`}
          >
            Regénérer
          </button>
          <button
            onClick={handleSave}
            disabled={!user}
            className={`rounded-xl px-3 py-2 ${user ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500 cursor-not-allowed'}`}
          >
            Sauvegarder
          </button>
          <button onClick={handleNext} className="rounded-xl bg-indigo-600 text-white px-3 py-2">Lune suivante →</button>
        </div>
      </section>
    </div>
  )
}
