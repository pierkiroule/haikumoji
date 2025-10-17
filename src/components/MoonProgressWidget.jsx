import { motion } from 'framer-motion'
import { useVoyageFlow } from '../utils/useVoyageFlow.js'
import { getCurrentVoyage } from '../utils/voyageConfig.js'
import { getLuneData } from '../utils/voyageLoader.js'

export default function MoonProgressWidget() {
  const { moonIndex, progress, phaseLabel, stepperSteps } = useVoyageFlow()
  const voyage = getCurrentVoyage()
  const luneData = getLuneData(voyage, moonIndex)
  
  const luneTitre = luneData?.gardien?.titre || `Lune ${moonIndex}`
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl glass-strong border border-white/20 p-6 mb-6 shadow-card"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-aurora-purple/20 to-aurora-blue/20 border border-white/10 mb-2">
            <span className="text-sm font-medium text-white">🌙 Lune {moonIndex}/12</span>
            <span className="text-xs text-slate-300">• {voyage?.metadata?.nom_court || 'Inuit'}</span>
          </div>
          <h3 className="text-xl font-bold text-white">{luneTitre}</h3>
        </div>
        <div className="text-3xl opacity-50">{luneData?.emoji || '🌙'}</div>
      </div>
      
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-300">Progression du voyage</span>
          <span className="text-sm font-semibold text-white">{progress}%</span>
        </div>
        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500"
          />
        </div>
      </div>
      
      <div className="mb-4">
        <p className="text-sm text-slate-300 mb-3">
          Prochaine étape : <span className="font-semibold text-white">{phaseLabel}</span>
        </p>
      </div>
      
      <div className="flex items-center gap-2">
        {stepperSteps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex items-center gap-2 flex-1">
              <div className={`
                flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-all duration-300
                ${step.completed 
                  ? 'bg-emerald-500 text-white' 
                  : step.current 
                    ? 'bg-gradient-to-r from-aurora-purple to-aurora-blue text-white ring-2 ring-white/30' 
                    : 'bg-white/10 text-slate-400'
                }
              `}>
                {step.completed ? '✓' : step.icon}
              </div>
              <span className={`text-xs font-medium transition-colors ${
                step.current ? 'text-white' : step.completed ? 'text-emerald-400' : 'text-slate-400'
              }`}>
                {step.label}
              </span>
            </div>
            {index < stepperSteps.length - 1 && (
              <div className={`h-0.5 w-full mx-2 transition-colors ${
                step.completed ? 'bg-emerald-500' : 'bg-white/10'
              }`} />
            )}
          </div>
        ))}
      </div>
    </motion.div>
  )
}
