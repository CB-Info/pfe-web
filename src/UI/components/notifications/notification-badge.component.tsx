/**
 * Composant de badge de notification
 * Affiche le nombre de notifications non lues avec animation
 */

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface NotificationBadgeProps {
  count: number;
  className?: string;
  size?: "small" | "medium" | "large";
  color?: "red" | "orange" | "blue" | "green";
  showZero?: boolean;
  maxCount?: number;
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  count,
  className = "",
  size = "medium",
  color = "red",
  showZero = false,
  maxCount = 99,
}) => {
  const shouldShow = showZero || count > 0;
  const displayCount = count > maxCount ? `${maxCount}+` : count.toString();

  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return "min-w-[16px] h-4 text-xs px-1";
      case "large":
        return "min-w-[24px] h-6 text-sm px-2";
      default:
        return "min-w-[20px] h-5 text-xs px-1.5";
    }
  };

  const getColorClasses = () => {
    switch (color) {
      case "orange":
        return "bg-orange-500 text-white";
      case "blue":
        return "bg-blue-500 text-white";
      case "green":
        return "bg-green-500 text-white";
      default:
        return "bg-red-500 text-white";
    }
  };

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={`
            inline-flex items-center justify-center
            rounded-full font-bold
            ${getSizeClasses()}
            ${getColorClasses()}
            ${className}
          `}
        >
          <motion.span
            key={count} // Force re-render on count change
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {displayCount}
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationBadge;
