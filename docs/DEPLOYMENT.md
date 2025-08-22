# Deployment Frontend — C2.4.1

## Configuration de Déploiement

### Build Command

```bash
npm run build
```

Ce qui exécute :

1. `tsc` - Vérification TypeScript
2. `vite build` - Bundle optimisé pour production

### Sortie du Build

```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── vendor-[hash].js
└── favicon.ico
```

## Hébergeurs utilisés

### Vercel

**Configuration** :

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "vite"
}
```

**Variables d'environnement** :

- Ajouter via dashboard Vercel
- Préfixe `VITE_` obligatoire

**Auto-deploy** :

- Connecter repo GitHub
- Deploy automatique sur push `main`

## Variables d'Environnement Production

### Requises

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_API_BASE_URL=https://pfe-api-fbyd.onrender.com
```

### Optionnelles

```env
VITE_FIREBASE_MEASUREMENT_ID=
VITE_RECAPTCHA_SITE_KEY=
NODE_ENV=production
```

## Configuration HTTPS

### Headers de Sécurité

Ajouter via hébergeur :

```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

### Redirections

SPA nécessite catch-all :

```
/* → /index.html (200)
```

## Process de Déploiement

### 1. Préparation

```bash
# Vérifier les variables d'env
npm run validate-env

# Tester le build local
npm run build
npm run preview
```

### 2. Configuration Hébergeur

1. Créer nouveau projet
2. Connecter repo GitHub
3. Configurer variables d'environnement
4. Définir build settings

### 3. Premier Déploiement

1. Push sur branche principale
2. Vérifier logs de build
3. Tester l'URL de production
4. Vérifier la console pour erreurs

### 4. Validation

- [ ] Page charge correctement
- [ ] Firebase auth fonctionne
- [ ] API calls réussissent
- [ ] Assets chargent (CSS/JS)
- [ ] Navigation SPA fonctionne

## Optimisations Production

### 1. Compression

Vite gère automatiquement :

- Minification JS/CSS
- Tree shaking
- Code splitting

### 2. Cache Headers

Configurer sur hébergeur :

```
# Assets immutables
/assets/* : Cache-Control: public, max-age=31536000, immutable

# HTML
/*.html : Cache-Control: no-cache
```

### 3. CDN

La plupart des hébergeurs incluent CDN :

- Vercel : Global Edge Network

## Monitoring

### Métriques à Suivre

1. **Performance**

   - Time to First Byte (TTFB)
   - First Contentful Paint (FCP)
   - Time to Interactive (TTI)

2. **Erreurs**

   - Erreurs JS en console
   - Échecs d'API calls
   - 404 sur assets

3. **Usage**
   - Pages vues
   - Taux de rebond
   - Temps de session

### Outils Recommandés

- Google Analytics (via `VITE_FIREBASE_MEASUREMENT_ID`)
- Sentry pour error tracking
- Lighthouse CI pour performance

## Rollback

### Process

1. Identifier le commit fonctionnel
2. Revert via Git ou dashboard hébergeur
3. Déclencher redéploiement
4. Vérifier le rollback

### Via Hébergeur

- Vercel : Instant Rollback dans dashboard

## Checklist Déploiement

### Avant Deploy

- [ ] Tests passent (`npm test`)
- [ ] Build réussit (`npm run build`)
- [ ] Lint sans erreurs (`npm run lint`)
- [ ] Variables d'env configurées
- [ ] API backend accessible

### Après Deploy

- [ ] Site accessible HTTPS
- [ ] Login fonctionne
- [ ] Navigation OK
- [ ] Pas d'erreurs console
- [ ] Performance acceptable

## Commandes Utiles

```bash
# Build local
npm run build

# Preview build
npm run preview

# Analyser bundle
npm run build -- --mode analyze

# Clean build
rm -rf dist && npm run build
```

## TODO Déploiement

- [ ] Configurer domaine custom
- [ ] Mettre en place monitoring
- [ ] Automatiser les backups
