# Onimoji - Rituel Quotidien de Santé Onirique

## Overview
Onimoji est une application de rituel quotidien qui aide les utilisateurs à cultiver leur santé onirique en créant une résonance entre l'inspiration poétique du jour et les rêves de la nuit. Cueillez votre triangle emoji quotidien, amorcez une phrase poétique, et tissez des étoiles oniriques collaboratives avec la communauté.

## Technology Stack
- **Frontend Framework**: React 18
- **Build Tool**: Vite 5
- **Routing**: React Router v6
- **Styling**: Tailwind CSS 3 with custom themes
- **Animations**: Framer Motion
- **Data Visualization**: D3.js (pour le radar Cosmoji)
- **Language**: JavaScript (ES modules)

## Project Structure
```
src/
├── components/     # Reusable UI components (NavbarSimple, RadarCosmoji, OnimojiTriad, particles)
├── pages/         # Route pages (HomeSimple, Tirage, Enigmes, Initiation, Forum)
├── utils/         # Utilities (storage, cosmoji stats)
├── data/          # JSON data files for cosmoji
├── App.jsx        # Main app with routing
├── main.jsx       # Entry point
└── index.css      # Global styles
```

## Key Features
- **Rituel Quotidien**: Cueillez votre triangle emoji du jour et amorcez une phrase poétique
- **Triangle Partageable**: 3 émojis qui résonnent avec votre état présent
- **Phrase d'Amorce**: Point de départ pour tisser des étoiles oniriques
- **Étoiles Collaboratives**: Superposez vos triangles et textes pour co-créer des étoiles
  - Ciel étoilé interactif avec étoiles cliquables
  - Enrichissement progressif par ajout de contributions
  - Cycle de vie: création → maturation → explosion → réincarnation en emoji inédit
- **Observatoire Cosmoji**: Visualisation du réseau collectif via graphe D3.js
  - Hublot circulaire montrant les émojis et leurs connexions
  - Occurrences = taille des nœuds, co-occurrences = épaisseur des liens
  - Statistiques du réseau collectif (étoiles, voyageurs, triangles)
- **Esprit du Cosmoji (IA)**: Intelligence artificielle bienveillante qui:
  - Repère les étoiles riches, denses et cohérentes
  - Génère des PDFs illustrés pour les contributeurs
  - Stocke dans l'atlas personnel
  - Gère la réincarnation des étoiles en nouveaux emojis
- **Design Minimaliste**: Interface épurée, fluide et poétique

## User Journey
Flow quotidien simple et puissant :
1. **Accueil** - Découvrir le rituel quotidien
2. **Cueillir Triangle** - Sélectionner 3 émojis qui résonnent avec soi
3. **Amorcer Phrase** - Écrire une phrase poétique inspirante
4. **Tisser Étoiles** - Contribuer aux étoiles oniriques collaboratives
5. **Observer Cosmoji** - Visualiser le réseau vivant d'énergie onirique
6. **Recevoir PDFs** - L'IA offre des textes illustrés pour les étoiles riches
7. **Nouveau Jour** - Recommencer le rituel avec un nouveau triangle

## Navigation System
Navigation minimaliste avec 4 pages principales :
- **🏠 Accueil** - Rituel quotidien (triangle + phrase d'amorce)
- **🔮 Tirage** - Cueillir les 3 émojis du jour
- **⭐ Étoiles** - Ciel collaboratif de co-création
- **🔭 Cosmoji** - Observatoire du réseau collectif vivant

## Development
- Port: 5000 (frontend)
- Dev server: Vite with HMR, allowedHosts: true
- Commands:
  - `npm run dev` - Start development server
  - `npm run build` - Build for production
  - `npm run preview` - Preview production build

## Data Architecture
- Storage local pour :
  - **Ritual Sessions**: Triangle + phrase d'amorce quotidienne (date, triangle, seedPhrase)
  - **Stars**: Étoiles collaboratives (contributions, status, lifecycle)
  - **Cosmoji Counts**: Statistiques réseau (occurrences, co-occurrences)
  - **User Profile**: Nom, ID
  - **Atlas PDFs** (à venir): Métadonnées des PDFs générés par l'IA

## Recent Changes (Oct 2025)
### 🌙 Simplification radicale : Rituel Quotidien de Santé Onirique
- ✅ **Nouveau concept** : Rituel quotidien simple et puissant
- ✅ **Nettoyage legacy** : Suppression voyages, 12 lunes, guides, énigmes, /profile
- ✅ **Page d'accueil réinventée** : Hub du rituel quotidien
  - Cueillez votre triangle emoji du jour (disposition triangle : 1 en haut, 2 en bas)
  - Amorcez une phrase poétique inspirante
  - Visualisez votre rituel (triangle + amorce)
  - CTA vers Étoiles et Tirage
- ✅ **Storage adapté** : Modèle ritualSession quotidien
  - getRitualSessions(), saveRitualSession(), getTodayRitual()
  - Date-based sessions avec triangle + seedPhrase
  - Nettoyage complet moonIndex/starSeeds legacy
- ✅ **Routes simplifiées** : /, /tirage, /etoiles, /cosmoji
- ✅ **Navigation épurée** : 4 onglets principaux

### 🌟 Esprits Guides Culturels (Oct 18, 2025)
- ✅ **SpiritModal carrousel** : 4 slides (citation, présentation, quiz, rituel)
  - Slide 1: Citation onirique + HypnoticOrb animé (Stargate)
  - Slide 2: Présentation culturelle de l'esprit
  - Slide 3: Mini quiz interactif 3 questions
  - Slide 4: Rituel de santé onirique à pratiquer
- ✅ **5 Esprits Guides** :
  - Qilak (Inuit) - Gardien du ciel nocturne
  - Anansi (Akan) - Tisseuse de récits
  - Morpheus (Matrix) - Guide du rêve lucide
  - Shéhérazade (Perse) - Conteuse des Mille et Une Nuits
  - Link (Zelda) - Héros des donjons oniriques
- ✅ **Sélection déterministe** : Esprit choisi selon hash du triangle
- ✅ **Bouton "Rencontrer l'esprit"** : Accessible depuis page d'accueil

### 🎁 Système Kdomoji - Cadeaux du Cosmoji (Oct 18, 2025)
- ✅ **Notifications animées** : Toast avec particules, auto-dismiss 8s
- ✅ **Raretés visuelles** : common, rare, epic, legendary (couleurs/glow)
- ✅ **8 Types de cadeaux** :
  - Chant de Rêve Inuit (audio)
  - Tissu de Rêve Akan (visuel)
  - Code du Rêve Lucide Matrix (technique)
  - Poème des Mille et Une Nuits (texte)
  - Bouclier Onirique Zelda (technique)
  - Achievements (Naissance Étoile, Voyageur Assidu, Tisserand Mondial)
- ✅ **Triggers automatiques** :
  - Premier triangle cueilli
  - Première contribution étoile
  - 3 rituels quotidiens
  - 5 étoiles créées
  - 7 jours consécutifs
  - 5 esprits rencontrés
  - Quiz complété
- ✅ **KdomojiProvider global** : Queue de notifications, gestion viewed/received
- ✅ **Modale détaillée** : Contexte culturel, description ressource

- ⏳ **À venir** : IA Esprit du Cosmoji (scoring étoiles, génération PDF)
- ⏳ **À venir** : Atlas personnel (bibliothèque PDFs + Kdomojis reçus)
- ⏳ **À venir** : Réincarnation emoji (étoile → nouvel emoji)

## Setup History
- Configured Vite for Replit environment (port 5000, host 0.0.0.0, allowedHosts: true)
- Set up HMR for WebSocket connections
- Created .gitignore for Node.js/Vite projects
- Configured deployment settings

## User Preferences
- French language interface
- Therapeutic and poetic tone
- Minimalist, fluid, beautiful design ("au plus simple fluide joli")
- Linear guided experience
- Focus on dream health and collective co-creation

## Philosophy
Onimoji valorise :
- **La santé onirique** : Prendre soin de ses rêves comme de sa santé physique
- **La décentration** : Se libérer de l'injonction quantité/qualité de sommeil
- **La résonance** : Créer un pont quotidien entre poétique du jour et onirique de nuit
- **La simplicité radicale** : "Au plus simple fluide joli" - rituel minimaliste et puissant
- **La co-création** : Tisser collectivement les étoiles oniriques
- **L'IA bienveillante** : Esprit du Cosmoji qui enrichit sans imposer
- **Le cycle de vie** : Création → maturation → explosion → réincarnation
- **Les gardiens psychoculturels** : Préserver les cultures oniriques du monde
- **La gratitude du Cosmoji** : Le réseau vivant remercie ses gardiens par des cadeaux (Kdomojis)
