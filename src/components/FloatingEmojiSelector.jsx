import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as d3 from 'd3'

export default function FloatingEmojiSelector({ emojis, onSelectionComplete }) {
  const svgRef = useRef(null)
  const [selected, setSelected] = useState([])
  const [showTriangle, setShowTriangle] = useState(false)
  const [trianglePositions, setTrianglePositions] = useState([])
  const simulationRef = useRef(null)
  const nodesRef = useRef([])

  useEffect(() => {
    if (!svgRef.current || showTriangle) return

    const width = 600
    const height = 600
    const radius = 200

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const nodes = emojis.map((emoji, i) => ({
      id: emoji,
      emoji,
      x: width / 2 + Math.cos((i / emojis.length) * Math.PI * 2) * radius,
      y: height / 2 + Math.sin((i / emojis.length) * Math.PI * 2) * radius,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      selected: false
    }))

    nodesRef.current = nodes

    const simulation = d3.forceSimulation(nodes)
      .force('charge', d3.forceManyBody().strength(5))
      .force('collision', d3.forceCollide().radius(35).strength(1))
      .force('center', d3.forceCenter(width / 2, height / 2).strength(0.05))
      .force('bound', () => {
        nodes.forEach(node => {
          const dx = node.x - width / 2
          const dy = node.y - height / 2
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance > radius) {
            const angle = Math.atan2(dy, dx)
            node.x = width / 2 + Math.cos(angle) * radius
            node.y = height / 2 + Math.sin(angle) * radius
            node.vx *= -0.8
            node.vy *= -0.8
          }
        })
      })
      .alphaDecay(0.01)
      .velocityDecay(0.2)

    simulationRef.current = simulation

    const g = svg.append('g')

    const circle = g.append('circle')
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .attr('r', radius)
      .attr('fill', 'none')
      .attr('stroke', 'rgba(139, 92, 246, 0.3)')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,5')

    const nodeElements = g.selectAll('.emoji-node')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'emoji-node')
      .style('cursor', 'pointer')
      .on('click', (event, d) => handleEmojiClick(d))

    nodeElements.append('circle')
      .attr('r', 30)
      .attr('fill', d => selected.includes(d.emoji) ? 'rgba(139, 92, 246, 0.4)' : 'rgba(255, 255, 255, 0.1)')
      .attr('stroke', d => selected.includes(d.emoji) ? '#a78bfa' : 'rgba(255, 255, 255, 0.3)')
      .attr('stroke-width', d => selected.includes(d.emoji) ? 3 : 1)

    nodeElements.append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('font-size', '28px')
      .text(d => d.emoji)

    simulation.on('tick', () => {
      nodeElements.attr('transform', d => `translate(${d.x},${d.y})`)
      
      nodeElements.select('circle')
        .attr('fill', d => selected.includes(d.emoji) ? 'rgba(139, 92, 246, 0.4)' : 'rgba(255, 255, 255, 0.1)')
        .attr('stroke', d => selected.includes(d.emoji) ? '#a78bfa' : 'rgba(255, 255, 255, 0.3)')
        .attr('stroke-width', d => selected.includes(d.emoji) ? 3 : 1)
    })

    return () => {
      simulation.stop()
    }
  }, [emojis, selected, showTriangle])

  const handleEmojiClick = (node) => {
    if (showTriangle) return

    setSelected(prev => {
      if (prev.includes(node.emoji)) {
        return prev.filter(e => e !== node.emoji)
      } else if (prev.length < 3) {
        const newSelection = [...prev, node.emoji]
        
        if (newSelection.length === 3) {
          const selectedNodes = nodesRef.current.filter(n => newSelection.includes(n.emoji))
          setTrianglePositions(selectedNodes.map(n => ({ x: n.x, y: n.y, emoji: n.emoji })))
          
          setTimeout(() => {
            setShowTriangle(true)
            if (simulationRef.current) {
              simulationRef.current.stop()
            }
            onSelectionComplete(newSelection)
          }, 300)
        }
        
        return newSelection
      }
      return prev
    })
  }

  return (
    <div className="relative flex items-center justify-center">
      <AnimatePresence>
        {!showTriangle && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
          >
            <svg
              ref={svgRef}
              width="600"
              height="600"
              viewBox="0 0 600 600"
              className="max-w-full"
            />
          </motion.div>
        )}

        {showTriangle && (
          <TriangleFormation positions={trianglePositions} />
        )}
      </AnimatePresence>

      {!showTriangle && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-0 text-center space-y-2"
        >
          <div className="text-slate-300">
            {selected.length === 0 && "Sélectionnez 3 émojis qui résonnent avec vous"}
            {selected.length === 1 && "Encore 2 émojis..."}
            {selected.length === 2 && "Encore 1 emoji..."}
            {selected.length === 3 && "Triangle en formation... ✨"}
          </div>
          <div className="flex gap-2 justify-center">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i < selected.length ? 'bg-purple-400' : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}

function TriangleFormation({ positions }) {
  const [showOrb, setShowOrb] = useState(false)

  useEffect(() => {
    setTimeout(() => setShowOrb(true), 1200)
  }, [])

  if (positions.length !== 3) return null

  const targetPositions = [
    { x: 300, y: 200 },
    { x: 220, y: 340 },
    { x: 380, y: 340 }
  ]

  const centerX = (targetPositions[0].x + targetPositions[1].x + targetPositions[2].x) / 3
  const centerY = (targetPositions[0].y + targetPositions[1].y + targetPositions[2].y) / 3

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative"
    >
      <svg width="600" height="600" viewBox="0 0 600 600" className="max-w-full">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity="1" />
            <stop offset="50%" stopColor="#60a5fa" stopOpacity="1" />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity="1" />
          </linearGradient>
          
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Remplissage semi-transparent du triangle */}
        <motion.polygon
          initial={{
            points: `${positions[0].x},${positions[0].y} ${positions[1].x},${positions[1].y} ${positions[2].x},${positions[2].y}`
          }}
          animate={{
            points: `${targetPositions[0].x},${targetPositions[0].y} ${targetPositions[1].x},${targetPositions[1].y} ${targetPositions[2].x},${targetPositions[2].y}`
          }}
          transition={{
            duration: 1,
            ease: "easeInOut"
          }}
          fill="url(#lineGradient)"
          fillOpacity="0.1"
        />

        {/* Les bulles emoji (rendues d'abord) */}
        {positions.map((pos, i) => (
          <motion.g
            key={i}
            initial={{ x: pos.x, y: pos.y }}
            animate={{ x: targetPositions[i].x, y: targetPositions[i].y }}
            transition={{
              duration: 1,
              ease: "easeInOut"
            }}
          >
            <circle
              r="35"
              fill="rgba(139, 92, 246, 0.3)"
              stroke="#a78bfa"
              strokeWidth="2"
              filter="url(#glow)"
            />
            <text
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="32"
            >
              {pos.emoji}
            </text>
          </motion.g>
        ))}

        {/* Les 3 côtés du triangle (rendus PAR-DESSUS les bulles) */}
        {[0, 1, 2].map((i) => {
          const j = (i + 1) % 3
          return (
            <motion.line
              key={`line-${i}`}
              initial={{
                x1: positions[i].x,
                y1: positions[i].y,
                x2: positions[i].x,
                y2: positions[i].y,
                opacity: 0
              }}
              animate={{
                x1: targetPositions[i].x,
                y1: targetPositions[i].y,
                x2: targetPositions[j].x,
                y2: targetPositions[j].y,
                opacity: 1
              }}
              transition={{
                duration: 1,
                ease: "easeInOut",
                delay: 0.8 + i * 0.15
              }}
              stroke="url(#lineGradient)"
              strokeWidth="4"
              filter="url(#glow)"
              strokeLinecap="round"
            />
          )
        })}

        {/* Orb au centre du triangle */}
        <AnimatePresence>
          {showOrb && (
            <motion.g
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <foreignObject
                x={centerX - 50}
                y={centerY - 50}
                width="100"
                height="100"
              >
                <HypnoticOrbCenter />
              </foreignObject>
            </motion.g>
          )}
        </AnimatePresence>
      </svg>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center space-y-3"
      >
        <div className="text-purple-300 font-medium">
          ✨ Votre triangle onirique est formé
        </div>
        <div className="text-slate-400 text-sm">
          L'esprit guide s'éveille...
        </div>
      </motion.div>
    </motion.div>
  )
}

function HypnoticOrbCenter() {
  return (
    <div className="relative w-24 h-24">
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400 via-blue-400 to-purple-500"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.6, 0.9, 0.6]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          filter: 'blur(8px)'
        }}
      />

      <motion.div
        className="absolute inset-2 rounded-full bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 180, 360]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          filter: 'blur(4px)'
        }}
      />

      <motion.div
        className="absolute inset-4 rounded-full bg-white"
        animate={{
          opacity: [0.8, 1, 0.8],
          scale: [0.9, 1, 0.9]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          boxShadow: '0 0 20px rgba(255, 255, 255, 0.8), inset 0 0 20px rgba(167, 139, 250, 0.6)'
        }}
      />

      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="text-2xl"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          🌟
        </motion.div>
      </div>

      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full border-2 border-purple-400/30"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.6, 0, 0.6]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeOut",
            delay: i * 0.6
          }}
        />
      ))}
    </div>
  )
}
