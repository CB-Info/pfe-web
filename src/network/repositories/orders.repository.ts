import {
  OrderDto,
  CreateOrderDto,
  UpdateOrderDto,
} from "../../data/dto/order.dto";
import { Order } from "../../data/models/order.model";
import FirebaseAuthManager from "../authentication/firebase.auth.manager";
import { Data } from "./ingredients.repository";
import { handleApiResponse } from "../../utils/api.utils";

export class OrdersRepositoryImpl {
  private url: string = `${import.meta.env.VITE_API_BASE_URL}/orders`;

  async getAll(): Promise<Order[]> {
    const token = await FirebaseAuthManager.getInstance().getToken();
    const response = await fetch(this.url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    await handleApiResponse(response);
    const data: Data<OrderDto[]> = await response.json();
    return data.data.map((order) => Order.fromDto(order));
  }

  async getById(orderId: string): Promise<Order> {
    const token = await FirebaseAuthManager.getInstance().getToken();
    const response = await fetch(`${this.url}/${orderId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    await handleApiResponse(response);
    const data: Data<OrderDto> = await response.json();
    return Order.fromDto(data.data);
  }

  async getByTable(tableId: string): Promise<Order[]> {
    const token = await FirebaseAuthManager.getInstance().getToken();
    const response = await fetch(`${this.url}/table/${tableId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    await handleApiResponse(response);
    const data: Data<OrderDto[]> = await response.json();
    return data.data.map((order) => Order.fromDto(order));
  }

  async create(newOrder: CreateOrderDto): Promise<Order> {
    const token = await FirebaseAuthManager.getInstance().getToken();
    const response = await fetch(this.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newOrder),
    });

    await handleApiResponse(response);
    const data: Data<OrderDto> = await response.json();
    return Order.fromDto(data.data);
  }

  async update(updateOrder: UpdateOrderDto): Promise<Order> {
    const token = await FirebaseAuthManager.getInstance().getToken();
    const { _id, ...updateData } = updateOrder;

    const response = await fetch(`${this.url}/${_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updateData),
    });

    await handleApiResponse(response);
    const data: Data<OrderDto> = await response.json();
    return Order.fromDto(data.data);
  }

  async delete(orderId: string): Promise<void> {
    const token = await FirebaseAuthManager.getInstance().getToken();
    const response = await fetch(`${this.url}/${orderId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    await handleApiResponse(response);
  }
}
