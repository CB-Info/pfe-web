import React from 'react';
import { Dish } from '../../../../data/models/dish.model';
import { DishCategoryLabels } from '../../../../data/dto/dish.dto';
import { 
  ArrowLeft, 
  Clock, 
  Users, 
  Info
} from 'lucide-react';
import { motion } from 'framer-motion';

interface CustomerDishDetailProps {
  dish: Dish;
  onBack: () => void;
  viewMode: 'mobile' | 'desktop';
}

export const CustomerDishDetail: React.FC<CustomerDishDetailProps> = ({
  dish,
  onBack,
  viewMode
}) => {
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
        
        <div className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium">
          {DishCategoryLabels[dish.category]}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Hero Image */}
        <div className="h-64 bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center relative">
          <div className="text-8xl filter drop-shadow-lg">🍽️</div>
          
          {/* Availability Badge */}
          <div className={`absolute top-4 right-4 px-3 py-2 rounded-lg text-sm font-medium ${
            dish.isAvailable 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {dish.isAvailable ? 'Disponible' : 'Indisponible'}
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
              <h3 className="font-semibold text-gray-900">Composition</h3>
            </div>
            <div className="grid grid-cols-1 gap-2">
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

          {/* Additional Info */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <h4 className="font-medium text-blue-900 mb-2">Informations</h4>
            <div className="space-y-1 text-sm text-blue-800">
              <p>• Préparé avec des ingrédients frais</p>
              <p>• Peut contenir des traces d'allergènes</p>
              {!dish.isAvailable && (
                <p className="text-red-600 font-medium">• Temporairement indisponible</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};