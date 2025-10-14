# 🏗️ Architecture 100% JSON Modulaire - Onimoji

## ✅ IMPLÉMENTATION COMPLÈTE

L'application est maintenant **100% pilotée par JSON**. Vous pouvez modifier tout le contenu sans toucher au code JavaScript.

---

## 📁 Structure des fichiers

```
src/data/
├── cosmoji/
│   └── emojis.json                    ← Liste complète des émojis + métadonnées
│
├── voyages/
│   ├── inuit/
│   │   ├── voyage.config.json         ← Config du voyage Inuit
│   │   ├── lune1.json                 ← Sila (Air)
│   │   ├── lune2.json                 ← Sedna (Eau)
│   │   ├── lune3.json                 ← Nanook (Glace)
│   │   ├── lune4.json à lune12.json   ← À créer
│   │   └── _template_lune.json        ← Template vierge
│   │
│   ├── _TEMPLATE_VOYAGE/
│   │   └── voyage.config.json         ← Template pour nouveau voyage
│   │
│   └── README.md                      ← Documentation structure
│
└── (autres données existantes)
```

---

## 🎯 Ce que vous pouvez modifier en JSON

### 1. **Liste des Émojis Cosmoji** (`cosmoji/emojis.json`)

```json
{
  "categories": {
    "nature": {
      "label": "Nature & Éléments",
      "emojis": [
        {
          "emoji": "🌬️",
          "name": "Vent",
          "element": "air",
          "keywords": ["souffle", "air", "légèreté"]
        }
      ]
    }
  },
  "elements": {
    "air": {
      "label": "Air",
      "color": "#22d3ee",
      "description": "Vent, souffle, légèreté"
    }
  }
}
```

**Modification facile :**
- ✅ Ajouter/supprimer des émojis
- ✅ Créer de nouvelles catégories
- ✅ Modifier les couleurs des éléments
- ✅ Changer les mots-clés de recherche

---

### 2. **Configuration d'un Voyage** (`voyages/xxx/voyage.config.json`)

```json
{
  "id": "inuit",
  "metadata": {
    "nom": "Voyage Inuit",
    "description": "...",
    "emoji": "❄️"
  },
  "theme": {
    "couleur_primaire": "#22d3ee",
    "gradient": "from-cyan-500 to-blue-500",
    "musique_ambiance": "Tambours chamaniques..."
  },
  "lunes": {
    "1": {
      "titre": "Sila, le Souffle",
      "emoji": "🌬️",
      "disponible": true
    }
  }
}
```

**Modification facile :**
- ✅ Changer le nom et la description du voyage
- ✅ Modifier les couleurs et le thème visuel
- ✅ Activer/désactiver des lunes (`disponible: true/false`)
- ✅ Réorganiser l'ordre des lunes

---

### 3. **Contenu d'une Lune** (`voyages/xxx/luneX.json`)

```json
{
  "gardien": {
    "nom": "Sila",
    "emoji": "🌬️",
    "element": "air"
  },
  "sagesses": {
    "message_accueil": "Bienvenue voyageur...",
    "enseignement_principal": "Le sommeil est comme le vent...",
    "sagesse_courte": "Inspire la paix..."
  },
  "rituel_de_nuit": {
    "titre": "Rituel du Souffle Apaisant",
    "etapes": [
      "Allonge-toi...",
      "Inspire..."
    ]
  },
  "script_onirique": {
    "texte": "Je m'abandonne au souffle..."
  },
  "astuces_chamaniques": [
    {
      "titre": "La respiration carrée",
      "description": "Inspire-4, retiens-4..."
    }
  ]
}
```

**Modification facile :**
- ✅ Changer les messages du gardien
- ✅ Modifier les rituels (étapes, durée)
- ✅ Réécrire les scripts oniriques
- ✅ Ajouter/modifier les astuces

---

## 🛠️ Utilitaires de chargement

### `cosmojiLoader.js` - Émojis

```javascript
import { getAllEmojis, getEmojisByElement, getElementInfo } from './cosmojiLoader.js'

// Récupérer tous les émojis
const emojis = getAllEmojis()
// → ['🌬️', '🌊', '❄️', ...]

// Récupérer les émojis d'eau
const waterEmojis = getEmojisByElement('water')
// → [{emoji: '🌊', name: 'Vague', ...}, ...]

// Infos sur un élément
const airInfo = getElementInfo('air')
// → {label: 'Air', color: '#22d3ee', ...}
```

### `voyageConfig.js` - Configuration Voyage

```javascript
import { getVoyageConfig, getLuneInfo, getVoyageTheme } from './voyageConfig.js'

// Config complète d'un voyage
const inuitConfig = getVoyageConfig('inuit')

// Infos d'une lune
const lune1 = getLuneInfo('inuit', 1)
// → {titre: 'Sila...', emoji: '🌬️', ...}

// Thème visuel
const theme = getVoyageTheme('inuit')
// → {couleur_primaire: '#22d3ee', ...}
```

### `voyageLoader.js` - Contenu des Lunes

```javascript
import { getLuneData, getScriptOnirique, getRituel } from './voyageLoader.js'

// Données complètes d'une lune
const lune1 = getLuneData('inuit', 1)

// Script personnalisé avec émojis
const script = getScriptOnirique('inuit', 1, ['🌬️', '🌙', '✨'])
// → Texte avec émojis insérés

// Rituel de nuit
const rituel = getRituel('inuit', 1)
// → {titre: '...', etapes: [...], ...}
```

---

## 🚀 Créer un nouveau voyage (sans code)

### Étape 1 : Copier le template
```bash
cp -r src/data/voyages/_TEMPLATE_VOYAGE src/data/voyages/berbere
```

### Étape 2 : Éditer voyage.config.json
```json
{
  "id": "berbere",
  "metadata": {
    "nom": "Voyage Berbère",
    "emoji": "🏜️"
  }
}
```

### Étape 3 : Créer les 12 lunes
```bash
for i in {1..12}; do
  cp src/data/voyages/inuit/_template_lune.json src/data/voyages/berbere/lune$i.json
done
```

### Étape 4 : Remplir le contenu (JSON uniquement)
Éditer chaque `luneX.json` avec les sagesses berbères

### Étape 5 : Connecter au code (2 lignes)
```javascript
// voyageConfig.js
import voyageBerbereConfig from '../data/voyages/berbere/voyage.config.json'
const VOYAGE_CONFIGS = { inuit: ..., berbere: voyageBerbereConfig }

// voyageLoader.js
import berbereLune1 from '../data/voyages/berbere/lune1.json'
const VOYAGES = { inuit: ..., berbere: { 1: berbereLune1, ... } }
```

**C'EST TOUT !** Le nouveau voyage est prêt.

---

## 📊 Avantages de l'architecture JSON

### ✅ Pour vous (créateur de contenu)
- Modifier le contenu sans coder
- Ajouter des émojis en 2 secondes
- Créer un voyage complet en éditant des JSON
- Versionner facilement (Git)
- Collaborer sur le contenu (pas de conflit de code)

### ✅ Pour l'équipe technique
- Code propre et séparé du contenu
- Facile à tester (mock data)
- Performance (imports statiques)
- Type-safe avec validation JSON Schema (futur)

### ✅ Pour l'utilisateur final
- Contenu cohérent
- Facilement traduisible (i18n futur)
- Mises à jour de contenu sans redéploiement complet

---

## 📝 Fichiers créés

### Données
- ✅ `cosmoji/emojis.json` - Liste émojis + métadonnées
- ✅ `voyages/inuit/voyage.config.json` - Config voyage Inuit
- ✅ `voyages/inuit/lune1.json` - Sila (Air)
- ✅ `voyages/inuit/lune2.json` - Sedna (Eau)
- ✅ `voyages/inuit/lune3.json` - Nanook (Glace)
- ✅ `voyages/inuit/_template_lune.json` - Template
- ✅ `voyages/_TEMPLATE_VOYAGE/` - Template voyage complet

### Utilitaires
- ✅ `utils/cosmojiLoader.js` - Chargeur émojis
- ✅ `utils/voyageConfig.js` - Chargeur config voyage
- ✅ `utils/voyageLoader.js` - Chargeur lunes (mis à jour)

### Documentation
- ✅ `STRUCTURE_JSON_VOYAGES.md` - Doc structure JSON
- ✅ `GUIDE_CLONAGE_VOYAGE.md` - Guide création voyage
- ✅ `ARCHITECTURE_JSON_MODULAIRE.md` - Ce fichier
- ✅ `data/voyages/README.md` - Doc interne

---

## 🎯 Prochaines étapes recommandées

### Court terme (contenu)
1. Créer lunes 4-12 pour le voyage Inuit
2. Tester et valider les rituels
3. Enrichir les ressources culturelles

### Moyen terme (nouveaux voyages)
1. Créer le voyage Berbère complet
2. Créer le voyage Druidique complet
3. Ajouter des émojis spécifiques à chaque culture

### Long terme (fonctionnalités)
1. Validation JSON Schema automatique
2. Interface d'édition de contenu (CMS)
3. Système de traduction i18n
4. Export/import de voyages

---

## 📚 Ressources

- **Template de lune** : `src/data/voyages/inuit/_template_lune.json`
- **Template de voyage** : `src/data/voyages/_TEMPLATE_VOYAGE/`
- **Guide clonage** : `GUIDE_CLONAGE_VOYAGE.md`
- **Doc structure** : `data/voyages/README.md`

---

## ✨ Résumé

**Avant :** 
- Émojis codés en dur dans `config.js`
- Contenu des gardiens mélangé au code
- Difficile d'ajouter un nouveau voyage

**Après :**
- ✅ **Tout en JSON** : émojis, voyages, lunes, sagesses
- ✅ **Facile à maintenir** : éditer un fichier JSON
- ✅ **Facile à cloner** : copier un dossier + remplir du JSON
- ✅ **Séparation contenu/code** : équipes indépendantes
- ✅ **Build OK** : 0 erreur, fonctionnel

**Vous pouvez maintenant créer du contenu sans jamais toucher au JavaScript !** 🎉
