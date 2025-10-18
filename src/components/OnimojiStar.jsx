import { motion } from 'framer-motion'

export default function OnimojiStar({ participants = [], size = 200 }) {
  const participantCount = participants.length
  const allEmojis = participants.flatMap(p => p.triangle || [])
  
  if (participantCount < 2) {
    return null
  }

  if (participantCount >= 5) {
    return <CircleVisualization participants={participants} size={size} />
  }

  return <StarVisualization participants={participants} size={size} />
}

function StarVisualization({ participants, size }) {
  const participantCount = participants.length
  const radius = size / 2.5
  const center = size / 2

  const triangles = participants.map((participant, index) => {
    const rotation = (360 / participantCount) * index
    return {
      participant,
      rotation,
      points: calculateTrianglePoints(center, center, radius, rotation)
    }
  })

  const colors = [
    '#a78bfa',
    '#06b6d4', 
    '#10b981',
    '#f59e0b'
  ]

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        <defs>
          {triangles.map((tri, i) => (
            <linearGradient key={i} id={`gradient-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colors[i % colors.length]} stopOpacity="0.3" />
              <stop offset="100%" stopColor={colors[i % colors.length]} stopOpacity="0.6" />
            </linearGradient>
          ))}
        </defs>

        {triangles.map((tri, i) => (
          <motion.g
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.2, duration: 0.5 }}
          >
            <motion.polygon
              points={tri.points}
              fill={`url(#gradient-${i})`}
              stroke={colors[i % colors.length]}
              strokeWidth="2"
              animate={{
                scale: [1, 1.02, 1],
                rotate: [0, 1, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeInOut"
              }}
              style={{ transformOrigin: `${center}px ${center}px` }}
            />
          </motion.g>
        ))}

        {triangles.map((tri, triIndex) => {
          const points = parsePoints(tri.points)
          return points.map((point, pIndex) => (
            <motion.g
              key={`${triIndex}-${pIndex}`}
              animate={{
                y: [0, -5, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: (triIndex * 0.3) + (pIndex * 0.2),
                ease: "easeInOut"
              }}
            >
              <circle
                cx={point.x}
                cy={point.y}
                r="22"
                fill={colors[triIndex % colors.length]}
                fillOpacity="0.2"
                stroke={colors[triIndex % colors.length]}
                strokeWidth="2"
              />
              <text
                x={point.x}
                y={point.y}
                textAnchor="middle"
                dy="0.35em"
                fontSize="24"
              >
                {tri.participant.triangle[pIndex]}
              </text>
            </motion.g>
          ))
        })}

        <motion.circle
          cx={center}
          cy={center}
          r="8"
          fill="white"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </svg>
    </div>
  )
}

function CircleVisualization({ participants, size }) {
  const allEmojis = participants.flatMap(p => p.triangle || [])
  const center = size / 2
  const radius = size / 2.5
  const emojiCount = allEmojis.length

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="url(#circleGradient)"
          strokeWidth="3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        
        <defs>
          <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="33%" stopColor="#06b6d4" />
            <stop offset="66%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>

        {allEmojis.map((emoji, i) => {
          const angle = (360 / emojiCount) * i - 90
          const radian = (angle * Math.PI) / 180
          const x = center + radius * Math.cos(radian)
          const y = center + radius * Math.sin(radian)

          return (
            <motion.g
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <motion.circle
                cx={x}
                cy={y}
                r="22"
                fill={`hsl(${(360 / emojiCount) * i}, 70%, 50%)`}
                fillOpacity="0.2"
                stroke={`hsl(${(360 / emojiCount) * i}, 70%, 50%)`}
                strokeWidth="2"
                animate={{
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: "easeInOut"
                }}
              />
              <text
                x={x}
                y={y}
                textAnchor="middle"
                dy="0.35em"
                fontSize="24"
              >
                {emoji}
              </text>
            </motion.g>
          )
        })}

        <motion.circle
          cx={center}
          cy={center}
          r="10"
          fill="white"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 1, 0.3]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </svg>
    </div>
  )
}

function calculateTrianglePoints(cx, cy, radius, rotation) {
  const points = []
  for (let i = 0; i < 3; i++) {
    const angle = (rotation + (120 * i) - 90) * (Math.PI / 180)
    const x = cx + radius * Math.cos(angle)
    const y = cy + radius * Math.sin(angle)
    points.push(`${x},${y}`)
  }
  return points.join(' ')
}

function parsePoints(pointsStr) {
  return pointsStr.split(' ').map(p => {
    const [x, y] = p.split(',').map(Number)
    return { x, y }
  })
}
