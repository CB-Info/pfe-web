import { useState, useEffect, useCallback } from 'react';
import { DishCategory } from '../../../../data/dto/dish.dto';
import { DishSortOption } from '../utils/sortDishes';
import { FilterPersistenceManager, DishFilters } from '../utils/filterPersistence';

export interface UseDishFiltersReturn {
  searchQuery: string;
  selectedCategory: DishCategory | 'Toutes';
  selectedStatus: 'Tous' | 'Actif' | 'Inactif';
  selectedSort: DishSortOption;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: DishCategory | 'Toutes') => void;
  setSelectedStatus: (status: 'Tous' | 'Actif' | 'Inactif') => void;
  setSelectedSort: (sort: DishSortOption) => void;
  resetFilters: () => void;
  hasActiveFilters: boolean;
}

export const useDishFilters = (): UseDishFiltersReturn => {
  const persistenceManager = FilterPersistenceManager.getInstance();
  
  // Initialiser avec les filtres sauvegardés ou les valeurs par défaut
  const [filters, setFilters] = useState<DishFilters>(() => {
    const savedFilters = persistenceManager.loadFilters();
    return savedFilters || persistenceManager.getDefaultFilters();
  });

  // Sauvegarder automatiquement les filtres quand ils changent
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      persistenceManager.saveFilters(filters);
    }, 300); // Debounce de 300ms pour éviter trop de sauvegardes

    return () => clearTimeout(timeoutId);
  }, [filters, persistenceManager]);

  // Fonctions de mise à jour des filtres
  const setSearchQuery = useCallback((searchQuery: string) => {
    setFilters(prev => ({ ...prev, searchQuery }));
  }, []);

  const setSelectedCategory = useCallback((selectedCategory: DishCategory | 'Toutes') => {
    setFilters(prev => ({ ...prev, selectedCategory }));
  }, []);

  const setSelectedStatus = useCallback((selectedStatus: 'Tous' | 'Actif' | 'Inactif') => {
    setFilters(prev => ({ ...prev, selectedStatus }));
  }, []);

  const setSelectedSort = useCallback((selectedSort: DishSortOption) => {
    setFilters(prev => ({ ...prev, selectedSort }));
  }, []);

  // Réinitialiser les filtres
  const resetFilters = useCallback(() => {
    const defaultFilters = persistenceManager.getDefaultFilters();
    setFilters(defaultFilters);
    persistenceManager.clearFilters();
  }, [persistenceManager]);

  // Vérifier s'il y a des filtres actifs
  const hasActiveFilters = useCallback(() => {
    const defaultFilters = persistenceManager.getDefaultFilters();
    return (
      filters.searchQuery !== defaultFilters.searchQuery ||
      filters.selectedCategory !== defaultFilters.selectedCategory ||
      filters.selectedStatus !== defaultFilters.selectedStatus ||
      filters.selectedSort !== defaultFilters.selectedSort
    );
  }, [filters, persistenceManager]);

  return {
    searchQuery: filters.searchQuery,
    selectedCategory: filters.selectedCategory,
    selectedStatus: filters.selectedStatus,
    selectedSort: filters.selectedSort as DishSortOption,
    setSearchQuery,
    setSelectedCategory,
    setSelectedStatus,
    setSelectedSort,
    resetFilters,
    hasActiveFilters: hasActiveFilters()
  };
};