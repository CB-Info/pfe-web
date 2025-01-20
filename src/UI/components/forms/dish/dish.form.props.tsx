import { Dish } from "../../../../data/models/dish.model";

export enum DishFormMode {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
}

export interface DishFormProps {
  mode: DishFormMode;

  dish?: Dish;

  onSubmitSuccess: () => void;

  onCancel: () => void;
}
