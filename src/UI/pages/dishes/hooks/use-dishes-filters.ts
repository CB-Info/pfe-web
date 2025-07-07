import { useState, useEffect, useCallback } from 'react';
import { DishCategory } from '../../../../data/dto/dish.dto';

export interface DishFilters {
  searchQuery: string;
  selectedCategory: DishCategory | 'Toutes';
  selectedStatus: 'Tous' | 'Actif' | 'Inactif';
  selectedSort: DishSortOption;
}

export type DishSortOption =
  | 'Date de création (Descendant)'
  | 'Date de création (Ascendant)'
  | 'Nom (Ascendant)'
  | 'Nom (Descendant)'
  | 'Prix (Ascendant)'
  | 'Prix (Descendant)';

const STORAGE_KEY = 'dishes-filters';

const defaultFilters: DishFilters = {
  searchQuery: '',
  selectedCategory: 'Toutes',
  selectedStatus: 'Tous',
  selectedSort: 'Date de création (Descendant)'
};

export const useDishesFilters = () => {
  const [filters, setFilters] = useState<DishFilters>(defaultFilters);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load filters from localStorage on mount
  useEffect(() => {
    try {
      const savedFilters = localStorage.getItem(STORAGE_KEY);
      if (savedFilters) {
        const parsedFilters = JSON.parse(savedFilters) as DishFilters;
        // Validate the loaded filters structure
        if (isValidFilters(parsedFilters)) {
          setFilters(parsedFilters);
        }
      }
    } catch (error) {
      console.warn('Failed to load saved filters:', error);
      // If loading fails, use default filters
      setFilters(defaultFilters);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save filters to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
      } catch (error) {
        console.warn('Failed to save filters:', error);
      }
    }
  }, [filters, isLoaded]);

  const updateFilter = useCallback(<K extends keyof DishFilters>(
    key: K,
    value: DishFilters[K]
  ) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const updateFilters = useCallback((newFilters: Partial<DishFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const clearStorage = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setFilters(defaultFilters);
    } catch (error) {
      console.warn('Failed to clear filter storage:', error);
    }
  }, []);

  return {
    filters,
    isLoaded,
    updateFilter,
    updateFilters,
    resetFilters,
    clearStorage
  };
};

// Utility function to validate filter structure
function isValidFilters(filters: any): filters is DishFilters {
  return (
    typeof filters === 'object' &&
    filters !== null &&
    typeof filters.searchQuery === 'string' &&
    (typeof filters.selectedCategory === 'string') &&
    (filters.selectedStatus === 'Tous' || filters.selectedStatus === 'Actif' || filters.selectedStatus === 'Inactif') &&
    typeof filters.selectedSort === 'string'
  );
}