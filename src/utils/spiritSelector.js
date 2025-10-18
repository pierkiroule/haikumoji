import spiritsData from '../data/spirits.json'

/**
 * Sélectionne un esprit guide basé sur le triangle d'emojis
 * L'algorithme crée une connexion magique entre les emojis et les esprits culturels
 */
export function selectSpiritForTriangle(triangle) {
  if (!triangle || triangle.length !== 3) {
    return spiritsData[0] // Fallback: premier esprit (Qilak)
  }

  // Créer un hash simple du triangle pour avoir une sélection déterministe
  const triangleString = triangle.join('')
  let hash = 0
  for (let i = 0; i < triangleString.length; i++) {
    const char = triangleString.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }

  // Utiliser le hash pour sélectionner un esprit
  const index = Math.abs(hash) % spiritsData.length
  return spiritsData[index]
}

/**
 * Récupère tous les esprits disponibles
 */
export function getAllSpirits() {
  return spiritsData
}

/**
 * Récupère un esprit par son ID
 */
export function getSpiritById(id) {
  return spiritsData.find(s => s.id === id)
}
