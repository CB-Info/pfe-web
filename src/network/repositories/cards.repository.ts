import { CardCreationDto, CardDto } from "../../data/dto/card.dto";
import { Card } from "../../data/models/card.model";
import FirebaseAuthManager from "../authentication/firebase.auth.manager";
import { Data } from "./ingredients.repository";

export class CardsRepositoryImpl {
    private url: string = "https://pfe-api-fbyd.onrender.com/cards";

    async getAll(): Promise<Card[]> {
        const token = await FirebaseAuthManager.getInstance().getToken();
        const response = await fetch(this.url, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`
            }
        });
        const body: Data<CardDto[]> = await response.json();
        return body.data.map(card => Card.fromDto(card));
    }

    async create(card: CardCreationDto): Promise<void> {
        const token = await FirebaseAuthManager.getInstance().getToken();
        await fetch(this.url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(card)
        });
    }

    async update(cardId: string, card: CardCreationDto): Promise<void> {
        const token = await FirebaseAuthManager.getInstance().getToken();
        await fetch(`${this.url}/${cardId}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(card)
        });
    }

    async delete(cardId: string): Promise<void> {
        const token = await FirebaseAuthManager.getInstance().getToken();
        await fetch(`${this.url}/${cardId}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`
            }
        });
    }
}