import { motion, useReducedMotion } from 'framer-motion'

export default function FloatingEmojis({
  emojis = ['✨','🌸','🌙','🍃','💫'],
}) {
  const prefersReduced = useReducedMotion()
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {emojis.map((e, i) => (
        <motion.span
          key={i}
          initial={prefersReduced ? { y: 0, opacity: 0.25 } : { y: 30, opacity: 0 }}
          animate={prefersReduced ? { y: 0, opacity: 0.25 } : { y: -30, opacity: 0.5 }}
          transition={prefersReduced ? { duration: 0 } : { duration: 6 + i, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
          className="absolute text-3xl"
          style={{ left: `${10 + i * 18}%`, top: `${20 + (i % 3) * 25}%` }}
        >
          {e}
        </motion.span>
      ))}
    </div>
  )
}
