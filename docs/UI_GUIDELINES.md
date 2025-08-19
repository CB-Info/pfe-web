# Guidelines UI — C2.2.3

## Configuration Tailwind Réelle

### Fichiers de Configuration

#### tailwind.config.cjs
```javascript
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      backgroundColor: {
        "primary-color": "#3C7FD0",
        "bg-color": "#F8F9FA"
      },
      placeholderColor: {
        "primary-color": "#718EBF"
      },
      borderColor: {
        "primary-color": "#DFEAF2"
      },
      fontFamily: {
        'lufga': ['Lufga', 'sans-serif'],
        'inter': ['Inter', 'sans-serif']
      }
    },
  },
  plugins: [require("daisyui")],
}
```

#### Structure CSS
```css
/* src/applications/css/index.css */
@import './fonts.css';
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Design Tokens

### Couleurs Personnalisées
```css
/* Couleurs définies dans tailwind.config.cjs */
bg-primary-color     /* #3C7FD0 - Bleu principal */
bg-bg-color          /* #F8F9FA - Gris de fond */
placeholder-primary-color  /* #718EBF - Gris placeholder */
border-primary-color /* #DFEAF2 - Bordures */
```

### Typographie

#### Polices Personnalisées
- **Lufga** : Police principale avec tous les poids (100-900)
- **Inter** : Police secondaire

```css
/* Usage Tailwind */
font-lufga    /* Police Lufga */
font-inter    /* Police Inter */

/* Poids disponibles pour Lufga */
font-thin      /* 100 */
font-extralight /* 200 */
font-light     /* 300 */
font-normal    /* 400 */
font-medium    /* 500 */
font-semibold  /* 600 */
font-bold      /* 700 */
font-extrabold /* 800 */
font-black     /* 900 */
```

#### Chargement des Polices
```css
/* 13 variantes Lufga chargées via @font-face */
@font-face {
  font-family: 'Lufga';
  src: url('../public/fonts/Fontspring-DEMO-lufga-regular.otf');
  font-weight: normal;
  font-style: normal;
}
/* ... + 12 autres variantes */
```

## Stack UI Hybride

### Intégration Multi-Framework
Le projet utilise une approche hybride :

1. **Tailwind CSS** : Classes utilitaires de base
2. **DaisyUI** : Composants pré-stylés
3. **Styled Components** : Composants complexes avec thème
4. **Twin.macro** : Bridge Tailwind + Styled Components
5. **Material-UI** : Composants avancés (Tables, etc.)

### Exemple d'Intégration
```typescript
// Twin.macro + Styled Components
import tw from "twin.macro";
import styled from "styled-components";

const PrimaryButton = styled.button<Props>(({ theme, $width }) => [
  tw`
    flex rounded-2xl p-1.5 font-inter text-base font-semibold
    py-3 px-10 items-center justify-center cursor-pointer
    transition-all duration-300 ease-in-out
  `,
  getSize($width), // Fonction pour tailles dynamiques
  // ... styles conditionnels
]);
```

## Composants UI Réutilisables

### 1. Système de Boutons

#### Types et Variantes
```typescript
// src/UI/components/buttons/button.types.ts
enum TypeButton {
  PRIMARY = "primary",
  SECONDARY = "secondary", 
  DANGER = "danger",
  SUCCESS = "success"
}

enum WidthButton {
  SMALL = "small",   // min-w-[60px] h-[40px]
  MEDIUM = "medium", // min-w-[150px] h-[48px]
  LARGE = "large"    // min-w-[180px] h-[60px]
}
```

#### Composant CustomButton
```typescript
interface CustomButtonProps {
  inputType?: "submit" | "reset" | "button";
  type: TypeButton;
  children: ReactNode;
  onClick: () => void;
  width: WidthButton;
  isLoading: boolean;
  isDisabled?: boolean;
  ariaLabel?: string; // Accessibilité
}
```

#### Classes Tailwind Utilisées
```css
/* Base button styles */
flex rounded-2xl p-1.5 font-inter text-base font-semibold
py-3 px-10 items-center justify-center cursor-pointer
transition-all duration-300 ease-in-out

/* Focus states */
focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2

/* Disabled states */
opacity-50 cursor-not-allowed
```

### 2. Composants de Chargement

#### Loading Component
```typescript
// Variants disponibles
type LoadingVariant = "default" | "sandy";
type LoadingSize = "small" | "medium" | "large";

// Usage avec Lottie animations
<Loading variant="sandy" size="large" text="Chargement..." />
```

### 3. Système d'Alertes

#### Types d'Alertes
```typescript
type AlertType = "success" | "error" | "warning" | "info";

// Intégration avec react-hot-toast
import toast from 'react-hot-toast';
```

### 4. Navigation

#### NavBar Responsive
```typescript
// Classes Tailwind pour responsive design
<div className="relative h-screen w-screen flex overflow-hidden">
  <NavBar isOpen={isSidebarOpen} onClose={closeSidebar} />
  
  {/* Mobile menu button */}
  <button className="md:hidden p-2 absolute top-4 left-4 z-50 rounded bg-white text-gray-800 focus:outline-none focus:ring">
    {/* Hamburger icon */}
  </button>
  
  {/* Mobile overlay */}
  {isSidebarOpen && (
    <div className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-40" />
  )}
</div>
```

## Patterns de Formulaires

### Validation UI
```typescript
// Pattern de validation côté client
const [errors, setErrors] = useState<string[]>([]);

const handleSubmit = (formData: FormData) => {
  const validationErrors = validateForm(formData);
  if (validationErrors.length > 0) {
    setErrors(validationErrors);
    return;
  }
  // Soumission...
};
```

### États de Formulaire
```typescript
// États standard des formulaires
const [isLoading, setIsLoading] = useState(false);
const [isSubmitted, setIsSubmitted] = useState(false);
const [errors, setErrors] = useState<Record<string, string>>({});
```

## Responsive Design

### Breakpoints Tailwind
```css
/* Breakpoints utilisés */
sm:   /* 640px */
md:   /* 768px - Point de bascule mobile/desktop */
lg:   /* 1024px */
xl:   /* 1280px */
2xl:  /* 1536px */
```

### Patterns Responsive
```css
/* Navigation mobile/desktop */
md:hidden    /* Caché sur desktop */
hidden md:block  /* Visible seulement sur desktop */

/* Sidebar responsive */
fixed md:relative
w-64 md:w-auto
```

## Accessibilité

### ARIA Labels
```typescript
// Exemples d'usage réel
<button aria-label="Ouvrir le menu" onClick={toggleSidebar}>
<Table aria-label="customized table">
<button aria-label="Options">
```

### Focus Management
```css
/* Classes focus utilisées */
focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
focus:border-transparent
```

### Contraste et Visibilité
- ✅ **Couleurs contrastées** : Respect des ratios WCAG
- ✅ **Focus visible** : Anneaux de focus sur tous les éléments interactifs
- 🔄 **Tests automatisés** : À implémenter

## Thèmes et Mode Sombre

### Configuration Styled Components
```typescript
// src/applications/theme/theme.ts
export const lightTheme = {
  colors: {
    primary: "#3C7FD0",
    background: "#F8F9FA",
    // ...
  }
};

export const darkTheme = {
  colors: {
    primary: "#3C7FD0", 
    background: "#1a1a1a",
    // ...
  }
};
```

### Intégration Theme Context
```typescript
const ThemedApp = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <StyledThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      {/* App content */}
    </StyledThemeProvider>
  );
};
```

## Animations

### Framer Motion
```typescript
// Animations de transition entre pages
import { motion } from "framer-motion";

<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
>
```

### Lottie Animations
```typescript
// Animations de chargement personnalisées
import Lottie from "lottie-react";
import animationData from "../assets/animations/loading.json";

<Lottie animationData={animationData} />
```

### Transitions CSS
```css
/* Classes Tailwind pour transitions */
transition-all duration-300 ease-in-out
hover:scale-105 hover:shadow-lg
```

## Conventions de Nommage

### Classes CSS
```css
/* Préfixes pour classes personnalisées */
.btn-primary     /* Boutons */
.card-container  /* Cartes */
.form-group      /* Groupes de formulaire */
.nav-item        /* Navigation */
```

### Composants
```typescript
// Nomenclature des composants
CustomButton     /* Composants réutilisables */
DishTable        /* Composants métier */
LoginPage        /* Pages */
useAuth          /* Hooks */
```

### Fichiers
```
component.name.tsx    /* Composants */
component.types.ts    /* Types */
component.test.tsx    /* Tests */
page.name.page.tsx    /* Pages */
```

## Performance UI

### Lazy Loading
```typescript
// Toutes les pages sont lazy loadées
const DashboardPage = lazy(() => import("./UI/pages/dashboard/dashboard.page"));
const DishesPage = lazy(() => import("./UI/pages/dishes/dishes.page"));
```

### Optimisations Images
- 🔄 **À implémenter** : Optimisation automatique des images
- 🔄 **À implémenter** : Lazy loading des images
- 🔄 **À implémenter** : WebP/AVIF support

### Bundle Optimization
```typescript
// Vite configuration pour optimisation
export default defineConfig({
  plugins: [
    react(), 
    macrosPlugin(), 
    visualizer({ open: true, filename: 'bundle-stats.html' })
  ],
});
```

## Guidelines de Contribution

### Ajout de Nouveaux Composants
1. **Créer dans le bon dossier** : `src/UI/components/[category]/`
2. **Suivre la nomenclature** : `component.name.tsx`
3. **Ajouter les types** : `component.types.ts` si complexe
4. **Écrire les tests** : `component.test.tsx`
5. **Documenter les props** : JSDoc sur les interfaces

### Styles
1. **Privilégier Tailwind** : Classes utilitaires en premier
2. **Styled Components** : Pour logique complexe seulement
3. **Cohérence** : Utiliser les design tokens définis
4. **Responsive** : Tester sur mobile et desktop
5. **Accessibilité** : ARIA labels et focus management

### Performance
1. **Lazy loading** : Pour les pages et gros composants
2. **Memoization** : React.memo pour composants coûteux
3. **Bundle analysis** : Vérifier l'impact sur le bundle