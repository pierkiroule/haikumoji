import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import NetworkGraph from '../components/NetworkGraph.jsx'
import { getCosmicStats } from '../utils/storage.js'

export default function Cosmoji() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    const data = getCosmicStats()
    setStats(data)
  }, [])

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-950 flex items-center justify-center">
        <div className="text-purple-200 text-xl">Chargement du Cosmoji...</div>
      </div>
    )
  }

  const hasData = stats.occurrences.length > 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-950 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="text-6xl mb-4">🔭</div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Cosmoji
          </h1>
          <p className="text-purple-200 text-lg max-w-2xl mx-auto">
            Observez le tissage onirique collectif à travers le hublot de votre navette d'explorateur.
            Chaque émoji est un astre, chaque lien une constellation tissée ensemble.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-indigo-900/30 backdrop-blur-sm rounded-3xl p-8 mb-8 border-2 border-purple-500/30"
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-purple-200 mb-2">
              🪟 Hublot du Cosmoji
            </h2>
            <p className="text-purple-300 text-sm">
              Graphe réseau des émojis et leurs connexions
            </p>
          </div>

          {hasData ? (
            <NetworkGraph data={stats} />
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="text-6xl mb-4">✨</div>
              <p className="text-purple-200 text-center mb-2">
                Le Cosmoji attend ses premières étoiles
              </p>
              <p className="text-purple-300 text-sm text-center">
                Créez et finalisez des étoiles Onimoji dans le Forum pour voir le réseau se tisser
              </p>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <StatCard
            icon="⭐"
            label="Étoiles Co-créées"
            value={stats.totalStars}
            color="purple"
          />
          <StatCard
            icon="👥"
            label="Voyageurs"
            value={stats.totalParticipants}
            color="indigo"
          />
          <StatCard
            icon="🔺"
            label="Triangles Tissés"
            value={stats.totalTriangles}
            color="violet"
          />
        </motion.div>

        {hasData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 bg-indigo-900/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20"
          >
            <h3 className="text-xl font-bold text-purple-200 mb-4 flex items-center gap-2">
              <span>📊</span>
              <span>Émojis les plus tissés</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {stats.occurrences.slice(0, 8).map(({ emoji, count }) => (
                <div
                  key={emoji}
                  className="bg-purple-900/30 rounded-lg p-3 text-center border border-purple-500/20"
                >
                  <div className="text-3xl mb-1">{emoji}</div>
                  <div className="text-purple-200 text-sm font-semibold">{count}×</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {stats.cooccurrences.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8 bg-indigo-900/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20"
          >
            <h3 className="text-xl font-bold text-purple-200 mb-4 flex items-center gap-2">
              <span>🔗</span>
              <span>Constellations majeures</span>
            </h3>
            <div className="space-y-2">
              {stats.cooccurrences.slice(0, 5).map(({ source, target, count }, idx) => (
                <div
                  key={`${source}-${target}`}
                  className="flex items-center gap-3 bg-purple-900/20 rounded-lg p-3 border border-purple-500/10"
                >
                  <div className="text-2xl">{source}</div>
                  <div className="text-purple-400">↔</div>
                  <div className="text-2xl">{target}</div>
                  <div className="ml-auto text-purple-200 text-sm font-semibold bg-purple-900/40 px-3 py-1 rounded-full">
                    {count}× tissées
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, color = 'purple' }) {
  const colorClasses = {
    purple: 'from-purple-900/40 to-purple-800/40 border-purple-500/30',
    indigo: 'from-indigo-900/40 to-indigo-800/40 border-indigo-500/30',
    violet: 'from-violet-900/40 to-violet-800/40 border-violet-500/30'
  }

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} backdrop-blur-sm rounded-2xl p-6 border-2 text-center`}>
      <div className="text-4xl mb-2">{icon}</div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-purple-200 text-sm">{label}</div>
    </div>
  )
}
