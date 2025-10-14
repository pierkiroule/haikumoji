import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

/**
 * StepGuide - Guide pas à pas pour le parcours utilisateur
 * Affiche les étapes avec indicateurs visuels et explications
 */
export default function StepGuide({ 
  currentStep = 1, 
  steps = [],
  onStepClick,
  className = '' 
}) {
  const [expandedStep, setExpandedStep] = useState(currentStep)

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Barre de progression */}
      <div className="relative">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const stepNumber = index + 1
            const isCompleted = stepNumber < currentStep
            const isCurrent = stepNumber === currentStep
            const isDisabled = stepNumber > currentStep

            return (
              <div key={step.id} className="flex-1 relative">
                {/* Ligne de connexion */}
                {index > 0 && (
                  <div className="absolute left-0 top-5 right-1/2 h-0.5 -translate-x-full">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        isCompleted || isCurrent 
                          ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' 
                          : 'bg-slate-200'
                      }`}
                    />
                  </div>
                )}

                {/* Indicateur de l'étape */}
                <motion.button
                  onClick={() => {
                    setExpandedStep(stepNumber)
                    onStepClick?.(stepNumber)
                  }}
                  disabled={isDisabled}
                  className={`relative z-10 flex flex-col items-center gap-2 w-full group ${
                    isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'
                  }`}
                  whileHover={!isDisabled ? { scale: 1.05 } : {}}
                  whileTap={!isDisabled ? { scale: 0.98 } : {}}
                >
                  {/* Cercle numéroté */}
                  <motion.div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-lg transition-all duration-300 ${
                      isCompleted 
                        ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white' 
                        : isCurrent 
                        ? 'bg-gradient-to-br from-cyan-500 to-blue-500 text-white ring-4 ring-cyan-200' 
                        : 'bg-slate-200 text-slate-400'
                    }`}
                    animate={isCurrent ? {
                      boxShadow: [
                        '0 4px 6px rgba(6, 182, 212, 0.3)',
                        '0 8px 16px rgba(6, 182, 212, 0.5)',
                        '0 4px 6px rgba(6, 182, 212, 0.3)',
                      ]
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {isCompleted ? '✓' : stepNumber}
                  </motion.div>

                  {/* Icône de l'étape */}
                  <div className={`text-2xl transition-transform duration-300 ${
                    isCurrent ? 'scale-110' : ''
                  }`}>
                    {step.icon}
                  </div>

                  {/* Titre de l'étape */}
                  <div className={`text-xs font-medium text-center transition-colors duration-300 ${
                    isCompleted || isCurrent ? 'text-slate-900' : 'text-slate-400'
                  }`}>
                    {step.title}
                  </div>
                </motion.button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Détails de l'étape courante */}
      <AnimatePresence mode="wait">
        <motion.div
          key={expandedStep}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="rounded-2xl bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-200 p-6 shadow-lg"
        >
          {steps[expandedStep - 1] && (
            <>
              <div className="flex items-center gap-3 mb-3">
                <div className="text-3xl">{steps[expandedStep - 1].icon}</div>
                <div>
                  <div className="text-sm text-cyan-600 font-medium">
                    Étape {expandedStep}/{steps.length}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {steps[expandedStep - 1].title}
                  </h3>
                </div>
              </div>
              
              <p className="text-slate-700 leading-relaxed mb-4">
                {steps[expandedStep - 1].description}
              </p>

              {steps[expandedStep - 1].tips && (
                <div className="rounded-xl bg-white/60 border border-cyan-200 p-4">
                  <div className="text-sm font-medium text-cyan-700 mb-2">
                    💡 Astuce
                  </div>
                  <p className="text-sm text-slate-600">
                    {steps[expandedStep - 1].tips}
                  </p>
                </div>
              )}
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
