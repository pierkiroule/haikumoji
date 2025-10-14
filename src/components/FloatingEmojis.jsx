import { motion, useReducedMotion } from 'framer-motion'

export default function FloatingEmojis({
  emojis = ['✨','🌸','🌙','🍃','💫'],
}) {
  const prefersReduced = useReducedMotion()
  
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {emojis.map((e, i) => {
        const positions = [
          { left: '8%', top: '15%' },
          { left: '85%', top: '25%' },
          { left: '15%', top: '65%' },
          { left: '75%', top: '70%' },
          { left: '50%', top: '45%' },
        ]
        
        return (
          <motion.span
            key={i}
            initial={prefersReduced ? { opacity: 0.25 } : { opacity: 0, scale: 0 }}
            animate={prefersReduced 
              ? { opacity: 0.25 } 
              : { 
                  opacity: [0.2, 0.6, 0.2],
                  y: [0, -30, 0],
                  scale: [0.8, 1.1, 0.8],
                  rotate: [0, 5, -5, 0]
                }
            }
            transition={prefersReduced 
              ? { duration: 0 } 
              : { 
                  duration: 6 + i * 0.5, 
                  repeat: Infinity, 
                  ease: 'easeInOut',
                  delay: i * 0.5
                }
            }
            className="absolute text-4xl filter drop-shadow-lg"
            style={positions[i] || { left: `${10 + i * 18}%`, top: `${20 + (i % 3) * 25}%` }}
          >
            {e}
          </motion.span>
        )
      })}
    </div>
  )
}
