import { renderHook, act } from '@testing-library/react';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import { useDishFilters } from '../UI/pages/dishes/hooks/useDishFilters';

// Mock FilterPersistenceManager
vi.mock('../UI/pages/dishes/utils/filterPersistence', () => ({
  FilterPersistenceManager: {
    getInstance: () => ({
      loadFilters: vi.fn(() => null),
      saveFilters: vi.fn(),
      clearFilters: vi.fn(),
      getDefaultFilters: () => ({
        searchQuery: '',
        selectedCategory: 'Toutes',
        selectedStatus: 'Tous',
        selectedSort: 'Date de création (Descendant)'
      })
    })
  }
}));

describe('useDishFilters', () => {
  beforeEach(() => {
    vi.clearAllTimers();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('should initialize with default filters', () => {
    const { result } = renderHook(() => useDishFilters());

    expect(result.current.searchQuery).toBe('');
    expect(result.current.selectedCategory).toBe('Toutes');
    expect(result.current.selectedStatus).toBe('Tous');
    expect(result.current.selectedSort).toBe('Date de création (Descendant)');
    expect(result.current.hasActiveFilters).toBe(false);
  });

  test('should update search query', () => {
    const { result } = renderHook(() => useDishFilters());

    act(() => {
      result.current.setSearchQuery('test');
    });

    expect(result.current.searchQuery).toBe('test');
    expect(result.current.hasActiveFilters).toBe(true);
  });

  test('should update selected category', () => {
    const { result } = renderHook(() => useDishFilters());

    act(() => {
      result.current.setSelectedCategory('MAIN_DISHES');
    });

    expect(result.current.selectedCategory).toBe('MAIN_DISHES');
    expect(result.current.hasActiveFilters).toBe(true);
  });

  test('should update selected status', () => {
    const { result } = renderHook(() => useDishFilters());

    act(() => {
      result.current.setSelectedStatus('Actif');
    });

    expect(result.current.selectedStatus).toBe('Actif');
    expect(result.current.hasActiveFilters).toBe(true);
  });

  test('should update selected sort', () => {
    const { result } = renderHook(() => useDishFilters());

    act(() => {
      result.current.setSelectedSort('Nom (Ascendant)');
    });

    expect(result.current.selectedSort).toBe('Nom (Ascendant)');
    expect(result.current.hasActiveFilters).toBe(true);
  });

  test('should reset filters to default', () => {
    const { result } = renderHook(() => useDishFilters());

    // Set some filters
    act(() => {
      result.current.setSearchQuery('test');
      result.current.setSelectedCategory('MAIN_DISHES');
      result.current.setSelectedStatus('Actif');
    });

    expect(result.current.hasActiveFilters).toBe(true);

    // Reset filters
    act(() => {
      result.current.resetFilters();
    });

    expect(result.current.searchQuery).toBe('');
    expect(result.current.selectedCategory).toBe('Toutes');
    expect(result.current.selectedStatus).toBe('Tous');
    expect(result.current.hasActiveFilters).toBe(false);
  });

  test('should detect active filters correctly', () => {
    const { result } = renderHook(() => useDishFilters());

    // Initially no active filters
    expect(result.current.hasActiveFilters).toBe(false);

    // Set search query
    act(() => {
      result.current.setSearchQuery('test');
    });
    expect(result.current.hasActiveFilters).toBe(true);

    // Reset and set category
    act(() => {
      result.current.resetFilters();
      result.current.setSelectedCategory('MAIN_DISHES');
    });
    expect(result.current.hasActiveFilters).toBe(true);

    // Reset and set status
    act(() => {
      result.current.resetFilters();
      result.current.setSelectedStatus('Actif');
    });
    expect(result.current.hasActiveFilters).toBe(true);

    // Reset and set sort
    act(() => {
      result.current.resetFilters();
      result.current.setSelectedSort('Nom (Ascendant)');
    });
    expect(result.current.hasActiveFilters).toBe(true);
  });

  test('should debounce filter persistence', () => {
    const { result } = renderHook(() => useDishFilters());

    act(() => {
      result.current.setSearchQuery('test');
    });

    // Should not save immediately
    expect(vi.getTimerCount()).toBe(1);

    // Fast forward time to trigger debounced save
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(vi.getTimerCount()).toBe(0);
  });
});