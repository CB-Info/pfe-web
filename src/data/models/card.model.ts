import { CardDto } from "../dto/card.dto";
import { Dish } from "./dish.model";

export class Card {
    _id: string;
    name: string;
    dishes: Dish[];
    isActive: boolean;

    constructor(_id: string, name: string, dishes: Dish[], isActive: boolean) {
        this._id = _id;
        this.name = name;
        this.dishes = dishes;
        this.isActive = isActive;
    }

    static fromDto(dto: CardDto, dishes: Dish[]): Card {
        const cardDishes = dishes.filter(dish => dto.dishes.includes(dish._id));
        return new Card(dto._id, dto.name, cardDishes, dto.isActive);
    }
}