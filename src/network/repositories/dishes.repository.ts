import { DishCreationDto } from "../../data/dto/dish.creation.dto";
import { DishDto } from "../../data/dto/dish.dto";
import { IngredientDto } from "../../data/dto/ingredient.dto";
import FirebaseAuthManager from "../authentication/firebase.auth.manager";
import { Dish } from "../../data/models/dish.model";
import { Ingredient } from "../../data/models/ingredient.model";
import { Data } from "./ingredients.repository";

export class DishesRepositoryImpl {
  private url: string = "https://pfe-api-fbyd.onrender.com/dishes";

  async getTopIngredients(): Promise<Ingredient[]> {
    try {
      const token = await FirebaseAuthManager.getInstance().getToken();
      const response = await fetch(`${this.url}/top-ingredients`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data: Data<IngredientDto[]> = await response.json();

      return data.data.map(
        (element) =>
          new Ingredient(
            element._id,
            element.name,
            element.unity,
            element.value
          )
      );
    } catch (error) {
      console.error("Error fetching top ingredients:", error);
      throw new Error(`Failed to fetch top ingredients: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async create(newDish: DishCreationDto) {
    try {
      const token = await FirebaseAuthManager.getInstance().getToken();
      await fetch(this.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newDish),
      });
    } catch (error) {
      console.error("Error creating dish:", error);
      throw new Error(`Failed to create dish: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getAll(): Promise<Dish[]> {
    const token = await FirebaseAuthManager.getInstance().getToken();
    const response = await fetch(this.url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const body: Data<DishDto[]> = await response.json();

    return body.data.map((dish) => Dish.fromDto(dish));
  }

  async update(dish: DishCreationDto) {
    try {
      const token = await FirebaseAuthManager.getInstance().getToken();
      await fetch(`${this.url}/${dish._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dish),
      });
    } catch (error) {
      console.error("Error updating dish:", error);
      throw new Error(`Failed to update dish: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async delete(dishId: string) {
    try {
      const token = await FirebaseAuthManager.getInstance().getToken();
      await fetch(`${this.url}/${dishId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      throw new Error("Erreur lors de la suppression du plat");
    }
  }
}
