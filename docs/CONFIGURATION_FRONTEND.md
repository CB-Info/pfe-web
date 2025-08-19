### Configuration frontend (Vite + variables d'environnement)

Cette page recense uniquement les variables et scripts réellement utilisés par le front.

## Variables d'environnement (relevées dans le code)

- Préfixe Vite: `VITE_...` (exposées au client) 
- Obligatoires (vu dans `src/config/firebase.config.ts` et `scripts/validate-env.cjs`):
  - `VITE_FIREBASE_API_KEY`
  - `VITE_FIREBASE_AUTH_DOMAIN`
  - `VITE_FIREBASE_PROJECT_ID`
  - `VITE_FIREBASE_STORAGE_BUCKET`
  - `VITE_FIREBASE_MESSAGING_SENDER_ID`
  - `VITE_FIREBASE_APP_ID`
  - `VITE_API_BASE_URL` (ex: `http://localhost:3000/api`)
- Optionnelles:
  - `VITE_FIREBASE_MEASUREMENT_ID`
  - `VITE_RECAPTCHA_SITE_KEY` (App Check en production)
  - `NODE_ENV` (pilotage App Check prod/dev)

Le script `npm run validate-env` vérifie `.env` localement (non exigé en CI) et valide le format d'URL pour `VITE_API_BASE_URL`.

Exemple `.env` (sans secret sensible):

```bash
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
VITE_API_BASE_URL=http://localhost:3000/api
# Optionnel
VITE_FIREBASE_MEASUREMENT_ID=G-XXXX
VITE_RECAPTCHA_SITE_KEY=...
```

## Où les définir

- Local: créer `.env` à la racine (voir `.env.example` auto‑généré par `postinstall`).
- Build/Prod (hébergeur): définir les mêmes variables (préfixe `VITE_`) dans le dashboard de l'hébergeur. Note: les clés Firebase Web ne sont pas secrètes côté client.

## Scripts NPM utiles

- `dev`: lance `validate-env` puis Vite dev server.
- `build`: `tsc && vite build` (génère `dist/` et `bundle-stats.html`).
- `preview`: prévisualiser le build.
- `lint`: ESLint TS + hooks.
- `test`, `test:ui`, `test:coverage`: Vitest (jsdom) + UI.

## CORS et URL API

- Base API utilisée par les repositories: `VITE_API_BASE_URL`.
- Les requêtes incluent `Authorization: Bearer {Firebase ID token}`.
- S'assurer que le backend autorise l'origine front (CORS) et accepte les en‑têtes `Authorization`.

