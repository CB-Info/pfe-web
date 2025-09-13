import { IngredientUnity } from "../models/ingredient.model";
import { DishCategory } from "./dish.dto";

export interface DishCreationDto {
  name: string;
  ingredients: DishIngredientCreationDto[];
  price: number;
  description: string;
  category: DishCategory;
  timeCook?: number;
  isAvailable: boolean;
}

export interface DishUpdateDto {
  _id: string;
  name: string;
  ingredients: DishIngredientCreationDto[];
  price: number;
  description: string;
  category: DishCategory;
  timeCook?: number;
  isAvailable: boolean;
}

export interface DishIngredientCreationDto {
  ingredientId: string;
  unity: IngredientUnity;
  quantity: number;
}
