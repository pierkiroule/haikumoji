import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  getStars, 
  getCollaborations, 
  createCollaboration, 
  acceptCollaboration,
  finalizeCollaboration,
  getUser,
  saveUser,
  getSelectedTriplet 
} from '../utils/storage.js'
import OnimojiStar from '../components/OnimojiStar.jsx'

export default function Forum() {
  const [stars, setStars] = useState([])
  const [collaborations, setCollaborations] = useState([])
  const [user, setUser] = useState(null)
  const [userTriangle, setUserTriangle] = useState([])
  const [activeTab, setActiveTab] = useState('stars')
  const [selectedCollab, setSelectedCollab] = useState(null)
  const [collabText, setCollabText] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    let currentUser = getUser()
    const triangle = getSelectedTriplet()
    
    if (!currentUser) {
      // Créer ET persister un utilisateur par défaut
      const defaultUser = { id: 'user-' + Date.now(), name: 'Voyageur Anonyme' }
      const savedUser = saveUser(defaultUser)
      setUser(savedUser)
    } else {
      setUser(currentUser)
    }
    
    setUserTriangle(triangle)
    refreshData()
  }, [])

  const refreshData = () => {
    setStars(getStars())
    setCollaborations(getCollaborations())
  }

  const handleCreateCollaboration = () => {
    if (!user || userTriangle.length < 3) {
      navigate('/tirage')
      return
    }
    
    const newCollab = createCollaboration(user.id, user.name, userTriangle)
    refreshData()
    setSelectedCollab(newCollab.id)
    setActiveTab('collaborations')
  }

  const handleAcceptInvite = (collabId) => {
    if (!user || userTriangle.length < 3) {
      navigate('/tirage')
      return
    }
    
    acceptCollaboration(collabId, user.id, user.name, userTriangle)
    refreshData()
  }

  const handleFinalizeCollab = (collabId) => {
    if (!collabText.trim()) return
    
    const star = finalizeCollaboration(collabId, collabText)
    if (star) {
      setCollabText('')
      setSelectedCollab(null)
      refreshData()
      setActiveTab('stars')
    }
  }

  const myCollaborations = collaborations.filter(c => 
    c.participants.some(p => p.id === user?.id) && c.status === 'open'
  )

  const pendingInvites = collaborations.filter(c =>
    c.invites.some(i => i.id === user?.id && i.status === 'pending')
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="text-6xl mb-4">⭐</div>
        <h1 className="text-3xl md:text-4xl font-bold text-white">
          Forum des Étoiles Onimoji
        </h1>
        <p className="text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Invitez d'autres voyageurs pour co-créer des étoiles onimojis. 
          Superposez vos triangles et tissez ensemble des scripts oniriques collaboratifs.
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

      {/* Tabs */}
      <div className="flex gap-2 justify-center flex-wrap">
        <button
          onClick={() => setActiveTab('stars')}
          className={`px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${
            activeTab === 'stars'
              ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg'
              : 'glass text-slate-300 hover:glass-strong'
          }`}
        >
          ⭐ Étoiles ({stars.length})
        </button>
        <button
          onClick={() => setActiveTab('collaborations')}
          className={`px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${
            activeTab === 'collaborations'
              ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg'
              : 'glass text-slate-300 hover:glass-strong'
          }`}
        >
          🤝 Collaborations ({myCollaborations.length})
        </button>
        {pendingInvites.length > 0 && (
          <button
            onClick={() => setActiveTab('invites')}
            className={`px-6 py-3 rounded-2xl font-medium transition-all duration-300 relative ${
              activeTab === 'invites'
                ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg'
                : 'glass text-slate-300 hover:glass-strong'
            }`}
          >
            📨 Invitations ({pendingInvites.length})
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center">
              {pendingInvites.length}
            </span>
          </button>
        )}
      </div>

      {/* Create Collaboration Button */}
      {activeTab === 'collaborations' && (
        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreateCollaboration}
            disabled={!userTriangle || userTriangle.length < 3}
            className="rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-8 py-4 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ✨ Créer une nouvelle collaboration
          </motion.button>
        </div>
      )}

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'stars' && (
          <StarsTab key="stars" stars={stars} />
        )}
        
        {activeTab === 'collaborations' && (
          <CollaborationsTab 
            key="collabs" 
            collaborations={myCollaborations}
            selectedCollab={selectedCollab}
            setSelectedCollab={setSelectedCollab}
            collabText={collabText}
            setCollabText={setCollabText}
            onFinalize={handleFinalizeCollab}
            user={user}
          />
        )}

        {activeTab === 'invites' && (
          <InvitesTab 
            key="invites" 
            invites={pendingInvites}
            onAccept={handleAcceptInvite}
            user={user}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function StarsTab({ stars }) {
  if (stars.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="text-center py-16 text-slate-400"
      >
        <div className="text-6xl mb-4">🌟</div>
        <p>Aucune étoile co-créée pour le moment.</p>
        <p className="text-sm mt-2">Créez la première collaboration !</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="grid gap-6"
    >
      {stars.map((star, index) => (
        <motion.div
          key={star.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="rounded-2xl glass-strong border border-white/20 p-6 shadow-card"
        >
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start gap-6">
              <OnimojiStar participants={star.participants} size={160} />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-bold text-white">
                    {star.branchCount === 'circle' 
                      ? `Cercle Sacré (${star.participants.length} voyageurs)`
                      : `Étoile à ${star.branchCount} branches`
                    }
                  </h3>
                </div>
                <div className="text-sm text-slate-400 space-y-1">
                  <div>Co-créée par :</div>
                  {star.participants.map((p, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-white">{p.name}</span>
                      <span className="text-xs">{p.triangle.join(' ')}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Script onirique */}
            <div className="rounded-xl bg-white/5 border border-white/10 p-4">
              <pre className="whitespace-pre-wrap text-slate-200 leading-relaxed text-sm">
                {star.text}
              </pre>
            </div>

            {/* Footer */}
            <div className="text-xs text-slate-500">
              {new Date(star.timestamp).toLocaleDateString('fr-FR', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}

function CollaborationsTab({ 
  collaborations, 
  selectedCollab,
  setSelectedCollab,
  collabText,
  setCollabText,
  onFinalize,
  user
}) {
  if (collaborations.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="text-center py-16 text-slate-400"
      >
        <div className="text-6xl mb-4">🤝</div>
        <p>Aucune collaboration en cours.</p>
        <p className="text-sm mt-2">Créez-en une pour inviter d'autres voyageurs !</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="grid gap-6"
    >
      {collaborations.map((collab) => (
        <CollaborationCard
          key={collab.id}
          collab={collab}
          isExpanded={selectedCollab === collab.id}
          onToggle={() => setSelectedCollab(selectedCollab === collab.id ? null : collab.id)}
          collabText={collabText}
          setCollabText={setCollabText}
          onFinalize={onFinalize}
          user={user}
        />
      ))}
    </motion.div>
  )
}

function CollaborationCard({ collab, isExpanded, onToggle, collabText, setCollabText, onFinalize, user }) {
  const participantCount = collab.participants.length
  const branchType = participantCount === 2 ? '6 branches' :
                     participantCount === 3 ? '9 branches' :
                     participantCount === 4 ? '12 branches' : 'cercle'
  
  return (
    <motion.div
      layout
      className="rounded-2xl glass-strong border border-white/20 p-6 shadow-card"
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <OnimojiStar participants={collab.participants} size={120} />
            <div>
              <h3 className="text-lg font-bold text-white mb-2">
                {participantCount >= 5 ? 'Cercle en formation' : `Étoile à ${branchType}`}
              </h3>
              <div className="text-sm text-slate-400 space-y-1">
                <div className="font-medium text-emerald-400">
                  {participantCount} / ∞ participants
                </div>
                {collab.participants.map((p, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-white">{p.name}</span>
                    <span className="text-xs">{p.triangle.join(' ')}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <button
            onClick={onToggle}
            className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors px-4 py-2 rounded-lg glass"
          >
            {isExpanded ? '− Réduire' : '+ Co-créer'}
          </button>
        </div>

        {/* Expanded: Co-creation area */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 pt-4 border-t border-white/10"
            >
              <div>
                <h4 className="text-sm font-semibold text-white mb-2">
                  ✍️ Script onirique collaboratif
                </h4>
                <textarea
                  value={collabText}
                  onChange={(e) => setCollabText(e.target.value)}
                  placeholder="Tissez ensemble un script onirique inspiré de vos triangles superposés..."
                  className="w-full rounded-xl bg-white/5 border border-white/10 p-4 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors resize-none"
                  rows={6}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={onToggle}
                  className="px-6 py-3 rounded-xl glass text-white hover:glass-strong transition-all"
                >
                  Annuler
                </button>
                <button
                  onClick={() => onFinalize(collab.id)}
                  disabled={!collabText.trim()}
                  className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  ✨ Finaliser l'étoile
                </button>
              </div>

              <div className="text-xs text-slate-500">
                💡 Une fois finalisée, votre étoile sera ajoutée au forum et visible par tous
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

function InvitesTab({ invites, onAccept, user }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="grid gap-6"
    >
      {invites.map((collab) => (
        <motion.div
          key={collab.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl glass-strong border border-emerald-500/30 p-6 shadow-card"
        >
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <OnimojiStar participants={collab.participants} size={100} />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-2">
                  Invitation à co-créer une étoile
                </h3>
                <p className="text-sm text-slate-400">
                  {collab.hostName} vous invite à superposer votre triangle avec le sien
                </p>
              </div>
            </div>

            <button
              onClick={() => onAccept(collab.id)}
              className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-6 py-3 font-semibold hover:shadow-lg transition-all"
            >
              ✨ Accepter et rejoindre
            </button>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}
