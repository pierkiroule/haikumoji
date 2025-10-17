# Onimoji - Voyage Onirique

## Overview
Onimoji (also known as Haikumoji) is a poetic and therapeutic web application that guides users through a metaphorical journey based on Inuit mythology. Users select emojis to generate hypnoniris (hypnotic oneiric scripts) and progress through 12 sacred "lunes" (moons) encountering guardians and receiving personalized regenerative texts.

## Technology Stack
- **Frontend Framework**: React 18
- **Build Tool**: Vite 5
- **Routing**: React Router v6
- **Styling**: Tailwind CSS 3 with custom themes
- **Animations**: Framer Motion
- **Data Visualization**: D3.js
- **Language**: JavaScript (ES modules)

## Project Structure
```
src/
├── components/     # Reusable UI components (Navbar, MoonProgressWidget, modals, particles)
├── pages/         # Route pages (Home, VoyageInuit, Navette, Lune, Guardian, etc.)
├── utils/         # Utilities (hypnoniris generator, voyage flow, storage, loaders)
├── data/          # JSON data files for cosmoji, voyages, guardians, lunes
├── App.jsx        # Main app with routing
├── main.jsx       # Entry point
└── index.css      # Global styles
```

## Key Features
- **E-Learning Guided Flow**: Linear progression through 12 lunes with step-by-step guidance
- **Emoji Selection**: Users select exactly 3 emojis from a radar/cosmoji interface
- **Hypnoniris Generation**: AI-generated hypnotic oneiric scripts based on emojis, guardian, and element
- **Guardian Encounters**: Progress through 12 sacred lunes with Inuit mythology guides (Sila, Sedna, Nanook...)
- **Short Oneiric Scripts**: Personalized regenerative texts for meditation and sleep
- **Progress Tracking**: Visual progress widget showing Lune X/12 with completion stepper
- **Community Feed**: Share and discover onimoji creations
- **Modular Voyage System**: JSON-based architecture for different cultural themes

## User Journey
Each lune follows this guided flow:
1. **Navette** - Select 3 emojis from the Cosmoji radar
2. **Lune** - Generate hypnoniris (hypnotic script) based on emojis and guardian
3. **Guardian** - Encounter the guardian, write sensations, receive short script
4. **Collection** - Collect star seed, emojis enrich collective Cosmoji
5. **Next Lune** - Progress to next moon (2/12, 3/12, etc.)

## Navigation System
- **Intelligent Routing**: Automatically redirects users to the correct step
- **Ma Lune (X/12)**: Main navigation button that takes user to next step in journey
- **Protected Routes**: Users must complete steps in order (no skipping)
- **Progress Widget**: Always visible, shows current lune, progress %, and next step

## Development
- Port: 5000 (frontend)
- Dev server: Vite with HMR
- Commands:
  - `npm run dev` - Start development server
  - `npm run build` - Build for production
  - `npm run preview` - Preview production build

## Data Architecture
The app uses a modular JSON structure for voyages:
- Each voyage has a `voyage.config.json` with metadata and guardians
- Individual lunes are stored as separate JSON files
- Hypnoniris generator with element-based themes and guardian voices
- Template files available for creating new voyages

## Recent Changes (Oct 2025)
- ✅ Transformed from haiku to hypnoniris generation
- ✅ Implemented e-learning guided flow with progress tracking
- ✅ Created MoonProgressWidget with visual stepper
- ✅ Added intelligent navigation system (useVoyageFlow hook)
- ✅ Simplified Navbar with "Ma Lune (X/12)" button
- ✅ Enhanced Guardian page with 4-step encounter
- ✅ Integrated short script generation for sleep
- ✅ Fixed hypnoniris generation timing bug

## Setup History
- Configured Vite for Replit environment (port 5000, host 0.0.0.0)
- Set up HMR for WebSocket connections
- Created .gitignore for Node.js/Vite projects
- Configured deployment settings

## User Preferences
- French language interface
- Therapeutic and poetic tone
- Emphasis on accessibility and inclusive design
- Linear, guided e-learning experience
