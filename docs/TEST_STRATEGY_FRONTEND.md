# Stratégie de Tests Frontend — C2.2.2

## Outils de Test Utilisés

### Stack de Test Actuelle
- **Test Runner** : Vitest 3.2.4 (successeur de Jest pour Vite)
- **Testing Library** : React Testing Library 16.0.0
- **Environment** : jsdom 24.1.0 (simulation DOM dans Node.js)
- **Matchers** : @testing-library/jest-dom 6.4.6
- **Coverage** : @vitest/coverage-v8 3.2.4
- **UI Test Runner** : @vitest/ui 3.2.4 (interface graphique)

### Configuration Vitest
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react(), macrosPlugin(), visualizer()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts'
  },
})
```

### Setup des Tests
```typescript
// src/setupTests.ts
import '@testing-library/jest-dom';
```

## Pyramide des Tests

### Tests Unitaires (Base de la Pyramide)
**Objectif** : Tester les composants individuellement en isolation

#### Tests de Composants UI
```typescript
// Exemple : src/tests/custom.button.test.tsx
describe('CustomButton', () => {
  test('renders with correct text', () => {
    render(
      <CustomButton 
        type={TypeButton.PRIMARY}
        width={WidthButton.MEDIUM}
        isLoading={false}
        onClick={() => {}}
      >
        Click me
      </CustomButton>
    );
    
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  test('shows loading state when isLoading is true', () => {
    render(
      <CustomButton 
        type={TypeButton.PRIMARY}
        width={WidthButton.MEDIUM}
        isLoading={true}
        onClick={() => {}}
      >
        Click me
      </CustomButton>
    );
    
    expect(screen.getByTestId('loading-component')).toBeInTheDocument();
  });
});
```

#### Tests de Hooks et Utilitaires
```typescript
// Exemple : src/tests/dishes.utils.test.ts
describe('Dish utilities', () => {
  test('calculateDishTotal returns correct sum', () => {
    const dish = createMockDish();
    const total = calculateDishTotal(dish);
    expect(total).toBe(expectedTotal);
  });
});
```

### Tests d'Intégration (Milieu de la Pyramide)
**Objectif** : Tester l'interaction entre composants et contexts

#### Tests de Context
```typescript
// Exemple : src/tests/alerts.context.test.tsx
describe('AlertsProvider', () => {
  test('stores alert in localStorage when persist is true', () => {
    render(
      <AlertsProvider>
        <TestComponent />
      </AlertsProvider>
    );

    fireEvent.click(screen.getByText('add'));
    const stored = JSON.parse(localStorage.getItem('persistedAlerts') || '[]');
    expect(stored.length).toBe(1);
    expect(stored[0].message).toBe('persisted');
  });
});
```

#### Tests de Navigation
```typescript
// Exemple : src/tests/navigation.bar.test.tsx
describe('NavBar', () => {
  test('renders navigation items correctly', () => {
    render(
      <BrowserRouter>
        <NavBar isOpen={true} onClose={() => {}} />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/dishes/i)).toBeInTheDocument();
  });
});
```

### Tests End-to-End (Sommet de la Pyramide)
**État Actuel** : ❌ Pas implémentés
**Recommandation Future** : Playwright ou Cypress

## Conventions de Nommage

### Structure des Fichiers de Test
```
src/tests/
├── custom.button.test.tsx      # Tests de composants
├── alerts.context.test.tsx     # Tests de contexts
├── navigation.bar.test.tsx     # Tests de navigation
├── dishes.utils.test.ts        # Tests d'utilitaires
├── welcome.test.tsx            # Tests de pages
└── alert.test.tsx              # Tests de composants d'alerte
```

### Conventions de Nommage
- **Fichiers** : `component.name.test.tsx` ou `utility.name.test.ts`
- **Describe blocks** : Nom du composant/fonction testée
- **Test cases** : Description comportementale (`should do X when Y`)

```typescript
describe('ComponentName', () => {
  test('should render correctly with props', () => {
    // Test implementation
  });
  
  test('should handle click events', () => {
    // Test implementation
  });
});
```

## Stratégies de Mocking

### Mocking des Composants Lourds
```typescript
// Mock Lottie pour éviter les erreurs dans les tests
vi.mock("lottie-react", () => ({
  default: ({ animationData, loop, autoplay }: any) => (
    <div 
      data-testid="lottie-animation"
      data-loop={loop}
      data-autoplay={autoplay}
    />
  ),
}));

// Mock du composant Loading
vi.mock("../UI/components/common/loading.component", () => ({
  default: ({ variant = "classic", size = "medium", text }: any) => (
    <div
      role="progressbar"
      data-testid="loading-component"
      data-variant={variant}
      data-size={size}
    >
      {text && <span>{text}</span>}
    </div>
  ),
}));
```

### Mocking des APIs
```typescript
// Mock Firebase Auth Manager
vi.mock("../network/authentication/firebase.auth.manager", () => ({
  default: {
    getInstance: () => ({
      getToken: vi.fn().mockResolvedValue('mock-token'),
      monitorAuthState: vi.fn(),
    }),
  },
}));
```

### Mocking du localStorage
```typescript
beforeEach(() => {
  localStorage.clear();
});

// Mock localStorage si nécessaire
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true,
});
```

## Scripts NPM de Test

### Scripts Disponibles
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "ci:check": "npm run lint && npm run test && npm run build"
  }
}
```

### Usage des Scripts
```bash
# Lancer les tests en mode watch
npm run test

# Interface graphique des tests
npm run test:ui

# Tests avec rapport de couverture
npm run test:coverage

# Tests en mode CI (run once)
npm run test -- --run

# Tests avec verbose output
npm run test -- --reporter=verbose
```

## Couverture de Code

### Métriques Actuelles (Basées sur le Coverage Report)
- **Fichiers testés** : 6 fichiers de test
- **Tests passants** : 27 tests
- **Durée d'exécution** : ~2 secondes
- **Couverture** : Rapport HTML généré dans `coverage/`

### Fichiers Testés
1. `custom.button.test.tsx` - 9 tests
2. `alerts.context.test.tsx` - 5 tests  
3. `navigation.bar.test.tsx` - 2 tests
4. `alert.test.tsx` - 6 tests
5. `welcome.test.tsx` - 1 test
6. `dishes.utils.test.ts` - 4 tests

### Zones Non Couvertes
- **Pages** : La plupart des pages ne sont pas testées
- **Repositories** : Aucun test sur les appels API
- **Hooks personnalisés** : Tests limités
- **Intégration Firebase** : Mocks seulement

## Stratégie de Test par Type de Code

### 1. Composants UI
```typescript
// Pattern de test pour composants
const renderComponent = (props = {}) => {
  const defaultProps = {
    type: TypeButton.PRIMARY,
    width: WidthButton.MEDIUM,
    isLoading: false,
    onClick: vi.fn(),
  };
  
  return render(<CustomButton {...defaultProps} {...props}>Test</CustomButton>);
};

describe('CustomButton', () => {
  test('renders with default props', () => {
    renderComponent();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
  
  test('calls onClick when clicked', () => {
    const mockClick = vi.fn();
    renderComponent({ onClick: mockClick });
    
    fireEvent.click(screen.getByRole('button'));
    expect(mockClick).toHaveBeenCalledTimes(1);
  });
});
```

### 2. Contexts et Providers
```typescript
// Pattern pour tester les contexts
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <AlertsProvider>
    {children}
  </AlertsProvider>
);

const TestComponent = () => {
  const { addAlert } = useAlerts();
  return (
    <button onClick={() => addAlert({ type: 'info', title: 'Test' })}>
      Add Alert
    </button>
  );
};

test('context provides expected functions', () => {
  render(<TestComponent />, { wrapper: TestWrapper });
  
  fireEvent.click(screen.getByText('Add Alert'));
  // Assert expected behavior
});
```

### 3. Hooks Personnalisés
```typescript
// Pattern pour tester les hooks
import { renderHook, act } from '@testing-library/react';

test('useTheme toggles theme correctly', () => {
  const wrapper = ({ children }: any) => (
    <ThemeProvider>{children}</ThemeProvider>
  );
  
  const { result } = renderHook(() => useTheme(), { wrapper });
  
  expect(result.current.isDarkMode).toBe(false);
  
  act(() => {
    result.current.toggleTheme();
  });
  
  expect(result.current.isDarkMode).toBe(true);
});
```

### 4. Utilitaires et Helpers
```typescript
// Tests directs pour les fonctions pures
describe('dish utilities', () => {
  test('formatPrice formats correctly', () => {
    expect(formatPrice(10.5)).toBe('10,50 €');
    expect(formatPrice(0)).toBe('0,00 €');
  });
  
  test('calculateTotal sums ingredients correctly', () => {
    const dish = createMockDish();
    expect(calculateDishTotal(dish)).toBe(15.50);
  });
});
```

## Améliorer la Couverture de Tests

### Plan Minimal Concret

#### Phase 1 : Tests Critiques (2-3 tests)
```typescript
// 1. Test d'intégration AuthProvider
describe('AuthProvider Integration', () => {
  test('redirects to login when not authenticated', () => {
    // Mock Firebase auth state
    render(<App />);
    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });
});

// 2. Test de navigation entre pages
describe('App Routing', () => {
  test('navigates between pages correctly', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <App />
      </MemoryRouter>
    );
    // Assert dashboard content loaded
  });
});

// 3. Test d'un repository (avec mock)
describe('DishesRepository', () => {
  test('fetches dishes correctly', async () => {
    const mockDishes = [createMockDish()];
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ data: mockDishes }),
    });
    
    const repository = new DishesRepositoryImpl();
    const dishes = await repository.getAll();
    
    expect(dishes).toHaveLength(1);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/dishes'),
      expect.objectContaining({
        headers: expect.objectContaining({
          'Authorization': 'Bearer mock-token',
        }),
      })
    );
  });
});
```

#### Phase 2 : Élargissement (5-10 tests)
- Tests de formulaires (validation, soumission)
- Tests de gestion d'erreurs
- Tests de states complexes (AlertsProvider complet)
- Tests de responsive design (media queries)

### Scripts pour Automatiser les Tests

```json
{
  "scripts": {
    "test:watch": "vitest --watch",
    "test:coverage:threshold": "vitest --coverage --coverage.threshold.statements=80",
    "test:debug": "vitest --inspect-brk --no-coverage",
    "test:changed": "vitest related"
  }
}
```

## Intégration CI/CD

### GitHub Actions (Existant)
```yaml
# .github/workflows/ci.yml (extrait)
- name: Run tests
  run: npm run test -- --run

- name: Generate coverage
  run: npm run test:coverage

- name: Upload coverage reports
  uses: codecov/codecov-action@v3
  with:
    file: ./coverage/coverage-final.json
```

### Seuils de Qualité
```typescript
// vitest.config.ts (à ajouter)
export default defineConfig({
  test: {
    coverage: {
      statements: 70,
      branches: 60,
      functions: 70,
      lines: 70,
    },
  },
});
```

## Debugging et Troubleshooting

### Debug des Tests
```bash
# Mode debug avec breakpoints
npm run test:debug

# Tests spécifiques
npm run test -- --run custom.button

# Mode verbose
npm run test -- --reporter=verbose

# UI mode pour debug interactif
npm run test:ui
```

### Problèmes Courants

#### 1. Erreurs d'Import ESM
```typescript
// Solution : Mock des modules problématiques
vi.mock('problematic-module', () => ({
  default: vi.fn(),
}));
```

#### 2. Erreurs DOM/JSDOM
```typescript
// Solution : Setup proper DOM environment
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
  })),
});
```

#### 3. Async/Await dans les Tests
```typescript
// Attendre les updates asynchrones
await waitFor(() => {
  expect(screen.getByText('Expected Text')).toBeInTheDocument();
});
```

## Métriques et Reporting

### Rapport de Couverture HTML
- **Location** : `coverage/index.html`
- **Génération** : `npm run test:coverage`
- **Visualisation** : Ouvrir dans le navigateur

### Métriques de Performance des Tests
- **Durée moyenne** : ~2 secondes pour 27 tests
- **Tests les plus lents** : Tests avec DOM rendering
- **Tests les plus rapides** : Tests d'utilitaires pures

### KPIs à Surveiller
- **Nombre de tests** : Actuellement 27
- **Couverture de code** : À mesurer avec seuils
- **Durée d'exécution** : Garder sous 10 secondes
- **Taux de réussite** : 100% en CI