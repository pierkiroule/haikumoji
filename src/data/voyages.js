// Structure des voyages oniriques culturels disponibles

export const VOYAGES = [
  {
    id: 'inuit',
    name: 'Voyage Inuit',
    subtitle: 'Odyssée glaciale des rêves arctiques',
    description: 'Partez à la découverte des traditions oniriques inuites, guidé par 12 gardiens ancestraux à travers les aurores boréales.',
    status: 'available',
    color: 'cyan',
    gradient: 'from-cyan-500 to-blue-600',
    icon: '❄️',
    backgroundEmoji: '🌌',
    region: 'Arctique',
    stepsCount: 12,
    theme: {
      primary: '#06b6d4',
      secondary: '#3b82f6',
      accent: '#0ea5e9'
    }
  },
  {
    id: 'berbere',
    name: 'Voyage Berbère',
    subtitle: 'Traversée des dunes et des songes sahariens',
    description: 'Explorez les sagesses oniriques berbères à travers le désert, les oasis et les étoiles du Sahara.',
    status: 'coming_soon',
    color: 'amber',
    gradient: 'from-amber-500 to-orange-600',
    icon: '🌅',
    backgroundEmoji: '🏜️',
    region: 'Afrique du Nord',
    stepsCount: 12,
    theme: {
      primary: '#f59e0b',
      secondary: '#ea580c',
      accent: '#f97316'
    }
  },
  {
    id: 'celtique',
    name: 'Voyage Celtique',
    subtitle: 'Périple mystique dans les brumes druidiques',
    description: 'Découvrez les rituels oniriques celtes parmi les menhirs, les forêts anciennes et les légendes arthuriennes.',
    status: 'coming_soon',
    color: 'emerald',
    gradient: 'from-emerald-500 to-green-700',
    icon: '🍀',
    backgroundEmoji: '🌿',
    region: 'Europe de l\'Ouest',
    stepsCount: 12,
    theme: {
      primary: '#10b981',
      secondary: '#059669',
      accent: '#14b8a6'
    }
  }
]

export function getVoyageById(id) {
  return VOYAGES.find(v => v.id === id)
}

export function getAvailableVoyages() {
  return VOYAGES.filter(v => v.status === 'available')
}

export function getComingSoonVoyages() {
  return VOYAGES.filter(v => v.status === 'coming_soon')
}
