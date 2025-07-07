import React from 'react';
import { Dish } from '../../../../data/models/dish.model';
import { DishCategoryLabels } from '../../../../data/dto/dish.dto';
import { X, GripVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SelectionSummaryProps {
  selectedDishes: Dish[];
  onRemoveDish: (dishId: string) => void;
  onReorderDishes?: (dishes: Dish[]) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const SelectionSummary: React.FC<SelectionSummaryProps> = ({
  selectedDishes,
  onRemoveDish,
  onReorderDishes,
  isCollapsed,
  onToggleCollapse
}) => {
  const totalPrice = selectedDishes.reduce((sum, dish) => sum + dish.price, 0);
  const categoryCount = selectedDishes.reduce((acc, dish) => {
    const category = DishCategoryLabels[dish.category];
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200">
      {/* Header */}
      <button
        onClick={onToggleCollapse}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-100 transition-colors duration-200"
      >
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-gray-900">Plats sélectionnés</h3>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
            {selectedDishes.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-green-600">{totalPrice.toFixed(2)}€</span>
          <svg
            className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
              isCollapsed ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Content */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              {selectedDishes.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  Aucun plat sélectionné
                </p>
              ) : (
                <>
                  {/* Category Summary */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Répartition par catégorie</h4>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(categoryCount).map(([category, count]) => (
                        <span
                          key={category}
                          className="px-2 py-1 bg-white border border-gray-200 rounded text-xs"
                        >
                          {category}: {count}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Selected Dishes List */}
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    <AnimatePresence>
                      {selectedDishes.map((dish) => (
                        <motion.div
                          key={dish._id}
                          layout
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="flex items-center gap-3 p-2 bg-white rounded border border-gray-200 hover:shadow-sm transition-shadow duration-200"
                        >
                          {onReorderDishes && (
                            <button className="text-gray-400 hover:text-gray-600 cursor-grab">
                              <GripVertical className="w-4 h-4" />
                            </button>
                          )}
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h5 className="font-medium text-gray-900 text-sm truncate">
                                {dish.name}
                              </h5>
                              <span className="font-semibold text-blue-600 text-sm ml-2">
                                {dish.price}€
                              </span>
                            </div>
                            <p className="text-xs text-gray-500">
                              {DishCategoryLabels[dish.category]}
                            </p>
                          </div>

                          <button
                            onClick={() => onRemoveDish(dish._id)}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors duration-200"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">
                        Prix total: <span className="font-semibold text-gray-900">{totalPrice.toFixed(2)}€</span>
                      </span>
                      <span className="text-gray-600">
                        Prix moyen: <span className="font-semibold text-gray-900">
                          {selectedDishes.length > 0 ? (totalPrice / selectedDishes.length).toFixed(2) : '0.00'}€
                        </span>
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};