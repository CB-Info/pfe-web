import { DishCreationDto } from "../../data/dto/dish.creation.dto";
import { DishDto } from "../../data/dto/dish.dto";
import { IngredientDto } from "../../data/dto/ingredient.dto";
import FirebaseAuthManager from "../authentication/firebase.auth.manager";
import { Dish } from "../../data/models/dish.model";
import { Ingredient } from "../../data/models/ingredient.model";
import { Data } from "./ingredients.repository";
import { handleApiResponse } from "../../utils/api.utils";

export class DishesRepositoryImpl {
  private url: string = `${import.meta.env.VITE_API_BASE_URL}/dishes`;

  async getTopIngredients(): Promise<Ingredient[]> {
    const token = await FirebaseAuthManager.getInstance().getToken();
    const response = await fetch(`${this.url}/top-ingredients`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    await handleApiResponse(response);
    const data: Data<IngredientDto[]> = await response.json();

    return data.data.map(
      (element) =>
        new Ingredient(element._id, element.name, element.unity, element.value)
    );
  }

  async create(newDish: DishCreationDto) {
    const token = await FirebaseAuthManager.getInstance().getToken();
    const response = await fetch(this.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newDish),
    });

    await handleApiResponse(response);
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

    await handleApiResponse(response);
    const body: Data<DishDto[]> = await response.json();

    return body.data.map((dish) => Dish.fromDto(dish));
  }

  async update(dish: DishCreationDto) {
    const token = await FirebaseAuthManager.getInstance().getToken();
    const response = await fetch(`${this.url}/${dish._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dish),
    });

    await handleApiResponse(response);
  }

  async delete(dishId: string) {
    const token = await FirebaseAuthManager.getInstance().getToken();
    const response = await fetch(`${this.url}/${dishId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    await handleApiResponse(response);
  }
}
