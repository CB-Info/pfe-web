export interface CardDto {
    _id: string;
    name: string;
    dishesId: string[];
    isActive: boolean;
}

export interface CreateCardDto {
    name: string;
    dishesId: string[];
    isActive: boolean;
}