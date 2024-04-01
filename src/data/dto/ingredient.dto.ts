import { IngredientUnity } from "../models/ingredient.model"

export interface IngredientDto {
    _id: string
    name: string
    unity?: IngredientUnity
    value?: number
}