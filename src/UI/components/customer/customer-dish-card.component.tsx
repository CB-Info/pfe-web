import React from "react";
import { Dish } from "../../../data/models/dish.model";
import { Clock, Users, Plus, Minus } from "lucide-react";
import { motion } from "framer-motion";

interface CustomerDishCardProps {
  dish: Dish;
  quantity: number;
  onQuantityChange: (dishId: string, quantity: number) => void;
}

export const CustomerDishCard: React.FC<CustomerDishCardProps> = ({
  dish,
  quantity,
  onQuantityChange,
}) => {
  const handleIncrease = () => {
    onQuantityChange(dish._id, quantity + 1);
  };

  const handleDecrease = () => {
    if (quantity > 0) {
      onQuantityChange(dish._id, quantity - 1);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4
        transition-all duration-200 hover:shadow-md
        ${!dish.isAvailable ? "opacity-60" : ""}
      `}
    >
      {/* Nom et prix */}
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-900 text-sm sm:text-base leading-tight flex-1 mr-2">
          {dish.name}
        </h3>
        <span className="text-lg font-bold text-blue-600 whitespace-nowrap">
          {dish.price.toFixed(2)}€
        </span>
      </div>

      {/* Description */}
      {dish.description && (
        <p className="text-sm text-gray-600 mb-3 leading-relaxed">
          {dish.description}
        </p>
      )}

      {/* Informations du plat */}
      <div className="flex items-center flex-wrap gap-2 sm:gap-4 text-xs text-gray-500 mb-3">
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
        <div
          className={`
          px-2 py-1 rounded-full text-xs font-medium
          ${
            dish.isAvailable
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }
        `}
        >
          {dish.isAvailable ? "Dispo" : "Indispo"}
        </div>
      </div>

      {/* Contrôles de quantité */}
      {dish.isAvailable && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleDecrease}
              disabled={quantity === 0}
              className={`
                w-10 h-10 rounded-full flex items-center justify-center
                transition-colors duration-200 touch-manipulation
                ${
                  quantity === 0
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300 active:bg-gray-400"
                }
              `}
            >
              <Minus className="w-4 h-4" />
            </button>

            <span className="text-lg font-semibold min-w-[2.5rem] text-center">
              {quantity}
            </span>

            <button
              onClick={handleIncrease}
              className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 active:bg-blue-700 transition-colors duration-200 touch-manipulation"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {quantity > 0 && (
            <div className="text-sm font-medium text-blue-600 ml-2">
              {(dish.price * quantity).toFixed(2)}€
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};
