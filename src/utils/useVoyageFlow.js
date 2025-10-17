import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUser, getMoonIndex, getSelectedTriplet } from './storage.js'

export function useVoyageFlow() {
  const [currentPhase, setCurrentPhase] = useState('loading')
  const [nextStep, setNextStep] = useState('/')
  const [moonIndex, setMoonIndex] = useState(1)
  const [progress, setProgress] = useState(0)
  
  useEffect(() => {
    const user = getUser()
    const moon = getMoonIndex()
    const triplet = getSelectedTriplet()
    
    setMoonIndex(moon)
    
    if (!user) {
      setCurrentPhase('non_inscrit')
      setNextStep('/voyage/inuit')
      setProgress(0)
      return
    }
    
    if (!triplet || triplet.length < 3) {
      setCurrentPhase('selection_emojis')
      setNextStep('/navette')
      setProgress(Math.round((moon - 1) / 12 * 100))
      return
    }
    
    const hasCreatedHypnoniris = localStorage.getItem(`hypnoniris_moon_${moon}`)
    if (!hasCreatedHypnoniris) {
      setCurrentPhase('creation_hypnoniris')
      setNextStep('/lune')
      setProgress(Math.round(((moon - 1) + 0.33) / 12 * 100))
      return
    }
    
    const hasMetGuardian = localStorage.getItem(`guardian_met_moon_${moon}`)
    if (!hasMetGuardian) {
      setCurrentPhase('rencontre_gardien')
      setNextStep('/guardian')
      setProgress(Math.round(((moon - 1) + 0.66) / 12 * 100))
      return
    }
    
    setCurrentPhase('lune_complete')
    setNextStep('/dreamgarden')
    setProgress(Math.round(moon / 12 * 100))
  }, [])
  
  const getPhaseLabel = () => {
    switch (currentPhase) {
      case 'non_inscrit':
        return "S'inscrire au voyage"
      case 'selection_emojis':
        return 'Choisir 3 émojis'
      case 'creation_hypnoniris':
        return 'Créer votre hypnoniris'
      case 'rencontre_gardien':
        return 'Rencontrer le gardien'
      case 'lune_complete':
        return 'Lune complète !'
      default:
        return 'Chargement...'
    }
  }
  
  const getStepperSteps = () => {
    return [
      {
        id: 'emojis',
        label: '3 émojis',
        icon: '✨',
        completed: currentPhase !== 'selection_emojis' && currentPhase !== 'non_inscrit',
        current: currentPhase === 'selection_emojis'
      },
      {
        id: 'hypnoniris',
        label: 'Hypnoniris',
        icon: '🌙',
        completed: currentPhase === 'rencontre_gardien' || currentPhase === 'lune_complete',
        current: currentPhase === 'creation_hypnoniris'
      },
      {
        id: 'gardien',
        label: 'Gardien',
        icon: '✧',
        completed: currentPhase === 'lune_complete',
        current: currentPhase === 'rencontre_gardien'
      }
    ]
  }
  
  return {
    currentPhase,
    nextStep,
    moonIndex,
    progress,
    phaseLabel: getPhaseLabel(),
    stepperSteps: getStepperSteps()
  }
}

export function navigateToNextStep(navigate) {
  const user = getUser()
  const moon = getMoonIndex()
  const triplet = getSelectedTriplet()
  
  if (!user) {
    navigate('/voyage/inuit')
    return
  }
  
  if (!triplet || triplet.length < 3) {
    navigate('/navette')
    return
  }
  
  const hasCreatedHypnoniris = localStorage.getItem(`hypnoniris_moon_${moon}`)
  if (!hasCreatedHypnoniris) {
    navigate('/lune')
    return
  }
  
  const hasMetGuardian = localStorage.getItem(`guardian_met_moon_${moon}`)
  if (!hasMetGuardian) {
    navigate('/guardian')
    return
  }
  
  navigate('/dreamgarden')
}
