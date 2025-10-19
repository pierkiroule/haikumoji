import { useState } from 'react'
import Starfield from '../components/Starfield.jsx'
import ShootingEmojis from '../components/ShootingEmojis.jsx'
import DreamGate from '../components/DreamGate.jsx'

export default function Mission() {
  const TOTAL = 5
  const [caughtCount, setCaughtCount] = useState(0)
  const [gateOpen, setGateOpen] = useState(false)

  const handleCatch = () => {
    setCaughtCount(prev => {
      const next = Math.min(TOTAL, prev + 1)
      if (next === TOTAL) setGateOpen(true)
      return next
    })
  }

  const handleReset = () => {
    setCaughtCount(0)
    setGateOpen(false)
  }

  return (
    <div className="relative min-h-[70vh]">
      <Starfield />

      <div className="relative z-10 space-y-8">
        {!gateOpen ? (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-4xl md:text-5xl font-display tracking-tight">🛰️ Mission Onimoji</h1>
              <p className="text-slate-300">
                Attrapez <strong>{TOTAL} étoiles-émojis</strong> pour activer la <strong>DreamGate</strong>.
              </p>
            </div>

            <div className="relative h-[48vh] rounded-3xl glass-strong border border-white/20 overflow-hidden">
              <div className="absolute inset-0 grid place-items-center pointer-events-none">
                <div className="w-40 h-40 rounded-full glass border border-white/20 grid place-items-center text-4xl">🌌</div>
              </div>

              <ShootingEmojis onCatch={handleCatch} />
            </div>

            <div className="text-center space-y-3">
              <div className="mx-auto max-w-md">
                <div className="flex items-center justify-between text-sm text-slate-300 mb-1">
                  <span>Progression</span>
                  <span>{caughtCount} / {TOTAL}</span>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden" aria-label="Progression de la mission" aria-valuemin={0} aria-valuemax={TOTAL} aria-valuenow={caughtCount} role="progressbar">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all"
                    style={{ width: `${(caughtCount / TOTAL) * 100}%` }}
                  />
                </div>
                <div className="sr-only" aria-live="polite">{caughtCount} étoiles attrapées</div>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="rounded-xl glass border border-white/20 text-white px-4 py-2 text-sm hover:border-white/40 transition-all"
              >
                Réinitialiser
              </button>
            </div>
          </div>
        ) : (
          <DreamGate onReset={handleReset} />
        )}
      </div>
    </div>
  )
}
