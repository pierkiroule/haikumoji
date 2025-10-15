import { STORAGE_KEYS, ALL_EMOJIS } from './config.js'
import { getAllEmojis } from './cosmojiLoader.js'

// Use JSON-loaded emojis if available, fallback to config
const EMOJI_LIST = getAllEmojis().length > 0 ? getAllEmojis() : ALL_EMOJIS

function getJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function setJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (err) {
    // Gracefully degrade when storage is unavailable (private mode, quota, iframes)
    // No throw: avoid crashing the app on first load
    // Optionally, could fallback to an in-memory cache if needed later
    console.warn('Storage write failed for key', key, err)
  }
}

function generateId() {
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

export function seedIfEmpty() {
  const existing = getJSON(STORAGE_KEYS.HAIKUS, null)
  if (!existing) {
    // Seed a small set of neutral associations to reveal the Cosmoji graph
    const samples = [
      { emojis: ['❄️','🌌','🐋'], text: '', author: 'Anonyme', authorId: null },
      { emojis: ['🌊','🐚','🌙'], text: '', author: 'Anonyme', authorId: null },
      { emojis: ['🧊','🌬️','💫'], text: '', author: 'Anonyme', authorId: null },
      { emojis: ['🪶','🎵','☁️'], text: '', author: 'Anonyme', authorId: null },
      { emojis: ['🌕','🌠','🌑'], text: '', author: 'Anonyme', authorId: null },
      { emojis: ['🛶','💧','🌿'], text: '', author: 'Anonyme', authorId: null },
      { emojis: ['🔥','🍂','🌞'], text: '', author: 'Anonyme', authorId: null },
      { emojis: ['🦭','🌊','🧊'], text: '', author: 'Anonyme', authorId: null },
      { emojis: ['🪞','🌌','💫'], text: '', author: 'Anonyme', authorId: null },
    ]
    const seeded = samples.map(s => ({ id: generateId(), likes: 0, createdAt: Date.now(), ...s }))
    setJSON(STORAGE_KEYS.HAIKUS, seeded)
  }
  if (!getJSON(STORAGE_KEYS.LIKED_IDS, null)) {
    setJSON(STORAGE_KEYS.LIKED_IDS, [])
  }
  if (typeof getJSON(STORAGE_KEYS.INSPIRATION_COUNT, null) !== 'number') {
    setJSON(STORAGE_KEYS.INSPIRATION_COUNT, 0)
  }
  if (!getJSON(STORAGE_KEYS.DREAMS, null)) {
    setJSON(STORAGE_KEYS.DREAMS, [])
  }
  if (typeof getJSON(STORAGE_KEYS.MOON_INDEX, null) !== 'number') {
    setJSON(STORAGE_KEYS.MOON_INDEX, 1)
  }
  if (!getJSON(STORAGE_KEYS.STAR_SEEDS, null)) {
    setJSON(STORAGE_KEYS.STAR_SEEDS, [])
  }
  if (!getJSON(STORAGE_KEYS.COSMOJI_COUNTS, null)) {
    setJSON(STORAGE_KEYS.COSMOJI_COUNTS, { occurrence: {}, cooccurrence: {} })
  }
}

export function getHaikus() {
  return getJSON(STORAGE_KEYS.HAIKUS, [])
}

export function saveHaikus(list) {
  setJSON(STORAGE_KEYS.HAIKUS, list)
}

export function addHaiku({ emojis, text, author, authorId }) {
  // Note: keeping function name for compatibility
  const haikus = getHaikus()
  const newHaiku = {
    id: generateId(),
    emojis,
    text,
    author: author || 'Anonyme',
    authorId: authorId || null,
    likes: 0,
    createdAt: Date.now(),
  }
  const next = [newHaiku, ...haikus]
  saveHaikus(next)
  return newHaiku
}

// Compute emoji statistics (occurrences and cooccurrences)
export function computeEmojiStats() {
  const haikus = getHaikus()
  const persistent = getJSON(STORAGE_KEYS.COSMOJI_COUNTS, { occurrence: {}, cooccurrence: {} })
  const occ = new Map() // emoji -> count
  const pair = new Map() // 'e1|e2' sorted -> count
  const triple = new Map() // 'e1|e2|e3' sorted -> count

  const inc = (map, key) => map.set(key, (map.get(key) || 0) + 1)

  for (const h of haikus) {
    const es = Array.isArray(h.emojis) ? h.emojis.slice(0, 5) : []
    es.forEach(e => inc(occ, e))
    if (es.length >= 2) {
      for (let i = 0; i < es.length; i++) {
        for (let j = i + 1; j < es.length; j++) {
          const key = [es[i], es[j]].sort().join('|')
          inc(pair, key)
        }
      }
    }
    if (es.length >= 3) {
      for (let i = 0; i < es.length; i++) {
        for (let j = i + 1; j < es.length; j++) {
          for (let k = j + 1; k < es.length; k++) {
            const key = [es[i], es[j], es[k]].sort().join('|')
            inc(triple, key)
          }
        }
      }
    }
  }

  // Merge persistent counts (from selection resonance) into computed stats
  try {
    const addMap = (m, obj, split) => {
      for (const [key, val] of Object.entries(obj || {})) {
        const k = split ? key.split('|').sort().join('|') : key
        m.set(k, (m.get(k) || 0) + (Number(val) || 0))
      }
    }
    addMap(occ, persistent.occurrence || {}, false)
    addMap(pair, persistent.cooccurrence || {}, true)
  } catch {
    // ignore merge errors
  }

  // Ensure all catalog emojis exist in occurrences with zero counts
  for (const e of EMOJI_LIST) {
    if (!occ.has(e)) occ.set(e, 0)
  }

  const toSortedArray = (map, split) => {
    return Array.from(map.entries())
      .map(([key, count]) => ({ key, count, items: split ? key.split('|') : [key] }))
      .sort((a, b) => b.count - a.count)
  }

  return {
    occurrences: toSortedArray(occ, false),
    pairs: toSortedArray(pair, true),
    triples: toSortedArray(triple, true),
  }
}

export function strengthenCosmojiCounts(selected) {
  const safe = Array.isArray(selected) ? selected.slice(0, 3) : []
  const current = getJSON(STORAGE_KEYS.COSMOJI_COUNTS, { occurrence: {}, cooccurrence: {} })
  const occ = { ...(current.occurrence || {}) }
  const co = { ...(current.cooccurrence || {}) }
  for (const e of safe) {
    occ[e] = (occ[e] || 0) + 1
  }
  if (safe.length >= 2) {
    for (let i = 0; i < safe.length; i++) {
      for (let j = i + 1; j < safe.length; j++) {
        const key = [safe[i], safe[j]].sort().join('|')
        co[key] = (co[key] || 0) + 1
      }
    }
  }
  setJSON(STORAGE_KEYS.COSMOJI_COUNTS, { occurrence: occ, cooccurrence: co })
}

export function getLikedIds() {
  return getJSON(STORAGE_KEYS.LIKED_IDS, [])
}

export function setLikedIds(ids) {
  setJSON(STORAGE_KEYS.LIKED_IDS, ids)
}

export function likeHaiku(id) {
  // Note: keeping function name for compatibility
  const liked = new Set(getLikedIds())
  if (liked.has(id)) return getHaikus()
  const haikus = getHaikus().map(h => h.id === id ? { ...h, likes: (h.likes || 0) + 1 } : h)
  saveHaikus(haikus)
  liked.add(id)
  setLikedIds(Array.from(liked))
  return haikus
}

// ----- Dreams (rêves) & progression -----
export function getDreams() {
  return getJSON(STORAGE_KEYS.DREAMS, [])
}

export function saveDream(dream) {
  const dreams = getDreams()
  const next = [{ id: generateId(), ...dream, createdAt: Date.now() }, ...dreams]
  setJSON(STORAGE_KEYS.DREAMS, next)
  return next[0]
}

export function getMoonIndex() {
  const n = getJSON(STORAGE_KEYS.MOON_INDEX, 1)
  if (typeof n !== 'number' || n < 1) return 1
  if (n > 12) return 12
  return n
}

export function setMoonIndex(n) {
  const clamped = Math.max(1, Math.min(12, Number(n) || 1))
  setJSON(STORAGE_KEYS.MOON_INDEX, clamped)
  return clamped
}

export function nextMoon() {
  return setMoonIndex(getMoonIndex() + 1)
}

export function setSelectedTriplet(emojis) {
  const safe = Array.isArray(emojis) ? emojis.slice(0, 3) : []
  setJSON(STORAGE_KEYS.SELECTED_TRIPLET, safe)
}

export function getSelectedTriplet() {
  return getJSON(STORAGE_KEYS.SELECTED_TRIPLET, [])
}

// ---- Star seeds & guardians progression ----
export function getStarSeeds() {
  return getJSON(STORAGE_KEYS.STAR_SEEDS, [])
}

export function addStarSeed({ moon, guardianId, emojis, element }) {
  const seeds = getStarSeeds()
  const entry = {
    id: generateId(),
    moon: Math.max(1, Math.min(12, Number(moon) || getMoonIndex())),
    guardianId: guardianId || null,
    emojis: Array.isArray(emojis) ? emojis.slice(0, 3) : [],
    element: element || null,
    createdAt: Date.now(),
  }
  const next = [entry, ...seeds]
  setJSON(STORAGE_KEYS.STAR_SEEDS, next)
  return entry
}

export function getUser() {
  return getJSON(STORAGE_KEYS.USER, null)
}

export function saveUser(user) {
  const withId = user.id ? user : { ...user, id: generateId() }
  setJSON(STORAGE_KEYS.USER, withId)
  return withId
}

export function clearUser() {
  localStorage.removeItem(STORAGE_KEYS.USER)
}

export function clearUserData() {
  const user = getUser()
  if (!user) {
    clearUser()
    return
  }
  // remove user's haikus
  const kept = getHaikus().filter(h => h.authorId !== user.id)
  saveHaikus(kept)
  clearUser()
}

export function getInspirationCount() {
  return getJSON(STORAGE_KEYS.INSPIRATION_COUNT, 0)
}

export function incrementInspirationCount() {
  const n = getInspirationCount() + 1
  setJSON(STORAGE_KEYS.INSPIRATION_COUNT, n)
  return n
}

export function resetInspirationCount() {
  setJSON(STORAGE_KEYS.INSPIRATION_COUNT, 0)
}

export function getMyHaikus(user) {
  if (!user) return []
  return getHaikus().filter(h => h.authorId === user.id)
}

export function isSubscribed(user) {
  return Boolean(user?.subscription?.active)
}

// Efface toutes les données de l'app (clés préfixées par 'haikumoji_')
export function clearAppStorage() {
  const prefix = 'haikumoji_'
  try {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i)
      if (key && key.startsWith(prefix)) {
        localStorage.removeItem(key)
      }
    }
  } catch {
    // ignore
  }
}

// Réinitialise les données: efface puis ré-initialise les seeds
export function resetAppStorage() {
  clearAppStorage()
  seedIfEmpty()
}

// ---- Draft helpers ----
export function getDraft() {
  return getJSON(STORAGE_KEYS.DRAFT, null)
}

export function saveDraft(draft) {
  setJSON(STORAGE_KEYS.DRAFT, draft)
}

export function clearDraft() {
  localStorage.removeItem(STORAGE_KEYS.DRAFT)
}
