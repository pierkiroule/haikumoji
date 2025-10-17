import { useEffect, useMemo, useRef, useState } from 'react'
import { select, zoom as d3Zoom, drag as d3Drag, forceSimulation, forceLink, forceManyBody, forceCenter, forceCollide } from 'd3'

// Radar à constellation d'émojis - Optimisé pour mobile et interactions tactiles
export default function RadarCosmoji({
  stats,
  maxNodes = 22,
  maxLinks = 80,
  height = 460,
  selectable = false,
  selected = [],
  onToggle,
  maxSelected = 3,
  getNodeColor,
  glow = false,
  minCooccurrence = 3,
}) {
  const containerRef = useRef(null)
  const svgRef = useRef(null)
  const gRef = useRef(null)
  const simulationRef = useRef(null)
  const [width, setWidth] = useState(600)
  const [zoomLevel, setZoomLevel] = useState(1)
  const prefersReduced = typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false

  // Calcul du rayon du radar (cercle de contrainte)
  const radarRadius = useMemo(() => {
    const minDimension = Math.min(width, height)
    return (minDimension * 0.35) // 35% de la plus petite dimension
  }, [width, height])

  const { nodes, links, maxOcc, maxPair } = useMemo(() => {
    const occ = Array.isArray(stats?.occurrences) ? stats.occurrences : []
    const pairs = Array.isArray(stats?.pairs) ? stats.pairs : []

    const allNodes = occ.slice(0, maxNodes)
    const allowed = new Set(allNodes.map(n => n.items[0]))

    const filteredLinks = pairs
      .filter(p => p.items.length === 2 && allowed.has(p.items[0]) && allowed.has(p.items[1]) && p.count >= minCooccurrence)
      .slice(0, maxLinks)

    const maxOccCount = Math.max(1, allNodes.reduce((m, n) => Math.max(m, n.count || 0), 0))
    const maxPairCount = Math.max(1, filteredLinks.reduce((m, e) => Math.max(m, e.count || 0), 0))

    const nodes = allNodes.map(n => ({ id: n.items[0], count: n.count }))
    const links = filteredLinks.map(l => ({ source: l.items[0], target: l.items[1], count: l.count }))

    return { nodes, links, maxOcc: maxOccCount, maxPair: maxPairCount }
  }, [stats, maxNodes, maxLinks, minCooccurrence])

  const nodeRadius = useMemo(() => {
    const minR = 16, maxR = 32 // Plus grand pour mobile
    return (count) => {
      if (!maxOcc || count === 0) return minR
      return Math.round(minR + (maxR - minR) * (count / maxOcc))
    }
  }, [maxOcc])

  const linkWidth = useMemo(() => {
    const minW = 1.5, maxW = 6
    return (count) => {
      if (!maxPair) return minW
      return minW + (maxW - minW) * (count / maxPair)
    }
  }, [maxPair])

  // Fonction pour contraindre les nœuds dans le cercle radar
  const constrainToCircle = (node, radius) => {
    const centerX = width / 2
    const centerY = height / 2
    const dx = node.x - centerX
    const dy = node.y - centerY
    const distance = Math.sqrt(dx * dx + dy * dy)
    
    if (distance > radius) {
      const angle = Math.atan2(dy, dx)
      node.x = centerX + Math.cos(angle) * radius
      node.y = centerY + Math.sin(angle) * radius
    }
  }

  // Resize observer
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

  // Build D3 scene and simulation
  useEffect(() => {
    const svgEl = svgRef.current
    if (!svgEl) return

    simulationRef.current?.stop()
    const svg = select(svgEl)
    svg.selectAll('*').remove()

    if (!nodes.length || !width || !height) return

    const g = svg.append('g').attr('class', 'viz')
    gRef.current = g

    // Zoom & pan avec limites
    const zoom = d3Zoom()
      .scaleExtent([0.3, 3]) // Zoom plus étendu
      .on('zoom', (event) => {
        const newZoom = event.transform.k
        setZoomLevel(newZoom)
        g.attr('transform', event.transform)
      })

    svg.call(zoom)

    // Cercle de contrainte du radar (visible en arrière-plan)
    g.append('circle')
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .attr('r', radarRadius)
      .attr('fill', 'none')
      .attr('stroke', '#64748b')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '5,5')
      .attr('opacity', 0.3)

    // Grille radar (cercles concentriques)
    for (let i = 1; i <= 3; i++) {
      g.append('circle')
        .attr('cx', width / 2)
        .attr('cy', height / 2)
        .attr('r', (radarRadius * i) / 3)
        .attr('fill', 'none')
        .attr('stroke', '#64748b')
        .attr('stroke-width', 0.5)
        .attr('opacity', 0.2)
    }

    // Lignes de grille (rayons)
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI * 2) / 8
      const x1 = width / 2 + Math.cos(angle) * radarRadius
      const y1 = height / 2 + Math.sin(angle) * radarRadius
      g.append('line')
        .attr('x1', width / 2)
        .attr('y1', height / 2)
        .attr('x2', x1)
        .attr('y2', y1)
        .attr('stroke', '#64748b')
        .attr('stroke-width', 0.5)
        .attr('opacity', 0.2)
    }

    // Prepare data for simulation
    const simNodes = nodes.map(n => ({ ...n }))
    const simLinks = links.map(l => ({ ...l }))
    const linkDistance = (l) => 80 - Math.min(40, (l.count / (maxPair || 1)) * 40)

    // Draw links
    const linkSel = g.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(simLinks)
      .join('line')
      .attr('stroke', '#94a3b8')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', d => linkWidth(d.count))

    // Draw nodes avec animations de flottement
    const nodeSel = g.append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(simNodes)
      .join('g')
      .attr('class', 'node')
      .style('cursor', 'pointer')
      .style('touch-action', 'none') // Important pour mobile

    const isSelected = (id) => Array.isArray(selected) && selected.includes(id)
    const reachedMax = selectable && Array.isArray(selected) && selected.length >= maxSelected

    // Cercle de fond avec animation de flottement
    nodeSel.append('circle')
      .attr('r', d => nodeRadius(d.count))
      .each(function(d) {
        const sel = selectable && isSelected(d.id)
        const colors = typeof getNodeColor === 'function' ? (getNodeColor(d.id, sel) || {}) : {}
        const fill = colors.fill || (sel ? '#10b981' : '#0ea5e9')
        const stroke = colors.stroke || (sel ? '#059669' : '#0ea5e9')
        const fo = typeof colors.fillOpacity === 'number' ? colors.fillOpacity : (sel ? 0.28 : 0.14)
        const so = typeof colors.strokeOpacity === 'number' ? colors.strokeOpacity : (sel ? 0.75 : 0.45)
        
        const circle = select(this)
          .attr('fill', fill)
          .attr('fill-opacity', fo)
          .attr('stroke', stroke)
          .attr('stroke-width', sel ? 2.5 : 1.5)
          .attr('stroke-opacity', so)
          .style('filter', glow ? `drop-shadow(0 0 8px ${stroke}60)` : null)

        // Animation de flottement continue
        if (!prefersReduced) {
          const baseR = nodeRadius(d.count)
          const animateFloat = () => {
            circle
              .transition()
              .duration(2000 + Math.random() * 1000)
              .attr('r', baseR + Math.sin(Date.now() * 0.001 + d.id.charCodeAt(0)) * 2)
              .on('end', animateFloat)
          }
          animateFloat()
        }
      })

    // Texte émoji
    nodeSel.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .style('user-select', 'none')
      .style('pointer-events', 'none')
      .style('font-size', d => `${Math.max(14, nodeRadius(d.count) * 0.8)}px`)
      .text(d => d.id)

    // Interactions tactiles optimisées
    if (selectable) {
      nodeSel
        .style('opacity', d => (reachedMax && !isSelected(d.id) ? 0.45 : 1))
        .on('click touchstart', (event, d) => {
          event.preventDefault()
          event.stopPropagation()
          
          const disabled = reachedMax && !isSelected(d.id)
          if (disabled) return

          // Animation de rebond au touch
          if (!prefersReduced) {
            const circle = select(event.currentTarget).select('circle')
            const baseR = nodeRadius(d.count)
            
            circle
              .interrupt()
              .transition()
              .duration(100)
              .attr('r', baseR + 6)
              .transition()
              .duration(200)
              .attr('r', baseR - 2)
              .transition()
              .duration(150)
              .attr('r', baseR)
          }

          // Highlight des connexions
          if (!prefersReduced && gRef.current) {
            const isConnected = (l) => {
              const sid = typeof l.source === 'object' ? l.source.id : l.source
              const tid = typeof l.target === 'object' ? l.target.id : l.target
              return sid === d.id || tid === d.id
            }
            
            select(gRef.current)
              .selectAll('.links line')
              .filter(isConnected)
              .interrupt()
              .transition()
              .duration(150)
              .attr('stroke-opacity', 0.9)
              .attr('stroke-width', l => Math.min(linkWidth(l.count) + 3, 10))
              .transition()
              .duration(300)
              .attr('stroke-opacity', 0.6)
              .attr('stroke-width', l => linkWidth(l.count))
          }

          onToggle && onToggle(d.id)
        })
    }

    // Drag handlers avec contrainte circulaire
    nodeSel.call(
      d3Drag()
        .on('start', (event, d) => {
          if (!event.active && simulationRef.current) {
            simulationRef.current.alphaTarget(0.3).restart()
          }
          d.fx = d.x
          d.fy = d.y
        })
        .on('drag', (event, d) => {
          d.fx = event.x
          d.fy = event.y
          // Contrainte en temps réel pendant le drag
          constrainToCircle(d, radarRadius - nodeRadius(d.count))
        })
        .on('end', (event, d) => {
          if (!event.active && simulationRef.current) {
            simulationRef.current.alphaTarget(0)
          }
          d.fx = null
          d.fy = null
        })
    )

    // Simulation avec contrainte circulaire
    simulationRef.current = forceSimulation(simNodes)
      .force('link', forceLink(simLinks).id(d => d.id).distance(linkDistance).strength(0.6))
      .force('charge', forceManyBody().strength(-200))
      .force('collide', forceCollide().radius(d => nodeRadius(d.count) + 4).iterations(3))
      .force('center', forceCenter(width / 2, height / 2))
      .force('radar', () => {
        // Force personnalisée pour maintenir dans le radar
        simNodes.forEach(node => {
          constrainToCircle(node, radarRadius - nodeRadius(node.count))
        })
      })

    simulationRef.current.on('tick', () => {
      // Appliquer la contrainte à chaque tick
      simNodes.forEach(node => {
        constrainToCircle(node, radarRadius - nodeRadius(node.count))
      })

      linkSel
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y)

      nodeSel.attr('transform', d => `translate(${d.x},${d.y})`)
    })

    return () => {
      simulationRef.current?.stop()
      svg.selectAll('*').remove()
    }
  }, [nodes, links, width, height, linkWidth, nodeRadius, maxPair, selectable, selected, onToggle, maxSelected, radarRadius])

  return (
    <div ref={containerRef} className="w-full relative" style={{ height }}>
      <svg ref={svgRef} width={width} height={height} className="block" />
      
      {/* Indicateur de zoom */}
      <div className="absolute top-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded">
        {Math.round(zoomLevel * 100)}%
      </div>
      
      {/* Instructions tactiles */}
      <div className="absolute bottom-4 left-4 right-4 text-center">
        <p className="text-slate-400 text-xs">
          {selectable ? 'Touchez 3 émojis • Pincez pour zoomer • Glissez pour déplacer' : 'Pincez pour zoomer • Glissez pour déplacer'}
        </p>
      </div>
    </div>
  )
}