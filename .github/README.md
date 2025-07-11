# Configuration CI/CD - Web ERP

Cette documentation explique la configuration CI/CD mise en place pour le projet Web ERP.

## 🚀 Workflows disponibles

### 1. CI Pipeline (`ci.yml`)
**Déclencheurs :** Push sur `main`/`develop`, Pull Requests  
**Durée estimée :** 5-8 minutes

#### Jobs exécutés en parallèle :
- **Setup** : Installation et cache des dépendances
- **TypeScript Check** : Validation des types TypeScript
- **ESLint** : Analyse de la qualité du code
- **Tests** : Exécution des tests unitaires avec couverture
- **Build** : Construction de l'application et vérification de la taille
- **Environment Validation** : Validation des variables d'environnement
- **Quality Gate** : Vérification finale du statut de tous les jobs

#### Fonctionnalités clés :
- ✅ **Cache intelligent** pour optimiser les temps d'exécution
- ✅ **Exécution parallèle** pour une vitesse maximale
- ✅ **Rapports de couverture** automatiques
- ✅ **Analyse de la taille du build** 
- ✅ **Artifacts de build** conservés 7 jours

### 2. Security Audit (`security.yml`)
**Déclencheurs :** Push, Pull Requests, Planification quotidienne (2h UTC)  
**Durée estimée :** 3-5 minutes

#### Vérifications de sécurité :
- **Audit des dépendances** : Détection des vulnérabilités avec `npm audit`
- **Analyse CodeQL** : Analyse statique du code pour les failles de sécurité
- **Vérification des licences** : Conformité des licences des dépendances

### 3. PR Validation (`pr-validation.yml`)
**Déclencheurs :** Pull Requests uniquement  
**Durée estimée :** 2-4 minutes

#### Analyses spécifiques aux PR :
- **Informations de la PR** : Auteur, branche, cible
- **Analyse de la taille** : Vérification que la PR n'est pas trop volumineuse
- **Conventional Commits** : Validation du format des messages de commit
- **Analyse des fichiers modifiés** : Détection des fichiers critiques
- **Comparaison de taille de build** : Impact sur la taille finale

## 🔧 Configuration avancée

### Variables d'environnement
```yaml
NODE_VERSION: '20'        # Version Node.js utilisée
CACHE_VERSION: v1         # Version du cache (à incrémenter si besoin)
```

### Cache Strategy
Le cache utilise une clé composite incluant :
- Version du cache (`CACHE_VERSION`)
- OS du runner
- Version de Node.js
- Hash du `package-lock.json`

## 📊 Monitoring et rapports

### GitHub Step Summary
Chaque workflow génère des rapports détaillés visibles dans l'interface GitHub :
- Résumés de qualité
- Tailles de build
- Résultats d'audit de sécurité
- Analyses de PR

### Artifacts
- **Build files** : Conservés 7 jours pour debug
- **Coverage reports** : Envoyés à Codecov automatiquement

## 🔄 Dependabot

Configuration automatique pour :
- **NPM dependencies** : Mises à jour hebdomadaires le lundi
- **GitHub Actions** : Mises à jour des actions utilisées
- **Groupement intelligent** : Par écosystème (React, dev tools, UI, etc.)

### Groupes de dépendances :
- **major-updates** : Mises à jour majeures (attention requise)
- **react-ecosystem** : React et packages associés
- **dev-tools** : Outils de développement (Vite, ESLint, etc.)
- **ui-utilities** : Composants UI et utilitaires

## 🛠️ Scripts npm optimisés

Les scripts suivants sont utilisés par la CI :

```bash
npm run build          # Build de production
npm run lint           # ESLint avec max 15 warnings
npm test               # Tests avec Vitest
npm run validate-env   # Validation des variables d'environnement
```

## 🚨 Règles de qualité

### Quality Gate
Pour qu'une PR soit mergeable, tous les jobs doivent réussir :
- ✅ TypeScript compilation sans erreurs
- ✅ ESLint avec maximum 15 warnings
- ✅ Tests unitaires en succès
- ✅ Build réussie
- ✅ Variables d'environnement valides

### Seuils d'alerte
- **PR trop volumineuse** : > 20 fichiers ou > 500 lignes
- **Build trop volumineux** : Augmentation > 100KB
- **Sécurité** : Niveau `moderate` et plus
- **Licences** : Seules les licences permissives autorisées

## 🔧 Maintenance

### Mise à jour du cache
Si vous rencontrez des problèmes de cache, incrémentez `CACHE_VERSION` :
```yaml
env:
  CACHE_VERSION: v2  # Incrémenter ce numéro
```

### Ajout de nouvelles vérifications
1. Modifier le workflow approprié dans `.github/workflows/`
2. Tester sur une branche de développement
3. Vérifier que les rapports s'affichent correctement

### Debug des workflows
- Consultez les logs dans l'onglet "Actions" de GitHub
- Utilisez les Step Summaries pour des rapports visuels
- Les artifacts de build sont disponibles 7 jours

## 📈 Métriques de performance

Temps d'exécution typiques :
- **CI complet** : 5-8 minutes (parallélisé)
- **Security audit** : 3-5 minutes  
- **PR validation** : 2-4 minutes

La parallélisation permet un gain de ~60% par rapport à l'ancienne configuration séquentielle.

## 🆘 Support

En cas de problème :
1. Vérifiez les logs des Actions GitHub
2. Consultez les Step Summaries pour les détails
3. Vérifiez que les dépendances sont à jour
4. Contactez l'équipe DevOps si nécessaire