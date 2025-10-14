import { NavLink } from 'react-router-dom'
import { resetAppStorage } from '../utils/storage.js'

const navItems = [
  { to: '/', label: '🏠 Home' },
  { to: '/navette', label: '🚀 Navette' },
  { to: '/cosmoji', label: '✨ Cosmoji' },
  { to: '/lune', label: '🌙 Lune' },
  { to: '/community', label: '💖 Communauté' },
  { to: '/dreamgarden', label: '🌱 Jardin' },
]

export default function Navbar() {
  return (
    <nav className="fixed inset-x-0 bottom-0 lg:top-0 lg:bottom-auto h-16 bg-midnight-800/60 backdrop-blur border-t lg:border-b border-white/10 z-50 text-slate-200" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="max-w-4xl mx-auto h-full flex items-center justify-around px-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `text-sm transition-colors ${isActive ? 'text-white font-medium' : 'text-slate-300 hover:text-white'}`}
            end={item.to === '/'}
            aria-label={item.label}
          >
            {item.label}
          </NavLink>
        ))}
        {import.meta.env?.MODE !== 'production' && (
          <button
            onClick={() => {
              const ok = confirm('Réinitialiser les données locales ?')
              if (ok) {
                resetAppStorage()
                alert('LocalStorage réinitialisé (seeds rechargés).')
                // Recharge pour refléter l'état propre
                window.location.reload()
              }
            }}
            className="text-sm rounded-xl bg-white/10 text-white px-3 py-1 border border-white/10 hover:bg-white/20 transition"
            aria-label="Reset LocalStorage"
            title="Reset LocalStorage (dev)"
          >
            🧹 Reset
          </button>
        )}
      </div>
    </nav>
  )
}
