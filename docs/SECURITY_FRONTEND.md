# Sécurité Frontend — C2.2.3

## Pratiques de Sécurité Implémentées

### 1. Protection XSS (Cross-Site Scripting)

#### Échappement Automatique React
- ✅ **React JSX** : Échappement automatique des variables dans JSX
- ✅ **Pas de dangerouslySetInnerHTML** : Aucune utilisation détectée dans le code
- ✅ **Templates sûrs** : Toutes les interpolations sont échappées

```typescript
// ✅ Sûr par défaut
const userInput = "<script>alert('xss')</script>";
return <div>{userInput}</div>; // Automatiquement échappé

// ❌ Dangereux (non utilisé dans le projet)
// return <div dangerouslySetInnerHTML={{__html: userInput}} />;
```

#### Validation des Entrées Utilisateur
```typescript
// Validation côté client (complément, pas substitut à la validation serveur)
const validateInput = (value: string) => {
  return value.trim().length > 0 && value.length <= 255;
};
```

### 2. Gestion des Tokens

#### Stratégie de Stockage Sécurisée
- ✅ **En mémoire uniquement** : Firebase Auth gère les tokens en mémoire
- ✅ **Pas de localStorage** : Évite les attaques XSS sur les tokens
- ✅ **Refresh automatique** : Firebase gère l'expiration/renouvellement
- ✅ **Révocation propre** : Déconnexion nettoie les tokens

```typescript
// ✅ Sécurisé - Token en mémoire via Firebase
class FirebaseAuthManager {
  async getToken(): Promise<string | null> {
    if (this.auth.currentUser) {
      return this.auth.currentUser.getIdToken(); // Récupération sécurisée
    }
    throw new Error("Aucun utilisateur connecté");
  }
}

// ❌ Évité - Stockage non sécurisé
// localStorage.setItem('token', jwt); // Vulnérable XSS
// sessionStorage.setItem('token', jwt); // Vulnérable XSS
```

#### Justification du Choix
**Pourquoi Firebase Auth en mémoire :**
- 🔒 **Anti-XSS** : Pas d'exposition via localStorage accessible aux scripts
- 🔄 **Rotation automatique** : Tokens à durée de vie courte
- 🛡️ **HttpOnly impossible** : Pas de cookies côté client SPA
- 🎯 **Simplicité** : Pas de gestion manuelle complexe

### 3. Firebase App Check

#### Protection Anti-Abuse
Configuration Firebase App Check pour la production :

```typescript
// Configuration réelle dans firebase-security.config.ts
export function initializeFirebaseAppCheck(app: FirebaseApp) {
  if (import.meta.env.NODE_ENV === 'production') {
    const appCheck = initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(import.meta.env.VITE_RECAPTCHA_SITE_KEY || ''),
      isTokenAutoRefreshEnabled: true
    });
    return appCheck;
  }
}
```

#### Paramètres de Sécurité
```typescript
export const FIREBASE_SECURITY_CONFIG = {
  auth: {
    requireEmailVerification: true,
    passwordMinLength: 8,
    requireStrongPassword: true,
    sessionTimeout: 60, // minutes
    maxLoginAttempts: 5,
  }
};
```

### 4. Contrôles d'Accès UI

#### Guard d'Authentification
```typescript
// AuthProvider - Protection des routes
const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false);
  
  return (
    <UsersListerStateContext.Provider value={state}>
      {isLogin ? children : <LoginPage />}
    </UsersListerStateContext.Provider>
  );
};
```

#### Protection des Fonctionnalités
```typescript
// Exemple de contrôle conditionnel (à implémenter selon besoins)
const AdminFeature = () => {
  const { user } = useAuth();
  
  if (!user?.roles?.includes('admin')) {
    return <div>Accès non autorisé</div>;
  }
  
  return <AdminPanel />;
};
```

### 5. Validation Côté Client

#### Validation des Formulaires
```typescript
// Pattern de validation utilisé
const validateDishForm = (dish: DishCreationDto) => {
  const errors: string[] = [];
  
  if (!dish.name || dish.name.trim().length === 0) {
    errors.push("Le nom est obligatoire");
  }
  
  if (dish.price <= 0) {
    errors.push("Le prix doit être positif");
  }
  
  return errors;
};
```

#### Sanitisation des Entrées
```typescript
// Sanitisation basique (React JSX fait le reste)
const sanitizeInput = (input: string): string => {
  return input.trim().substring(0, 255); // Limite longueur
};
```

### 6. HTTPS et Transport

#### Configuration HTTPS
- ✅ **Production** : HTTPS obligatoire sur l'hébergeur
- ✅ **API Calls** : Toutes les URL API en HTTPS
- ✅ **Firebase** : Communication chiffrée par défaut

```typescript
// URLs API sécurisées
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // https://api.domain.com
```

### 7. Content Security Policy (CSP)

#### État Actuel
- ❌ **Pas implémentée** : Aucun header CSP détecté
- 🔄 **Amélioration future** : Recommandée pour production

#### Configuration Recommandée
```html
<!-- À ajouter dans index.html ou via serveur -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://apis.google.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: https:;
  connect-src 'self' https://api.votre-backend.com https://*.firebase.com;
  font-src 'self' https://fonts.gstatic.com;
">
```

### 8. Gestion des Erreurs Sécurisée

#### Pas d'Exposition d'Informations Sensibles
```typescript
// ✅ Erreurs génériques côté client
catch (error) {
  console.error("Error creating dish:", error); // Log détaillé côté dev
  throw new Error("Erreur lors de la création du plat"); // Message générique utilisateur
}
```

#### Logging Sécurisé
- ✅ **Pas de logs de tokens** : Aucun token loggé en production
- ✅ **Erreurs génériques** : Messages d'erreur non révélateurs
- 🔄 **Monitoring externe** : Sentry recommandé pour production

### 9. Dépendances et Vulnérabilités

#### Scan de Sécurité
```bash
# Audit des dépendances
npm audit  # Vérification des vulnérabilités connues
```

#### ESLint Security
```typescript
// Configuration ESLint avec plugins sécurité
"devDependencies": {
  "eslint-plugin-security": "^1.7.1",
  "eslint-plugin-no-secrets": "^2.2.1"
}
```

### 10. Accessibilité et Sécurité

#### Focus Management
```css
/* Classes Tailwind utilisées pour focus visible */
focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
```

#### ARIA Labels
```typescript
// Exemples d'usage détectés
<button aria-label="Ouvrir le menu" onClick={toggleSidebar}>
<Table aria-label="customized table">
<button aria-label="Options">
```

## Limitations et Avertissements

### 🚨 Ce que le Frontend NE PEUT PAS Protéger

#### 1. Validation Serveur
- ❌ **Contournement facile** : Validation client facilement bypassée
- ✅ **Backend obligatoire** : Validation serveur indispensable

#### 2. Autorisation Métier
- ❌ **Pas de sécurité réelle** : Contrôles UI purement cosmétiques
- ✅ **Backend obligatoire** : Autorisation serveur indispensable

#### 3. Données Sensibles
- ❌ **Exposition inévitable** : Tout code JS est visible
- ✅ **Backend obligatoire** : Logique sensible côté serveur uniquement

### 🛡️ Sécurité Réelle : Côté Backend

La vraie sécurité vient du backend :
- **Authentication** : Validation des tokens JWT
- **Authorization** : Contrôle des permissions par rôle
- **Validation** : Validation robuste des données
- **Rate Limiting** : Protection contre les abus
- **Firebase Security Rules** : Règles de sécurité base de données

## Améliorations Futures

### 1. Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" content="...">
```

### 2. Monitoring Sécurité
```typescript
// Intégration Sentry
import * as Sentry from "@sentry/react";

Sentry.captureException(error);
```

### 3. CSRF Protection
```typescript
// Si nécessaire avec cookies
const csrfToken = await getCsrfToken();
```

### 4. Rate Limiting Client
```typescript
// Throttling des appels API côté client
const throttledApiCall = throttle(apiCall, 1000);
```

### 5. Input Validation Renforcée
```typescript
// Bibliothèques de validation
import { z } from 'zod';

const dishSchema = z.object({
  name: z.string().min(1).max(255),
  price: z.number().positive(),
});
```

## Checklist Sécurité Frontend

### ✅ Implémenté
- [x] Échappement automatique React JSX
- [x] Tokens en mémoire (Firebase Auth)
- [x] HTTPS pour API calls
- [x] Validation basique des formulaires
- [x] Firebase App Check (production)
- [x] Audit dépendances (npm audit)
- [x] ESLint security plugins

### 🔄 À Améliorer
- [ ] Content Security Policy headers
- [ ] Monitoring d'erreurs (Sentry)
- [ ] Validation schémas robustes (Zod)
- [ ] Rate limiting côté client
- [ ] Tests de sécurité automatisés

### ❌ Hors Périmètre Frontend
- [ ] Validation serveur (backend)
- [ ] Autorisation métier (backend)
- [ ] Chiffrement données (backend)
- [ ] Rate limiting serveur (backend)
- [ ] Audit logs (backend)