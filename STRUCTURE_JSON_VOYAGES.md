# 📚 Structure JSON des Voyages Onimoji

## ✅ Implémenté

J'ai créé une **structure modulaire en JSON** pour gérer facilement le contenu des gardiens et des lunes.

---

## 📁 Organisation des fichiers

```
src/data/voyages/
├── README.md                    ← Documentation complète
├── inuit/
│   ├── lune1.json              ← Sila (Souffle/Air) ✅
│   ├── lune2.json              ← Sedna (Mer/Eau) ✅
│   ├── lune3.json              ← Nanook (Ours/Glace) ✅
│   ├── lune4.json à lune12.json ← À créer
│   └── _template_lune.json     ← Template vierge pour nouvelles lunes
├── berbere/                     ← Futur voyage
└── druidique/                   ← Futur voyage
```

---

## 🌙 Structure complète d'un fichier Lune

Chaque `luneX.json` contient **TOUT** le contenu nécessaire pour une étape du voyage :

### 1. **Métadonnées**
```json
{
  "lune": 1,
  "titre": "Sila, le Souffle"
}
```

### 2. **Gardien**
```json
{
  "gardien": {
    "id": "sila",
    "nom": "Sila",
    "titre": "Esprit de l'Air et du Souffle",
    "emoji": "🌬️",
    "element": "air",
    "description": "Sila est l'esprit du souffle vital..."
  }
}
```

### 3. **Sagesses** (3 niveaux)
```json
{
  "sagesses": {
    "message_accueil": "Bienvenue, voyageur...",
    "enseignement_principal": "Le sommeil est comme le vent...",
    "sagesse_courte": "Inspire la paix, expire les tensions."
  }
}
```

### 4. **Rituel de Nuit** (pratique guidée)
```json
{
  "rituel_de_nuit": {
    "titre": "Rituel du Souffle Apaisant",
    "etapes": [
      "Allonge-toi confortablement...",
      "Place une main sur ton cœur...",
      "Inspire profondément..."
    ],
    "duree": "5 minutes",
    "moment_ideal": "Juste avant de dormir"
  }
}
```

### 5. **Script Onirique** (texte régénérateur)
```json
{
  "script_onirique": {
    "titre": "L'Envol du Souffle",
    "texte": "Je m'abandonne au souffle de la nuit.\nChaque inspiration m'ancre...",
    "instructions": "Lis ce texte à voix basse 3 fois...",
    "variation_avec_emojis": "Mon souffle porte {emoji1}, {emoji2}..."
  }
}
```

### 6. **Astuces Chamaniques** (techniques pratiques)
```json
{
  "astuces_chamaniques": [
    {
      "titre": "La respiration carrée",
      "description": "Inspire-4, retiens-4, expire-4..."
    },
    {
      "titre": "Le vent intérieur",
      "description": "Imagine que ton souffle est un vent doux..."
    }
  ]
}
```

### 7. **Invitation Écriture** (pour l'expression personnelle)
```json
{
  "invitation_ecriture": {
    "question": "Quelles sensations positives t'inspirent ces 3 symboles ?",
    "guidance": "Pense à des mots doux : calme, fluidité...",
    "placeholder": "Ex : Le vent qui caresse..."
  }
}
```

### 8. **Ressources Culturelles** (contexte authentique)
```json
{
  "ressources_culturelles": {
    "concept": "Sila",
    "explication": "Dans la cosmologie inuite, Sila est...",
    "liens": [
      {
        "titre": "Le concept de Sila",
        "url": "https://...",
        "type": "article"
      }
    ]
  }
}
```

### 9. **Métadonnées visuelles/audio**
```json
{
  "emojis_associes": ["🌬️", "💨", "🪶", "☁️", "🎵"],
  "couleur_theme": "#22d3ee",
  "musique_suggeree": "Sons de vent doux, carillons éoliens"
}
```

---

## 🛠️ Utilitaire de chargement

J'ai créé `src/utils/voyageLoader.js` avec des fonctions pratiques :

```javascript
import { getLuneData, getGuardian, getScriptOnirique, getRituel } from './utils/voyageLoader.js'

// Charger toutes les données d'une lune
const lune1 = getLuneData('inuit', 1)

// Charger juste le gardien
const gardien = getGuardian('inuit', 1)

// Charger le script avec personnalisation émojis
const script = getScriptOnirique('inuit', 1, ['🌬️', '🌙', '✨'])
// → Retourne le texte avec les émojis insérés

// Charger le rituel
const rituel = getRituel('inuit', 1)
```

---

## 📝 Comment créer une nouvelle Lune

### Étape 1 : Copier le template
```bash
cp src/data/voyages/inuit/_template_lune.json src/data/voyages/inuit/lune4.json
```

### Étape 2 : Remplir les données

Ouvrir `lune4.json` et remplir chaque section :

1. **Choisir un gardien inuit authentique**
   - Recherche dans la mythologie inuite
   - Exemples : Alignak (Lune), Pinga (Chasse), Malina (Soleil)

2. **Écrire les sagesses** (ton chaleureux, accessible)
   - Message d'accueil personnalisé
   - Enseignement sur le sommeil/rêves
   - Phrase courte mémorable

3. **Créer un rituel** (5-10 minutes, 5-7 étapes)
   - Techniques corporelles ou respiratoires
   - Instructions claires et simples
   - Testable immédiatement

4. **Composer le script onirique** (poétique, 4-8 vers)
   - Format court avec retours à la ligne
   - Images de nature arctique
   - Vocabulaire apaisant

5. **Ajouter 3 astuces chamaniques** (concrètes)
   - Basées sur traditions réelles
   - Applicables avant le coucher
   - Variées : respiration, visualisation, mouvement

6. **Documenter le contexte culturel**
   - Explication authentique du concept inuit
   - Liens vers ressources (optionnel)

### Étape 3 : Mettre à jour le loader

Éditer `src/utils/voyageLoader.js` :

```javascript
import lune4 from '../data/voyages/inuit/lune4.json'

const lunesInuit = {
  1: lune1,
  2: lune2,
  3: lune3,
  4: lune4, // ← Ajouter ici
  // ...
}
```

### Étape 4 : Tester

L'application chargera automatiquement la nouvelle lune quand l'utilisateur atteindra cette étape.

---

## 🌟 Gardiens Inuits Suggérés (Lunes 4-12)

| Lune | Gardien | Élément | Thème |
|------|---------|---------|-------|
| 4 | **Alignak** (Lune/Éclipse) | light | Cycles, phases, renouveau |
| 5 | **Pinga** (Déesse de la Chasse) | animal | Instinct, guidance, protection |
| 6 | **Malina** (Soleil) | fire | Chaleur, énergie, réveil |
| 7 | **Qailertetang** (Esprits du Temps) | aurora | Magie, transformation, aurores |
| 8 | **Tulugaak** (Corbeau Créateur) | air | Création, messages, sagesse |
| 9 | **Tekkeitsertok** (Maître de la Terre) | earth | Ancrage, stabilité, enracinement |
| 10 | **Nerrivik** (Mère de la Mer) | water | Naissance, abondance, vie |
| 11 | **Kadlu** (Déesse du Tonnerre) | air | Puissance, libération, catharsis |
| 12 | **Aningan** (Frère Lune) | light | Complétion, célébration, accomplissement |

---

## 🎨 Éléments disponibles

Chaque gardien a un élément qui détermine sa couleur et son énergie :

| Élément | Couleur | Symbolisme |
|---------|---------|------------|
| `air` | Cyan `#22d3ee` | Vent, souffle, légèreté, pensées |
| `water` | Bleu `#60a5fa` | Eau, fluidité, émotions, profondeur |
| `fire` | Orange `#f59e0b` | Feu, chaleur, transformation, énergie |
| `earth` | Vert `#86efac` | Terre, ancrage, stabilité, croissance |
| `ice` | Bleu clair `#93c5fd` | Glace, repos, hibernation, calme |
| `aurora` | Vert émeraude `#34d399` | Aurore, magie, mystère, beauté |
| `light` | Rose `#f5d0fe` | Lumière, clarté, guidance, éveil |
| `animal` | Rouge `#fca5a5` | Esprit animal, instinct, force, protection |

---

## ✨ Conseils de rédaction

### Ton général
- ✅ Chaleureux, sage, apaisant
- ✅ Vocabulaire simple et accessible
- ✅ Ancré dans la nature arctique
- ❌ Éviter le jargon médical/psychologique
- ❌ Pas de promesses irréalistes

### Sagesses
- Court paragraphe (2-3 phrases)
- Métaphore naturelle (vent, eau, glace...)
- Lien avec sommeil ou rêves
- Sagesse applicable

### Rituels
- 5-7 étapes maximum
- Instructions à la 2e personne du singulier
- Techniques validées (respiration, relaxation progressive...)
- Durée réaliste (5-10 min)

### Scripts Oniriques
- Format poétique court
- Retours à la ligne pour le rythme
- Répétitions apaisantes
- Images sensorielles

### Astuces
- Titre court et clair
- Description pratique (50-100 mots)
- Technique testable immédiatement
- Basée sur traditions ou science du sommeil

---

## 🚀 Prochaines étapes

1. ✅ Structure JSON créée (lunes 1-3)
2. ✅ Loader utilitaire implémenté
3. ✅ Documentation complète
4. ⏳ Créer lunes 4-12 (basé sur template)
5. ⏳ Adapter page Guardian pour utiliser les JSON
6. ⏳ Implémenter l'écriture des sensations
7. ⏳ Afficher le script onirique personnalisé
8. ⏳ Ajouter visualisation impact Cosmoji

---

## 📖 Fichiers créés

- ✅ `src/data/voyages/inuit/lune1.json` (Sila - Air)
- ✅ `src/data/voyages/inuit/lune2.json` (Sedna - Eau)
- ✅ `src/data/voyages/inuit/lune3.json` (Nanook - Glace)
- ✅ `src/data/voyages/inuit/_template_lune.json` (Template)
- ✅ `src/data/voyages/README.md` (Documentation)
- ✅ `src/utils/voyageLoader.js` (Utilitaires de chargement)

Vous pouvez maintenant **éditer facilement** le contenu de chaque lune en modifiant les fichiers JSON ! 🎉
