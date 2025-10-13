import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { getDraft, saveDraft, clearDraft, seedIfEmpty, getUser, addHaiku } from '../utils/storage.js'
import { useNavigate } from 'react-router-dom'
import EmojiBubble from '../components/EmojiBubble.jsx'
import PantheonModal from '../components/PantheonModal.jsx'

const EMOJIS = [
  "🌬️","❄️","🐋","🌊","🔥","🌙","🛶","🌌","🧊","🌈","🐚","🪶","🌞","💧","🌿","🐚","🍂","🌑","☁️","🌊","🦭","🪵","🌕","🌠","🌧️","🎵","🐦","🪞","🪷","💫"
]

export default function Create() {
  const [selected, setSelected] = useState([])
  const [pantheonOpen, setPantheonOpen] = useState(false)
  const [bubbleSize, setBubbleSize] = useState(360)
  const [emojiSize, setEmojiSize] = useState(36)
  const [lines, setLines] = useState(['', '', ''])
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    seedIfEmpty()
    const draft = getDraft()
    if (draft) {
      setSelected(Array.isArray(draft.emojis) ? draft.emojis : [])
      setLines(Array.isArray(draft.lines) && draft.lines.length === 3 ? draft.lines : ['', '', ''])
    }
    const computeSizes = () => {
      const vw = Math.max(320, Math.min(window.innerWidth, 640))
      const vh = Math.max(540, window.innerHeight)
      // bubble takes ~82vw but clamped, and considers available height
      const sizeFromWidth = Math.round(vw * 0.82)
      const sizeFromHeight = Math.round(Math.max(260, Math.min(vh * 0.48, 460)))
      const size = Math.min(sizeFromWidth, sizeFromHeight)
      const eSize = Math.max(28, Math.round(size * 0.085)) // 8.5% of bubble, >=28px
      setBubbleSize(size)
      setEmojiSize(eSize)
    }
    computeSizes()
    window.addEventListener('resize', computeSizes)
    return () => window.removeEventListener('resize', computeSizes)
  }, [])

  useEffect(() => {
    // persist draft as user selects/emits lines
    saveDraft({ emojis: selected, lines })
  }, [selected, lines])

  const canCompose = selected.length >= 3 && selected.length <= 5

  const buttonLabel = canCompose ? 'Composer mon Haïku' : 'Choisir 3–5 émojis'

  const handlePublish = () => {
    if (!canCompose) return
    const trimmed = lines.map(l => l.trim())
    if (trimmed.some(l => l.length === 0)) {
      setError('Complète les trois lignes avant de publier.')
      return
    }
    const user = getUser() || { name: 'Anonyme', id: null }
    const text = trimmed.join('\n')
    addHaiku({ emojis: selected.slice(0, 5), text, author: user.name, authorId: user.id })
    clearDraft()
    navigate('/community')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4 flex items-center justify-between">
        <div className="font-medium text-slate-700">HaïkuMoji</div>
        <div className="text-sm text-slate-600">{selected.length}/5</div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center gap-6 px-4">
        <div className="relative w-full flex items-center justify-center">
          <EmojiBubble
            emojis={EMOJIS}
            selected={selected}
            setSelected={setSelected}
            maxSelected={5}
            size={bubbleSize}
            emojiSize={emojiSize}
          />

          {/* Center glowing star */}
          <motion.button
            onClick={() => setPantheonOpen(true)}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full flex items-center justify-center bg-white shadow-glow border border-white/70"
            animate={{
              scale: [1, 1.08, 1],
              boxShadow: [
                '0 0 20px rgba(59,130,246,0.25)',
                '0 0 40px rgba(59,130,246,0.45)',
                '0 0 20px rgba(59,130,246,0.25)'
              ],
            }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            aria-label="Open Panthéon"
            title="Voir le Panthéon"
          >
            <span className="text-2xl">✨</span>
          </motion.button>
        </div>

        <div className="w-full max-w-sm">
          <button
            disabled={!canCompose}
            className={`w-full h-12 rounded-xl font-medium transition 
              ${canCompose ? 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-lg shadow-blue-200' : 'bg-slate-200 text-slate-500 cursor-not-allowed'}`}
            onClick={() => {
              const el = document.getElementById('compose-area')
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
            }}
          >
            {buttonLabel}
          </button>
        </div>

        {/* Compose area */}
        {canCompose && (
          <div id="compose-area" className="w-full max-w-sm rounded-2xl bg-white shadow p-4 space-y-3">
            <div className="text-lg select-none mb-1">{selected.join(' ')}</div>
            {[0,1,2].map((i) => (
              <div key={i} className="space-y-1">
                <label className="block text-sm text-slate-600">L{i+1}</label>
                <textarea
                  value={lines[i]}
                  onChange={(e) => setLines(lines.map((v, idx) => idx === i ? e.target.value : v))}
                  rows={2}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder={i===0 ? '5 syllabes…' : i===1 ? '7 syllabes…' : '5 syllabes…'}
                />
              </div>
            ))}
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              onClick={handlePublish}
              className="w-full h-12 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 active:bg-emerald-800 transition"
            >
              Publier
            </button>
          </div>
        )}
      </main>

      <footer className="p-4 text-center text-xs text-slate-500">
        Prototype – animations <span className="font-mono">Framer Motion</span>, layout <span className="font-mono">Tailwind</span>
      </footer>

      <PantheonModal open={pantheonOpen} onClose={() => setPantheonOpen(false)} />
    </div>
  )
}
