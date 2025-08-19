### Stratégie de tests frontend

Outils réellement utilisés:
- Unit/UI: Vitest 3 + Testing Library (`@testing-library/react`, `@testing-library/jest-dom`), environnement `jsdom`.
- Config: dans `vite.config.ts` (`test.globals`, `environment: 'jsdom'`, `setupFiles: './src/setupTests.ts'`).

Pyramide actuelle:
- Tests unitaires et de composants UI ciblés (boutons, alert context, nav bar, utilitaires de tri/filtre).
- Pas d'E2E (Cypress/Playwright) détecté dans le repo.

Organisation:
- Dossier `src/tests/` avec fichiers `*.test.tsx/ts`.
- Nommage descriptif: `component.name.test.tsx`, `feature.utils.test.ts`.

Scripts npm:
- `npm test` — exécution des tests.
- `npm run test:ui` — interface UI de Vitest.
- `npm run test:coverage` — couverture (via `@vitest/coverage-v8`).

Plan minimal de consolidation (si besoin):
- Ajouter 1–2 tests RTL sur des composants critiques de formulaire (ex. `login.page` interactions: saisie, messages d'erreur, spinner, alerte échec).
- Ajouter 1 test d'intégration de page (`dishes.page`) vérifiant le rendu des états vides et l'application des filtres côté client via mocks repos.

