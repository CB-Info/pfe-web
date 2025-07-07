import React, { useState } from 'react';
import { Dish } from '../../../data/models/dish.model';
import { DishCategoryLabels } from '../../../data/dto/dish.dto';
import { X, Clock, Users, Tag, Star, Heart, Share2, ZoomIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DishDetailModalProps {
  dish: Dish | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DishDetailModal: React.FC<DishDetailModalProps> = ({
  dish,
  isOpen,
  onClose
}) => {
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  if (!dish) return null;

  const getPlaceholderImage = (category: string) => {
    const imageMap: Record<string, string> = {
      'STARTERS': 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
      'MAIN_DISHES': 'https://images.pexels.com/photos/2641886/pexels-photo-2641886.jpeg?auto=compress&cs=tinysrgb&w=800',
      'FISH_SEAFOOD': 'https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg?auto=compress&cs=tinysrgb&w=800',
      'VEGETARIAN': 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=800',
      'PASTA_RICE': 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=800',
      'SALADS': 'https://images.pexels.com/photos/1059905/pexels-photo-1059905.jpeg?auto=compress&cs=tinysrgb&w=800',
      'SOUPS': 'https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg?auto=compress&cs=tinysrgb&w=800',
      'SIDE_DISHES': 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=800',
      'DESSERTS': 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=800',
      'BEVERAGES': 'https://images.pexels.com/photos/544961/pexels-photo-544961.jpeg?auto=compress&cs=tinysrgb&w=800'
    };
    return imageMap[category] || imageMap['MAIN_DISHES'];
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: dish.name,
          text: dish.description,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${dish.name} - ${dish.description}`);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.3 }}
                className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="absolute top-4 right-4 z-10 flex gap-2">
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`p-3 rounded-full backdrop-blur-sm transition-all duration-200 ${
                      isFavorite 
                        ? 'bg-red-500 text-white' 
                        : 'bg-white/90 text-gray-700 hover:bg-white'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-3 bg-white/90 backdrop-blur-sm text-gray-700 rounded-full hover:bg-white transition-colors duration-200"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={onClose}
                    className="p-3 bg-white/90 backdrop-blur-sm text-gray-700 rounded-full hover:bg-white transition-colors duration-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2">
                  {/* Image Section */}
                  <div className="relative h-64 lg:h-full min-h-[400px]">
                    <img
                      src={getPlaceholderImage(dish.category)}
                      alt={dish.name}
                      className="w-full h-full object-cover cursor-zoom-in"
                      onClick={() => setIsImageZoomed(true)}
                    />
                    
                    {/* Zoom Button */}
                    <button
                      onClick={() => setIsImageZoomed(true)}
                      className="absolute bottom-4 left-4 p-2 bg-white/90 backdrop-blur-sm text-gray-700 rounded-full hover:bg-white transition-colors duration-200"
                    >
                      <ZoomIn className="w-5 h-5" />
                    </button>

                    {/* Availability Badge */}
                    <div className="absolute top-4 left-4">
                      <span className={`
                        px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm
                        ${dish.isAvailable 
                          ? 'bg-green-500/90 text-white' 
                          : 'bg-red-500/90 text-white'
                        }
                      `}>
                        {dish.isAvailable ? 'Disponible' : 'Indisponible'}
                      </span>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-8 space-y-6">
                    {/* Header */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium">
                          {DishCategoryLabels[dish.category]}
                        </span>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">4.5</span>
                          <span className="text-sm text-gray-500">(24 avis)</span>
                        </div>
                      </div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">{dish.name}</h1>
                      <div className="text-3xl font-bold text-blue-600">{dish.price}€</div>
                    </div>

                    {/* Description */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                      <p className="text-gray-600 leading-relaxed">{dish.description}</p>
                    </div>

                    {/* Meta Information */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Ingrédients</p>
                          <p className="font-semibold">{dish.ingredients.length} ingrédients</p>
                        </div>
                      </div>

                      {dish.timeCook && (
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-orange-100 rounded-lg">
                            <Clock className="w-5 h-5 text-orange-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Temps de cuisson</p>
                            <p className="font-semibold">{dish.timeCook} minutes</p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Tag className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Catégorie</p>
                          <p className="font-semibold">{DishCategoryLabels[dish.category]}</p>
                        </div>
                      </div>
                    </div>

                    {/* Ingredients */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Ingrédients</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {dish.ingredients.map((ingredient, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <span className="font-medium text-gray-900">
                              {ingredient.ingredient.name}
                            </span>
                            {ingredient.quantity && (
                              <span className="text-sm text-gray-500">
                                {ingredient.quantity} {ingredient.unity}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      <button className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200">
                        Commander
                      </button>
                      <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200">
                        Ajouter au panier
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Image Zoom Modal */}
          <AnimatePresence>
            {isImageZoomed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4"
                onClick={() => setIsImageZoomed(false)}
              >
                <motion.img
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.8 }}
                  src={getPlaceholderImage(dish.category)}
                  alt={dish.name}
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
                <button
                  onClick={() => setIsImageZoomed(false)}
                  className="absolute top-4 right-4 p-3 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-colors duration-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </AnimatePresence>
  );
};