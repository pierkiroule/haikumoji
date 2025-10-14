/**
 * Cosmoji Loader - Chargement des émojis depuis JSON
 * Permet de gérer facilement la liste des émojis disponibles
 */

import emojiData from '../data/cosmoji/emojis.json'

/**
 * Récupère tous les émojis (format simple array)
 * @returns {Array<string>} - Liste des émojis
 */
export function getAllEmojis() {
  const emojis = []
  const categories = emojiData.categories
  
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
  const categories = emojiData.categories
  
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
  const category = emojiData.categories[categoryId]
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
  return emojiData.elements[element] || null
}

/**
 * Récupère toutes les catégories
 * @returns {Object} - Map des catégories
 */
export function getAllCategories() {
  return emojiData.categories
}

/**
 * Récupère tous les éléments
 * @returns {Object} - Map des éléments avec leurs infos
 */
export function getAllElements() {
  return emojiData.elements
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
