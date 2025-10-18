# Onimoji - Voyage Onirique Minimaliste

## Overview
Onimoji est une application poétique et thérapeutique qui guide l'utilisateur à travers un voyage onirique simplifié. Les utilisateurs tirent un triangle d'émojis du Cosmoji, rencontrent un esprit qui pose des énigmes, puis reçoivent une initiation et un script onirique personnalisé pour prendre soin de leur santé onirique.

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
- **Tirage Triangle Sacré**: Sélection de 3 émojis dans une grille interactive avec animation vibrante/dansante
- **Énigmes QCM**: L'esprit pose 3 questions pour comprendre l'utilisateur
- **Initiation du Guide**: Félicitations + enseignement sur la culture onirique + script personnalisé
- **Script Onirique Court**: Texte apaisant généré selon les réponses et le triangle
- **Étoiles Onimoji**: Système de co-création collaborative où plusieurs users superposent leurs triangles
  - **2 users** = Étoile à 6 branches (2 triangles superposés)
  - **3 users** = Étoile à 9 branches (3 triangles superposés)
  - **4 users** = Étoile à 12 branches (4 triangles superposés)
  - **5+ users** = Cercle Sacré (cercle d'émojis)
- **Co-création de textes**: Les participants tissent ensemble des scripts oniriques collaboratifs
- **Design Minimaliste**: Interface épurée, fluide et jolie

## User Journey
Flow linéaire simple :
1. **Accueil** - Présentation du concept
2. **Tirage** - Sélection de 3 émojis → Triangle vibre et danse
3. **Énigmes** - Répondre à 3 QCM de l'esprit
4. **Initiation** - Message du guide + script onirique personnalisé
5. **Forum** - Co-création d'étoiles Onimoji avec d'autres voyageurs
   - Créer une collaboration
   - Inviter d'autres users (ou accepter des invitations)
   - Superposer les triangles → visualisation géométrique
   - Tisser ensemble un script onirique collaboratif
   - Finaliser l'étoile pour la partager au forum

## Navigation System
Navigation simplifiée avec 3 pages principales :
- **🏠 Accueil** - Page d'introduction
- **🔮 Tirage** - Sélection des émojis
- **⭐ Forum** - Communauté et co-création d'étoiles Onimoji

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
- ✅ **Simplification majeure** : Suppression du système 12 lunes
- ✅ **Nouveau flow** : Tirage → Énigmes → Initiation → Forum
- ✅ **Animation triangle** : Triangle sacré qui vibre et danse (Framer Motion + SVG)
- ✅ **Système d'énigmes** : 3 QCM de l'esprit avec progression visuelle
- ✅ **Page Initiation** : Guide qui félicite et enseigne la culture onirique
- ✅ **Étoiles Onimoji** : Système de co-création collaborative multi-users
  - Visualisation géométrique : étoiles (2-4 users) ou cercle (5+ users)
  - Composant OnimojiStar avec animations Framer Motion
  - Gestion des collaborations, invitations, et finalisation
- ✅ **Page TirageSimple** : Grille d'émojis interactive (sans D3)
- ✅ **Design minimaliste** : Interface épurée, fluide, zen
- ✅ **Navigation simplifiée** : 3 pages principales uniquement

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
- **La co-création** : Enrichir collectivement les scripts oniriques
- **La simplicité** : Interface minimaliste, flow linéaire
- **La poésie** : Textes apaisants, métaphores douces
- **L'initiation** : Transmettre la culture onirique avec bienveillance
