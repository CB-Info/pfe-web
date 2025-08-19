# Déploiement Frontend — C2.4.1

## Hébergement Actuel

### État du Déploiement
**⚠️ À déterminer** : Le projet ne semble pas encore déployé en production

### Hébergeurs Recommandés pour React/Vite

#### 1. Vercel (Recommandé)
**Pourquoi Vercel pour ce projet :**
- ✅ Optimisé pour React et Vite
- ✅ Déploiement automatique depuis GitHub
- ✅ Preview deployments sur les PRs
- ✅ Configuration zero-config pour SPA
- ✅ CDN global intégré
- ✅ Support des variables d'environnement

#### 2. Netlify (Alternative)
**Avantages :**
- ✅ Interface simple et intuitive
- ✅ Déploiement automatique GitHub
- ✅ Redirections SPA automatiques
- ✅ Formulaires et fonctions serverless

#### 3. GitHub Pages (Basique)
**Limitations :**
- ❌ Pas de variables d'environnement
- ❌ Pas de preview deployments
- ❌ Configuration manuelle requise

## Configuration de Build

### Scripts de Build
```json
{
  "scripts": {
    "dev": "npm run validate-env && vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "validate-env": "node scripts/validate-env.cjs"
  }
}
```

### Processus de Build
```bash
# 1. Validation TypeScript
tsc

# 2. Build Vite (production)
vite build

# 3. Génération dans dist/
# - Assets optimisés
# - Code minifié
# - Hashing des fichiers
```

### Configuration Vite
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [
    react(), 
    macrosPlugin(), 
    visualizer({ open: true, filename: 'bundle-stats.html' })
  ],
  build: {
    outDir: 'dist',
    sourcemap: false, // Production
    minify: 'terser',
  }
})
```

## Variables d'Environnement

### Variables Requises en Production
```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-production-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef

# API Backend
VITE_API_BASE_URL=https://your-production-api.com/api

# Optionnelles
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_RECAPTCHA_SITE_KEY=your-recaptcha-key
NODE_ENV=production
```

### Configuration par Hébergeur

#### Vercel
```bash
# Via dashboard Vercel ou vercel.json
{
  "env": {
    "VITE_FIREBASE_API_KEY": "your-key",
    "VITE_API_BASE_URL": "https://api.yourdomain.com/api"
  }
}
```

#### Netlify
```bash
# Via netlify.toml
[build.environment]
  VITE_FIREBASE_API_KEY = "your-key"
  VITE_API_BASE_URL = "https://api.yourdomain.com/api"
```

## Configuration SPA (Single Page Application)

### Redirections Nécessaires
Le routing côté client (React Router) nécessite une redirection serveur :

#### Vercel (vercel.json)
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

#### Netlify (_redirects)
```
/*    /index.html   200
```

#### Apache (.htaccess)
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

## Déploiement Automatique

### GitHub Actions (Recommandé)
```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        env:
          VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
          VITE_API_BASE_URL: ${{ secrets.VITE_API_BASE_URL }}
        run: npm run build
      
      - name: Deploy to Vercel
        uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

### Connexion GitHub Directe
**Vercel/Netlify** : Connexion directe au repository GitHub
- ✅ Déploiement automatique sur push main
- ✅ Preview deployments sur PRs
- ✅ Rollback automatique si échec

## Optimisations de Production

### Bundle Analysis
```bash
# Générer le rapport de bundle
npm run build

# Ouvrir bundle-stats.html (généré par visualizer plugin)
```

### Optimisations Vite Automatiques
- **Tree shaking** : Élimination du code mort
- **Code splitting** : Division automatique du bundle
- **Asset optimization** : Compression images et CSS
- **Minification** : Code JavaScript/CSS minifié

### Optimisations Manuelles Possibles
```typescript
// Lazy loading des pages (déjà implémenté)
const DashboardPage = lazy(() => import("./UI/pages/dashboard/dashboard.page"));

// Dynamic imports pour les bibliothèques lourdes
const heavyLibrary = await import('heavy-library');
```

## Monitoring et Logs

### Logs de Déploiement
**Vercel** : Logs détaillés dans le dashboard
**Netlify** : Logs de build et déploiement
**GitHub Actions** : Logs dans l'onglet Actions

### Monitoring d'Erreurs (Recommandé)
```typescript
// Intégration Sentry (à implémenter)
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: process.env.NODE_ENV,
});
```

### Analytics (Optionnel)
```typescript
// Google Analytics (si VITE_FIREBASE_MEASUREMENT_ID configuré)
// Déjà préparé dans firebase.config.ts
```

## Performance en Production

### Métriques à Surveiller
- **First Contentful Paint** : < 1.5s
- **Largest Contentful Paint** : < 2.5s
- **Cumulative Layout Shift** : < 0.1
- **First Input Delay** : < 100ms

### Outils de Mesure
```bash
# Lighthouse CI (à intégrer)
npm install -g @lhci/cli
lhci autorun
```

### Optimisations CDN
- **Vercel** : CDN global automatique
- **Netlify** : CDN intégré
- **Cloudflare** : CDN additionnel possible

## Sécurité en Production

### Headers de Sécurité
```json
// vercel.json - Headers de sécurité
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

### Variables d'Environnement
- ✅ **Jamais commiter** les fichiers .env
- ✅ **Utiliser les secrets** de l'hébergeur
- ✅ **Valider** les variables au build

## Rollback et Versions

### Stratégie de Rollback
**Vercel/Netlify** : Rollback en un clic dans le dashboard
**GitHub** : Revert du commit et redéploiement automatique

### Versioning
```json
// package.json - Versioning sémantique
{
  "version": "1.0.0"
}
```

### Tags Git
```bash
# Créer un tag pour une release
git tag -a v1.0.0 -m "Release 1.0.0"
git push origin v1.0.0
```

## Checklist de Déploiement

### Pré-déploiement
- [ ] Tests passants : `npm run test -- --run`
- [ ] Build réussi : `npm run build`
- [ ] Validation env : `npm run validate-env`
- [ ] Lint clean : `npm run lint`

### Configuration Hébergeur
- [ ] Variables d'environnement configurées
- [ ] Redirections SPA configurées
- [ ] Domaine personnalisé (si applicable)
- [ ] HTTPS activé

### Post-déploiement
- [ ] Tests de smoke sur l'URL de production
- [ ] Vérification des variables d'env
- [ ] Test de l'authentification Firebase
- [ ] Vérification des appels API

## Environnements

### Développement
- **URL** : http://localhost:5173
- **Variables** : .env.local
- **Hot reload** : Activé

### Staging/Preview (Recommandé)
- **URL** : https://preview-branch.vercel.app
- **Variables** : Environnement de test
- **Déploiement** : Automatique sur PRs

### Production
- **URL** : https://your-app.vercel.app (à définir)
- **Variables** : Variables de production
- **Déploiement** : Automatique sur main

## Preuves pour PDF de Soutenance

### Captures à Inclure
1. **Dashboard hébergeur** : Montrer les déploiements réussis
2. **Lighthouse score** : Métriques de performance
3. **Network tab** : Temps de chargement
4. **GitHub Actions** : Pipeline de déploiement vert

### Métriques à Présenter
- **Temps de build** : < 2 minutes
- **Temps de déploiement** : < 5 minutes
- **Performance score** : > 90 (Lighthouse)
- **Disponibilité** : 99.9% (SLA hébergeur)

## Coûts

### Vercel (Recommandé)
- **Hobby Plan** : Gratuit (pour projets personnels)
- **Pro Plan** : $20/mois (pour projets commerciaux)

### Netlify
- **Starter Plan** : Gratuit
- **Pro Plan** : $19/mois

### GitHub Pages
- **Gratuit** : Pour repositories publics

## Troubleshooting

### Problèmes Courants

#### 1. Variables d'Environnement Non Définies
```bash
# Erreur : Missing required environment variables
# Solution : Vérifier la configuration sur l'hébergeur
```

#### 2. Erreur 404 sur Refresh
```bash
# Erreur : Page not found on reload
# Solution : Configurer les redirections SPA
```

#### 3. Build qui Échoue
```bash
# Erreur : Build failed
# Solution : Vérifier les erreurs TypeScript et ESLint
```

**Note** : Cette documentation décrit les meilleures pratiques de déploiement. Le déploiement effectif dépendra des décisions d'hébergement prises pour le projet.