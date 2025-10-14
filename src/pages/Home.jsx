import { Link } from 'react-router-dom'
import FloatingEmojis from '../components/FloatingEmojis.jsx'

export default function Home() {
  return (
    <div className="relative">
      <FloatingEmojis />

      <section className="text-center space-y-3 mb-8">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
          Choisissez votre voyage onirique
        </h1>
        <p className="mx-auto max-w-xl text-slate-300">
          Onimoji vous accompagne avec des symboles universels pour apaiser,
          relier et cultiver votre activité onirique.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link to="/voyage/inuit" className="rounded-2xl bg-midnight-400 text-white px-6 py-3 hover:bg-midnight-300 active:bg-midnight-500 transition">
            Découvrir le voyage Inuit 🚀
          </Link>
          <Link to="/community" className="rounded-2xl bg-white/10 text-white px-6 py-3 border border-white/10 hover:bg-white/20 transition">
            Voir la communauté
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:gap-5 md:grid-cols-3">
        {/* Inuit — déverrouillé */}
        <article className="rounded-2xl bg-midnight-800/60 backdrop-blur-sm border border-white/10 p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Voyage Inuit</h2>
            <div className="text-xl select-none">❄️🌌🐋</div>
          </div>
          <p className="mt-1 text-slate-300 text-sm leading-relaxed">
            12 lunes pour rencontrer des gardiens onimoji (Sila, Sedna, …)
            et découvrir des ressources culturelles inuites.
          </p>
          <div className="mt-3">
            <Link to="/voyage/inuit" className="inline-block rounded-xl bg-white/90 text-slate-900 px-4 py-2 text-sm font-medium hover:bg-white">
              Entrer dans le voyage
            </Link>
          </div>
        </article>

        {/* Berbère — verrouillé (bêta) */}
        <article className="rounded-2xl bg-midnight-800/30 backdrop-blur-sm border border-white/10 p-5 opacity-60">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Voyage Berbère</h2>
            <div className="text-xl select-none">🏜️✨🪶</div>
          </div>
          <p className="mt-1 text-slate-300 text-sm leading-relaxed">
            Bêta à venir — non accessible dans cette version.
          </p>
          <div className="mt-3">
            <button disabled className="rounded-xl bg-white/10 text-white/70 px-4 py-2 text-sm border border-white/10 cursor-not-allowed">
              Verrouillé
            </button>
          </div>
        </article>

        {/* Druidique — verrouillé (bêta) */}
        <article className="rounded-2xl bg-midnight-800/30 backdrop-blur-sm border border-white/10 p-5 opacity-60">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Voyage Druidique</h2>
            <div className="text-xl select-none">🌿🔥🌕</div>
          </div>
          <p className="mt-1 text-slate-300 text-sm leading-relaxed">
            Bêta à venir — non accessible dans cette version.
          </p>
          <div className="mt-3">
            <button disabled className="rounded-xl bg-white/10 text-white/70 px-4 py-2 text-sm border border-white/10 cursor-not-allowed">
              Verrouillé
            </button>
          </div>
        </article>
      </section>

      {/* Repères de parcours */}
      <section className="mt-8 rounded-2xl bg-white/5 border border-white/10 p-5">
        <h3 className="font-medium">Parcours Inuit — 12 lunes</h3>
        <ol className="mt-2 text-sm text-slate-300 list-decimal list-inside space-y-1">
          <li>Choisissez 3 émojis à bord de la Navette Cosmoniris.</li>
          <li>Explorez la Lune en cours et sa ressource culturelle.</li>
          <li>Rencontrez un gardien onimoji inuit pour un rituel d’apaisement.</li>
        </ol>
      </section>

      {/* Principes */}
      <section className="mt-4 grid gap-4 md:gap-5 md:grid-cols-3">
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
            Se reconnecter à soi, puis partager avec la communauté : empathie,
            écoute et entraide par la création courte et sensible.
          </p>
        </article>
      </section>
    </div>
  )
}
