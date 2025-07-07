import React from "react";
import { Dish } from "../../../../data/models/dish.model";
import DishForm from "../../../components/forms/dish/dish.form";
import { DishFormMode } from "../../../components/forms/dish/dish.form.props";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface DishFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  mode: DishFormMode;
  dish?: Dish;
  onSuccess: () => void;
}

export const DishFormDrawer: React.FC<DishFormDrawerProps> = ({
  isOpen,
  onClose,
  mode,
  dish,
  onSuccess
}) => {
  const handleSuccess = () => {
    onSuccess();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900">
                {mode === DishFormMode.CREATE ? "Nouveau plat" : "Modifier le plat"}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors duration-200"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-hidden">
              <DishForm
                mode={mode}
                dish={dish}
                onSubmitSuccess={handleSuccess}
                onCancel={onClose}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};