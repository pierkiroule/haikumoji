import { useEffect, useState } from 'react'
import HaikuCard from '../components/HaikuCard.jsx'
import { getHaikus, likeHaiku, seedIfEmpty } from '../utils/storage.js'

export default function Community() {
  const [items, setItems] = useState([])

  useEffect(() => {
    seedIfEmpty()
    setItems(getHaikus())
  }, [])

  const handleLike = (h) => {
    const next = likeHaiku(h.id)
    setItems(next)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {items.map((h) => (
        <HaikuCard key={h.id} haiku={h} onLike={handleLike} />
      ))}
    </div>
  )
}
