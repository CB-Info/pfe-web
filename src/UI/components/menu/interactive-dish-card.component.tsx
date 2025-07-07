import React, { useState } from 'react';
import { Dish } from '../../../data/models/dish.model';
import { DishCategoryLabels } from '../../../data/dto/dish.dto';
import { Clock, Users, Eye, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface InteractiveDishCardProps {
  dish: Dish;
  onClick: () => void;
}

export const InteractiveDishCard: React.FC<InteractiveDishCardProps> = ({
  dish,
  onClick
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Generate a placeholder image URL based on dish category
  const getPlaceholderImage = (category: string) => {
    const imageMap: Record<string, string> = {
      'STARTERS': 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
      'MAIN_DISHES': 'https://images.pexels.com/photos/2641886/pexels-photo-2641886.jpeg?auto=compress&cs=tinysrgb&w=400',
      'FISH_SEAFOOD': 'https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg?auto=compress&cs=tinysrgb&w=400',
      'VEGETARIAN': 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=400',
      'PASTA_RICE': 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=400',
      'SALADS': 'https://images.pexels.com/photos/1059905/pexels-photo-1059905.jpeg?auto=compress&cs=tinysrgb&w=400',
      'SOUPS': 'https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg?auto=compress&cs=tinysrgb&w=400',
      'SIDE_DISHES': 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=400',
      'DESSERTS': 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400',
      'BEVERAGES': 'https://images.pexels.com/photos/544961/pexels-photo-544961.jpeg?auto=compress&cs=tinysrgb&w=400'
    };
    return imageMap[category] || imageMap['MAIN_DISHES'];
  };

  return (
    <motion.div
      className="group relative bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:shadow-2xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        {/* Placeholder while loading */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse flex items-center justify-center">
            <div className="text-4xl opacity-50">🍽️</div>
          </div>
        )}
        
        {/* Actual Image */}
        <img
          src={getPlaceholderImage(dish.category)}
          alt={dish.name}
          className={`w-full h-full object-cover transition-all duration-500 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          } ${isHovered ? 'scale-110' : 'scale-100'}`}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />

        {/* Overlay */}
        <div className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          isHovered ? 'opacity-20' : 'opacity-0'
        }`} />

        {/* Availability Badge */}
        <div className="absolute top-3 left-3">
          <span className={`
            px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm
            ${dish.isAvailable 
              ? 'bg-green-500/90 text-white' 
              : 'bg-red-500/90 text-white'
            }
          `}>
            {dish.isAvailable ? 'Disponible' : 'Indisponible'}
          </span>
        </div>

        {/* Price Badge */}
        <div className="absolute top-3 right-3">
          <span className="bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
            {dish.price}€
          </span>
        </div>

        {/* Hover Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
          transition={{ duration: 0.2 }}
          className="absolute bottom-3 left-3 right-3 flex justify-center"
        >
          <button className="flex items-center gap-2 bg-white/90 backdrop-blur-sm text-gray-900 px-4 py-2 rounded-full font-medium hover:bg-white transition-colors duration-200">
            <Eye className="w-4 h-4" />
            Voir les détails
          </button>
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Title and Category */}
        <div>
          <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-2 leading-tight">
            {dish.name}
          </h3>
          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
            {DishCategoryLabels[dish.category]}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
          {dish.description}
        </p>

        {/* Meta Information */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{dish.ingredients.length} ing.</span>
            </div>
            {dish.timeCook && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{dish.timeCook}min</span>
              </div>
            )}
          </div>
          
          {/* Rating placeholder */}
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">4.5</span>
          </div>
        </div>

        {/* Ingredients Preview */}
        <div className="pt-2 border-t border-gray-100">
          <div className="flex flex-wrap gap-1">
            {dish.ingredients.slice(0, 3).map((ingredient, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
              >
                {ingredient.ingredient.name}
              </span>
            ))}
            {dish.ingredients.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                +{dish.ingredients.length - 3} autres
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Hover Border Effect */}
      <div className={`absolute inset-0 border-2 rounded-2xl transition-colors duration-300 pointer-events-none ${
        isHovered ? 'border-blue-400' : 'border-transparent'
      }`} />
    </motion.div>
  );
};