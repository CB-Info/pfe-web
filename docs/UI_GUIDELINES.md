### UI guidelines (réellement utilisées)

## Tailwind & DaisyUI

- Tailwind activé via `src/applications/css/index.css` avec `@tailwind base/components/utilities`.
- Tokens étendus dans `tailwind.config.cjs` (couleurs primaires, placeholders, `fontFamily` `lufga`/`inter`).
- DaisyUI activé comme plugin pour composants utilitaires.

Conventions observées:
- Classes Tailwind atomiques directement dans les JSX (p.ex. layouts, spacing, couleurs, focus).
- États focus: `focus:outline-none focus:ring` et variantes.
- `@apply` non utilisé dans le repo scanné; styles réutilisables via composants (`UI/style/*.tsx`).

## Design tokens & thèmes

- `applications/theme/theme.ts`: thèmes `lightTheme`/`darkTheme` fournis à `styled-components` et consommés par certains composants.
- Toggle dark mode: `ThemeContext` persiste la préférence dans `localStorage`.

## Composants réutilisables

- Boutons: `UI/components/buttons/*` avec tailles, états disabled/loading (spinner), tests RTL existants.
- Modals: `UI/components/modals/*` (modal classique, full‑screen, confirmation) avec animations et accessibilité basique.
- Tables: `UI/components/tables/dishes/*` avec pagination MUI personnalisée.
- Alerts: `UI/components/alert/*` rendues via `AlertsContext` en overlay (max 3 visibles, persistance optionnelle).
- Layout: `BaseContent`, `PanelContent`, `PageHeader` pour structurer pages/panneaux.

## Patterns UI

- Formulaires: validations synchrones simples (ex. login, création/édition de plat), messages via `useAlerts`, gestion `isLoading` sur submit, masquage/affichage de mot de passe.
- Empty states: messages explicites (« Aucun plat trouvé », « Aucune carte active ») avec CTA contextuels.
- Feedback: toasts/bannières via `AlertsContext`; variantes `info|warning|error|success` et `timeout` configurable.

## Accessibilité (basics)

- Labels ARIA: bouton toggler du menu mobile avec `aria-label`.
- Focus visible: classes Tailwind `focus:ring` sur actions; composants Headless UI (Switch) pour états contrôlés.
- Sémantique: usage de `nav`, `button`, `table` MUI accessible; titres et hiérarchie textuelle.

