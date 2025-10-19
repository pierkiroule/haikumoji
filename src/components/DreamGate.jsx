import { motion } from 'framer-motion'

export default function DreamGate({ onReset }) {
  return (
    <div className="relative min-h-[60vh] grid place-items-center text-center">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-aurora-purple/10 to-aurora-blue/10" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="space-y-6"
        aria-live="polite"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mx-auto w-48 h-48 rounded-full bg-gradient-to-br from-purple-500/30 to-cyan-500/30 border border-white/20 grid place-items-center shadow-card"
        >
          <motion.span
            animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="text-5xl"
          >
            🌀
          </motion.span>
        </motion.div>

        <div className="space-y-2">
          <h2 className="text-3xl font-semibold text-white">DreamGate activée</h2>
          <p className="text-slate-300">Entrez dans le rêve, explorateur onirique.</p>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={onReset}
            className="rounded-xl glass border border-white/20 text-white px-6 py-3 font-semibold hover:border-white/40 transition-all"
          >
            Rejouer la mission
          </button>
        </div>
      </motion.div>
    </div>
  )
}
