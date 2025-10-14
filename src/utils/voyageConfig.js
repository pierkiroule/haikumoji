/**
 * Voyage Config Loader - Chargement des configurations de voyage
 * Permet de gérer les métadonnées et paramètres de chaque voyage
 */

import voyageInuitConfig from '../data/voyages/inuit/voyage.config.json'
// Import d'autres voyages quand disponibles
// import voyageBerbereConfig from '../data/voyages/berbere/voyage.config.json'
// import voyageDruidiqueConfig from '../data/voyages/druidique/voyage.config.json'

/**
 * Map des configurations de voyage
 */
const VOYAGE_CONFIGS = {
  inuit: voyageInuitConfig,
  // berbere: voyageBerbereConfig,
  // druidique: voyageDruidiqueConfig,
}

/**
 * Récupère la configuration d'un voyage
 * @param {string} voyageId - ID du voyage ('inuit', 'berbere', 'druidique')
 * @returns {Object|null} - Configuration du voyage
 */
export function getVoyageConfig(voyageId = 'inuit') {
  return VOYAGE_CONFIGS[voyageId] || null
}

/**
 * Récupère les métadonnées d'un voyage
 * @param {string} voyageId - ID du voyage
 * @returns {Object|null} - Métadonnées (nom, description, emoji, etc.)
 */
export function getVoyageMetadata(voyageId = 'inuit') {
  const config = getVoyageConfig(voyageId)
  return config?.metadata || null
}

/**
 * Récupère le thème visuel d'un voyage
 * @param {string} voyageId - ID du voyage
 * @returns {Object|null} - Thème (couleurs, gradient, ambiance)
 */
export function getVoyageTheme(voyageId = 'inuit') {
  const config = getVoyageConfig(voyageId)
  return config?.theme || null
}

/**
 * Récupère la structure d'un voyage
 * @param {string} voyageId - ID du voyage
 * @returns {Object|null} - Structure (nombre de lunes, durées)
 */
export function getVoyageStructure(voyageId = 'inuit') {
  const config = getVoyageConfig(voyageId)
  return config?.structure || null
}

/**
 * Récupère les étapes de navigation d'un voyage
 * @param {string} voyageId - ID du voyage
 * @returns {Array} - Liste des étapes
 */
export function getVoyageNavigationSteps(voyageId = 'inuit') {
  const config = getVoyageConfig(voyageId)
  return config?.navigation?.etapes || []
}

/**
 * Récupère la liste des lunes d'un voyage
 * @param {string} voyageId - ID du voyage
 * @returns {Object} - Map des lunes
 */
export function getVoyageLunes(voyageId = 'inuit') {
  const config = getVoyageConfig(voyageId)
  return config?.lunes || {}
}

/**
 * Récupère les infos d'une lune spécifique
 * @param {string} voyageId - ID du voyage
 * @param {number} luneNumber - Numéro de la lune
 * @returns {Object|null} - Infos de la lune (titre, emoji, element, disponible)
 */
export function getLuneInfo(voyageId = 'inuit', luneNumber) {
  const lunes = getVoyageLunes(voyageId)
  return lunes[String(luneNumber)] || null
}

/**
 * Vérifie si une lune est disponible
 * @param {string} voyageId - ID du voyage
 * @param {number} luneNumber - Numéro de la lune
 * @returns {boolean}
 */
export function isLuneAvailable(voyageId = 'inuit', luneNumber) {
  const luneInfo = getLuneInfo(voyageId, luneNumber)
  return luneInfo?.disponible === true
}

/**
 * Récupère toutes les lunes disponibles d'un voyage
 * @param {string} voyageId - ID du voyage
 * @returns {Array<Object>} - Lunes disponibles avec leurs numéros
 */
export function getAvailableLunes(voyageId = 'inuit') {
  const lunes = getVoyageLunes(voyageId)
  const available = []
  
  for (const [number, info] of Object.entries(lunes)) {
    if (info.disponible) {
      available.push({
        number: parseInt(number),
        ...info
      })
    }
  }
  
  return available.sort((a, b) => a.number - b.number)
}

/**
 * Récupère les options d'un voyage
 * @param {string} voyageId - ID du voyage
 * @returns {Object} - Options (saut de lunes, régénération, etc.)
 */
export function getVoyageOptions(voyageId = 'inuit') {
  const config = getVoyageConfig(voyageId)
  return config?.options || {}
}

/**
 * Récupère les ressources culturelles d'un voyage
 * @param {string} voyageId - ID du voyage
 * @returns {Object} - Ressources (liens, crédits)
 */
export function getVoyageRessources(voyageId = 'inuit') {
  const config = getVoyageConfig(voyageId)
  return config?.ressources || {}
}

/**
 * Récupère la liste de tous les voyages disponibles
 * @returns {Array<Object>} - Liste des voyages avec leurs métadonnées
 */
export function getAllVoyages() {
  return Object.entries(VOYAGE_CONFIGS).map(([id, config]) => ({
    id,
    ...config.metadata
  }))
}

/**
 * Récupère les voyages actifs uniquement
 * @returns {Array<Object>} - Voyages avec statut 'active'
 */
export function getActiveVoyages() {
  return getAllVoyages().filter(v => v.statut === 'active')
}

/**
 * Sauvegarde le voyage actuel de l'utilisateur
 * @param {string} voyageId - ID du voyage
 */
export function setCurrentVoyage(voyageId) {
  localStorage.setItem('haikumoji_current_voyage', voyageId)
}

/**
 * Récupère le voyage actuel de l'utilisateur
 * @returns {string} - ID du voyage (par défaut 'inuit')
 */
export function getCurrentVoyage() {
  return localStorage.getItem('haikumoji_current_voyage') || 'inuit'
}
