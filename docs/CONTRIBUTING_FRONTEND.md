### Contribution (frontend)

## Conventions

- Nommage composants: PascalCase, un composant par fichier.
- Hooks: préfixe `use`, camelCase.
- Types/DTO/Models: PascalCase, suffixes explicites (`Dto`, `Model`).
- Styles: classes Tailwind dans JSX; tokens via `tailwind.config.cjs`; thèmes via `applications/theme/theme.ts`.
- Commits: conventional commits (aligné avec back si applicable).

## Checklist PR UI

- [ ] Lint/Typecheck OK (`npm run lint`, `npx tsc --noEmit`).
- [ ] Tests unitaires pertinents ajoutés/ajustés (`npm test`).
- [ ] Screenshots si des composants visibles changent.
- [ ] Accessibilité rapide: focus visible, labels, clavier sur modals.
- [ ] Pas de secrets dans le code; variables via `.env` (`VITE_*`).

## Démarrage local

```bash
npm ci
cp .env.example .env # remplir les valeurs
npm run validate-env
npm run dev
```

