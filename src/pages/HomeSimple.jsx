import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { getUser } from '../utils/storage.js'

export default function HomeSimple() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const u = getUser()
    setUser(u)
  }, [])

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full text-center space-y-8 p-6"
      >
        {/* Logo/Icon */}
        <motion.div
          animate={{
            rotate: [0, 5, -5, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="text-8xl mb-8"
        >
          🌙✨🔮
        </motion.div>

        {/* Title */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Bienvenue dans Onimoji
          </h1>
          <p className="text-xl text-slate-300 leading-relaxed">
            Un voyage poétique en 12 lunes pour cultiver votre univers onirique
          </p>
        </div>

        {/* Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl glass-strong border border-white/20 p-8 space-y-6 text-left"
        >
          <div className="flex gap-4">
            <div className="text-4xl">🚀</div>
            <div>
              <h3 className="font-semibold text-white mb-1">Montez à bord</h3>
              <p className="text-sm text-slate-300">
                La navette Cosmoniris vous transportera à travers 12 lunes sacrées
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="text-4xl">✨</div>
            <div>
              <h3 className="font-semibold text-white mb-1">Choisissez 3 émojis</h3>
              <p className="text-sm text-slate-300">
                Dans le radar Cosmoji, sélectionnez 3 symboles qui résonnent avec vous
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="text-4xl">✧</div>
            <div>
              <h3 className="font-semibold text-white mb-1">Rencontrez un gardien</h3>
              <p className="text-sm text-slate-300">
                Un chaman inuit vous guidera avec ses sagesses ancestrales
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="text-4xl">📜</div>
            <div>
              <h3 className="font-semibold text-white mb-1">Recevez votre script onirique</h3>
              <p className="text-sm text-slate-300">
                Un texte régénérateur pour apaiser votre sommeil et vos rêves
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="space-y-3"
        >
          <Link
            to="/tirage"
            className="block w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-8 py-4 font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            ✨ Commencer mon voyage
          </Link>
          
          <Link
            to="/forum"
            className="block w-full rounded-xl glass-strong px-8 py-3 text-white hover:border-white/30 transition-all duration-300"
          >
            💬 Voir le forum
          </Link>
        </motion.div>

        {user && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-slate-400"
          >
            Bienvenue {user.name} 🌙
          </motion.p>
        )}
      </motion.div>
    </div>
  )
}
