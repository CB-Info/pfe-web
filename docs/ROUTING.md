### Routing (React Router 6)

Provider: `BrowserRouter` dans `src/main.tsx`. Déclarations dans `src/App.tsx` avec lazy loading et `Suspense`.

## Routes actuelles

- `/` → Dashboard (publique après login global)
- `/dashboard` → Dashboard
- `/dishes` → Dishes
- `/cards` → Cards
- `/settings` → Settings
- `/home` → alias Dashboard

Il n'y a pas de page 404 dédiée.

## Garde d'accès

- `AuthProvider` impose l'auth globale: si non connecté, `LoginPage` est rendue. Pas de rôle fin au niveau des routes dans le code scanné.

## Redirections post‑login/logout

- Post‑login: l'écoute `onAuthStateChanged` déclenche l'affichage de l'app. Pas de redirection explicite; la NavBar charge l'utilisateur puis l'UI est accessible.
- Logout: non exposé dans cet extrait; `FirebaseAuthManager.logout()` existe.

## Liens profonds

- Pas de gestion spécifique des deep‑links; les pages sont accessibles directement par URL.

