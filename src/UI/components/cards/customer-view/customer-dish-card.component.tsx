import React from 'react';
import { Dish } from '../../../../data/models/dish.model';
import { Clock, Users, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface CustomerDishCardProps {
  dish: Dish;
  onClick: () => void;
  viewMode: 'mobile' | 'desktop';
}

export const CustomerDishCard: React.FC<CustomerDishCardProps> = ({
  dish,
  onClick,
  viewMode
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-all duration-200"
      onClick={onClick}
    >
      <div className={`flex ${viewMode === 'mobile' ? 'flex-row' : 'flex-row'} h-full`}>
        {/* Image */}
        <div className="h-24 w-24 flex-shrink-0 bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center relative overflow-hidden">
          <div className="text-2xl filter drop-shadow-sm">🍽️</div>
          
          {/* Availability indicator */}
          <div className={`absolute bottom-1 right-1 w-3 h-3 rounded-full border-2 border-white ${
            dish.isAvailable ? 'bg-green-500' : 'bg-red-500'
          }`} />
        </div>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-gray-900 text-base leading-tight line-clamp-1 flex-1 mr-2">
                {dish.name}
              </h3>
              <span className="text-lg font-bold text-green-600 whitespace-nowrap">
                {dish.price}€
              </span>
            </div>

            <p className="text-gray-600 text-sm line-clamp-2 mb-2 leading-relaxed">
              {dish.description}
            </p>

            {/* Meta Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-gray-500">
                {dish.timeCook && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{dish.timeCook}min</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>{dish.ingredients.length} ing.</span>
                </div>
                {!dish.isAvailable && (
                  <span className="text-red-600 font-medium">Indisponible</span>
                )}
              </div>
              
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};