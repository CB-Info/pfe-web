### State management

Le projet utilise React Context + reducers locaux. Pas de Redux/Zustand.

## Contexts

- `ThemeContext` (`src/contexts/theme.context.tsx`)
  - État: `isDarkMode` (persisté dans `localStorage`)
  - Action: `toggleTheme()`
  - Hook: `useTheme()`

- `AlertsContext` (`src/contexts/alerts.context.tsx`)
  - État: liste d'alertes avec file d'attente (max 3 visibles), persistance optionnelle en `localStorage` par `groupId`.
  - API: `addAlert({ message, severity, timeout, persist, groupId, priority })` → `id`, `dismissAlert(id)`
  - Hook: `useAlerts()`

- Auth (`src/contexts/auth.provider.tsx` + `src/reducers/auth.reducer.ts`)
  - Reducer: `currentUser` et action `UPDATE_USER`.
  - Provider: écoute `FirebaseAuthManager.monitorAuthState`; si non connecté → rend `LoginPage`.
  - `NavBar` charge `/users/me` au montage et dispatch `UPDATE_USER`.

## Règles d'update

- Updates immuables dans le reducer (`return { ...state, currentUser: payload }`).
- Pas de persistance globale du store (sauf alerts/theme via `localStorage`).

## Cache & invalidation

- Pas de TanStack Query; fetchs via repositories et mise à jour d'états locaux par page. Invalidation manuelle: rappel des fetchs après mutations (ex. `fetchCards()` après update/delete).

