import { IngredientDto } from "../../dto/ingredient.dto";
import FirebaseAuthManager from "../../firebase.auth.manager";
import { Ingredient } from "../../models/ingredient.model";

export interface Data<T> {
    error: string
    data: T
}

export class IngredientRepositoryImpl {
    private url: string = "http://localhost:3000/ingredients"

    async createOne(newIngredient: IngredientDto): Promise<Ingredient> {
        try {
            const token = await FirebaseAuthManager.getInstance().getToken();
            const response = await fetch(this.url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(newIngredient)
            })
            const body: Data<IngredientDto> = await response.json()

            return new Ingredient(body.data._id, body.data.name, body.data.unity, body.data.value)
        } catch (error) {
            throw new Error("")
        }
    }

    async getAll(): Promise<Ingredient[]> {
        try {
            const token = await FirebaseAuthManager.getInstance().getToken();
            const response = await fetch(this.url, {
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

    async getByName(name: string): Promise<Ingredient[]> {
        try {
            const token = await FirebaseAuthManager.getInstance().getToken();
            const response = await fetch(`${this.url}/search?name=${name}`, {
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
}