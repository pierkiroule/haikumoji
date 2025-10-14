import { useEffect, useMemo, useRef, useState } from 'react'
import { select, zoom as d3Zoom, drag as d3Drag, forceSimulation, forceLink, forceManyBody, forceCenter, forceCollide } from 'd3'

// D3-based force-directed graph: nodes = occurrences, links = co-occurrences
export default function EmojiNetwork({
  stats,
  maxNodes = 24,
  maxLinks = 80,
  height = 460,
  selectable = false,
  selected = [],
  onToggle,
  maxSelected = 3,
  getNodeColor, // optional: (id: string, selected: boolean) => { fill?: string, stroke?: string, fillOpacity?: number, strokeOpacity?: number }
  glow = false,
}) {
  const containerRef = useRef(null)
  const svgRef = useRef(null)
  const gRef = useRef(null)
  const simulationRef = useRef(null)
  const [width, setWidth] = useState(600)

  const { nodes, links, maxOcc, maxPair } = useMemo(() => {
    const occ = Array.isArray(stats?.occurrences) ? stats.occurrences : []
    const pairs = Array.isArray(stats?.pairs) ? stats.pairs : []

    const topNodes = occ.slice(0, maxNodes)
    const allowed = new Set(topNodes.map(n => n.items[0]))

    const filteredLinks = pairs
      .filter(p => p.items.length === 2 && allowed.has(p.items[0]) && allowed.has(p.items[1]))
      .slice(0, maxLinks)

    const maxOccCount = topNodes.reduce((m, n) => Math.max(m, n.count || 0), 1)
    const maxPairCount = filteredLinks.reduce((m, e) => Math.max(m, e.count || 0), 1)

    const nodes = topNodes.map(n => ({ id: n.items[0], count: n.count }))
    const links = filteredLinks.map(l => ({ source: l.items[0], target: l.items[1], count: l.count }))

    return { nodes, links, maxOcc: maxOccCount, maxPair: maxPairCount }
  }, [stats, maxNodes, maxLinks])

  const nodeRadius = useMemo(() => {
    const minR = 12, maxR = 30
    return (count) => {
      if (!maxOcc) return minR
      return Math.round(minR + (maxR - minR) * (count / maxOcc))
    }
  }, [maxOcc])

  const linkWidth = useMemo(() => {
    const minW = 1, maxW = 6
    return (count) => {
      if (!maxPair) return minW
      return minW + (maxW - minW) * (count / maxPair)
    }
  }, [maxPair])

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

  // Build D3 scene and simulation
  useEffect(() => {
    const svgEl = svgRef.current
    if (!svgEl) return

    // Reset previous content and simulation
    simulationRef.current?.stop()
    const svg = select(svgEl)
    svg.selectAll('*').remove()

    if (!nodes.length) return

    const g = svg.append('g').attr('class', 'viz')
    gRef.current = g

    // Zoom & pan
    svg.call(
      d3Zoom()
        .scaleExtent([0.5, 2])
        .on('zoom', (event) => {
          g.attr('transform', event.transform)
        })
    )

    // Prepare data for simulation
    const simNodes = nodes.map(n => ({ ...n }))
    const simLinks = links.map(l => ({ ...l }))
    const linkDistance = (l) => 90 - Math.min(50, (l.count / (maxPair || 1)) * 50)

    // Draw links
    const linkSel = g.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(simLinks)
      .join('line')
      .attr('stroke', '#94a3b8')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', d => linkWidth(d.count))

    // Draw nodes (group with circle + text)
    const nodeSel = g.append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(simNodes)
      .join('g')
      .attr('class', 'node')
      .style('cursor', 'grab')

    const isSelected = (id) => Array.isArray(selected) && selected.includes(id)
    const reachedMax = selectable && Array.isArray(selected) && selected.length >= maxSelected

    nodeSel.append('circle')
      .attr('r', d => nodeRadius(d.count))
      .each(function(d) {
        const sel = selectable && isSelected(d.id)
        const colors = typeof getNodeColor === 'function' ? (getNodeColor(d.id, sel) || {}) : {}
        const fill = colors.fill || (sel ? '#10b981' : '#0ea5e9')
        const stroke = colors.stroke || (sel ? '#059669' : '#0ea5e9')
        const fo = typeof colors.fillOpacity === 'number' ? colors.fillOpacity : (sel ? 0.28 : 0.14)
        const so = typeof colors.strokeOpacity === 'number' ? colors.strokeOpacity : (sel ? 0.75 : 0.45)
        select(this)
          .attr('fill', fill)
          .attr('fill-opacity', fo)
          .attr('stroke', stroke)
          .attr('stroke-width', sel ? 2 : 1.2)
          .attr('stroke-opacity', so)
          .style('filter', glow ? `drop-shadow(0 0 6px ${stroke}60)` : null)
      })

    nodeSel.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .style('user-select', 'none')
      .style('pointer-events', 'none')
      .style('font-size', d => `${Math.max(12, nodeRadius(d.count) * 0.9)}px`)
      .text(d => d.id)

    if (selectable) {
      // Dim unselected when selection cap reached
      nodeSel
        .style('opacity', d => (reachedMax && !isSelected(d.id) ? 0.45 : 1))
        .on('click', (event, d) => {
          // Prevent toggling if at cap and this node is not selected
          const disabled = reachedMax && !isSelected(d.id)
          if (disabled) return
          onToggle && onToggle(d.id)
        })
    }

    // Drag handlers
    nodeSel.call(
      d3Drag()
        .on('start', (event, d) => {
          if (!event.active && simulationRef.current) simulationRef.current.alphaTarget(0.3).restart()
          d.fx = d.x
          d.fy = d.y
        })
        .on('drag', (event, d) => {
          d.fx = event.x
          d.fy = event.y
        })
        .on('end', (event, d) => {
          if (!event.active && simulationRef.current) simulationRef.current.alphaTarget(0)
          d.fx = null
          d.fy = null
        })
    )

    // Simulation
    simulationRef.current = forceSimulation(simNodes)
      .force('link', forceLink(simLinks).id(d => d.id).distance(linkDistance).strength(0.7))
      .force('charge', forceManyBody().strength(-180))
      .force('collide', forceCollide().radius(d => nodeRadius(d.count) + 2).iterations(2))
      .force('center', forceCenter(width / 2, height / 2))

    simulationRef.current.on('tick', () => {
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
  }, [nodes, links, width, height, linkWidth, nodeRadius, maxPair, selectable, selected, onToggle, maxSelected])

  return (
    <div ref={containerRef} className="w-full" style={{ height }}>
      <svg ref={svgRef} width={width} height={height} className="block" />
    </div>
  )
}
