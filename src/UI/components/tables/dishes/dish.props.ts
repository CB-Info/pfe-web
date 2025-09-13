import { Dish } from "../../../../data/models/dish.model";

export interface DishRowProps {
  row: Dish;
  onClick: (dish: Dish) => void;
  onDelete: () => void;
  canManage?: boolean;
}

export interface DishesTableProps {
  dishes: Dish[];
  setSelectedDish: (dish: Dish) => void;
  onDelete: () => void;
  canManage?: boolean;
}

export interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => void;
}
