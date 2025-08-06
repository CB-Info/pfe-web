import React, { useState, useMemo } from 'react';
import { Dish } from '../../../../data/models/dish.model';
import { DishCategory } from '../../../../data/dto/dish.dto';
import { SearchInput } from '../../input/searchInput';
import { CategoryTabs } from './category-tabs.component';
import { DishCard } from './dish-card.component';
import { SelectionSummary } from './selection-summary.component';
import { DishPreviewModal } from './dish-preview-modal.component';
import { AnimatePresence } from 'framer-motion';
import { Filter, Grid, List, RotateCcw } from 'lucide-react';

interface EnhancedDishSelectionProps {
  dishes: Dish[];
  selectedDishIds: Set<string>;
  onSelectionChange: (selectedIds: Set<string>) => void;
  isLoading?: boolean;
}

type SortOption = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'category';
type ViewMode = 'grid' | 'list';

export const EnhancedDishSelection: React.FC<EnhancedDishSelectionProps> = ({
  dishes,
  selectedDishIds,
  onSelectionChange,
  isLoading = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<DishCategory | 'ALL'>('ALL');
  const [sortOption, setSortOption] = useState<SortOption>('name-asc');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);
  const [previewDish, setPreviewDish] = useState<Dish | null>(null);
  const [summaryCollapsed, setSummaryCollapsed] = useState(false);

  // Reset filters function
  const resetFilters = () => {
    setSearchQuery('');
    setActiveCategory('ALL');
    setSortOption('name-asc');
    setShowOnlyAvailable(false);
  };

  // Get unique categories from dishes
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(dishes.map(dish => dish.category)));
    return uniqueCategories.sort();
  }, [dishes]);

  // Filter and sort dishes
  const filteredAndSortedDishes = useMemo(() => {
    const filtered = dishes.filter(dish => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!dish.name.toLowerCase().includes(query) && 
            !dish.description.toLowerCase().includes(query)) {
          return false;
        }
      }

      // Category filter
      if (activeCategory !== 'ALL' && dish.category !== activeCategory) {
        return false;
      }

      // Availability filter
      if (showOnlyAvailable && !dish.isAvailable) {
        return false;
      }

      return true;
    });

    // Sort dishes
    filtered.sort((a, b) => {
      switch (sortOption) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

    return filtered;
  }, [dishes, searchQuery, activeCategory, sortOption, showOnlyAvailable]);

  // Calculate counts for categories
  const dishCounts = useMemo(() => {
    const counts: Record<DishCategory | 'ALL', number> = { 'ALL': dishes.length } as Record<DishCategory | 'ALL', number>;
    
    categories.forEach(category => {
      counts[category] = dishes.filter(dish => dish.category === category).length;
    });

    return counts;
  }, [dishes, categories]);

  // Calculate selected counts for categories
  const selectedCounts = useMemo(() => {
    const selectedDishes = dishes.filter(dish => selectedDishIds.has(dish._id));
    const counts: Record<DishCategory | 'ALL', number> = { 'ALL': selectedDishes.length } as Record<DishCategory | 'ALL', number>;
    
    categories.forEach(category => {
      counts[category] = selectedDishes.filter(dish => dish.category === category).length;
    });

    return counts;
  }, [dishes, selectedDishIds, categories]);

  // Get selected dishes for summary
  const selectedDishes = useMemo(() => {
    return dishes.filter(dish => selectedDishIds.has(dish._id));
  }, [dishes, selectedDishIds]);

  const handleDishToggle = (dishId: string) => {
    const newSelection = new Set(selectedDishIds);
    if (newSelection.has(dishId)) {
      newSelection.delete(dishId);
    } else {
      newSelection.add(dishId);
    }
    onSelectionChange(newSelection);
  };

  const handleRemoveDish = (dishId: string) => {
    const newSelection = new Set(selectedDishIds);
    newSelection.delete(dishId);
    onSelectionChange(newSelection);
  };

  const handleSelectAll = () => {
    const newSelection = new Set(selectedDishIds);
    
    // Check if all filtered dishes are selected
    const allSelected = filteredAndSortedDishes.every(dish => selectedDishIds.has(dish._id));
    
    if (allSelected) {
      // Deselect all filtered dishes
      filteredAndSortedDishes.forEach(dish => newSelection.delete(dish._id));
    } else {
      // Select all filtered dishes
      filteredAndSortedDishes.forEach(dish => newSelection.add(dish._id));
    }
    
    onSelectionChange(newSelection);
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="space-y-4 bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-900">Recherche et filtres</h3>
          <button
            onClick={resetFilters}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            <RotateCcw className="w-4 h-4" />
            Réinitialiser
          </button>
        </div>
        
        <SearchInput
          label="Rechercher un plat"
          name="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          error={false}
        />

        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Filter Controls */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={showOnlyAvailable}
                  onChange={(e) => setShowOnlyAvailable(e.target.checked)}
                  className="rounded border-gray-300"
                />
                Disponibles uniquement
              </label>
            </div>

            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="text-sm border border-gray-300 rounded px-3 py-1"
            >
              <option value="name-asc">Nom (A-Z)</option>
              <option value="name-desc">Nom (Z-A)</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="category">Par catégorie</option>
            </select>
          </div>

          {/* View Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleSelectAll}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              {filteredAndSortedDishes.every(dish => selectedDishIds.has(dish._id)) 
                ? 'Tout décocher' 
                : 'Sélectionner tout'}
            </button>

            <div className="flex border border-gray-300 rounded overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <CategoryTabs
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        dishCounts={dishCounts}
        selectedCounts={selectedCounts}
      />

      {/* Results Info */}
      <div className="flex justify-between items-center text-sm text-gray-600">
        <span>
          {filteredAndSortedDishes.length} plat{filteredAndSortedDishes.length > 1 ? 's' : ''} 
          {searchQuery || activeCategory !== 'ALL' || showOnlyAvailable ? ' trouvé' : ''}
          {filteredAndSortedDishes.length > 1 ? 's' : ''}
        </span>
        <span>
          {selectedDishIds.size} sélectionné{selectedDishIds.size > 1 ? 's' : ''}
        </span>
      </div>

      {/* Dishes Grid/List */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg border border-gray-200">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Chargement des plats...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className={`
            ${viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' 
              : 'space-y-2'
            }
          `}>
            <AnimatePresence>
              {filteredAndSortedDishes.map((dish) => (
                <DishCard
                  key={dish._id}
                  dish={dish}
                  isSelected={selectedDishIds.has(dish._id)}
                  onToggle={handleDishToggle}
                  onPreview={setPreviewDish}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredAndSortedDishes.length === 0 && (
        <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun plat trouvé</h3>
          <p className="text-gray-600">
            Essayez de modifier vos critères de recherche ou de filtrage
          </p>
          <button
            onClick={resetFilters}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}

      {/* Selection Summary */}
      <SelectionSummary
        selectedDishes={selectedDishes}
        onRemoveDish={handleRemoveDish}
        isCollapsed={summaryCollapsed}
        onToggleCollapse={() => setSummaryCollapsed(!summaryCollapsed)}
      />

      {/* Dish Preview Modal */}
      <DishPreviewModal
        dish={previewDish}
        isOpen={!!previewDish}
        onClose={() => setPreviewDish(null)}
      />
    </div>
  );
};