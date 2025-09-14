import { DishDto } from "../../../data/dto/dish.dto";
import { Dish } from "../../../data/models/dish.model";
import FirebaseAuthManager from "../../authentication/firebase.auth.manager";
import CustomerAuthManager from "../../authentication/customer-auth.manager";
import { Data } from "../ingredients.repository";
import { handleApiResponse } from "../../../utils/api.utils";

export class AdaptiveDishesRepositoryImpl {
  private url: string = `${import.meta.env.VITE_API_BASE_URL}/dishes`;

  async getAll(): Promise<Dish[]> {
    const isCustomerMode = CustomerAuthManager.getInstance().isCustomerMode();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (!isCustomerMode) {
      // Mode normal : utiliser l'authentification Firebase
      const token = await FirebaseAuthManager.getInstance().getToken();
      headers.Authorization = `Bearer ${token}`;
    }
    // Mode client : pas d'authentification ni de header personnalisé
    // Le backend peut identifier les clients par l'absence du header Authorization

    const response = await fetch(this.url, {
      method: "GET",
      headers,
    });

    await handleApiResponse(response);
    const body: Data<DishDto[]> = await response.json();

    return body.data.map((dish) => Dish.fromDto(dish));
  }
}
