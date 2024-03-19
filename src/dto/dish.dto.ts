import { IngredientUnity } from "../models/ingredient.model"

export enum DishCategory {
    MEAT = "MEAT"
}

export interface DishDto {
    _id: string
    name: string
    ingredients: DishIngredientDto[]
    price: number
    description: string
    category: DishCategory
    timeCook?: number
    isAvailable: boolean
}

export interface DishIngredientDto {
    ingredientId: string
    unity: IngredientUnity
    quantity: number
}
