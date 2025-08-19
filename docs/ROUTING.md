# Routing — C2.2.3 / C2.4.1

## Configuration du Routing

Le projet utilise **React Router DOM v6.22** pour la navigation SPA (Single Page Application).

## Routes Définies

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

### Routes Disponibles

| Route | Composant | Description | Accès |
|-------|-----------|-------------|--------|
| `/` | DashboardPage | Page d'accueil (tableau de bord) | Authentifié |
| `/dashboard` | DashboardPage | Tableau de bord principal | Authentifié |
| `/dishes` | DishesPage | Gestion des plats | Authentifié |
| `/cards` | CardsPage | Gestion des cartes/menus | Authentifié |
| `/settings` | SettingsPage | Paramètres utilisateur | Authentifié |
| `/home` | Redirect → Dashboard | Ancienne route (compatibilité) | Authentifié |

## Protection des Routes

### AuthProvider Global

Toutes les routes sont protégées par le `AuthProvider` qui englobe l'application :

```typescript
const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(false);
  
  useEffect(() => {
    const unsubscribe = firebaseAuthManager.monitorAuthState((user) => {
      setIsLogin(!!user);
      setIsLoading(false);
    });
    
    return () => unsubscribe?.();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      {isLogin ? children : <LoginPage />}
    </>
  );
};
```

### Flux d'Authentification

1. **Non authentifié** → Affichage de `LoginPage`
2. **Authentifié** → Accès aux routes protégées
3. **Chargement** → Loading state pendant la vérification

## Gestion des États de Route

### 404 - Page Non Trouvée

Actuellement, pas de route catch-all définie. Comportement par défaut :
- Routes non définies → Page blanche
- **TODO** : Ajouter `<Route path="*" element={<NotFoundPage />} />`

### 401 - Non Authentifié

Géré par `AuthProvider` :
- Redirection automatique vers `LoginPage`
- Pas de page 401 dédiée (comportement global)

### 403 - Accès Refusé

Pas de gestion granulaire des rôles actuellement.
- **Amélioration future** : Middleware de vérification des rôles

## Navigation

### NavBar Component

```typescript
// src/UI/components/navigation/NavBar.tsx
const NavBar = ({ isOpen, onClose }) => {
  // Navigation links
  const navItems = [
    { path: '/dashboard', label: 'Tableau de bord', icon: DashboardIcon },
    { path: '/dishes', label: 'Plats', icon: DishesIcon },
    { path: '/cards', label: 'Cartes', icon: CardsIcon },
    { path: '/settings', label: 'Paramètres', icon: SettingsIcon }
  ];
  
  return (
    <nav>
      {navItems.map(item => (
        <NavLink 
          key={item.path}
          to={item.path}
          className={({ isActive }) => 
            isActive ? 'active-class' : 'default-class'
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
};
```

### Navigation Mobile

Gestion responsive avec état local :

```typescript
const [isSidebarOpen, setIsSidebarOpen] = useState(false);

// Bouton burger mobile
<button
  aria-label="Ouvrir le menu"
  onClick={toggleSidebar}
  className="md:hidden"
>
  {/* Icône hamburger */}
</button>

// Overlay mobile
{isSidebarOpen && (
  <div
    className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-40"
    onClick={closeSidebar}
  />
)}
```

## Lazy Loading des Routes

Optimisation des performances avec chargement différé :

```typescript
// Imports lazy
const DashboardPage = lazy(() => import("./UI/pages/dashboard/dashboard.page"));
const DishesPage = lazy(() => import("./UI/pages/dishes/dishes.page"));
const CardsPage = lazy(() => import("./UI/pages/cards/cards.page"));
const SettingsPage = lazy(() => import("./UI/pages/settings/settings.page"));

// Suspense wrapper
<Suspense
  fallback={
    <div className="flex items-center justify-center h-full">
      <Loading size="medium" text="Chargement de la page..." />
    </div>
  }
>
  <Routes>{/* ... */}</Routes>
</Suspense>
```

## Deep Links et QR Codes

### État Actuel
Pas de gestion spécifique des deep links ou QR codes.

### Amélioration Future
```typescript
// Exemple de deep link pour carte restaurant
<Route path="/menu/:restaurantId/:tableNumber" element={<MenuQRPage />} />

// Gestion dans le composant
const { restaurantId, tableNumber } = useParams();
```

## Redirections

### Post-Login
- Redirection automatique vers `/dashboard` après connexion réussie
- Gérée par le re-render du `AuthProvider`

### Post-Logout
- Retour automatique à `LoginPage`
- Nettoyage de l'état Firebase

### Routes Legacy
```typescript
// Compatibilité avec anciennes URLs
<Route path="/home" element={<DashboardPage />} />
```

## Invariants et Règles Métier

### Accès par Rôle (Planifié)

Structure envisagée pour la gestion des rôles :

```typescript
interface RouteConfig {
  path: string;
  element: ReactElement;
  requiredRole?: UserRole;
}

enum UserRole {
  CUSTOMER = 0,
  WAITER = 1,
  CHEF = 2,
  MANAGER = 3,
  ADMIN = 4
}

// Exemple d'invariants
const routes: RouteConfig[] = [
  { path: '/dashboard', element: <Dashboard />, requiredRole: UserRole.WAITER },
  { path: '/dishes', element: <Dishes />, requiredRole: UserRole.CHEF },
  { path: '/cards', element: <Cards />, requiredRole: UserRole.MANAGER },
  { path: '/settings', element: <Settings /> }, // Accessible à tous
];
```

## Gestion de l'État de Navigation

### Historique
React Router gère automatiquement l'historique du navigateur :
- Boutons retour/avancer fonctionnels
- URLs bookmarkables
- Rafraîchissement de page préservé

### État Local
Navigation state peut être passé :

```typescript
navigate('/dishes', { state: { from: 'dashboard' } });

// Récupération
const location = useLocation();
const { from } = location.state || {};
```

## Tests de Navigation

Recommandations pour tester le routing :

```typescript
// Test d'accès non authentifié
test('redirects to login when not authenticated', () => {
  render(<App />);
  expect(screen.getByText('Connexion')).toBeInTheDocument();
});

// Test de navigation
test('navigates to dishes page', async () => {
  const user = userEvent.setup();
  render(<App />);
  
  await user.click(screen.getByText('Plats'));
  expect(screen.getByText('Gestion des plats')).toBeInTheDocument();
});
```