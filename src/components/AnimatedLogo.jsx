import { motion } from 'framer-motion'

export default function AnimatedLogo({ className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`flex items-center justify-center ${className}`}
    >
      <svg
        width="320"
        height="100"
        viewBox="0 0 320 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-md"
      >
        <defs>
          {/* Gradient pour le O */}
          <linearGradient id="gradientO" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6">
              <animate
                attributeName="stop-color"
                values="#8B5CF6; #06B6D4; #8B5CF6"
                dur="4s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="100%" stopColor="#06B6D4">
              <animate
                attributeName="stop-color"
                values="#06B6D4; #8B5CF6; #06B6D4"
                dur="4s"
                repeatCount="indefinite"
              />
            </stop>
          </linearGradient>
          
          {/* Gradient pour le texte */}
          <linearGradient id="gradientText" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F1F5F9" />
            <stop offset="50%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#CBD5E1" />
          </linearGradient>
          
          {/* Glow effect */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Grand O central animé */}
        <motion.circle
          cx="35"
          cy="50"
          r="28"
          stroke="url(#gradientO)"
          strokeWidth="4"
          fill="none"
          filter="url(#glow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ 
            pathLength: 1, 
            opacity: 1,
            rotate: [0, 360]
          }}
          transition={{ 
            pathLength: { duration: 2, ease: "easeOut" },
            opacity: { duration: 1 },
            rotate: { duration: 20, repeat: Infinity, ease: "linear" }
          }}
          style={{ originX: '35px', originY: '50px' }}
        />
        
        {/* Point médian • */}
        <motion.circle
          cx="75"
          cy="35"
          r="4"
          fill="#8B5CF6"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [0, 1.2, 1],
            opacity: [0, 1, 1]
          }}
          transition={{ 
            duration: 1,
            delay: 0.5,
            times: [0, 0.6, 1]
          }}
        >
          <animate
            attributeName="opacity"
            values="1; 0.5; 1"
            dur="2s"
            repeatCount="indefinite"
          />
        </motion.circle>
        
        {/* Petit cercle ° */}
        <motion.circle
          cx="95"
          cy="28"
          r="6"
          stroke="#06B6D4"
          strokeWidth="2"
          fill="none"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [0, 1.2, 1],
            opacity: [0, 1, 1]
          }}
          transition={{ 
            duration: 1,
            delay: 0.7,
            times: [0, 0.6, 1]
          }}
        >
          <animate
            attributeName="opacity"
            values="1; 0.6; 1"
            dur="3s"
            repeatCount="indefinite"
          />
        </motion.circle>
        
        {/* Texte ONIMOJIS */}
        <motion.text
          x="115"
          y="58"
          fontSize="42"
          fontWeight="700"
          fill="url(#gradientText)"
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          nimojis
        </motion.text>
        
        {/* Particules flottantes autour du O */}
        <motion.circle
          cx="20"
          cy="30"
          r="2"
          fill="#8B5CF6"
          opacity="0.6"
          animate={{
            y: [0, -10, 0],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.circle
          cx="50"
          cy="25"
          r="1.5"
          fill="#06B6D4"
          opacity="0.5"
          animate={{
            y: [0, -8, 0],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        />
        
        <motion.circle
          cx="15"
          cy="65"
          r="1.5"
          fill="#EC4899"
          opacity="0.5"
          animate={{
            y: [0, 10, 0],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        
        <motion.circle
          cx="55"
          cy="70"
          r="2"
          fill="#10B981"
          opacity="0.4"
          animate={{
            y: [0, 8, 0],
            opacity: [0.4, 0.9, 0.4]
          }}
          transition={{
            duration: 3.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5
          }}
        />
      </svg>
    </motion.div>
  )
}
