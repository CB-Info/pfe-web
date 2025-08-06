import React, { useState } from 'react';
import { Dish } from '../../../../data/models/dish.model';
import { DishCategoryLabels } from '../../../../data/dto/dish.dto';
import { Eye, Clock, Users } from 'lucide-react';
import { motion } from 'framer-motion';

interface DishCardProps {
  dish: Dish;
  isSelected: boolean;
  onToggle: (dishId: string) => void;
  onPreview?: (dish: Dish) => void;
}

export const DishCard: React.FC<DishCardProps> = ({
  dish,
  isSelected,
  onToggle,
  onPreview
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handlePreview = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPreview?.(dish);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`
        relative bg-white rounded-lg border-2 transition-all duration-200 cursor-pointer
        ${isSelected 
          ? 'border-blue-500 bg-blue-50 shadow-md ring-2 ring-blue-200' 
          : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
        }
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onToggle(dish._id)}
    >
      {/* Selection Checkbox */}
      <div className="absolute top-3 left-3 z-10">
        <div className={`
          w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200
          ${isSelected 
            ? 'bg-blue-500 border-blue-500' 
            : 'bg-white border-gray-300 hover:border-blue-400'
          }
        `}>
          {isSelected && (
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </div>
      </div>

      {/* Preview Button */}
      {isHovered && onPreview && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-3 right-3 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors duration-200"
          onClick={handlePreview}
        >
          <Eye className="w-4 h-4 text-gray-600" />
        </motion.button>
      )}

      {/* Dish Image Placeholder */}
      <div className={`
        h-32 bg-gradient-to-br rounded-t-lg flex items-center justify-center transition-all duration-200
        ${isSelected 
          ? 'from-blue-100 to-blue-200' 
          : 'from-gray-100 to-gray-200'
        }
      `}>
        <div className="text-4xl filter drop-shadow-sm">🍽️</div>
      </div>

      {/* Dish Content */}
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2 flex-1 mr-2">
            {dish.name}
          </h3>
          <span className="text-lg font-bold text-blue-600 whitespace-nowrap">
            {dish.price}€
          </span>
        </div>

        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
          {dish.description}
        </p>

        {/* Dish Meta Info */}
        <div className="flex items-center justify-between text-xs text-gray-500 gap-2">
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>{dish.ingredients.length} ing.</span>
          </div>
          {dish.timeCook && (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{dish.timeCook}min</span>
            </div>
          )}
          <div className={`
            px-2 py-1 rounded-full text-xs font-medium
            ${dish.isAvailable 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
            }
          `}>
            {dish.isAvailable ? 'Dispo' : 'Indispo'}
          </div>
        </div>

        {/* Category Badge */}
        <div>
          <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full border border-gray-200">
            {DishCategoryLabels[dish.category]}
          </span>
        </div>
      </div>
    </motion.div>
  );
};