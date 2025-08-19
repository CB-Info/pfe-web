### Client API du front

## Bibliothèque et stratégie

- Client: `fetch` natif (pas d'axios utilisé malgré sa présence dans `dependencies`).
- Auth: Firebase Authentication côté client; pour chaque requête, récupération du Firebase ID token et ajout dans `Authorization: Bearer ...`.
- Typage: DTO (`src/data/dto/*`) mappés vers des `models` (`src/data/models/*`).
- Gestion d'erreurs: try/catch dans les repositories, propagation d'erreurs avec messages simples; affichage UI via `AlertsContext`.

## Endpoints réellement appelés

Base URL: `${import.meta.env.VITE_API_BASE_URL}`

- Dishes (`/dishes`):
  - GET `/dishes` → liste de plats
  - GET `/dishes/top-ingredients`
  - POST `/dishes` (création)
  - PUT `/dishes/{id}` (mise à jour)
  - DELETE `/dishes/{id}`
- Ingredients (`/ingredients`):
  - GET `/ingredients`
  - GET `/ingredients/search?name=...`
  - POST `/ingredients`
- Cards (`/cards`):
  - GET `/cards`
  - POST `/cards`
  - PUT `/cards/{id}` (update)
  - PUT `/cards/{id}` avec `{ isActive }` (toggle état)
  - DELETE `/cards/{id}`
- Users (`/users`):
  - POST login via Firebase (pas d'endpoint back)
  - GET `/users/me`
  - PATCH `/users/{id}`

## Extraits de code (réels)

Instance Auth + token:

```1:61:src/network/authentication/firebase.auth.manager.ts
async getToken(): Promise<string | null> {
  if (this.auth.currentUser) {
    return this.auth.currentUser.getIdToken();
  } else {
    throw new Error("Aucun utilisateur connecté");
  }
}
```

Repository (ex. plats):

```1:40:src/network/repositories/dishes.repository.ts
async getAll(): Promise<Dish[]> {
  const token = await FirebaseAuthManager.getInstance().getToken();
  const response = await fetch(this.url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const body: Data<DishDto[]> = await response.json();
  return body.data.map((dish) => Dish.fromDto(dish));
}
```

Gestion UI des erreurs (ex. login):

```61:95:src/UI/pages/authentication/login.page.tsx
try {
  await userRepository.login(emailInput, passwordInput);
} catch (error) {
  addAlert({ 
    severity: "error", 
    message: "Email ou mot de passe incorrect. Veuillez vérifier vos informations.",
    timeout: 5
  });
} finally {
  setIsLoading(false);
}
```

Map DTO → modèles (ex. user):

```13:31:src/network/repositories/user.respository.ts
const body: Data<UserDto> = await response.json();
return {
  id: body.data._id,
  email: body.data.email,
  firstname: body.data.firstname,
  lastname: body.data.lastname,
};
```

## Auth côté front

- Login: `FirebaseAuthManager.login(email, password)`.
- Stockage du token: en mémoire via Firebase SDK (pas dans `localStorage`). Récupération à la demande avec `getIdToken()`.
- Garde UI: `AuthProvider` écoute `onAuthStateChanged` et affiche `LoginPage` si non connecté.

## Lien doc back

- Se référer à la documentation Swagger du backend (URL à renseigner côté back). Les schémas ne sont pas dupliqués ici.

