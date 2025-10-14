/**
 * Voyage Loader - Chargement dynamique des données de voyage
 * Permet de charger facilement les fichiers JSON des lunes
 */

// Import de toutes les lunes Inuit
import lune1 from '../data/voyages/inuit/lune1.json'
import lune2 from '../data/voyages/inuit/lune2.json'
import lune3 from '../data/voyages/inuit/lune3.json'
// TODO: Ajouter lune4.json à lune12.json quand créées

/**
 * Map des lunes Inuit
 */
const lunesInuit = {
  1: lune1,
  2: lune2,
  3: lune3,
  // 4: lune4,
  // 5: lune5,
  // ...
  // 12: lune12,
}

/**
 * Map des voyages disponibles
 */
const VOYAGES = {
  inuit: lunesInuit,
  // berbere: lunesBerbere, // Futur
  // druidique: lunesDruidique, // Futur
}

/**
 * Récupère les données d'une lune spécifique pour un voyage
 * @param {string} voyage - Nom du voyage ('inuit', 'berbere', 'druidique')
 * @param {number} luneNumber - Numéro de la lune (1-12)
 * @returns {Object|null} - Données de la lune ou null si non trouvée
 */
export function getLuneData(voyage = 'inuit', luneNumber) {
  const voyageData = VOYAGES[voyage]
  if (!voyageData) {
    console.warn(`Voyage "${voyage}" non trouvé`)
    return null
  }

  const lune = voyageData[luneNumber]
  if (!lune) {
    console.warn(`Lune ${luneNumber} non trouvée pour le voyage ${voyage}`)
    return null
  }

  return lune
}

/**
 * Récupère toutes les lunes d'un voyage
 * @param {string} voyage - Nom du voyage
 * @returns {Object} - Map de toutes les lunes
 */
export function getAllLunes(voyage = 'inuit') {
  return VOYAGES[voyage] || {}
}

/**
 * Récupère le gardien d'une lune
 * @param {string} voyage - Nom du voyage
 * @param {number} luneNumber - Numéro de la lune
 * @returns {Object|null} - Données du gardien
 */
export function getGuardian(voyage = 'inuit', luneNumber) {
  const lune = getLuneData(voyage, luneNumber)
  return lune?.gardien || null
}

/**
 * Récupère le script onirique d'une lune
 * @param {string} voyage - Nom du voyage
 * @param {number} luneNumber - Numéro de la lune
 * @param {Array<string>} emojis - Les 3 émojis sélectionnés (optionnel)
 * @returns {Object|null} - Données du script avec variation personnalisée
 */
export function getScriptOnirique(voyage = 'inuit', luneNumber, emojis = []) {
  const lune = getLuneData(voyage, luneNumber)
  if (!lune?.script_onirique) return null

  const script = { ...lune.script_onirique }
  
  // Personnaliser avec les émojis si fournis
  if (emojis.length === 3 && script.variation_avec_emojis) {
    const [emoji1, emoji2, emoji3] = emojis
    script.texte_personnalise = script.variation_avec_emojis
      .replace('{emoji1}', emoji1)
      .replace('{emoji2}', emoji2)
      .replace('{emoji3}', emoji3)
  }

  return script
}

/**
 * Récupère le rituel de nuit d'une lune
 * @param {string} voyage - Nom du voyage
 * @param {number} luneNumber - Numéro de la lune
 * @returns {Object|null} - Données du rituel
 */
export function getRituel(voyage = 'inuit', luneNumber) {
  const lune = getLuneData(voyage, luneNumber)
  return lune?.rituel_de_nuit || null
}

/**
 * Récupère les astuces chamaniques d'une lune
 * @param {string} voyage - Nom du voyage
 * @param {number} luneNumber - Numéro de la lune
 * @returns {Array} - Liste des astuces
 */
export function getAstuces(voyage = 'inuit', luneNumber) {
  const lune = getLuneData(voyage, luneNumber)
  return lune?.astuces_chamaniques || []
}

/**
 * Vérifie si une lune existe
 * @param {string} voyage - Nom du voyage
 * @param {number} luneNumber - Numéro de la lune
 * @returns {boolean}
 */
export function luneExists(voyage = 'inuit', luneNumber) {
  return getLuneData(voyage, luneNumber) !== null
}

/**
 * Récupère la liste des voyages disponibles
 * @returns {Array<string>} - Noms des voyages
 */
export function getAvailableVoyages() {
  return Object.keys(VOYAGES)
}

/**
 * Récupère le nombre de lunes disponibles pour un voyage
 * @param {string} voyage - Nom du voyage
 * @returns {number}
 */
export function getLuneCount(voyage = 'inuit') {
  const voyageData = VOYAGES[voyage] || {}
  return Object.keys(voyageData).length
}
