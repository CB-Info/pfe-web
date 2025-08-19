# UI Guidelines — C2.2.3

## Stack UI

Le projet utilise une combinaison de technologies pour le styling :
- **Tailwind CSS 3.4** : Classes utilitaires
- **DaisyUI** : Composants Tailwind pré-stylés
- **Styled Components** : Styles dynamiques
- **Twin.macro** : Intégration Tailwind dans Styled Components

## Conventions Tailwind

### Configuration Tailwind

```javascript
// tailwind.config.cjs
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
  }
}
```

### Classes Utilitaires Personnalisées

- `bg-primary-color` : Couleur primaire (#3C7FD0)
- `bg-bg-color` : Couleur de fond (#F8F9FA)
- `border-primary-color` : Bordure primaire (#DFEAF2)
- `font-lufga` / `font-inter` : Polices personnalisées

### Utilisation avec Twin.macro

```typescript
// Exemple de composant avec twin.macro
const PrimaryButton = styled.button<PrimaryButtonProps>(
  ({ theme, $width, $isDisabled, $isLoading }) => [
    tw`
      flex
      rounded-2xl
      p-1.5
      font-inter
      text-base
      font-semibold
      py-3
      px-10
    `,
    // Styles CSS additionnels
  ]
);
```

## Design Tokens

### Couleurs

| Token | Valeur | Usage |
|-------|--------|-------|
| Primary | #3C7FD0 | Actions principales, liens |
| Background | #F8F9FA | Fond général |
| Border | #DFEAF2 | Bordures subtiles |
| Placeholder | #718EBF | Texte placeholder |
| Error | rgb(235, 87, 87) | Messages d'erreur |
| Success | #10B981 | Confirmations |

### Typographie

| Police | Usage |
|--------|-------|
| Lufga | Titres et éléments d'interface |
| Inter | Texte principal, boutons |

### Espacement

Utilisation des classes Tailwind standard :
- `p-1` à `p-12` : Padding
- `m-1` à `m-12` : Margin
- `space-x-*` / `space-y-*` : Espacement entre éléments

## Composants Réutilisables

### Boutons

```typescript
// Types de boutons définis
enum TypeButton {
  PRIMARY = "primary",
  SECONDARY = "secondary",
  DANGER = "danger"
}

// Tailles de boutons
enum WidthButton {
  LARGE,   // min-w-[180px] h-[60px]
  MEDIUM,  // min-w-[150px] h-[48px]
  SMALL    // min-w-[60px] h-[40px]
}
```

### Loading States

```typescript
<Loading 
  variant="sandy"     // Style d'animation
  size="large"        // small | medium | large
  text="Chargement..." 
/>
```

### Alerts

Le système d'alertes utilise le contexte `AlertsContext` :
- Toast notifications avec `react-hot-toast`
- Types : success, error, info, warning
- Position configurable

## Patterns UI

### Formulaires

1. **Validation visuelle** : Bordures colorées pour les états
2. **Messages d'erreur** : Sous les champs concernés
3. **Loading states** : Boutons avec spinner intégré

```typescript
// Pattern de formulaire
<form>
  <Input 
    className="border-primary-color focus:border-primary-color"
    placeholder="placeholder-primary-color"
  />
  <CustomButton 
    type={TypeButton.PRIMARY}
    width={WidthButton.MEDIUM}
    isLoading={isSubmitting}
  >
    Valider
  </CustomButton>
</form>
```

### Modales

Utilisation de composants styled avec twin.macro :

```typescript
const ModalButton = styled.button<ModalButtonProps>(
  ({ theme, isErrorColors }) => [
    tw``, // Classes Tailwind
    css`
      border-radius: 4px;
      height: 32px;
      padding: 0 12px;
      // Styles conditionnels
      color: ${isErrorColors ? "rgb(235, 87, 87)" : theme.blackColor};
    `
  ]
);
```

### Tables

- Headers sticky pour le scroll
- Alternance de couleurs de lignes
- Actions en fin de ligne
- Empty states explicites

## Accessibilité de Base

### Focus Management

```css
/* Focus rings Tailwind */
.focus:outline-none
.focus:ring
.focus:ring-primary-color
.focus:ring-opacity-50
```

### ARIA Labels

```typescript
<button
  aria-label="Ouvrir le menu"
  onClick={toggleSidebar}
>
  {/* Icône */}
</button>
```

### Contraste

- Texte principal : Ratio minimum 4.5:1
- Texte large : Ratio minimum 3:1
- Utilisation des couleurs définies respectant les normes

## Responsive Design

### Breakpoints Tailwind

- `sm:` 640px
- `md:` 768px
- `lg:` 1024px
- `xl:` 1280px
- `2xl:` 1536px

### Patterns Responsive

```typescript
// Navigation responsive
<NavBar className="hidden md:flex" />
<button className="md:hidden" onClick={toggleMobile}>
  Menu
</button>
```

## Dark Mode

Gestion via `ThemeContext` et `styled-components` :

```typescript
const theme = isDarkMode ? darkTheme : lightTheme;

// Dans les composants
background-color: ${props => props.theme.backgroundColor};
color: ${props => props.theme.textColor};
```

## Animations

### Framer Motion

Pour les animations complexes :
```typescript
import { motion } from "framer-motion";

<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3 }}
>
  Contenu
</motion.div>
```

### Transitions CSS

```css
transition: all 0.2s ease-in-out;
transition: background 20ms ease-in 0s;
```

## Bonnes Pratiques

1. **Préférer Tailwind** aux styles inline
2. **Composants styled** pour logique complexe
3. **Twin.macro** pour combiner Tailwind + CSS-in-JS
4. **Tokens de design** pour la cohérence
5. **Mobile-first** avec les breakpoints Tailwind
6. **Accessibilité** dès la conception
7. **Performance** : éviter les re-renders inutiles
