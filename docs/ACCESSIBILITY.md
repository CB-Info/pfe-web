# Accessibilité — C2.2.3

## Bonnes Pratiques Appliquées

### 1. Sémantique HTML

#### Éléments Sémantiques Utilisés
```typescript
// Navigation sémantique
<nav role="navigation">
  <NavBar isOpen={isSidebarOpen} onClose={closeSidebar} />
</nav>

// Boutons sémantiques
<button type="button" onClick={handleClick}>
  Action
</button>

// Formulaires avec labels
<label htmlFor="dishName">Nom du plat</label>
<input id="dishName" type="text" />
```

#### Structure Hiérarchique
- **H1** : Titre principal de page
- **H2** : Sections principales
- **H3** : Sous-sections
- Navigation avec `<nav>` et listes `<ul>/<li>`

### 2. ARIA Labels et Attributes

#### ARIA Labels Implémentés
```typescript
// Bouton hamburger mobile
<button
  aria-label="Ouvrir le menu"
  onClick={toggleSidebar}
  className="md:hidden p-2 absolute top-4 left-4 z-50"
>

// Tables de données
<Table aria-label="customized table">

// Boutons d'options
<button aria-label="Options">

// Éléments interactifs
<div aria-hidden="true" /> // Pour éléments décoratifs
```

#### ARIA States et Properties
```typescript
// États d'expansion
aria-expanded={isSidebarOpen}

// Contrôles
aria-controls="sidebar-menu"

// Descriptions
aria-describedby="field-help-text"

// Rôles personnalisés
role="progressbar"  // Pour les indicateurs de chargement
```

### 3. Gestion du Focus

#### Focus Visible
```css
/* Classes Tailwind pour focus ring */
focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
focus:border-transparent
```

#### Navigation Clavier
- **Tab** : Navigation séquentielle
- **Enter/Space** : Activation des boutons
- **Escape** : Fermeture des modales/overlays

#### Ordre de Tabulation
```typescript
// Gestion du focus pour les modales
useEffect(() => {
  if (isModalOpen) {
    const firstFocusableElement = modalRef.current?.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    firstFocusableElement?.focus();
  }
}, [isModalOpen]);
```

### 4. Contraste et Visibilité

#### Couleurs Définies
```typescript
// tailwind.config.cjs - Couleurs avec contraste approprié
backgroundColor: {
  "primary-color": "#3C7FD0",    // Bleu avec bon contraste
  "bg-color": "#F8F9FA"          // Gris clair lisible
},
placeholderColor: {
  "primary-color": "#718EBF"      // Gris pour placeholders
}
```

#### Thème Sombre
```typescript
// Support du thème sombre pour réduire la fatigue oculaire
const { isDarkMode } = useTheme();
<StyledThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
```

### 5. Images et Médias

#### Textes Alternatifs
```typescript
// Images avec alt text approprié
<img src={dishImage} alt={`Photo du plat ${dishName}`} />

// Images décoratives
<img src={decoration} alt="" role="presentation" />
```

#### Animations et Mouvement
```typescript
// Respect des préférences utilisateur pour les animations
@media (prefers-reduced-motion: reduce) {
  .animated-element {
    animation: none;
    transition: none;
  }
}
```

## Tests d'Accessibilité

### Tests Manuels Effectués

#### 1. Navigation Clavier
- ✅ **Tab navigation** : Tous les éléments interactifs accessibles
- ✅ **Focus visible** : Indicateurs de focus visibles
- ✅ **Skip links** : À implémenter (amélioration future)
- ✅ **Logical order** : Ordre de tabulation logique

#### 2. Lecteurs d'Écran
- 🔄 **À tester** : Tests avec NVDA/JAWS/VoiceOver
- ✅ **ARIA labels** : Labels présents sur éléments critiques
- ✅ **Semantic HTML** : Structure sémantique correcte

#### 3. Zoom et Responsive
- ✅ **200% zoom** : Interface utilisable à 200%
- ✅ **Mobile** : Navigation tactile accessible
- ✅ **Landscape/Portrait** : Adaptation aux orientations

### Tests Automatisés

#### Outils à Intégrer
```bash
# Installation recommandée
npm install --save-dev @axe-core/react
npm install --save-dev jest-axe
```

#### Tests Axe-Core
```typescript
// Tests d'accessibilité automatisés (à implémenter)
import { axe, toHaveNoViolations } from 'jest-axe';

test('should not have accessibility violations', async () => {
  const { container } = render(<App />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## Améliorations Identifiées

### 1. Skip Links
```typescript
// À implémenter : liens de saut pour navigation rapide
<a href="#main-content" className="skip-link">
  Aller au contenu principal
</a>
```

### 2. Annonces Dynamiques
```typescript
// Zone d'annonces pour changements dynamiques
<div 
  role="status" 
  aria-live="polite" 
  aria-atomic="true"
  className="sr-only"
>
  {statusMessage}
</div>
```

### 3. Descriptions Étendues
```typescript
// Descriptions plus détaillées pour éléments complexes
<button 
  aria-label="Supprimer le plat Salade César"
  aria-describedby="delete-help"
>
  🗑️
</button>
<div id="delete-help" className="sr-only">
  Cette action est irréversible
</div>
```

## Conformité WCAG

### Niveau AA Visé

#### Principe 1 : Perceptible
- ✅ **1.1** Alternatives textuelles pour images
- 🔄 **1.2** Médias temporels (si vidéos futures)
- ✅ **1.3** Adaptable - Structure sémantique
- ✅ **1.4** Distinguable - Contraste et couleurs

#### Principe 2 : Utilisable
- ✅ **2.1** Accessible au clavier
- 🔄 **2.2** Délais suffisants (à vérifier pour timeouts)
- ✅ **2.3** Crises et réactions physiques (pas de clignotements)
- ✅ **2.4** Navigable - Structure et navigation

#### Principe 3 : Compréhensible
- ✅ **3.1** Lisible - Langue définie
- 🔄 **3.2** Prévisible (à améliorer)
- 🔄 **3.3** Assistance à la saisie (validation)

#### Principe 4 : Robuste
- ✅ **4.1** Compatible - HTML valide et ARIA

### Points à Améliorer

#### 1. Messages d'Erreur
```typescript
// Amélioration : messages d'erreur associés aux champs
<input 
  id="email"
  aria-describedby="email-error"
  aria-invalid={hasError}
/>
{hasError && (
  <div id="email-error" role="alert">
    Format d'email invalide
  </div>
)}
```

#### 2. Instructions de Formulaire
```typescript
// Amélioration : instructions claires
<fieldset>
  <legend>Informations du plat</legend>
  <div id="form-instructions">
    Tous les champs marqués * sont obligatoires
  </div>
</fieldset>
```

## Responsive et Mobile

### Tailles de Touch Targets
```css
/* Boutons tactiles suffisamment grands */
.btn-mobile {
  min-height: 44px;
  min-width: 44px;
  padding: 12px;
}
```

### Navigation Mobile Accessible
```typescript
// Hamburger menu avec ARIA
<button
  aria-expanded={isMobileMenuOpen}
  aria-controls="mobile-menu"
  aria-label="Menu de navigation"
>
  <span className="sr-only">
    {isMobileMenuOpen ? 'Fermer' : 'Ouvrir'} le menu
  </span>
  ☰
</button>
```

## Outils et Testing

### Outils de Développement
- **React DevTools** : Inspection des props ARIA
- **axe DevTools** : Extension navigateur (recommandée)
- **Lighthouse** : Audit d'accessibilité intégré
- **WAVE** : Extension d'évaluation web

### Tests Utilisateurs
- 🔄 **À planifier** : Tests avec utilisateurs en situation de handicap
- 🔄 **À planifier** : Tests avec technologies d'assistance
- 🔄 **À planifier** : Retours communauté accessibilité

## Checklist Accessibilité

### ✅ Implémenté
- [x] Structure HTML sémantique
- [x] ARIA labels sur éléments critiques
- [x] Focus visible avec Tailwind
- [x] Navigation clavier basique
- [x] Contraste couleurs approprié
- [x] Support responsive/mobile
- [x] Thème sombre disponible

### 🔄 En Cours / À Améliorer
- [ ] Skip links pour navigation rapide
- [ ] Tests axe-core automatisés
- [ ] Annonces dynamiques (aria-live)
- [ ] Messages d'erreur associés
- [ ] Tests avec lecteurs d'écran
- [ ] Documentation utilisateur
- [ ] Tests utilisateurs réels

### 📋 Planifié
- [ ] Audit complet WCAG 2.1 AA
- [ ] Formation équipe accessibilité
- [ ] Guidelines internes accessibilité
- [ ] Tests automatisés en CI
- [ ] Monitoring accessibilité continu

## Ressources et Formation

### Documentation de Référence
- **WCAG 2.1** : Guidelines officielles
- **ARIA Authoring Practices** : Patterns d'implémentation
- **MDN Accessibility** : Documentation technique
- **React Accessibility** : Bonnes pratiques React

### Outils Recommandés
- **@axe-core/react** : Tests automatisés
- **eslint-plugin-jsx-a11y** : Linting accessibilité
- **react-aria** : Composants accessibles (future migration)

## Métriques et Suivi

### KPIs Accessibilité
- **0 violations critiques** axe-core
- **100% navigation clavier** fonctionnelle
- **AA compliance** WCAG 2.1
- **< 3 secondes** pour atteindre contenu principal

### Monitoring Continu
- Tests automatisés en CI/CD
- Audits trimestriels complets
- Retours utilisateurs accessibilité
- Veille réglementaire (RGAA, Section 508)

**Note** : L'accessibilité est un processus continu d'amélioration. Les éléments listés reflètent l'état actuel et les améliorations identifiées pour respecter les standards WCAG 2.1 AA.