# API Client — C2.2.3 / C2.4.1

## Client HTTP

Le projet utilise **Axios** (v1.6.7) comme client HTTP principal, avec **fetch** natif pour certains cas spécifiques.

### Configuration de Base

```typescript
// URL de base définie dans les variables d'environnement
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
```

## Architecture des Repositories

Les repositories encapsulent toute la logique d'appel API :

```
src/network/repositories/
├── dishes.repository.ts      # Gestion des plats
├── cards.repository.ts       # Gestion des cartes  
├── ingredients.repository.ts # Gestion des ingrédients
└── user.repository.ts        # Gestion des utilisateurs
```

### Exemple de Repository (DishesRepository)

```typescript
export class DishesRepositoryImpl {
  private url: string = `${import.meta.env.VITE_API_BASE_URL}/dishes`;

  async getTopIngredients(): Promise<Ingredient[]> {
    try {
      const token = await FirebaseAuthManager.getInstance().getToken();
      const response = await fetch(`${this.url}/top-ingredients`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data: Data<IngredientDto[]> = await response.json();
      
      return data.data.map(
        (element) =>
          new Ingredient(
            element._id,
            element.name,
            element.unity,
            element.value
          )
      );
    } catch (error) {
      console.error("Error fetching top ingredients:", error);
      throw new Error(`Failed to fetch top ingredients: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
```

## Gestion de l'Authentification

### Stratégie d'Authentification

Le projet utilise **Firebase Authentication** avec des tokens JWT :

1. **Obtention du Token** : Via Firebase Auth Manager
2. **Stockage** : Token géré en mémoire par Firebase SDK (pas de localStorage)
3. **Transmission** : Header `Authorization: Bearer ${token}`
4. **Rafraîchissement** : Automatique par Firebase SDK

### FirebaseAuthManager

```typescript
class FirebaseAuthManager {
  async getToken(): Promise<string | null> {
    if (this.auth.currentUser) {
      return this.auth.currentUser.getIdToken();
    } else {
      throw new Error("Aucun utilisateur connecté");
    }
  }
}
```

### Justification du Stockage

- **Mémoire via Firebase SDK** : Plus sécurisé que localStorage
- **Pas de token en localStorage** : Évite les attaques XSS
- **Refresh automatique** : Firebase gère l'expiration
- **HttpOnly cookies non utilisés** : Architecture SPA avec API REST

## Gestion des Erreurs

### Pattern de Gestion

```typescript
try {
  const response = await fetch(url, options);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  return data;
} catch (error) {
  console.error("Error:", error);
  // Propagation avec message explicite
  throw new Error(`Failed to ${action}: ${error instanceof Error ? error.message : 'Unknown error'}`);
}
```

### Mapping des Erreurs HTTP

| Status | Message UI | Action |
|--------|------------|--------|
| 401 | "Session expirée, veuillez vous reconnecter" | Redirection login |
| 403 | "Accès non autorisé" | Affichage message |
| 404 | "Ressource introuvable" | Affichage message |
| 500 | "Erreur serveur, veuillez réessayer" | Retry possible |

## Typage et DTOs

### Data Transfer Objects

```typescript
// src/data/dto/dish.dto.ts
export interface DishDto {
  _id: string;
  name: string;
  price: number;
  ingredients: IngredientDto[];
  category: string;
  available: boolean;
}

// src/data/models/dish.model.ts
export class Dish {
  constructor(
    public id: string,
    public name: string,
    public price: number,
    public ingredients: Ingredient[],
    public category: string,
    public available: boolean
  ) {}
}
```

### Pattern de Transformation

DTO → Model dans les repositories :

```typescript
return data.data.map((dto) => 
  new Dish(
    dto._id,
    dto.name,
    dto.price,
    dto.ingredients.map(i => new Ingredient(...)),
    dto.category,
    dto.available
  )
);
```

## Endpoints Principaux

### Dishes
- `GET /dishes` - Liste des plats
- `GET /dishes/top-ingredients` - Ingrédients populaires
- `POST /dishes` - Création d'un plat
- `PUT /dishes/:id` - Mise à jour
- `DELETE /dishes/:id` - Suppression

### Cards (Cartes de menu)
- `GET /cards` - Liste des cartes
- `POST /cards` - Création
- `PUT /cards/:id` - Mise à jour
- `DELETE /cards/:id` - Suppression

### Ingredients
- `GET /ingredients` - Liste complète
- `POST /ingredients` - Ajout

### Users
- `GET /users/profile` - Profil utilisateur
- `PUT /users/profile` - Mise à jour profil

## Interceptors et Middleware

Actuellement, pas d'interceptor Axios global. Chaque repository gère :
- L'ajout du token d'authentification
- La gestion d'erreur spécifique
- La transformation des données

### Amélioration Future

Mise en place d'un interceptor Axios global pour :
- Ajout automatique du token
- Gestion centralisée des erreurs
- Retry automatique sur erreur réseau
- Loading state global

## Documentation Backend

Pour les schémas détaillés des endpoints et des modèles, se référer à la documentation Swagger du backend :
- **Développement** : `http://localhost:3000/api-docs`
- **Production** : À définir

## Sécurité des Appels API

1. **HTTPS obligatoire** en production
2. **Token Firebase** vérifié côté backend
3. **CORS** configuré pour origines autorisées
4. **Validation** des données avant envoi
5. **Sanitization** des entrées utilisateur