import { renderHook, act } from '@testing-library/react';
import { useDishesFilters } from '../UI/pages/dishes/hooks/use-dishes-filters';
import { describe, test, expect, beforeEach, vi } from 'vitest';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('useDishesFilters Hook', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    localStorageMock.clear.mockClear();
  });

  test('should initialize with default filters when no saved data', () => {
    localStorageMock.getItem.mockReturnValue(null);

    const { result } = renderHook(() => useDishesFilters());

    expect(result.current.filters).toEqual({
      searchQuery: '',
      selectedCategory: 'Toutes',
      selectedStatus: 'Tous',
      selectedSort: 'Date de création (Descendant)'
    });
    expect(result.current.isLoaded).toBe(true);
  });

  test('should load saved filters from localStorage', () => {
    const savedFilters = {
      searchQuery: 'pizza',
      selectedCategory: 'MAIN_DISHES',
      selectedStatus: 'Actif',
      selectedSort: 'Nom (Ascendant)'
    };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(savedFilters));

    const { result } = renderHook(() => useDishesFilters());

    expect(result.current.filters).toEqual(savedFilters);
    expect(localStorageMock.getItem).toHaveBeenCalledWith('dishes-filters');
  });

  test('should save filters to localStorage when updated', () => {
    localStorageMock.getItem.mockReturnValue(null);

    const { result } = renderHook(() => useDishesFilters());

    act(() => {
      result.current.updateFilter('searchQuery', 'burger');
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'dishes-filters',
      JSON.stringify({
        searchQuery: 'burger',
        selectedCategory: 'Toutes',
        selectedStatus: 'Tous',
        selectedSort: 'Date de création (Descendant)'
      })
    );
  });

  test('should update multiple filters at once', () => {
    localStorageMock.getItem.mockReturnValue(null);

    const { result } = renderHook(() => useDishesFilters());

    act(() => {
      result.current.updateFilters({
        searchQuery: 'pasta',
        selectedCategory: 'PASTA_RICE',
        selectedStatus: 'Actif'
      });
    });

    expect(result.current.filters).toEqual({
      searchQuery: 'pasta',
      selectedCategory: 'PASTA_RICE',
      selectedStatus: 'Actif',
      selectedSort: 'Date de création (Descendant)'
    });
  });

  test('should reset filters to default values', () => {
    const savedFilters = {
      searchQuery: 'pizza',
      selectedCategory: 'MAIN_DISHES',
      selectedStatus: 'Actif',
      selectedSort: 'Nom (Ascendant)'
    };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(savedFilters));

    const { result } = renderHook(() => useDishesFilters());

    act(() => {
      result.current.resetFilters();
    });

    expect(result.current.filters).toEqual({
      searchQuery: '',
      selectedCategory: 'Toutes',
      selectedStatus: 'Tous',
      selectedSort: 'Date de création (Descendant)'
    });
  });

  test('should clear localStorage and reset filters', () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify({
      searchQuery: 'test',
      selectedCategory: 'DESSERTS',
      selectedStatus: 'Inactif',
      selectedSort: 'Prix (Ascendant)'
    }));

    const { result } = renderHook(() => useDishesFilters());

    act(() => {
      result.current.clearStorage();
    });

    expect(localStorageMock.removeItem).toHaveBeenCalledWith('dishes-filters');
    expect(result.current.filters).toEqual({
      searchQuery: '',
      selectedCategory: 'Toutes',
      selectedStatus: 'Tous',
      selectedSort: 'Date de création (Descendant)'
    });
  });

  test('should handle corrupted localStorage data gracefully', () => {
    localStorageMock.getItem.mockReturnValue('invalid-json');
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const { result } = renderHook(() => useDishesFilters());

    expect(result.current.filters).toEqual({
      searchQuery: '',
      selectedCategory: 'Toutes',
      selectedStatus: 'Tous',
      selectedSort: 'Date de création (Descendant)'
    });
    expect(consoleSpy).toHaveBeenCalledWith('Failed to load saved filters:', expect.any(Error));

    consoleSpy.mockRestore();
  });

  test('should validate filter structure and fallback to defaults for invalid data', () => {
    const invalidFilters = {
      searchQuery: 123, // Invalid type
      selectedCategory: 'INVALID_CATEGORY',
      selectedStatus: 'InvalidStatus',
      selectedSort: null
    };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(invalidFilters));

    const { result } = renderHook(() => useDishesFilters());

    expect(result.current.filters).toEqual({
      searchQuery: '',
      selectedCategory: 'Toutes',
      selectedStatus: 'Tous',
      selectedSort: 'Date de création (Descendant)'
    });
  });
});