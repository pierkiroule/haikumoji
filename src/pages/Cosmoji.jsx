import { useState } from 'react'
import PantheonModal from '../components/PantheonModal.jsx'

export default function Cosmoji() {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative min-h-[60vh] flex items-center justify-center rounded-2xl bg-white shadow-lg p-6">
      <button
        className="absolute top-4 left-4 rounded-xl bg-white/80 backdrop-blur px-3 py-1 shadow border"
        onClick={() => history.back()}
      >
        ← Retour
      </button>
      <button onClick={() => setOpen(true)} className="text-5xl" aria-label="Ouvrir le Panthéon">
        ✨❤️
      </button>
      <PantheonModal open={open} onClose={() => setOpen(false)} />
    </div>
  )
}
