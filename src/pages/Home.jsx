import { Link } from 'react-router-dom'
import FloatingEmojis from '../components/FloatingEmojis.jsx'

export default function Home() {
  return (
    <div className="relative text-center">
      <FloatingEmojis />
      <h1 className="text-2xl font-light tracking-wide mb-4">Des mots, des signes, un souffle.</h1>
      <Link
        to="/create"
        className="inline-block rounded-2xl bg-white px-6 py-3 shadow-lg hover:shadow-xl transition text-slate-800"
      >
        Créer mon Haïku
      </Link>
    </div>
  )
}
