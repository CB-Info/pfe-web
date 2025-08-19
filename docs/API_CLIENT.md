# Client API Frontend — C2.2.3 / C2.4.1

## Client HTTP Utilisé

### Fetch API Native
Le projet utilise l'API **Fetch native** du navigateur, sans wrapper externe comme Axios pour la plupart des appels.

```typescript
// Pattern standard utilisé dans les repositories
const response = await fetch(url, {
  method: "GET|POST|PUT|DELETE",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify(data) // Pour POST/PUT
});
```

### Axios Disponible
Axios 1.6.7 est installé mais peu utilisé dans le code actuel. Il reste disponible pour des besoins futurs d'interceptors complexes.

## Architecture des Appels API

### Repository Pattern
Chaque entité métier a son repository dédié :

```typescript
// Structure des repositories
src/network/repositories/
├── dishes.repository.ts      // CRUD plats
├── cards.repository.ts       // Gestion cartes/tables  
├── ingredients.repository.ts // Gestion ingrédients
└── user.respository.ts      // Gestion utilisateurs
```

### Exemple Concret - DishesRepository

```typescript
export class DishesRepositoryImpl {
  private url: string = `${import.meta.env.VITE_API_BASE_URL}/dishes`;

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

  async create(newDish: DishCreationDto) {
    try {
      const token = await FirebaseAuthManager.getInstance().getToken();
      await fetch(this.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newDish),
      });
    } catch (error) {
      console.error("Error creating dish:", error);
      throw new Error(`Failed to create dish: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
```

## Gestion des Erreurs

### Pattern de Gestion d'Erreur

```typescript
// Pattern utilisé dans les repositories
try {
  const response = await fetch(url, options);
  const data = await response.json();
  return data;
} catch (error) {
  console.error("Error description:", error);
  throw new Error(`Failed to operation: ${error instanceof Error ? error.message : 'Unknown error'}`);
}
```

### Types d'Erreurs Gérées

1. **Erreurs Réseau** : Timeout, connexion fermée
2. **Erreurs HTTP** : 401, 403, 404, 500
3. **Erreurs de Parsing** : JSON malformé
4. **Erreurs d'Authentification** : Token expiré/invalide

### Propagation des Erreurs

```typescript
// Les erreurs remontent jusqu'aux composants UI
const handleSubmit = async () => {
  try {
    await dishesRepository.create(newDish);
    // Succès - notification positive
  } catch (error) {
    // Erreur - notification d'erreur via AlertsContext
    showAlert("error", error.message);
  }
};
```

## Stratégie de Typage

### DTOs (Data Transfer Objects)

Structure organisée pour le typage des réponses API :

```typescript
// src/data/dto/
├── dish.dto.ts           // Interface DishDto + enums
├── dish.creation.dto.ts  // DTO pour création/modification
├── ingredient.dto.ts     // Interface IngredientDto
├── card.dto.ts          // Interface CardDto
└── user.dto.ts          // Interface UserDto
```

### Exemple de DTO Complet

```typescript
export interface DishDto {
  _id: string;
  name: string;
  ingredients: DishIngredientDto[];
  price: number;
  description: string;
  category: DishCategory;
  dateOfCreation: string;
  timeCook?: number;
  isAvailable: boolean;
}

export enum DishCategory {
  STARTERS = "STARTERS",
  MAIN_DISHES = "MAIN_DISHES",
  DESSERTS = "DESSERTS",
  // ... autres catégories
}
```

### Mapping DTO → Modèles

```typescript
// Transformation DTO vers modèle métier
export class Dish {
  static fromDto(dto: DishDto): Dish {
    return new Dish(
      dto._id,
      dto.name,
      dto.ingredients.map(ing => DishIngredient.fromDto(ing)),
      dto.price,
      dto.description,
      dto.category,
      new Date(dto.dateOfCreation),
      dto.timeCook,
      dto.isAvailable
    );
  }
}
```

### Format de Réponse API

```typescript
// Structure standard des réponses
export interface Data<T> {
  data: T;
  message?: string;
  status?: number;
}

// Usage
const response: Data<DishDto[]> = await response.json();
const dishes = response.data.map(dto => Dish.fromDto(dto));
```

## Authentification

### Stratégie d'Auth - Firebase JWT

**Stockage du Token** : En mémoire via Firebase Auth SDK
- ✅ **Sécurisé** : Pas de stockage localStorage/sessionStorage
- ✅ **Automatique** : Refresh token géré par Firebase
- ✅ **Centralisé** : Via FirebaseAuthManager singleton

### Gestionnaire d'Authentification

```typescript
class FirebaseAuthManager {
  private static instance: FirebaseAuthManager;
  private auth: Auth;

  async getToken(): Promise<string | null> {
    if (this.auth.currentUser) {
      return this.auth.currentUser.getIdToken(); // Refresh automatique
    } else {
      throw new Error("Aucun utilisateur connecté");
    }
  }

  monitorAuthState(callback: (user: User | null) => void) {
    return onAuthStateChanged(this.auth, callback);
  }
}
```

### Intégration dans les Appels API

```typescript
// Chaque repository utilise le token automatiquement
const token = await FirebaseAuthManager.getInstance().getToken();
const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
};
```

### Justification du Choix

**Pourquoi Firebase Auth + JWT en mémoire :**
- 🔒 **Sécurité** : Pas d'exposition XSS via localStorage
- 🔄 **Refresh automatique** : Firebase gère l'expiration
- 🎯 **Simplicité** : Pas de gestion manuelle des tokens
- 🌐 **Standard** : JWT Bearer token standard REST

## Endpoints Réellement Appelés

### Base URL
```typescript
const API_BASE = import.meta.env.VITE_API_BASE_URL; // Ex: https://api.mon-backend.com/api
```

### Endpoints Dishes
```typescript
GET    ${API_BASE}/dishes                    // Liste tous les plats
POST   ${API_BASE}/dishes                    // Créer un plat
PUT    ${API_BASE}/dishes/{id}              // Modifier un plat
DELETE ${API_BASE}/dishes/{id}              // Supprimer un plat
GET    ${API_BASE}/dishes/top-ingredients   // Top ingrédients
```

### Endpoints Cards
```typescript
GET    ${API_BASE}/cards        // Liste des cartes/tables
POST   ${API_BASE}/cards        // Créer une carte
PUT    ${API_BASE}/cards/{id}   // Modifier une carte
DELETE ${API_BASE}/cards/{id}   // Supprimer une carte
```

### Endpoints Ingredients
```typescript
GET    ${API_BASE}/ingredients              // Liste ingrédients
POST   ${API_BASE}/ingredients              // Créer ingrédient
PUT    ${API_BASE}/ingredients/{id}         // Modifier ingrédient
DELETE ${API_BASE}/ingredients/{id}         // Supprimer ingrédient
GET    ${API_BASE}/ingredients/search?q=... // Recherche ingrédients
```

### Endpoints Users
```typescript
GET    ${API_BASE}/users        // Profil utilisateur
PUT    ${API_BASE}/users        // Modifier profil
POST   ${API_BASE}/users/avatar // Upload avatar
```

## Interceptors et Middleware

### Pas d'Interceptors Actuellement
Le projet n'utilise pas d'interceptors Axios. La gestion est manuelle dans chaque repository.

### Amélioration Future - Interceptors
```typescript
// Si migration vers Axios
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Request interceptor pour token automatique
apiClient.interceptors.request.use(async (config) => {
  const token = await FirebaseAuthManager.getInstance().getToken();
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor pour erreurs globales
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirection login automatique
    }
    return Promise.reject(error);
  }
);
```

## Lien vers Documentation Backend

### Swagger/OpenAPI
- **URL Swagger** : À définir selon l'hébergement du backend
- **Schémas** : Les DTOs frontend doivent correspondre aux schémas Swagger
- **Versioning** : Alignement des versions API entre front/back

### Éviter la Duplication
- ✅ Frontend documente **comment** appeler l'API
- ✅ Backend documente **quels** endpoints et schémas
- ❌ Pas de duplication des schémas de données
- ❌ Pas de documentation des règles métier (côté backend)

## Gestion du Cache

### Pas de Cache Actuellement
- Pas de React Query/TanStack Query
- Pas de cache manuel
- Chaque appel refetch les données

### Amélioration Future
```typescript
// Avec React Query (recommandé)
const useDishes = () => {
  return useQuery({
    queryKey: ['dishes'],
    queryFn: () => dishesRepository.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
```

## Monitoring et Debug

### Logs Actuels
```typescript
// Pattern de logging dans repositories
console.error("Error creating dish:", error);
```

### Améliorations Futures
- Intégration Sentry pour monitoring erreurs
- Logs structurés avec niveaux
- Métriques de performance API