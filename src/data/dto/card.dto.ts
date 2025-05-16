export interface CardDto {
    _id: string;
    name: string;
    dishesId: string[];
    isActive: boolean;
    createdAt: string;
}

export interface CreateCardDto {
    name: string;
    dishesId: string[];
    isActive: boolean;
}