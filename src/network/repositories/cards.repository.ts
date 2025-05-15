import { CardCreationDto, CardDto } from "../../data/dto/card.dto";
import { Card } from "../../data/models/card.model";
import FirebaseAuthManager from "../authentication/firebase.auth.manager";
import { Data } from "./ingredients.repository";

export class CardsRepositoryImpl {
    private url: string = "https://pfe-api-fbyd.onrender.com/cards";

    async getAll(): Promise<Card[]> {
        try {
            const token = await FirebaseAuthManager.getInstance().getToken();
            const response = await fetch(this.url, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch cards');
            }
            
            const body: Data<CardDto[]> = await response.json();
            
            // Add validation to ensure body.data exists and is an array
            if (!body?.data || !Array.isArray(body.data)) {
                console.error('Invalid response format:', body);
                return [];
            }
            
            return body.data.map(card => Card.fromDto(card));
        } catch (error) {
            console.error('Error fetching cards:', error);
            return []; // Return empty array on error instead of throwing
        }
    }

    async create(card: CardCreationDto): Promise<void> {
        try {
            const token = await FirebaseAuthManager.getInstance().getToken();
            const response = await fetch(this.url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(card)
            });

            if (!response.ok) {
                throw new Error('Failed to create card');
            }
        } catch (error) {
            console.error('Error creating card:', error);
            throw error;
        }
    }

    async update(cardId: string, card: CardCreationDto): Promise<void> {
        try {
            const token = await FirebaseAuthManager.getInstance().getToken();
            const response = await fetch(`${this.url}/${cardId}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(card)
            });

            if (!response.ok) {
                throw new Error('Failed to update card');
            }
        } catch (error) {
            console.error('Error updating card:', error);
            throw error;
        }
    }

    async delete(cardId: string): Promise<void> {
        try {
            const token = await FirebaseAuthManager.getInstance().getToken();
            const response = await fetch(`${this.url}/${cardId}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete card');
            }
        } catch (error) {
            console.error('Error deleting card:', error);
            throw error;
        }
    }
}