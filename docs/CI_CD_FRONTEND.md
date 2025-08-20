# CI/CD Frontend — C2.4.1

## Workflows GitHub Actions

Le projet utilise GitHub Actions pour l'intégration continue. Trois workflows principaux sont configurés :

### 1. CI Pipeline (`ci.yml`)

**Déclencheurs** :

- Push sur `main` et `develop`
- Pull requests vers `main` et `develop`
- Déclenchement manuel

**Jobs Parallèles** :

#### Setup Dependencies

```yaml
- Cache des dépendances npm
- Installation optimisée avec npm ci
- Partage du cache entre jobs
```

#### TypeScript Check

```yaml
- Vérification des types TypeScript
- `npx tsc --noEmit --skipLibCheck`
- Bloquant si erreurs de types
```

#### ESLint

```yaml
- Analyse de code statique
- Maximum 15 warnings autorisés
- Rapport des erreurs de sécurité
```

#### Tests

```yaml
- Exécution des tests Vitest (51 tests unitaires + intégration)
- Tests E2E avec Playwright (16 tests)
- Mode CI sans watch
- Rapport de couverture généré (14.52%)
- Variables d'environnement de test configurées
```

#### Build

```yaml
- Build de production Vite
- Vérification de la taille des bundles
- Upload des artifacts
```

### 2. PR Validation (`pr-validation.yml`)

**Déclencheurs** :

- Ouverture/mise à jour de PR
- Synchronisation de branches

**Validations** :

1. **Titre de PR** : Format conventional commits
2. **Description** : Non vide
3. **Taille** : Alerte si > 500 lignes
4. **Tests** : Obligatoires
5. **TypeScript** : Pas d'erreurs
6. **Lint** : Conformité ESLint

### 3. Security Scan (`security.yml`)

**Déclencheurs** :

- Schedule : Quotidien à 2h UTC
- Push sur branches principales
- Déclenchement manuel

**Analyses** :

- `npm audit` pour vulnérabilités
- Scan des secrets avec TruffleHog
- Analyse des dépendances
- Rapport SARIF pour GitHub Security

## Configuration des Jobs

### Variables d'Environnement

```yaml
env:
  NODE_VERSION: "20"
  CACHE_VERSION: v1
```

### Stratégie de Cache

1. **Dependencies** : `node_modules` + `.npm`
2. **Build artifacts** : `dist/`
3. **Test cache** : Résultats Vitest

### Parallélisation

Les jobs s'exécutent en parallèle après `setup` :

- TypeCheck : ~1 min
- Lint : ~1 min
- Tests : ~2 min
- Build : ~2 min

## Scripts NPM Utilisés

```json
{
  "lint": "eslint . --max-warnings 15",
  "test": "vitest",
  "build": "tsc && vite build",
  "ci:check": "npm run lint && npm run test && npm run build"
}
```

## Optimisations CI

### 1. Cache Intelligent

```yaml
key: ${{ runner.os }}-node-${{ hashFiles('package-lock.json') }}
restore-keys: |
  ${{ runner.os }}-node-
```

### 2. Jobs Conditionnels

- Skip si `[skip ci]` dans le commit
- Skip docs-only changes
- Matrix strategy pour multi-OS (futur)

### 3. Fail Fast

```yaml
strategy:
  fail-fast: true
```

## Artifacts

### Build Artifacts

```yaml
- name: Upload build artifacts
  uses: actions/upload-artifact@v4
  with:
    name: dist
    path: dist/
    retention-days: 7
```

### Rapports

- Coverage reports (quand tests fonctionnent)
- Bundle size analysis
- Lighthouse scores (planifié)

## Notifications

### Échecs de Build

- Commentaire automatique sur PR
- Badge de status dans README
- Notification par email (optionnel)

### Succès

- ✅ Check mark sur PR
- Merge autorisé
- Deploy triggers (si configuré)

## Sécurité CI

### Secrets Management

Variables sécurisées pour :

- `FIREBASE_*` (pour tests E2E futurs)
- `DEPLOY_TOKEN` (pour auto-deploy)
- `NPM_TOKEN` (si packages privés)

### Permissions

```yaml
permissions:
  contents: read
  pull-requests: write
  security-events: write
```

## Métriques CI

### Temps d'Exécution

- Setup : ~30s
- Jobs parallèles : ~2 min
- Total pipeline : ~3 min

### Taux de Succès

- Main branch : Viser 95%+
- PR : 100% requis pour merge

## Améliorations Futures

### Court Terme

1. **Fix Vitest** : Résoudre l'erreur d'exécution
2. **Coverage Reports** : Intégrer Codecov
3. **Bundle Analysis** : Commenter la taille sur PR

### Moyen Terme

1. **E2E Tests** : Ajouter Playwright
2. **Visual Tests** : Percy ou Chromatic
3. **Performance Budget** : Lighthouse CI

### Long Terme

1. **Multi-environnements** : Staging/Production
2. **Canary Deployments** : Progressive rollout
3. **A/B Testing** : Feature flags

## Debugging CI

### Logs Verbeux

```yaml
- run: npm ci --loglevel verbose
```

### SSH Debug

```yaml
- name: Setup tmate session
  uses: mxschmitt/action-tmate@v3
  if: ${{ failure() }}
```

### Re-run Jobs

- UI GitHub : "Re-run failed jobs"
- CLI : `gh run rerun <run-id>`

## Best Practices Appliquées

1. ✅ **DRY** : Réutilisation via needs/cache
2. ✅ **Fail Fast** : Erreurs bloquantes tôt
3. ✅ **Parallélisation** : Jobs indépendants
4. ✅ **Caching** : Dépendances persistées
5. ✅ **Security** : Scans automatiques
6. ⚠️ **Tests** : À réparer (Vitest)

## Commandes Utiles

```bash
# Vérifier workflow localement
act -l

# Simuler workflow
act push

# Debug un job spécifique
act -j lint

# Voir les runs
gh run list

# Voir les logs
gh run view <id> --log
```

## Documentation des Échecs

Si un job échoue :

1. Vérifier les logs détaillés
2. Reproduire localement
3. Fix et push
4. Vérifier la correction en CI

## Preuves pour PDF

À capturer :

1. **Workflows verts** sur main
2. **Badge CI** dans README
3. **Temps d'exécution** < 5 min
4. **Security scan** sans vulnérabilités critiques
