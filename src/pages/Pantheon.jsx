import { useEffect, useMemo, useState } from 'react'
import { getHaikus, seedIfEmpty } from '../utils/storage.js'

export default function Pantheon() {
  const [items, setItems] = useState([])

  useEffect(() => {
    seedIfEmpty()
    setItems(getHaikus())
  }, [])

  const top = useMemo(() => {
    return [...items].sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, 10)
  }, [items])

  return (
    <div className="space-y-4">
      {top.map((h) => (
        <div key={h.id} className="rounded-2xl bg-white shadow-lg p-6 ring-1 ring-yellow-100">
          <div className="text-xl mb-2 select-none">{h.emojis?.join(' ')}</div>
          <pre className="whitespace-pre-wrap leading-relaxed text-slate-800">{h.text}</pre>
          <div className="mt-2 text-sm text-slate-500">— {h.author}</div>
          <button
            className="mt-4 rounded-xl bg-slate-900 text-white px-4 py-2 hover:bg-slate-800 transition"
            onClick={() => {
              const url = window.location.origin
              const shareText = `${h.emojis?.join(' ')}\n\n${h.text}`
              const shareData = { title: 'Panthéon – HaïkuMoji', text: shareText, url }
              if (navigator.share) {
                navigator.share(shareData).catch(() => {})
              } else {
                navigator.clipboard.writeText(`${shareText}\n${url}`)
                alert('Lien copié !')
              }
            }}
          >
            Partager
          </button>
        </div>
      ))}
    </div>
  )
}
