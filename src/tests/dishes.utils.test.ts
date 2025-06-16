import { describe, it, expect } from 'vitest';
import { sortDishes } from '../UI/pages/dishes/utils/sortDishes';
import { filterDishes } from '../UI/pages/dishes/utils/filterDishes';
import { Dish } from '../data/models/dish.model';
import { DishCategory } from '../data/dto/dish.dto';

const dishes: Dish[] = [
  new Dish('1', 'Burger', [], 12, 'desc', DishCategory.MAIN_DISHES, '2024-01-01T00:00:00Z', true),
  new Dish('2', 'Apple Pie', [], 8, 'desc', DishCategory.DESSERTS, '2024-03-01T00:00:00Z', false),
  new Dish('3', 'Caesar', [], 10, 'desc', DishCategory.SALADS, '2023-12-01T00:00:00Z', true)
];

describe('sortDishes', () => {
  it('sorts by name ascending', () => {
    const result = sortDishes(dishes, 'Nom (Ascendant)');
    expect(result[0].name).toBe('Apple Pie');
    expect(result[2].name).toBe('Caesar');
  });

  it('sorts by price descending', () => {
    const result = sortDishes(dishes, 'Prix (Descendant)');
    expect(result[0].price).toBe(12);
    expect(result[2].price).toBe(8);
  });

  it('sorts by creation date ascending', () => {
    const result = sortDishes(dishes, 'Date de création (Ascendant)');
    expect(result[0].dateOfCreation).toBe('2023-12-01T00:00:00Z');
    expect(result[2].dateOfCreation).toBe('2024-03-01T00:00:00Z');
  });
});

describe('filterDishes', () => {
  it('filters by search query and category and status', () => {
    const result = filterDishes(dishes, {
      searchQuery: 'a',
      selectedCategory: DishCategory.DESSERTS,
      selectedStatus: 'Inactif'
    });
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('Apple Pie');
  });
});
