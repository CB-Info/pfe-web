import { Dish } from "../../../../data/models/dish.model"

export interface DishRowProps {
    row: Dish
    onClick: (dish: Dish) => void
    onDelete: () => void
}

export interface DishesTableProps {
    dishes: Dish[]
    setSelectedDish: (dish: Dish) => void
    onDelete: () => void
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