import { Routes, Route, Link } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { motion } from 'framer-motion'
import Layout from './components/Layout.jsx'

const Home = lazy(() => import('./pages/Home.jsx'))
const Create = lazy(() => import('./pages/Create.jsx'))
const Community = lazy(() => import('./pages/Community.jsx'))
const Cosmoji = lazy(() => import('./pages/Cosmoji.jsx'))
const Pantheon = lazy(() => import('./pages/Pantheon.jsx'))
const Guardian = lazy(() => import('./pages/Guardian.jsx'))
const Profile = lazy(() => import('./pages/Profile.jsx'))
const Navette = lazy(() => import('./pages/Navette.jsx'))
const Lune = lazy(() => import('./pages/Lune.jsx'))
const VoyageInuit = lazy(() => import('./pages/VoyageInuit.jsx'))

export default function App() {
  return (
    <div className="min-h-screen text-slate-100 selection:bg-midnight-400 selection:text-white">
      <Layout>
        <Suspense fallback={<Fallback /> }>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/navette" element={<Navette />} />
            <Route path="/voyage/inuit" element={<VoyageInuit />} />
            <Route path="/lune" element={<Lune />} />
            <Route path="/create" element={<Create />} />
            <Route path="/community" element={<Community />} />
            <Route path="/cosmoji" element={<Cosmoji />} />
          <Route path="/guardian" element={<Guardian />} />
            <Route path="/pantheon" element={<Pantheon />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Layout>
    </div>
  )
}

function NotFound() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-[60vh] flex flex-col items-center justify-center gap-6 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="text-8xl"
      >
        🌌
      </motion.div>
      <div className="space-y-3">
        <h1 className="text-3xl font-bold bg-gradient-to-br from-white to-slate-300 bg-clip-text text-transparent">
          Page non trouvée
        </h1>
        <p className="text-slate-400 max-w-md">
          Cette page semble s'être perdue dans les étoiles...
        </p>
      </div>
      <Link 
        to="/"
        className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-midnight-400 to-midnight-500 text-white px-8 py-4 hover:shadow-aurora transition-all duration-300 font-medium"
      >
        Retour à l'accueil
        <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
      </Link>
    </motion.div>
  )
}

function Fallback() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-[60vh] flex flex-col items-center justify-center gap-4"
    >
      <motion.div
        animate={{ 
          rotate: 360,
          scale: [1, 1.2, 1]
        }}
        transition={{ 
          rotate: { duration: 2, repeat: Infinity, ease: "linear" },
          scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
        }}
        className="text-6xl"
      >
        ✨
      </motion.div>
      <div className="text-slate-400 font-medium">Chargement…</div>
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-midnight-400"
            animate={{ 
              y: [0, -12, 0],
              opacity: [0.3, 1, 0.3]
            }}
            transition={{ 
              duration: 1.2, 
              repeat: Infinity, 
              delay: i * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </motion.div>
  )
}
