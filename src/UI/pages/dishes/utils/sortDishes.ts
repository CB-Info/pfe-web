export type DishSortOption =
  | 'Nom (Ascendant)'
  | 'Nom (Descendant)'
  | 'Prix (Ascendant)'
  | 'Prix (Descendant)'
  | 'Date de création (Ascendant)'
  | 'Date de création (Descendant)';

import { Dish } from '../../../../data/models/dish.model';

export function sortDishes(dishes: Dish[], option: DishSortOption): Dish[] {
  const copy = [...dishes];
  switch (option) {
    case 'Nom (Ascendant)':
      return copy.sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
      );
    case 'Nom (Descendant)':
      return copy.sort((a, b) =>
        b.name.localeCompare(a.name, undefined, { sensitivity: 'base' })
      );
    case 'Prix (Ascendant)':
      return copy.sort((a, b) => a.price - b.price);
    case 'Prix (Descendant)':
      return copy.sort((a, b) => b.price - a.price);
    case 'Date de création (Ascendant)':
      return copy.sort(
        (a, b) => new Date(a.dateOfCreation).getTime() - new Date(b.dateOfCreation).getTime()
      );
    case 'Date de création (Descendant)':
      return copy.sort(
        (a, b) => new Date(b.dateOfCreation).getTime() - new Date(a.dateOfCreation).getTime()
      );
    default:
      return copy;
  }
}
