# Web ERP Frontend - Restaurant Management System

[![CI Pipeline](https://github.com/CB-Info/pfe-web/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/CB-Info/pfe-web/actions/workflows/ci.yml)
[![Security Scan](https://github.com/CB-Info/pfe-web/actions/workflows/security.yml/badge.svg)](https://github.com/CB-Info/pfe-web/actions/workflows/security.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat&logo=firebase&logoColor=black)](https://firebase.google.com/)

> **Interface web moderne pour la gestion de restaurant** - Frontend React avec TypeScript, authentification Firebase et interface responsive.

## Stack Technique

- **Framework** : React 18.2.0 avec TypeScript 5.2.2
- **Build Tool** : Vite 7.0.5 avec SWC
- **Styling** : Tailwind CSS 3.4.1 + DaisyUI + Material-UI + Styled Components
- **Routing** : React Router DOM 6.22.0
- **State Management** : React Context + useReducer
- **Authentication** : Firebase 12.0.0
- **Testing** : Vitest 3.2.4 + React Testing Library
- **CI/CD** : GitHub Actions avec 3 workflows

## Scripts Disponibles

```bash
# Développement
npm run dev              # Serveur de développement (http://localhost:5173)
npm run dev:secure       # Développement avec validation env

# Build et Preview
npm run build            # Build de production
npm run preview          # Preview du build

# Tests
npm run test             # Tests en mode watch
npm run test:ui          # Interface graphique des tests
npm run test:coverage    # Tests avec rapport de couverture

# Qualité
npm run lint             # ESLint (max 15 warnings)
npm run validate-env     # Validation variables d'environnement
npm run ci:check         # Validation complète (lint + test + build)
```

## Configuration Rapide

### 1. Installation
```bash
git clone <repository-url>
cd pfe-web
npm install
```

### 2. Variables d'Environnement
Créer un fichier `.env` avec les variables Firebase :

```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef

# API Backend
VITE_API_BASE_URL=https://your-api-domain.com/api
```

### 3. Validation et Démarrage
```bash
npm run validate-env     # Vérifier la configuration
npm run dev             # Démarrer le serveur de développement
```

## Lien vers l'API Backend

- **URL de l'API** : Configurée via `VITE_API_BASE_URL`
- **Documentation** : Voir la documentation backend pour les endpoints
- **Authentification** : Tokens JWT via Firebase Auth

## Documentation

### Architecture et Développement
- [📐 Architecture Frontend](docs/ARCHITECTURE_FRONTEND.md) - Stack, structure et patterns
- [⚙️ Configuration](docs/CONFIGURATION_FRONTEND.md) - Variables d'environnement et setup
- [🔌 Client API](docs/API_CLIENT.md) - Gestion des appels HTTP et authentification
- [🔒 Sécurité Frontend](docs/SECURITY_FRONTEND.md) - Pratiques de sécurité côté client
- [🎨 Guidelines UI](docs/UI_GUIDELINES.md) - Conventions Tailwind et composants
- [🧭 Routing](docs/ROUTING.md) - Navigation et protection des routes
- [📊 State Management](docs/STATE_MANAGEMENT.md) - Gestion d'état avec Context API
- [🤝 Guide de Contribution](docs/CONTRIBUTING_FRONTEND.md) - Conventions et processus

### Tests et Qualité
- [🧪 Stratégie de Tests](docs/TEST_STRATEGY_FRONTEND.md) - Outils et conventions de test
- [📈 Résumé des Tests](docs/TESTS_SUMMARY_FRONTEND.md) - Métriques et couverture
- [📋 Recettes UX](docs/RECETTES_FRONTEND.md) - Scénarios de test utilisateur
- [🐛 Bugs et Anomalies](docs/BUGS_FRONTEND.md) - Suivi des bugs et améliorations

### Déploiement et Production
- [🚀 Déploiement](docs/DEPLOYMENT_FRONTEND.md) - Configuration hébergement et build
- [⚡ CI/CD](docs/CI_CD_FRONTEND.md) - Workflows GitHub Actions
- [♿ Accessibilité](docs/ACCESSIBILITY.md) - Conformité WCAG et bonnes pratiques
- [⚡ Performance](docs/PERFORMANCE.md) - Optimisations et métriques

## Bugs Connus

**Aucun bug critique identifié actuellement** ✅

Voir [docs/BUGS_FRONTEND.md](docs/BUGS_FRONTEND.md) pour les améliorations futures et limitations connues.

## Déploiement

**État** : Configuration prête pour déploiement sur Vercel/Netlify
**Build** : `npm run build` génère les fichiers dans `dist/`
**Variables** : Configurer les variables `VITE_*` sur l'hébergeur

Voir [docs/DEPLOYMENT_FRONTEND.md](docs/DEPLOYMENT_FRONTEND.md) pour les détails complets.

## Métriques Actuelles

- **Tests** : 27 tests passants en ~2 secondes
- **Couverture** : Rapport disponible avec `npm run test:coverage`
- **Build** : Optimisé avec lazy loading et code splitting
- **CI/CD** : 3 workflows GitHub Actions (CI, PR validation, Security)
- **TypeScript** : Configuration stricte avec 0 erreur
- **ESLint** : Max 15 warnings autorisés

## Comment le Frontend Respecte le Bloc 2

### Compétences Validées
- **C2.2.2** - Tests et validation : [Stratégie Tests](docs/TEST_STRATEGY_FRONTEND.md) | [Résumé Tests](docs/TESTS_SUMMARY_FRONTEND.md)
- **C2.2.3** - Architecture évolutive : [Architecture](docs/ARCHITECTURE_FRONTEND.md) | [Sécurité](docs/SECURITY_FRONTEND.md) | [UI Guidelines](docs/UI_GUIDELINES.md) | [Routing](docs/ROUTING.md) | [State Management](docs/STATE_MANAGEMENT.md) | [Accessibilité](docs/ACCESSIBILITY.md) | [Performance](docs/PERFORMANCE.md) | [Contribution](docs/CONTRIBUTING_FRONTEND.md)
- **C2.3.1** - Recettes utilisateur : [Recettes UX](docs/RECETTES_FRONTEND.md)
- **C2.3.2** - Gestion anomalies : [Bugs](docs/BUGS_FRONTEND.md) | [Tests Summary](docs/TESTS_SUMMARY_FRONTEND.md)
- **C2.4.1** - Configuration et exécution : [Configuration](docs/CONFIGURATION_FRONTEND.md) | [Déploiement](docs/DEPLOYMENT_FRONTEND.md) | [CI/CD](docs/CI_CD_FRONTEND.md)

## Contact et Support

- **Issues** : Utiliser les GitHub Issues pour signaler des bugs
- **Contributions** : Voir [CONTRIBUTING_FRONTEND.md](docs/CONTRIBUTING_FRONTEND.md)
- **Documentation** : Toute la documentation est dans le dossier `docs/`