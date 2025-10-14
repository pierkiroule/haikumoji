import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { getUser, saveUser } from '../utils/storage.js'
import FloatingEmojis from '../components/FloatingEmojis.jsx'

export default function VoyageInuit() {
  const [user, setUser] = useState(null)
  const [showSignup, setShowSignup] = useState(false)
  const [userName, setUserName] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const u = getUser()
    setUser(u)
  }, [])

  const handleSignup = (e) => {
    e.preventDefault()
    if (!userName.trim()) return
    const created = saveUser({ name: userName.trim() })
    setUser(created)
    setShowSignup(false)
    // Redirect to navette after signup
    setTimeout(() => navigate('/navette'), 500)
  }

  return (
    <div className="relative space-y-8">
      <FloatingEmojis emojis={['❄️','🌌','🐋','🌙','✨']} />

      {/* Modal d'inscription */}
      <AnimatePresence>
        {showSignup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/95 backdrop-blur-lg z-50 flex items-center justify-center p-4"
            onClick={() => setShowSignup(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-md w-full rounded-3xl bg-gradient-to-br from-slate-800 to-midnight-900 border-2 border-white/20 p-8 shadow-2xl"
            >
              <form onSubmit={handleSignup} className="space-y-6">
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring" }}
                    className="text-5xl mb-4"
                  >
                    🚀✨
                  </motion.div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Montez à bord de Cosmoniris
                  </h2>
                  <p className="text-slate-300">
                    Créez votre profil pour commencer votre voyage onirique
                  </p>
                </div>

                <div>
                  <label htmlFor="userName" className="block text-sm font-medium text-slate-300 mb-2">
                    Votre nom de voyageur
                  </label>
                  <input
                    type="text"
                    id="userName"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Ex: Voyageur des étoiles"
                    className="w-full rounded-xl bg-white/10 border border-white/20 text-white px-4 py-3 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    autoFocus
                  />
                  <p className="text-xs text-slate-400 mt-2">
                    💾 Vos données seront sauvegardées localement sur cet appareil
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowSignup(false)}
                    className="flex-1 rounded-xl bg-white/10 border border-white/20 text-white px-4 py-3 font-medium hover:bg-white/20 transition-all duration-300"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={!userName.trim()}
                    className={`flex-1 rounded-xl px-4 py-3 font-semibold transition-all duration-300 ${
                      userName.trim()
                        ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg hover:shadow-xl'
                        : 'bg-slate-600 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    🚀 Démarrer
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl glass-strong border border-white/10 p-8 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-aurora-blue/10 to-aurora-cyan/5" />
        <div className="relative z-10">
          <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-aurora-blue/20 to-aurora-cyan/20 border border-white/10 mb-4">
            <span className="text-sm font-medium text-white">❄️ Voyage culturel</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-br from-white via-slate-100 to-slate-300 bg-clip-text text-transparent mb-4">
            Voyage onirique Inuit
          </h1>
          
          <p className="text-slate-300 leading-relaxed mb-6 max-w-2xl">
            Montez à bord de la navette Cosmoniris pour un voyage d'exploration de cosmoji inuit —
            un parcours en 12 étapes, 12 lunes. À chaque lune, rencontrez un gardien onimoji (Sila, Sedna…)
            et découvrez des ressources culturelles inuites pour prendre soin de votre activité onirique.
          </p>
          
          <div className="flex flex-col sm:flex-row items-start gap-3">
            {user ? (
              <>
                <Link 
                  to="/navette" 
                  className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-midnight-400 to-midnight-500 text-white px-6 py-3 hover:shadow-aurora transition-all duration-300 font-medium"
                >
                  Monter à bord 🚀
                  <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                </Link>
                <Link 
                  to="/lune" 
                  className="inline-flex items-center gap-2 rounded-xl glass px-6 py-3 border border-white/20 hover:glass-strong transition-all duration-300 font-medium"
                >
                  Voir la lune en cours 🌙
                </Link>
              </>
            ) : (
              <motion.button
                onClick={() => setShowSignup(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold text-lg"
              >
                ✨ S'inscrire et monter à bord
                <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
              </motion.button>
            )}
          </div>
        </div>
      </motion.section>

      {/* Info Grid */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid gap-6 md:grid-cols-2"
      >
        <motion.article 
          whileHover={{ y: -4 }}
          className="rounded-2xl glass p-6 hover:glass-strong transition-all duration-300 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-aurora-purple to-aurora-blue flex items-center justify-center text-2xl">
              📖
            </div>
            <h2 className="text-xl font-semibold text-white">Comment ça marche ?</h2>
          </div>
          <ol className="space-y-3 text-sm text-slate-300">
            <li className="flex items-start gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-midnight-400 flex items-center justify-center text-xs font-bold">1</span>
              <span>Choisissez 3 émojis dans le hublot Cosmoji.</span>
            </li>
            <li className="flex items-start gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-midnight-400 flex items-center justify-center text-xs font-bold">2</span>
              <span>Rencontrez le gardien lié à votre sélection.</span>
            </li>
            <li className="flex items-start gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-midnight-400 flex items-center justify-center text-xs font-bold">3</span>
              <span>Pratiquez un court rituel d'apaisement et sauvegardez votre rêve.</span>
            </li>
          </ol>
        </motion.article>

        <motion.article 
          whileHover={{ y: -4 }}
          className="rounded-2xl glass p-6 hover:glass-strong transition-all duration-300 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-aurora-cyan to-aurora-blue flex items-center justify-center text-2xl">
              🌙
            </div>
            <h2 className="text-xl font-semibold text-white">Les 12 lunes</h2>
          </div>
          <p className="text-slate-300 text-sm mb-4">
            Une progression douce, culturelle et poétique pour cultiver la régularité.
          </p>
          <ul className="grid grid-cols-3 gap-2 text-sm text-slate-300">
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.li 
                key={i}
                whileHover={{ scale: 1.05 }}
                className="rounded-lg glass border border-white/10 px-3 py-2 text-center hover:bg-white/10 transition-all duration-300"
              >
                <div className="font-semibold text-white">Lune {i+1}</div>
              </motion.li>
            ))}
          </ul>
        </motion.article>
      </motion.section>
    </div>
  )
}
