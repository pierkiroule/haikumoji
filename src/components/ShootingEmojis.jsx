import { motion, useReducedMotion } from 'framer-motion'
import { useMemo } from 'react'

export default function ShootingEmojis({ onCatch, emojis = ['✨','🌙','💫','⭐','🌠','🌟'], count = 7 }) {
  const prefersReduced = useReducedMotion()

  const shooters = useMemo(() => {
    return new Array(count).fill(0).map((_, i) => ({
      id: i,
      emoji: emojis[i % emojis.length],
      startYvh: Math.floor(10 + Math.random() * 75),
      driftYvh: Math.floor(-8 + Math.random() * 16),
      durationSec: 4.5 + Math.random() * 3,
      delaySec: Math.random() * 2,
      fontSizePx: Math.floor(26 + Math.random() * 18),
      rotateDeg: -10 + Math.random() * 20,
    }))
  }, [count, emojis])

  const handleKey = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onCatch?.()
    }
  }

  return (
    <div className="absolute inset-0 -z-10">
      {shooters.map(s => (
        <motion.button
          key={s.id}
          type="button"
          initial={{ x: '-15vw', y: `${s.startYvh}vh`, opacity: 0.6, rotate: s.rotateDeg }}
          animate={prefersReduced
            ? { opacity: 0.35 }
            : { x: '105vw', y: `${s.startYvh + s.driftYvh}vh`, opacity: [0.4, 0.9, 0.4] }
          }
          transition={prefersReduced
            ? { duration: 0 }
            : { duration: s.durationSec, delay: s.delaySec, repeat: Infinity, ease: 'linear' }
          }
          onClick={() => onCatch?.()}
          onKeyDown={handleKey}
          className="absolute bg-transparent border-0 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded"
          style={{ fontSize: `${s.fontSizePx}px`, lineHeight: 1 }}
          aria-label={`Attraper l'étoile ${s.emoji}`}
          tabIndex={0}
        >
          {s.emoji}
        </motion.button>
      ))}
    </div>
  )
}
