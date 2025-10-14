import { Link } from 'react-router-dom'
import FloatingEmojis from '../components/FloatingEmojis.jsx'

export default function VoyageInuit() {
  return (
    <div className="relative">
      <FloatingEmojis />
      <section className="rounded-2xl bg-white/5 border border-white/10 p-6">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Voyage onirique Inuit</h1>
        <p className="mt-2 text-slate-300 text-sm leading-relaxed">
          Montez à bord de la navette Cosmoniris pour un voyage d'exploration de cosmoji inuit —
          un parcours en 12 étapes, 12 lunes. À chaque lune, rencontrez un gardien onimoji (Sila, Sedna…)
          et découvrez des ressources culturelles inuites pour prendre soin de votre activité onirique.
        </p>
        <div className="mt-4 flex items-center gap-3">
          <Link to="/navette" className="rounded-xl bg-midnight-400 text-white px-4 py-2 hover:bg-midnight-300 transition">Monter à bord 🚀</Link>
          <Link to="/lune" className="rounded-xl bg-white/10 text-white px-4 py-2 border border-white/10 hover:bg-white/20 transition">Voir la lune en cours 🌙</Link>
        </div>
      </section>
      <section className="mt-6 grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl bg-midnight-800/60 backdrop-blur-sm border border-white/10 p-5">
          <h2 className="text-lg font-medium">Comment ça marche ?</h2>
          <ol className="mt-2 text-sm text-slate-300 list-decimal list-inside space-y-1">
            <li>Choisissez 3 émojis dans le hublot Cosmoji.</li>
            <li>Rencontrez le gardien lié à votre sélection.</li>
            <li>Pratiquez un court rituel d'apaisement et sauvegardez votre rêve.</li>
          </ol>
        </article>
        <article className="rounded-2xl bg-midnight-800/60 backdrop-blur-sm border border-white/10 p-5">
          <h2 className="text-lg font-medium">Les 12 lunes</h2>
          <p className="mt-1 text-slate-300 text-sm">Une progression douce, culturelle et poétique pour cultiver la régularité.</p>
          <ul className="mt-2 grid grid-cols-2 gap-2 text-sm text-slate-300">
            {Array.from({ length: 12 }).map((_, i) => (
              <li key={i} className="rounded-lg bg-white/5 border border-white/10 px-2 py-1">Lune {i+1}</li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  )
}
