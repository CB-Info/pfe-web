### Architecture frontend (React + TypeScript + Vite + Tailwind)

Cette documentation décrit l'architecture réelle détectée dans ce dépôt.

- Stack: React 18 + TypeScript, Vite 7 (plugin React SWC), Tailwind CSS 3 + DaisyUI, Styled‑Components (thèmes light/dark), Headless UI (Switch), Framer Motion, MUI (table/pagination), React Router 6.
- Outil de test: Vitest + Testing Library (jsdom).
- Service Worker et manifest présents dans `public/` (caching basique), enregistrement dans `src/main.tsx`.

## Arborescence source (réelle)

```
src/
├── App.tsx
├── main.tsx
├── applications/
│  ├── css/            # index.css avec directives Tailwind + fonts
│  └── theme/          # thèmes styled-components (light/dark)
├── config/            # config Firebase + sécurité (App Check)
├── contexts/          # Contexts: auth, alerts, theme
├── data/              # dto/ et models/ (Dish, Ingredient, User, ...)
├── hooks/             # useTheme, useAlerts
├── network/
│  ├── authentication/ # FirebaseAuthManager (login, token, monitor)
│  └── repositories/   # appels HTTP (fetch) vers VITE_API_BASE_URL
├── reducers/          # reducer auth (currentUser) + contexts
└── UI/
   ├── components/     # boutons, tables, modals, alert, layout, etc.
   ├── pages/          # dashboard, dishes, cards, authentication, settings
   └── style/          # styles réutilisables (Title, Label, Inputs)
```

## Build et configuration

- Vite: `vite.config.ts` avec `@vitejs/plugin-react-swc`, `vite-plugin-babel-macros`, `rollup-plugin-visualizer` (génère `bundle-stats.html` à la build).
- Tailwind: `tailwind.config.cjs` (scan `./src/**/*.{js,ts,jsx,tsx,mdx}`), plugin `daisyui`, tokens étendus (couleurs, fonts).
- PostCSS: `postcss.config.cjs`.

## Routing

- Router: React Router DOM 6, `BrowserRouter` dans `src/main.tsx`.
- Routes déclarées dans `src/App.tsx` avec lazy loading et `Suspense`.
  - `/` → Dashboard
  - `/dashboard` → Dashboard
  - `/dishes` → Dishes
  - `/cards` → Cards
  - `/settings` → Settings
  - `/home` → alias Dashboard (même composant)
- Pas de route 404 explicite à ce stade.
- Garde d'accès globale via `AuthProvider` (si non connecté → `LoginPage`).

Extrait clé (lazy + Suspense):

```12:31:src/App.tsx
const DashboardPage = lazy(() => import("./UI/pages/dashboard/dashboard.page"));
const DishesPage = lazy(() => import("./UI/pages/dishes/dishes.page"));
const CardsPage = lazy(() => import("./UI/pages/cards/cards.page"));
const SettingsPage = lazy(() => import("./UI/pages/settings/settings.page"));
...
<Suspense fallback={<Loading size="medium" text="Chargement de la page..." />}> 
  <Routes>
    <Route path="/" element={<DashboardPage />} />
    <Route path="/dashboard" element={<DashboardPage />} />
    <Route path="/dishes" element={<DishesPage />} />
    <Route path="/cards" element={<CardsPage />} />
    <Route path="/settings" element={<SettingsPage />} />
    <Route path="/home" element={<DashboardPage />} />
  </Routes>
</Suspense>
```

## State management

- Context API:
  - `ThemeContext` (dark mode, persistance `localStorage`), hook `useTheme`.
  - `AlertsContext` (file d'alertes avec persistance optionnelle), hook `useAlerts`.
  - Auth: `AuthProvider` encapsule l'app; `usersListerlocalReducer` gère `currentUser` (dispatch depuis la NavBar après `getMe()`).
- Pas de Redux/Zustand; mises à jour immuables via reducer local.

## Organisation UI

- Composants réutilisables: boutons (`UI/components/buttons`), inputs, modals (`UI/components/modals`), tables (`UI/components/tables`), alerts, layout (`PageHeader`, `PanelContent`, `BaseContent`).
- Pages riches: `dashboard`, `dishes` (filtres, tri, table paginée), `cards` (activation unique, aperçu client), `authentication` (login + reset).
- Thèmes via `styled-components` provider + Tailwind utilitaires.

## Styles (Tailwind)

- Fichier d'entrée: `src/applications/css/index.css`
  - `@tailwind base; @tailwind components; @tailwind utilities;`
  - import des polices via `fonts.css`.
- `tailwind.config.cjs` étend couleurs/typos et active `daisyui`.

## Assets

- `public/manifest.json` + icônes `eatopia192.png`, `eatopia512.png`.
- `public/service-worker.js` simple cache; enregistré dans `main.tsx`.
- `src/assets/` pour animations Lottie et médias UI.

## Flux applicatif (schéma)

```
UI (React pages/components)
  ↓ actions utilisateur (clic, saisie)
State (Contexts: auth/theme/alerts, reducer auth)
  ↓
API Client (repositories/* via fetch + Bearer Firebase ID token)
  ↓
Backend (VITE_API_BASE_URL)
  ↓
Réponses → mapping DTO → models → rendu UI (tables, listes, modals)
```

## Patterns clés

- Formulaire + validation (extrait `dish.form.tsx`):
  - Validation synchrones, messages via `useAlerts`, reset contrôlé, loaders.
- Table/List + Empty states (`dish.table.tsx`, pages `dishes/cards`):
  - Pagination MUI, tri/filtre côté client, états vides explicites.
- Loader/Skeleton:
  - `Loading` (Lottie) utilisé en fallback Suspense et lors des fetchs.

