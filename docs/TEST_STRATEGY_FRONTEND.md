# Test Strategy Frontend — C2.2.2

## Stack de Test

### Outils Configurés

- **Vitest** : Test runner (configuré mais dépendance manquante en local)
- **React Testing Library** : Tests de composants
- **@testing-library/jest-dom** : Matchers DOM additionnels
- **jsdom** : Environnement DOM pour les tests

### Configuration Vitest

```typescript
// vite.config.ts
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts'
  },
})
```

## Pyramide des Tests

### 1. Tests Unitaires (Base)
- **Fonctions utilitaires** : Validation, formatage, calculs
- **Reducers** : Logique de state management
- **Hooks personnalisés** : useAlerts, useTheme

### 2. Tests de Composants (Milieu)
- **Composants isolés** : Buttons, inputs, cards
- **Comportement UI** : Clicks, états, props
- **Rendering conditionnel** : Loading states, erreurs

### 3. Tests d'Intégration (Sommet)
- **Pages complètes** : Dashboard, Dishes, Cards
- **Flux utilisateur** : Login → Navigation → Actions
- **Intégration API** : Mocks des appels réseau

## Conventions de Nommage

### Fichiers de Test
```
component.test.tsx    # Tests de composants
utils.test.ts        # Tests de fonctions
hook.test.ts         # Tests de hooks
page.test.tsx        # Tests de pages
```

### Structure des Tests
```typescript
describe("ComponentName", () => {
  // Setup commun
  beforeEach(() => {
    // Initialisation
  });

  describe("Feature/Behavior", () => {
    test("should do something when condition", () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```

## Exemples de Tests Actuels

### Test de Composant (CustomButton)

```typescript
describe("CustomButton Component", () => {
  const mockOnClick = vi.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  test("renders with correct text", () => {
    render(
      <CustomButton
        type={TypeButton.PRIMARY}
        onClick={mockOnClick}
        width={WidthButton.MEDIUM}
        isLoading={false}
      >
        Click me
      </CustomButton>
    );
    
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  test("calls onClick when clicked", () => {
    render(
      <CustomButton
        type={TypeButton.PRIMARY}
        onClick={mockOnClick}
        width={WidthButton.MEDIUM}
        isLoading={false}
      >
        Click me
      </CustomButton>
    );
    
    fireEvent.click(screen.getByText("Click me"));
    expect(mockOnClick).toHaveBeenCalled();
  });
});
```

### Test de Context (Alerts)

```typescript
describe("AlertsContext", () => {
  test("provides alert functions", () => {
    const wrapper = ({ children }) => (
      <AlertsProvider>{children}</AlertsProvider>
    );
    
    const { result } = renderHook(() => useAlerts(), { wrapper });
    
    expect(result.current.showAlert).toBeDefined();
    expect(result.current.hideAlert).toBeDefined();
  });
});
```

## Mocking

### Composants Externes
```typescript
// Mock de Lottie pour éviter les erreurs
vi.mock("lottie-react", () => ({
  default: ({ className, style }) => (
    <div
      role="progressbar"
      className={className}
      style={style}
      data-testid="lottie-animation"
    />
  ),
}));
```

### API Calls
```typescript
// Mock des repositories
vi.mock("../network/repositories/dishes.repository", () => ({
  DishesRepositoryImpl: vi.fn().mockImplementation(() => ({
    getAll: vi.fn().mockResolvedValue([
      { id: "1", name: "Pizza", price: 12.99 }
    ])
  }))
}));
```

## Scripts NPM

```json
{
  "scripts": {
    "test": "vitest",              // Mode watch
    "test:ui": "vitest --ui",      // Interface graphique
    "test:coverage": "vitest --coverage"  // Rapport de couverture
  }
}
```

## Organisation des Tests

```
src/
├── tests/                    # Tests des composants
│   ├── custom.button.test.tsx
│   ├── welcome.test.tsx
│   ├── alert.test.tsx
│   ├── alerts.context.test.tsx
│   ├── dishes.utils.test.ts
│   └── navigation.bar.test.tsx
├── setupTests.ts            # Configuration globale
└── components/
    └── __tests__/          # Alternative : tests colocalisés
```

## Plan de Test Minimal

### Tests Critiques à Implémenter

1. **Authentication Flow**
```typescript
test("redirects to login when not authenticated", async () => {
  render(<App />);
  expect(screen.getByText(/connexion/i)).toBeInTheDocument();
});

test("shows dashboard after successful login", async () => {
  // Mock Firebase auth
  // Simulate login
  // Verify redirect
});
```

2. **Formulaire de Plat**
```typescript
test("validates dish form before submission", async () => {
  render(<DishForm />);
  
  // Submit empty form
  fireEvent.click(screen.getByText("Créer"));
  
  // Check validation messages
  expect(screen.getByText(/nom requis/i)).toBeInTheDocument();
  expect(screen.getByText(/prix requis/i)).toBeInTheDocument();
});
```

3. **Navigation**
```typescript
test("navigates between pages", async () => {
  render(<App />);
  
  fireEvent.click(screen.getByText(/plats/i));
  expect(screen.getByTestId("dishes-page")).toBeInTheDocument();
  
  fireEvent.click(screen.getByText(/cartes/i));
  expect(screen.getByTestId("cards-page")).toBeInTheDocument();
});
```

## Bonnes Pratiques

### 1. Isolation
- Tester un seul comportement par test
- Éviter les dépendances entre tests
- Nettoyer après chaque test

### 2. Lisibilité
- Noms de tests descriptifs
- Structure AAA (Arrange, Act, Assert)
- Éviter la logique dans les tests

### 3. Maintenance
- Préférer les sélecteurs accessibles (role, label)
- Éviter les sélecteurs fragiles (classes CSS)
- Utiliser data-testid si nécessaire

### 4. Performance
- Minimiser les renders inutiles
- Grouper les tests similaires
- Utiliser beforeEach pour le setup commun

## Debugging des Tests

```bash
# Mode debug avec breakpoints
npm run test -- --inspect-brk

# Un seul fichier
npm run test custom.button.test.tsx

# Un seul test
npm run test -- -t "should render correctly"
```

## TODO : Configuration Vitest

Pour faire fonctionner les tests :
1. Installer les dépendances manquantes si nécessaire
2. Vérifier que `vitest` est bien dans node_modules
3. Lancer `npm run test`

## Amélioration Future

1. **Tests E2E** avec Playwright/Cypress
2. **Visual Regression** avec Percy/Chromatic
3. **Tests de Performance** avec Lighthouse CI
4. **Mutation Testing** avec Stryker
5. **Contract Testing** pour l'API