import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import FloatingEmojis from '../components/FloatingEmojis.jsx'

export default function VoyageInuit() {
  return (
    <div className="relative space-y-8">
      <FloatingEmojis emojis={['❄️','🌌','🐋','🌙','✨']} />
      
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
