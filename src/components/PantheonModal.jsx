import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getHaikus, seedIfEmpty } from '../utils/storage.js'

export default function PantheonModal({ open, onClose }) {
  const [items, setItems] = useState([])
  const dialogRef = useRef(null)
  const closeBtnRef = useRef(null)
  const lastFocusedRef = useRef(null)

  useEffect(() => {
    if (!open) {
      return
    }
    seedIfEmpty()
    try {
      const top = [...getHaikus()].sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, 5)
      setItems(top)
    } catch {
      setItems([])
    }
  }, [open])

  // Focus management: trap focus inside, set initial focus, restore on close
  useEffect(() => {
    if (!open) {
      // restore focus to the opener if possible
      const toRestore = lastFocusedRef.current
      if (toRestore && typeof toRestore.focus === 'function') {
        setTimeout(() => toRestore.focus(), 0)
      }
      document.body.style.overflow = ''
      return
    }

    lastFocusedRef.current = document.activeElement
    document.body.style.overflow = 'hidden'

    const focusableSelectors = [
      'a[href]', 'area[href]', 'button:not([disabled])', 'input:not([disabled])',
      'select:not([disabled])', 'textarea:not([disabled])', '[tabindex]:not([tabindex="-1"])'
    ].join(',')

    const focusFirst = () => {
      const root = dialogRef.current
      if (!root) return
      const nodes = Array.from(root.querySelectorAll(focusableSelectors))
      const target = closeBtnRef.current || nodes[0]
      if (target && typeof target.focus === 'function') target.focus()
    }

    const handleKeyDown = (e) => {
      if (!open) return
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose?.()
        return
      }
      if (e.key === 'Tab') {
        const root = dialogRef.current
        if (!root) return
        const nodes = Array.from(root.querySelectorAll(focusableSelectors)).filter(el => el.offsetParent !== null)
        if (nodes.length === 0) return
        const first = nodes[0]
        const last = nodes[nodes.length - 1]
        const active = document.activeElement
        if (e.shiftKey) {
          if (active === first || !root.contains(active)) {
            e.preventDefault()
            last.focus()
          }
        } else {
          if (active === last || !root.contains(active)) {
            e.preventDefault()
            first.focus()
          }
        }
      }
    }

    // Initial focus after mount of dialog content
    const id = setTimeout(focusFirst, 0)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      clearTimeout(id)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose])

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
            aria-labelledby="pantheon-title"
            className="relative z-10 w-[92vw] max-w-xl rounded-2xl bg-white shadow-2xl p-6 md:p-8"
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
              aria-label="Close"
              ref={closeBtnRef}
            >
              ×
            </button>
            <div className="mb-4 flex items-center gap-2">
              <span className="text-2xl">🏛️</span>
              <h2 id="pantheon-title" className="text-xl font-semibold">Panthéon – Top 5 de la semaine</h2>
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
