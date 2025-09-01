import { CardDto, CreateCardDto } from "../../data/dto/card.dto";
import FirebaseAuthManager from "../authentication/firebase.auth.manager";
import { Data } from "./ingredients.repository";
import { handleApiResponse } from "../../utils/api.utils";

export class CardsRepositoryImpl {
  private url: string = `${import.meta.env.VITE_API_BASE_URL}/cards`;

  async getAll(): Promise<CardDto[]> {
    const token = await FirebaseAuthManager.getInstance().getToken();
    const response = await fetch(this.url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    await handleApiResponse(response);
    const data: Data<CardDto[]> = await response.json();
    return data.data;
  }

  async create(card: CreateCardDto): Promise<CardDto> {
    const token = await FirebaseAuthManager.getInstance().getToken();
    const response = await fetch(this.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(card),
    });

    await handleApiResponse(response);
    const data: Data<CardDto> = await response.json();
    return data.data;
  }

  async update(card: CardDto): Promise<CardDto> {
    const token = await FirebaseAuthManager.getInstance().getToken();
    const response = await fetch(`${this.url}/${card._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: card.name,
        dishesId: card.dishesId,
        isActive: card.isActive,
      }),
    });

    await handleApiResponse(response);
    const data: Data<CardDto> = await response.json();
    return data.data;
  }

  async updateStatus(cardId: string, isActive: boolean): Promise<void> {
    const token = await FirebaseAuthManager.getInstance().getToken();
    const response = await fetch(`${this.url}/${cardId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ isActive }),
    });

    await handleApiResponse(response);
  }

  async delete(cardId: string): Promise<void> {
    const token = await FirebaseAuthManager.getInstance().getToken();
    const response = await fetch(`${this.url}/${cardId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    await handleApiResponse(response);
  }
}
