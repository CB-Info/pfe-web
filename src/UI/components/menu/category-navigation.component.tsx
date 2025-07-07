import React, { useRef, useEffect } from 'react';
import { DishCategory, DishCategoryLabels } from '../../../data/dto/dish.dto';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CategoryNavigationProps {
  categories: DishCategory[];
  activeCategory: DishCategory | 'ALL';
  onCategoryChange: (category: DishCategory | 'ALL') => void;
  categoryCounts: Record<DishCategory | 'ALL', number>;
}

export const CategoryNavigation: React.FC<CategoryNavigationProps> = ({
  categories,
  activeCategory,
  onCategoryChange,
  categoryCounts
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  // Auto-scroll to active category
  useEffect(() => {
    if (scrollContainerRef.current) {
      const activeButton = scrollContainerRef.current.querySelector(`[data-category="${activeCategory}"]`);
      if (activeButton) {
        activeButton.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeCategory]);

  return (
    <div className="relative">
      <div className="container mx-auto px-4">
        <div className="relative flex items-center">
          {/* Left Scroll Button */}
          <button
            onClick={scrollLeft}
            className="hidden md:flex absolute left-0 z-10 items-center justify-center w-10 h-10 bg-white shadow-lg rounded-full hover:bg-gray-50 transition-colors duration-200"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>

          {/* Categories Container */}
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto scrollbar-hide py-4 mx-0 md:mx-12 gap-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {allCategories.map((category) => {
              const isActive = activeCategory === category;
              const count = categoryCounts[category] || 0;

              return (
                <motion.button
                  key={category}
                  data-category={category}
                  onClick={() => onCategoryChange(category)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    relative flex items-center gap-3 px-6 py-3 rounded-full font-medium whitespace-nowrap
                    transition-all duration-200 min-w-fit border-2
                    ${isActive
                      ? 'bg-blue-600 text-white border-blue-600 shadow-lg'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50 shadow-sm'
                    }
                  `}
                >
                  <span className="text-xl">{getCategoryIcon(category)}</span>
                  <span className="font-semibold">{getCategoryLabel(category)}</span>
                  
                  {/* Count Badge */}
                  <span className={`
                    px-2 py-1 rounded-full text-xs font-bold min-w-[24px] text-center
                    ${isActive 
                      ? 'bg-white/20 text-white' 
                      : 'bg-gray-100 text-gray-600'
                    }
                  `}>
                    {count}
                  </span>

                  {/* Active Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeCategory"
                      className="absolute inset-0 bg-blue-600 rounded-full -z-10"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Right Scroll Button */}
          <button
            onClick={scrollRight}
            className="hidden md:flex absolute right-0 z-10 items-center justify-center w-10 h-10 bg-white shadow-lg rounded-full hover:bg-gray-50 transition-colors duration-200"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};