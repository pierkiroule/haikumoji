import { STORAGE_KEYS } from './config.js'
import { MOCK_HAIKUS } from './mockData.js'

function getJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function setJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

function generateId() {
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

export function seedIfEmpty() {
  const existing = getJSON(STORAGE_KEYS.HAIKUS, null)
  if (!existing || existing.length === 0) {
    setJSON(STORAGE_KEYS.HAIKUS, MOCK_HAIKUS)
  }
  if (!getJSON(STORAGE_KEYS.LIKED_IDS, null)) {
    setJSON(STORAGE_KEYS.LIKED_IDS, [])
  }
  if (typeof getJSON(STORAGE_KEYS.INSPIRATION_COUNT, null) !== 'number') {
    setJSON(STORAGE_KEYS.INSPIRATION_COUNT, 0)
  }
}

export function getHaikus() {
  return getJSON(STORAGE_KEYS.HAIKUS, [])
}

export function saveHaikus(list) {
  setJSON(STORAGE_KEYS.HAIKUS, list)
}

export function addHaiku({ emojis, text, author, authorId }) {
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

export function getLikedIds() {
  return getJSON(STORAGE_KEYS.LIKED_IDS, [])
}

export function setLikedIds(ids) {
  setJSON(STORAGE_KEYS.LIKED_IDS, ids)
}

export function likeHaiku(id) {
  const liked = new Set(getLikedIds())
  if (liked.has(id)) return getHaikus()
  const haikus = getHaikus().map(h => h.id === id ? { ...h, likes: (h.likes || 0) + 1 } : h)
  saveHaikus(haikus)
  liked.add(id)
  setLikedIds(Array.from(liked))
  return haikus
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
