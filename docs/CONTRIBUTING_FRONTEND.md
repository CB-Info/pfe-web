# Contributing Frontend — C2.2.3

## Conventions de Code

### Naming Conventions

#### Composants React
```typescript
// PascalCase pour les composants
export const CustomButton = () => { }
export const DishCard = () => { }

// Fichiers : kebab-case
custom.button.tsx
dish.card.tsx
navigation.bar.tsx
```

#### Hooks
```typescript
// camelCase avec préfixe "use"
export const useAlerts = () => { }
export const useTheme = () => { }
export const useAuth = () => { }
```

#### Types et Interfaces
```typescript
// PascalCase pour types/interfaces
interface DishProps { }
type ButtonType = 'primary' | 'secondary';

// Suffix "Props" pour les props de composants
interface CustomButtonProps { }

// Suffix "State" pour les états
interface AlertsState { }
```

#### Variables et Fonctions
```typescript
// camelCase
const handleClick = () => { }
const isLoading = true;
const dishName = "Pizza";

// Constantes en UPPER_SNAKE_CASE
const MAX_RETRIES = 3;
const API_TIMEOUT = 5000;
```

### Structure des Fichiers

#### Composant Type
```typescript
// 1. Imports externes
import { FC, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// 2. Imports internes
import { useAlerts } from '@/hooks/useAlerts';
import { Button } from '@/components/ui/Button';

// 3. Types/Interfaces
interface ComponentProps {
  title: string;
  onSubmit: (data: FormData) => void;
}

// 4. Composant principal
export const Component: FC<ComponentProps> = ({ title, onSubmit }) => {
  // 5. Hooks
  const [state, setState] = useState(false);
  const { showAlert } = useAlerts();
  
  // 6. Handlers
  const handleSubmit = useCallback(() => {
    // Logic
  }, []);
  
  // 7. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};

// 8. Export default si nécessaire
export default Component;
```

### CSS et Tailwind

#### Classes Tailwind
```typescript
// Ordre recommandé : Layout → Spacing → Typography → Colors → Effects
<div className="flex items-center justify-between p-4 text-lg font-semibold text-gray-800 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
```

#### Styled Components avec Twin.macro
```typescript
const StyledButton = styled.button<{ $variant: string }>(
  ({ theme, $variant }) => [
    // Base styles avec tw
    tw`px-4 py-2 rounded font-medium`,
    
    // Conditional styles
    $variant === 'primary' && tw`bg-blue-500 text-white`,
    
    // CSS custom
    css`
      transition: all 0.2s ease;
      &:hover {
        transform: translateY(-1px);
      }
    `
  ]
);
```

### Organisation des Dossiers

```
src/UI/components/
├── buttons/           # Composants boutons
│   ├── custom.button.tsx
│   ├── button.types.ts
│   └── __tests__/
├── forms/            # Composants formulaires
│   ├── input/
│   ├── select/
│   └── validation/
└── common/           # Composants partagés
    ├── loading.component.tsx
    └── error.boundary.tsx
```

## Pull Request Guidelines

### Template PR

```markdown
## Description
[Description claire des changements]

## Type de changement
- [ ] Bug fix
- [ ] Nouvelle fonctionnalité
- [ ] Breaking change
- [ ] Documentation

## Checklist
- [ ] J'ai testé mes changements localement
- [ ] J'ai ajouté des tests si nécessaire
- [ ] J'ai mis à jour la documentation
- [ ] Mon code suit les conventions du projet
- [ ] J'ai vérifié l'accessibilité
- [ ] J'ai ajouté des screenshots (pour UI)

## Screenshots
[Si changements UI]

## Tests
- [ ] Tests unitaires passent
- [ ] Pas de warning ESLint
- [ ] Build réussit

## Notes
[Informations supplémentaires]
```

### Screenshots Obligatoires

Pour tout changement UI :
1. **Desktop** : 1920x1080
2. **Tablet** : 768x1024
3. **Mobile** : 375x667

### Review Checklist

#### Code Quality
- [ ] Naming conventions respectées
- [ ] Pas de code commenté
- [ ] Pas de `console.log`
- [ ] Types TypeScript corrects

#### UI/UX
- [ ] Responsive design
- [ ] États loading/error gérés
- [ ] Animations fluides
- [ ] Accessibilité vérifiée

#### Performance
- [ ] Pas de re-renders inutiles
- [ ] Images optimisées
- [ ] Bundle size acceptable

## Format de Commit

### Convention
Suivre [Conventional Commits](https://www.conventionalcommits.org/)

```
type(scope): description

[optional body]

[optional footer]
```

### Types
- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `docs`: Documentation
- `style`: Formatage (pas de changement de code)
- `refactor`: Refactoring
- `perf`: Amélioration performance
- `test`: Ajout/modification tests
- `chore`: Maintenance
- `ci`: Configuration CI/CD

### Exemples
```bash
feat(dishes): add dish creation form
fix(auth): handle token expiration correctly
docs(readme): update installation instructions
style(button): improve hover states
refactor(api): extract repository pattern
perf(images): implement lazy loading
test(navigation): add unit tests for navbar
chore(deps): update dependencies
```

### Scope
- `auth`: Authentification
- `dishes`: Gestion des plats
- `cards`: Gestion des cartes
- `ui`: Composants UI
- `api`: Couche API
- `routing`: Navigation
- `state`: State management

## Tests

### Conventions de Test

```typescript
// Nom du fichier : component.test.tsx
describe('ComponentName', () => {
  // Setup
  beforeEach(() => {
    // Configuration
  });

  describe('when condition', () => {
    it('should behavior', () => {
      // Arrange
      const props = { /* ... */ };
      
      // Act
      render(<Component {...props} />);
      
      // Assert
      expect(screen.getByText('...')).toBeInTheDocument();
    });
  });
});
```

### Coverage Minimum
- Nouveaux composants : 80%
- Hooks critiques : 90%
- Utilitaires : 100%

## Documentation

### JSDoc pour Fonctions Complexes
```typescript
/**
 * Calcule le prix total d'un plat avec options
 * @param basePrice - Prix de base du plat
 * @param options - Liste des options sélectionnées
 * @returns Prix total incluant les options
 */
export const calculateTotalPrice = (
  basePrice: number,
  options: DishOption[]
): number => {
  // Implementation
};
```

### README pour Nouveaux Modules
Chaque nouveau module doit avoir un README :
```markdown
# Module Name

## Description
[Objectif du module]

## Usage
[Comment utiliser]

## API
[Props/Methods disponibles]

## Examples
[Exemples de code]
```

## Sécurité

### Checklist Sécurité
- [ ] Pas de secrets dans le code
- [ ] Validation des entrées utilisateur
- [ ] Échappement des données affichées
- [ ] Pas de `dangerouslySetInnerHTML`
- [ ] API keys dans variables d'env

### Dépendances
```bash
# Vérifier les vulnérabilités
npm audit

# Mettre à jour si nécessaire
npm audit fix
```

## Performance

### Avant de Merger
- [ ] Lazy loading pour routes
- [ ] Images optimisées
- [ ] Pas de re-renders excessifs
- [ ] Bundle size vérifié

## Process de Développement

### 1. Créer une Branche
```bash
git checkout -b feat/dish-creation
```

### 2. Développer
- Suivre les conventions
- Tester localement
- Ajouter tests si nécessaire

### 3. Commit
```bash
git add .
git commit -m "feat(dishes): add creation form"
```

### 4. Push et PR
```bash
git push origin feat/dish-creation
# Créer PR sur GitHub
```

### 5. Review
- Attendre 1+ approbation
- Résoudre les commentaires
- CI doit être vert

### 6. Merge
- Squash and merge préféré
- Supprimer la branche

## Ressources

### Style Guides
- [TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)
- [React Best Practices](https://react.dev/learn/thinking-in-react)
- [Tailwind Best Practices](https://tailwindcss.com/docs/editor-setup)

### Outils
- ESLint + Prettier configurés
- TypeScript strict mode
- Husky pour pre-commit (à configurer)

## Contact

Pour questions sur les conventions :
- Tech Lead Frontend
- Canal Slack #frontend
- Documentation wiki interne
