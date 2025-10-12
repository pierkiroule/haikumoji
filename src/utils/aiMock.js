import { MAX_AI_SUGGESTIONS } from './config.js'

const EMOJI_HINTS = {
  '🌬️': ['vent', 'souffle', 'brise'],
  '❄️': ['glace', 'givre', 'hiver'],
  '🐋': ['baleine', 'chant', 'cétacé'],
  '🌊': ['vague', 'marée', 'océan'],
  '🔥': ['feu', 'braise', 'ardeur'],
  '🌙': ['lune', 'bleue', 'nuit'],
  '🛶': ['canoë', 'kayak', 'berge'],
  '🌌': ['voie lactée', 'galaxie', 'cosmos'],
  '🧊': ['banquise', 'glacon', 'froid'],
  '🌈': ['arc', 'pluie', 'couleurs'],
  '🐚': ['coquillage', 'écoute', 'rivage'],
  '🪶': ['plume', 'léger', 'oiseau'],
  '🌞': ['soleil', 'midi', 'chaleur'],
  '💧': ['goutte', 'rosée', 'source'],
  '🌿': ['herbe', 'forêt', 'mousse'],
  '🍂': ['feuille', 'automne', 'bruit sec'],
  '🌑': ['ombre', 'nouvelle lune', 'silence'],
  '☁️': ['nuage', 'voile', 'brume'],
  '🦭': ['phoque', 'île', 'arctique'],
  '🌕': ['pleine lune', 'argent', 'ronde'],
  '🌠': ['étoile filante', 'souhait', 'tracé'],
  '🌧️': ['averse', 'rumeur', 'ruissellement'],
  '🎵': ['chant', 'mélodie', 'tempo'],
  '🪞': ['miroir', 'reflet', 'lueur'],
  '🪷': ['lotus', 'étang', 'sérénité'],
  '💫': ['étincelle', 'vertige', 'poussière d’étoile'],
}

function composeHaiku(hints) {
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]
  const [a, b, c] = [pick(hints), pick(hints), pick(hints)]
  return `${a}\n${b}\n${c}`
}

export function generateAiSuggestions(selectedEmojis = [], limit = MAX_AI_SUGGESTIONS) {
  const pools = selectedEmojis
    .map(e => EMOJI_HINTS[e] || [])
    .filter(arr => arr.length > 0)
  const merged = pools.flat()
  const base = merged.length > 0 ? merged : ['nuit', 'vent', 'mer', 'étoiles']

  const suggestions = new Set()
  while (suggestions.size < Math.min(limit, 5)) {
    suggestions.add(composeHaiku(base))
  }
  return Array.from(suggestions)
}
