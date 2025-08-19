# Security Frontend — C2.2.3

## Pratiques de Sécurité Côté Client

### 1. Protection XSS (Cross-Site Scripting)

#### Échappement Automatique
React échappe automatiquement les valeurs dans le JSX :

```typescript
// Sûr - React échappe automatiquement
const userInput = "<script>alert('XSS')</script>";
return <div>{userInput}</div>; // Affiché comme texte
```

#### DangerouslySetInnerHTML
Le projet n'utilise **pas** `dangerouslySetInnerHTML`. Si nécessaire à l'avenir :
- Sanitizer le HTML avec une librairie (DOMPurify)
- Valider strictement le contenu
- Limiter aux cas absolument nécessaires

### 2. Gestion des Tokens

#### Stratégie Actuelle
- **Firebase SDK** : Gestion automatique en mémoire
- **Pas de localStorage** : Évite l'exposition aux attaques XSS
- **Refresh automatique** : Firebase renouvelle les tokens
- **Transmission sécurisée** : Header `Authorization: Bearer`

#### Code Sécurisé
```typescript
// FirebaseAuthManager - Token jamais exposé
async getToken(): Promise<string | null> {
  if (this.auth.currentUser) {
    return this.auth.currentUser.getIdToken();
  }
  throw new Error("Aucun utilisateur connecté");
}
```

### 3. Protection CSRF

#### Situation Actuelle
- **Architecture API REST** : Moins vulnérable que les forms classiques
- **Token Bearer** : Protection naturelle contre CSRF
- **SameSite cookies** : Non utilisés (API stateless)

#### Si cookies HttpOnly futurs
```typescript
// Configuration recommandée
credentials: 'include',
headers: {
  'X-CSRF-Token': csrfToken // Si implémenté
}
```

### 4. Validation Côté Client

#### Principes Appliqués
1. **Validation préventive** : Améliore l'UX
2. **Ne jamais faire confiance** : Le backend revalide toujours
3. **Types stricts** : TypeScript pour la cohérence

#### Exemples de Validation
```typescript
// Validation des entrées utilisateur
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validation des montants
const validatePrice = (price: number): boolean => {
  return price > 0 && price < 10000;
};
```

### 5. Contrôles d'Accès UI

#### Protection des Routes
```typescript
// AuthProvider protège l'accès global
const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  // ...
  return (
    <UsersListerStateContext.Provider value={state}>
      <UsersListerDispatchContext.Provider value={dispatch}>
        {isLogin ? children : <LoginPage />}
      </UsersListerDispatchContext.Provider>
    </UsersListerStateContext.Provider>
  );
};
```

#### Features par Rôle (Planned)
```typescript
// Amélioration future : protection par rôle
const ProtectedComponent = ({ requiredRole, children }) => {
  const { user } = useAuth();
  
  if (!user || user.role < requiredRole) {
    return <AccessDenied />;
  }
  
  return children;
};
```

### 6. Sécurité des Variables d'Environnement

#### Variables Publiques Firebase
- Les clés API Firebase sont **publiques par design**
- Sécurité assurée par les **Firebase Security Rules**
- **Jamais de secrets serveur** côté client

#### Validation au Build
```javascript
// scripts/validate-env.cjs
if (!fs.existsSync(envPath)) {
  console.error('❌ .env file not found!');
  process.exit(1);
}
```

### 7. Content Security Policy (CSP)

#### État Actuel
Pas de CSP explicite configurée. Headers de sécurité basiques via l'hébergeur.

#### Amélioration Future
```html
<!-- Dans index.html ou via headers HTTP -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline' https://apis.google.com; 
               style-src 'self' 'unsafe-inline';
               img-src 'self' data: https:;
               connect-src 'self' https://*.firebaseapp.com https://api.backend.com">
```

### 8. Dépendances et Vulnérabilités

#### Audit Régulier
```bash
# Vérification des vulnérabilités
npm audit

# Mise à jour sécurisée
npm audit fix
```

#### GitHub Dependabot
Configuration active dans `.github/dependabot.yml` pour :
- Mises à jour automatiques de sécurité
- PRs pour les dépendances critiques

### 9. Sanitization des Entrées

#### Principes
1. **Validation stricte** des formats (email, tel, etc.)
2. **Limitation de longueur** des champs
3. **Caractères autorisés** définis explicitement

```typescript
// Exemple de sanitization
const sanitizeName = (input: string): string => {
  return input
    .trim()
    .replace(/[^a-zA-Z0-9À-ÿ\s-]/g, '')
    .slice(0, 50);
};
```

### 10. Stockage Sécurisé

#### Données Sensibles
- **Pas de mots de passe** stockés localement
- **Tokens en mémoire** uniquement (Firebase)
- **Données utilisateur** minimales en Context

#### Si localStorage nécessaire
```typescript
// Chiffrement pour données sensibles
const secureStorage = {
  set: (key: string, value: any) => {
    const encrypted = encrypt(JSON.stringify(value));
    localStorage.setItem(key, encrypted);
  },
  get: (key: string) => {
    const encrypted = localStorage.getItem(key);
    return encrypted ? JSON.parse(decrypt(encrypted)) : null;
  }
};
```

## Checklist de Sécurité

- [x] Pas de `dangerouslySetInnerHTML`
- [x] Tokens gérés par Firebase (pas en localStorage)
- [x] Validation des variables d'environnement
- [x] Protection des routes par authentification
- [x] Échappement automatique React
- [x] HTTPS en production (via hébergeur)
- [ ] CSP headers (amélioration future)
- [ ] Protection par rôles granulaire (amélioration future)
- [ ] Tests de sécurité automatisés (amélioration future)

## Responsabilités

### Frontend
- Validation pour l'UX
- Protection basique XSS
- Gestion sécurisée des tokens
- UI conditionnelle par auth

### Backend (hors périmètre)
- Validation finale des données
- Autorisation et RBAC
- Protection CSRF si cookies
- Rate limiting et DDoS
- Sanitization côté serveur