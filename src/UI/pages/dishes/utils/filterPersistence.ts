import { DishCategory } from '../../../../data/dto/dish.dto';

export interface DishFilters {
  searchQuery: string;
  selectedCategory: DishCategory | 'Toutes';
  selectedStatus: 'Tous' | 'Actif' | 'Inactif';
  selectedSort: string;
}

const STORAGE_KEY = 'dishes_filters_state';

export class FilterPersistenceManager {
  private static instance: FilterPersistenceManager;

  private constructor() {}

  public static getInstance(): FilterPersistenceManager {
    if (!FilterPersistenceManager.instance) {
      FilterPersistenceManager.instance = new FilterPersistenceManager();
    }
    return FilterPersistenceManager.instance;
  }

  /**
   * Sauvegarde les filtres dans le localStorage
   */
  saveFilters(filters: DishFilters): void {
    try {
      const filtersToSave = {
        ...filters,
        timestamp: Date.now()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtersToSave));
    } catch (error) {
      console.warn('Impossible de sauvegarder les filtres:', error);
    }
  }

  /**
   * Récupère les filtres depuis le localStorage
   */
  loadFilters(): DishFilters | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;

      const parsed = JSON.parse(stored);
      
      // Vérifier que les données ne sont pas trop anciennes (24h)
      const maxAge = 24 * 60 * 60 * 1000; // 24 heures
      if (parsed.timestamp && (Date.now() - parsed.timestamp) > maxAge) {
        this.clearFilters();
        return null;
      }

      // Valider la structure des données
      if (this.isValidFilters(parsed)) {
        return {
          searchQuery: parsed.searchQuery || '',
          selectedCategory: parsed.selectedCategory || 'Toutes',
          selectedStatus: parsed.selectedStatus || 'Tous',
          selectedSort: parsed.selectedSort || 'Date de création (Descendant)'
        };
      }

      return null;
    } catch (error) {
      console.warn('Impossible de charger les filtres:', error);
      this.clearFilters();
      return null;
    }
  }

  /**
   * Supprime les filtres du localStorage
   */
  clearFilters(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn('Impossible de supprimer les filtres:', error);
    }
  }

  /**
   * Valide la structure des filtres
   */
  private isValidFilters(filters: any): boolean {
    return (
      typeof filters === 'object' &&
      filters !== null &&
      typeof filters.searchQuery === 'string' &&
      (typeof filters.selectedCategory === 'string') &&
      (typeof filters.selectedStatus === 'string') &&
      (typeof filters.selectedSort === 'string')
    );
  }

  /**
   * Obtient les filtres par défaut
   */
  getDefaultFilters(): DishFilters {
    return {
      searchQuery: '',
      selectedCategory: 'Toutes',
      selectedStatus: 'Tous',
      selectedSort: 'Date de création (Descendant)'
    };
  }
}