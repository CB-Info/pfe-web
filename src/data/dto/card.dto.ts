import { DishDto } from "./dish.dto";

export interface CardDto {
    _id: string;
    name: string;
    dishes: DishDto[];
    isActive: boolean;
}

export interface CardCreationDto {
    name: string;
    dishes: string[];
    isActive: boolean;
}