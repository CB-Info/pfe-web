import { DishCreationDto } from "../../dto/dish.creation.dto";
import { DishDto } from "../../dto/dish.dto";
import { IngredientDto } from "../../dto/ingredient.dto";
import FirebaseAuthManager from "../../firebase.auth.manager";
import { Dish } from "../../models/dish.model";
import { Ingredient } from "../../models/ingredient.model";
import { Data } from "./ingredients.repository";

export class DishesRepositoryImpl {
    private url: string = "http://localhost:3000/dishes"

    async getTopIngredients(): Promise<Ingredient[]> {
        try {
            const token = await FirebaseAuthManager.getInstance().getToken()
            const response = await fetch(`${this.url}/top-ingredients`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                }
            })
            const data: Data<IngredientDto[]> = await response.json()

            return data.data.map((element) => new Ingredient(element._id, element.name, element.unity, element.value))
        } catch (error) {
            throw new Error("")
        }
    }

    async create(newDish: DishCreationDto) {
        try {
            const token = await FirebaseAuthManager.getInstance().getToken()
            await fetch(this.url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(newDish)
            })
        } catch (error) {
            throw new Error("")
        }
    }

    async getAll(): Promise<Dish[]> {
        const token = await FirebaseAuthManager.getInstance().getToken()
        const response = await fetch(this.url, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`
            }
        })
        const body: Data<DishDto[]> = await response.json()

        return body.data.map((dish) => Dish.fromDto(dish))
    }

    async update(dish: DishCreationDto) {
        try {
            const token = await FirebaseAuthManager.getInstance().getToken()
            await fetch(`${this.url}/${dish._id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(dish)
            })
        } catch (error) {
            throw new Error("")
        }
    }
}