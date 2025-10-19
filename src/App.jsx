import { NavLink, Route, Routes } from 'react-router-dom'
import Mission from './pages/Mission.jsx'

export default function App() {
  return (
    <div className="min-h-screen text-slate-100 selection:bg-midnight-400 selection:text-white">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-16">
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/mission" element={<Mission />} />
          <Route path="/donner" element={<Donner />} />
          <Route path="/recevoir" element={<Recevoir />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="*" element={<Accueil />} />
        </Routes>
      </main>
    </div>
  )
}

function Navbar() {
  const linkBase =
    'px-4 py-2 rounded-full transition-colors text-sm font-medium'
  const active = 'bg-midnight-400 text-white'
  const idle = 'hover:bg-white/10'
  return (
    <header className="sticky top-0 z-10 glass-strong border-b border-white/10">
      <nav className="max-w-4xl mx-auto flex items-center gap-2 px-4 py-3">
        <div className="font-display tracking-wide text-lg">Minimal</div>
        <div className="ml-auto flex items-center gap-2">
          <NavLink to="/" end className={({ isActive }) => `${linkBase} ${isActive ? active : idle}`}>Accueil</NavLink>
          <NavLink to="/mission" className={({ isActive }) => `${linkBase} ${isActive ? active : idle}`}>Mission</NavLink>
          <NavLink to="/donner" className={({ isActive }) => `${linkBase} ${isActive ? active : idle}`}>Donner</NavLink>
          <NavLink to="/recevoir" className={({ isActive }) => `${linkBase} ${isActive ? active : idle}`}>Recevoir</NavLink>
          <NavLink to="/profil" className={({ isActive }) => `${linkBase} ${isActive ? active : idle}`}>Profil</NavLink>
        </div>
      </nav>
    </header>
  )
}

function Section({ title, children }) {
  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-semibold">{title}</h1>
      <p className="text-slate-400">{children}</p>
    </section>
  )
}

function Accueil() {
  return (
    <section className="space-y-8 text-center">
      <h1 className="text-4xl md:text-5xl font-display tracking-tight">
        Un point de départ minimaliste
      </h1>
      <p className="text-slate-400 max-w-2xl mx-auto">
        Une landing page simple avec un menu clair: Accueil, Donner, Recevoir, Profil.
      </p>
    </section>
  )
}

function Donner() {
  return <Section title="Donner">Partagez quelque chose de valeur.</Section>
}

function Recevoir() {
  return <Section title="Recevoir">Découvrez ce que la communauté offre.</Section>
}

function Profil() {
  return <Section title="Profil">Gérez votre espace personnel.</Section>
}
