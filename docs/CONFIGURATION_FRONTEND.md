# Configuration Frontend — C2.4.1

## Variables d'Environnement

### Variables Obligatoires (Vite)

Le projet utilise le préfixe `VITE_` pour les variables d'environnement côté client :

```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef

# API Backend
VITE_API_BASE_URL=https://your-api-domain.com/api
```

### Variables Optionnelles

```bash
# Firebase Analytics (optionnel)
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# reCAPTCHA (optionnel - pour sécurité supplémentaire)
VITE_RECAPTCHA_SITE_KEY=your-recaptcha-site-key

# Environment (automatique)
NODE_ENV=development|production
```

## Configuration par Environnement

### Développement Local

1. **Créer le fichier `.env`** dans la racine du projet
2. **Copier les variables** depuis la configuration Firebase
3. **Valider la configuration** :
   ```bash
   npm run validate-env
   ```

### Build de Production

Les variables sont intégrées au build via Vite :
```bash
npm run build  # Variables VITE_* sont incluses dans le bundle
```

### Déploiement

Variables à configurer sur l'hébergeur (Vercel/Netlify/etc.) :
- Toutes les variables `VITE_*` listées ci-dessus
- `NODE_ENV=production` (automatique sur la plupart des hébergeurs)

## Format et Contraintes

### Contraintes de Format

```typescript
// Validation automatique dans firebase.config.ts
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN', 
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
];

// Validation URL API
new URL(import.meta.env.VITE_API_BASE_URL); // Doit être une URL valide
```

### Exemples Sans Secrets

```bash
# ✅ Format correct pour Firebase
VITE_FIREBASE_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_FIREBASE_AUTH_DOMAIN=mon-projet-pfe.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=mon-projet-pfe
VITE_FIREBASE_STORAGE_BUCKET=mon-projet-pfe.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdefghijklmnop

# ✅ Format correct pour API Backend
VITE_API_BASE_URL=https://api.mon-backend.com/api
VITE_API_BASE_URL=http://localhost:3000/api  # Développement local

# ❌ Formats incorrects
VITE_API_BASE_URL=mon-backend.com  # Manque le protocole
VITE_API_BASE_URL=/api             # URL relative non supportée
```

## Validation Automatique

### Script de Validation

Le projet inclut un script de validation automatique :

```bash
npm run validate-env  # Exécuté automatiquement avec npm run dev
```

**Vérifications effectuées :**
- ✅ Présence de toutes les variables obligatoires
- ✅ Variables non vides
- ✅ Format URL valide pour `VITE_API_BASE_URL`
- ✅ Fichier `.env` dans `.gitignore`
- ✅ Absence d'anciens fichiers de credentials

### Gestion des Erreurs

```bash
# Si variables manquantes
❌ Missing required configuration variables:
   - VITE_FIREBASE_API_KEY
   - VITE_API_BASE_URL

# Si variables vides  
❌ Empty required configuration variables:
   - VITE_FIREBASE_PROJECT_ID

# Si succès
✅ All required configuration variables are set!
🎉 Your Firebase configuration is ready!
```

## CORS et Origines

### Configuration Backend Alignée

Le frontend doit être configuré pour correspondre aux origines autorisées côté backend :

```typescript
// Variables à aligner avec le backend
const frontendOrigins = [
  'http://localhost:5173',  // Vite dev server
  'https://mon-app.vercel.app',  // Production
  'https://preview-branch.vercel.app'  // Previews
];
```

### Headers CORS Attendus

Le backend doit autoriser ces headers depuis le frontend :
```
Access-Control-Allow-Origin: https://mon-app.vercel.app
Access-Control-Allow-Headers: Authorization, Content-Type
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH
```

## Sécurité des Variables

### Variables Publiques (Safe)

⚠️ **Important** : Les variables `VITE_*` sont **publiques** et visibles dans le bundle :

```typescript
// ✅ Safe - API keys Firebase côté client
VITE_FIREBASE_API_KEY=AIzaSy...  // Public par design
VITE_FIREBASE_PROJECT_ID=mon-projet  // Public par design

// ✅ Safe - URLs publiques
VITE_API_BASE_URL=https://api.public.com
```

### Variables à NE JAMAIS Exposer

```bash
# ❌ JAMAIS dans les variables VITE_*
SECRET_KEY=...           # Secrets serveur
DATABASE_URL=...         # URLs de base de données
PRIVATE_KEY=...          # Clés privées
ADMIN_TOKEN=...          # Tokens d'administration
```

### Protection

- **Firebase Security Rules** : Protection réelle côté serveur
- **Backend Authentication** : Validation des tokens
- **HTTPS** : Chiffrement des communications
- **Content Security Policy** : Protection XSS (si implémentée)

## Configuration par Hébergeur

### Vercel
```bash
# Dans le dashboard Vercel > Settings > Environment Variables
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
# ... autres variables
```

### Netlify
```bash
# Dans netlify.toml ou dashboard
[build.environment]
  VITE_FIREBASE_API_KEY = "..."
  VITE_API_BASE_URL = "..."
```

### GitHub Pages
Variables dans **Settings > Secrets and variables > Actions** :
```yaml
# Dans .github/workflows/deploy.yml
env:
  VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
  VITE_API_BASE_URL: ${{ secrets.VITE_API_BASE_URL }}
```

## Troubleshooting

### Erreurs Courantes

1. **"Missing required environment variables"**
   - Vérifier que le fichier `.env` existe
   - Vérifier l'orthographe des variables

2. **"API URL format may be invalid"**
   - S'assurer que l'URL commence par `http://` ou `https://`
   - Éviter les URLs relatives

3. **"Firebase configuration error"**
   - Vérifier les credentials Firebase dans la console
   - S'assurer que tous les services Firebase sont activés

### Debug Mode

```bash
# Afficher les variables d'environnement (sans secrets)
npm run dev  # Les erreurs de config s'affichent au démarrage

# Vérifier le build
npm run build  # Les erreurs de config empêchent le build
```