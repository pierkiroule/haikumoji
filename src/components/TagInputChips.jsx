import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { suggestTags, normalizeTag } from '../utils/storage.js'

export default function TagInputChips({ value = [], onChange, placeholder = 'Ajouter des mots-clés', maxTags = 6, className = '' }) {
  const [input, setInput] = useState('')
  const [focus, setFocus] = useState(false)
  const [suggestions, setSuggestions] = useState([])

  const tags = Array.isArray(value) ? value : []
  const canAdd = tags.length < maxTags

  useEffect(() => {
    if (!input.trim()) {
      setSuggestions([])
      return
    }
    setSuggestions(suggestTags(input, 6))
  }, [input])

  const addTag = (label) => {
    if (!canAdd) return
    const n = normalizeTag(label)
    if (!n) return
    if (tags.includes(n)) return
    onChange?.([...tags, n])
    setInput('')
    setSuggestions([])
  }

  const removeTag = (label) => {
    onChange?.(tags.filter(t => t !== label))
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag(input)
    } else if (e.key === 'Backspace' && !input && tags.length) {
      removeTag(tags[tags.length - 1])
    }
  }

  return (
    <div className={`rounded-2xl bg-white text-slate-900 border border-slate-200 p-3 ${className}`}>
      <div className="flex flex-wrap gap-2">
        {tags.map((t) => (
          <motion.span
            key={t}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-200 text-emerald-700 text-sm"
          >
            #{t}
            <button onClick={() => removeTag(t)} className="text-emerald-700/70 hover:text-emerald-900 ml-1">×</button>
          </motion.span>
        ))}
        {canAdd && (
          <div className="relative flex-1 min-w-[120px]">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              onFocus={() => setFocus(true)}
              onBlur={() => setTimeout(() => setFocus(false), 150)}
              placeholder={placeholder}
              className="w-full px-3 py-1.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <AnimatePresence>
              {focus && suggestions.length > 0 && (
                <motion.ul
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="absolute z-10 mt-1 left-0 right-0 rounded-xl bg-white border border-slate-200 shadow-lg overflow-hidden"
                >
                  {suggestions.map((s) => (
                    <li
                      key={s.id}
                      className="px-3 py-2 text-sm hover:bg-slate-50 cursor-pointer"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => addTag(s.label)}
                    >
                      #{s.label}
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
      {!canAdd && (
        <div className="text-xs text-slate-500 mt-2">Limite de {maxTags} tags atteinte.</div>
      )}
    </div>
  )
}
