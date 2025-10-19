import { useEffect, useRef, useState } from 'react'
import { drawScene } from './tagcatcher/drawScene.js'
import { updateNodes } from './tagcatcher/updateNodes.js'
import { useResponsiveCanvas } from './tagcatcher/useResponsiveCanvas.js'

/**
 * TagCatcher - Sélectionne 5 émojis pour former une étoile.
 * Puis permet d'ajouter des "échos" (mots) sur 5 points intermédiaires
 * et un titre central. Basé sur un canvas 2D pour les animations légères.
 */
export default function TagCatcher({ emojis = defaultEmojis, width = 700, height = 480, responsive = true, onComplete }) {
  const canvasRef = useRef(null)
  const inputRef = useRef(null)
  const [msg, setMsg] = useState('')
  const [starFormed, setStarFormed] = useState(false)
  const [selected, setSelected] = useState([]) // 5 bulles choisies (objets {x,y,r,emoji,..})
  const [nodes, setNodes] = useState([])       // 20 bulles en mouvement
  const [points, setPoints] = useState([])     // 5 points d'intersection {id,x,y,filled,word}
  const [activePoint, setActivePoint] = useState(null)
  const [centerTitle, setCenterTitle] = useState('')

  const { containerRef, width: rw, height: rh } = useResponsiveCanvas({ aspectRatio: width / height, maxWidth: 900 })
  const W = responsive ? rw : width
  const H = responsive ? rh : height

  // init bulles
  useEffect(() => {
    const cv = canvasRef.current
    if (!cv) return
    const balls = Array.from({ length: emojis.length }).map((_, i) => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: 28,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      emoji: emojis[i % emojis.length],
      selected: false,
    }))
    setNodes(balls)
  }, [emojis, W, H])

  // animation + dessin
  useEffect(() => {
    const cv = canvasRef.current
    if (!cv) return
    const ctx = cv.getContext('2d')
    if (!ctx) return

    let raf

    const draw = () => {
      if (!starFormed) updateNodes(nodes, W, H)
      drawScene(ctx, { width: W, height: H, nodes, selected, points, centerTitle, starFormed })
      raf = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(raf)
  }, [nodes, starFormed, selected, points, centerTitle, W, H])

  // clics
  const onClick = (e) => {
    const cv = canvasRef.current
    if (!cv) return
    const rect = cv.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (!starFormed) {
      // sélection des 5
      const copy = nodes.slice()
      for (let b of copy) {
        const d = Math.hypot(x - b.x, y - b.y)
        if (d < b.r && !b.selected && selected.length < 5) {
          b.selected = true
          const newSel = [...selected, b]
          setSelected(newSel)
          setNodes(copy)
          if (newSel.length === 5) formStar(newSel)
          break
        }
      }
    } else {
      // clic sur un point
      for (let p of points) {
        const d = Math.hypot(x - p.x, y - p.y)
        if (d < 12 && !p.filled) {
          openInputForPoint(p, rect)
          break
        }
      }
      // clic centre pour titre
      const cx = cv.width / 2
      const cy = cv.height / 2
      if (Math.hypot(x - cx, y - cy) < 24) {
        openInputForCenter(cx + rect.left, cy + rect.top - 36)
      }
    }
  }

  // figer en étoile + créer points
  const formStar = (sel) => {
    setMsg('✨ Ton étoile est tissée !')
    setStarFormed(true)

    const W = responsive ? rw : width
    const H = responsive ? rh : height
    const cx = W / 2
    const cy = H / 2
    const R = 120

    // positions régulières (ordre selon sélection)
    const placed = sel.map((b, i) => {
      const angle = -Math.PI / 2 + i * ((2 * Math.PI) / 5)
      return { ...b, x: cx + R * Math.cos(angle), y: cy + R * Math.sin(angle) }
    })

    // cacher non-choisis et replacer sélectionnés
    const onlySelected = nodes.map((n) => {
      const m = placed.find((p) => p.emoji === n.emoji && n.selected)
      return m ? m : { ...n, selected: false, hidden: true }
    })

    setSelected(placed)
    setNodes(onlySelected)

    // 5 points centre→branche
    const pts = placed.map((b, i) => ({
      id: i,
      x: (b.x + cx) / 2,
      y: (b.y + cy) / 2,
      filled: false,
      word: null,
    }))
    setPoints(pts)
  }

  // input pour point
  const openInputForPoint = (p, rect) => {
    setActivePoint(p.id)
    const inp = inputRef.current
    if (!inp) return
    inp.style.left = rect.left + p.x - 60 + 'px'
    inp.style.top = rect.top + p.y - 20 + 'px'
    inp.value = ''
    inp.style.display = 'block'
    inp.focus()
  }

  // input pour titre central
  const openInputForCenter = (left, top) => {
    setActivePoint('center')
    const inp = inputRef.current
    if (!inp) return
    inp.style.left = left - 80 + 'px'
    inp.style.top = top + 'px'
    inp.value = ''
    inp.style.display = 'block'
    inp.focus()
  }

  // validation input
  const onKeyDown = (e) => {
    if (e.key !== 'Enter') return
    const val = e.target.value.trim()
    e.target.style.display = 'none'

    if (activePoint === 'center') {
      setCenterTitle(val || '')
      setActivePoint(null)
      return
    }

    const idx = typeof activePoint === 'number' ? activePoint : null
    if (idx === null) return
    setPoints((prev) => prev.map((p) => (p.id === idx ? { ...p, filled: true, word: val || '…' } : p)))
    setActivePoint(null)
  }

  // styles simples
  const wrapper = {
    width: '100%',
    minHeight: '100%',
    color: '#d9e3ff',
    fontFamily: 'Poppins, system-ui, -apple-system, Segoe UI, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  }
  const canvasBox = {
    background: 'rgba(255,255,255,0.04)',
    borderRadius: '12px',
    boxShadow: '0 0 40px rgba(0,0,0,0.4)',
  }
  const inputStyle = {
    position: 'absolute',
    display: 'none',
    background: 'rgba(255,255,255,0.98)',
    border: 'none',
    borderRadius: '10px',
    padding: '8px 10px',
    fontSize: '14px',
    textAlign: 'center',
    outline: 'none',
    color: '#0b1430',
    zIndex: 50,
  }

  // exposer résultat
  useEffect(() => {
    if (!starFormed) return
    const allFilled = points.length === 5 && points.every((p) => p.filled)
    if (allFilled && typeof onComplete === 'function') {
      const star = {
        emojis: selected.map((s) => s.emoji),
        echoes: points.map((p) => p.word || ''),
        title: centerTitle || '',
      }
      onComplete(star)
    }
  }, [points, starFormed, selected, centerTitle, onComplete])

  return (
    <div style={wrapper} className="space-y-3">
      <div className="text-center">
        <h2 className="text-xl font-semibold">🌙 Onimoji TagCatcher</h2>
        <p className="text-slate-300 text-sm">Sélectionne 5 émojis. Puis touche les points pour écrire tes mots.</p>
      </div>

      <div ref={containerRef} style={{ width: '100%' }}>
        <div style={canvasBox} className="relative">
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          onClick={onClick}
          style={{ display: 'block' }}
        />
        </div>
      </div>

      <input
        ref={inputRef}
        placeholder="Écris ici…"
        onKeyDown={onKeyDown}
        style={inputStyle}
      />

      <div style={{ marginTop: 12, color: '#5cd6ff' }}>{msg}</div>
    </div>
  )
}

const defaultEmojis = [
  '🌙','🌊','🔥','💧','🌿','🪶','🌕','💫','🍃','☁️',
  '🌸','🦋','🪷','🌈','✨','🌾','🌳','🌺','🌬️','🌻'
]
