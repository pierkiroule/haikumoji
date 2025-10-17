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
        
        {/* Grand O central animé avec lune croissante */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* Cercle extérieur */}
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
              opacity: 1
            }}
            transition={{ 
              pathLength: { duration: 2, ease: "easeOut" },
              opacity: { duration: 1 }
            }}
          />
          
          {/* Lune croissante à l'intérieur du O */}
          <motion.g
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.8 }}
          >
            {/* Corps de la lune (cercle plein) */}
            <circle
              cx="35"
              cy="50"
              r="18"
              fill="#E2E8F0"
              opacity="0.9"
            />
            {/* Ombre pour créer le croissant */}
            <motion.circle
              cx="42"
              cy="50"
              r="18"
              fill="#1E293B"
              animate={{
                cx: [42, 28, 42],
                opacity: [0.8, 0.6, 0.8]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            {/* Cratères */}
            <circle cx="30" cy="45" r="2" fill="#CBD5E1" opacity="0.4" />
            <circle cx="38" cy="52" r="1.5" fill="#CBD5E1" opacity="0.3" />
            <circle cx="33" cy="55" r="1" fill="#CBD5E1" opacity="0.35" />
          </motion.g>
        </motion.g>
        
        {/* Point médian • - mini étoile/lune */}
        <motion.g
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
          <circle
            cx="75"
            cy="35"
            r="4"
            fill="#8B5CF6"
          >
            <animate
              attributeName="opacity"
              values="1; 0.5; 1"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
          {/* Petit croissant de lune superposé */}
          <path
            d="M 76 33 A 3 3 0 1 1 76 37 A 2 2 0 1 0 76 33"
            fill="#A78BFA"
            opacity="0.6"
          />
        </motion.g>
        
        {/* Petit cercle ° - mini lune */}
        <motion.g
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
          <circle
            cx="95"
            cy="28"
            r="6"
            stroke="#06B6D4"
            strokeWidth="2"
            fill="none"
          >
            <animate
              attributeName="opacity"
              values="1; 0.6; 1"
              dur="3s"
              repeatCount="indefinite"
            />
          </circle>
          {/* Petite lune pleine à l'intérieur */}
          <circle
            cx="95"
            cy="28"
            r="4"
            fill="#67E8F9"
            opacity="0.4"
          >
            <animate
              attributeName="opacity"
              values="0.4; 0.7; 0.4"
              dur="3s"
              repeatCount="indefinite"
            />
          </circle>
        </motion.g>
        
        {/* Texte ONIMOJI */}
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
          Onimoji
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
