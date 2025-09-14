import { TableDto } from "../../../data/dto/table.dto";
import { Table } from "../../../data/models/table.model";
import FirebaseAuthManager from "../../authentication/firebase.auth.manager";
import CustomerAuthManager from "../../authentication/customer-auth.manager";
import { Data } from "../ingredients.repository";
import { handleApiResponse } from "../../../utils/api.utils";

export class AdaptiveTablesRepositoryImpl {
  private url: string = `${import.meta.env.VITE_API_BASE_URL}/tables`;

  async getById(tableId: string): Promise<Table> {
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

    const response = await fetch(`${this.url}/${tableId}`, {
      method: "GET",
      headers,
    });

    await handleApiResponse(response);
    const data: Data<TableDto> = await response.json();
    return Table.fromDto(data.data);
  }
}
