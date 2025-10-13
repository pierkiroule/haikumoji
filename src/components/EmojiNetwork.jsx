import { useEffect, useMemo, useRef, useState } from 'react'

// Lightweight force-directed network for small graphs (<= 30 nodes)
export default function EmojiNetwork({ stats, maxNodes = 20, maxLinks = 60, height = 420 }) {
  const containerRef = useRef(null)
  const [width, setWidth] = useState(600)
  const [frame, setFrame] = useState(0)

  const { nodes, links, maxOcc, maxPair } = useMemo(() => {
    const occ = Array.isArray(stats?.occurrences) ? stats.occurrences : []
    const pairs = Array.isArray(stats?.pairs) ? stats.pairs : []

    const topNodes = occ.slice(0, maxNodes)
    const allowed = new Set(topNodes.map(n => n.items[0]))

    // Keep only links where both endpoints are in allowed set
    const filteredLinks = pairs
      .filter(p => p.items.length === 2 && allowed.has(p.items[0]) && allowed.has(p.items[1]))
      .slice(0, maxLinks)

    const maxOccCount = topNodes.reduce((m, n) => Math.max(m, n.count || 0), 1)
    const maxPairCount = filteredLinks.reduce((m, e) => Math.max(m, e.count || 0), 1)

    const nodes = topNodes.map(n => ({ id: n.items[0], count: n.count }))
    const links = filteredLinks.map(l => ({ source: l.items[0], target: l.items[1], count: l.count }))

    return { nodes, links, maxOcc: maxOccCount, maxPair: maxPairCount }
  }, [stats, maxNodes, maxLinks])

  // Derived visual scales
  const nodeRadius = (count) => {
    const minR = 12, maxR = 28
    if (!maxOcc) return minR
    return Math.round(minR + (maxR - minR) * (count / maxOcc))
  }
  const linkWidth = (count) => {
    const minW = 1, maxW = 6
    if (!maxPair) return minW
    return minW + (maxW - minW) * (count / maxPair)
  }

  // Simulation state in refs
  const simNodesRef = useRef([])
  const simLinksRef = useRef([])
  const rafRef = useRef(null)

  // Initialize nodes/links whenever data or width/height changes
  useEffect(() => {
    if (!nodes.length) return

    const w = width
    const h = height
    const centerX = w / 2
    const centerY = h / 2

    // Create node map with initial random positions
    const byId = new Map()
    const simNodes = nodes.map((n, i) => {
      const r = nodeRadius(n.count)
      const angle = (i / nodes.length) * Math.PI * 2
      const radius = Math.min(w, h) * 0.32 + Math.random() * 30
      const x = centerX + Math.cos(angle) * radius
      const y = centerY + Math.sin(angle) * radius
      const sn = { id: n.id, count: n.count, r, x, y, vx: 0, vy: 0 }
      byId.set(sn.id, sn)
      return sn
    })

    const simLinks = links.map(l => ({
      source: byId.get(l.source),
      target: byId.get(l.target),
      count: l.count,
      // Desired distance inversely related to link strength
      length: 90 - Math.min(50, (l.count / (maxPair || 1)) * 50),
    })).filter(l => l.source && l.target)

    simNodesRef.current = simNodes
    simLinksRef.current = simLinks

    // Kick the simulation
    startSimulation()

    return () => stopSimulation()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, links, width, height])

  // Resize observer for responsive width
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(entries => {
      for (const entry of entries) {
        const w = entry.contentRect.width
        if (w > 0) setWidth(Math.round(w))
      }
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const stopSimulation = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = null
  }

  const startSimulation = () => {
    stopSimulation()
    const damping = 0.9
    const repulsion = 1200 // higher -> stronger node repulsion
    const springK = 0.02 // link spring constant
    const centerPull = 0.002 // pull to center

    let ticks = 0
    const maxTicks = 900 // ~15s at 60fps, but we may settle earlier

    const step = () => {
      const n = simNodesRef.current
      const l = simLinksRef.current
      const cx = width / 2
      const cy = height / 2

      // Pairwise repulsion
      for (let i = 0; i < n.length; i++) {
        for (let j = i + 1; j < n.length; j++) {
          const a = n[i], b = n[j]
          let dx = a.x - b.x
          let dy = a.y - b.y
          let dist2 = dx * dx + dy * dy + 0.01
          let dist = Math.sqrt(dist2)
          const force = (repulsion) / dist2
          const fx = force * (dx / dist)
          const fy = force * (dy / dist)
          a.vx += fx
          a.vy += fy
          b.vx -= fx
          b.vy -= fy
        }
      }

      // Springs along links
      for (const e of l) {
        const a = e.source, b = e.target
        let dx = b.x - a.x
        let dy = b.y - a.y
        let dist = Math.hypot(dx, dy) || 0.001
        const desired = e.length
        const extension = dist - desired
        const force = springK * extension
        const fx = (dx / dist) * force
        const fy = (dy / dist) * force
        a.vx += fx
        a.vy += fy
        b.vx -= fx
        b.vy -= fy
      }

      // Gentle centering
      for (const a of n) {
        a.vx += (cx - a.x) * centerPull
        a.vy += (cy - a.y) * centerPull
      }

      // Integrate and damp
      for (const a of n) {
        a.vx *= damping
        a.vy *= damping
        a.x += a.vx
        a.y += a.vy
        // Keep within bounds
        const margin = a.r + 4
        a.x = Math.max(margin, Math.min(width - margin, a.x))
        a.y = Math.max(margin, Math.min(height - margin, a.y))
      }

      setFrame(f => f + 1)
      ticks++
      if (ticks < maxTicks) {
        rafRef.current = requestAnimationFrame(step)
      } else {
        stopSimulation()
      }
    }

    rafRef.current = requestAnimationFrame(step)
  }

  // Drag interactions
  const dragState = useRef({ id: null, offsetX: 0, offsetY: 0 })

  const onPointerDown = (id, evt) => {
    const rect = evt.currentTarget.ownerSVGElement.getBoundingClientRect()
    const x = evt.clientX - rect.left
    const y = evt.clientY - rect.top
    const node = simNodesRef.current.find(n => n.id === id)
    if (!node) return
    dragState.current = { id, offsetX: node.x - x, offsetY: node.y - y }
    node.vx = 0
    node.vy = 0
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
  }

  const onPointerMove = (evt) => {
    const { id, offsetX, offsetY } = dragState.current
    if (!id) return
    const svg = containerRef.current?.querySelector('svg')
    if (!svg) return
    const rect = svg.getBoundingClientRect()
    const x = evt.clientX - rect.left
    const y = evt.clientY - rect.top
    const node = simNodesRef.current.find(n => n.id === id)
    if (!node) return
    node.x = x + offsetX
    node.y = y + offsetY
    node.vx = 0
    node.vy = 0
    setFrame(f => f + 1)
  }

  const onPointerUp = () => {
    dragState.current = { id: null, offsetX: 0, offsetY: 0 }
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerup', onPointerUp)
  }

  // Render helpers
  const nodeForId = (id) => simNodesRef.current.find(n => n.id === id)

  return (
    <div ref={containerRef} className="w-full" style={{ height }}>
      <svg width={width} height={height} className="block">
        {/* Links */}
        <g>
          {simLinksRef.current.map((e, i) => (
            <line
              key={i}
              x1={e.source?.x || 0}
              y1={e.source?.y || 0}
              x2={e.target?.x || 0}
              y2={e.target?.y || 0}
              stroke="#94a3b8"
              strokeOpacity={0.6}
              strokeWidth={linkWidth(e.count)}
            />
          ))}
        </g>
        {/* Nodes */}
        <g>
          {simNodesRef.current.map(n => (
            <g key={n.id} onPointerDown={(evt) => onPointerDown(n.id, evt)} style={{ cursor: 'grab' }}>
              <circle cx={n.x} cy={n.y} r={n.r} fill="#0ea5e9" fillOpacity={0.12} stroke="#0ea5e9" strokeOpacity={0.4} />
              <text x={n.x} y={n.y + 6} textAnchor="middle" fontSize={Math.max(12, n.r * 0.9)}>
                {n.id}
              </text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  )
}
