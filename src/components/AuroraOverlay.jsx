import { motion, useReducedMotion } from 'framer-motion'

export default function AuroraOverlay({ active = false, height = 240, opacity = 0.6 }) {
  const prefersReduced = useReducedMotion()

  const baseTransition = prefersReduced
    ? { duration: 0 }
    : { duration: 12, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror' }

  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 -z-10 overflow-hidden"
      style={{ height }}
      aria-hidden
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: active ? opacity : 0 }}
        transition={{ duration: prefersReduced ? 0 : 0.6, ease: 'easeOut' }}
        className="absolute inset-0"
      >
        {/* Layer 1: green -> teal */}
        <motion.span
          className="absolute -inset-x-10 -top-10 h-[200%] mix-blend-screen"
          style={{
            background:
              'linear-gradient(120deg, rgba(52,211,153,0.55), rgba(45,212,191,0.35) 40%, rgba(59,130,246,0.30) 70%, rgba(167,139,250,0.25))',
            filter: 'blur(48px)'
          }}
          initial={false}
          animate={prefersReduced ? { x: 0 } : { x: [ -40, 40, -40 ] }}
          transition={{ ...baseTransition, duration: 16 }}
        />

        {/* Layer 2: cyan ribbon */}
        <motion.span
          className="absolute -inset-x-20 top-0 h-[180%] mix-blend-screen"
          style={{
            background:
              'linear-gradient(100deg, rgba(56,189,248,0.42), rgba(99,102,241,0.28))',
            filter: 'blur(56px)'
          }}
          initial={false}
          animate={prefersReduced ? { x: 0 } : { x: [ 30, -30, 30 ] }}
          transition={{ ...baseTransition, duration: 20 }}
        />

        {/* Layer 3: soft magenta tint */}
        <motion.span
          className="absolute -inset-x-24 -top-12 h-[200%] mix-blend-screen"
          style={{
            background:
              'linear-gradient(140deg, rgba(244,114,182,0.18), rgba(192,132,252,0.18))',
            filter: 'blur(72px)'
          }}
          initial={false}
          animate={prefersReduced ? { x: 0 } : { x: [ -20, 20, -20 ] }}
          transition={{ ...baseTransition, duration: 24 }}
        />
      </motion.div>
    </div>
  )
}
