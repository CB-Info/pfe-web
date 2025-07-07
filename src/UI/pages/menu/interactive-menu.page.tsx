import React, { useState, useEffect, useMemo } from 'react';
import { BaseContent } from '../../components/contents/base.content';
import { DishesRepositoryImpl } from '../../../network/repositories/dishes.repository';
import { useAlerts } from '../../../contexts/alerts.context';
import { Dish } from '../../../data/models/dish.model';
import { DishCategory, DishCategoryLabels } from '../../../data/dto/dish.dto';
import { MenuHeader } from '../../components/menu/menu-header.component';
import { CategoryNavigation } from '../../components/menu/category-navigation.component';
import { DishGrid } from '../../components/menu/dish-grid.component';
import { DishDetailModal } from '../../components/menu/dish-detail-modal.component';
import { MenuFilters } from '../../components/menu/menu-filters.component';
import { motion, AnimatePresence } from 'framer-motion';
import { CircularProgress } from '@mui/material';

export interface MenuFilters {
  searchQuery: string;
  priceRange: [number, number];
  showOnlyAvailable: boolean;
  sortBy: 'name' | 'price' | 'category';
  sortOrder: 'asc' | 'desc';
}

export default function InteractiveMenuPage() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<DishCategory | 'ALL'>('ALL');
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<MenuFilters>({
    searchQuery: '',
    priceRange: [0, 100],
    showOnlyAvailable: false,
    sortBy: 'name',
    sortOrder: 'asc'
  });

  const { addAlert } = useAlerts();
  const dishesRepository = new DishesRepositoryImpl();

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        setIsLoading(true);
        const fetchedDishes = await dishesRepository.getAll();
        setDishes(fetchedDishes);
        
        // Set initial price range based on actual dish prices
        const prices = fetchedDishes.map(dish => dish.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        setFilters(prev => ({
          ...prev,
          priceRange: [minPrice, maxPrice]
        }));
      } catch (error) {
        addAlert({
          severity: 'error',
          message: "Erreur lors du chargement de la carte",
          timeout: 5
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDishes();
  }, []);

  // Get unique categories from dishes
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(dishes.map(dish => dish.category)));
    return uniqueCategories.sort();
  }, [dishes]);

  // Filter and sort dishes
  const filteredDishes = useMemo(() => {
    let filtered = dishes.filter(dish => {
      // Category filter
      if (activeCategory !== 'ALL' && dish.category !== activeCategory) {
        return false;
      }

      // Search filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        if (!dish.name.toLowerCase().includes(query) && 
            !dish.description.toLowerCase().includes(query)) {
          return false;
        }
      }

      // Price range filter
      if (dish.price < filters.priceRange[0] || dish.price > filters.priceRange[1]) {
        return false;
      }

      // Availability filter
      if (filters.showOnlyAvailable && !dish.isAvailable) {
        return false;
      }

      return true;
    });

    // Sort dishes
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (filters.sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
      }

      return filters.sortOrder === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [dishes, activeCategory, filters]);

  // Calculate category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<DishCategory | 'ALL', number> = { 'ALL': filteredDishes.length };
    
    categories.forEach(category => {
      counts[category] = filteredDishes.filter(dish => dish.category === category).length;
    });

    return counts;
  }, [filteredDishes, categories]);

  const handleDishClick = (dish: Dish) => {
    setSelectedDish(dish);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedDish(null);
  };

  const handleCategoryChange = (category: DishCategory | 'ALL') => {
    setActiveCategory(category);
    // Smooth scroll to dishes section
    const dishesSection = document.getElementById('dishes-section');
    if (dishesSection) {
      dishesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <BaseContent>
        <div className="flex flex-1 items-center justify-center min-h-screen">
          <div className="text-center">
            <CircularProgress size={48} className="mb-4" />
            <p className="text-gray-600 text-lg">Chargement de la carte...</p>
          </div>
        </div>
      </BaseContent>
    );
  }

  return (
    <BaseContent>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        {/* Header */}
        <MenuHeader
          totalDishes={dishes.length}
          filteredCount={filteredDishes.length}
          onToggleFilters={() => setIsFiltersOpen(!isFiltersOpen)}
          isFiltersOpen={isFiltersOpen}
        />

        {/* Filters Panel */}
        <AnimatePresence>
          {isFiltersOpen && (
            <MenuFilters
              filters={filters}
              onFiltersChange={setFilters}
              onClose={() => setIsFiltersOpen(false)}
              dishes={dishes}
            />
          )}
        </AnimatePresence>

        {/* Category Navigation */}
        <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200">
          <CategoryNavigation
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
            categoryCounts={categoryCounts}
          />
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div id="dishes-section">
            {filteredDishes.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  Aucun plat trouvé
                </h3>
                <p className="text-gray-600 mb-6">
                  Essayez de modifier vos critères de recherche ou de filtrage
                </p>
                <button
                  onClick={() => {
                    setFilters({
                      searchQuery: '',
                      priceRange: [0, 100],
                      showOnlyAvailable: false,
                      sortBy: 'name',
                      sortOrder: 'asc'
                    });
                    setActiveCategory('ALL');
                  }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                >
                  Réinitialiser les filtres
                </button>
              </motion.div>
            ) : (
              <DishGrid
                dishes={filteredDishes}
                onDishClick={handleDishClick}
                activeCategory={activeCategory}
              />
            )}
          </div>
        </div>

        {/* Dish Detail Modal */}
        <DishDetailModal
          dish={selectedDish}
          isOpen={isDetailModalOpen}
          onClose={handleCloseDetailModal}
        />
      </div>
    </BaseContent>
  );
}