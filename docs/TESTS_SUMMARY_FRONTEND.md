### Résumé des tests (réel)

Exécution locale:

- Fichiers de test: 6 passés
- Tests: 27 passés
- Durée: ~2.1s

Couverture:

- `npm run test:coverage` s'appuie sur `@vitest/coverage-v8`. Environnement CI/local peut nécessiter plus de temps; si non disponible au moment du run, marquer comme N/A.
- État actuel: N/A (lancement couverture long/timé-out dans cet environnement). TODO: exécuter `npm run test:coverage` en local ou CI et ajouter le pourcentage global + principaux dossiers.

Commandes utilisées:
```bash
npm ci
npm test -- --reporter=verbose --run
npm run test:coverage
```

TODO (daté):
- Ajouter un job coverage au workflow CI existant (ou artefacts HTML de couverture) — à planifier.

