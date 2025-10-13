import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getHaikus, seedIfEmpty } from '../utils/storage.js'

export default function PantheonModal({ open, onClose }) {
  const [items, setItems] = useState([])

  useEffect(() => {
    if (!open) return
    seedIfEmpty()
    try {
      const top = [...getHaikus()].sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, 5)
      setItems(top)
    } catch {
      setItems([])
    }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            role="dialog"
            aria-modal="true"
            className="relative z-10 w-[92vw] max-w-xl rounded-2xl bg-white shadow-2xl p-6 md:p-8"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.97, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 140, damping: 16 }}
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 h-9 w-9 rounded-full bg-slate-100 hover:bg-slate-200 active:bg-slate-300 transition flex items-center justify-center"
              aria-label="Close"
            >
              ×
            </button>
            <div className="mb-4 flex items-center gap-2">
              <span className="text-2xl">🏛️</span>
              <h2 className="text-xl font-semibold">Panthéon – Top 5 de la semaine</h2>
            </div>
            <ul className="space-y-4">
              {items.map(item => (
                <li key={item.id} className="rounded-xl border border-slate-200 p-4 hover:shadow-md transition">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 text-xl">
                      {item.emojis.map((e, idx) => (
                        <span key={idx}>{e}</span>
                      ))}
                    </div>
                    <div className="text-sm text-slate-600">❤️ {item.likes}</div>
                  </div>
                  <pre className="mt-2 whitespace-pre-wrap font-sans text-slate-800 leading-relaxed">{item.text}</pre>
                  <div className="mt-2 text-sm text-slate-500">— {item.author}</div>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
