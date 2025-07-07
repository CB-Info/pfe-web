import React from 'react';
import { Dish } from '../../../../data/models/dish.model';
import { DishCategoryLabels } from '../../../../data/dto/dish.dto';
import { ConfirmationModal } from '../../modals/confirmation.modal';
import { Clock, Users, Tag } from 'lucide-react';

interface DishPreviewModalProps {
  dish: Dish | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DishPreviewModal: React.FC<DishPreviewModalProps> = ({
  dish,
  isOpen,
  onClose
}) => {
  if (!dish) return null;

  return (
    <ConfirmationModal
      modalName="dish-preview-modal"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="p-6 max-w-md">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold text-gray-900">{dish.name}</h2>
          <span className="text-2xl font-bold text-blue-600">{dish.price}€</span>
        </div>

        {/* Image Placeholder */}
        <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center mb-4">
          <div className="text-6xl">🍽️</div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <h3 className="font-medium text-gray-900 mb-2">Description</h3>
          <p className="text-gray-600 text-sm leading-relaxed">{dish.description}</p>
        </div>

        {/* Meta Information */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-xs text-gray-500">Catégorie</p>
              <p className="text-sm font-medium">{DishCategoryLabels[dish.category]}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-xs text-gray-500">Ingrédients</p>
              <p className="text-sm font-medium">{dish.ingredients.length} ingrédients</p>
            </div>
          </div>

          {dish.timeCook && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Temps de cuisson</p>
                <p className="text-sm font-medium">{dish.timeCook} minutes</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded-full ${dish.isAvailable ? 'bg-green-500' : 'bg-red-500'}`} />
            <div>
              <p className="text-xs text-gray-500">Statut</p>
              <p className="text-sm font-medium">{dish.isAvailable ? 'Disponible' : 'Indisponible'}</p>
            </div>
          </div>
        </div>

        {/* Ingredients List */}
        <div className="mb-6">
          <h3 className="font-medium text-gray-900 mb-2">Ingrédients</h3>
          <div className="flex flex-wrap gap-2">
            {dish.ingredients.map((ingredient, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
              >
                {ingredient.ingredient.name}
                {ingredient.quantity && ` (${ingredient.quantity}${ingredient.unity})`}
              </span>
            ))}
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors duration-200"
        >
          Fermer
        </button>
      </div>
    </ConfirmationModal>
  );
};