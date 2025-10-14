import { useEffect, useMemo, useState } from 'react'
import { clearUserData, getMyHaikus, getUser, isSubscribed, saveUser, seedIfEmpty } from '../utils/storage.js'

export default function Profile() {
  const [user, setUser] = useState(null)
  const [myHaikus, setMyHaikus] = useState([])

  useEffect(() => {
    seedIfEmpty()
    const u = getUser() || saveUser({ name: 'Anonyme', subscription: { active: false } })
    setUser(u)
    setMyHaikus(getMyHaikus(u))
  }, [])

  const subscribed = useMemo(() => isSubscribed(user), [user])

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-white text-slate-900 shadow-lg p-6 text-center">
        <h2 className="text-2xl font-medium">Mon Profil</h2>
        <p className="text-slate-600 mt-2">Pseudo: {user?.name || '—'}</p>
        <p className="text-slate-600">Abonnement: {subscribed ? 'Actif' : 'Free'}</p>
      </section>

      <section>
        <h3 className="text-lg font-medium mb-3">Mes haïkus</h3>
        <ul className="space-y-3">
          {myHaikus.length === 0 && <li className="text-slate-500">Aucun haïku pour l’instant.</li>}
          {myHaikus.map(h => (
            <li key={h.id} className="rounded-xl bg-white text-slate-900 p-4 shadow">
              <div className="text-xl mb-1 select-none">{h.emojis?.join(' ')}</div>
              <pre className="whitespace-pre-wrap leading-relaxed">{h.text}</pre>
            </li>
          ))}
        </ul>
      </section>

      <button
        className="w-full rounded-xl bg-red-50 text-red-700 px-4 py-2 border border-red-200 hover:bg-red-100 transition"
        onClick={() => {
          clearUserData()
          setUser(null)
          setMyHaikus([])
          alert('Données effacées.')
        }}
      >
        Effacer mes données
      </button>
    </div>
  )
}
