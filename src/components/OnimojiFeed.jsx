import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getOnimojis, seedIfEmpty } from '../utils/storage.js'
import OnimojiCard from './OnimojiCard.jsx'

export default function OnimojiFeed({ className = '', refreshKey = 0 }) {
  const [items, setItems] = useState([])

  useEffect(() => {
    seedIfEmpty()
    setItems(getOnimojis())
  }, [refreshKey])

  return (
    <div className={`space-y-3 ${className}`}>
      {items.map((it) => (
        <OnimojiCard key={it.id} item={it} />
      ))}
      {items.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-slate-500 py-10"
        >
          Aucun onimoji pour le moment.
        </motion.div>
      )}
    </div>
  )}
