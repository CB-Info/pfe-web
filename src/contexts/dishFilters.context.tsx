import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { DishCategory, DishCategoryLabels } from '../data/dto/dish.dto';
import { useAlerts } from './alerts.context';

export type DishSortOption =
  | 'Date de création (Descendant)'
  | 'Date de création (Ascendant)'
  | 'Nom (Ascendant)'
  | 'Nom (Descendant)'
  | 'Prix (Ascendant)'
  | 'Prix (Descendant)';

export interface DishFilterState {
  searchQuery: string;
  selectedCategory: DishCategory | 'Toutes';
  selectedStatus: 'Tous' | 'Actif' | 'Inactif';
  selectedSort: DishSortOption;
}

interface DishFilterContextType {
  filters: DishFilterState;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: DishCategory | 'Toutes') => void;
  setSelectedStatus: (status: 'Tous' | 'Actif' | 'Inactif') => void;
  setSelectedSort: (sort: DishSortOption) => void;
  resetFilters: () => void;
}

const defaultFilters: DishFilterState = {
  searchQuery: '',
  selectedCategory: 'Toutes',
  selectedStatus: 'Tous',
  selectedSort: 'Date de création (Descendant)',
};

const DishFilterContext = createContext<DishFilterContextType | undefined>(undefined);

export const useDishFilters = () => {
  const context = useContext(DishFilterContext);
  if (context === undefined) {
    throw new Error('useDishFilters must be used within a DishFilterProvider');
  }
  return context;
};

interface DishFilterProviderProps {
  children: ReactNode;
}

export const DishFilterProvider: React.FC<DishFilterProviderProps> = ({ children }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addAlert } = useAlerts();
  const [filters, setFilters] = useState<DishFilterState>(defaultFilters);

  // Validation functions
  const isValidCategory = (category: string): category is DishCategory | 'Toutes' => {
    return category === 'Toutes' || Object.keys(DishCategoryLabels).includes(category as DishCategory);
  };

  const isValidStatus = (status: string): status is 'Tous' | 'Actif' | 'Inactif' => {
    return ['Tous', 'Actif', 'Inactif'].includes(status);
  };

  const isValidSort = (sort: string): sort is DishSortOption => {
    const validSorts: DishSortOption[] = [
      'Date de création (Descendant)',
      'Date de création (Ascendant)',
      'Nom (Ascendant)',
      'Nom (Descendant)',
      'Prix (Ascendant)',
      'Prix (Descendant)',
    ];
    return validSorts.includes(sort as DishSortOption);
  };

  // Load filters from URL on mount
  useEffect(() => {
    try {
      const urlSearchQuery = searchParams.get('search') || '';
      const urlCategory = searchParams.get('category') || 'Toutes';
      const urlStatus = searchParams.get('status') || 'Tous';
      const urlSort = searchParams.get('sort') || 'Date de création (Descendant)';

      let hasInvalidParams = false;
      const newFilters: DishFilterState = { ...defaultFilters };

      // Validate and set search query
      newFilters.searchQuery = urlSearchQuery;

      // Validate and set category
      if (isValidCategory(urlCategory)) {
        newFilters.selectedCategory = urlCategory;
      } else if (urlCategory !== 'Toutes') {
        hasInvalidParams = true;
      }

      // Validate and set status
      if (isValidStatus(urlStatus)) {
        newFilters.selectedStatus = urlStatus;
      } else if (urlStatus !== 'Tous') {
        hasInvalidParams = true;
      }

      // Validate and set sort
      if (isValidSort(urlSort)) {
        newFilters.selectedSort = urlSort;
      } else if (urlSort !== 'Date de création (Descendant)') {
        hasInvalidParams = true;
      }

      setFilters(newFilters);

      // Show alert if invalid parameters were found
      if (hasInvalidParams) {
        addAlert({
          severity: 'warning',
          message: 'Certains paramètres de filtrage étaient invalides et ont été réinitialisés',
          timeout: 5,
        });
      }
    } catch (error) {
      console.error('Error loading filters from URL:', error);
      setFilters(defaultFilters);
      addAlert({
        severity: 'error',
        message: 'Erreur lors du chargement des filtres depuis l\'URL',
        timeout: 5,
      });
    }
  }, [searchParams, addAlert]);

  // Sync filters to URL
  useEffect(() => {
    try {
      const newSearchParams = new URLSearchParams();

      // Only add non-default values to URL
      if (filters.searchQuery) {
        newSearchParams.set('search', filters.searchQuery);
      }
      if (filters.selectedCategory !== 'Toutes') {
        newSearchParams.set('category', filters.selectedCategory);
      }
      if (filters.selectedStatus !== 'Tous') {
        newSearchParams.set('status', filters.selectedStatus);
      }
      if (filters.selectedSort !== 'Date de création (Descendant)') {
        newSearchParams.set('sort', filters.selectedSort);
      }

      // Update URL without adding to history
      navigate(`?${newSearchParams.toString()}`, { replace: true });
    } catch (error) {
      console.error('Error syncing filters to URL:', error);
      addAlert({
        severity: 'error',
        message: 'Erreur lors de la synchronisation des filtres avec l\'URL',
        timeout: 5,
      });
    }
  }, [filters, navigate, addAlert]);

  const setSearchQuery = (query: string) => {
    setFilters(prev => ({ ...prev, searchQuery: query }));
  };

  const setSelectedCategory = (category: DishCategory | 'Toutes') => {
    setFilters(prev => ({ ...prev, selectedCategory: category }));
  };

  const setSelectedStatus = (status: 'Tous' | 'Actif' | 'Inactif') => {
    setFilters(prev => ({ ...prev, selectedStatus: status }));
  };

  const setSelectedSort = (sort: DishSortOption) => {
    setFilters(prev => ({ ...prev, selectedSort: sort }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  const value: DishFilterContextType = {
    filters,
    setSearchQuery,
    setSelectedCategory,
    setSelectedStatus,
    setSelectedSort,
    resetFilters,
  };

  return (
    <DishFilterContext.Provider value={value}>
      {children}
    </DishFilterContext.Provider>
  );
};