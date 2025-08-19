### CI/CD frontend (réel)

Workflows présents dans `.github/workflows/`:

- `ci.yml` — pipeline CI
  - Jobs: setup cache, typecheck (tsc), lint (ESLint), test (Vitest), build (Vite), résumé taille du build; upload coverage via `codecov-action` (sans seuil bloquant).
- `pr-validation.yml` — analyse de PR
  - Collecte de métriques taille PR (fichiers/lignes), seuils adaptatifs, résumé dans `GITHUB_STEP_SUMMARY`.
- `security.yml` — audit sécurité
  - `npm audit` (niveau high), liste packages obsolètes, `semgrep` avec règles TS/JS/react/security.

Améliorations futures (non implémentées):
- Publier artefacts de couverture (HTML) et bundle stats (`bundle-stats.html`).
- Étape Lighthouse CI (si environnement de preview dispo).

Note: aucun job de déploiement n'est défini ici.

