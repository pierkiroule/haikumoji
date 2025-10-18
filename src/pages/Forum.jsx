import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  getStars, 
  initializeDemoData,
  getUser,
  saveUser,
  getSelectedTriplet,
  addContributionToStar,
  createNewStar
} from '../utils/storage.js'

export default function Forum() {
  const [stars, setStars] = useState([])
  const [user, setUser] = useState(null)
  const [userTriangle, setUserTriangle] = useState([])
  const [selectedStarId, setSelectedStarId] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    let currentUser = getUser()
    const triangle = getSelectedTriplet()
    
    if (!currentUser) {
      const defaultUser = { id: 'user-' + Date.now(), name: 'Voyageur Anonyme' }
      const savedUser = saveUser(defaultUser)
      setUser(savedUser)
    } else {
      setUser(currentUser)
    }
    
    setUserTriangle(triangle)
    
    // Initialiser les données de démo si vide
    initializeDemoData()
    refreshData()
  }, [])

  const refreshData = () => {
    setStars(getStars())
  }

  const selectedStar = stars.find(s => s.id === selectedStarId)

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="text-6xl mb-4">🌌</div>
        <h1 className="text-3xl md:text-4xl font-bold text-white">
          Ciel des Étoiles Onimoji
        </h1>
        <p className="text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Explorez le ciel nocturne des co-créations oniriques. 
          Cliquez sur une étoile pour enrichir son histoire avec votre triangle.
        </p>
      </motion.div>

      {/* User Info */}
      {user && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl glass border border-white/20 p-4 max-w-md mx-auto"
        >
          <div className="flex items-center gap-3">
            <div className="text-2xl">👤</div>
            <div className="flex-1">
              <div className="text-white font-medium">{user.name}</div>
              {userTriangle.length === 3 ? (
                <div className="text-sm text-slate-400">
                  Triangle actuel : {userTriangle.join(' ')}
                </div>
              ) : (
                <div className="text-sm text-amber-400">
                  ⚠️ Sélectionnez d'abord votre triangle dans Tirage
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Starry Sky */}
      <div className="relative w-full h-[600px] rounded-3xl glass-strong border border-white/20 overflow-hidden">
        {/* Stars background */}
        <div className="absolute inset-0 starfield" />
        
        {/* Étoiles Onimoji */}
        {stars.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-center">
            <div className="space-y-4">
              <div className="text-6xl">✨</div>
              <p className="text-slate-400">Le ciel attend ses premières étoiles...</p>
            </div>
          </div>
        ) : (
          <>
            {stars.map((star) => (
              <StarInSky
                key={star.id}
                star={star}
                isSelected={selectedStarId === star.id}
                onClick={() => setSelectedStarId(star.id)}
              />
            ))}
          </>
        )}
      </div>

      {/* Star Detail Modal */}
      <AnimatePresence>
        {selectedStar && (
          <StarDetailModal
            star={selectedStar}
            user={user}
            userTriangle={userTriangle}
            onClose={() => setSelectedStarId(null)}
            onEnrich={(text) => {
              if (user && userTriangle.length === 3) {
                addContributionToStar(selectedStar.id, user.id, user.name, userTriangle, text)
                refreshData()
                setSelectedStarId(null)
              }
            }}
          />
        )}
      </AnimatePresence>

      {/* Create Star Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateStarModal
            user={user}
            userTriangle={userTriangle}
            onClose={() => setShowCreateModal(false)}
            onCreate={(title, seedText) => {
              if (user && userTriangle.length === 3) {
                createNewStar(user.id, user.name, userTriangle, title, seedText)
                refreshData()
                setShowCreateModal(false)
              }
            }}
          />
        )}
      </AnimatePresence>

      {/* Create Star Button */}
      <div className="flex justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (!userTriangle || userTriangle.length < 3) {
              navigate('/tirage')
            } else {
              setShowCreateModal(true)
            }
          }}
          className="rounded-2xl bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-8 py-4 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
        >
          ✨ Créer une nouvelle étoile
        </motion.button>
      </div>
    </div>
  )
}

function StarInSky({ star, isSelected, onClick }) {
  const contributionCount = star.contributions?.length || 0
  
  // Taille selon nombre de contributions
  const getSize = () => {
    if (contributionCount >= 10) return 80 // Microcosmoji imminent
    if (contributionCount >= 6) return 60
    if (contributionCount >= 4) return 50
    return 40
  }
  
  // Couleur selon intensité
  const getGlow = () => {
    if (contributionCount >= 10) return 'drop-shadow-[0_0_20px_rgba(255,100,255,0.8)]'
    if (contributionCount >= 6) return 'drop-shadow-[0_0_15px_rgba(147,51,234,0.7)]'
    if (contributionCount >= 4) return 'drop-shadow-[0_0_10px_rgba(59,130,246,0.6)]'
    return 'drop-shadow-[0_0_8px_rgba(14,165,233,0.5)]'
  }
  
  const size = getSize()
  const glow = getGlow()
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.2 }}
      className="absolute cursor-pointer"
      style={{
        left: `${star.x || Math.random() * 80 + 10}px`,
        top: `${star.y || Math.random() * 500 + 50}px`,
      }}
      onClick={onClick}
    >
      <div className={`relative ${glow} transition-all duration-300`}>
        <motion.div
          animate={{
            rotate: isSelected ? 360 : 0,
            scale: isSelected ? 1.3 : 1,
          }}
          transition={{ duration: 0.5 }}
          style={{ fontSize: size }}
        >
          {contributionCount >= 10 ? '🌟' : contributionCount >= 6 ? '⭐' : contributionCount >= 4 ? '✨' : '⭐'}
        </motion.div>
        
        {/* Contribution count badge */}
        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-purple-500 text-white text-xs flex items-center justify-center font-bold">
          {contributionCount}
        </div>
      </div>
    </motion.div>
  )
}

function StarDetailModal({ star, user, userTriangle, onClose, onEnrich }) {
  const [enrichText, setEnrichText] = useState('')
  const contributionCount = star.contributions?.length || 0
  
  const handleEnrich = () => {
    if (!enrichText.trim() || !userTriangle || userTriangle.length < 3) return
    onEnrich(enrichText)
    setEnrichText('')
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl glass-strong border border-white/20 p-8 space-y-6"
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {star.title || 'Étoile Onimoji'}
            </h2>
            <div className="text-sm text-slate-400">
              {contributionCount} {contributionCount > 1 ? 'contributions' : 'contribution'}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-2xl text-slate-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Seed text */}
        {star.seedText && (
          <div className="rounded-xl bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 p-4">
            <div className="text-xs text-purple-300 mb-2">🌱 Amorce du guide</div>
            <p className="text-white italic">{star.seedText}</p>
          </div>
        )}

        {/* Contributions (cadavre exquis) */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">📜 Co-création collaborative</h3>
          
          {star.contributions?.map((contribution, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-xl glass border border-white/10 p-4 space-y-2"
            >
              <div className="flex items-center gap-2 text-sm">
                <span className="text-purple-400 font-medium">{contribution.userName}</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400">{contribution.triangle?.join(' ')}</span>
              </div>
              <p className="text-slate-200 leading-relaxed">{contribution.text}</p>
            </motion.div>
          ))}
        </div>

        {/* Enrich section */}
        {userTriangle && userTriangle.length === 3 && (
          <div className="space-y-4 pt-6 border-t border-white/10">
            <h3 className="text-lg font-semibold text-white">✨ Enrichir cette étoile</h3>
            <p className="text-sm text-slate-400">
              Ajoutez votre triangle {userTriangle.join(' ')} et tissez la suite de l'histoire...
            </p>
            
            <textarea
              value={enrichText}
              onChange={(e) => setEnrichText(e.target.value)}
              placeholder="Continuez le voyage onirique avec vos propres mots..."
              className="w-full rounded-xl bg-white/5 border border-white/10 p-4 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors resize-none"
              rows={4}
            />
            
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-xl glass text-white hover:glass-strong transition-all"
              >
                Fermer
              </button>
              <button
                onClick={handleEnrich}
                disabled={!enrichText.trim()}
                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                🌟 Ajouter ma contribution
              </button>
            </div>
          </div>
        )}

        {/* Microcosmoji warning */}
        {contributionCount >= 8 && contributionCount < 10 && (
          <div className="rounded-xl bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 p-4">
            <div className="text-sm text-pink-300">
              🌟 Cette étoile approche de sa masse critique ({contributionCount}/10 contributions). 
              Bientôt, elle implosera en microcosmoji pour créer un nouvel émoji inédit !
            </div>
          </div>
        )}
        
        {contributionCount >= 10 && (
          <div className="rounded-xl bg-gradient-to-r from-pink-500/30 to-purple-500/30 border border-pink-500/50 p-4">
            <div className="text-sm text-pink-200 font-semibold">
              💥 IMPLOSION IMMINENTE ! Cette étoile est devenue un microcosmoji et va bientôt créer un nouvel émoji pour le macrocosmoji !
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

function CreateStarModal({ user, userTriangle, onClose, onCreate }) {
  const [title, setTitle] = useState('')
  const [seedText, setSeedText] = useState('')
  
  const handleCreate = () => {
    if (!seedText.trim()) return
    onCreate(title || 'Nouvelle Étoile', seedText)
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-3xl glass-strong border border-white/20 p-8 space-y-6"
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              ✨ Créer une nouvelle étoile
            </h2>
            <div className="text-sm text-slate-400">
              Initiez un voyage onirique que d'autres pourront enrichir
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-2xl text-slate-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              🏷️ Titre de l'étoile (optionnel)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ex: Rêve de Glace, Voyage Lunaire..."
              className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              🌱 Amorce du voyage onirique
            </label>
            <div className="text-xs text-slate-400 mb-2">
              Votre triangle : {userTriangle?.join(' ')}
            </div>
            <textarea
              value={seedText}
              onChange={(e) => setSeedText(e.target.value)}
              placeholder="Écrivez les premiers mots du voyage onirique que d'autres voyageurs continueront..."
              className="w-full rounded-xl bg-white/5 border border-white/10 p-4 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors resize-none"
              rows={6}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl glass text-white hover:glass-strong transition-all"
          >
            Annuler
          </button>
          <button
            onClick={handleCreate}
            disabled={!seedText.trim()}
            className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            🌟 Créer l'étoile
          </button>
        </div>

        <div className="text-xs text-slate-500">
          💡 Votre étoile sera visible dans le ciel et pourra être enrichie librement par d'autres voyageurs
        </div>
      </motion.div>
    </motion.div>
  )
}
