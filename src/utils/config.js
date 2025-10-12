export const APP_NAME = 'HaïkuMoji'

export const STORAGE_KEYS = {
  HAIKUS: 'haikumoji_haikus',
  USER: 'haikumoji_user',
  INSPIRATION_COUNT: 'haikumoji_inspiration_count',
  LIKED_IDS: 'haikumoji_liked_ids',
}

export const THEME_OF_WEEK = {
  title: 'Sous la lune bleue',
  emojis: ['🌬️', '❄️', '🐋'],
  description: 'Vent, glace et baleine sous la lune. Cap au poème !',
}

export const SUBSCRIPTION_PLANS = [
  { id: 'monthly', label: '1€/mois', price: 1, interval: 'month' },
  { id: 'yearly', label: '10€/an', price: 10, interval: 'year' },
]

export const MAX_AI_SUGGESTIONS = 5
export const APP_URL = 'https://haikumoji.vercel.app'
