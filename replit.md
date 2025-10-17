# Onimoji - Voyage Onirique

## Overview
Onimoji (also known as Haikumoji) is a poetic and therapeutic web application that guides users through a metaphorical journey based on Inuit mythology. Users select emojis to generate haikus and progress through sacred "lunes" (moons) encountering guardians and receiving personalized oneiric scripts.

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
├── components/     # Reusable UI components (Navbar, cards, modals, particles)
├── pages/         # Route pages (Home, Create, Community, Cosmoji, Guardian, etc.)
├── utils/         # Utilities (AI mock, config, storage, voyage loaders)
├── data/          # JSON data files for cosmoji, voyages, guardians, lunes
├── App.jsx        # Main app with routing
├── main.jsx       # Entry point
└── index.css      # Global styles
```

## Key Features
- **Emoji Selection**: Users select exactly 3 emojis from a radar/cosmoji interface
- **Haiku Generation**: AI-assisted generation of 3-line poems based on selected emojis
- **Guardian Encounters**: Progress through 12 sacred "lunes" with Inuit mythology guides
- **Oneiric Scripts**: Personalized regenerative texts for meditation and dreams
- **Community Feed**: Share and discover onimoji creations
- **Modular Voyage System**: JSON-based architecture for different cultural themes

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
- Template files available for creating new voyages

## Recent Setup (Oct 2025)
- Configured Vite for Replit environment (port 5000, host 0.0.0.0)
- Set up HMR for WebSocket connections
- Created .gitignore for Node.js/Vite projects
- Configured deployment settings

## User Preferences
- French language interface
- Therapeutic and poetic tone
- Emphasis on accessibility and inclusive design
