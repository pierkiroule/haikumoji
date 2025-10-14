import { useEffect, useState } from 'react'
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
      <section className="rounded-2xl bg-white text-slate-900 shadow-lg p-6">
        <h2 className="text-xl font-medium">Cosmoniris — Hublot Cosmoji</h2>
        <p className="mt-1 text-slate-600 text-sm">
          Voyage Inuit en 12 lunes : sélectionnez 3 émojis pour cette étape, puis explorez la Lune
          en cours et rencontrez un gardien onimoji inuit.
        </p>
        {!user && (
          <div className="mt-3 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-800 p-3 text-sm">
            Vous êtes en visite. Pour sélectionner et générer un rêve, inscrivez-vous localement.
            <div className="mt-2">
              <button onClick={handleSignup} className="rounded-lg bg-indigo-600 text-white px-3 py-1 text-sm">S’inscrire localement</button>
            </div>
          </div>
        )}
        <div className="mt-4">
          <EmojiNetwork
            stats={stats}
            selectable={Boolean(user)}
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
            onClick={goToLune}
            disabled={!user || picked.length !== 3}
            className={`rounded-xl px-3 py-2 text-sm font-medium transition ${user && picked.length === 3 ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-slate-200 text-slate-500 cursor-not-allowed'}`}
          >
            Valider cette étape — Aller à la Lune 🌙
          </button>
        </div>
      </section>
    </div>
  )
}
