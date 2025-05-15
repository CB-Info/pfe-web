import { CardDto } from "../../data/dto/card.dto";
import { Card } from "../../data/models/card.model";
import { Dish } from "../../data/models/dish.model";
import FirebaseAuthManager from "../authentication/firebase.auth.manager";
import { Data } from "./ingredients.repository";

export class CardsRepositoryImpl {
    private url: string = "https://pfe-api-fbyd.onrender.com/cards";

    async create(name: string, dishes: string[]): Promise<void> {
        try {
            const token = await FirebaseAuthManager.getInstance().getToken();
            await fetch(this.url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ name, dishes })
            });
        } catch (error) {
            throw new Error("Failed to create card");
        }
    }

    async getAll(dishes: Dish[]): Promise<Card[]> {
        try {
            const token = await FirebaseAuthManager.getInstance().getToken();
            const response = await fetch(this.url, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                }
            });
            const data: Data<CardDto[]> = await response.json();
            return data.data.map(dto => Card.fromDto(dto, dishes));
        } catch (error) {
            throw new Error("Failed to fetch cards");
        }
    }

    async setActive(cardId: string): Promise<void> {
        try {
            const token = await FirebaseAuthManager.getInstance().getToken();
            await fetch(`${this.url}/${cardId}/activate`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                }
            });
        } catch (error) {
            throw new Error("Failed to activate card");
        }
    }
}