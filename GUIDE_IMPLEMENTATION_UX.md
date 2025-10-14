# 🛠️ Guide d'Implémentation - Améliorations UX Onimoji

## 📋 Vue d'ensemble

Ce guide fournit des exemples de code concrets pour implémenter les améliorations UX recommandées.

---

## 1️⃣ Widget de Progression Persistant

### Fichier : `src/components/MoonProgressWidget.jsx`

```jsx
import { motion } from 'framer-motion'
import { getMoonIndex, getSelectedTriplet } from '../utils/storage.js'
import { getCurrentVoyage } from '../utils/voyageConfig.js'
import { getLuneData } from '../utils/voyageLoader.js'

export default function MoonProgressWidget({ currentPhase = 1 }) {
  const moonIndex = getMoonIndex()
  const voyage = getCurrentVoyage()
  const triplet = getSelectedTriplet()
  const luneData = getLuneData(voyage, moonIndex)
  
  const progress = (moonIndex / 12) * 100
  
  const phases = [
    { 
      id: 1, 
      label: 'Choisir 3 émojis', 
      icon: '✨', 
      completed: triplet && triplet.length === 3,
      current: currentPhase === 1
    },
    { 
      id: 2, 
      label: 'Créer votre haïku', 
      icon: '🌙',
      completed: currentPhase > 2,
      current: currentPhase === 2
    },
    { 
      id: 3, 
      label: 'Rencontrer le gardien', 
      icon: '✧',
      completed: currentPhase > 3,
      current: currentPhase === 3
    },
  ]
  
  const getNextStepMessage = () => {
    if (currentPhase === 1) return 'Choisir vos 3 émojis cosmiques'
    if (currentPhase === 2) return 'Créer votre haïku onirique'
    if (currentPhase === 3) return `Rencontrer ${luneData?.gardien?.nom || 'le gardien'}`
    return 'Lune complétée !'
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-strong rounded-2xl border border-white/20 shadow-card p-5 mb-6"
    >
      {/* En-tête */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-sm font-medium text-white mb-1">
            🌙 Lune {moonIndex}/12 • {voyage.nom}
          </div>
          <div className="text-xs text-slate-300">
            Prochaine étape : {getNextStepMessage()}
          </div>
        </div>
        <div className="text-2xl">
          {luneData?.gardien?.emoji || '❄️'}
        </div>
      </div>
      
      {/* Barre de progression globale */}
      <div className="relative h-2 rounded-full bg-white/10 overflow-hidden mb-4">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
        />
      </div>
      
      {/* Stepper des 3 étapes */}
      <div className="flex items-center justify-between gap-2">
        {phases.map((phase, index) => (
          <div key={phase.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-medium transition-all duration-300 ${
                  phase.completed
                    ? 'bg-gradient-to-br from-emerald-500 to-cyan-500 text-white shadow-lg'
                    : phase.current
                    ? 'bg-white/20 text-white border-2 border-white/40 animate-pulse'
                    : 'bg-white/5 text-slate-400 border border-white/10'
                }`}
              >
                {phase.completed ? '✓' : phase.icon}
              </motion.div>
              <div className={`text-xs mt-1.5 text-center ${
                phase.current ? 'text-white font-medium' : 'text-slate-400'
              }`}>
                {phase.label}
              </div>
            </div>
            
            {index < phases.length - 1 && (
              <div className={`h-0.5 w-full mx-2 rounded transition-all duration-500 ${
                phase.completed ? 'bg-emerald-500' : 'bg-white/10'
              }`} />
            )}
          </div>
        ))}
      </div>
    </motion.div>
  )
}
```

### Utilisation dans les pages

```jsx
// src/pages/Navette.jsx
import MoonProgressWidget from '../components/MoonProgressWidget.jsx'

export default function Navette() {
  // ... code existant
  
  return (
    <div className="space-y-6">
      <MoonProgressWidget currentPhase={1} />
      {/* ... reste du contenu */}
    </div>
  )
}
```

---

## 2️⃣ Hook de Navigation Intelligente

### Fichier : `src/hooks/useVoyageFlow.js`

```javascript
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUser, getMoonIndex, getSelectedTriplet, getStarSeeds } from '../utils/storage.js'

export function useVoyageFlow() {
  const [flow, setFlow] = useState({
    nextStep: '/',
    currentPhase: 0,
    canProgress: false,
    message: ''
  })
  
  useEffect(() => {
    const user = getUser()
    const moonIndex = getMoonIndex()
    const triplet = getSelectedTriplet()
    const starSeeds = getStarSeeds()
    
    // Déterminer l'état actuel
    if (!user) {
      setFlow({
        nextStep: '/voyage/inuit',
        currentPhase: 0,
        canProgress: false,
        message: 'Inscription requise pour commencer'
      })
      return
    }
    
    if (!triplet || triplet.length < 3) {
      setFlow({
        nextStep: '/navette',
        currentPhase: 1,
        canProgress: false,
        message: 'Sélectionnez 3 émojis pour continuer'
      })
      return
    }
    
    // Check si le gardien de cette lune a été rencontré
    const currentMoonCompleted = starSeeds.some(seed => seed.moon === moonIndex)
    
    if (currentMoonCompleted) {
      setFlow({
        nextStep: '/dreamgarden',
        currentPhase: 4,
        canProgress: true,
        message: 'Lune complétée ! Visitez votre jardin'
      })
      return
    }
    
    // Sinon, on est entre la sélection et le gardien
    // On propose d'aller à la lune pour créer le haïku
    setFlow({
      nextStep: '/lune',
      currentPhase: 2,
      canProgress: true,
      message: 'Créez votre haïku onirique'
    })
  }, [])
  
  return flow
}

// Helper pour déterminer la phase actuelle sur une page donnée
export function getCurrentPhase(pathname) {
  if (pathname.includes('/navette')) return 1
  if (pathname.includes('/lune')) return 2
  if (pathname.includes('/guardian')) return 3
  if (pathname.includes('/dreamgarden')) return 4
  return 0
}
```

### Utilisation

```jsx
// src/pages/VoyageSmart.jsx
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useVoyageFlow } from '../hooks/useVoyageFlow.js'
import { motion } from 'framer-motion'

export default function VoyageSmart() {
  const { nextStep } = useVoyageFlow()
  const navigate = useNavigate()
  
  useEffect(() => {
    if (nextStep) {
      // Petit délai pour une transition fluide
      const timer = setTimeout(() => {
        navigate(nextStep, { replace: true })
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [nextStep, navigate])
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-[60vh] flex items-center justify-center"
    >
      <div className="text-center space-y-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="text-6xl"
        >
          🌙
        </motion.div>
        <p className="text-slate-300">Préparation de votre voyage...</p>
      </div>
    </motion.div>
  )
}
```

---

## 3️⃣ Navbar Simplifiée avec Progression

### Fichier : `src/components/Navbar.jsx` (modifié)

```jsx
import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { getMoonIndex, resetAppStorage } from '../utils/storage.js'

const navItems = [
  { 
    to: '/voyage/smart', 
    label: () => `🌙 Ma Lune`, 
    badge: () => `${getMoonIndex()}/12`,
    ariaLabel: 'Ma Lune actuelle',
    primary: true
  },
  { 
    to: '/dreamgarden', 
    label: () => '🌱 Mon Jardin', 
    ariaLabel: 'Jardin du Rêve',
    primary: true
  },
  { 
    to: '/community', 
    label: () => '💖 Communauté', 
    ariaLabel: 'Communauté',
    primary: true
  },
  { 
    to: '/explorer', 
    label: () => '📊 Explorer', 
    ariaLabel: 'Explorer',
    primary: false
  },
]

export default function Navbar() {
  const [moonIndex, setMoonIndex] = useState(1)
  const location = useLocation()
  
  useEffect(() => {
    setMoonIndex(getMoonIndex())
  }, [location])
  
  return (
    <motion.nav 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-x-0 bottom-0 lg:top-0 lg:bottom-auto glass-strong z-50 text-slate-200 border-t lg:border-b border-white/20 backdrop-blur-xl" 
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Barre de progression ultra fine en haut */}
        <div className="h-1 bg-white/5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(moonIndex / 12) * 100}%` }}
            className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500"
            transition={{ duration: 0.5 }}
          />
        </div>
        
        {/* Navigation */}
        <div className="h-16 flex items-center justify-around px-4 gap-1">
          {navItems.map((item, index) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => 
                `relative text-sm transition-all duration-300 px-3 py-2 rounded-xl ${
                  isActive 
                    ? 'text-white font-semibold' 
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`
              }
              end={item.to === '/'}
              aria-label={item.ariaLabel}
            >
              {({ isActive }) => (
                <>
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative z-10 flex items-center gap-1.5"
                  >
                    <span>{typeof item.label === 'function' ? item.label() : item.label}</span>
                    {item.badge && (
                      <span className="text-xs px-1.5 py-0.5 rounded-full bg-white/20 text-white font-bold">
                        {item.badge()}
                      </span>
                    )}
                  </motion.div>
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-0 bg-gradient-to-r from-aurora-purple/30 to-aurora-blue/30 rounded-xl border border-white/20"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
          
          {/* Bouton Reset (dev only) */}
          {import.meta.env?.MODE !== 'production' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const ok = confirm('Réinitialiser les données locales ?')
                if (ok) {
                  resetAppStorage()
                  window.location.reload()
                }
              }}
              className="text-xs rounded-lg bg-white/10 text-white px-2 py-1 border border-white/10 hover:bg-white/20 transition-all"
              aria-label="Reset LocalStorage"
            >
              🧹
            </motion.button>
          )}
        </div>
      </div>
    </motion.nav>
  )
}
```

---

## 4️⃣ Page Explorer (Nouvelle)

### Fichier : `src/pages/Explorer.jsx`

```jsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Cosmoji from './Cosmoji.jsx'
import Pantheon from './Pantheon.jsx'

export default function Explorer() {
  const [activeTab, setActiveTab] = useState('cosmoji')
  
  const tabs = [
    { id: 'cosmoji', label: 'Réseau Cosmoji', icon: '✨' },
    { id: 'pantheon', label: 'Panthéon', icon: '✧' },
    { id: 'stats', label: 'Statistiques', icon: '📊' },
  ]
  
  return (
    <div className="space-y-6">
      {/* En-tête */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl glass-strong border border-white/20 p-6"
      >
        <h1 className="text-3xl font-bold text-white mb-2">
          Explorer l'Univers Onimoji
        </h1>
        <p className="text-slate-300">
          Découvrez le réseau cosmique, les gardiens et vos statistiques personnelles
        </p>
      </motion.section>
      
      {/* Tabs */}
      <div className="rounded-2xl glass border border-white/20 overflow-hidden">
        {/* Tab Headers */}
        <div className="flex border-b border-white/10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-6 py-4 font-medium transition-all duration-300 relative ${
                activeTab === tab.id
                  ? 'text-white bg-white/10'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <span className="text-xl">{tab.icon}</span>
                <span>{tab.label}</span>
              </span>
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
        
        {/* Tab Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {activeTab === 'cosmoji' && (
              <motion.div
                key="cosmoji"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <CosmojiReadOnly />
              </motion.div>
            )}
            
            {activeTab === 'pantheon' && (
              <motion.div
                key="pantheon"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Pantheon />
              </motion.div>
            )}
            
            {activeTab === 'stats' && (
              <motion.div
                key="stats"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <PersonalStats />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

// Composant Cosmoji en lecture seule (sans sélection)
function CosmojiReadOnly() {
  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-400/20 p-4">
        <p className="text-sm text-slate-300">
          <span className="font-semibold text-white">ℹ️ Exploration :</span> Visualisez le réseau cosmique 
          alimenté par tous les voyageurs. Les connexions se renforcent à chaque voyage.
        </p>
      </div>
      
      {/* Afficher le réseau Cosmoji en lecture seule */}
      <div className="rounded-xl bg-white p-6">
        {/* Contenu du réseau (réutiliser composant existant sans onToggle) */}
        <p className="text-center text-slate-600">
          Réseau Cosmoji (lecture seule - pas de sélection possible ici)
        </p>
      </div>
    </div>
  )
}

// Composant Stats personnelles
function PersonalStats() {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      <div className="rounded-xl glass-strong border border-white/20 p-6 text-center">
        <div className="text-4xl mb-2">🌙</div>
        <div className="text-3xl font-bold text-white mb-1">
          {getMoonIndex()}/12
        </div>
        <div className="text-sm text-slate-400">Lunes complétées</div>
      </div>
      
      <div className="rounded-xl glass-strong border border-white/20 p-6 text-center">
        <div className="text-4xl mb-2">⭐</div>
        <div className="text-3xl font-bold text-white mb-1">
          {getStarSeeds().length}
        </div>
        <div className="text-sm text-slate-400">Graines d'étoiles</div>
      </div>
      
      <div className="rounded-xl glass-strong border border-white/20 p-6 text-center">
        <div className="text-4xl mb-2">✨</div>
        <div className="text-3xl font-bold text-white mb-1">
          {/* Calculer emojis uniques utilisés */}
          42
        </div>
        <div className="text-sm text-slate-400">Émojis explorés</div>
      </div>
    </div>
  )
}
```

---

## 5️⃣ Glossaire Modal

### Fichier : `src/components/GlossaryModal.jsx`

```jsx
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

const glossaryTerms = [
  {
    icon: '🌙',
    term: 'Lune',
    definition: 'Une étape de votre voyage (12 au total). Chaque lune représente une rencontre complète : sélection d\'émojis → haïku → gardien.'
  },
  {
    icon: '🚀',
    term: 'Navette Cosmoniris',
    definition: 'L\'espace où vous sélectionnez 3 émojis cosmiques dans le réseau. C\'est le hublot qui vous permet d\'observer et choisir.'
  },
  {
    icon: '✨',
    term: 'Cosmoji',
    definition: 'Réseau d\'émojis vivant, alimenté par tous les voyageurs. Plus un émoji est choisi, plus il devient visible et connecté.'
  },
  {
    icon: '✧',
    term: 'Gardien',
    definition: 'Esprit chamanique inuit (Sila, Sedna, Nanook...) qui vous guide avec sagesse et vous offre un script onirique régénérateur.'
  },
  {
    icon: '⭐',
    term: 'Graine d\'Étoile',
    definition: 'Souvenir cristallisé de votre rencontre avec un gardien. Chaque graine est plantée dans votre Jardin du Rêve.'
  },
  {
    icon: '🌱',
    term: 'Jardin du Rêve',
    definition: 'Votre collection personnelle de graines d\'étoiles, représentant votre progression et vos rencontres chamaniques.'
  },
  {
    icon: '📜',
    term: 'Script Onirique',
    definition: 'Texte régénérateur personnalisé offert par chaque gardien pour apaiser votre sommeil et enrichir vos rêves.'
  },
]

export default function GlossaryModal({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/95 backdrop-blur-lg z-[100] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="max-w-2xl w-full max-h-[80vh] overflow-y-auto rounded-3xl bg-gradient-to-br from-slate-800 to-midnight-900 border-2 border-white/20 shadow-2xl"
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-br from-slate-800 to-midnight-900 border-b border-white/20 p-6 z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">
                    📖 Guide du Voyageur
                  </h2>
                  <p className="text-sm text-slate-300">
                    Comprendre l'univers Onimoji
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all duration-300"
                >
                  ✕
                </button>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-6 space-y-4">
              {glossaryTerms.map((item, index) => (
                <motion.div
                  key={item.term}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="rounded-xl bg-white/5 border border-white/10 p-5 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-aurora-purple to-aurora-blue flex items-center justify-center text-2xl">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {item.term}
                      </h3>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        {item.definition}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Footer */}
            <div className="sticky bottom-0 bg-gradient-to-t from-slate-800 to-transparent p-6">
              <button
                onClick={onClose}
                className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-6 py-3 font-semibold hover:shadow-lg transition-all duration-300"
              >
                Compris, continuer mon voyage
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

### Bouton Flottant d'Aide

```jsx
// src/components/HelpButton.jsx
import { useState } from 'react'
import { motion } from 'framer-motion'
import GlossaryModal from './GlossaryModal.jsx'

export default function HelpButton() {
  const [showGlossary, setShowGlossary] = useState(false)
  
  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowGlossary(true)}
        className="fixed bottom-20 right-6 lg:bottom-6 w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-2xl flex items-center justify-center text-2xl z-40 border-2 border-white/20"
        aria-label="Aide et glossaire"
      >
        ?
      </motion.button>
      
      <GlossaryModal 
        isOpen={showGlossary} 
        onClose={() => setShowGlossary(false)} 
      />
    </>
  )
}
```

### Intégration dans Layout

```jsx
// src/components/Layout.jsx
import HelpButton from './HelpButton.jsx'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen relative">
      {/* ... navbar, etc */}
      <main>{children}</main>
      <HelpButton /> {/* Bouton d'aide persistant */}
    </div>
  )
}
```

---

## 6️⃣ Routes Mises à Jour

### Fichier : `src/App.jsx` (ajouts)

```jsx
import VoyageSmart from './pages/VoyageSmart.jsx'
import Explorer from './pages/Explorer.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/voyage/smart" element={<VoyageSmart />} /> {/* Nouvelle */}
      <Route path="/voyage/inuit" element={<VoyageInuit />} />
      <Route path="/navette" element={<Navette />} />
      <Route path="/lune" element={<Lune />} />
      <Route path="/guardian" element={<Guardian />} />
      <Route path="/dreamgarden" element={<DreamGarden />} />
      <Route path="/community" element={<Community />} />
      <Route path="/explorer" element={<Explorer />} /> {/* Nouvelle */}
      <Route path="/cosmoji" element={<Cosmoji />} /> {/* Garder pour compatibilité */}
      <Route path="/pantheon" element={<Pantheon />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
```

---

## 🎨 Visualisation ASCII des Changements

### Navbar AVANT
```
┌────────────────────────────────────────────────────────────────┐
│ 🏠 Home | 🚀 Navette | ✨ Cosmoji | 🌙 Lune | 💖 Communauté | 🌱 Jardin │
└────────────────────────────────────────────────────────────────┘
❌ 6 liens, pas de hiérarchie, confusion
```

### Navbar APRÈS
```
┌────────────────────────────────────────────────────────┐
│ ████████████░░░░░░░░░░░░░░░░░░░░░░░░ 25%              │ ← Barre progression
├────────────────────────────────────────────────────────┤
│ 🌙 Ma Lune (3/12) | 🌱 Mon Jardin | 💖 Communauté | 📊 Explorer │
└────────────────────────────────────────────────────────┘
✅ 4 liens, progression visible, un point d'entrée clair
```

### Page Navette AVANT
```
┌─────────────────────────────┐
│ Navette Cosmoniris          │
│ Sélectionnez 3 émojis       │
│                             │
│ [Réseau d'émojis]           │
│                             │
│ [Valider]                   │
└─────────────────────────────┘
❌ Pas d'indication de progression
```

### Page Navette APRÈS
```
┌──────────────────────────────────────┐
│ 🌙 Lune 3/12 • ❄️ Voyage Inuit       │
│ ████████████░░░░░░░░░░░░ 25%        │
│ Prochaine : Rencontrer Sedna        │
│ [1.✨] → [2.🌙] → [3.✧]              │
│      ↑ Vous êtes ici                │
├──────────────────────────────────────┤
│ Navette Cosmoniris                  │
│ Sélectionnez 3 émojis               │
│                                     │
│ [Réseau d'émojis]                   │
│                                     │
│ [✨ Valider et continuer]            │
└──────────────────────────────────────┘
✅ Progression claire, contexte, prochaine étape visible
```

---

## 📦 Checklist d'Implémentation

### Phase 1 - Navigation & Progression
- [ ] Créer `MoonProgressWidget.jsx`
- [ ] Créer `useVoyageFlow.js`
- [ ] Créer `VoyageSmart.jsx`
- [ ] Modifier `Navbar.jsx` (réduire à 4 liens + badge)
- [ ] Intégrer widget dans Navette, Lune, Guardian
- [ ] Tester le flow complet

### Phase 2 - Clarification
- [ ] Créer `GlossaryModal.jsx`
- [ ] Créer `HelpButton.jsx`
- [ ] Intégrer dans `Layout.jsx`
- [ ] Ajouter tooltips contextuels (premier passage)
- [ ] Tester accessibilité

### Phase 3 - Explorer & Cosmoji
- [ ] Créer `Explorer.jsx` (avec tabs)
- [ ] Modifier Cosmoji pour lecture seule
- [ ] Créer composant PersonalStats
- [ ] Ajouter route `/explorer`
- [ ] Tester navigation

---

## 🧪 Tests Utilisateurs Suggérés

### Scénario 1 : Premier utilisateur
1. Arrive sur Home
2. Voit onboarding
3. Clique "Commencer"
4. S'inscrit
5. **Vérifie:** Est-il redirigé automatiquement vers Navette ?
6. **Vérifie:** Voit-il le widget de progression ?

### Scénario 2 : Utilisateur en cours
1. A déjà fait 2 lunes
2. Clique sur "Ma Lune (3/12)"
3. **Vérifie:** Va-t-il directement à la prochaine étape logique ?
4. **Vérifie:** Le widget affiche-t-il la bonne phase ?

### Scénario 3 : Exploration
1. Utilisateur veut voir le réseau complet
2. Clique sur "Explorer"
3. **Vérifie:** Peut-il voir le Cosmoji sans pouvoir sélectionner ?
4. **Vérifie:** Les tabs fonctionnent-ils bien ?

---

## 💡 Conseils d'Implémentation

1. **Commencer par le widget** → Impact visuel immédiat
2. **Puis la navbar** → Simplifie la navigation
3. **Enfin Explorer** → Repositionne Cosmoji

4. **Tester à chaque étape** → Ne pas tout casser d'un coup

5. **Garder l'ancien code** → Commenter plutôt que supprimer pour rollback facile

6. **Mobile first** → Le widget doit être responsive

---

Prêt à commencer ? 🚀
