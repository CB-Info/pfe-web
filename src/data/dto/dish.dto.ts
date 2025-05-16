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

export const DishCategoryLabels: Record<DishCategory, string> = {
    [DishCategory.STARTERS]: "Entrées et amuse-bouches",
    [DishCategory.MAIN_DISHES]: "Plats principaux",
    [DishCategory.FISH_SEAFOOD]: "Poissons et fruits de mer",
    [DishCategory.VEGETARIAN]: "Plats végétariens",
    [DishCategory.PASTA_RICE]: "Pâtes et riz",
    [DishCategory.SALADS]: "Salades composées",
    [DishCategory.SOUPS]: "Soupes et potages",
    [DishCategory.SIDE_DISHES]: "Accompagnements",
    [DishCategory.DESSERTS]: "Desserts et pâtisseries",
    [DishCategory.BEVERAGES]: "Boissons"
};

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