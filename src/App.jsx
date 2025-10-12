import { Routes, Route, Navigate, Link } from 'react-router-dom'
import Create from './pages/Create.jsx'

export default function App() {
  return (
    <div className="min-h-screen text-slate-800 selection:bg-blue-200">
      <Routes>
        <Route path="/" element={<Navigate to="/create" replace />} />
        <Route path="/create" element={<Create />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-xl">Page not found.</p>
      <Link className="text-blue-600 underline" to="/create">Go to Cosmoji</Link>
    </div>
  )
}
