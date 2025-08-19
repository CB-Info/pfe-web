# State Management — C2.2.3

## Architecture du State Management

### Approche React Context + useReducer
Le projet utilise une approche native React sans bibliothèque externe (Redux/Zustand) :

- **React Context API** : Pour partager l'état entre composants
- **useReducer** : Pour les états complexes avec logique métier
- **useState local** : Pour les états simples de composant
- **localStorage** : Pour la persistance (thème, alertes)

## Structure des Contexts

### 1. AuthProvider - Authentification

#### State Structure
```typescript
// src/reducers/auth.reducer.ts
interface UsersListerLocalState {
    currentUser: User | undefined;
}

export const UsersListerInitialState: UsersListerLocalState = {
    currentUser: undefined
}
```

#### Actions
```typescript
type UsersListerAction = 
| { type: 'UPDATE_USER'; payload: User | undefined }

export const usersListerlocalReducer = (state: UsersListerLocalState, action: UsersListerAction) => {
    switch (action.type) {
      case 'UPDATE_USER':
          return { ...state, currentUser: action.payload }
      default:
          return state
    }
};
```

#### Provider Implementation
```typescript
// src/contexts/auth.provider.tsx
const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(usersListerlocalReducer, UsersListerInitialState);
  const [isLogin, setIsLogin] = useState(false);
  
  useEffect(() => {
    const unsubscribe = firebaseAuthManager.monitorAuthState((user) => {
      setIsLogin(!!user);
      // dispatch({ type: 'UPDATE_USER', payload: user }); // Si nécessaire
    });
    return () => unsubscribe?.();
  }, []);

  return (
    <UsersListerStateContext.Provider value={state}>
      <UsersListerDispatchContext.Provider value={dispatch}>
        {isLogin ? children : <LoginPage />}
      </UsersListerDispatchContext.Provider>
    </UsersListerStateContext.Provider>
  );
};
```

#### Usage
```typescript
// Hooks personnalisés pour l'auth
export function useUsersListerStateContext() {
    const context = useContext(UsersListerStateContext);
    if (context === undefined) {
      throw new Error('useStateContext must be used within a MyProvider');
    }
    return context;
}

export function useUsersListerDispatchContext() {
    const context = useContext(UsersListerDispatchContext);
    if (context === undefined) {
        throw new Error('useDispatchContext must be used within a MyProvider');
    }
    return context;
}
```

### 2. AlertsProvider - Notifications

#### State Structure
```typescript
// src/contexts/alerts.types.ts
export interface AlertType {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message?: string;
  duration?: number;
  persistent?: boolean;
  groupId?: string;
}

// Context interface
interface AlertsContextType {
  alerts: AlertType[];
  addAlert: (alert: Omit<AlertType, 'id'>) => string;
  dismissAlert: (id: string) => void;
}
```

#### Provider avec Logique Complexe
```typescript
// src/contexts/alerts.context.tsx
const AlertsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<AlertType[]>([]);
  
  // Durées par défaut
  const defaultDurations = {
    info: 5,
    warning: 5, 
    error: 7,
    success: 5,
  };

  // Ajout d'alerte avec ID auto-généré
  const addAlert = (alert: Omit<AlertType, 'id'>): string => {
    const id = `alert-${Date.now()}-${Math.random()}`;
    const newAlert: AlertType = {
      ...alert,
      id,
      duration: alert.duration ?? defaultDurations[alert.type],
    };
    
    setAlerts(prev => [...prev.slice(-2), newAlert]); // Max 3 alertes
    
    // Auto-dismiss si non persistant
    if (!newAlert.persistent && newAlert.duration) {
      setTimeout(() => dismissAlert(id), newAlert.duration * 1000);
    }
    
    return id;
  };

  const dismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  return (
    <AlertsContext.Provider value={{ alerts, addAlert, dismissAlert }}>
      {children}
      <AlertsRenderer alerts={alerts} onDismiss={dismissAlert} />
    </AlertsContext.Provider>
  );
};
```

#### Persistance LocalStorage
```typescript
// Sauvegarde des alertes importantes
const loadPersistedAlerts = (): AlertType[] => {
  try {
    const raw = localStorage.getItem('persistedAlerts');
    return raw ? JSON.parse(raw) as AlertType[] : [];
  } catch {
    return [];
  }
};

const savePersistedAlerts = (alerts: AlertType[]): void => {
  localStorage.setItem('persistedAlerts', JSON.stringify(alerts));
};
```

#### Hook Personnalisé
```typescript
// src/hooks/useAlerts.ts
export const useAlerts = () => {
  const context = useContext(AlertsContext);
  if (!context) {
    throw new Error('useAlerts must be used within an AlertsProvider');
  }

  const { addAlert, dismissAlert } = context;
  const [alertIds, setAlertIds] = useState<string[]>([]);

  const addAlertWithId = (alert: Omit<AlertType, 'id'>): void => {
    const id = addAlert(alert);
    setAlertIds(prev => [...prev, id]);
  }

  const clearAlerts = (): void => {
    alertIds.forEach(dismissAlert);
    setAlertIds([]);
  }

  return { addAlert: addAlertWithId, clearAlerts };
};
```

### 3. ThemeProvider - Thème Dark/Light

#### State Simple avec Persistance
```typescript
// src/contexts/theme.context.tsx
interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Initialisation depuis localStorage
    const [isDarkMode, setIsDarkMode] = useState(() => {
      const savedTheme = localStorage.getItem('isDarkMode');
      return savedTheme === 'true' ? true : false;
    });
  
    const toggleTheme = () => {
      setIsDarkMode(!isDarkMode);
      localStorage.setItem('isDarkMode', String(!isDarkMode)); // Persistance
    };
  
    return (
      <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
        {children}
      </ThemeContext.Provider>
    );
};
```

#### Hook Personnalisé
```typescript
// src/hooks/useTheme.ts
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
```

## Règles d'Update Immutables

### Pattern d'Update dans les Reducers
```typescript
// ✅ Immutable updates
const usersListerlocalReducer = (state, action) => {
    switch (action.type) {
      case 'UPDATE_USER':
          return { ...state, currentUser: action.payload } // Spread operator
      default:
          return state
    }
};

// ✅ Immutable updates dans les Context
const addAlert = (alert) => {
    setAlerts(prev => [...prev.slice(-2), newAlert]); // Nouveau tableau
};

const dismissAlert = (id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id)); // Filter = nouveau tableau
};
```

### Éviter les Mutations
```typescript
// ❌ Mutation directe (évité)
// state.currentUser = newUser;
// alerts.push(newAlert);

// ✅ Création de nouveaux objets/tableaux
const newState = { ...state, currentUser: newUser };
const newAlerts = [...alerts, newAlert];
```

## Sélecteurs et Hooks Personnalisés

### Hooks d'Accès aux States
```typescript
// Hook pour l'état d'authentification
export const useAuth = () => {
  const state = useUsersListerStateContext();
  const dispatch = useUsersListerDispatchContext();
  
  return {
    currentUser: state.currentUser,
    updateUser: (user: User) => dispatch({ type: 'UPDATE_USER', payload: user }),
  };
};

// Hook pour les alertes
export const useAlerts = () => {
  const context = useContext(AlertsContext);
  return {
    addAlert: context.addAlert,
    dismissAlert: context.dismissAlert,
    clearAlerts: () => { /* logique */ }
  };
};

// Hook pour le thème
export const useTheme = () => {
  const context = useContext(ThemeContext);
  return {
    isDarkMode: context.isDarkMode,
    toggleTheme: context.toggleTheme,
  };
};
```

### Sélecteurs Simples
```typescript
// Pattern de sélection dans les composants
const MyComponent = () => {
  const { currentUser } = useAuth();
  const { isDarkMode } = useTheme();
  const { addAlert } = useAlerts();
  
  // Utilisation des states...
};
```

## Persistance des Données

### LocalStorage Usage
```typescript
// Thème persistant
localStorage.setItem('isDarkMode', String(isDarkMode));
const savedTheme = localStorage.getItem('isDarkMode');

// Alertes persistantes (pour les importantes)
localStorage.setItem('persistedAlerts', JSON.stringify(alerts));
const persistedAlerts = JSON.parse(localStorage.getItem('persistedAlerts') || '[]');
```

### Session vs Persistent Storage
- ✅ **Theme** : localStorage (persistant entre sessions)
- ✅ **Alertes importantes** : localStorage (persistant)
- ✅ **Auth State** : En mémoire via Firebase (sécurisé)
- ❌ **Données métier** : Pas de cache local (refetch à chaque fois)

## Gestion du Cache

### État Actuel - Pas de Cache
```typescript
// ❌ Pas de cache API actuellement
// Chaque appel refetch les données
const dishes = await dishesRepository.getAll(); // Toujours un appel réseau
```

### Amélioration Future - React Query
```typescript
// 🔄 Recommandation : TanStack Query
const useDishes = () => {
  return useQuery({
    queryKey: ['dishes'],
    queryFn: () => dishesRepository.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};
```

## Invalidations et Mutations

### Pattern Actuel - Manuel
```typescript
// Invalidation manuelle après mutations
const handleCreateDish = async (dish: DishCreationDto) => {
  try {
    await dishesRepository.create(dish);
    // ❌ Pas d'invalidation automatique
    // Il faut recharger manuellement la liste
    await refetchDishes();
  } catch (error) {
    addAlert({ type: 'error', title: 'Erreur', message: error.message });
  }
};
```

### Amélioration Future - Mutations Optimistes
```typescript
// 🔄 Avec React Query
const useCreateDish = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: dishesRepository.create,
    onSuccess: () => {
      // Invalidation automatique
      queryClient.invalidateQueries(['dishes']);
    },
    onError: (error) => {
      addAlert({ type: 'error', title: 'Erreur', message: error.message });
    }
  });
};
```

## Architecture des States Locaux

### Pattern de State Local
```typescript
// États de formulaire
const [formData, setFormData] = useState<DishCreationDto>({
  name: '',
  price: 0,
  description: '',
  category: DishCategory.MAIN_DISHES,
  ingredients: [],
  isAvailable: true
});

// États UI
const [isLoading, setIsLoading] = useState(false);
const [errors, setErrors] = useState<Record<string, string>>({});
const [isSubmitted, setIsSubmitted] = useState(false);
```

### Lifting State Up
```typescript
// État partagé entre composants siblings
const ParentComponent = () => {
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  
  return (
    <>
      <DishList onDishSelect={setSelectedDish} />
      <DishDetails dish={selectedDish} />
    </>
  );
};
```

## Performance et Optimisations

### Éviter les Re-renders
```typescript
// ✅ Mémoisation des valeurs de context
const authContextValue = useMemo(() => ({
  currentUser: state.currentUser,
  updateUser: (user: User) => dispatch({ type: 'UPDATE_USER', payload: user }),
}), [state.currentUser]);

// ✅ Callbacks stables
const toggleTheme = useCallback(() => {
  setIsDarkMode(prev => !prev);
  localStorage.setItem('isDarkMode', String(!isDarkMode));
}, [isDarkMode]);
```

### Séparation des Contexts
- ✅ **Contexts séparés** : Auth, Alerts, Theme (évite re-renders inutiles)
- ✅ **Hooks spécialisés** : Un hook par context
- ✅ **State colocation** : État local quand possible

## Debugging et DevTools

### État Actuel
- ❌ **Redux DevTools** : Pas d'intégration (pas de Redux)
- ✅ **React DevTools** : Inspection des contexts disponible
- ✅ **Console logs** : Dans les reducers pour debug

### Amélioration Future
```typescript
// Logger pour les actions
const usersListerlocalReducer = (state, action) => {
    console.log('Auth Action:', action.type, action.payload); // Debug
    switch (action.type) {
      // ...
    }
};

// Context DevTools
const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(usersListerlocalReducer, UsersListerInitialState);
  
  // Debug state changes
  useEffect(() => {
    console.log('Auth State Changed:', state);
  }, [state]);
  
  return (/* ... */);
};
```

## Conventions et Best Practices

### Naming Conventions
```typescript
// Contexts
AuthProvider, AlertsProvider, ThemeProvider

// Hooks
useAuth, useAlerts, useTheme

// Actions
'UPDATE_USER', 'ADD_ALERT', 'DISMISS_ALERT'

// State interfaces
UsersListerLocalState, AlertsContextType, ThemeContextType
```

### Error Boundaries
```typescript
// Pattern pour error handling
const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

### Type Safety
```typescript
// Types stricts pour les actions
type UsersListerAction = 
| { type: 'UPDATE_USER'; payload: User | undefined }
// Pas d'action 'any' ou string générique

// Interfaces complètes pour les contexts
interface AlertsContextType {
  alerts: AlertType[];
  addAlert: (alert: Omit<AlertType, 'id'>) => string;
  dismissAlert: (id: string) => void;
}
```

## Migration Future

### Vers React Query/TanStack Query
```typescript
// Migration recommandée pour le cache API
// Garder les contexts pour UI state (theme, alerts, auth)
// Utiliser React Query pour server state (dishes, cards, etc.)

const App = () => (
  <QueryClient client={queryClient}>
    <ThemeProvider>
      <AlertsProvider>
        <AuthProvider>
          <Router>
            <Routes>...</Routes>
          </Router>
        </AuthProvider>
      </AlertsProvider>
    </ThemeProvider>
  </QueryClient>
);
```

### Vers Zustand (Alternative)
```typescript
// Si besoin d'un store plus robuste
import { create } from 'zustand';

const useAuthStore = create((set) => ({
  currentUser: null,
  updateUser: (user) => set({ currentUser: user }),
}));
```