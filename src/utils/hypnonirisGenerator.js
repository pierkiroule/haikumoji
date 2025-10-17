const EMOJI_METAPHORS = {
  '🌬️': { word: 'souffle', action: 'respire', quality: 'léger' },
  '❄️': { word: 'givre', action: 'cristallise', quality: 'pur' },
  '🐋': { word: 'baleine', action: 'chante', quality: 'profond' },
  '🌊': { word: 'vague', action: 'berce', quality: 'fluide' },
  '🔥': { word: 'braise', action: 'réchauffe', quality: 'doux' },
  '🌙': { word: 'lune', action: 'apaise', quality: 'serein' },
  '🛶': { word: 'kayak', action: 'glisse', quality: 'calme' },
  '🌌': { word: 'cosmos', action: 'enveloppe', quality: 'infini' },
  '🧊': { word: 'glace', action: 'scintille', quality: 'cristallin' },
  '🌈': { word: 'arc-en-ciel', action: 'illumine', quality: 'coloré' },
  '🐚': { word: 'coquillage', action: 'résonne', quality: 'harmonieux' },
  '🪶': { word: 'plume', action: 'flotte', quality: 'aérien' },
  '🌞': { word: 'soleil', action: 'rayonne', quality: 'chaleureux' },
  '💧': { word: 'goutte', action: 'ruisselle', quality: 'doux' },
  '🌿': { word: 'mousse', action: 'adoucit', quality: 'tendre' },
  '🍂': { word: 'feuille', action: 'tombe', quality: 'paisible' },
  '🌑': { word: 'nuit', action: 'enveloppe', quality: 'profond' },
  '☁️': { word: 'nuage', action: 'dérive', quality: 'léger' },
  '🦭': { word: 'phoque', action: 'plonge', quality: 'fluide' },
  '🌕': { word: 'pleine lune', action: 'éclaire', quality: 'lumineux' },
  '🌠': { word: 'étoile filante', action: 'traverse', quality: 'fugace' },
  '🌧️': { word: 'pluie', action: 'tambourine', quality: 'rythmé' },
  '🎵': { word: 'chant', action: 'vibre', quality: 'mélodieux' },
  '🪞': { word: 'reflet', action: 'miroite', quality: 'clair' },
  '🪷': { word: 'lotus', action: "s'ouvre", quality: 'paisible' },
  '💫': { word: 'étincelle', action: 'danse', quality: 'brillant' },
  '🐻‍❄️': { word: 'ours polaire', action: 'veille', quality: 'protecteur' },
  '🦌': { word: 'caribou', action: 'erre', quality: 'libre' },
  '🐦‍⬛': { word: 'corbeau', action: 'guide', quality: 'sage' },
  '🏔️': { word: 'montagne', action: 'élève', quality: 'majestueux' },
  '⚡': { word: 'tonnerre', action: 'gronde', quality: 'puissant' }
}

const ELEMENT_THEMES = {
  air: {
    intro: "Le souffle du nord te guide...",
    texture: "léger comme la brise arctique",
    rhythm: "ta respiration s'harmonise avec le vent"
  },
  water: {
    intro: "Les eaux profondes t'accueillent...",
    texture: "fluide comme les courants marins",
    rhythm: "ton corps ondule avec les vagues"
  },
  ice: {
    intro: "La glace cristalline t'enveloppe...",
    texture: "pur comme la neige éternelle",
    rhythm: "ton esprit se cristallise dans le silence"
  },
  fire: {
    intro: "La flamme douce te réchauffe...",
    texture: "chaleureux comme la braise du foyer",
    rhythm: "ta chaleur intérieure rayonne"
  },
  light: {
    intro: "La lumière céleste t'illumine...",
    texture: "lumineux comme l'aurore boréale",
    rhythm: "ton âme scintille dans la nuit polaire"
  },
  animal: {
    intro: "Les esprits animaux te protègent...",
    texture: "fort comme les gardiens de l'arctique",
    rhythm: "ton cœur bat au rythme de la nature"
  },
  earth: {
    intro: "La terre ancestrale te soutient...",
    texture: "stable comme la toundra millénaire",
    rhythm: "tes racines s'enfoncent dans le sol sacré"
  },
  aurora: {
    intro: "L'aurore dansante t'enveloppe...",
    texture: "magique comme les esprits du ciel",
    rhythm: "ton esprit danse avec les lumières célestes"
  }
}

const GUARDIAN_VOICES = {
  'Sila': {
    voice: "Le souffle de Sila murmure à ton oreille",
    blessing: "Que le vent porte tes rêves vers des horizons paisibles"
  },
  'Sedna': {
    voice: "Sedna, déesse des profondeurs, t'invite dans ses eaux",
    blessing: "Que l'océan berce ton sommeil comme une mère son enfant"
  },
  'Nanook': {
    voice: "Nanook, l'ours blanc, veille sur ton repos",
    blessing: "Que la force tranquille de l'ours te protège cette nuit"
  },
  'Alignak': {
    voice: "Alignak, esprit lunaire, éclaire ton chemin",
    blessing: "Que la lune guide tes rêves vers la sérénité"
  },
  'Pinga': {
    voice: "Pinga, gardienne de la chasse, t'accompagne",
    blessing: "Que tes rêves chassent les pensées tourmentées"
  },
  'Malina': {
    voice: "Malina, déesse solaire, réchauffe ton cœur",
    blessing: "Que la lumière du soleil illumine tes nuits"
  },
  'Qailertetang': {
    voice: "Les esprits du temps te parlent",
    blessing: "Que les vents du temps emportent tes soucis"
  },
  'Tulugaak': {
    voice: "Tulugaak, le corbeau créateur, te raconte une histoire",
    blessing: "Que la sagesse du corbeau guide tes songes"
  },
  'Tekkeitsertok': {
    voice: "Tekkeitsertok, maître de la terre, te stabilise",
    blessing: "Que la terre ferme soutienne ton repos"
  },
  'Nerrivik': {
    voice: "Nerrivik, mère des océans, te nourrit",
    blessing: "Que l'abondance des eaux remplisse tes rêves"
  },
  'Kadlu': {
    voice: "Kadlu, déesse du tonnerre, apaise sa voix pour toi",
    blessing: "Que le tonnerre lointain berce ton sommeil"
  },
  'Aningan': {
    voice: "Aningan, frère de la lune, veille sur toi",
    blessing: "Que la lune argentée protège ton voyage onirique"
  }
}

function getMetaphor(emoji) {
  return EMOJI_METAPHORS[emoji] || { word: 'symbole', action: 'guide', quality: 'mystérieux' }
}

export function generateHypnoniris(emojis, guardianName, element = 'air') {
  const [e1, e2, e3] = emojis.slice(0, 3)
  const m1 = getMetaphor(e1)
  const m2 = getMetaphor(e2)
  const m3 = getMetaphor(e3)
  
  const theme = ELEMENT_THEMES[element] || ELEMENT_THEMES.air
  const guardian = GUARDIAN_VOICES[guardianName] || {
    voice: "L'esprit guide te parle",
    blessing: "Que tes rêves soient apaisés"
  }
  
  const hypnoniris = `${guardian.voice}...

Ferme doucement les yeux...
Laisse ton corps devenir ${theme.texture}...

${theme.intro}

Tu sens ${e1} le ${m1.word} qui ${m1.action}...
Chaque inspiration devient plus ${m1.quality}...
Plus ${m1.quality}...
Encore plus ${m1.quality}...

Maintenant, ${e2} le ${m2.word} ${m2.action} en toi...
Ton esprit se fait ${m2.quality}...
De plus en plus ${m2.quality}...
Profondément ${m2.quality}...

Et ${e3} le ${m3.word} ${m3.action} tout autour...
Tu te sens ${m3.quality}...
Complètement ${m3.quality}...
Infiniment ${m3.quality}...

${theme.rhythm}...

Tes paupières deviennent lourdes...
Si lourdes...
Ton corps s'enfonce doucement...
Dans un repos profond et paisible...

Le ${m1.word}, le ${m2.word}, et le ${m3.word} dansent ensemble...
Créant une mélodie onirique...
Qui te berce...
Te berce...
Te berce dans le sommeil...

${guardian.blessing}...

Abandonne-toi maintenant...
Au voyage onirique...
Tout est calme...
Tout est serein...
Tu dors...`

  return hypnoniris
}

export function generateShortScript(emojis, guardianName) {
  const [e1, e2, e3] = emojis.slice(0, 3)
  const m1 = getMetaphor(e1)
  const m2 = getMetaphor(e2)
  const m3 = getMetaphor(e3)
  
  const guardian = GUARDIAN_VOICES[guardianName] || {
    blessing: "Que tes rêves soient apaisés"
  }
  
  return `Avant de dormir, répète doucement :

"Je m'abandonne à ${e1} ${m1.word} qui ${m1.action}...
Mon esprit devient ${e2} ${m2.word} ${m2.quality}...
${e3} Le ${m3.word} ${m3.action} et me guide vers le repos...

${guardian.blessing}."

🌙 Laisse ces mots résonner en toi jusqu'au sommeil...`
}
