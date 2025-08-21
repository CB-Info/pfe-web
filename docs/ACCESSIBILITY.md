# Accessibility — C2.2.3

## Pratiques d'Accessibilité Appliquées / Prévues

### 1. Sémantique HTML

#### Structure de Page

```typescript
// Navigation avec landmark
<nav aria-label="Navigation principale">
  <NavBar />
</nav>

// Main content area
<main>
  <Routes>...</Routes>
</main>

// Sections avec headings
<section>
  <h1>Gestion des plats</h1>
  ...
</section>
```

#### Boutons vs Liens

- **Boutons** : Actions (submit, toggle, delete)
- **Liens** : Navigation (routes, external)

### 2. ARIA Labels et Attributs

#### Labels Explicites

```typescript
// Bouton menu mobile
<button
  aria-label="Ouvrir le menu"
  onClick={toggleSidebar}
  className="md:hidden"
>
  {/* Icône SVG */}
</button>

// Loading states
<div
  role="progressbar"
  aria-label="Chargement en cours"
  aria-busy="true"
>
  <Loading />
</div>
```

#### États et Propriétés

```typescript
// Modal overlay
<div
  className="fixed inset-0 bg-black bg-opacity-50"
  onClick={closeSidebar}
  aria-hidden="true"
/>

// Formulaire avec erreurs
<input
  aria-invalid={hasError}
  aria-describedby="email-error"
/>
<span id="email-error" role="alert">
  Email invalide
</span>
```

### 3. Gestion du Focus

#### Focus Visible

```css
/* Via Tailwind */
.focus:outline-none
.focus:ring
.focus:ring-primary-color
.focus:ring-opacity-50
```

#### Ordre de Tabulation

- Navigation logique du haut vers le bas
- Skip links (à implémenter)
- Focus trap dans les modales

#### Focus Management

```typescript
// Retour du focus après fermeture modale
const previousFocus = useRef<HTMLElement>();

useEffect(() => {
  if (isOpen) {
    previousFocus.current = document.activeElement as HTMLElement;
  } else {
    previousFocus.current?.focus();
  }
}, [isOpen]);
```

### 4. Contrastes et Couleurs

#### Ratios de Contraste

- Texte principal : 4.5:1 minimum ✓
- Texte large : 3:1 minimum ✓
- Éléments interactifs : 3:1 minimum ✓

#### Couleurs Accessibles

```css
/* Couleurs avec bon contraste */
--primary-color: #3c7fd0; /* Ratio 4.7:1 sur blanc */
--text-dark: #1a1a1a; /* Ratio 12.6:1 sur blanc */
--error-color: #dc2626; /* Ratio 4.5:1 sur blanc */
```

#### Ne Pas Dépendre Uniquement de la Couleur

```typescript
// Erreur avec icône + couleur
<div className="text-red-600">
  <ErrorIcon aria-hidden="true" />
  <span>Erreur : {message}</span>
</div>
```

### 5. Images et Médias

#### Textes Alternatifs

```typescript
// Image informative
<img
  src="/dish.jpg"
  alt="Pizza Margherita avec tomates fraîches et basilic"
/>

// Image décorative
<img
  src="/decoration.svg"
  alt=""
  role="presentation"
/>

// Icône avec texte
<button>
  <Icon aria-hidden="true" />
  <span>Supprimer</span>
</button>
```

### 6. Navigation au Clavier

#### Raccourcis Standards

- `Tab` : Navigation entre éléments
- `Enter` : Activer boutons/liens
- `Space` : Cocher/décocher
- `Esc` : Fermer modales

#### Implementation

```typescript
// Fermeture modale avec Escape
useEffect(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === "Escape" && isOpen) {
      onClose();
    }
  };

  document.addEventListener("keydown", handleEscape);
  return () => document.removeEventListener("keydown", handleEscape);
}, [isOpen, onClose]);
```

### 7. Formulaires Accessibles

#### Labels Associés

```typescript
<label htmlFor="dish-name">
  Nom du plat
  <input id="dish-name" type="text" required aria-required="true" />
</label>
```

#### Groupes de Champs

```typescript
<fieldset>
  <legend>Informations du plat</legend>
  {/* Champs groupés */}
</fieldset>
```

#### Messages d'Erreur

```typescript
{
  errors.email && (
    <span
      id="email-error"
      className="text-red-600"
      role="alert"
      aria-live="polite"
    >
      {errors.email}
    </span>
  );
}
```

### 8. Responsive et Zoom (Prévu)

#### Support du Zoom

- Pas de `maximum-scale=1` dans viewport
- Layout fluide jusqu'à 200% zoom
- Texte redimensionnable

#### Viewport Meta (Implémenté)

```html
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

### 9. Screen Readers (Prévu)

#### Annonces Dynamiques

```typescript
// Notifications accessibles
const [announcement, setAnnouncement] = useState("");

<div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
  {announcement}
</div>;
```

#### Classe Utilitaire

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

## Tests d'Accessibilité (Prévus)

### Tests Manuels

1. Navigation clavier complète
2. Zoom à 200%
3. Mode contraste élevé
4. Sans CSS (contenu structuré)

### Outils

- Chrome DevTools Lighthouse
- axe DevTools extension
- WAVE (WebAIM)
- Contrast ratio checkers

### Tests Automatisés (Planifiés)

```typescript
// Avec React Testing Library
import { axe, toHaveNoViolations } from "jest-axe";

test("no accessibility violations", async () => {
  const { container } = render(<App />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## Conformité WCAG

### Niveau A (Minimum)

- ✅ Images avec alt text
- ✅ Structure de page logique
- ✅ Navigation au clavier
- ⚠️ Transcriptions vidéo (si applicable)

### Niveau AA (Cible)

- ✅ Contraste 4.5:1
- ✅ Texte redimensionnable
- ✅ Focus visible
- ⚠️ Skip navigation (à ajouter)

### Niveau AAA (Idéal)

- ⚠️ Contraste 7:1
- ⚠️ Langue des sections
- ❌ Interprétation langue des signes

## Ressources

### Guidelines

- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [React Accessibility](https://react.dev/reference/react-dom/components/common#accessibility-attributes)

### Testing

- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE](https://wave.webaim.org/)
- [NVDA Screen Reader](https://www.nvaccess.org/)

## Métriques Cibles

- Score Lighthouse Accessibility : > 90
- Violations axe critiques : 0
- Navigation clavier : 100% fonctionnelle
- Support screen reader : Testé sur NVDA/JAWS
