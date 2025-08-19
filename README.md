# Eatopia Frontend - ERP Restaurant

[![CI Pipeline](https://github.com/CB-Info/pfe-web/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/CB-Info/pfe-web/actions/workflows/ci.yml)
[![Security Scan](https://github.com/CB-Info/pfe-web/actions/workflows/security.yml/badge.svg)](https://github.com/CB-Info/pfe-web/actions/workflows/security.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat&logo=firebase&logoColor=black)](https://firebase.google.com/)

Application frontend moderne pour la gestion de restaurant, développée avec React, TypeScript et Tailwind CSS.

## 🚀 Stack Technologique

- **Framework** : React 18.2 avec TypeScript 5.2
- **Bundler** : Vite 7.0
- **Styling** : Tailwind CSS 3.4 + DaisyUI + Styled Components
- **Routing** : React Router DOM 6.22
- **Auth** : Firebase Authentication
- **HTTP Client** : Axios 1.6
- **Tests** : Vitest + React Testing Library

## 📦 Installation

```bash
# Cloner le repository
git clone https://github.com/ERP-sunday/web-app
cd web-app

# Installer les dépendances
npm install
```

## ⚙️ Configuration

1. Créer un fichier `.env` à la racine :
```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_API_BASE_URL=http://localhost:3000/api
```

2. Valider la configuration :
```bash
npm run validate-env
```

## 🛠️ Scripts Disponibles

```bash
# Développement
npm run dev              # Serveur de développement (http://localhost:5173)
npm run dev:secure       # Dev avec validation env

# Build
npm run build           # Build de production
npm run preview         # Preview du build

# Qualité
npm run lint            # ESLint
npm run test            # Tests unitaires
npm run test:ui         # Tests avec interface
npm run test:coverage   # Couverture de code

# CI
npm run ci:check        # Lint + Test + Build
```

## 🔗 API Backend

L'application communique avec l'API backend :
- **Développement** : `http://localhost:3000/api`
- **Production** : À configurer dans `VITE_API_BASE_URL`

Documentation API : [Swagger](http://localhost:3000/api-docs) (quand le backend tourne)

## 📚 Documentation

### Architecture et Configuration
- [Architecture Frontend](docs/ARCHITECTURE_FRONTEND.md) - Stack, structure, patterns
- [Configuration](docs/CONFIGURATION_FRONTEND.md) - Variables d'environnement
- [API Client](docs/API_CLIENT.md) - Gestion des appels API
- [State Management](docs/STATE_MANAGEMENT.md) - Contexts et reducers

### Développement
- [UI Guidelines](docs/UI_GUIDELINES.md) - Conventions Tailwind et composants
- [Routing](docs/ROUTING.md) - Routes et navigation
- [Security Frontend](docs/SECURITY_FRONTEND.md) - Pratiques de sécurité
- [Contributing](docs/CONTRIBUTING_FRONTEND.md) - Guide de contribution

### Tests et Qualité
- [Test Strategy](docs/TEST_STRATEGY_FRONTEND.md) - Stratégie de tests
- [Tests Summary](docs/TESTS_SUMMARY_FRONTEND.md) - État des tests
- [Recettes](docs/RECETTES_FRONTEND.md) - Scénarios de test utilisateur
- [Bugs](docs/BUGS_FRONTEND.md) - Anomalies connues

### Performance et Accessibilité
- [Performance](docs/PERFORMANCE.md) - Optimisations
- [Accessibility](docs/ACCESSIBILITY.md) - Pratiques a11y

### Déploiement
- [Deployment](docs/DEPLOYMENT_FRONTEND.md) - Guide de déploiement
- [CI/CD](docs/CI_CD_FRONTEND.md) - Workflows GitHub Actions

## 🐛 Bugs Connus

- **FE-001** : Vitest non trouvé lors de l'exécution des tests
- **FE-002** : Menu mobile ne se ferme pas automatiquement

Voir [BUGS_FRONTEND.md](docs/BUGS_FRONTEND.md) pour plus de détails.

## 🚀 Déploiement

L'application peut être déployée sur :
- Vercel (recommandé)
- Netlify
- GitHub Pages
- Render

Voir [DEPLOYMENT_FRONTEND.md](docs/DEPLOYMENT_FRONTEND.md) pour les instructions détaillées.

## 📊 Bloc 2 - Références Documentation

Le projet respecte les compétences du Bloc 2 :

- **Architecture & évolutivité** : [ARCHITECTURE_FRONTEND.md](docs/ARCHITECTURE_FRONTEND.md) (C2.2.3)
- **Configuration & exécution** : [CONFIGURATION_FRONTEND.md](docs/CONFIGURATION_FRONTEND.md) (C2.4.1)
- **Client API & sécurité** : [API_CLIENT.md](docs/API_CLIENT.md), [SECURITY_FRONTEND.md](docs/SECURITY_FRONTEND.md) (C2.2.3)
- **Stratégie & tests** : [TEST_STRATEGY_FRONTEND.md](docs/TEST_STRATEGY_FRONTEND.md), [TESTS_SUMMARY_FRONTEND.md](docs/TESTS_SUMMARY_FRONTEND.md) (C2.2.2)
- **Recettes & bugs** : [RECETTES_FRONTEND.md](docs/RECETTES_FRONTEND.md), [BUGS_FRONTEND.md](docs/BUGS_FRONTEND.md) (C2.3.1 / C2.3.2)
- **Déploiement & CI** : [DEPLOYMENT_FRONTEND.md](docs/DEPLOYMENT_FRONTEND.md), [CI_CD_FRONTEND.md](docs/CI_CD_FRONTEND.md) (C2.4.1)
- **Accessibilité & performance** : [ACCESSIBILITY.md](docs/ACCESSIBILITY.md), [PERFORMANCE.md](docs/PERFORMANCE.md) (C2.2.3)
- **Contribution** : [CONTRIBUTING_FRONTEND.md](docs/CONTRIBUTING_FRONTEND.md) (C2.2.3)

## 👥 Contact

Pour toute question :
- Issues GitHub pour les bugs
- Discussions GitHub pour les questions
- Email : contact@eatopia.fr