import React, { useState } from 'react';
import { Dish } from '../../../../data/models/dish.model';
import { DishCategoryLabels } from '../../../../data/dto/dish.dto';
import { 
  ArrowLeft, 
  Clock, 
  Users, 
  Star, 
  Plus, 
  Minus, 
  Heart,
  Share2,
  Info
} from 'lucide-react';
import { motion } from 'framer-motion';

interface CustomerDishDetailProps {
  dish: Dish;
  onBack: () => void;
  onAddToCart: (dish: Dish) => void;
  viewMode: 'mobile' | 'desktop';
}

export const CustomerDishDetail: React.FC<CustomerDishDetailProps> = ({
  dish,
  onBack,
  onAddToCart,
  viewMode
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleQuantityChange = (delta: number) => {
    setQuantity(Math.max(1, quantity + delta));
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      onAddToCart(dish);
    }
    onBack();
  };

  const totalPrice = dish.price * quantity;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col h-full bg-white"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Retour au menu</span>
        </button>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className={`p-2 rounded-full transition-colors duration-200 ${
              isFavorite 
                ? 'bg-red-100 text-red-600' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
          <button className="p-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-full transition-colors duration-200">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Hero Image */}
        <div className="h-64 bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center relative">
          <div className="text-8xl filter drop-shadow-lg">🍽️</div>
          
          {/* Rating Badge */}
          <div className="absolute top-4 left-4 bg-white bg-opacity-95 rounded-lg px-3 py-2 flex items-center gap-2 shadow-sm">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="font-semibold">4.{Math.floor(Math.random() * 5) + 5}</span>
            <span className="text-gray-600 text-sm">({Math.floor(Math.random() * 100) + 20} avis)</span>
          </div>

          {/* Category Badge */}
          <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium">
            {DishCategoryLabels[dish.category]}
          </div>
        </div>

        {/* Dish Info */}
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{dish.name}</h1>
              <p className="text-gray-600 leading-relaxed mb-4">{dish.description}</p>
            </div>
            <div className="text-right ml-4">
              <div className="text-3xl font-bold text-green-600">{dish.price}€</div>
              <div className="text-sm text-gray-500">par portion</div>
            </div>
          </div>

          {/* Meta Information */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {dish.timeCook && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">Temps de préparation</p>
                  <p className="text-sm text-gray-600">{dish.timeCook} minutes</p>
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium text-gray-900">Ingrédients</p>
                <p className="text-sm text-gray-600">{dish.ingredients.length} composants</p>
              </div>
            </div>
          </div>

          {/* Ingredients Section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Ingrédients</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {dish.ingredients.map((ingredient, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100"
                >
                  <span className="font-medium text-gray-900">
                    {ingredient.ingredient.name}
                  </span>
                  {ingredient.quantity && (
                    <span className="text-sm text-blue-600 font-medium">
                      {ingredient.quantity}{ingredient.unity}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Nutritional Info (Mock) */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Informations nutritionnelles</h3>
            <div className="grid grid-cols-4 gap-3">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="font-bold text-green-600">{Math.floor(Math.random() * 200) + 300}</div>
                <div className="text-xs text-gray-600">Calories</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="font-bold text-blue-600">{Math.floor(Math.random() * 20) + 10}g</div>
                <div className="text-xs text-gray-600">Protéines</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <div className="font-bold text-yellow-600">{Math.floor(Math.random() * 30) + 20}g</div>
                <div className="text-xs text-gray-600">Glucides</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="font-bold text-red-600">{Math.floor(Math.random() * 15) + 5}g</div>
                <div className="text-xs text-gray-600">Lipides</div>
              </div>
            </div>
          </div>

          {/* Allergens (Mock) */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Allergènes</h3>
            <div className="flex flex-wrap gap-2">
              {['Gluten', 'Lactose', 'Œufs'].filter(() => Math.random() > 0.5).map((allergen, index) => (
                <span
                  key={index}
                  className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium border border-red-200"
                >
                  {allergen}
                </span>
              ))}
              {Math.random() > 0.3 && (
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium border border-green-200">
                  Sans allergènes majeurs
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom - Quantity & Add to Cart */}
      <div className="bg-white border-t border-gray-200 p-4 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <span className="font-medium text-gray-900">Quantité:</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-bold text-lg w-8 text-center">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(1)}
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors duration-200"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-gray-600">Total</div>
            <div className="text-2xl font-bold text-green-600">{totalPrice.toFixed(2)}€</div>
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-colors duration-200 flex items-center justify-center gap-3 shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Ajouter au panier ({quantity})
        </button>
      </div>
    </motion.div>
  );
};