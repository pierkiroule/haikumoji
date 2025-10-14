import { motion } from 'framer-motion'
import { getShareUrlBase } from '../utils/config.js'

export default function HaikuCard({ haiku, onLike }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group rounded-2xl bg-white text-slate-900 shadow-card hover:shadow-card-hover p-6 relative overflow-hidden"
    >
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-aurora-purple/5 to-aurora-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">
        <div className="text-3xl mb-3 select-none transform group-hover:scale-110 transition-transform duration-300">
          {haiku.emojis?.join(' ')}
        </div>
        
        <pre className="text-slate-800 mb-4 whitespace-pre-wrap leading-relaxed text-base font-normal">
          {haiku.text}
        </pre>
        
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-slate-500 font-medium">
            — {haiku.author || 'Anonyme'}
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onLike?.(haiku)}
            className="rounded-xl bg-gradient-to-r from-pink-50 to-pink-100 text-pink-700 px-4 py-2 border border-pink-200 hover:from-pink-100 hover:to-pink-200 hover:border-pink-300 transition-all duration-300 shadow-sm hover:shadow-md"
            aria-label="Aimer ce haïku"
          >
            <span className="flex items-center gap-2 font-medium">
              ❤️ {haiku.likes ?? 0}
            </span>
          </motion.button>
        </div>
        
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              const url = getShareUrlBase()
              const shareText = `${haiku.emojis?.join(' ')}\n\n${haiku.text}`
              const data = { title: 'HaïkuMoji', text: shareText, url }
              if (navigator.share) {
                navigator.share(data).catch(() => {})
              } else {
                navigator.clipboard.writeText(`${shareText}\n${url}`)
                alert('Lien copié !')
              }
            }}
            className="flex-1 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 text-white px-4 py-2.5 hover:from-slate-800 hover:to-slate-700 transition-all duration-300 font-medium shadow-sm hover:shadow-md"
            aria-label="Partager ce haïku"
          >
            📤 Partager
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
