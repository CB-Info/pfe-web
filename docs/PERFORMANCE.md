### Performance

Ce qui est en place:
- Build Vite avec React SWC.
- Code splitting des pages via `React.lazy` + `Suspense` dans `App.tsx` (Dashboard/Dishes/Cards/Settings).
- Rapport bundle via `rollup-plugin-visualizer` → `bundle-stats.html` généré à la build.
- Service Worker simple (cache de ressources de base).

Axes d'amélioration:
- Lazy‑loading additionnel pour composants lourds (modals, customer view) si nécessaire.
- Optimisation images (icônes déjà en PNG/SVG).
- Mesure Lighthouse et correction des éventuels points (TTI, LCP).

Preuves à inclure dans le PDF:
- Capture `bundle-stats.html` (post‑build).
- Rapports Lighthouse (desktop/mobile) de la version déployée.

