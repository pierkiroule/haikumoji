import { motion } from 'framer-motion'

export default function FloatingEmojis({
  emojis = ['✨','🌸','🌙','🍃','💫'],
}) {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {emojis.map((e, i) => (
        <motion.span
          key={i}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: -30, opacity: 0.5 }}
          transition={{ duration: 6 + i, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
          className="absolute text-3xl"
          style={{ left: `${10 + i * 18}%`, top: `${20 + (i % 3) * 25}%` }}
        >
          {e}
        </motion.span>
      ))}
    </div>
  )
}
