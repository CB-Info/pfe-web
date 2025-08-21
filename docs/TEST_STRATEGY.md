# Test Strategy Frontend — C2.2.2

## Stack de Test

### Outils Configurés

- **Vitest** : Test runner ✅ (configuré et fonctionnel)
- **React Testing Library** : Tests de composants ✅
- **@testing-library/jest-dom** : Matchers DOM additionnels ✅
- **jsdom** : Environnement DOM pour les tests ✅
- **Playwright** : Tests E2E ✅ (nouvellement ajouté)

### Configuration Vitest

```typescript
// vite.config.ts
export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
    exclude: ["**/e2e/**", "**/node_modules/**", "**/dist/**"],
    env: {
      MODE: "test",
    },
  },
});
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

### 3. Tests d'Intégration (Milieu)

- **Contextes + Hooks** : ThemeProvider + useTheme ✅
- **Composants multi-dépendances** : Intégrations simples ✅
- **Flux de données** : Context → Hook → Component

### 4. Tests E2E (Sommet)

- **Parcours utilisateur complets** : Navigation, formulaires ✅
- **Tests cross-browser** : Chromium, Firefox, Safari ✅
- **Tests responsive** : Desktop, mobile ✅
- **Playwright configuré** : 16 tests fonctionnels ✅

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
    getAll: vi
      .fn()
      .mockResolvedValue([{ id: "1", name: "Pizza", price: 12.99 }]),
  })),
}));
```

## Scripts NPM

```json
{
  "scripts": {
    "test": "vitest", // Mode watch
    "test:ui": "vitest --ui", // Interface graphique
    "test:coverage": "vitest --coverage" // Rapport de couverture
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

## Améliorations Implémentées

1. **Tests E2E** ✅ avec Playwright (configuré et fonctionnel)
   - Configuration multi-navigateurs (Chrome, Firefox, Safari)
   - Tests responsive (mobile, tablet, desktop)
   - Tests d'accessibilité intégrés

## Tests E2E avec Playwright

### Configuration Actuelle

```typescript
// playwright.config.ts
export default defineConfig({
  testDir: "./src/tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",

  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
    { name: "Mobile Chrome", use: { ...devices["Pixel 5"] } },
    { name: "Mobile Safari", use: { ...devices["iPhone 12"] } },
  ],

  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
```

### Scripts NPM E2E

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:all": "npm run test && npm run test:e2e"
  }
}
```

### Tests E2E Implémentés

#### 1. Structure d'Application (`app-structure.spec.ts`)

- **5 tests** : Structure HTML, CSS, responsive, erreurs, rechargement
- **Couverture** : Métadonnées, styles, mobile, error boundaries

#### 2. Interactions de Base (`basic-interactions.spec.ts`)

- **5 tests** : Formulaires, saisie, clavier, responsive
- **Couverture** : UX de base, accessibilité, mobile

#### 3. Interface de Connexion (`login-ui.spec.ts`)

- **3 tests** : Formulaire, validation email, structure
- **Couverture** : Login UI, validation, placeholders

#### 4. Navigation (`navigation.spec.ts`)

- **3 tests** : Page de connexion, métadonnées, chargement
- **Couverture** : Routing, SEO, performance

**Total E2E** : **4 fichiers, 16 tests** ✅

### Commandes E2E

```bash
# Lancer tous les tests E2E
npm run test:e2e

# Interface graphique Playwright
npm run test:e2e:ui

# Tests complets (unitaires + E2E)
npm run test:all

# Tests E2E avec debug
npx playwright test --debug

# Tests E2E sur un navigateur spécifique
npx playwright test --project=chromium

# Générer le rapport HTML
npx playwright show-report
```

### Fonctionnalités Avancées

- **Screenshots automatiques** en cas d'échec
- **Vidéos** des tests qui échouent
- **Traces** pour le debugging avancé
- **Serveur local** démarré automatiquement
- **Retry automatique** en CI/CD
- **Tests parallèles** pour la performance

### Intégration CI/CD

```yaml
# .github/workflows/ci.yml
- name: Run E2E Tests
  run: npm run test:e2e

- name: Upload Playwright results
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report/
```

## Amélioration Future

1. **Visual Regression** avec Percy/Chromatic
2. **Tests de Performance** avec Lighthouse CI
3. **Mutation Testing** avec Stryker
4. **Contract Testing** pour l'API
5. **Tests d'intégration** avec MSW (Mock Service Worker)
