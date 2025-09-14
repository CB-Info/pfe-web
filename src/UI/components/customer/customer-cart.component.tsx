import React from "react";
import { Dish } from "../../../data/models/dish.model";
import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface CartItem {
  dish: Dish;
  quantity: number;
}

interface CustomerCartProps {
  items: CartItem[];
  onQuantityChange: (dishId: string, quantity: number) => void;
  onOrderSubmit: () => void;
  isSubmitting: boolean;
  tableName: string;
}

export const CustomerCart: React.FC<CustomerCartProps> = ({
  items,
  onQuantityChange,
  onOrderSubmit,
  isSubmitting,
  tableName,
}) => {
  const totalPrice = items.reduce(
    (total, item) => total + item.dish.price * item.quantity,
    0
  );
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  const handleQuantityChange = (dishId: string, newQuantity: number) => {
    onQuantityChange(dishId, Math.max(0, newQuantity));
  };

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 text-center">
        <ShoppingCart className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 text-sm sm:text-base">
          Votre panier est vide
        </p>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          Ajoutez des plats pour commencer
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* En-tête du panier */}
      <div className="p-3 sm:p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
          <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
            Votre commande
          </h3>
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full whitespace-nowrap">
            {totalItems} {totalItems > 1 ? "articles" : "article"}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">{tableName}</p>
      </div>

      {/* Items du panier */}
      <div className="p-3 sm:p-4 space-y-2 sm:space-y-3 max-h-64 overflow-y-auto">
        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item.dish._id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 text-sm">
                  {item.dish.name}
                </h4>
                <p className="text-xs text-gray-500">
                  {item.dish.price.toFixed(2)}€ l'unité
                </p>
              </div>

              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  onClick={() =>
                    handleQuantityChange(item.dish._id, item.quantity - 1)
                  }
                  className="w-7 h-7 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center hover:bg-gray-300 active:bg-gray-400 transition-colors touch-manipulation"
                >
                  <Minus className="w-3 h-3" />
                </button>

                <span className="text-sm font-medium min-w-[1.5rem] text-center">
                  {item.quantity}
                </span>

                <button
                  onClick={() =>
                    handleQuantityChange(item.dish._id, item.quantity + 1)
                  }
                  className="w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 active:bg-blue-700 transition-colors touch-manipulation"
                >
                  <Plus className="w-3 h-3" />
                </button>

                <button
                  onClick={() => handleQuantityChange(item.dish._id, 0)}
                  className="w-7 h-7 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 active:bg-red-300 transition-colors ml-1 sm:ml-2 touch-manipulation"
                  title="Supprimer"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>

              <div className="text-sm font-semibold text-gray-900 ml-3 min-w-[3rem] text-right">
                {(item.dish.price * item.quantity).toFixed(2)}€
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Total et bouton de commande */}
      <div className="p-3 sm:p-4 border-t border-gray-100">
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <span className="text-base sm:text-lg font-semibold text-gray-900">
            Total
          </span>
          <span className="text-lg sm:text-xl font-bold text-blue-600">
            {totalPrice.toFixed(2)}€
          </span>
        </div>

        <button
          onClick={onOrderSubmit}
          disabled={isSubmitting || items.length === 0}
          className={`
            w-full py-4 px-4 rounded-lg font-medium transition-all duration-200 text-base
            touch-manipulation min-h-[48px] flex items-center justify-center
            ${
              isSubmitting || items.length === 0
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800"
            }
          `}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Envoi en cours...
            </div>
          ) : (
            "Commander"
          )}
        </button>
      </div>
    </div>
  );
};
