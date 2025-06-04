export interface CardDto {
    _id: string;
    name: string;
    dishesId: string[];
    isActive: boolean;
    dateOfCreation: string;
}

export interface CreateCardDto {
    name: string;
    dishesId: string[];
    isActive: boolean;
}