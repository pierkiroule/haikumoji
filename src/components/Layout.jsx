import { motion } from 'framer-motion'
import Navbar from './Navbar.jsx'
import Starfield from './Starfield.jsx'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-transparent relative">
      <Starfield />
      
      {/* Ambient gradient overlays */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-aurora-purple/10 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-aurora-blue/10 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
      </div>

      <div className="pb-16 lg:pb-0 lg:pt-16" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 4rem)' }}>
        <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-[500px] px-6" 
            style={{ 
              paddingLeft: 'max(1rem, env(safe-area-inset-left))', 
              paddingRight: 'max(1rem, env(safe-area-inset-right))' 
            }}
          >
            {children}
          </motion.div>
        </main>
      </div>
      
      <Navbar />
    </div>
  )
}
