import { useMemo } from 'react'

export default function OnimojiTriad({ emojis = [], size = 120, className = '' }) {
  const triad = Array.isArray(emojis) ? emojis.slice(0, 3) : []
  const positions = useMemo(() => {
    const r = size / 2 - Math.max(18, Math.round(size * 0.12))
    const cx = size / 2
    const cy = size / 2
    const angles = [270, 150, 30] // triangle vertices
    return angles.map(a => {
      const rad = (a * Math.PI) / 180
      return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
    })
  }, [size])

  const fontSize = Math.max(18, Math.round(size * 0.22))

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={className}>
      {/* triangle */}
      <polygon
        points={positions.map(p => `${p.x},${p.y}`).join(' ')}
        fill="none"
        stroke="#06b6d4"
        strokeWidth={Math.max(2, Math.round(size * 0.02))}
        strokeOpacity={0.5}
      />
      {/* nodes */}
      {positions.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={Math.max(10, Math.round(size * 0.06))} fill="#10b98120" stroke="#10b981" strokeWidth={1.5} />
          <text x={p.x} y={p.y + fontSize * 0.35} fontSize={fontSize} textAnchor="middle">
            {triad[i] || '○'}
          </text>
        </g>
      ))}
    </svg>
  )
}
