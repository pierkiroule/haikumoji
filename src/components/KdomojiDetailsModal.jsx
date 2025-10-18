import { motion, AnimatePresence } from 'framer-motion'

export default function KdomojiDetailsModal({ kdomoji, onClose }) {
  if (!kdomoji) return null

  const rarityColors = {
    common: 'from-blue-500/20 to-cyan-500/20 border-blue-500/50',
    rare: 'from-purple-500/20 to-pink-500/20 border-purple-500/50',
    epic: 'from-orange-500/20 to-red-500/20 border-orange-500/50',
    legendary: 'from-yellow-500/20 to-amber-500/20 border-yellow-500/50',
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl glass-strong border-2 bg-gradient-to-br ${rarityColors[kdomoji.rarity]} shadow-2xl`}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full glass border border-white/20 flex items-center justify-center text-white hover:border-white/40 transition-all"
        >
          ✕
        </button>

        <div className="p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <motion.div
              className="text-8xl"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {kdomoji.emoji}
            </motion.div>
            <div>
              <div className="text-xs text-purple-300 font-semibold uppercase tracking-wide mb-1">
                Kdomoji {kdomoji.rarity}
              </div>
              <h2 className="text-3xl font-bold text-white">
                {kdomoji.title}
              </h2>
            </div>
          </div>

          {/* Message */}
          <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
            <p className="text-white leading-relaxed italic text-center">
              "{kdomoji.message}"
            </p>
          </div>

          {/* Resource Content */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="text-2xl">
                {getResourceTypeIcon(kdomoji.resourceType)}
              </div>
              <h3 className="text-xl font-bold text-white">
                {kdomoji.resourceTitle}
              </h3>
            </div>

            <div className="rounded-2xl bg-white/5 border border-white/10 p-5 space-y-4">
              <div>
                <div className="text-sm text-purple-300 font-semibold mb-2">
                  📜 Description
                </div>
                <p className="text-white leading-relaxed">
                  {kdomoji.resourceDescription}
                </p>
              </div>

              <div className="border-t border-white/10 pt-4">
                <div className="text-sm text-cyan-300 font-semibold mb-2">
                  🌍 Contexte culturel
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {kdomoji.culturalContext}
                </p>
              </div>
            </div>
          </div>

          {/* Achievement Badge (if applicable) */}
          {kdomoji.resourceType === 'achievement' && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/50 p-4 text-center"
            >
              <div className="text-3xl mb-2">🏆</div>
              <p className="text-white font-semibold">
                Succès débloqué !
              </p>
              <p className="text-sm text-slate-300 mt-1">
                Cette réalisation est maintenant visible dans votre atlas personnel
              </p>
            </motion.div>
          )}

          {/* Footer */}
          <div className="rounded-2xl glass border border-white/20 p-4">
            <p className="text-xs text-slate-300 text-center italic">
              💫 Le Cosmoji vivant remercie ses gardiens de l'Onimoji psychoculturel. Vos contributions nourrissent le réseau collectif et préservent les cultures oniriques du monde.
            </p>
          </div>

          {/* Action */}
          <button
            onClick={onClose}
            className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-6 py-4 font-semibold hover:shadow-lg transition-all"
          >
            ✨ Merci Cosmoji !
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

function getResourceTypeIcon(type) {
  const icons = {
    audio: '🎵',
    visual: '🎨',
    text: '📖',
    technique: '🧘',
    achievement: '🏆',
  }
  return icons[type] || '✨'
}
