import { DishCategory, DishDto } from "../dto/dish.dto";
import { Ingredient, IngredientUnity } from "./ingredient.model";

export class Dish {
  _id: string;
  name: string;
  ingredients: DishIngredient[];
  price: number;
  description: string;
  category: DishCategory;
  timeCook?: number;
  isAvailable: boolean;

  constructor(
    _id: string,
    name: string,
    ingredients: DishIngredient[],
    price: number,
    description: string,
    category: DishCategory,
    isAvailable: boolean,
    timeCook?: number
  ) {
    this._id = _id;
    this.name = name;
    this.ingredients = ingredients;
    this.price = price;
    this.description = description;
    this.category = category;
    this.timeCook = timeCook;
    this.isAvailable = isAvailable;
  }

  static fromDto(dto: DishDto): Dish {
    const ingredients = dto.ingredients.map((e) => {
      const ingredient = new Ingredient(
        e.ingredientRef._id,
        e.ingredientRef.name
      );
      return new DishIngredient(ingredient, e.unity, e.quantity);
    });
    return new Dish(
      dto._id,
      dto.name,
      ingredients,
      dto.price,
      dto.description,
      dto.category,
      dto.isAvailable,
      dto.timeCook
    );
  }
}

export class DishIngredient {
  ingredient: Ingredient;
  unity: IngredientUnity;
  quantity: number;

  constructor(
    ingredient: Ingredient,
    unity: IngredientUnity,
    quantity: number
  ) {
    this.ingredient = ingredient;
    this.unity = unity;
    this.quantity = quantity;
  }
}
