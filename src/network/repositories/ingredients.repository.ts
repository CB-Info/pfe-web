import { IngredientDto } from "../../data/dto/ingredient.dto";
import FirebaseAuthManager from "../authentication/firebase.auth.manager";
import { Ingredient } from "../../data/models/ingredient.model";
import { handleApiResponse } from "../../utils/api.utils";

export interface Data<T> {
  error: string;
  data: T;
}

export class IngredientRepositoryImpl {
  private url: string = `${import.meta.env.VITE_API_BASE_URL}/ingredients`;

  async createOne(newIngredient: IngredientDto): Promise<Ingredient> {
    const token = await FirebaseAuthManager.getInstance().getToken();
    const response = await fetch(this.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newIngredient),
    });

    await handleApiResponse(response);
    const body: Data<IngredientDto> = await response.json();

    return new Ingredient(
      body.data._id,
      body.data.name,
      body.data.unity,
      body.data.value
    );
  }

  async getAll(): Promise<Ingredient[]> {
    const token = await FirebaseAuthManager.getInstance().getToken();
    const response = await fetch(this.url, {
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

  async getByName(name: string): Promise<Ingredient[]> {
    const token = await FirebaseAuthManager.getInstance().getToken();
    const encodedName = encodeURIComponent(name);
    const response = await fetch(`${this.url}/search?name=${encodedName}`, {
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
}
