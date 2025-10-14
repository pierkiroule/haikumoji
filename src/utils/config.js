export const APP_NAME = 'Onimoji'

export const STORAGE_KEYS = {
  HAIKUS: 'haikumoji_haikus',
  USER: 'haikumoji_user',
  INSPIRATION_COUNT: 'haikumoji_inspiration_count',
  LIKED_IDS: 'haikumoji_liked_ids',
  DRAFT: 'haikumoji_draft',
  DREAMS: 'haikumoji_dreams',
  MOON_INDEX: 'haikumoji_moon_index',
  SELECTED_TRIPLET: 'haikumoji_selected_triplet',
  STAR_SEEDS: 'haikumoji_star_seeds',
  COSMOJI_COUNTS: 'haikumoji_cosmoji_counts',
  CURRENT_VOYAGE: 'haikumoji_current_voyage',
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

// Emoji catalog now loaded from JSON file
// Import with: import { getAllEmojis } from './cosmojiLoader.js'
// Kept for backward compatibility but deprecated
export const ALL_EMOJIS = [
  '🌬️','❄️','🐋','🌊','🔥','🌙','🛶','🌌','🧊','🌈','🐚','🪶','🌞','💧','🌿','🍂','🌑','☁️','🦭','🪵','🌕','🌠','🌧️','🎵','🐦','🪞','🪷','💫','⭐','🏔️'
]

// Prefer canonical URL in production; fall back to current origin in dev
export function getShareUrlBase() {
  // In dev, prefer current origin; in prod, use canonical APP_URL
  try {
    const isProd = Boolean(import.meta?.env?.PROD || import.meta?.env?.MODE === 'production')
    if (!isProd && typeof window !== 'undefined' && window.location) {
      return window.location.origin
    }
  } catch {
    // ignore
  }
  return APP_URL
}
