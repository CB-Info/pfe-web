import React from 'react';
import { MenuFilters as MenuFiltersType } from '../../pages/menu/interactive-menu.page';
import { Dish } from '../../../data/models/dish.model';
import { X, Search, DollarSign, Filter, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

interface MenuFiltersProps {
  filters: MenuFiltersType;
  onFiltersChange: (filters: MenuFiltersType) => void;
  onClose: () => void;
  dishes: Dish[];
}

export const MenuFilters: React.FC<MenuFiltersProps> = ({
  filters,
  onFiltersChange,
  onClose,
  dishes
}) => {
  const minPrice = Math.min(...dishes.map(d => d.price));
  const maxPrice = Math.max(...dishes.map(d => d.price));

  const handleReset = () => {
    onFiltersChange({
      searchQuery: '',
      priceRange: [minPrice, maxPrice],
      showOnlyAvailable: false,
      sortBy: 'name',
      sortOrder: 'asc'
    });
  };

  const updateFilters = (updates: Partial<MenuFiltersType>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white border-b border-gray-200 shadow-lg"
    >
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Filter className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-semibold text-gray-900">Filtres et recherche</h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <RotateCcw className="w-4 h-4" />
              Réinitialiser
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Search */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              <Search className="w-4 h-4 inline mr-2" />
              Rechercher
            </label>
            <div className="relative">
              <input
                type="text"
                value={filters.searchQuery}
                onChange={(e) => updateFilters({ searchQuery: e.target.value })}
                placeholder="Nom ou description..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              <DollarSign className="w-4 h-4 inline mr-2" />
              Fourchette de prix
            </label>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={filters.priceRange[0]}
                  onChange={(e) => updateFilters({ 
                    priceRange: [Number(e.target.value), filters.priceRange[1]] 
                  })}
                  min={minPrice}
                  max={maxPrice}
                  className="w-20 px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="text-gray-500">à</span>
                <input
                  type="number"
                  value={filters.priceRange[1]}
                  onChange={(e) => updateFilters({ 
                    priceRange: [filters.priceRange[0], Number(e.target.value)] 
                  })}
                  min={minPrice}
                  max={maxPrice}
                  className="w-20 px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="text-gray-500">€</span>
              </div>
              <input
                type="range"
                min={minPrice}
                max={maxPrice}
                value={filters.priceRange[1]}
                onChange={(e) => updateFilters({ 
                  priceRange: [filters.priceRange[0], Number(e.target.value)] 
                })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          </div>

          {/* Sort Options */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Trier par
            </label>
            <div className="space-y-2">
              <select
                value={filters.sortBy}
                onChange={(e) => updateFilters({ sortBy: e.target.value as any })}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="name">Nom</option>
                <option value="price">Prix</option>
                <option value="category">Catégorie</option>
              </select>
              <div className="flex gap-2">
                <button
                  onClick={() => updateFilters({ sortOrder: 'asc' })}
                  className={`flex-1 px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${
                    filters.sortOrder === 'asc'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Croissant
                </button>
                <button
                  onClick={() => updateFilters({ sortOrder: 'desc' })}
                  className={`flex-1 px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${
                    filters.sortOrder === 'desc'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Décroissant
                </button>
              </div>
            </div>
          </div>

          {/* Additional Filters */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Options
            </label>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.showOnlyAvailable}
                  onChange={(e) => updateFilters({ showOnlyAvailable: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Disponibles uniquement</span>
              </label>
            </div>
          </div>
        </div>

        {/* Active Filters Summary */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-600">Filtres actifs:</span>
            {filters.searchQuery && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                Recherche: "{filters.searchQuery}"
              </span>
            )}
            {(filters.priceRange[0] !== minPrice || filters.priceRange[1] !== maxPrice) && (
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                Prix: {filters.priceRange[0]}€ - {filters.priceRange[1]}€
              </span>
            )}
            {filters.showOnlyAvailable && (
              <span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">
                Disponibles uniquement
              </span>
            )}
            {(filters.sortBy !== 'name' || filters.sortOrder !== 'asc') && (
              <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                Tri: {filters.sortBy} ({filters.sortOrder === 'asc' ? 'croissant' : 'décroissant'})
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};