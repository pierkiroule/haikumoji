import { useState } from 'react'
import TagCatcher from '../components/TagCatcher.jsx'

export default function TagCatcherPage() {
  const [result, setResult] = useState(null)

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-display font-light text-white">TagCatcher (Étoile 5 branches)</h1>
        <p className="text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
          Remplace la sélection par un tissage en étoile. Sélectionnez 5 émojis, puis nommez les 5 points et le centre.
        </p>
      </div>

      <div className="rounded-3xl glass-strong border border-white/20 p-4 grid place-items-center">
        <TagCatcher onComplete={setResult} />
      </div>

      {result && (
        <div className="rounded-2xl bg-emerald-500/10 border border-emerald-400/30 p-4 text-emerald-100">
          <div className="font-semibold mb-1">Étoile complétée</div>
          <div className="text-sm">Émojis: <span className="font-mono">{result.emojis.join(' ')}</span></div>
          {result.title && <div className="text-sm">Titre: <span className="font-mono">{result.title}</span></div>}
          <div className="text-sm">Échos: <span className="font-mono">{result.echoes.join(' | ')}</span></div>
        </div>
      )}
    </div>
  )
}
