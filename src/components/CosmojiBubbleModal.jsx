import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import OnimojiTriad from './OnimojiTriad.jsx'
import BubbleParticles from './BubbleParticles.jsx'
import { getShareUrlBase } from '../utils/config.js'

export default function CosmojiBubbleModal({ open, onClose, emojis = [], onContinue }) {
  const dialogRef = useRef(null)
  const closeBtnRef = useRef(null)
  const lastFocusedRef = useRef(null)

  // Basic focus trap and restore
  useEffect(() => {
    if (!open) {
      const toRestore = lastFocusedRef.current
      if (toRestore && typeof toRestore.focus === 'function') {
        setTimeout(() => toRestore.focus(), 0)
      }
      document.body.style.overflow = ''
      return
    }

    lastFocusedRef.current = document.activeElement
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (e) => {
      if (!open) return
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose?.()
      }
    }
    const id = setTimeout(() => {
      closeBtnRef.current?.focus?.()
    }, 0)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      clearTimeout(id)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose])

  const handleShare = async () => {
    const url = getShareUrlBase()
    const text = `✨ Ma bulle onirique du jour\n${(emojis || []).slice(0,3).join(' ')}\n`
    const data = { title: 'Bulle onirique – Cosmoji', text, url }
    try {
      if (navigator.share) {
        await navigator.share(data)
        return
      }
    } catch {}
    try {
      await navigator.clipboard.writeText(`${text}\n${url}`)
      // Optional: could show a toast if a system is present
    } catch {}
  }

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
            aria-labelledby="cosmoji-bubble-title"
            className="relative z-10 w-[92vw] max-w-xl rounded-2xl bg-white text-slate-900 shadow-2xl p-6 md:p-8"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.97, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 140, damping: 16 }}
            ref={dialogRef}
            tabIndex={-1}
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 h-9 w-9 rounded-full bg-slate-100 hover:bg-slate-200 active:bg-slate-300 transition flex items-center justify-center"
              aria-label="Fermer"
              ref={closeBtnRef}
            >
              ×
            </button>

            <div className="mb-6 text-center">
              <div className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-700 text-sm font-medium mb-3">
                Bulle onirique
              </div>
              <h2 id="cosmoji-bubble-title" className="text-xl font-semibold">Votre trio cosmique</h2>
            </div>

            {/* Effervescent bubble with the emoji triangle */}
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-full bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 shadow-inner overflow-hidden">
                <BubbleParticles active />
                <div className="absolute inset-0 flex items-center justify-center">
                  <OnimojiTriad emojis={emojis} size={260} />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleShare}
                className="flex-1 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                📤 Partager la bulle onirique
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onContinue}
                className="flex-1 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                ✧ Continuer vers le Guide
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
