import { Dish } from '../../../../data/models/dish.model';
import { DishCategory } from '../../../../data/dto/dish.dto';

export interface FilterOptions {
  searchQuery: string;
  selectedCategory: DishCategory | 'Toutes';
  selectedStatus: 'Tous' | 'Actif' | 'Inactif';
}

export function filterDishes(dishes: Dish[], options: FilterOptions): Dish[] {
  let result = [...dishes];
  const { searchQuery, selectedCategory, selectedStatus } = options;

  if (searchQuery) {
    const lower = searchQuery.toLowerCase();
    result = result.filter(
      (dish) =>
        dish.name.toLowerCase().includes(lower) ||
        dish.description.toLowerCase().includes(lower)
    );
  }

  if (selectedCategory !== 'Toutes') {
    result = result.filter((dish) => dish.category === selectedCategory);
  }

  if (selectedStatus !== 'Tous') {
    const isActive = selectedStatus === 'Actif';
    result = result.filter((dish) => dish.isAvailable === isActive);
  }

  return result;
}
