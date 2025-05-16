import { IngredientUnity } from "../models/ingredient.model"
import { IngredientDto } from "./ingredient.dto"

export enum DishCategory {
    STARTERS = "STARTERS",
    MAIN_DISHES = "MAIN_DISHES",
    FISH_SEAFOOD = "FISH_SEAFOOD",
    VEGETARIAN = "VEGETARIAN",
    PASTA_RICE = "PASTA_RICE",
    SALADS = "SALADS",
    SOUPS = "SOUPS",
    SIDE_DISHES = "SIDE_DISHES",
    DESSERTS = "DESSERTS",
    BEVERAGES = "BEVERAGES"
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
    ingredientRef: IngredientDto
    unity: IngredientUnity
    quantity: number
}