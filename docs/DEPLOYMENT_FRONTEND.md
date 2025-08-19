### Déploiement frontend

Hébergeur et pipeline: non spécifiés dans le dépôt. Aucune configuration Docker ou script de déploiement n'est présente dans ce repo.

Build de production:

```bash
npm run build
# Output: dist/ + bundle-stats.html (rapport visualizer)
```

Prévisualisation locale:

```bash
npm run preview
```

Variables d'env à fournir côté hébergeur:
- Voir `docs/CONFIGURATION_FRONTEND.md` (préfixe `VITE_...`).

Preuves à inclure dans le PDF (lorsqu'existantes):
- Capture Lighthouse (prod).
- Capture du dashboard de l'hébergeur (variables d'env, build logs).
- Extrait d'une exécution CI verte.

