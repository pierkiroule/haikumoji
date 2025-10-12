import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import EmojiBubble from '../components/EmojiBubble.jsx'
import PantheonModal from '../components/PantheonModal.jsx'

const EMOJIS = [
  "🌬️","❄️","🐋","🌊","🔥","🌙","🛶","🌌","🧊","🌈","🐚","🪶","🌞","💧","🌿","🐚","🍂","🌑","☁️","🌊","🦭","🪵","🌕","🌠","🌧️","🎵","🐦","🪞","🪷","💫"
]

export default function Create() {
  const [selected, setSelected] = useState([])
  const [pantheonOpen, setPantheonOpen] = useState(false)

  const canCompose = selected.length >= 3 && selected.length <= 5

  const buttonLabel = canCompose ? 'Compose my Haïku' : 'Choose 3–5 emojis'

  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4 flex items-center justify-between">
        <div className="font-medium text-slate-700">HaïkuMoji</div>
        <div className="text-sm text-slate-600">{selected.length}/5</div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center gap-6 px-4">
        <div className="relative">
          <EmojiBubble emojis={EMOJIS} selected={selected} setSelected={setSelected} maxSelected={5} />

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
          >
            {buttonLabel}
          </button>
        </div>
      </main>

      <footer className="p-4 text-center text-xs text-slate-500">
        Prototype – animations <span className="font-mono">Framer Motion</span>, layout <span className="font-mono">Tailwind</span>
      </footer>

      <PantheonModal open={pantheonOpen} onClose={() => setPantheonOpen(false)} />
    </div>
  )
}
