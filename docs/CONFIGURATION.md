# Configuration Frontend — C2.4.1

## Variables d'Environnement

Le projet utilise des variables d'environnement préfixées par `VITE_` pour la configuration. Ces variables sont validées au démarrage par le script `scripts/validate-env.cjs`.

### Variables Requises

| Variable                            | Description                           | Exemple                      |
| ----------------------------------- | ------------------------------------- | ---------------------------- |
| `VITE_FIREBASE_API_KEY`             | Clé API Firebase (publique)           | `AIzaSyD...`                 |
| `VITE_FIREBASE_AUTH_DOMAIN`         | Domaine d'authentification Firebase   | `mon-projet.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID`          | ID du projet Firebase                 | `mon-projet-12345`           |
| `VITE_FIREBASE_STORAGE_BUCKET`      | Bucket de stockage Firebase           | `mon-projet.appspot.com`     |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | ID de l'expéditeur pour la messagerie | `123456789012`               |
| `VITE_FIREBASE_APP_ID`              | ID de l'application Firebase          | `1:123456789012:web:abc...`  |
| `VITE_API_BASE_URL`                 | URL de base de l'API backend          | `http://localhost:3000/api`  |

### Variables Optionnelles

| Variable                       | Description            | Défaut        |
| ------------------------------ | ---------------------- | ------------- |
| `VITE_FIREBASE_MEASUREMENT_ID` | ID Google Analytics    | -             |
| `VITE_RECAPTCHA_SITE_KEY`      | Clé publique reCAPTCHA | -             |
| `NODE_ENV`                     | Environnement Node.js  | `development` |

## Configuration Locale

### 1. Créer le fichier `.env`

```bash
cp .env.example .env
```

### 2. Remplir les valeurs

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=votre-cle-api
VITE_FIREBASE_AUTH_DOMAIN=votre-domaine.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=votre-projet-id
VITE_FIREBASE_STORAGE_BUCKET=votre-projet.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
VITE_API_BASE_URL=http://localhost:3000/api

# Optional
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_RECAPTCHA_SITE_KEY=6Lc...
```

### 3. Validation automatique

Le script `npm run validate-env` vérifie automatiquement :

- La présence du fichier `.env`
- L'existence de toutes les variables requises
- Le format valide de l'URL API
- Que `.env` est bien dans `.gitignore`

## Configuration CORS

Le frontend est configuré pour communiquer avec l'API backend. Les règles CORS doivent être alignées :

### Développement Local

- Frontend : `http://localhost:5173` (Vite par défaut)
- Backend API : `http://localhost:3000/api`

### Production

- Frontend : `https://pfe-web-weld.vercel.app/`
- Backend API : `https://pfe-api-fbyd.onrender.com`

## Accès aux Variables

Dans le code TypeScript :

```typescript
// Accès direct
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;

// Configuration Firebase
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};
```

## Build et Production

### Variables de Build

En production, les variables doivent être définies dans l'environnement de build :

```bash
# Build avec variables
VITE_API_BASE_URL=https://api.production.com
```

### Hébergeurs

#### Vercel

Définir les variables dans le dashboard Vercel sous "Environment Variables".

#### Netlify

Définir dans "Site settings > Build & deploy > Environment variables".

#### GitHub Pages

Utiliser les secrets GitHub Actions dans le workflow de déploiement.

## Sécurité

### Points Importants

1. **Firebase API Keys** : Les clés Firebase côté client sont publiques et sécurisées par les règles Firebase
2. **`.env` dans `.gitignore`** : Le fichier `.env` ne doit JAMAIS être commité
3. **Validation au démarrage** : Le script `validate-env.cjs` empêche le démarrage avec une config invalide
4. **Pas de secrets** : Aucun secret serveur ne doit être exposé côté client

### Migration depuis credentials.json

Le projet a migré d'un fichier `credentials.json` vers des variables d'environnement pour :

- Meilleure sécurité (pas de fichier JSON à protéger)
- Configuration par environnement
- Compatibilité avec les hébergeurs modernes

## Debugging

En cas de problème :

1. Vérifier la présence du `.env` : `ls -la .env`
2. Valider la configuration : `npm run validate-env`
3. Vérifier les logs de la console navigateur
4. S'assurer que l'URL API est accessible
