import React from 'react';
import { DishCategory, DishCategoryLabels } from '../../../../data/dto/dish.dto';
import { motion } from 'framer-motion';

interface CategoryTabsProps {
  categories: DishCategory[];
  activeCategory: DishCategory | 'ALL';
  onCategoryChange: (category: DishCategory | 'ALL') => void;
  dishCounts: Record<DishCategory | 'ALL', number>;
  selectedCounts: Record<DishCategory | 'ALL', number>;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  activeCategory,
  onCategoryChange,
  dishCounts,
  selectedCounts
}) => {
  const allCategories = ['ALL' as const, ...categories];

  const getCategoryLabel = (category: DishCategory | 'ALL') => {
    return category === 'ALL' ? 'Tous les plats' : DishCategoryLabels[category];
  };

  const getCategoryIcon = (category: DishCategory | 'ALL') => {
    const icons: Record<DishCategory | 'ALL', string> = {
      'ALL': '🍽️',
      'STARTERS': '🥗',
      'MAIN_DISHES': '🍖',
      'FISH_SEAFOOD': '🐟',
      'VEGETARIAN': '🥬',
      'PASTA_RICE': '🍝',
      'SALADS': '🥙',
      'SOUPS': '🍲',
      'SIDE_DISHES': '🍟',
      'DESSERTS': '🍰',
      'BEVERAGES': '🥤'
    };
    return icons[category] || '🍽️';
  };

  return (
    <div className="border-b border-gray-200 mb-6">
      <div className="flex overflow-x-auto scrollbar-hide">
        {allCategories.map((category) => {
          const isActive = activeCategory === category;
          const count = dishCounts[category] || 0;
          const selectedCount = selectedCounts[category] || 0;

          return (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`
                relative flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap
                transition-all duration-200 border-b-2 min-w-fit
                ${isActive
                  ? 'text-blue-600 border-blue-600 bg-blue-50'
                  : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300'
                }
              `}
            >
              <span className="text-lg">{getCategoryIcon(category)}</span>
              <span>{getCategoryLabel(category)}</span>
              
              {/* Dish Count */}
              <span className={`
                px-2 py-1 rounded-full text-xs font-medium
                ${isActive 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-gray-100 text-gray-600'
                }
              `}>
                {count}
              </span>

              {/* Selected Count */}
              {selectedCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
                >
                  {selectedCount}
                </motion.span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};