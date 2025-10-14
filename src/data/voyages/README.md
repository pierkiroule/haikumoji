# Structure des Voyages Onimoji

## 📁 Organisation des fichiers

```
src/data/voyages/
├── README.md (ce fichier)
├── inuit/
│   ├── lune1.json (Sila - Souffle)
│   ├── lune2.json (Sedna - Mer)
│   ├── lune3.json (Nanook - Ours)
│   ├── lune4.json à lune12.json (à créer)
│   └── _template_lune.json (template pour créer de nouvelles lunes)
├── berbere/ (futur)
└── druidique/ (futur)
```

## 🌙 Structure d'un fichier de Lune

Chaque fichier `luneX.json` contient toutes les données pour une étape du voyage :

### **Métadonnées**
```json
{
  "lune": 1,
  "titre": "Nom du Gardien"
}
```

### **Gardien**
```json
{
  "gardien": {
    "id": "identifiant_unique",
    "nom": "Nom",
    "titre": "Titre descriptif",
    "emoji": "🌟",
    "element": "air|water|fire|earth|ice|aurora|light|animal",
    "description": "Description du gardien"
  }
}
```

### **Sagesses**
Messages et enseignements du gardien :
- `message_accueil` : Première parole au voyageur
- `enseignement_principal` : Sagesse centrale sur le sommeil/rêves
- `sagesse_courte` : Phrase mémorable

### **Rituel de Nuit**
Pratique guidée étape par étape :
- `titre` : Nom du rituel
- `etapes` : Array d'instructions claires
- `duree` : Temps estimé
- `moment_ideal` : Quand pratiquer

### **Script Onirique**
Texte régénérateur pour endormir :
- `titre` : Titre poétique
- `texte` : Poème/méditation guidée (multi-lignes)
- `instructions` : Comment l'utiliser
- `variation_avec_emojis` : Personnalisation avec les émojis choisis

### **Astuces Chamaniques**
Array de 3 techniques pratiques avec :
- `titre` : Nom de l'astuce
- `description` : Explication pratique

### **Invitation Écriture**
Pour l'étape d'expression personnelle :
- `question` : Question ouverte
- `guidance` : Mots-clés suggérés
- `placeholder` : Exemple inspirant

### **Ressources Culturelles**
Contexte inuit authentique :
- `concept` : Nom du concept
- `explication` : Contexte culturel
- `liens` : Array de ressources externes

### **Métadonnées visuelles/audio**
- `emojis_associes` : Array d'émojis liés au gardien
- `couleur_theme` : Code hex pour le thème visuel
- `musique_suggeree` : Type de sons/musique

## 🎨 Éléments disponibles

Les gardiens peuvent avoir un des éléments suivants :
- `air` : Vent, souffle, légèreté
- `water` : Eau, fluidité, profondeur
- `fire` : Feu, chaleur, transformation
- `earth` : Terre, ancrage, stabilité
- `ice` : Glace, repos, hibernation
- `aurora` : Aurore boréale, lumière, magie
- `light` : Lumière, clarté, guidance
- `animal` : Esprit animal, instinct, force

## 📝 Comment ajouter une nouvelle Lune

1. **Copier le template** : `_template_lune.json`
2. **Renommer** : `luneX.json` (X = numéro 4-12)
3. **Remplir les données** :
   - Choisir un gardien inuit authentique
   - Écrire des sagesses sur le sommeil/rêves
   - Créer un rituel pratique (5-10 minutes)
   - Composer un script onirique poétique
   - Ajouter 3 astuces chamaniques concrètes
   - Documenter le contexte culturel
4. **Valider le JSON** : Vérifier la syntaxe
5. **Tester** : L'app chargera automatiquement le nouveau contenu

## 🌍 Gardiens Inuits Suggérés (Lunes 4-12)

Voici des suggestions basées sur la mythologie inuite :

- **Lune 4** : **Alignak** (Lune/Éclipse) - Element: light
- **Lune 5** : **Pinga** (Déesse de la Chasse) - Element: animal
- **Lune 6** : **Malina** (Soleil) - Element: fire
- **Lune 7** : **Qailertetang** (Esprits du Temps) - Element: aurora
- **Lune 8** : **Tulugaak** (Corbeau Créateur) - Element: air
- **Lune 9** : **Tekkeitsertok** (Maître de la Terre) - Element: earth
- **Lune 10** : **Nerrivik** (Mère de la Mer) - Element: water
- **Lune 11** : **Kadlu** (Déesse du Tonnerre) - Element: air
- **Lune 12** : **Aningan** (Frère Lune) - Element: light

## 🔧 Utilisation dans le code

```javascript
// Charger dynamiquement une lune
import lune1 from './voyages/inuit/lune1.json'
import lune2 from './voyages/inuit/lune2.json'
// etc.

// Ou avec import dynamique
const luneData = await import(`./voyages/inuit/lune${moonIndex}.json`)
```

## ✨ Conseils de rédaction

### Sagesses
- Utiliser un ton chaleureux et sage
- Relier sommeil/rêves à la nature
- Éviter le jargon, rester accessible
- Intégrer la philosophie inuite authentique

### Rituels
- Étapes claires et simples (5-7 étapes max)
- Durée réaliste (5-10 minutes)
- Techniques corporelles ou respiratoires
- Testables immédiatement

### Scripts Oniriques
- Format poétique court (4-8 vers)
- Rythme apaisant avec retours à la ligne
- Images de nature (glace, mer, ciel, animaux)
- Vocabulaire doux et régénérateur

### Astuces Chamaniques
- Techniques concrètes et pratiques
- Basées sur des traditions réelles si possible
- Applicables avant le coucher
- Variées (respiration, visualisation, mouvement, son)

## 📚 Ressources pour la création

- Mythologie inuite authentique
- Pratiques chamaniques traditionnelles
- Techniques de sommeil validées (respiration, relaxation progressive...)
- Poésie inuite et chants traditionnels
- Connexion à la nature arctique

## 🚀 Prochains Voyages

### Berbère (futur)
- 12 lunes liées au Sahara, aux oasis, aux étoiles
- Gardiens : Djinns, esprits du désert, ancêtres berbères
- Éléments : sable, étoiles, palmier, eau rare

### Druidique (futur)
- 12 lunes liées aux saisons celtiques
- Gardiens : Esprits de la forêt, druides anciens
- Éléments : chêne, gui, sources sacrées, feu sacré

---

**Note** : Respecter l'authenticité culturelle tout en adaptant pour le bien-être moderne du sommeil et des rêves.
