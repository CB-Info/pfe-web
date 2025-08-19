# Eatopia – Frontend (React + TS + Vite + Tailwind)

[![CI Pipeline](https://github.com/CB-Info/pfe-web/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/CB-Info/pfe-web/actions/workflows/ci.yml)
[![Security Scan](https://github.com/CB-Info/pfe-web/actions/workflows/security.yml/badge.svg)](https://github.com/CB-Info/pfe-web/actions/workflows/security.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat&logo=firebase&logoColor=black)](https://firebase.google.com/)

## Intro

Frontend ERP restaurants. Stack détectée: React 18 + TypeScript, Vite 7, Tailwind 3 + DaisyUI, Styled‑Components, React Router 6, Vitest.

## Scripts utiles

```bash
npm run dev        # démarre le serveur (avec validate-env)
npm run build      # build de production + bundle-stats.html
npm run preview    # prévisualiser le build
npm run lint       # ESLint
npm test           # tests unitaires (Vitest)
npm run test:ui    # UI Vitest
npm run test:coverage
```

## Configuration rapide

```bash
cp .env.example .env
# éditer VITE_* (Firebase + VITE_API_BASE_URL)
npm run validate-env
```

## Lien API backend

- Base URL côté front: `VITE_API_BASE_URL` (ex: http://localhost:3000/api)

## Documentation

- Architecture & évolutivité: `docs/ARCHITECTURE_FRONTEND.md`
- Configuration & exécution: `docs/CONFIGURATION_FRONTEND.md`
- Client API & sécurité front: `docs/API_CLIENT.md`, `docs/SECURITY_FRONTEND.md`
- Routing & state: `docs/ROUTING.md`, `docs/STATE_MANAGEMENT.md`
- UI guidelines: `docs/UI_GUIDELINES.md`
- Tests: `docs/TEST_STRATEGY_FRONTEND.md`, `docs/TESTS_SUMMARY_FRONTEND.md`
- Recettes & bugs: `docs/RECETTES_FRONTEND.md`, `docs/BUGS_FRONTEND.md`
- Déploiement & CI: `docs/DEPLOYMENT_FRONTEND.md`, `docs/CI_CD_FRONTEND.md`
- Accessibilité & performance: `docs/ACCESSIBILITY.md`, `docs/PERFORMANCE.md`
- Contribution: `docs/CONTRIBUTING_FRONTEND.md`

## Bugs connus (résumé)

- Couverture: exécution `test:coverage` à stabiliser selon environnement (voir doc tests).

## Déploiement (résumé)

- Pas de pipeline de déploiement dans ce repo. Build via `npm run build`; définir variables `VITE_*` sur l'hébergeur. Voir `docs/DEPLOYMENT_FRONTEND.md`.

## Bloc 2 – Références doc

- Architecture & évolutivité: `docs/ARCHITECTURE_FRONTEND.md` (C2.2.3)
- Configuration & exécution: `docs/CONFIGURATION_FRONTEND.md` (C2.4.1)
- Client API & sécurité front: `docs/API_CLIENT.md`, `docs/SECURITY_FRONTEND.md` (C2.2.3)
- Stratégie & résumé tests: `docs/TEST_STRATEGY_FRONTEND.md`, `docs/TESTS_SUMMARY_FRONTEND.md` (C2.2.2)
- Recettes UX & bugs: `docs/RECETTES_FRONTEND.md`, `docs/BUGS_FRONTEND.md` (C2.3.1 / C2.3.2)
- Déploiement & CI: `docs/DEPLOYMENT_FRONTEND.md`, `docs/CI_CD_FRONTEND.md` (C2.4.1)
- Accessibilité & performance: `docs/ACCESSIBILITY.md`, `docs/PERFORMANCE.md` (C2.2.3)
- Contribution: `docs/CONTRIBUTING_FRONTEND.md` (C2.2.3)
