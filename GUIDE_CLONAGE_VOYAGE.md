# 🚀 Guide de Clonage de Voyage Onimoji

## Créer un nouveau voyage en 5 étapes

Ce guide vous explique comment créer un nouveau voyage (ex: Berbère, Druidique) en clonant la structure Inuit.

---

## 📋 Étape 1 : Copier le template

```bash
# Depuis le dossier src/data/voyages/
cp -r _TEMPLATE_VOYAGE berbere
```

Votre structure ressemble maintenant à :
```
src/data/voyages/
├── inuit/
├── berbere/  ← Nouveau voyage
│   └── voyage.config.json
└── _TEMPLATE_VOYAGE/
```

---

## ⚙️ Étape 2 : Configurer voyage.config.json

Éditez `src/data/voyages/berbere/voyage.config.json` :

### 2.1 Métadonnées
```json
{
  "id": "berbere",
  "metadata": {
    "nom": "Voyage Berbère",
    "nom_court": "Berbère",
    "description": "12 lunes à travers les sagesses du Sahara...",
    "emoji": "🏜️",
    "illustration": "🏜️✨🌙",
    "culture": "Berbère (Afrique du Nord)",
    "statut": "active"
  }
}
```

### 2.2 Thème visuel
```json
{
  "theme": {
    "couleur_primaire": "#f59e0b",
    "couleur_secondaire": "#fbbf24",
    "gradient": "from-amber-500 to-orange-500",
    "ambiance": "Désertique, chaud, étoilé, mystique",
    "musique_ambiance": "Instruments berbères, chants du désert"
  }
}
```

### 2.3 Liste des 12 lunes
```json
{
  "lunes": {
    "1": {
      "titre": "Nom du Gardien/Esprit 1",
      "emoji": "🌟",
      "element": "fire",
      "disponible": false
    }
    // ... lunes 2 à 12
  }
}
```

---

## 📝 Étape 3 : Créer les fichiers de lunes

Pour chaque lune, créez un fichier JSON :

```bash
# Copier le template
cp inuit/_template_lune.json berbere/lune1.json
```

Éditez `berbere/lune1.json` :

```json
{
  "lune": 1,
  "titre": "Nom du Gardien Berbère",
  "gardien": {
    "id": "id_gardien",
    "nom": "Nom",
    "titre": "Titre descriptif",
    "emoji": "🏜️",
    "element": "fire",
    "description": "Description du gardien berbère..."
  },
  "sagesses": {
    "message_accueil": "...",
    "enseignement_principal": "...",
    "sagesse_courte": "..."
  }
  // ... compléter toutes les sections
}
```

**Répétez pour lune2.json à lune12.json**

---

## 🔌 Étape 4 : Connecter au code

### 4.1 Importer le config voyage

Éditez `src/utils/voyageConfig.js` :

```javascript
import voyageInuitConfig from '../data/voyages/inuit/voyage.config.json'
import voyageBerbereConfig from '../data/voyages/berbere/voyage.config.json' // ← Ajout

const VOYAGE_CONFIGS = {
  inuit: voyageInuitConfig,
  berbere: voyageBerbereConfig, // ← Ajout
}
```

### 4.2 Importer les lunes

Éditez `src/utils/voyageLoader.js` :

```javascript
// Lunes Berbère
import berbereLune1 from '../data/voyages/berbere/lune1.json'
import berbereLune2 from '../data/voyages/berbere/lune2.json'
// ... import lune3 à lune12

const lunesBerbere = {
  1: berbereLune1,
  2: berbereLune2,
  // ... 3 à 12
}

const VOYAGES = {
  inuit: lunesInuit,
  berbere: lunesBerbere, // ← Ajout
}
```

---

## 🎨 Étape 5 : Ajouter à l'interface

### 5.1 Page d'accueil

Éditez `src/pages/Home.jsx` pour afficher le nouveau voyage :

```jsx
<motion.article className="...">
  <h2>Voyage Berbère</h2>
  <p>12 lunes à travers les sagesses du Sahara...</p>
  <Link to="/voyage/berbere">Découvrir</Link>
</motion.article>
```

### 5.2 Créer la page du voyage

Copier `src/pages/VoyageInuit.jsx` → `VoyageBerbere.jsx`

Adapter le contenu :
```jsx
export default function VoyageBerbere() {
  const voyageConfig = getVoyageConfig('berbere')
  // ... reste du code
}
```

### 5.3 Ajouter la route

Éditez `src/App.jsx` :

```jsx
import VoyageBerbere from './pages/VoyageBerbere.jsx'

<Routes>
  {/* ... routes existantes */}
  <Route path="/voyage/berbere" element={<VoyageBerbere />} />
</Routes>
```

---

## ✅ Checklist complète

### Configuration
- [ ] Copier `_TEMPLATE_VOYAGE` → nouveau dossier
- [ ] Remplir `voyage.config.json` (métadonnées, thème, lunes)
- [ ] Créer les 12 fichiers `lune1.json` à `lune12.json`

### Contenu
- [ ] Définir 12 gardiens/esprits authentiques
- [ ] Écrire sagesses et enseignements
- [ ] Créer rituels de nuit (5-10 min)
- [ ] Composer scripts oniriques poétiques
- [ ] Ajouter astuces chamaniques (3 par lune)
- [ ] Documenter contexte culturel

### Code
- [ ] Importer config dans `voyageConfig.js`
- [ ] Importer lunes dans `voyageLoader.js`
- [ ] Créer page `VoyageXXX.jsx`
- [ ] Ajouter route dans `App.jsx`
- [ ] Ajouter carte sur Home

### Test
- [ ] Naviguer vers le nouveau voyage
- [ ] Vérifier que les 12 lunes s'affichent
- [ ] Tester le parcours complet (Navette → Guardian)
- [ ] Vérifier le thème visuel (couleurs, gradient)

---

## 💡 Exemples de voyages

### Voyage Berbère

**Gardiens suggérés :**
1. Esprit du Sable Mouvant (Terre/Désert)
2. Djinn du Vent du Sud (Air)
3. Gardienne de l'Oasis (Eau)
4. Esprit du Feu Sacré (Feu)
5. Veilleur des Étoiles (Lumière)
6. Ancêtre du Palmier (Terre)
7. Protecteur du Silence (Mystère)
8. Esprit de la Caravane (Voyage)
9. Gardien de la Nuit Étoilée (Lumière)
10. Mère des Dunes (Terre)
11. Esprit du Mirage (Illusion)
12. Sage du Croissant de Lune (Accomplissement)

**Thème :** Désert, chaleur, nuits étoilées, silence, oasis

### Voyage Druidique

**Gardiens suggérés :**
1. Esprit du Chêne Sacré (Terre)
2. Gardienne de la Source (Eau)
3. Druide du Feu de Beltane (Feu)
4. Veilleur de la Forêt (Terre)
5. Esprit du Gui (Lumière)
6. Gardien du Cercle de Pierres (Mystère)
7. Dame du Lac (Eau)
8. Protecteur du Cerf Blanc (Animal)
9. Esprit des Racines (Terre)
10. Gardienne de l'Équinoxe (Lumière)
11. Druide de la Pleine Lune (Lumière)
12. Sage du Cycle Complet (Accomplissement)

**Thème :** Forêt, saisons, cercles de pierres, mystère celtique

---

## 🔧 Personnalisation avancée

### Ajouter des émojis spécifiques au voyage

Éditez `src/data/cosmoji/emojis.json` :

```json
{
  "categories": {
    "desert": {
      "label": "Désert (Berbère)",
      "emojis": [
        {
          "emoji": "🏜️",
          "name": "Désert",
          "element": "earth",
          "keywords": ["sable", "dune", "chaleur"]
        },
        {
          "emoji": "🐪",
          "name": "Chameau",
          "element": "animal",
          "keywords": ["désert", "voyage", "endurance"]
        }
      ]
    }
  }
}
```

### Modifier la navigation

Dans `voyage.config.json`, personnalisez les étapes :

```json
{
  "navigation": {
    "etapes": [
      {
        "id": "caravane",
        "nom": "Caravane du Désert",
        "description": "Sélection de 3 symboles",
        "route": "/navette",
        "icon": "🐪"
      }
    ]
  }
}
```

---

## 📚 Ressources pour créer du contenu authentique

### Recherche culturelle
- Mythologie et contes traditionnels
- Pratiques chamaniques authentiques
- Symboles et éléments naturels de la culture
- Musique et instruments traditionnels

### Techniques de sommeil
- Respiration (pranayama, cohérence cardiaque)
- Relaxation progressive
- Visualisation guidée
- Méditation body scan

### Poésie
- Structure courte (4-8 vers)
- Images de la nature locale
- Vocabulaire apaisant
- Rythme régulier

---

## 🚨 Bonnes pratiques

### Respect culturel
✅ Rechercher les sources authentiques
✅ Citer les inspirations
✅ Adapter avec respect pour le bien-être moderne
❌ Ne pas caricaturer ou appropriation culturelle

### Qualité du contenu
✅ Tester les rituels vous-même
✅ Relire plusieurs fois
✅ Faire valider par des bêta-testeurs
✅ Vérifier orthographe et grammaire

### Maintenance
✅ Versionner les fichiers JSON
✅ Documenter les changements
✅ Garder une cohérence entre les lunes
✅ Utiliser le même template partout

---

## 📁 Structure finale attendue

```
src/data/voyages/
├── inuit/
│   ├── voyage.config.json
│   ├── lune1.json à lune12.json
│   └── _template_lune.json
├── berbere/
│   ├── voyage.config.json
│   └── lune1.json à lune12.json
├── druidique/
│   ├── voyage.config.json
│   └── lune1.json à lune12.json
└── _TEMPLATE_VOYAGE/
    └── voyage.config.json
```

---

**Temps estimé pour créer un voyage complet :** 
- Configuration : 1h
- Contenu (12 lunes) : 8-12h
- Intégration code : 30min
- Tests : 1h
**Total : ~11-14h de travail**

---

🎉 **Félicitations !** Vous pouvez maintenant créer autant de voyages que vous le souhaitez en JSON uniquement !
