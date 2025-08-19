# Guide de Contribution Frontend — C2.2.3

## Conventions de Développement

### 1. Structure des Fichiers

#### Nomenclature des Fichiers
```
src/
├── UI/
│   ├── components/
│   │   └── category/
│   │       ├── component.name.tsx        # Composant principal
│   │       ├── component.types.ts        # Types TypeScript
│   │       └── component.test.tsx        # Tests unitaires
│   └── pages/
│       └── page.name.page.tsx           # Pages avec suffixe .page
├── hooks/
│   └── useHookName.ts                   # Hooks avec préfixe use
├── contexts/
│   ├── context.name.context.tsx         # Contexts React
│   └── context.types.ts                 # Types des contexts
└── network/
    └── repositories/
        └── entity.repository.ts         # Repositories API
```

#### Organisation des Composants
```typescript
// Structure recommandée pour un composant
src/UI/components/buttons/
├── custom.button.tsx          # Composant principal
├── button.types.ts            # Types et interfaces
├── cell.button.tsx            # Variante spécialisée
└── __tests__/                 # Dossier de tests (optionnel)
    └── custom.button.test.tsx
```

### 2. Conventions de Nommage

#### Composants React
```typescript
// ✅ PascalCase pour composants
const CustomButton = ({ type, children }: CustomButtonProps) => {
  return <button className={getButtonClass(type)}>{children}</button>;
};

// ✅ Interfaces avec Props suffix
interface CustomButtonProps {
  type: TypeButton;
  children: ReactNode;
  onClick: () => void;
}

// ✅ Enums en PascalCase
enum TypeButton {
  PRIMARY = "primary",
  SECONDARY = "secondary"
}
```

#### Hooks et Fonctions
```typescript
// ✅ camelCase pour hooks avec préfixe use
export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};

// ✅ camelCase pour fonctions utilitaires
const calculateDishTotal = (dish: Dish): number => {
  return dish.ingredients.reduce((sum, ing) => sum + ing.price, 0);
};
```

#### Fichiers et Dossiers
```
✅ kebab-case pour fichiers
custom-button.tsx
dish-card.component.tsx

✅ camelCase pour dossiers
src/dishSelection/
src/customerView/

✅ PascalCase pour composants
CustomButton.tsx
DishCard.tsx
```

### 3. Conventions CSS et Styling

#### Tailwind CSS
```typescript
// ✅ Classes Tailwind groupées logiquement
<button className={`
  flex items-center justify-center cursor-pointer
  rounded-2xl px-10 py-3
  font-inter text-base font-semibold
  transition-all duration-300 ease-in-out
  ${getButtonVariantClasses(type)}
  ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
`}>
  {children}
</button>

// ✅ Extraction des classes complexes
const getButtonVariantClasses = (type: TypeButton) => {
  const variants = {
    primary: 'bg-primary-color text-white hover:bg-blue-600',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
  };
  return variants[type];
};
```

#### Styled Components
```typescript
// ✅ Utilisation avec Twin.macro
import tw from "twin.macro";
import styled from "styled-components";

const PrimaryButton = styled.button<{ $isDisabled: boolean }>(
  ({ theme, $isDisabled }) => [
    tw`flex rounded-2xl p-1.5 font-inter text-base font-semibold`,
    $isDisabled && tw`opacity-50 cursor-not-allowed`,
    // Styles conditionnels avec thème
  ]
);
```

### 4. TypeScript Guidelines

#### Types et Interfaces
```typescript
// ✅ Interfaces pour props de composants
interface ComponentProps {
  title: string;
  isVisible?: boolean;  // Optionnel avec ?
  onAction: (id: string) => void;  // Fonctions typées
}

// ✅ Types pour les unions
type AlertType = 'success' | 'error' | 'warning' | 'info';

// ✅ Enums pour constantes
enum DishCategory {
  STARTERS = "STARTERS",
  MAIN_DISHES = "MAIN_DISHES"
}
```

#### Typage Strict
```typescript
// ✅ Éviter any, utiliser des types spécifiques
const handleApiResponse = (data: DishDto[]): Dish[] => {
  return data.map(dto => Dish.fromDto(dto));
};

// ✅ Assertions de type seulement si nécessaire
const element = document.getElementById('root') as HTMLElement;

// ✅ Types génériques pour réutilisabilité
interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}
```

## Processus de Développement

### 1. Workflow Git

#### Branches
```bash
# Structure des branches
main                    # Production stable
develop                # Intégration continue
feature/TASK-123-nom   # Nouvelles fonctionnalités
bugfix/TASK-456-nom    # Corrections de bugs
hotfix/critical-issue  # Corrections critiques
```

#### Commits Conventionnels
```bash
# Format : type(scope): description
feat(auth): add login form validation
fix(dishes): resolve price calculation error
docs(readme): update installation instructions
style(button): improve hover effects
refactor(api): extract common http client
test(auth): add unit tests for login flow

# Types principaux
feat:     # Nouvelle fonctionnalité
fix:      # Correction de bug
docs:     # Documentation
style:    # Formatting, CSS
refactor: # Refactoring sans changement fonctionnel
test:     # Ajout ou modification de tests
chore:    # Maintenance, configuration
```

### 2. Pull Request Process

#### Template PR
```markdown
## Description
Brève description des changements

## Type de changement
- [ ] Bug fix (non-breaking change)
- [ ] Nouvelle fonctionnalité (non-breaking change)
- [ ] Breaking change (fix ou feature qui casse l'existant)
- [ ] Documentation

## Checklist
- [ ] Code respecte les conventions du projet
- [ ] Tests ajoutés/modifiés et passants
- [ ] Documentation mise à jour si nécessaire
- [ ] Pas de console.log oubliés
- [ ] TypeScript compile sans erreur
- [ ] ESLint passe sans erreur critique

## Screenshots (si applicable)
[Ajouter captures d'écran pour les changements UI]

## Tests effectués
- [ ] Tests unitaires
- [ ] Tests d'intégration
- [ ] Tests manuels sur desktop
- [ ] Tests manuels sur mobile
```

#### Review Checklist
```markdown
### Code Quality
- [ ] Code lisible et bien commenté
- [ ] Respect des conventions de nommage
- [ ] Pas de duplication de code
- [ ] Gestion d'erreurs appropriée

### Performance
- [ ] Pas de re-renders inutiles
- [ ] Optimisations React appliquées
- [ ] Lazy loading utilisé si approprié

### Sécurité
- [ ] Pas de données sensibles exposées
- [ ] Validation des inputs
- [ ] Échappement XSS approprié

### Accessibilité
- [ ] ARIA labels présents
- [ ] Navigation clavier fonctionnelle
- [ ] Contraste couleurs approprié

### Tests
- [ ] Tests unitaires couvrent les cas critiques
- [ ] Tests d'intégration si nécessaire
- [ ] Pas de tests qui échouent
```

### 3. Standards de Code

#### ESLint Configuration
```json
// .eslintrc.cjs - Règles actuelles
{
  "extends": [
    "eslint:recommended",
    "@typescript-eslint/recommended",
    "plugin:react-hooks/recommended"
  ],
  "rules": {
    "react-refresh/only-export-components": ["warn", { 
      "allowConstantExport": true 
    }]
  }
}
```

#### Règles Supplémentaires Recommandées
```json
// Ajouts suggérés pour améliorer la qualité
{
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "react/prop-types": "off",  // TypeScript handle this
    "prefer-const": "error",
    "no-console": "warn"
  }
}
```

### 4. Tests Guidelines

#### Structure des Tests
```typescript
// Pattern de test recommandé
describe('ComponentName', () => {
  // Setup commun
  const defaultProps = {
    prop1: 'value1',
    prop2: false,
    onAction: vi.fn()
  };

  const renderComponent = (props = {}) => {
    return render(
      <ComponentName {...defaultProps} {...props} />
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    test('should render with default props', () => {
      renderComponent();
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    test('should call onAction when clicked', () => {
      const mockAction = vi.fn();
      renderComponent({ onAction: mockAction });
      
      fireEvent.click(screen.getByRole('button'));
      expect(mockAction).toHaveBeenCalledTimes(1);
    });
  });
});
```

#### Mocking Guidelines
```typescript
// ✅ Mock des dépendances externes
vi.mock('lottie-react', () => ({
  default: ({ animationData }: any) => (
    <div data-testid="lottie-animation" />
  )
}));

// ✅ Mock des modules internes si nécessaire
vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: '1', name: 'Test User' },
    isLoading: false
  })
}));
```

## Setup de Développement

### 1. Environnement Local

#### Prérequis
```bash
# Node.js version
node --version  # >= 18.0.0

# npm version  
npm --version   # >= 8.0.0

# Git configuration
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

#### Installation
```bash
# Clone du projet
git clone <repository-url>
cd project-frontend

# Installation des dépendances
npm install

# Configuration environnement
cp .env.example .env  # Et remplir les variables

# Validation de l'environnement
npm run validate-env

# Démarrage en développement
npm run dev
```

### 2. Outils Recommandés

#### VSCode Extensions
```json
// .vscode/extensions.json (à créer)
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-jest"
  ]
}
```

#### Configuration VSCode
```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "tailwindCSS.includeLanguages": {
    "typescript": "javascript",
    "typescriptreact": "javascript"
  }
}
```

### 3. Scripts de Développement

#### Scripts Utiles
```json
{
  "scripts": {
    // Développement
    "dev": "npm run validate-env && vite",
    "dev:secure": "npm run validate-env && npm run dev",
    
    // Build et preview
    "build": "tsc && vite build",
    "preview": "vite preview",
    
    // Tests
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    
    // Qualité
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 15",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "type-check": "tsc --noEmit",
    
    // Validation complète
    "ci:check": "npm run lint && npm run test && npm run build"
  }
}
```

## Debugging et Troubleshooting

### 1. Debug en Développement

#### React DevTools
```typescript
// Utilisation du Profiler pour performance
import { Profiler } from 'react';

const onRenderCallback = (id, phase, actualDuration) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Render:', { id, phase, actualDuration });
  }
};

<Profiler id="ExpensiveComponent" onRender={onRenderCallback}>
  <ExpensiveComponent />
</Profiler>
```

#### Debug des Hooks
```typescript
// Debug custom hooks
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (process.env.NODE_ENV === 'development') {
    console.log('Auth state:', context);
  }
  
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  
  return context;
};
```

### 2. Problèmes Courants

#### Erreurs TypeScript
```bash
# Erreur : Cannot find module
# Solution : Vérifier les imports et types

# Erreur : Type 'X' is not assignable to type 'Y'
# Solution : Vérifier les interfaces et types
```

#### Erreurs de Build
```bash
# Erreur : Build failed
npm run lint        # Vérifier ESLint
npm run type-check  # Vérifier TypeScript
npm run test        # Vérifier tests
```

#### Performance Issues
```typescript
// Identifier les re-renders inutiles
import { useWhyDidYouUpdate } from '@szhsin/why-did-you-render';

const Component = (props) => {
  useWhyDidYouUpdate('Component', props);
  return <div>...</div>;
};
```

## Documentation du Code

### 1. Commentaires JSDoc

#### Composants
```typescript
/**
 * Bouton personnalisé avec différents styles et états
 * 
 * @param type - Type de bouton (primary, secondary, danger, success)
 * @param width - Taille du bouton (small, medium, large)
 * @param isLoading - Affiche un indicateur de chargement
 * @param isDisabled - Désactive le bouton
 * @param children - Contenu du bouton
 * @param onClick - Fonction appelée au clic
 * 
 * @example
 * ```tsx
 * <CustomButton 
 *   type={TypeButton.PRIMARY} 
 *   width={WidthButton.MEDIUM}
 *   onClick={() => console.log('clicked')}
 * >
 *   Cliquez ici
 * </CustomButton>
 * ```
 */
export const CustomButton = ({ type, width, isLoading, children, onClick }: CustomButtonProps) => {
  // Implementation...
};
```

#### Fonctions Complexes
```typescript
/**
 * Calcule le total d'un plat en incluant tous les ingrédients
 * 
 * @param dish - Le plat à calculer
 * @returns Le prix total du plat en euros
 * 
 * @throws {Error} Si le plat n'a pas d'ingrédients
 */
const calculateDishTotal = (dish: Dish): number => {
  if (!dish.ingredients?.length) {
    throw new Error('Le plat doit avoir au moins un ingrédient');
  }
  
  return dish.ingredients.reduce((total, ingredient) => {
    return total + (ingredient.quantity * ingredient.unitPrice);
  }, dish.basePrice || 0);
};
```

### 2. README des Composants

#### Documentation Composant
```markdown
# CustomButton

Composant de bouton réutilisable avec support de différents styles et états.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| type | TypeButton | - | Style du bouton |
| width | WidthButton | MEDIUM | Taille du bouton |
| isLoading | boolean | false | Affiche le loading |
| isDisabled | boolean | false | Désactive le bouton |
| onClick | () => void | - | Handler de clic |

## Exemples

```tsx
// Bouton primaire
<CustomButton type={TypeButton.PRIMARY} onClick={handleSave}>
  Sauvegarder
</CustomButton>

// Bouton avec loading
<CustomButton type={TypeButton.SECONDARY} isLoading={true}>
  Chargement...
</CustomButton>
```
```

## Maintenance et Evolution

### 1. Refactoring Guidelines

#### Quand Refactorer
- Code dupliqué > 3 fois
- Composant > 200 lignes
- Fonction > 50 lignes
- Complexité cyclomatique élevée

#### Comment Refactorer
```typescript
// ❌ Avant : Composant trop gros
const BigComponent = () => {
  // 300 lignes de code...
};

// ✅ Après : Décomposition
const BigComponent = () => {
  return (
    <>
      <Header />
      <MainContent />
      <Footer />
    </>
  );
};

const Header = () => { /* ... */ };
const MainContent = () => { /* ... */ };
const Footer = () => { /* ... */ };
```

### 2. Migration Guidelines

#### Mise à Jour des Dépendances
```bash
# Vérifier les updates disponibles
npm outdated

# Mise à jour mineure/patch
npm update

# Mise à jour majeure (avec précaution)
npm install package@latest
```

#### Breaking Changes
- Documenter les changements cassants
- Fournir un guide de migration
- Maintenir la rétrocompatibilité si possible
- Tests de régression complets

Cette documentation de contribution assure la cohérence et la qualité du code frontend tout en facilitant l'onboarding des nouveaux développeurs.