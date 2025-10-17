import { motion, AnimatePresence } from 'framer-motion'

/**
 * SelectionPanel - Panneau de sélection visuel avec slots pour 3 émojis
 * Montre clairement quels émojis sont sélectionnés et combien il en reste à choisir
 */
export default function SelectionPanel({ 
  selected = [], 
  maxSelection = 3,
  onClear,
  className = '' 
}) {
  const slots = Array.from({ length: maxSelection }, (_, i) => ({
    index: i,
    emoji: selected[i] || null,
    isEmpty: !selected[i]
  }))

  const remainingSlots = maxSelection - selected.length
  const isComplete = selected.length === maxSelection

  return (
    <div className={`rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 shadow-2xl ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-sm">{selected.length}</span>
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">Vos émojis oniriques</h3>
            <p className="text-slate-300 text-sm">
              {isComplete 
                ? '✓ Sélection complète' 
                : `${remainingSlots} ${remainingSlots === 1 ? 'émoji restant' : 'émojis restants'}`}
            </p>
          </div>
        </div>
        
        {selected.length > 0 && (
          <motion.button
            onClick={onClear}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-sm text-slate-400 hover:text-white transition-colors duration-200 underline"
          >
            Réinitialiser
          </motion.button>
        )}
      </div>

      {/* Slots de sélection */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {slots.map((slot, index) => (
          <motion.div
            key={slot.index}
            className={`relative aspect-square rounded-2xl flex items-center justify-center transition-all duration-300 ${
              slot.isEmpty 
                ? 'bg-slate-700/50 border-2 border-dashed border-slate-600' 
                : 'bg-gradient-to-br from-emerald-500 to-cyan-500 border-2 border-emerald-400 shadow-lg'
            }`}
            animate={
              slot.isEmpty && selected.length === index
                ? {
                    borderColor: ['#475569', '#06b6d4', '#475569'],
                    scale: [1, 1.05, 1]
                  }
                : {}
            }
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <AnimatePresence mode="wait">
              {slot.emoji ? (
                <motion.div
                  key={`emoji-${index}`}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  className="text-5xl select-none"
                >
                  {slot.emoji}
                </motion.div>
              ) : (
                <motion.div
                  key={`empty-${index}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-3xl text-slate-500"
                >
                  {selected.length === index ? '👆' : '○'}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Numéro du slot */}
            <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-lg ${
              slot.isEmpty ? 'bg-slate-600 text-slate-400' : 'bg-white text-emerald-600'
            }`}>
              {index + 1}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Message d'aide */}
      <AnimatePresence mode="wait">
        {!isComplete ? (
          <motion.div
            key="help"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="rounded-xl bg-cyan-500/20 border border-cyan-400/30 p-4"
          >
            <p className="text-cyan-100 text-sm leading-relaxed">
              <span className="font-medium">💫 Cliquez sur les émojis</span> dans le réseau ci-dessous pour compléter votre sélection. 
              Ces 3 émojis formeront la base de votre rêve.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="rounded-xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-400/40 p-4"
          >
            <div className="flex items-center gap-3">
              <div className="text-2xl">✨</div>
              <div className="flex-1">
                <p className="text-emerald-100 font-medium text-sm">
                  Parfait ! Votre trio cosmique est prêt.
                </p>
                <p className="text-emerald-200/80 text-xs mt-1">
                  Cliquez sur "Valider" pour continuer votre voyage.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
