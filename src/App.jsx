import { Routes, Route, Link } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import Layout from './components/Layout.jsx'
const Home = lazy(() => import('./pages/Home.jsx'))
const Create = lazy(() => import('./pages/Create.jsx'))
const Community = lazy(() => import('./pages/Community.jsx'))
const Cosmoji = lazy(() => import('./pages/Cosmoji.jsx'))
const Pantheon = lazy(() => import('./pages/Pantheon.jsx'))
const Guardian = lazy(() => import('./pages/Guardian.jsx'))
const DreamGarden = lazy(() => import('./pages/DreamGarden.jsx'))
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
          <Route path="/dreamgarden" element={<DreamGarden />} />
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
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <p className="text-xl">Page not found.</p>
      <Link className="text-blue-600 underline" to="/">Back to Home</Link>
    </div>
  )
}

function Fallback() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="animate-pulse text-slate-400">Chargement…</div>
    </div>
  )
}
