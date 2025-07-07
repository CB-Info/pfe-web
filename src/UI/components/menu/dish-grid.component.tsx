import React from 'react';
import { Dish } from '../../../data/models/dish.model';
import { DishCategory, DishCategoryLabels } from '../../../data/dto/dish.dto';
import { InteractiveDishCard } from './interactive-dish-card.component';
import { motion, AnimatePresence } from 'framer-motion';

interface DishGridProps {
  dishes: Dish[];
  onDishClick: (dish: Dish) => void;
  activeCategory: DishCategory | 'ALL';
}

export const DishGrid: React.FC<DishGridProps> = ({
  dishes,
  onDishClick,
  activeCategory
}) => {
  // Group dishes by category for better organization
  const dishesByCategory = dishes.reduce((acc, dish) => {
    if (!acc[dish.category]) {
      acc[dish.category] = [];
    }
    acc[dish.category].push(dish);
    return acc;
  }, {} as Record<DishCategory, Dish[]>);

  // If showing all categories, display them in sections
  if (activeCategory === 'ALL') {
    const categoriesWithDishes = Object.keys(dishesByCategory) as DishCategory[];
    
    return (
      <div className="space-y-12">
        {categoriesWithDishes.map((category) => (
          <motion.section
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Category Header */}
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {DishCategoryLabels[category]}
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
            </div>

            {/* Dishes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence>
                {dishesByCategory[category].map((dish, index) => (
                  <motion.div
                    key={dish._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ 
                      duration: 0.3,
                      delay: index * 0.05 // Stagger animation
                    }}
                  >
                    <InteractiveDishCard
                      dish={dish}
                      onClick={() => onDishClick(dish)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.section>
        ))}
      </div>
    );
  }

  // Single category view
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Category Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {DishCategoryLabels[activeCategory]}
        </h2>
        <p className="text-gray-600">
          {dishes.length} plat{dishes.length > 1 ? 's' : ''} disponible{dishes.length > 1 ? 's' : ''}
        </p>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full mt-4"></div>
      </div>

      {/* Dishes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {dishes.map((dish, index) => (
            <motion.div
              key={dish._id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ 
                duration: 0.3,
                delay: index * 0.05 // Stagger animation
              }}
            >
              <InteractiveDishCard
                dish={dish}
                onClick={() => onDishClick(dish)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};