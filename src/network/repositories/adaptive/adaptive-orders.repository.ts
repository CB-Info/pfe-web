import { CreateOrderDto, OrderDto } from "../../../data/dto/order.dto";
import { Order } from "../../../data/models/order.model";
import FirebaseAuthManager from "../../authentication/firebase.auth.manager";
import CustomerAuthManager from "../../authentication/customer-auth.manager";
import { Data } from "../ingredients.repository";
import { handleApiResponse } from "../../../utils/api.utils";

export class AdaptiveOrdersRepositoryImpl {
  private url: string = `${import.meta.env.VITE_API_BASE_URL}/orders`;

  async create(newOrder: CreateOrderDto): Promise<Order> {
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
      method: "POST",
      headers,
      body: JSON.stringify(newOrder),
    });

    await handleApiResponse(response);
    const data: Data<OrderDto> = await response.json();
    return Order.fromDto(data.data);
  }
}
