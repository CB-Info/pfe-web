import { CardDto, CreateCardDto } from "../../data/dto/card.dto";
import FirebaseAuthManager from "../authentication/firebase.auth.manager";
import { Data } from "./ingredients.repository";

export class CardsRepositoryImpl {
  private url: string = "https://pfe-api-fbyd.onrender.com/cards";

  async getAll(): Promise<CardDto[]> {
    try {
      const token = await FirebaseAuthManager.getInstance().getToken();
      const response = await fetch(this.url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data: Data<CardDto[]> = await response.json();
      return data.data;
    } catch (error) {
      throw new Error("Erreur lors de la récupération des cartes");
    }
  }

  async create(card: CreateCardDto): Promise<CardDto> {
    try {
      const token = await FirebaseAuthManager.getInstance().getToken();
      const response = await fetch(this.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(card),
      });

      if (response.status !== 201) {
        throw new Error("Erreur lors de la création de la carte");
      }

      const data: Data<CardDto> = await response.json();
      return data.data;
    } catch (error) {
      throw new Error("Erreur lors de la création de la carte");
      console.log(card);
    }
  }

  async update(card: CardDto): Promise<CardDto> {
    try {
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

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour de la carte");
      }

      const data: Data<CardDto> = await response.json();
      return data.data;
    } catch (error) {
      throw new Error("Erreur lors de la mise à jour de la carte");
    }
  }

  async updateStatus(cardId: string, isActive: boolean): Promise<void> {
    try {
      const token = await FirebaseAuthManager.getInstance().getToken();
      await fetch(`${this.url}/${cardId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive }),
      });
    } catch (error) {
      throw new Error("Erreur lors de la mise à jour de la carte");
    }
  }

  async delete(cardId: string): Promise<void> {
    try {
      const token = await FirebaseAuthManager.getInstance().getToken();
      await fetch(`${this.url}/${cardId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      throw new Error("Erreur lors de la suppression de la carte");
    }
  }
}
