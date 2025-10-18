# Onimoji Voyages - Agence de Voyages Spatio-Temporels Oniriques

## Overview
Onimoji Voyages est une agence de voyages spatio-temporels qui emmène les utilisateurs explorer les cultures oniriques du monde entier. À travers des voyages initiatiques en 12 étapes, les voyageurs rencontrent 12 guides ancestraux de chaque culture, découvrent des pratiques mill\u00e9naires et enrichissent leur santé onirique.

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
- **Multi-Voyages Culturels**: 3 voyages disponibles (Inuit débloqué, Berbère et Celtique à venir)
- **12 Guides par Voyage**: Chaque culture propose 12 gardiens ancestraux à rencontrer progressivement
- **Progression par Lunes**: Système de 12 étapes débloquant les guides au fur et à mesure
- **Enseignements Ancestraux**: Chaque guide transmet une sagesse, une pratique et un enseignement
- **Tirage Triangle Sacré**: Sélection de 3 émojis liés aux symboles du guide actuel
- **Cosmoji Hublot**: Visualisation du réseau collectif via graphe D3.js
  - Hublot circulaire montrant les émojis et leurs connexions
  - Occurrences = taille des nœuds, co-occurrences = épaisseur des liens
  - Statistiques du voyage collectif (étoiles, voyageurs, triangles)
- **Forum Cadavre Exquis**: Système de co-création d'étoiles oniriques collaboratives
  - Ciel étoilé interactif avec étoiles cliquables
  - Enrichissement progressif par ajout de triangles et textes
  - Implosion en microcosmoji (10+ contributions) créant de nouveaux émojis
- **Design Minimaliste**: Interface épurée, fluide et poétique

## User Journey
Flow progressif en 12 étapes :
1. **Accueil** - Découvrir les voyages disponibles (Inuit débloqué, Berbère et Celtique à venir)
2. **Choisir un voyage** - Sélectionner une culture onirique à explorer
3. **Rencontrer le guide actuel** - Découvrir le gardien de la lune en cours (1-12)
4. **Recevoir l'enseignement** - Apprendre une pratique onirique ancestrale
5. **Tirer ses émojis** - Sélectionner 3 émojis sacrés liés au guide
6. **Compléter l'étape** - Valider la lune et passer au guide suivant
7. **Explorer le Cosmoji** - Visualiser le réseau collectif des émojis
8. **Forum** - Co-créer des étoiles Onimoji (système cadavre exquis onirique)

## Navigation System
Navigation simplifiée avec 5 pages principales :
- **🏠 Accueil** - Agence de voyages et sélection des voyages
- **❄️ Voyage** - Page du voyage en cours avec les 12 guides progressifs
- **🔮 Tirage** - Sélection des 3 émojis sacrés
- **🔭 Cosmoji** - Hublot de visualisation du réseau collectif
- **⭐ Forum** - Communauté et co-création d'étoiles Onimoji (cadavre exquis)

## Development
- Port: 5000 (frontend)
- Dev server: Vite with HMR, allowedHosts: true
- Commands:
  - `npm run dev` - Start development server
  - `npm run build` - Build for production
  - `npm run preview` - Preview production build

## Data Architecture
- Storage local pour :
  - Triangle sélectionné (3 émojis)
  - Réponses aux énigmes
  - Scripts oniriques individuels (dreams)
  - Collaborations en cours (invitations, participants)
  - Étoiles Onimoji finalisées (stars)
  - User profile (nom, id)

## Recent Changes (Oct 2025)
### 🌌 Pivot majeur : Agence de Voyages Spatio-Temporels Oniriques
- ✅ **Nouveau concept** : Agence de voyages vers des univers oniriques culturels
- ✅ **Retour du système 12 lunes** : Progression en 12 étapes par voyage
- ✅ **3 Voyages** : Inuit (disponible), Berbère (à venir), Celtique (à venir)
- ✅ **12 Guides Inuits** : Gardiens ancestraux avec enseignements, pratiques et sagesses
  - Nanook, Sila, Sedna, Kaila, Amarok, Aningan, Pinga, Tulugaq, Kiviuq, Torngarsuk, Nuliajuk, Anirniq
- ✅ **Page d'accueil refaite** : Présentation de l'agence et des voyages disponibles
- ✅ **Page Voyage Inuit** : 
  - Visualisation du guide actuel avec son histoire et son enseignement
  - Barre de progression des 12 lunes
  - Timeline cliquable des 12 guides (débloqués progressivement)
  - Modal de détail pour chaque guide rencontré
- ✅ **Forum Cadavre Exquis** : Ciel étoilé avec enrichissement progressif
  - Création d'étoiles avec amorce du guide
  - Enrichissement libre par triangles + textes successifs
  - Concept microcosmoji (implosion à 10+ contributions)
- ✅ **Page Cosmoji** : Hublot de visualisation du réseau collectif
- ✅ **Navigation simplifiée** : 5 pages principales

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
Onimoji Voyages valorise :
- **La santé onirique** : Prendre soin de ses rêves comme de sa santé physique
- **La diversité culturelle** : Chaque culture a ses propres sagesses oniriques millénaires
- **La transmission vivante** : Rencontrer des guides qui enseignent des pratiques authentiques
- **La progression initiatique** : Avancer pas à pas à travers 12 étapes symboliques
- **La co-création** : Enrichir collectivement les étoiles oniriques (cadavre exquis)
- **La simplicité** : Interface épurée, fluide, poétique
- **L'exploration culturelle** : Voyager dans différents univers oniriques du monde
