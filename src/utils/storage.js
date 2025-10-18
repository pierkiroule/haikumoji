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

// Initialize 22 base emojis for the mission (isolated nodes at start)
export function initializeBaseEmojis() {
  const current = getJSON(STORAGE_KEYS.COSMOJI_COUNTS, { occurrence: {}, cooccurrence: {} })
  
  // Only initialize if no emojis exist yet
  if (Object.keys(current.occurrence || {}).length === 0) {
    const baseEmojis = EMOJI_LIST.slice(0, 22) // Take first 22 emojis
    const occ = {}
    const co = {}
    
    // Initialize all base emojis with 0 occurrences (isolated nodes)
    baseEmojis.forEach(emoji => {
      occ[emoji] = 0
    })
    
    setJSON(STORAGE_KEYS.COSMOJI_COUNTS, { occurrence: occ, cooccurrence: co })
  }
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
  
  // Initialize base emojis for the mission (22 emojis, no connections initially)
  initializeBaseEmojis()
  // Seed Onimoji feed if empty (triads only, tags optional)
  if (!getJSON(STORAGE_KEYS.ONIMOJIS, null)) {
    const samplesOnimoji = [
      { emojis: ['❄️','🌌','🐋'], tags: ['glace','aurore','baleine'], author: 'Anonyme', authorId: null },
      { emojis: ['🌊','🐚','🌙'], tags: ['marée','écoute'], author: 'Anonyme', authorId: null },
      { emojis: ['🧊','🌬️','💫'], tags: ['souffle'], author: 'Anonyme', authorId: null },
      { emojis: ['🪶','🎵','☁️'], tags: ['plume','chant'], author: 'Anonyme', authorId: null },
      { emojis: ['🌕','🌠','🌑'], tags: ['cycle'], author: 'Anonyme', authorId: null }
    ]
    const seededOnimojis = samplesOnimoji.map(s => ({ id: generateId(), createdAt: Date.now(), ...s }))
    setJSON(STORAGE_KEYS.ONIMOJIS, seededOnimojis)
  }
  // Seed Tag catalog if empty
  if (!getJSON(STORAGE_KEYS.TAGS, null)) {
    const tags = [
      { id: generateId(), label: 'glace', createdAt: Date.now(), createdByUserId: null },
      { id: generateId(), label: 'aurore', createdAt: Date.now(), createdByUserId: null },
      { id: generateId(), label: 'baleine', createdAt: Date.now(), createdByUserId: null },
      { id: generateId(), label: 'souffle', createdAt: Date.now(), createdByUserId: null },
      { id: generateId(), label: 'cycle', createdAt: Date.now(), createdByUserId: null },
    ]
    setJSON(STORAGE_KEYS.TAGS, tags)
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

  // Ensure all base mission emojis exist in occurrences (including isolated ones)
  const baseEmojis = EMOJI_LIST.slice(0, 22) // Only the 22 base emojis for this mission
  for (const e of baseEmojis) {
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

/**
 * Confirme un trio sélectionné: le persiste et enrichit le réseau Cosmoji.
 * Utiliser cette fonction lorsqu'un utilisateur valide son trio (Cosmoji/Navette).
 */
export function confirmTriplet(emojis) {
  const safe = Array.isArray(emojis) ? emojis.slice(0, 3) : []
  setJSON(STORAGE_KEYS.SELECTED_TRIPLET, safe)
  // Renforce les occurrences et cooccurrences pour refléter immédiatement l'impact
  try { strengthenCosmojiCounts(safe) } catch {}
  return safe
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

// ----- Étoiles Onimoji (Co-création collaborative) -----
const STAR_STORAGE_KEY = 'onimoji_stars'
const COLLAB_INVITES_KEY = 'onimoji_collaborations'

export function getStars() {
  return getJSON(STAR_STORAGE_KEY, [])
}

export function saveStar(star) {
  const stars = getStars()
  const newStar = {
    id: generateId(),
    ...star,
    timestamp: Date.now()
  }
  const next = [newStar, ...stars]
  setJSON(STAR_STORAGE_KEY, next)
  return newStar
}

export function updateStar(starId, updates) {
  const stars = getStars()
  const updated = stars.map(s => s.id === starId ? { ...s, ...updates } : s)
  setJSON(STAR_STORAGE_KEY, updated)
  return updated.find(s => s.id === starId)
}

export function addContributionToStar(starId, userId, userName, triangle, text) {
  const stars = getStars()
  const star = stars.find(s => s.id === starId)
  if (!star) return null
  
  const newContribution = {
    userId,
    userName,
    triangle,
    text,
    timestamp: Date.now()
  }
  
  const updatedContributions = [...(star.contributions || []), newContribution]
  const updated = stars.map(s => 
    s.id === starId 
      ? { ...s, contributions: updatedContributions }
      : s
  )
  
  setJSON(STAR_STORAGE_KEY, updated)
  return updated.find(s => s.id === starId)
}

export function createNewStar(creatorId, creatorName, triangle, title, seedText) {
  const stars = getStars()
  
  const newStar = {
    id: generateId(),
    title: title || 'Nouvelle Étoile',
    seedText: seedText || '',
    contributions: [
      {
        userId: creatorId,
        userName: creatorName,
        triangle,
        text: seedText,
        timestamp: Date.now()
      }
    ],
    status: 'open',
    createdAt: Date.now(),
    x: Math.random() * 600 + 50,
    y: Math.random() * 500 + 50
  }
  
  const next = [newStar, ...stars]
  setJSON(STAR_STORAGE_KEY, next)
  return newStar
}

export function getCollaborations() {
  return getJSON(COLLAB_INVITES_KEY, [])
}

export function createCollaboration(hostId, hostName, hostTriangle) {
  const collabs = getCollaborations()
  const newCollab = {
    id: generateId(),
    hostId,
    hostName,
    hostTriangle,
    participants: [{ id: hostId, name: hostName, triangle: hostTriangle }],
    invites: [],
    status: 'open',
    createdAt: Date.now()
  }
  const next = [...collabs, newCollab]
  setJSON(COLLAB_INVITES_KEY, next)
  return newCollab
}

export function inviteToCollaboration(collabId, userId, userName) {
  const collabs = getCollaborations()
  const updated = collabs.map(c => {
    if (c.id === collabId && !c.invites.find(i => i.id === userId)) {
      return {
        ...c,
        invites: [...c.invites, { id: userId, name: userName, status: 'pending' }]
      }
    }
    return c
  })
  setJSON(COLLAB_INVITES_KEY, updated)
  return updated.find(c => c.id === collabId)
}

export function acceptCollaboration(collabId, userId, userName, userTriangle) {
  const collabs = getCollaborations()
  const updated = collabs.map(c => {
    if (c.id === collabId) {
      return {
        ...c,
        participants: [...c.participants, { id: userId, name: userName, triangle: userTriangle }],
        invites: c.invites.map(i => i.id === userId ? { ...i, status: 'accepted' } : i)
      }
    }
    return c
  })
  setJSON(COLLAB_INVITES_KEY, updated)
  return updated.find(c => c.id === collabId)
}

export function finalizeCollaboration(collabId, text) {
  const collabs = getCollaborations()
  const collab = collabs.find(c => c.id === collabId)
  if (!collab) return null

  const star = saveStar({
    participants: collab.participants,
    emojis: collab.participants.flatMap(p => p.triangle),
    text,
    branchCount: collab.participants.length <= 4 ? collab.participants.length * 3 : 'circle'
  })

  const updated = collabs.map(c => c.id === collabId ? { ...c, status: 'finalized', starId: star.id } : c)
  setJSON(COLLAB_INVITES_KEY, updated)
  
  return star
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

// ---- Onimoji feed (triads + tags) ----
export function getOnimojis() {
  return getJSON(STORAGE_KEYS.ONIMOJIS, [])
}

export function saveOnimojis(list) {
  setJSON(STORAGE_KEYS.ONIMOJIS, list)
}

export function addOnimoji({ emojis, tags = [], author, authorId }) {
  const triad = Array.isArray(emojis) ? emojis.slice(0, 3) : []
  if (triad.length !== 3) throw new Error('Onimoji requires exactly 3 emojis')
  const user = getUser() || { name: author || 'Anonyme', id: authorId || null }
  const normalizedTags = normalizeTags(tags)

  // upsert tags into catalog
  normalizedTags.forEach(label => upsertTag(label, user.id))

  // strengthen network counts with this triad
  try { strengthenCosmojiCounts(triad) } catch {}

  const onimojis = getOnimojis()
  const entry = {
    id: generateId(),
    emojis: triad,
    tags: normalizedTags,
    author: user.name,
    authorId: user.id,
    createdAt: Date.now(),
  }
  const next = [entry, ...onimojis]
  saveOnimojis(next)
  return entry
}

// ---- Tag catalog ----
export function getAllTags() {
  return getJSON(STORAGE_KEYS.TAGS, [])
}

export function saveAllTags(tags) {
  setJSON(STORAGE_KEYS.TAGS, tags)
}

export function normalizeTag(label) {
  return String(label || '')
    .normalize('NFKC')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
}

export function normalizeTags(tags) {
  const set = new Set()
  for (const t of Array.isArray(tags) ? tags : []) {
    const n = normalizeTag(t)
    if (n) set.add(n)
  }
  return Array.from(set)
}

export function upsertTag(label, createdByUserId = null) {
  const n = normalizeTag(label)
  if (!n) return null
  const tags = getAllTags()
  const existing = tags.find(t => t.label === n)
  if (existing) return existing
  const created = { id: generateId(), label: n, createdByUserId, createdAt: Date.now() }
  saveAllTags([created, ...tags])
  return created
}

export function suggestTags(query, limit = 8) {
  const q = normalizeTag(query)
  if (!q) return getAllTags().slice(0, limit)
  const tags = getAllTags()
  const startsWith = []
  const contains = []
  for (const t of tags) {
    if (t.label.startsWith(q)) startsWith.push(t)
    else if (t.label.includes(q)) contains.push(t)
  }
  return [...startsWith, ...contains].slice(0, limit)
}

// ---- Cosmoji Stats (pour visualisation réseau collectif) ----
export function getCosmicStats() {
  const occurrences = new Map()
  const cooccurrences = new Map()
  
  // Collecter tous les triangles depuis les étoiles finalisées
  const stars = getStars()
  const triangles = []
  
  stars.forEach(star => {
    if (star.contributions && Array.isArray(star.contributions)) {
      star.contributions.forEach(c => {
        if (Array.isArray(c.triangle) && c.triangle.length === 3) {
          triangles.push(c.triangle)
        }
      })
    }
  })
  
  // Calculer occurrences et co-occurrences
  triangles.forEach(triangle => {
    // Occurrences
    triangle.forEach(emoji => {
      occurrences.set(emoji, (occurrences.get(emoji) || 0) + 1)
    })
    
    // Co-occurrences (paires)
    for (let i = 0; i < triangle.length; i++) {
      for (let j = i + 1; j < triangle.length; j++) {
        const key = [triangle[i], triangle[j]].sort().join('|')
        cooccurrences.set(key, (cooccurrences.get(key) || 0) + 1)
      }
    }
  })
  
  // Convertir en arrays triés
  const occArray = Array.from(occurrences.entries())
    .map(([emoji, count]) => ({ emoji, count }))
    .sort((a, b) => b.count - a.count)
    
  const cooccArray = Array.from(cooccurrences.entries())
    .map(([key, count]) => {
      const [source, target] = key.split('|')
      return { source, target, count }
    })
    .sort((a, b) => b.count - a.count)
  
  return {
    occurrences: occArray,
    cooccurrences: cooccArray,
    totalTriangles: triangles.length,
    totalParticipants: stars.reduce((sum, s) => sum + (s.contributions?.length || 0), 0),
    totalStars: stars.length
  }
}

// ---- Données de démo pour le forum ----
export function initializeDemoData(force = false) {
  const existingStars = getStars()
  if (existingStars.length > 0 && !force) return // Déjà initialisé
  
  const demoUsers = [
    { id: 'demo_luna', name: 'Luna' },
    { id: 'demo_soleil', name: 'Soleil' },
    { id: 'demo_océane', name: 'Océane' },
    { id: 'demo_vent', name: 'Vent' },
    { id: 'demo_aurore', name: 'Aurore' },
    { id: 'demo_glacier', name: 'Glacier' }
  ]
  
  const demoStars = [
    {
      id: generateId(),
      title: 'Rêve de Glace',
      seedText: 'Dans le silence glacé, une baleine chante...',
      contributions: [
        {
          userId: 'demo_luna',
          userName: 'Luna',
          triangle: ['❄️', '🌌', '🐋'],
          text: 'Dans le silence glacé, une baleine chante sous les aurores boréales. Ses mélodies résonnent dans le cristal de glace.',
          timestamp: Date.now() - 7200000
        },
        {
          userId: 'demo_soleil',
          userName: 'Soleil',
          triangle: ['💫', '🌊', '🧊'],
          text: 'Les vagues gelées portent des étoiles filantes. Chaque cristal contient un rêve endormi qui attend le printemps.',
          timestamp: Date.now() - 3600000
        }
      ],
      status: 'open',
      createdAt: Date.now() - 7200000,
      x: 150,
      y: 120
    },
    {
      id: generateId(),
      title: 'Voyage Lunaire',
      seedText: 'Sous la pleine lune, les marées murmurent...',
      contributions: [
        {
          userId: 'demo_océane',
          userName: 'Océane',
          triangle: ['🌙', '🐚', '🌊'],
          text: 'Sous la pleine lune, les marées murmurent des secrets anciens. Les coquillages gardent la mémoire des rêves océaniques.',
          timestamp: Date.now() - 5400000
        },
        {
          userId: 'demo_vent',
          userName: 'Vent',
          triangle: ['🌬️', '☁️', '🪶'],
          text: 'Le vent danse avec les nuages, portant des plumes d\'argent. Chaque souffle trace un nouveau chemin onirique.',
          timestamp: Date.now() - 1800000
        }
      ],
      status: 'open',
      createdAt: Date.now() - 5400000,
      x: 450,
      y: 180
    },
    {
      id: generateId(),
      title: 'Aurore Céleste',
      seedText: 'Les étoiles tissent des constellations inédites...',
      contributions: [
        {
          userId: 'demo_aurore',
          userName: 'Aurore',
          triangle: ['🌠', '💫', '⭐'],
          text: 'Les étoiles tissent des constellations inédites dans le velours nocturne. Chaque constellation raconte un rêve collectif.',
          timestamp: Date.now() - 10800000
        },
        {
          userId: 'demo_glacier',
          userName: 'Glacier',
          triangle: ['🌌', '🌑', '🌕'],
          text: 'Entre la nouvelle lune et la pleine lune, le cosmos respire. Les cycles lunaires bercent nos voyages oniriques.',
          timestamp: Date.now() - 900000
        }
      ],
      status: 'open',
      createdAt: Date.now() - 10800000,
      x: 280,
      y: 350
    }
  ]
  
  setJSON(STAR_STORAGE_KEY, demoStars)
}
