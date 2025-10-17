/**
 * Cosmoji Loader - Chargement des émojis et graphes depuis JSON
 * Permet d'adapter la liste d'émojis par mission (voyage) avec fallback global.
 */

import globalEmojis from '../data/cosmoji/emojis.json'
import globalGraph from '../data/cosmojiData.json'
import { getCurrentVoyage } from './voyageConfig.js'

// Découverte optionnelle des jeux d'émojis et graphes par mission
const MISSION_EMOJI_MODULES = import.meta.glob('../data/voyages/**/emojis.json', { eager: true })
const MISSION_GRAPH_MODULES = import.meta.glob('../data/voyages/**/cosmojiData.json', { eager: true })

function resolveMissionModule(modulesMap, filename) {
  try {
    const voyageId = getCurrentVoyage()
    const target = Object.keys(modulesMap).find(p => p.endsWith(`/voyages/${voyageId}/${filename}`))
    const mod = target ? modulesMap[target] : null
    return (mod && mod.default) || mod || null
  } catch {
    return null
  }
}

function getEmojiDataset() {
  return resolveMissionModule(MISSION_EMOJI_MODULES, 'emojis.json') || globalEmojis
}

export function getCosmojiGraph() {
  return resolveMissionModule(MISSION_GRAPH_MODULES, 'cosmojiData.json') || globalGraph
}

/**
 * Récupère tous les émojis (format simple array)
 * @returns {Array<string>} - Liste des émojis
 */
export function getAllEmojis() {
  const emojis = []
  const dataset = getEmojiDataset()
  const categories = dataset.categories
  
  for (const categoryKey in categories) {
    const category = categories[categoryKey]
    if (category.emojis) {
      category.emojis.forEach(item => {
        emojis.push(item.emoji)
      })
    }
  }
  
  return emojis
}

/**
 * Récupère tous les émojis avec leurs métadonnées
 * @returns {Array<Object>} - Liste des émojis avec name, element, keywords
 */
export function getAllEmojisWithMetadata() {
  const emojis = []
  const dataset = getEmojiDataset()
  const categories = dataset.categories
  
  for (const categoryKey in categories) {
    const category = categories[categoryKey]
    if (category.emojis) {
      category.emojis.forEach(item => {
        emojis.push({
          emoji: item.emoji,
          name: item.name,
          element: item.element,
          keywords: item.keywords,
          category: categoryKey,
          categoryLabel: category.label
        })
      })
    }
  }
  
  return emojis
}

/**
 * Récupère les émojis par catégorie
 * @param {string} categoryId - ID de la catégorie
 * @returns {Array<Object>} - Émojis de cette catégorie
 */
export function getEmojisByCategory(categoryId) {
  const dataset = getEmojiDataset()
  const category = dataset.categories[categoryId]
  return category?.emojis || []
}

/**
 * Récupère les émojis par élément
 * @param {string} element - air, water, fire, earth, ice, aurora, light, animal
 * @returns {Array<Object>} - Émojis de cet élément
 */
export function getEmojisByElement(element) {
  const allEmojis = getAllEmojisWithMetadata()
  return allEmojis.filter(e => e.element === element)
}

/**
 * Récupère les informations d'un élément
 * @param {string} element - ID de l'élément
 * @returns {Object|null} - Infos de l'élément (label, color, description)
 */
export function getElementInfo(element) {
  const dataset = getEmojiDataset()
  return dataset.elements[element] || null
}

/**
 * Récupère toutes les catégories
 * @returns {Object} - Map des catégories
 */
export function getAllCategories() {
  const dataset = getEmojiDataset()
  return dataset.categories
}

/**
 * Récupère tous les éléments
 * @returns {Object} - Map des éléments avec leurs infos
 */
export function getAllElements() {
  const dataset = getEmojiDataset()
  return dataset.elements
}

/**
 * Recherche un emoji par nom ou mot-clé
 * @param {string} query - Terme de recherche
 * @returns {Array<Object>} - Émojis correspondants
 */
export function searchEmojis(query) {
  const allEmojis = getAllEmojisWithMetadata()
  const lowerQuery = query.toLowerCase()
  
  return allEmojis.filter(e => {
    return (
      e.name.toLowerCase().includes(lowerQuery) ||
      e.keywords.some(k => k.toLowerCase().includes(lowerQuery)) ||
      e.element.toLowerCase().includes(lowerQuery)
    )
  })
}

/**
 * Récupère les métadonnées d'un emoji spécifique
 * @param {string} emoji - Le caractère emoji
 * @returns {Object|null} - Métadonnées ou null
 */
export function getEmojiMetadata(emoji) {
  const allEmojis = getAllEmojisWithMetadata()
  return allEmojis.find(e => e.emoji === emoji) || null
}
