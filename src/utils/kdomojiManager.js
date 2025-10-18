import kdomojisData from '../data/kdomojis.json'
import { STORAGE_KEYS } from './config.js'

// Storage key pour les kdomojis reçus
const KDOMOJIS_RECEIVED_KEY = 'onimoji_kdomojis_received'
const KDOMOJI_STATS_KEY = 'onimoji_kdomoji_stats'

/**
 * Récupère tous les kdomojis reçus par l'utilisateur
 */
export function getReceivedKdomojis() {
  try {
    const raw = localStorage.getItem(KDOMOJIS_RECEIVED_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

/**
 * Marque un kdomoji comme reçu
 */
export function markKdomojiAsReceived(kdomojiId) {
  const received = getReceivedKdomojis()
  if (!received.find(k => k.id === kdomojiId)) {
    const kdomoji = kdomojisData.find(k => k.id === kdomojiId)
    if (kdomoji) {
      received.push({
        id: kdomojiId,
        receivedAt: Date.now(),
        viewed: false,
      })
      localStorage.setItem(KDOMOJIS_RECEIVED_KEY, JSON.stringify(received))
    }
  }
}

/**
 * Marque un kdomoji comme vu
 */
export function markKdomojiAsViewed(kdomojiId) {
  const received = getReceivedKdomojis()
  const kdomoji = received.find(k => k.id === kdomojiId)
  if (kdomoji) {
    kdomoji.viewed = true
    kdomoji.viewedAt = Date.now()
    localStorage.setItem(KDOMOJIS_RECEIVED_KEY, JSON.stringify(received))
  }
}

/**
 * Récupère les statistiques utilisateur pour les triggers
 */
export function getKdomojiStats() {
  try {
    const raw = localStorage.getItem(KDOMOJI_STATS_KEY)
    return raw ? JSON.parse(raw) : {
      trianglesCueilli: 0,
      starsContributed: 0,
      ritualSessions: 0,
      consecutiveDays: 0,
      lastRitualDate: null,
      spiritsMet: 0,
      quizzesCompleted: 0,
      starsCreated: 0,
    }
  } catch {
    return {
      trianglesCueilli: 0,
      starsContributed: 0,
      ritualSessions: 0,
      consecutiveDays: 0,
      lastRitualDate: null,
      spiritsMet: 0,
      quizzesCompleted: 0,
      starsCreated: 0,
    }
  }
}

/**
 * Met à jour une statistique
 */
export function updateKdomojiStat(statName, value) {
  const stats = getKdomojiStats()
  stats[statName] = value
  localStorage.setItem(KDOMOJI_STATS_KEY, JSON.stringify(stats))
  
  // Vérifier si un nouveau kdomoji doit être déclenché
  return checkForNewKdomojis(stats)
}

/**
 * Incrémente une statistique
 */
export function incrementKdomojiStat(statName) {
  const stats = getKdomojiStats()
  stats[statName] = (stats[statName] || 0) + 1
  
  // Gestion spéciale pour les jours consécutifs
  if (statName === 'ritualSessions') {
    const today = new Date().toISOString().split('T')[0]
    const lastDate = stats.lastRitualDate
    
    if (lastDate) {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toISOString().split('T')[0]
      
      if (lastDate === yesterdayStr) {
        stats.consecutiveDays = (stats.consecutiveDays || 0) + 1
      } else if (lastDate !== today) {
        stats.consecutiveDays = 1
      }
    } else {
      stats.consecutiveDays = 1
    }
    
    stats.lastRitualDate = today
  }
  
  localStorage.setItem(KDOMOJI_STATS_KEY, JSON.stringify(stats))
  
  // Vérifier si un nouveau kdomoji doit être déclenché
  return checkForNewKdomojis(stats)
}

/**
 * Vérifie si de nouveaux kdomojis doivent être déclenchés
 * Retourne un tableau de kdomojis à afficher
 */
export function checkForNewKdomojis(stats) {
  const received = getReceivedKdomojis()
  const receivedIds = received.map(k => k.id)
  const newKdomojis = []
  
  for (const kdomoji of kdomojisData) {
    // Skip si déjà reçu
    if (receivedIds.includes(kdomoji.id)) continue
    
    // Vérifier les conditions de trigger
    let shouldTrigger = false
    
    switch (kdomoji.trigger) {
      case 'first_triangle':
        shouldTrigger = stats.trianglesCueilli === 1
        break
      case 'first_star_contribution':
        shouldTrigger = stats.starsContributed === 1
        break
      case 'three_ritual_sessions':
        shouldTrigger = stats.ritualSessions === 3
        break
      case 'five_stars_created':
        shouldTrigger = stats.starsCreated === 5
        break
      case 'first_quiz_completed':
        shouldTrigger = stats.quizzesCompleted === 1
        break
      case 'star_contribution':
        shouldTrigger = stats.starsContributed > 0 && stats.starsContributed % 3 === 0
        break
      case 'seven_day_streak':
        shouldTrigger = stats.consecutiveDays === 7
        break
      case 'five_spirits_met':
        shouldTrigger = stats.spiritsMet === 5
        break
      default:
        shouldTrigger = false
    }
    
    if (shouldTrigger) {
      newKdomojis.push(kdomoji)
      markKdomojiAsReceived(kdomoji.id)
    }
  }
  
  return newKdomojis
}

/**
 * Récupère tous les kdomojis disponibles
 */
export function getAllKdomojis() {
  return kdomojisData
}

/**
 * Récupère un kdomoji par son ID
 */
export function getKdomojiById(id) {
  return kdomojisData.find(k => k.id === id)
}

/**
 * Récupère les kdomojis non vus
 */
export function getUnviewedKdomojis() {
  const received = getReceivedKdomojis()
  return received
    .filter(k => !k.viewed)
    .map(k => ({
      ...getKdomojiById(k.id),
      receivedAt: k.receivedAt,
    }))
    .filter(k => k.id) // Filter out any null results
}
