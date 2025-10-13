import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { getDraft, saveDraft, clearDraft, seedIfEmpty, getUser, addHaiku } from '../utils/storage.js'
import { generateSequenceSuggestions } from '../utils/aiMock.js'
import { useNavigate } from 'react-router-dom'
import EmojiBubble from '../components/EmojiBubble.jsx'
import { ALL_EMOJIS } from '../utils/config.js'
import PantheonModal from '../components/PantheonModal.jsx'

const EMOJIS = ALL_EMOJIS

export default function Create() {
  const [selected, setSelected] = useState([])
  const [pantheonOpen, setPantheonOpen] = useState(false)
  const [bubbleSize, setBubbleSize] = useState(360)
  const [emojiSize, setEmojiSize] = useState(36)
  const [lines, setLines] = useState(['', '', ''])
  const [error, setError] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [step, setStep] = useState('select') // 'select' | 'compose'
  const navigate = useNavigate()
  const composeRef = useRef(null)

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

  // Refresh sequence-based suggestions when entering compose or changing selection
  useEffect(() => {
    if (step !== 'compose') return
    if (selected.length < 3) {
      setSuggestions([])
      return
    }
    setSuggestions(generateSequenceSuggestions(selected.slice(0, 3)))
  }, [step, selected])

  const canCompose = selected.length >= 3 && selected.length <= 5

  const buttonLabel = canCompose ? 'Composer mon Haïku' : 'Choisir 3–5 émojis'

  // If the user deselects below threshold while composing, go back to select step
  useEffect(() => {
    if (!canCompose && step !== 'select') {
      setStep('select')
    }
  }, [canCompose, step])

  // When entering compose step, scroll the compose area into view
  useEffect(() => {
    if (step === 'compose') {
      // delay to ensure the section is rendered before scrolling
      setTimeout(() => {
        const el = composeRef.current || document.getElementById('compose-area')
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 0)
    }
  }, [step])

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
            onClick={() => setStep('compose')}
          >
            {buttonLabel}
          </button>
        </div>

        {/* Compose area */}
        {step === 'compose' && canCompose && (
          <div id="compose-area" ref={composeRef} className="w-full max-w-sm rounded-2xl bg-white shadow p-4 space-y-3">
            <div className="text-lg select-none mb-1">{selected.join(' ')}</div>
            {suggestions.length > 0 && (
              <div className="rounded-xl border border-slate-200 p-3 bg-slate-50">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-slate-600">Inspiration (séquence {selected.slice(0,3).join(' ')})</div>
                  <button
                    onClick={() => setSuggestions(generateSequenceSuggestions(selected.slice(0, 3)))}
                    className="text-xs px-2 py-1 rounded-lg border bg-white hover:bg-slate-100"
                  >↻ Refaire</button>
                </div>
                <ul className="space-y-2 max-h-56 overflow-auto pr-1">
                  {suggestions.map((s, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <pre className="flex-1 whitespace-pre-wrap text-sm text-slate-800">{s}</pre>
                      <button
                        onClick={() => setLines(s.split('\n').slice(0,3))}
                        className="self-start text-xs px-2 py-1 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                        aria-label="Utiliser cette suggestion"
                      >Utiliser</button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
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
