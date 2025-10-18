import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

export default function NetworkGraph({ data }) {
  const svgRef = useRef(null)
  const { occurrences = [], cooccurrences = [] } = data || {}

  useEffect(() => {
    if (!svgRef.current || occurrences.length === 0) return

    const width = 500
    const height = 500
    const radius = 220

    d3.select(svgRef.current).selectAll('*').remove()

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)

    const g = svg.append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`)

    g.append('circle')
      .attr('r', radius)
      .attr('fill', 'rgba(139, 92, 246, 0.05)')
      .attr('stroke', 'rgba(139, 92, 246, 0.3)')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,5')

    const nodes = occurrences.map(({ emoji, count }) => ({
      id: emoji,
      emoji,
      count,
      x: 0,
      y: 0
    }))

    const links = cooccurrences
      .filter(({ source, target, count }) => 
        nodes.find(n => n.id === source) && nodes.find(n => n.id === target) && count > 0
      )
      .map(({ source, target, count }) => ({
        source,
        target,
        value: count
      }))

    const maxOccurrence = d3.max(occurrences, d => d.count) || 1
    const sizeScale = d3.scaleSqrt()
      .domain([0, maxOccurrence])
      .range([20, 50])

    const maxCooccurrence = d3.max(cooccurrences, d => d.count) || 1
    const linkWidthScale = d3.scaleLinear()
      .domain([0, maxCooccurrence])
      .range([1, 6])

    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(100).strength(0.3))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(0, 0))
      .force('collision', d3.forceCollide().radius(d => sizeScale(d.count) / 2 + 10))
      .force('boundary', () => {
        nodes.forEach(node => {
          const distance = Math.sqrt(node.x * node.x + node.y * node.y)
          if (distance > radius - 30) {
            const angle = Math.atan2(node.y, node.x)
            node.x = (radius - 30) * Math.cos(angle)
            node.y = (radius - 30) * Math.sin(angle)
          }
        })
      })

    const link = g.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', 'rgba(168, 85, 247, 0.3)')
      .attr('stroke-width', d => linkWidthScale(d.value))
      .attr('stroke-linecap', 'round')

    const node = g.append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended))

    node.append('circle')
      .attr('r', d => sizeScale(d.count) / 2)
      .attr('fill', 'rgba(139, 92, 246, 0.2)')
      .attr('stroke', 'rgba(168, 85, 247, 0.8)')
      .attr('stroke-width', 2)
      .style('cursor', 'grab')

    node.append('text')
      .text(d => d.emoji)
      .attr('text-anchor', 'middle')
      .attr('dy', '.35em')
      .style('font-size', d => sizeScale(d.count) * 0.6 + 'px')
      .style('pointer-events', 'none')
      .style('user-select', 'none')

    node.append('title')
      .text(d => `${d.emoji}: ${d.count} fois`)

    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y)

      node.attr('transform', d => `translate(${d.x},${d.y})`)
    })

    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart()
      event.subject.fx = event.subject.x
      event.subject.fy = event.subject.y
      d3.select(this).select('circle').style('cursor', 'grabbing')
    }

    function dragged(event) {
      event.subject.fx = event.x
      event.subject.fy = event.y
    }

    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0)
      event.subject.fx = null
      event.subject.fy = null
      d3.select(this).select('circle').style('cursor', 'grab')
    }

    return () => {
      simulation.stop()
    }
  }, [occurrences, cooccurrences])

  return (
    <div className="flex items-center justify-center">
      <svg ref={svgRef} className="max-w-full h-auto" />
    </div>
  )
}
