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

    static fromDto(dto: CardDto): Card {
        return new Card(
            dto._id,
            dto.name,
            dto.dishes.map(dish => Dish.fromDto(dish)),
            dto.isActive
        );
    }
}