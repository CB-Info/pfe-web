### Accessibilité (pratiques en place)

- Sémantique: usage de `nav`, `button`, `table` (MUI), titres structurés.
- Focus visible: classes Tailwind `focus:ring` sur boutons et contrôles.
- ARIA: labels explicites (ex. bouton menu mobile `aria-label="Ouvrir le menu"`).
- Composants: Headless UI `Switch` pour états accessibles.
- Contrastes: palettes Tailwind/DaisyUI; vérifier au besoin avec Lighthouse.
- Images/animations: composant `Loading` via Lottie sans texte bloquant; ajouter `aria-live` si nécessaire pour loaders critiques (amélioration future).

Écarts/todos:
- Ajouter une page 404 accessible.
- Vérifier navigation clavier sur modals (focus trap si besoin).
- Tester contrastes et landmarks avec Lighthouse/axe DevTools.

