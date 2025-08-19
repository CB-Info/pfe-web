# Bugs Frontend — C2.3.2

## Anomalies Connues

### Bugs Actifs

| ID | Description | Sévérité | Statut | Découvert | Assigné |
|----|-------------|----------|--------|-----------|---------|
| FE-001 | Vitest non trouvé lors de l'exécution des tests | Moyenne | Ouvert | 2024-01 | - |
| FE-002 | Menu mobile ne se ferme pas sur navigation | Faible | Ouvert | 2024-01 | - |

### Détails des Bugs

#### FE-001 : Vitest non trouvé

**Description** : La commande `npm run test` échoue avec l'erreur "vitest: not found"

**Reproduction** :
1. Cloner le projet
2. Exécuter `npm install`
3. Exécuter `npm run test`

**Comportement attendu** : Les tests devraient s'exécuter

**Comportement actuel** : Erreur "sh: 1: vitest: not found"

**Solution temporaire** : Réinstaller les dépendances ou vérifier la présence de vitest dans node_modules

**Fix proposé** : Vérifier les dépendances et la configuration npm

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

| Feature | Description | Statut | Priorité |
|---------|-------------|--------|----------|
| PWA | Application Progressive Web App | Non planifié | Basse |
| GraphQL | API GraphQL au lieu de REST | Non planifié | Basse |
| WebSockets | Temps réel pour notifications | Planifié Q2 | Moyenne |
| Multi-langue | Support i18n | Planifié Q3 | Moyenne |
| Offline Mode | Fonctionnement hors ligne | Non planifié | Basse |

## Bugs Résolus

| ID | Description | Résolu | Version | PR/Commit |
|----|-------------|--------|---------|-----------|
| - | Aucun bug résolu documenté à ce jour | - | - | - |

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
- Edge 120+ ✓

### Non Testé
- Safari mobile
- Navigateurs anciens (< 2 ans)
- Mode compatibilité IE

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

1. [ ] Résoudre FE-001 (Vitest)
2. [ ] Fix FE-002 (Menu mobile)
3. [ ] Audit d'accessibilité complet
4. [ ] Mesures de performance initiales
5. [ ] Tests cross-browser systématiques