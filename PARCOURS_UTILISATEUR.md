# Parcours Utilisateur Unifié - Onimoji

## 🌙 Flux linéaire simplifié

### **ÉTAPE 1 : Arrivée et découverte** 
📍 **Page : `/` (Home)**

**Ce qui se passe :**
- L'utilisateur arrive sur l'application
- **Modal d'onboarding** (première visite uniquement) :
  ```
  ┌─────────────────────────────────────┐
  │ 🌌✨🌙                              │
  │ Bienvenue dans Onimoji              │
  │                                     │
  │ 🚀 Montez à bord                    │
  │ ✨ Choisissez 3 émojis              │
  │ ✧ Rencontrez un gardien            │
  │ 📜 Recevez votre script onirique    │
  │                                     │
  │ [✨ Commencer mon voyage]            │
  └─────────────────────────────────────┘
  ```
- **But clair** : Cultiver votre univers onirique avec la sagesse chamanique inuite
- **CTA** : "🚀 Commencer le voyage Inuit"

---

### **ÉTAPE 2 : Inscription au voyage**
📍 **Page : `/voyage/inuit`**

**Ce qui se passe :**
- Présentation du voyage Inuit (12 lunes, gardiens, ressources culturelles)
- **Si pas encore inscrit** : Bouton "✨ S'inscrire et monter à bord"
  - Modal d'inscription s'ouvre
  - Formulaire simple : "Votre nom de voyageur"
  - Validation → Sauvegarde locale → Redirection automatique vers `/navette`
- **Si déjà inscrit** : Bouton "🚀 Monter à bord" (direct vers `/navette`)

**État utilisateur** : ✅ Inscrit avec nom de voyageur

---

### **ÉTAPE 3 : Dans la navette - Le hublot Cosmoji**
📍 **Page : `/navette`**

**Ce qui se passe :**
- **Protection** : Si pas inscrit → Redirection automatique vers `/voyage/inuit`
- Message de bienvenue personnalisé : "🌙 Bienvenue à bord, [Nom] !"
- **Guide pas à pas visible** :
  ```
  [1] Choisir 3 émojis ✨ ← VOUS ÊTES ICI
  [2] Créer votre haïku 🌙
  [3] Rencontrer le gardien ✧
  ```
- **Panneau de sélection** : 3 slots pour les émojis
- **Réseau Cosmoji** : Visualisation interactive
  - Taille = popularité dans la communauté
  - Liens = co-occurrences fréquentes
  - Couleurs par élément (Air, Eau, Feu, Terre, Glace, Aurore)
- **Sélection** : Clic sur 3 émojis → Apparaissent en vert brillant dans le réseau + dans les slots
- **Validation** : Bouton "✨ Valider et continuer" → `/lune`

**État utilisateur** : ✅ 3 émojis sélectionnés et sauvegardés

---

### **ÉTAPE 4 : Création du haïku**
📍 **Page : `/lune`**

**Ce qui se passe :**
- Affichage de la **Lune en cours** (ex: Lune 1/12 : "Sila, le souffle")
- Les **3 émojis sélectionnés** apparaissent en grand
- **Génération automatique** d'un haïku basé sur :
  - Les 3 émojis
  - Le corpus poétique inuit
  - La lune en cours
- **Actions** :
  - 🔄 Regénérer (autant de fois que souhaité)
  - 💾 Sauvegarder
  - ✧ "Rencontrer le gardien" → `/guardian`

**État utilisateur** : ✅ Haïku créé (sauvegardé optionnellement)

---

### **ÉTAPE 5 : Rencontre chamanique avec le gardien**
📍 **Page : `/guardian`**

**Ce qui se passe :**
- **Sélection du gardien** : Choisi automatiquement selon :
  - Les 3 émojis sélectionnés
  - La lune en cours
  - L'élément dominant
- **Présentation du gardien** :
  ```
  ┌─────────────────────────────────────┐
  │ 🐋 Sedna, Déesse de la Mer          │
  │ Élément : Eau                       │
  │                                     │
  │ "Les profondeurs abritent autant   │
  │  de mystères que de trésors..."     │
  │                                     │
  │ Vos émojis : 🌊 🐚 🌙               │
  └─────────────────────────────────────┘
  ```
- **Sagesses chamaniques** :
  - Message du gardien
  - Astuces pour le sommeil et les rêves
  - Rituel de nuit spécifique

---

### **ÉTAPE 6 : Écriture des sensations positives**
📍 **Page : `/guardian` (section interactive)**

**Ce qui se passe :**
- Le gardien invite : "Écris les sensations positives que t'inspirent ces 3 émojis"
- **Champ de texte libre** avec guidance :
  ```
  ┌─────────────────────────────────────┐
  │ 📝 Qu'évoquent pour toi...          │
  │                                     │
  │ 🌊 La vague qui berce ?             │
  │ 🐚 Le coquillage qui résonne ?      │
  │ 🌙 La lune qui apaise ?             │
  │                                     │
  │ [Zone de texte libre]               │
  │                                     │
  │ Exemples : calme • fluidité •       │
  │ douceur • connexion • paix          │
  └─────────────────────────────────────┘
  ```
- **Validation** → Texte sauvegardé

---

### **ÉTAPE 7 : Réception du script onirique régénérateur**
📍 **Page : `/guardian` (après écriture) ou nouvelle page `/script-onirique`**

**Ce qui se passe :**
- Le gardien **offre un script onirique** personnalisé :
  ```
  ┌─────────────────────────────────────┐
  │ 📜 Ton Script Onirique              │
  │ Offert par Sedna                    │
  │                                     │
  │ Avant de dormir, répète :           │
  │                                     │
  │ "Je m'abandonne aux vagues          │
  │  du sommeil 🌊                      │
  │  Mon esprit résonne comme           │
  │  un coquillage 🐚                   │
  │  La lune guide mes rêves            │
  │  vers des rivages paisibles 🌙"     │
  │                                     │
  │ [💾 Sauvegarder] [🔗 Partager]      │
  └─────────────────────────────────────┘
  ```
- **Actions** :
  - Sauvegarder dans le profil
  - Partager à la communauté (optionnel)
  - **Collecter une graine d'étoile** → Action automatique :
    - Graine ajoutée au Jardin du Rêve
    - Émojis ajoutés au Cosmoji collectif
    - Progression Lune 1 → Lune 2

---

### **ÉTAPE 8 : Impact sur le Cosmoji collectif**
📍 **Page : `/cosmoji` ou retour au `/navette`**

**Ce qui se passe :**
- **Feedback visuel** :
  ```
  ┌─────────────────────────────────────┐
  │ ✨ Vos 3 émojis ont rejoint         │
  │    le Cosmoji collectif !           │
  │                                     │
  │ [Animation : émojis qui s'ajoutent  │
  │  au réseau avec effet de lumière]   │
  │                                     │
  │ Le réseau évolue grâce à vous 💫    │
  └─────────────────────────────────────┘
  ```
- **Visualisation** :
  - Les nouveaux émojis apparaissent dans le réseau
  - Leurs connexions se créent
  - Statistiques mises à jour en temps réel
- **Invitation** :
  - "Continuer vers la Lune 2" (si moins de 12 lunes complétées)
  - "Voir votre Jardin du Rêve" → `/dreamgarden`

---

## 📊 Récapitulatif du flux

```
Home (onboarding)
    ↓
Voyage Inuit (inscription)
    ↓
Navette (sélection 3 émojis dans le hublot Cosmoji)
    ↓
Lune (génération haïku)
    ↓
Guardian (rencontre chaman)
    ↓
Guardian (écriture sensations)
    ↓
Guardian (réception script onirique)
    ↓
Cosmoji (visualisation de l'impact collectif)
    ↓
[Retour à Navette pour Lune suivante]
```

---

## 🎯 Points clés

### **UNE SEULE inscription**
- Lieu : Page `/voyage/inuit`
- Moment : Avant de monter dans la navette
- Pas de duplication ailleurs

### **Navigation protégée**
- `/navette` → Redirige vers `/voyage/inuit` si pas inscrit
- `/guardian` → Accessible seulement après sélection d'émojis

### **Progression claire**
- Indicateur visible : "Lune X/12"
- Guide pas à pas sur chaque page
- Étapes verrouillées jusqu'à complétion de la précédente

### **Personnalisation**
- Nom du voyageur affiché partout
- Gardien choisi selon émojis + lune
- Script onirique unique à chaque rencontre

---

## 🔧 État technique

### LocalStorage utilisé
```javascript
{
  user: { id, name },
  moon_index: 1-12,
  selected_triplet: [emoji1, emoji2, emoji3],
  star_seeds: [{ moon, guardianId, emojis, element }],
  dreams: [{ text, emojis, moon }],
  cosmoji_counts: { occurrence, cooccurrence }
}
```

### Navigation conditionnelle
- Home → Détecte si première visite (modal onboarding)
- VoyageInuit → Détecte si user existe (affiche inscription ou "monter à bord")
- Navette → Redirige si pas de user
- Guardian → Accessible via Lune uniquement

---

## 🚀 Prochaine implémentation

1. ✅ Home avec modal onboarding
2. ✅ VoyageInuit avec inscription unique
3. ✅ Navette protégée + sélection émojis
4. ⏳ Guardian transformé en rencontre chamanique
5. ⏳ Ajout de l'écriture des sensations
6. ⏳ Génération du script onirique régénérateur
7. ⏳ Visualisation de l'impact sur le Cosmoji collectif
