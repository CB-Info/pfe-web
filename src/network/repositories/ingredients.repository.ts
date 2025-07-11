import { IngredientDto } from "../../data/dto/ingredient.dto";
import FirebaseAuthManager from "../authentication/firebase.auth.manager";
import { Ingredient } from "../../data/models/ingredient.model";

export interface Data<T> {
  error: string;
  data: T;
}

export class IngredientRepositoryImpl {
  private url: string = `${import.meta.env.VITE_API_BASE_URL}/ingredients`;

  async createOne(newIngredient: IngredientDto): Promise<Ingredient> {
    try {
      const token = await FirebaseAuthManager.getInstance().getToken();
      const response = await fetch(this.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newIngredient),
      });
      const body: Data<IngredientDto> = await response.json();

      return new Ingredient(
        body.data._id,
        body.data.name,
        body.data.unity,
        body.data.value
      );
    } catch (error) {
      throw new Error("");
    }
  }

  async getAll(): Promise<Ingredient[]> {
    try {
      const token = await FirebaseAuthManager.getInstance().getToken();
      const response = await fetch(this.url, {
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
      throw new Error("");
    }
  }

  async getByName(name: string): Promise<Ingredient[]> {
    try {
      const token = await FirebaseAuthManager.getInstance().getToken();
      const encodedName = encodeURIComponent(name);
      const response = await fetch(`${this.url}/search?name=${encodedName}`, {
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
      throw new Error("");
    }
  }
}
