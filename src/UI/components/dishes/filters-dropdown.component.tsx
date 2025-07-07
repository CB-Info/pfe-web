import React, { useState, useRef, useEffect } from 'react';
import { DishCategory, DishCategoryLabels } from '../../../data/dto/dish.dto';
import { SearchInput } from '../input/searchInput';
import { Filter, ChevronDown, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export type DishSortOption =
  | "Date de création (Descendant)"
  | "Date de création (Ascendant)"
  | "Nom (Ascendant)"
  | "Nom (Descendant)"
  | "Prix (Ascendant)"
  | "Prix (Descendant)";

interface FiltersDropdownProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCategory: DishCategory | "Toutes";
  onCategoryChange: (category: DishCategory | "Toutes") => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  selectedSort: DishSortOption;
  onSortChange: (sort: DishSortOption) => void;
  onResetFilters: () => void;
  resultsCount: number;
}

export const FiltersDropdown: React.FC<FiltersDropdownProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
  selectedSort,
  onSortChange,
  onResetFilters,
  resultsCount
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const handleCategoryChange = (label: string) => {
    if (label === "Toutes") {
      onCategoryChange("Toutes");
    } else {
      const entry = Object.entries(DishCategoryLabels).find(([, l]) => l === label);
      if (entry) {
        onCategoryChange(entry[0] as DishCategory);
      }
    }
  };

  // Check if any filters are active
  const hasActiveFilters = 
    searchQuery !== "" || 
    selectedCategory !== "Toutes" || 
    selectedStatus !== "Tous" ||
    selectedSort !== "Date de création (Descendant)";

  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchQuery !== "") count++;
    if (selectedCategory !== "Toutes") count++;
    if (selectedStatus !== "Tous") count++;
    if (selectedSort !== "Date de création (Descendant)") count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-3 px-4 py-3 bg-white border border-gray-300 rounded-lg 
          hover:bg-gray-50 transition-all duration-200 shadow-sm
          ${isOpen ? 'ring-2 ring-blue-500 border-blue-500' : ''}
          ${hasActiveFilters ? 'border-blue-400 bg-blue-50' : ''}
        `}
      >
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-gray-600" />
          <span className="font-medium text-gray-900">Filtres & Tri</span>
        </div>

        {/* Active Filters Indicator */}
        {activeFiltersCount > 0 && (
          <div className="flex items-center gap-2">
            <span className="bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {activeFiltersCount}
            </span>
          </div>
        )}

        {/* Results Count */}
        <div className="text-sm text-gray-600 border-l border-gray-300 pl-3">
          {resultsCount} résultat{resultsCount > 1 ? 's' : ''}
        </div>

        <ChevronDown 
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {/* Dropdown Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden"
          >
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Filtres et tri</h3>
                {hasActiveFilters && (
                  <button
                    onClick={() => {
                      onResetFilters();
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Réinitialiser
                  </button>
                )}
              </div>

              {/* Search */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Recherche
                </label>
                <SearchInput
                  label=""
                  name="search"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  error={false}
                />
              </div>

              {/* Filters Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category Filter */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Catégorie
                  </label>
                  <select
                    value={selectedCategory === "Toutes" ? "Toutes" : DishCategoryLabels[selectedCategory]}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  >
                    {categoryOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Filter */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Statut
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => onStatusChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  >
                    {statusOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Sort Options */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Trier par
                </label>
                <select
                  value={selectedSort}
                  onChange={(e) => onSortChange(e.target.value as DishSortOption)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                >
                  {sortOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* Active Filters Summary */}
              {hasActiveFilters && (
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">Filtres actifs</h4>
                  <div className="flex flex-wrap gap-2">
                    {searchQuery && (
                      <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        Recherche: "{searchQuery}"
                      </span>
                    )}
                    {selectedCategory !== "Toutes" && (
                      <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        Catégorie: {DishCategoryLabels[selectedCategory]}
                      </span>
                    )}
                    {selectedStatus !== "Tous" && (
                      <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        Statut: {selectedStatus}
                      </span>
                    )}
                    {selectedSort !== "Date de création (Descendant)" && (
                      <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        Tri: {selectedSort}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                >
                  Fermer
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};