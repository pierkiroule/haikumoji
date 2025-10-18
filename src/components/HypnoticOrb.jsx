import { motion } from 'framer-motion'

export default function HypnoticOrb({ triangle = [] }) {
  return (
    <div className="relative w-48 h-48 mx-auto">
      {/* Orb central hypnotique */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(139,92,246,0.8) 0%, rgba(6,182,212,0.6) 50%, rgba(16,185,129,0.4) 100%)',
          boxShadow: '0 0 80px rgba(139,92,246,0.6), 0 0 120px rgba(6,182,212,0.4)',
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Cercles concentriques pulsants */}
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full border-2 border-purple-400/30"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{
            scale: [0.5, 1.8],
            opacity: [0.6, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.75,
            ease: "easeOut"
          }}
        />
      ))}

      {/* Triangle d'emojis autour de l'orb */}
      {triangle.length === 3 && (
        <>
          {triangle.map((emoji, index) => {
            const angle = (index * 120 - 90) * (Math.PI / 180)
            const radius = 90
            const x = Math.cos(angle) * radius
            const y = Math.sin(angle) * radius
            
            return (
              <motion.div
                key={index}
                className="absolute text-4xl"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: index * 0.3,
                  ease: "easeInOut"
                }}
              >
                {emoji}
              </motion.div>
            )
          })}
        </>
      )}

      {/* Particules flottantes */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-cyan-300"
          style={{
            left: '50%',
            top: '50%',
          }}
          animate={{
            x: [0, Math.cos(i * 45 * Math.PI / 180) * 100],
            y: [0, Math.sin(i * 45 * Math.PI / 180) * 100],
            opacity: [1, 0],
            scale: [1, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.25,
            ease: "easeOut"
          }}
        />
      ))}
    </div>
  )
}
