import { DishDto } from "../../dto/dish.dto";
import { IngredientDto } from "../../dto/ingredient.dto";
import { Dish } from "../../models/dish.model";
import { Ingredient } from "../../models/ingredient.model";
import { Data } from "./ingredients.repository";

export class DishesRepositoryImpl {
    private url: string = "http://localhost:3000/dishes"

    async getTopIngredients(): Promise<Ingredient[]> {
        try {
            const response = await fetch(`${this.url}/top-ingredients`)
            const data: Data<IngredientDto[]> = await response.json()

            console.log(data.data.map((element) => new Ingredient(element._id, element.name, element.unity, element.value)))

            return data.data.map((element) => new Ingredient(element._id, element.name, element.unity, element.value))
        } catch (error) {
            throw new Error("")
        }
    }

    async create(newDish: DishDto): Promise<Dish> {
        try {
            const response = await fetch(this.url, {
                method: "POST",
                headers: {
                'Content-Type': 'application/json', // Indique le type de contenu envoyé
                },
                body: JSON.stringify(newDish)
            })
            const body: Data<DishDto> = await response.json()

            return Dish.fromDto(body.data)
        } catch (error) {
            throw new Error("")
        }
    }
}