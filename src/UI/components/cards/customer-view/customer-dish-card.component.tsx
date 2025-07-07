import React from 'react';
import { Dish } from '../../../../data/models/dish.model';
import { Clock, Users, Plus, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface CustomerDishCardProps {
  dish: Dish;
  onClick: () => void;
  onAddToCart: () => void;
  viewMode: 'mobile' | 'desktop';
}

export const CustomerDishCard: React.FC<CustomerDishCardProps> = ({
  dish,
  onClick,
  onAddToCart,
  viewMode
}) => {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart();
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-all duration-200"
      onClick={onClick}
    >
      <div className={`flex ${viewMode === 'mobile' ? 'flex-col' : 'flex-row'} h-full`}>
        {/* Image */}
        <div className={`
          ${viewMode === 'mobile' ? 'h-48 w-full' : 'h-32 w-32 flex-shrink-0'}
          bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center relative overflow-hidden
        `}>
          {/* Placeholder image with food emoji */}
          <div className="text-4xl filter drop-shadow-sm">🍽️</div>
          
          {/* Rating Badge */}
          <div className="absolute top-2 left-2 bg-white bg-opacity-90 rounded-full px-2 py-1 flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-500 fill-current" />
            <span className="text-xs font-medium">4.{Math.floor(Math.random() * 5) + 5}</span>
          </div>

          {/* Popular Badge (random) */}
          {Math.random() > 0.7 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              Populaire
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-gray-900 text-lg leading-tight line-clamp-2">
                {dish.name}
              </h3>
              <span className="text-xl font-bold text-green-600 ml-2 whitespace-nowrap">
                {dish.price}€
              </span>
            </div>

            <p className="text-gray-600 text-sm line-clamp-2 mb-3 leading-relaxed">
              {dish.description}
            </p>

            {/* Meta Info */}
            <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
              {dish.timeCook && (
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{dish.timeCook} min</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{dish.ingredients.length} ingrédients</span>
              </div>
            </div>

            {/* Ingredients Preview */}
            <div className="flex flex-wrap gap-1 mb-3">
              {dish.ingredients.slice(0, 3).map((ingredient, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                >
                  {ingredient.ingredient.name}
                </span>
              ))}
              {dish.ingredients.length > 3 && (
                <span className="text-gray-500 text-xs px-2 py-1">
                  +{dish.ingredients.length - 3} autres
                </span>
              )}
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Ajouter au panier
          </button>
        </div>
      </div>
    </motion.div>
  );
};