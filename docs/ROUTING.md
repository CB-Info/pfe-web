# Routing — C2.2.3 / C2.4.1

## Configuration du Routing

### React Router DOM 6.22.0
Le projet utilise React Router DOM v6 avec BrowserRouter :

```typescript
// src/main.tsx
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  </React.StrictMode>,
)
```

### Structure des Routes
```typescript
// src/App.tsx
<Routes>
  <Route path="/" element={<DashboardPage />} />
  <Route path="/dashboard" element={<DashboardPage />} />
  <Route path="/dishes" element={<DishesPage />} />
  <Route path="/cards" element={<CardsPage />} />
  <Route path="/settings" element={<SettingsPage />} />
  {/* Redirect old /home route to dashboard */}
  <Route path="/home" element={<DashboardPage />} />
</Routes>
```

## Routes Actuelles

### Routes Publiques
Aucune route publique - toutes les routes nécessitent une authentification.

### Routes Privées (Authentifiées)

| Route | Composant | Description | Lazy Loading |
|-------|-----------|-------------|--------------|
| `/` | DashboardPage | Page d'accueil/tableau de bord | ✅ |
| `/dashboard` | DashboardPage | Tableau de bord (alias) | ✅ |
| `/dishes` | DishesPage | Gestion des plats | ✅ |
| `/cards` | CardsPage | Gestion des cartes/tables | ✅ |
| `/settings` | SettingsPage | Paramètres utilisateur | ✅ |
| `/home` | DashboardPage | Redirection legacy | ✅ |

### Lazy Loading des Pages
```typescript
// Toutes les pages sont chargées à la demande
const DashboardPage = lazy(() => import("./UI/pages/dashboard/dashboard.page"));
const DishesPage = lazy(() => import("./UI/pages/dishes/dishes.page"));
const CardsPage = lazy(() => import("./UI/pages/cards/cards.page"));
const SettingsPage = lazy(() => import("./UI/pages/settings/settings.page"));
```

## Guarded Routes

### Authentication Guard Global
L'authentification est gérée au niveau de l'application entière via `AuthProvider` :

```typescript
// src/contexts/auth.provider.tsx
const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false);
  
  useEffect(() => {
    const unsubscribe = firebaseAuthManager.monitorAuthState((user) => {
      setIsLogin(!!user);
      setIsLoading(false);
    });
    return () => unsubscribe?.();
  }, []);

  if (isLoading) {
    return <Loading variant="sandy" size="large" text="Authentification en cours..." />;
  }

  return (
    <UsersListerStateContext.Provider value={state}>
      <UsersListerDispatchContext.Provider value={dispatch}>
        {isLogin ? children : <LoginPage />}
      </UsersListerDispatchContext.Provider>
    </UsersListerStateContext.Provider>
  );
};
```

### Protection des Routes
- ✅ **Guard Global** : Toutes les routes protégées par AuthProvider
- ❌ **Guards Granulaires** : Pas de protection par rôle actuellement
- ❌ **Route Guards Individuelles** : Pas d'implémentation par route

## Redirections

### Redirections Automatiques

#### Post-Login
```typescript
// Après connexion réussie -> Dashboard
// (Implémentation dans LoginPage - à vérifier)
```

#### Post-Logout
```typescript
// Déconnexion -> LoginPage automatique
// Via AuthProvider qui affiche LoginPage si !isLogin
```

#### Route Legacy
```typescript
// /home -> /dashboard (redirection via même composant)
<Route path="/home" element={<DashboardPage />} />
```

### Redirections Manquantes
- 🔄 **404 Not Found** : Pas de route catch-all implémentée
- 🔄 **Unauthorized Access** : Pas de gestion granulaire par rôle
- 🔄 **Deep Link Preservation** : Pas de sauvegarde de la route demandée

## Gestion des Erreurs de Navigation

### États d'Erreur Actuels

#### 404 - Route Non Trouvée
```typescript
// ❌ Pas implémentée - Amélioration nécessaire
// Recommandation :
<Routes>
  {/* ... routes existantes */}
  <Route path="*" element={<NotFoundPage />} />
</Routes>
```

#### 401 - Non Authentifié
```typescript
// ✅ Géré par AuthProvider
// Affichage automatique de LoginPage
{isLogin ? children : <LoginPage />}
```

#### 403 - Accès Refusé
```typescript
// ❌ Pas implémentée - Pas de gestion par rôle
// Amélioration future nécessaire
```

## Navigation Programmatique

### Hooks de Navigation
```typescript
// Usage recommandé (React Router v6)
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();

// Navigation simple
navigate('/dashboard');

// Navigation avec remplacement
navigate('/dashboard', { replace: true });

// Navigation avec état
navigate('/dishes', { state: { fromDashboard: true } });
```

### Navigation Conditionnelle
```typescript
// Pattern pour navigation conditionnelle
const handleAction = async () => {
  try {
    await performAction();
    navigate('/success');
  } catch (error) {
    navigate('/error', { state: { error: error.message } });
  }
};
```

## Deep Links et QR Codes

### État Actuel
- ❌ **Deep Links** : Pas d'implémentation spécifique
- ❌ **QR Codes** : Pas d'intégration détectée
- ❌ **Paramètres d'URL** : Pas d'utilisation des query params

### Amélioration Future
```typescript
// Pour QR codes de tables/cartes
// Route suggérée : /table/:tableId
// Route suggérée : /menu/:cardId

<Route path="/table/:tableId" element={<TableViewPage />} />
<Route path="/menu/:cardId" element={<MenuViewPage />} />
```

## Invariants et Règles Métier

### Règles d'Accès Actuelles

#### Authentification Obligatoire
- ✅ **Toutes les routes** nécessitent une authentification Firebase
- ✅ **Token JWT** validé automatiquement par Firebase Auth
- ✅ **Session persistante** via Firebase Auth

#### Rôles et Permissions
- ❌ **Pas de gestion de rôles** côté frontend actuellement
- 🔄 **À implémenter** : Distinction waiter/manager/admin

### Règles Suggérées (Amélioration Future)
```typescript
// Exemple de règles par rôle
const ROUTE_PERMISSIONS = {
  '/dashboard': ['waiter', 'manager', 'admin'],
  '/dishes': ['manager', 'admin'],
  '/cards': ['manager', 'admin'], 
  '/settings': ['waiter', 'manager', 'admin'],
  '/admin': ['admin']
};

// Hook pour vérification des permissions
const useRoutePermission = (route: string) => {
  const { user } = useAuth();
  const requiredRoles = ROUTE_PERMISSIONS[route] || [];
  return user?.roles?.some(role => requiredRoles.includes(role));
};
```

## Fallbacks et Loading States

### Suspense Boundaries
```typescript
// Fallback global pour lazy loading
<Suspense
  fallback={
    <div className="flex items-center justify-center h-full">
      <Loading size="medium" text="Chargement de la page..." />
    </div>
  }
>
  <Routes>
    {/* ... routes */}
  </Routes>
</Suspense>
```

### Loading States
- ✅ **Page Loading** : Loading component pendant le lazy loading
- ✅ **Auth Loading** : Loading pendant la vérification d'authentification
- ❌ **Route Transition** : Pas d'animation entre les routes

## URL Structure et SEO

### Structure Actuelle
```
https://domain.com/
├── /                    # Dashboard
├── /dashboard          # Dashboard (alias)
├── /dishes             # Gestion plats
├── /cards              # Gestion cartes
├── /settings           # Paramètres
└── /home               # Legacy redirect
```

### Améliorations SEO (Futures)
```typescript
// Titres de page dynamiques
import { Helmet } from 'react-helmet-async';

const DashboardPage = () => (
  <>
    <Helmet>
      <title>Tableau de Bord - Restaurant ERP</title>
      <meta name="description" content="Tableau de bord du système de gestion restaurant" />
    </Helmet>
    {/* Contenu page */}
  </>
);
```

## Configuration Serveur

### Historique HTML5 (BrowserRouter)
Pour le déploiement, le serveur doit rediriger toutes les routes vers `index.html` :

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
RewriteEngine On
RewriteRule ^(?!.*\.).*$ /index.html [L]
```

## Monitoring et Analytics

### État Actuel
- ❌ **Analytics** : Pas de tracking des routes
- ❌ **Performance** : Pas de mesure des temps de chargement
- ❌ **Erreurs** : Pas de monitoring des erreurs de navigation

### Améliorations Futures
```typescript
// Google Analytics pour SPA
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const usePageTracking = () => {
  const location = useLocation();
  
  useEffect(() => {
    gtag('config', 'GA_TRACKING_ID', {
      page_path: location.pathname,
    });
  }, [location]);
};
```

## Tests de Routing

### Tests Existants
- ❌ **Tests de routing** : Aucun test spécifique détecté
- ✅ **Tests de composants** : Pages testées individuellement

### Tests Recommandés
```typescript
// Tests de navigation
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

test('should navigate to dashboard', () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>
  );
  
  expect(screen.getByText(/tableau de bord/i)).toBeInTheDocument();
});
```

## Roadmap Routing

### Améliorations Prioritaires
1. **404 Page** : Route catch-all pour les erreurs 404
2. **Role-based Guards** : Protection des routes par rôle utilisateur
3. **Deep Link Preservation** : Sauvegarder la route demandée avant login
4. **Error Boundaries** : Gestion des erreurs de composants

### Améliorations Secondaires
1. **QR Code Integration** : Routes pour tables/menus via QR
2. **Route Transitions** : Animations entre les pages
3. **SEO Optimization** : Titres et meta tags dynamiques
4. **Analytics Integration** : Tracking des pages visitées