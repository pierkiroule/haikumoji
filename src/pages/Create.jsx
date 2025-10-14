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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-midnight-900 to-midnight-800">
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 flex items-center justify-between glass-strong border-b border-white/10"
      >
        <div className="font-semibold text-white flex items-center gap-2">
          <span className="text-2xl">✨</span>
          <span>HaïkuMoji</span>
        </div>
        <div className="px-3 py-1.5 rounded-full glass border border-white/20 text-sm font-medium text-white">
          {selected.length}/5 émojis
        </div>
      </motion.header>

      <main className="flex-1 flex flex-col items-center justify-center gap-8 px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative w-full flex items-center justify-center"
        >
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
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br from-white to-slate-100 text-slate-900 shadow-glow-lg border-2 border-white/70 hover:scale-110 transition-transform duration-300"
            animate={{
              scale: [1, 1.08, 1],
              boxShadow: [
                '0 0 20px rgba(59,130,246,0.25), 0 0 40px rgba(147,51,234,0.15)',
                '0 0 40px rgba(59,130,246,0.45), 0 0 60px rgba(147,51,234,0.25)',
                '0 0 20px rgba(59,130,246,0.25), 0 0 40px rgba(147,51,234,0.15)'
              ],
            }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            aria-label="Open Panthéon"
            title="Voir le Panthéon"
          >
            <span className="text-3xl">✨</span>
          </motion.button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full max-w-sm"
        >
          <motion.button
            disabled={!canCompose}
            whileHover={canCompose ? { scale: 1.02 } : {}}
            whileTap={canCompose ? { scale: 0.98 } : {}}
            className={`w-full h-14 rounded-2xl font-semibold transition-all duration-300 ${
              canCompose 
                ? 'bg-gradient-to-r from-midnight-400 to-midnight-500 text-white hover:shadow-aurora shadow-lg' 
                : 'glass text-slate-400 cursor-not-allowed border border-white/10'
            }`}
            onClick={() => setStep('compose')}
          >
            {buttonLabel}
          </motion.button>
        </motion.div>

        {/* Compose area */}
        {step === 'compose' && canCompose && (
          <motion.div 
            id="compose-area" 
            ref={composeRef} 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-sm rounded-2xl bg-white text-slate-900 shadow-card-hover p-6 space-y-4"
          >
            <div className="text-3xl select-none mb-2 text-center">{selected.join(' ')}</div>
            
            {suggestions.length > 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-xl border border-slate-200 p-4 bg-gradient-to-br from-slate-50 to-white"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    💡 Inspiration
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSuggestions(generateSequenceSuggestions(selected.slice(0, 3)))}
                    className="text-xs px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-900 hover:bg-slate-50 font-medium shadow-sm"
                  >
                    ↻ Refaire
                  </motion.button>
                </div>
                <ul className="space-y-2 max-h-56 overflow-auto pr-1">
                  {suggestions.map((s, i) => (
                    <motion.li 
                      key={i} 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-2 p-3 rounded-lg bg-white border border-slate-200 hover:border-slate-300 transition-colors"
                    >
                      <pre className="flex-1 whitespace-pre-wrap text-sm text-slate-800 leading-relaxed">{s}</pre>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setLines(s.split('\n').slice(0,3))}
                        className="self-start text-xs px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-500 text-white hover:from-emerald-700 hover:to-emerald-600 font-medium shadow-sm"
                        aria-label="Utiliser cette suggestion"
                      >
                        Utiliser
                      </motion.button>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}
            
            {[0,1,2].map((i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="space-y-2"
              >
                <label className="block text-sm font-medium text-slate-700">
                  Ligne {i+1} <span className="text-slate-400 font-normal">({i===1 ? '7' : '5'} syllabes)</span>
                </label>
                <textarea
                  value={lines[i]}
                  onChange={(e) => setLines(lines.map((v, idx) => idx === i ? e.target.value : v))}
                  rows={2}
                  className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 focus:outline-none focus:border-midnight-400 focus:ring-4 focus:ring-midnight-400/20 transition-all duration-300"
                  placeholder={i===0 ? 'Un rêve commence...' : i===1 ? 'L\'émotion s\'éveille...' : 'Le voyage continue...'}
                />
              </motion.div>
            ))}
            
            {error && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2"
              >
                {error}
              </motion.p>
            )}
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePublish}
              className="w-full h-14 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-semibold hover:from-emerald-700 hover:to-emerald-600 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              ✨ Publier mon haïku
            </motion.button>
          </motion.div>
        )}
      </main>

      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="p-4 text-center text-xs text-slate-400 glass-strong border-t border-white/10"
      >
        Prototype – animations <span className="font-mono text-slate-300">Framer Motion</span>, layout <span className="font-mono text-slate-300">Tailwind</span>
      </motion.footer>

      <PantheonModal open={pantheonOpen} onClose={() => setPantheonOpen(false)} />
    </div>
  )
}
