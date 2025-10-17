/**
 * Voyage Config Loader - Chargement des configurations de voyage
 * Permet de gérer les métadonnées et paramètres de chaque voyage
 *
 * Désormais, les voyages sont découverts automatiquement en scannant
 * "src/data/voyages/*/voyage.config.json". Ajouter un nouveau dossier
 * avec ce fichier suffit à enregistrer un voyage.
 */

/**
 * Découverte automatique des voyages présents dans src/data/voyages/*/voyage.config.json
 */
const CONFIG_MODULES = import.meta.glob('../data/voyages/**/voyage.config.json', {
  eager: true,
})

/**
 * Map des configurations de voyage (clé = id du dossier, valeur = JSON)
 */
const VOYAGE_CONFIGS = Object.fromEntries(
  Object.entries(CONFIG_MODULES)
    .map(([path, mod]) => {
      const match = path.match(/\/voyages\/([^/]+)\/voyage\.config\.json$/)
      const id = match ? match[1] : null
      const data = (mod && mod.default) || mod
      return id && data ? [id, data] : null
    })
    .filter(Boolean)
)

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
