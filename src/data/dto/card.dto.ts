import { DishDto } from "./dish.dto";

export interface CardDto {
    _id: string;
    name: string;
    dishes: DishDto[];
    isActive: boolean;
}

export interface CardCreationDto {
    name: string;
    dishesId: string[]; // Changed from dishes to dishesId to match API expectation
    isActive: boolean;
}