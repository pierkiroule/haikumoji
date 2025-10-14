import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import HaikuCard from '../components/HaikuCard.jsx'
import { getHaikus, likeHaiku, seedIfEmpty } from '../utils/storage.js'

export default function Community() {
  const [items, setItems] = useState([])

  useEffect(() => {
    seedIfEmpty()
    setItems(getHaikus())
  }, [])

  const handleLike = (h) => {
    const next = likeHaiku(h.id)
    setItems(next)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3"
      >
        <div className="inline-block px-4 py-2 rounded-full glass border border-white/10 mb-2">
          <span className="text-sm font-medium text-white">💖 Communauté</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
          Haïkus partagés
        </h1>
        <p className="text-slate-300 max-w-2xl mx-auto">
          Découvrez les créations oniriques de la communauté. Chaque suggestion onirique est une fenêtre vers l'univers intérieur de son auteur.
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <div className="glass-strong rounded-2xl p-4 text-center border border-white/10">
          <div className="text-3xl font-bold bg-gradient-to-r from-aurora-purple to-aurora-blue bg-clip-text text-transparent">
            {items.length}
          </div>
          <div className="text-sm text-slate-400 mt-1">Haïkus</div>
        </div>
        <div className="glass-strong rounded-2xl p-4 text-center border border-white/10">
          <div className="text-3xl font-bold bg-gradient-to-r from-aurora-blue to-aurora-cyan bg-clip-text text-transparent">
            {items.reduce((acc, h) => acc + (h.likes || 0), 0)}
          </div>
          <div className="text-sm text-slate-400 mt-1">Likes</div>
        </div>
        <div className="glass-strong rounded-2xl p-4 text-center border border-white/10">
          <div className="text-3xl font-bold bg-gradient-to-r from-aurora-cyan to-aurora-pink bg-clip-text text-transparent">
            {new Set(items.map(h => h.authorId)).size}
          </div>
          <div className="text-sm text-slate-400 mt-1">Auteurs</div>
        </div>
        <div className="glass-strong rounded-2xl p-4 text-center border border-white/10">
          <div className="text-3xl font-bold bg-gradient-to-r from-aurora-pink to-aurora-purple bg-clip-text text-transparent">
            {items.reduce((acc, h) => acc + (h.emojis?.length || 0), 0)}
          </div>
          <div className="text-sm text-slate-400 mt-1">Émojis</div>
        </div>
      </motion.div>

      {/* Suggestions Oniriques Grid */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {items.map((h, index) => (
          <motion.div
            key={h.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
          >
            <HaikuCard haiku={h} onLike={handleLike} />
          </motion.div>
        ))}
      </motion.div>

      {items.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <div className="text-6xl mb-4">🌙</div>
          <p className="text-slate-400">Aucun haïku pour le moment.</p>
          <p className="text-slate-500 text-sm mt-2">Soyez le premier à partager votre création !</p>
        </motion.div>
      )}
    </div>
  )
}
