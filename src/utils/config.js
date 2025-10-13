export const APP_NAME = 'HaïkuMoji'

export const STORAGE_KEYS = {
  HAIKUS: 'haikumoji_haikus',
  USER: 'haikumoji_user',
  INSPIRATION_COUNT: 'haikumoji_inspiration_count',
  LIKED_IDS: 'haikumoji_liked_ids',
  DRAFT: 'haikumoji_draft',
}

export const THEME_OF_WEEK = {
  title: 'Inuit Dream',
  emojis: ['❄️', '🌌', '🐋'],
  description: 'Glace, aurore et baleine. Cap au rêve inuit !',
}

export const SUBSCRIPTION_PLANS = [
  { id: 'monthly', label: '1€/mois', price: 1, interval: 'month' },
  { id: 'yearly', label: '10€/an', price: 10, interval: 'year' },
]

export const MAX_AI_SUGGESTIONS = 5
export const APP_URL = 'https://haikumoji.vercel.app'

// Centralized emoji catalog (deduplicated)
export const ALL_EMOJIS = [
  '🌬️','❄️','🐋','🌊','🔥','🌙','🛶','🌌','🧊','🌈','🐚','🪶','🌞','💧','🌿','🍂','🌑','☁️','🦭','🪵','🌕','🌠','🌧️','🎵','🐦','🪞','🪷','💫'
]

// Prefer canonical URL in production; fall back to current origin in dev
export function getShareUrlBase() {
  try {
    const isProd = typeof import !== 'undefined' && import.meta && import.meta.env && import.meta.env.MODE === 'production'
    if (isProd) return APP_URL
    if (typeof window !== 'undefined' && window.location) return window.location.origin
  } catch {
    // ignore
  }
  return APP_URL
}
