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

// ----- Sequence-aware generator (non-IA, combinatorial) -----

const DETERMINERS = ['le', 'la', 'un', 'une', 'ce', 'cette']
const PREPOSITIONS = ['sous', 'dans', 'sur', 'vers', 'près de', 'avec']
const VERBS = ['chante', 'tombe', 'respire', 'murmure', 'gronde', 'luit', "s'éveille", "s'endort"]
const ADVERBS = ['doucement', 'lentement', 'encore', 'déjà', 'toujours']
const PAUSES = ['—', '…', ':']

function randomPick(list) {
  return list[Math.floor(Math.random() * list.length)]
}

function startsWithVowelish(text) {
  const t = (text || '').trim().toLowerCase()
  return /^[aeiouyàâäéèêëîïôöùûüœh]/.test(t)
}

function looksFeminine(text) {
  const t = (text || '').trim().toLowerCase()
  // naive heuristic: feminine nouns often end with 'e'
  return /e$/.test(t) || /ée$/.test(t) || /ette$/.test(t)
}

function withArticle(base) {
  const t = (base || '').trim()
  if (t.length === 0) return t
  // avoid double article if already present
  if (/^(le|la|les|un|une|des|du|de la|de l’|de l'|l’|l')\s/i.test(t)) return t
  if (startsWithVowelish(t)) return `l’${t}`
  const fem = looksFeminine(t)
  const det = fem ? randomPick(['la', 'une', 'cette']) : randomPick(['le', 'un', 'ce'])
  return `${det} ${t}`
}

function capitalizeFirst(text) {
  if (!text) return text
  return text.charAt(0).toUpperCase() + text.slice(1)
}

function lineVariantFromHint(hint, variant) {
  const base = hint
  switch (variant) {
    case 0:
      return capitalizeFirst(withArticle(base))
    case 1:
      return `${capitalizeFirst(randomPick(PREPOSITIONS))} ${withArticle(base)}`
    case 2:
      return `${capitalizeFirst(randomPick(VERBS))} ${withArticle(base)}`
    case 3:
      return `${capitalizeFirst(withArticle(base))} ${randomPick(ADVERBS)}`
    default:
      return capitalizeFirst(base)
  }
}

function ensureHintsForEmoji(emoji) {
  const pool = EMOJI_HINTS[emoji]
  return Array.isArray(pool) && pool.length > 0 ? pool : ['silence', 'nuit', 'vent']
}

export function generateSequenceSuggestions(selectedEmojis = [], limit = MAX_AI_SUGGESTIONS) {
  const seq = Array.isArray(selectedEmojis) ? selectedEmojis.slice(0, 3) : []
  if (seq.length < 3) return []

  const [e1, e2, e3] = seq
  const h1 = ensureHintsForEmoji(e1)
  const h2 = ensureHintsForEmoji(e2)
  const h3 = ensureHintsForEmoji(e3)

  const out = new Set()

  // Generate up to `limit` unique suggestions, influenced by sequence order
  while (out.size < Math.min(limit, 8)) {
    const c1 = randomPick(h1)
    const c2 = randomPick(h2)
    const c3 = randomPick(h3)

    const style = Math.floor(Math.random() * 5)
    let l1, l2, l3

    if (style === 0) {
      // Straight sequence: nouny -> preposition -> verb
      l1 = lineVariantFromHint(c1, 0)
      l2 = lineVariantFromHint(c2, 1)
      l3 = lineVariantFromHint(c3, 2)
    } else if (style === 1) {
      // Echo with adverb on middle line
      l1 = lineVariantFromHint(c1, 0)
      l2 = lineVariantFromHint(c2, 3)
      l3 = lineVariantFromHint(c3, 0)
    } else if (style === 2) {
      // Kireji-like pause after line 1
      const pause = randomPick(PAUSES)
      l1 = `${lineVariantFromHint(c1, 0)} ${pause}`
      l2 = lineVariantFromHint(c2, 2)
      l3 = lineVariantFromHint(c3, 0)
    } else if (style === 3) {
      // Bridge line 2 between 1 and 3
      l1 = lineVariantFromHint(c1, 0)
      l2 = `Entre ${withArticle(c1)} et ${withArticle(c3)}`
      l3 = lineVariantFromHint(c3, 0)
    } else {
      // Minimalist plain sequence
      l1 = capitalizeFirst(c1)
      l2 = capitalizeFirst(c2)
      l3 = capitalizeFirst(c3)
    }

    const text = `${l1}\n${l2}\n${l3}`
    out.add(text)
  }

  return Array.from(out)
}
