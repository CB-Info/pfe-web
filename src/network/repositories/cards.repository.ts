import { CardCreationDto, CardDto } from "../../data/dto/card.dto";
import { Card } from "../../data/models/card.model";
import FirebaseAuthManager from "../authentication/firebase.auth.manager";
import { Data } from "./ingredients.repository";

export class CardsRepositoryImpl {
    private url: string = "https://pfe-api-fbyd.onrender.com/cards";

    async getAll(): Promise<Card[]> {
        try {
            console.log('Fetching cards...');
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
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const body = await response.json();
            console.log('Response body:', body);
            
            if (!body || !body.data) {
                console.log('No cards data available');
                return [];
            }
            
            const cards = body.data ? body.data.map(card => Card.fromDto(card)) : [];
            console.log('Processed cards:', cards);
            return cards;
        } catch (error) {
            console.error('Error fetching cards:', error);
            throw error;
        }
    }

    async create(card: CardCreationDto): Promise<void> {
        try {
            console.log('Creating card with data:', card);
            const token = await FirebaseAuthManager.getInstance().getToken();
            
            // Ensure dishesId is an array
            const payload = {
                name: card.name,
                dishesId: Array.isArray(card.dishesId) ? card.dishesId : [],
                isActive: card.isActive
            };
            
            console.log('Sending payload:', payload);
            
            const response = await fetch(this.url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Server error response:', errorData);
                throw new Error(errorData.message || 'Failed to create card');
            }
            
            const responseData = await response.json();
            console.log('Create card response:', responseData);
        } catch (error) {
            console.error('Error creating card:', error);
            throw error;
        }
    }

    async update(cardId: string, card: CardCreationDto): Promise<void> {
        try {
            console.log('Updating card:', cardId, 'with data:', card);
            const token = await FirebaseAuthManager.getInstance().getToken();
            
            // Ensure dishesId is an array
            const payload = {
                name: card.name,
                dishesId: Array.isArray(card.dishesId) ? card.dishesId : [],
                isActive: card.isActive
            };
            
            console.log('Sending update payload:', payload);
            
            const response = await fetch(`${this.url}/${cardId}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Server error response:', errorData);
                throw new Error(errorData.message || 'Failed to update card');
            }
            
            const responseData = await response.json();
            console.log('Update card response:', responseData);
        } catch (error) {
            console.error('Error updating card:', error);
            throw error;
        }
    }

    async delete(cardId: string): Promise<void> {
        try {
            console.log('Deleting card:', cardId);
            const token = await FirebaseAuthManager.getInstance().getToken();
            const response = await fetch(`${this.url}/${cardId}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Server error response:', errorData);
                throw new Error(errorData.message || 'Failed to delete card');
            }
            
            console.log('Card deleted successfully');
        } catch (error) {
            console.error('Error deleting card:', error);
            throw error;
        }
    }
}