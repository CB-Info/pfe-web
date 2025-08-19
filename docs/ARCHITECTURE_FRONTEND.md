# Architecture Frontend — C2.2.3

## Stack Technique Détectée

### Outils de Build et Framework
- **Build Tool** : Vite 7.0.5 avec SWC
- **Framework** : React 18.2.0 avec TypeScript 5.2.2
- **Routing** : React Router DOM 6.22.0
- **Bundler** : Vite avec plugins React SWC et Babel Macros

### Dépendances Principales
- **UI Framework** : Material-UI 5.15.10 + Headless UI 1.7.18
- **Styling** : Tailwind CSS 3.4.1 + DaisyUI 4.7.0 + Styled Components 6.1.8
- **State Management** : React Context + useReducer
- **HTTP Client** : Fetch API native + Axios 1.6.7
- **Authentication** : Firebase 12.0.0
- **Animations** : Framer Motion 11.0.3 + Lottie React 2.4.1
- **Notifications** : React Hot Toast 2.4.1

## Arborescence Source

```
src/
├── applications/           # Configuration applicative
│   ├── css/               # Styles globaux
│   └── theme/             # Thèmes styled-components
├── assets/                # Ressources statiques
├── config/                # Configuration (Firebase)
├── contexts/              # Contexts React (Auth, Alerts, Theme)
├── data/                  # DTOs et modèles
│   ├── dto/              # Data Transfer Objects
│   └── models/           # Modèles métier
├── hooks/                 # Hooks personnalisés
├── network/               # Couche réseau
│   ├── authentication/   # Gestionnaire auth Firebase
│   └── repositories/     # Repositories API
├── reducers/              # Reducers pour useReducer
├── tests/                 # Tests unitaires
└── UI/                    # Interface utilisateur
    ├── components/        # Composants réutilisables
    │   ├── buttons/
    │   ├── common/
    │   ├── forms/
    │   ├── navigation/
    │   └── tables/
    ├── pages/            # Pages de l'application
    └── style/            # Styles spécifiques
```

## Conventions de Modules

### Organisation des Composants
- **Atomic Design** partiel : composants dans `UI/components/` organisés par type
- **Pages** : dans `UI/pages/` avec lazy loading
- **Hooks** : hooks métier dans `hooks/`
- **Utils** : utilitaires dans modules respectifs

### Conventions de Nommage
- **Composants** : PascalCase avec suffixe `.tsx`
- **Pages** : PascalCase avec suffixe `.page.tsx`
- **Hooks** : camelCase avec préfixe `use`
- **Types/DTOs** : PascalCase avec suffixe `.dto.ts` ou `.model.ts`

## Routing

### Configuration
- **Router** : BrowserRouter de React Router DOM
- **Lazy Loading** : Toutes les pages sont chargées avec `lazy()`
- **Suspense** : Fallback avec composant Loading personnalisé

### Routes Actuelles
```typescript
<Routes>
  <Route path="/" element={<DashboardPage />} />
  <Route path="/dashboard" element={<DashboardPage />} />
  <Route path="/dishes" element={<DishesPage />} />
  <Route path="/cards" element={<CardsPage />} />
  <Route path="/settings" element={<SettingsPage />} />
  <Route path="/home" element={<DashboardPage />} /> {/* Redirect legacy */}
</Routes>
```

## State Management

### Architecture
- **Context API** : 3 contexts principaux
  - `AuthProvider` : État d'authentification
  - `AlertsProvider` : Gestion des notifications
  - `ThemeProvider` : Gestion du thème dark/light
- **useReducer** : Pour les états complexes (auth, alerts)
- **useState local** : Pour les états de composant

### Structure des Contexts
```typescript
// Auth Context avec reducer
UsersListerStateContext + UsersListerDispatchContext

// Alerts Context avec reducer
AlertsContext (state + dispatch combinés)

// Theme Context simple
ThemeContext (isDarkMode + toggle)
```

## Organisation UI

### Structure des Composants
- **Layout** : NavBar responsive avec sidebar mobile
- **Common** : Loading, Alert, Badge
- **Forms** : Composants de formulaire réutilisables  
- **Tables** : Composants de tableaux
- **Buttons** : Boutons personnalisés avec variants

### Styles
- **Tailwind CSS** : Classes utilitaires avec configuration personnalisée
- **DaisyUI** : Composants pré-stylés
- **Styled Components** : Pour les composants complexes avec thème
- **Twin.macro** : Intégration Tailwind + Styled Components

### Gestion des Assets
- **Public** : Assets statiques dans `/public`
- **Imports** : Assets importés via Vite
- **Lottie** : Animations JSON

## Diagramme des Flux

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   UI Component  │───▶│   Context/Hook   │───▶│   Repository    │
│                 │    │                  │    │                 │
│ - User Action   │    │ - State Update   │    │ - API Call      │
│ - Event Handler │    │ - Dispatch       │    │ - Token Auth    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         ▲                        │                       │
         │                        ▼                       ▼
         │               ┌──────────────────┐    ┌─────────────────┐
         │               │   Local State    │    │   Backend API   │
         │               │                  │    │                 │
         └───────────────│ - Component      │    │ - Firebase Auth │
                         │ - Context        │    │ - REST API      │
                         └──────────────────┘    └─────────────────┘
```

## Patterns Clés

### 1. Authentication Guard
```typescript
// Dans AuthProvider
{isLogin ? children : <LoginPage />}
```

### 2. Lazy Loading avec Suspense
```typescript
const DashboardPage = lazy(() => import("./UI/pages/dashboard/dashboard.page"));

<Suspense fallback={<Loading size="medium" text="Chargement..." />}>
  <Routes>...</Routes>
</Suspense>
```

### 3. Repository Pattern
```typescript
class DishesRepositoryImpl {
  private url = `${import.meta.env.VITE_API_BASE_URL}/dishes`;
  
  async getDishes(): Promise<Dish[]> {
    const token = await FirebaseAuthManager.getInstance().getToken();
    // ... appel API avec auth
  }
}
```

### 4. Context + Reducer Pattern
```typescript
const [state, dispatch] = useReducer(reducer, initialState);
return (
  <StateContext.Provider value={state}>
    <DispatchContext.Provider value={dispatch}>
      {children}
    </DispatchContext.Provider>
  </StateContext.Provider>
);
```

## Configuration Build

### Vite Configuration
- **Plugins** : React SWC, Babel Macros, Bundle Analyzer
- **Test** : Vitest avec jsdom
- **TypeScript** : Strict mode activé
- **Hot Reload** : Via Vite HMR

### TypeScript Configuration
- **Target** : ES2020
- **Module** : ESNext avec bundler resolution
- **Strict** : Mode strict complet
- **JSX** : react-jsx transform

## Évolutivité

### Points Forts
- Architecture modulaire avec séparation des responsabilités
- Lazy loading des pages pour les performances
- Context API bien structuré
- TypeScript strict pour la robustesse
- Repository pattern pour l'abstraction API

### Améliorations Futures
- Considérer React Query/TanStack Query pour le cache API
- Implémenter un store plus robuste (Zustand/Redux Toolkit) si la complexité augmente
- Ajouter React Error Boundaries
- Optimiser le bundle splitting avec Vite