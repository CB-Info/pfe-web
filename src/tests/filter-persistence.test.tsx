import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { FilterPersistenceManager } from '../UI/pages/dishes/utils/filterPersistence';

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

describe('FilterPersistenceManager', () => {
  let manager: FilterPersistenceManager;

  beforeEach(() => {
    manager = FilterPersistenceManager.getInstance();
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('should be a singleton', () => {
    const manager1 = FilterPersistenceManager.getInstance();
    const manager2 = FilterPersistenceManager.getInstance();
    expect(manager1).toBe(manager2);
  });

  test('should save filters to localStorage', () => {
    const filters = {
      searchQuery: 'test',
      selectedCategory: 'MAIN_DISHES' as const,
      selectedStatus: 'Actif' as const,
      selectedSort: 'Nom (Ascendant)'
    };

    manager.saveFilters(filters);

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'dishes_filters_state',
      expect.stringContaining('"searchQuery":"test"')
    );
  });

  test('should load filters from localStorage', () => {
    const savedFilters = {
      searchQuery: 'test',
      selectedCategory: 'MAIN_DISHES',
      selectedStatus: 'Actif',
      selectedSort: 'Nom (Ascendant)',
      timestamp: Date.now()
    };

    localStorageMock.getItem.mockReturnValue(JSON.stringify(savedFilters));

    const loaded = manager.loadFilters();

    expect(loaded).toEqual({
      searchQuery: 'test',
      selectedCategory: 'MAIN_DISHES',
      selectedStatus: 'Actif',
      selectedSort: 'Nom (Ascendant)'
    });
  });

  test('should return null for expired filters', () => {
    const expiredFilters = {
      searchQuery: 'test',
      selectedCategory: 'MAIN_DISHES',
      selectedStatus: 'Actif',
      selectedSort: 'Nom (Ascendant)',
      timestamp: Date.now() - (25 * 60 * 60 * 1000) // 25 heures
    };

    localStorageMock.getItem.mockReturnValue(JSON.stringify(expiredFilters));

    const loaded = manager.loadFilters();

    expect(loaded).toBeNull();
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('dishes_filters_state');
  });

  test('should return null for invalid filters', () => {
    localStorageMock.getItem.mockReturnValue('invalid json');

    const loaded = manager.loadFilters();

    expect(loaded).toBeNull();
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('dishes_filters_state');
  });

  test('should clear filters from localStorage', () => {
    manager.clearFilters();

    expect(localStorageMock.removeItem).toHaveBeenCalledWith('dishes_filters_state');
  });

  test('should return default filters', () => {
    const defaultFilters = manager.getDefaultFilters();

    expect(defaultFilters).toEqual({
      searchQuery: '',
      selectedCategory: 'Toutes',
      selectedStatus: 'Tous',
      selectedSort: 'Date de création (Descendant)'
    });
  });

  test('should handle localStorage errors gracefully', () => {
    localStorageMock.setItem.mockImplementation(() => {
      throw new Error('Storage quota exceeded');
    });

    // Should not throw
    expect(() => {
      manager.saveFilters({
        searchQuery: 'test',
        selectedCategory: 'MAIN_DISHES',
        selectedStatus: 'Actif',
        selectedSort: 'Nom (Ascendant)'
      });
    }).not.toThrow();
  });
});