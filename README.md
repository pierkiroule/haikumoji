# Onimoji – TagCatcher

Une webapp poétique et interactive en React + Vite (sans backend) pour composer une étoile à 5 émojis et 5 mots. L’étoile devient un petit réseau dans le "CosmoDream".

## Installation

```bash
npm install
npm run dev
```

- Dev: `http://localhost:5173`
- Build: `npm run build`
- Preview: `npm run preview`

## Structure

```
onimoji/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── pages/
    │    └── TagCatcherPage.jsx
    ├── components/
    │    └── TagCatcher.jsx ← composant principal
    │    └── tagcatcher/
    │         ├── drawScene.js
    │         ├── updateNodes.js
    │         └── useResponsiveCanvas.js
    ├── assets/
    └── index.css
```

## Usage rapide

- Visitez `/tagcatcher`.
- Cliquez 5 émojis flottants → l’étoile se fige.
- 5 points pulsants apparaissent → cliquez pour saisir des mots.
- Cliquez le centre pour nommer le rêve.
- Message final: "✨ Ton étoile est tissée !".

## Design

- Fond bleu nuit, réseau cyan clair.
- Police Poppins, interface centrée, transitions douces.

## Développement

- `TagCatcher.jsx` utilise un `<canvas>` et des hooks React.
- Rendu/animation extraits dans `drawScene.js` et `updateNodes.js`.
- Responsivité via `useResponsiveCanvas` (ratio par défaut 700×480).

## Roadmap

- Sauvegarde locale (localStorage) des étoiles créées
- Ciel personnel (galerie des créations)
- Phase communautaire (déposer des mots sur l’étoile d’autrui)
- Génération IA (poème/rituel) via Nebius / OpenAI

## Licence
MIT
