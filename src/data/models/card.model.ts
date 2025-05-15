import { Dish } from "./dish.model";

export interface Card {
  id: string;
  name: string;
  dishes: Dish[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}