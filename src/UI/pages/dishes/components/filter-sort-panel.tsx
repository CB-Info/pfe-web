import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  ChevronUp, 
  Filter, 
  Search, 
  RotateCcw,
  SlidersHorizontal 
} from 'lucide-react';
import { SearchInput } from '../../../components/input/searchInput';
import TextfieldList from '../../../components/input/textfield.list';
import { DishCategory, DishCategoryLabels } from '../../../../data/dto/dish.dto';
import { DishSortOption } from '../utils/sortDishes';

interface FilterSortPanelProps {
  // Search
  searchQuery: string;
  onSearchChange: (value: string) => void;
  
  // Category filter
  selectedCategory: DishCategory | 'Toutes';
  onCategoryChange: (category: string) => void;
  
  // Status filter
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  
  // Sort
  selectedSort: DishSortOption;
  onSortChange: (sort: DishSortOption) => void;
  
  // Reset
  onResetFilters: () => void;
  
  // Results count
  totalResults: number;
  filteredResults: number;
}

export const FilterSortPanel: React.FC<FilterSortPanelProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
  selectedSort,
  onSortChange,
  onResetFilters,
  totalResults,
  filteredResults
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const sortOptions: DishSortOption[] = [
    "Date de création (Descendant)",
    "Date de création (Ascendant)",
    "Nom (Ascendant)",
    "Nom (Descendant)",
    "Prix (Ascendant)",
    "Prix (Descendant)",
  ];

  const statusOptions = ["Tous", "Actif", "Inactif"];
  const categoryOptions = ["Toutes", ...Object.values(DishCategoryLabels)];

  // Check if any filters are active
  const hasActiveFilters = 
    searchQuery.trim() !== '' ||
    selectedCategory !== 'Toutes' ||
    selectedStatus !== 'Tous' ||
    selectedSort !== "Date de création (Descendant)";

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200 rounded-t-lg"
        aria-expanded={isExpanded}
        aria-controls="filter-sort-content"
      >
        <div className="flex items-center gap-3">
          <SlidersHorizontal className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Filtres et tri
          </h3>
          {hasActiveFilters && (
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
              Actifs
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          {/* Results summary */}
          <div className="text-sm text-gray-600 hidden sm:block">
            {filteredResults === totalResults ? (
              <span>{totalResults} plat{totalResults > 1 ? 's' : ''}</span>
            ) : (
              <span>
                {filteredResults} sur {totalResults} plat{totalResults > 1 ? 's' : ''}
              </span>
            )}
          </div>
          
          {/* Reset button */}
          {hasActiveFilters && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onResetFilters();
              }}
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 transition-colors duration-200"
              title="Réinitialiser tous les filtres"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Réinitialiser</span>
            </button>
          )}
          
          {/* Expand/Collapse icon */}
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-5 h-5 text-gray-500" />
          </motion.div>
        </div>
      </button>

      {/* Expandable content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            id="filter-sort-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 border-t border-gray-100">
              <div className="pt-4 space-y-6">
                {/* Search Section */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Search className="w-4 h-4" />
                    Recherche
                  </label>
                  <SearchInput
                    label=""
                    error={false}
                    name="search"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                  />
                  {searchQuery.trim() && (
                    <p className="text-xs text-gray-500">
                      Recherche dans les noms et descriptions des plats
                    </p>
                  )}
                </div>

                {/* Filters Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Category Filter */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Filter className="w-4 h-4" />
                      Catégorie
                    </label>
                    <TextfieldList
                      valuesToDisplay={categoryOptions}
                      onClicked={onCategoryChange}
                      label=""
                      defaultValue={
                        selectedCategory === "Toutes"
                          ? "Toutes"
                          : DishCategoryLabels[selectedCategory]
                      }
                    />
                  </div>

                  {/* Status Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Statut
                    </label>
                    <TextfieldList
                      valuesToDisplay={statusOptions}
                      onClicked={onStatusChange}
                      label=""
                      defaultValue={selectedStatus}
                    />
                  </div>

                  {/* Sort Options */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Trier par
                    </label>
                    <TextfieldList
                      valuesToDisplay={sortOptions}
                      onClicked={onSortChange}
                      label=""
                      defaultValue={selectedSort}
                    />
                  </div>
                </div>

                {/* Active Filters Summary */}
                {hasActiveFilters && (
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">
                      Filtres actifs:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {searchQuery.trim() && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                          Recherche: "{searchQuery.trim()}"
                        </span>
                      )}
                      {selectedCategory !== 'Toutes' && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                          Catégorie: {DishCategoryLabels[selectedCategory]}
                        </span>
                      )}
                      {selectedStatus !== 'Tous' && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                          Statut: {selectedStatus}
                        </span>
                      )}
                      {selectedSort !== "Date de création (Descendant)" && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                          Tri: {selectedSort}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Results Info */}
                <div className="flex items-center justify-between text-sm text-gray-600 pt-2 border-t border-gray-100">
                  <span>
                    {filteredResults === totalResults ? (
                      `${totalResults} plat${totalResults > 1 ? 's' : ''} au total`
                    ) : (
                      `${filteredResults} plat${filteredResults > 1 ? 's' : ''} trouvé${filteredResults > 1 ? 's' : ''} sur ${totalResults}`
                    )}
                  </span>
                  
                  {hasActiveFilters && (
                    <button
                      onClick={onResetFilters}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors duration-200 font-medium"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Tout réinitialiser
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};