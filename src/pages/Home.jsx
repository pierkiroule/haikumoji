import { Link } from 'react-router-dom'
import FloatingEmojis from '../components/FloatingEmojis.jsx'

export default function Home() {
  return (
    <div className="relative">
      <FloatingEmojis />

      <section className="text-center space-y-3 mb-8">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
          Onimoji — voyage dans l’Onivers Inuit
        </h1>
        <p className="mx-auto max-w-xl text-slate-300">
          Une pratique douce et inclusive : créer avec des émojis pour sensibiliser,
          apaiser et relier. L’universalité des symboles rend la création accessible,
          au service du self‑care et du social‑care.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link to="/navette" className="rounded-2xl bg-midnight-400 text-white px-6 py-3 hover:bg-midnight-300 active:bg-midnight-500 transition">
            Monter à bord du Cosmoniris 🚀
          </Link>
          <Link to="/community" className="rounded-2xl bg-white/10 text-white px-6 py-3 border border-white/10 hover:bg-white/20 transition">
            Voir la communauté
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:gap-5 md:grid-cols-3">
        <article className="rounded-2xl bg-midnight-800/60 backdrop-blur-sm border border-white/10 p-5">
          <h2 className="text-lg font-medium">Accessibilité & universalité</h2>
          <p className="mt-1 text-slate-300 text-sm leading-relaxed">
            Les émojis franchissent les langues et niveaux de lecture. Ils
            facilitent l’expression, l’inclusion et l’initiation à la poésie.
          </p>
        </article>
        <article className="rounded-2xl bg-midnight-800/60 backdrop-blur-sm border border-white/10 p-5">
          <h2 className="text-lg font-medium">Poétique thérapeutique</h2>
          <p className="mt-1 text-slate-300 text-sm leading-relaxed">
            Écrire en 3 lignes ancre le souffle, clarifie l’émotion et
            ouvre un espace d’apaisement. La contrainte stimule en douceur.
          </p>
        </article>
        <article className="rounded-2xl bg-midnight-800/60 backdrop-blur-sm border border-white/10 p-5">
          <h2 className="text-lg font-medium">Self‑care & social‑care</h2>
          <p className="mt-1 text-slate-300 text-sm leading-relaxed">
            Se reconnecter à soi, puis partager avec la communauté: empathie,
            écoute et entraide par la création courte et sensible.
          </p>
        </article>
      </section>

        <section className="mt-8 rounded-2xl bg-white/5 border border-white/10 p-5">
          <h3 className="font-medium">Parcours des 12 lunes</h3>
          <ol className="mt-2 text-sm text-slate-300 list-decimal list-inside space-y-1">
            <li>Montez à bord du Cosmoniris pour choisir 3 émojis.</li>
            <li>Explorez la Lune en cours et découvrez sa ressource culturelle.</li>
            <li>Générez un rêve et sauvegardez-le localement.</li>
          </ol>
        </section>
    </div>
  )
}
