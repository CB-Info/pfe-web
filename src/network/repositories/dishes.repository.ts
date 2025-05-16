import { DishCreationDto } from "../../data/dto/dish.creation.dto";
import { DishDto } from "../../data/dto/dish.dto";
import { IngredientDto } from "../../data/dto/ingredient.dto";
import FirebaseAuthManager from "../authentication/firebase.auth.manager";
import { Dish } from "../../data/models/dish.model";
import { Ingredient } from "../../data/models/ingredient.model";
import { Data } from "./ingredients.repository";

export class DishesRepositoryImpl {
    private url: string = "https://pfe-api-fbyd.onrender.com/dishes";
    private cache: Map<string, { data: any, timestamp: number }> = new Map();
    private cacheTimeout = 5 * 60 * 1000; // 5 minutes

    private async getFromCache<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
        const now = Date.now();
        const cached = this.cache.get(key);

        if (cached && (now - cached.timestamp) < this.cacheTimeout) {
            return cached.data as T;
        }

        const data = await fetcher();
        this.cache.set(key, { data, timestamp: now });
        return data;
    }

    private clearCache() {
        this.cache.clear();
    }

    async getTopIngredients(): Promise<Ingredient[]> {
        const cacheKey = 'top-ingredients';
        
        return this.getFromCache(cacheKey, async () => {
            try {
                const token = await FirebaseAuthManager.getInstance().getToken();
                const response = await fetch(`${this.url}/top-ingredients`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": `Bearer ${token}`
                    }
                });
                const data: Data<IngredientDto[]> = await response.json();

                return data.data.map((element) => 
                    new Ingredient(element._id, element.name, element.unity, element.value)
                );
            } catch (error) {
                throw new Error("Erreur lors de la récupération des ingrédients populaires");
            }
        });
    }

    async create(newDish: DishCreationDto) {
        try {
            const token = await FirebaseAuthManager.getInstance().getToken();
            await fetch(this.url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(newDish)
            });
            this.clearCache();
        } catch (error) {
            throw new Error("Erreur lors de la création du plat");
        }
    }

    async getAll(): Promise<Dish[]> {
        const cacheKey = 'all-dishes';
        
        return this.getFromCache(cacheKey, async () => {
            const token = await FirebaseAuthManager.getInstance().getToken();
            const response = await fetch(this.url, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                }
            });
            const body: Data<DishDto[]> = await response.json();

            return body.data.map((dish) => Dish.fromDto(dish));
        });
    }

    async update(dish: DishCreationDto) {
        try {
            const token = await FirebaseAuthManager.getInstance().getToken();
            await fetch(`${this.url}/${dish._id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(dish)
            });
            this.clearCache();
        } catch (error) {
            throw new Error("Erreur lors de la mise à jour du plat");
        }
    }

    async delete(dishId: string) {
        try {
            const token = await FirebaseAuthManager.getInstance().getToken();
            await fetch(`${this.url}/${dishId}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                }
            });
            this.clearCache();
        } catch (error) {
            throw new Error("Erreur lors de la suppression du plat");
        }
    }
}