import { motion } from 'framer-motion'
import OnimojiTriad from './OnimojiTriad.jsx'

export default function OnimojiCard({ item }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-white text-slate-900 shadow-card hover:shadow-card-hover p-4 border border-slate-200"
    >
      <div className="flex items-center gap-4">
        <OnimojiTriad emojis={item.emojis} size={84} />
        <div className="flex-1">
          <div className="text-sm text-slate-500">— {item.author || 'Anonyme'}</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {(item.tags || []).map((t) => (
              <span key={t} className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs">#{t}</span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
