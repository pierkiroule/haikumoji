import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: '🏠 Home' },
  { to: '/create', label: '✏️ Créer' },
  { to: '/cosmoji', label: '🌐 Cosmoji' },
  { to: '/community', label: '💖 Communauté' },
  { to: '/profile', label: '👤 Profil' },
]

export default function Navbar() {
  return (
    <nav className="fixed inset-x-0 bottom-0 lg:top-0 lg:bottom-auto h-16 bg-white/80 backdrop-blur border-t lg:border-b z-50">
      <div className="max-w-4xl mx-auto h-full flex items-center justify-around px-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `text-sm transition-colors ${isActive ? 'text-slate-900 font-medium' : 'text-slate-600 hover:text-slate-800'}`}
            end={item.to === '/'}
            aria-label={item.label}
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
