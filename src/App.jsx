import { Routes, Route, Link } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import Create from './pages/Create.jsx'
import Community from './pages/Community.jsx'
import Cosmoji from './pages/Cosmoji.jsx'
import Pantheon from './pages/Pantheon.jsx'
import Profile from './pages/Profile.jsx'

export default function App() {
  return (
    <div className="min-h-screen text-slate-800 selection:bg-cyan-200">
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<Create />} />
          <Route path="/community" element={<Community />} />
          <Route path="/cosmoji" element={<Cosmoji />} />
          <Route path="/pantheon" element={<Pantheon />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
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
