import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useAnimationControls } from 'framer-motion'
import { ALL_EMOJIS } from '../utils/config.js'

const BUBBLE_SIZE = 400
const DEFAULT_EMOJI_SIZE = 36

function useFloatingPositions(count, containerSize, emojiSize) {
  const [positions, setPositions] = useState(() => new Array(count).fill(0).map(() => ({ x: 0, y: 0 })))
  const velocitiesRef = useRef(new Array(count).fill(0).map(() => ({ vx: 0, vy: 0 })))
  const controlsRef = useRef(new Array(count).fill(null).map(() => useAnimationControls()))
  const rafRef = useRef(null)

  useEffect(() => {
    // initialize random positions within circle
    const radius = containerSize / 2 - emojiSize
    const next = positions.map(() => {
      const t = Math.random() * Math.PI * 2
      const r = Math.sqrt(Math.random()) * radius
      return { x: Math.cos(t) * r, y: Math.sin(t) * r }
    })
    setPositions(next)

    // random soft velocities
    velocitiesRef.current = velocitiesRef.current.map(() => ({
      vx: (Math.random() * 0.6 - 0.3),
      vy: (Math.random() * 0.6 - 0.3),
    }))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, containerSize])

  useEffect(() => {
    const radius = containerSize / 2 - emojiSize
    const damping = 0.995
    const wallBounce = 0.95

    let lastTime = performance.now()

    const tick = () => {
      const now = performance.now()
      const dt = Math.min(33, now - lastTime) / 16.67 // normalize to ~60fps units
      lastTime = now

      setPositions(prev => {
        const next = prev.map((p, i) => {
          const v = velocitiesRef.current[i]

          // slow random drift
          v.vx += (Math.random() - 0.5) * 0.01
          v.vy += (Math.random() - 0.5) * 0.01

          let nx = p.x + v.vx * dt
          let ny = p.y + v.vy * dt

          // bounce softly on circle boundary
          const dist = Math.hypot(nx, ny)
          if (dist > radius) {
            const nxNorm = nx / dist
            const nyNorm = ny / dist
            // push back inside
            nx = nxNorm * radius
            ny = nyNorm * radius
            // reflect velocity
            const dot = v.vx * nxNorm + v.vy * nyNorm
            v.vx = (v.vx - 2 * dot * nxNorm) * wallBounce
            v.vy = (v.vy - 2 * dot * nyNorm) * wallBounce
          }

          v.vx *= damping
          v.vy *= damping

          return { x: nx, y: ny }
        })
        return next
      })

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [containerSize])

  return { positions, controls: controlsRef.current }
}

export default function EmojiBubble({
  emojis = ALL_EMOJIS,
  selected, // Set<string>
  setSelected,
  maxSelected = 5,
  size = BUBBLE_SIZE,
  emojiSize = DEFAULT_EMOJI_SIZE,
}) {
  const containerRef = useRef(null)
  const { positions } = useFloatingPositions(emojis.length, size, emojiSize)

  const handleToggle = (emoji) => {
    const isSelected = selected.includes(emoji)
    if (isSelected) {
      setSelected(selected.filter(e => e !== emoji))
    } else {
      if (selected.length >= maxSelected) return
      setSelected([...selected, emoji])
    }
  }

  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      <div
        ref={containerRef}
        className="w-full h-full rounded-full bg-white/70 backdrop-blur-sm shadow-inner shadow-blue-100 border border-white/60 overflow-hidden"
      >
        {emojis.map((emoji, i) => {
          const isSelected = selected.includes(emoji)
          const p = positions[i] || { x: 0, y: 0 }
          const center = size / 2
          const base = {
            x: center + p.x - emojiSize / 2,
            y: center + p.y - emojiSize / 2,
          }
          return (
            <motion.button
              key={i}
              className={`absolute flex items-center justify-center select-none`}
              style={{ width: emojiSize, height: emojiSize }}
              animate={{
                left: base.x,
                top: base.y,
                scale: isSelected ? 1.35 : 1,
                filter: isSelected ? 'drop-shadow(0 0 8px rgba(59,130,246,0.7))' : 'none',
              }}
              transition={{ type: 'spring', stiffness: 120, damping: 16 }}
              onClick={() => handleToggle(emoji)}
            >
              <span
                className={`transition-colors ${isSelected ? 'text-blue-600' : 'text-slate-700'}`}
                style={{ fontSize: Math.round(emojiSize * 0.8) }}
              >
                {emoji}
              </span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
