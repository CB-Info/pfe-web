import { CardDto } from "../../../data/dto/card.dto";
import FirebaseAuthManager from "../../authentication/firebase.auth.manager";
import CustomerAuthManager from "../../authentication/customer-auth.manager";
import { Data } from "../ingredients.repository";
import { handleApiResponse } from "../../../utils/api.utils";

export class AdaptiveCardsRepositoryImpl {
  private url: string = `${import.meta.env.VITE_API_BASE_URL}/cards`;

  async getActiveCard(): Promise<CardDto | null> {
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

    try {
      const response = await fetch(`${this.url}/active`, {
        method: "GET",
        headers,
      });

      // Si aucune carte active, retourner null au lieu de lever une erreur
      if (response.status === 404) {
        return null;
      }

      await handleApiResponse(response);
      const data: Data<CardDto> = await response.json();
      return data.data;
    } catch (error) {
      console.warn("Erreur lors de la récupération de la carte active:", error);
      return null;
    }
  }
}
