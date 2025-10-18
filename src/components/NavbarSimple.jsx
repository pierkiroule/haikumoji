import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { resetAppStorage } from '../utils/storage.js'

const navItems = [
  { to: '/', label: '🏠 Accueil', ariaLabel: 'Accueil' },
  { to: '/tirage', label: '🔮 Tirage', ariaLabel: 'Tirage triangle' },
  { to: '/forum', label: '💬 Forum', ariaLabel: 'Forum communauté' },
]

export default function NavbarSimple() {
  return (
    <motion.nav 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-x-0 bottom-0 lg:top-0 lg:bottom-auto h-16 glass-strong z-50 text-slate-200 border-t lg:border-b border-white/20 backdrop-blur-xl" 
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="max-w-4xl mx-auto h-full flex items-center justify-around px-4 gap-1">
        {navItems.map((item, index) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => 
              `relative text-sm transition-all duration-300 px-3 py-2 rounded-xl ${
                isActive 
                  ? 'text-white font-semibold' 
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`
            }
            end={item.to === '/'}
            aria-label={item.ariaLabel}
          >
            {({ isActive }) => (
              <>
                <motion.span
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative z-10"
                >
                  {item.label}
                </motion.span>
                {isActive && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute inset-0 bg-gradient-to-r from-aurora-purple/30 to-aurora-blue/30 rounded-xl border border-white/20"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
        {import.meta.env?.MODE !== 'production' && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const ok = confirm('Réinitialiser les données locales ?')
              if (ok) {
                resetAppStorage()
                alert('LocalStorage réinitialisé.')
                window.location.reload()
              }
            }}
            className="text-sm rounded-xl bg-white/10 text-white px-3 py-1.5 border border-white/10 hover:bg-white/20 hover:border-white/30 transition-all duration-300"
            aria-label="Reset LocalStorage"
            title="Reset LocalStorage (dev)"
          >
            🧹
          </motion.button>
        )}
      </div>
    </motion.nav>
  )
}
