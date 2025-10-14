import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import FloatingEmojis from '../components/FloatingEmojis.jsx'

export default function Home() {
  return (
    <div className="relative">
      <FloatingEmojis />

      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-4 mb-10"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-aurora-purple/20 to-aurora-blue/20 border border-white/10 mb-3"
        >
          <span className="text-sm font-medium bg-gradient-to-r from-aurora-purple to-aurora-blue bg-clip-text text-transparent">
            ✨ Bienvenue dans l'univers Onimoji
          </span>
        </motion.div>
        
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-br from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
          Choisissez votre<br/>voyage onirique
        </h1>
        
        <p className="mx-auto max-w-xl text-slate-300 text-lg leading-relaxed">
          Onimoji vous accompagne avec des symboles universels pour apaiser,
          relier et cultiver votre activité onirique.
        </p>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4"
        >
          <Link 
            to="/voyage/inuit" 
            className="group relative rounded-2xl bg-gradient-to-r from-midnight-400 to-midnight-500 text-white px-8 py-4 hover:shadow-aurora transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2 font-medium">
              Découvrir le voyage Inuit 🚀
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-midnight-300 to-midnight-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
          
          <Link 
            to="/community" 
            className="group rounded-2xl glass px-8 py-4 hover:glass-strong transition-all duration-300 hover:scale-105"
          >
            <span className="font-medium text-white flex items-center gap-2">
              Voir la communauté 💖
            </span>
          </Link>
        </motion.div>
      </motion.section>

      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="grid gap-5 md:gap-6 md:grid-cols-3"
      >
        {/* Inuit — déverrouillé */}
        <motion.article
          whileHover={{ y: -8, transition: { duration: 0.3 } }}
          className="group rounded-2xl glass-strong p-6 hover:shadow-card-hover transition-all duration-300 cursor-pointer relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-aurora-blue/10 to-aurora-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-semibold text-white">Voyage Inuit</h2>
              <div className="text-2xl select-none transform group-hover:scale-110 transition-transform duration-300">❄️🌌🐋</div>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              12 lunes pour rencontrer des gardiens onimoji (Sila, Sedna, …)
              et découvrir des ressources culturelles inuites.
            </p>
            <Link 
              to="/voyage/inuit" 
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-white/90 to-white/80 text-slate-900 px-5 py-2.5 text-sm font-semibold hover:from-white hover:to-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Entrer dans le voyage
              <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
            </Link>
          </div>
        </motion.article>

        {/* Berbère — verrouillé (bêta) */}
        <motion.article
          className="rounded-2xl bg-midnight-800/30 backdrop-blur-sm border border-white/10 p-6 opacity-60 relative overflow-hidden"
        >
          <div className="absolute top-4 right-4 bg-white/10 text-white/70 px-3 py-1 rounded-full text-xs font-medium">
            Bientôt
          </div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold text-white/70">Voyage Berbère</h2>
            <div className="text-2xl select-none">🏜️✨🪶</div>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed mb-4">
            Bêta à venir — non accessible dans cette version.
          </p>
          <button disabled className="rounded-xl bg-white/10 text-white/50 px-5 py-2.5 text-sm font-semibold border border-white/10 cursor-not-allowed">
            🔒 Verrouillé
          </button>
        </motion.article>

        {/* Druidique — verrouillé (bêta) */}
        <motion.article
          className="rounded-2xl bg-midnight-800/30 backdrop-blur-sm border border-white/10 p-6 opacity-60 relative overflow-hidden"
        >
          <div className="absolute top-4 right-4 bg-white/10 text-white/70 px-3 py-1 rounded-full text-xs font-medium">
            Bientôt
          </div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold text-white/70">Voyage Druidique</h2>
            <div className="text-2xl select-none">🌿🔥🌕</div>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed mb-4">
            Bêta à venir — non accessible dans cette version.
          </p>
          <button disabled className="rounded-xl bg-white/10 text-white/50 px-5 py-2.5 text-sm font-semibold border border-white/10 cursor-not-allowed">
            🔒 Verrouillé
          </button>
        </motion.article>
      </motion.section>

      {/* Repères de parcours */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-10 rounded-2xl glass-strong border border-white/20 p-6 shadow-card"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-aurora-purple to-aurora-blue flex items-center justify-center text-xl">
            🌕
          </div>
          <h3 className="text-lg font-semibold">Parcours Inuit — 12 lunes</h3>
        </div>
        <ol className="space-y-3 text-sm text-slate-300">
          <li className="flex items-start gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-midnight-400 flex items-center justify-center text-xs font-bold">1</span>
            <span>Choisissez 3 émojis à bord de la Navette Cosmoniris.</span>
          </li>
          <li className="flex items-start gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-midnight-400 flex items-center justify-center text-xs font-bold">2</span>
            <span>Explorez la Lune en cours et sa ressource culturelle.</span>
          </li>
          <li className="flex items-start gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-midnight-400 flex items-center justify-center text-xs font-bold">3</span>
            <span>Rencontrez un gardien onimoji inuit pour un rituel d'apaisement.</span>
          </li>
        </ol>
      </motion.section>

      {/* Principes */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-8 grid gap-5 md:gap-6 md:grid-cols-3"
      >
        <motion.article 
          whileHover={{ y: -4 }}
          className="group rounded-2xl glass p-6 hover:glass-strong transition-all duration-300 border-l-4 border-aurora-purple"
        >
          <div className="text-3xl mb-3 transform group-hover:scale-110 transition-transform duration-300">🌍</div>
          <h2 className="text-lg font-semibold mb-2 text-white">Accessibilité & universalité</h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Les émojis franchissent les langues et niveaux de lecture. Ils
            facilitent l'expression, l'inclusion et l'initiation à la poésie.
          </p>
        </motion.article>
        
        <motion.article 
          whileHover={{ y: -4 }}
          className="group rounded-2xl glass p-6 hover:glass-strong transition-all duration-300 border-l-4 border-aurora-blue"
        >
          <div className="text-3xl mb-3 transform group-hover:scale-110 transition-transform duration-300">✨</div>
          <h2 className="text-lg font-semibold mb-2 text-white">Poétique thérapeutique</h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Écrire en 3 lignes ancre le souffle, clarifie l'émotion et
            ouvre un espace d'apaisement. La contrainte stimule en douceur.
          </p>
        </motion.article>
        
        <motion.article 
          whileHover={{ y: -4 }}
          className="group rounded-2xl glass p-6 hover:glass-strong transition-all duration-300 border-l-4 border-aurora-pink"
        >
          <div className="text-3xl mb-3 transform group-hover:scale-110 transition-transform duration-300">💖</div>
          <h2 className="text-lg font-semibold mb-2 text-white">Self‑care & social‑care</h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Se reconnecter à soi, puis partager avec la communauté : empathie,
            écoute et entraide par la création courte et sensible.
          </p>
        </motion.article>
      </motion.section>
    </div>
  )
}
