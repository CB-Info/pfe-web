import { DishCategory, DishDto, DishIngredientDto } from "../dto/dish.dto"
import { IngredientUnity } from "./ingredient.model"

export class Dish {
    _id: string
    name: string
    ingredients: DishIngredient[]
    price: number
    description: string
    category: DishCategory
    timeCook?: number
    isAvailable: boolean

    constructor(_id: string, name: string, ingredients: DishIngredient[], price: number, description: string, category: DishCategory, isAvailable: boolean, timeCook?: number) {
        this._id = _id
        this.name = name
        this.ingredients = ingredients
        this.price = price
        this.description = description
        this.category = category
        this.timeCook =timeCook
        this.isAvailable = isAvailable
    }

    static fromDto(dto: DishDto): Dish {
        const ingredients = dto.ingredients.map((e) => new DishIngredient(e.ingredientId, e.unity, e.quantity))
        return new Dish(dto._id, dto.name, ingredients, dto.price, dto.description, dto.category, dto.isAvailable, dto.timeCook)
    }
}

export class DishIngredient {
    _id: string
    unity: IngredientUnity
    quantity: number

    constructor(_id: string, unity: IngredientUnity, quantity: number) {
        this._id = _id
        this.unity = unity
        this.quantity = quantity
    }
}