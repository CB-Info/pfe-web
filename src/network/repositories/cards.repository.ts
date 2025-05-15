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
                console.error('Failed to fetch cards:', response.status);
                return [];
            }
            
            const body: Data<CardDto[]> = await response.json();
            
            // Ensure body and body.data exist and body.data is an array
            if (!body?.data) {
                console.log('No cards available');
                return [];
            }
            
            return Array.isArray(body.data) ? body.data.map(card => Card.fromDto(card)) : [];
        } catch (error) {
            console.error('Error fetching cards:', error);
            return []; // Return empty array on error
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