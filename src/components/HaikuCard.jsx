export default function HaikuCard({ haiku, onLike }) {
  return (
    <div className="rounded-2xl bg-white shadow-lg p-5">
      <div className="text-2xl mb-2 select-none">{haiku.emojis?.join(' ')}</div>
      <pre className="text-slate-800 mb-3 whitespace-pre-wrap leading-relaxed">{haiku.text}</pre>
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-500">— {haiku.author || 'Anonyme'}</div>
        <button
          onClick={() => onLike?.(haiku)}
          className="rounded-xl bg-pink-50 text-pink-700 px-3 py-1 border border-pink-200 hover:bg-pink-100 transition"
          aria-label="Aimer ce haïku"
        >
          ❤️ {haiku.likes ?? 0}
        </button>
      </div>
      <div className="mt-3 flex gap-2">
        <button
          onClick={() => {
            const url = window.location.origin
            const shareText = `${haiku.emojis?.join(' ')}\n\n${haiku.text}`
            const data = { title: 'HaïkuMoji', text: shareText, url }
            if (navigator.share) {
              navigator.share(data).catch(() => {})
            } else {
              navigator.clipboard.writeText(`${shareText}\n${url}`)
              alert('Lien copié !')
            }
          }}
          className="rounded-xl bg-slate-900 text-white px-3 py-1 hover:bg-slate-800 transition"
          aria-label="Partager ce haïku"
        >
          Partager
        </button>
      </div>
    </div>
  )
}
