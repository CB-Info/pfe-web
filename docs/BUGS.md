# Bugs Frontend — C2.3.2

## Anomalies Connues

### Bugs Actifs

| ID     | Description                                     | Sévérité | Statut    | Découvert | Résolu  | Assigné |
| ------ | ----------------------------------------------- | -------- | --------- | --------- | ------- | ------- |
| FE-001 | Vitest non trouvé lors de l'exécution des tests | Moyenne  | ✅ Résolu | 2025-08   | 2025-08 | -       |
| FE-002 | Menu mobile ne se ferme pas sur navigation      | Faible   | ✅ Résolu | 2025-07   | 2025-08 | -       |
| FE-003 | Erreurs TypeScript et ESLint dans les tests CI  | Moyenne  | ✅ Résolu | 2025-07   | 2025-08 | -       |

### Détails des Bugs

#### FE-001 : Vitest non trouvé ✅ RÉSOLU

**Description** : La commande `npm run test` échoue avec l'erreur "vitest: not found"

**Statut** : ✅ **RÉSOLU** - Les tests fonctionnent parfaitement

**Solution appliquée** :

- Vérification de l'installation des dépendances
- Configuration Vitest correctement configurée
- Tests s'exécutent avec succès (51/51 tests passent)
- Tests d'intégration et E2E implémentés (67 tests au total)
- Configuration TypeScript et ESLint corrigée pour les tests

**Vérification** :

```bash
npm run test
# ✓ 51 tests passed
npm run test:coverage
# ✓ Coverage report generated successfully
```

---

#### FE-002 : Menu mobile ne se ferme pas

**Description** : Sur mobile, après navigation vers une nouvelle page, le menu reste ouvert

**Reproduction** :

1. Ouvrir l'app sur mobile (< 768px)
2. Ouvrir le menu burger
3. Cliquer sur un lien de navigation

**Comportement attendu** : Le menu devrait se fermer automatiquement

**Comportement actuel** : Le menu reste ouvert, masquant le contenu

**Solution temporaire** : Cliquer sur l'overlay pour fermer

**Fix proposé** : Ajouter `onClose()` dans les handlers de navigation

## Features Non Implémentées (Hors Périmètre MVP)

| Feature      | Description                   | Statut       | Priorité |
| ------------ | ----------------------------- | ------------ | -------- |
| GraphQL      | API GraphQL au lieu de REST   | Non planifié | Basse    |
| WebSockets   | Temps réel pour notifications | Planifié Q2  | Moyenne  |
| Multi-langue | Support i18n                  | Planifié Q3  | Moyenne  |
| Offline Mode | Fonctionnement hors ligne     | Non planifié | Basse    |

## Bugs Résolus

| ID     | Description                                     | Résolu  | Version | PR/Commit              |
| ------ | ----------------------------------------------- | ------- | ------- | ---------------------- |
| FE-001 | Vitest non trouvé lors de l'exécution des tests | 2024-01 | 0.0.0   | Configuration corrigée |

## Problèmes de Performance

### Identifiés

1. **Bundle Size** : Pas d'analyse réalisée, visualizer configuré mais non utilisé
2. **Lazy Loading** : Implémenté pour les pages principales ✓
3. **Images** : Pas d'optimisation automatique configurée

### Non Confirmés

- Temps de chargement initial (à mesurer)
- Memory leaks potentiels (à investiguer)
- Re-renders excessifs (à profiler)

## Compatibilité Navigateurs

### Testé

- Chrome 120+ ✓
- Firefox 120+ ✓
- Safari 17+ (partiellement)

### Non Testé

- Safari mobile
- Navigateurs anciens (< 2 ans)

## Problèmes d'Accessibilité

### Connus

1. Contraste insuffisant sur certains boutons secondaires
2. Manque de labels ARIA sur certains éléments interactifs
3. Navigation au clavier incomplète dans les modales

### À Auditer

- Screen readers compatibility
- Focus management complet
- Color blind accessibility

## Problèmes de Sécurité

Aucune vulnérabilité critique connue. Dernière analyse :

- `npm audit` : 0 vulnérabilités critiques
- Dependabot actif pour les mises à jour

## Process de Signalement

### Pour signaler un bug

1. Vérifier qu'il n'est pas déjà listé
2. Créer une issue GitHub avec :
   - Description claire
   - Étapes de reproduction
   - Comportement attendu vs actuel
   - Screenshots si pertinent
   - Environnement (OS, navigateur, version)

### Template d'Issue

```markdown
## Description

[Description claire du problème]

## Étapes de reproduction

1. ...
2. ...
3. ...

## Comportement attendu

[Ce qui devrait se passer]

## Comportement actuel

[Ce qui se passe réellement]

## Environnement

- OS:
- Navigateur:
- Version:

## Screenshots

[Si applicable]
```

## Priorisation

- **Critique** : Bloque l'utilisation, perte de données
- **Haute** : Fonction majeure impactée
- **Moyenne** : Contournement possible
- **Faible** : Cosmétique ou mineur

## Prochaines Actions

1. [ ] Audit d'accessibilité complet
2. [ ] Mesures de performance initiales
3. [ ] Tests cross-browser systématiques
