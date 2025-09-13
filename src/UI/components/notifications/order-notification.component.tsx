/**
 * Composant de notification spécifique aux commandes
 * Affiche les notifications avec animations et informations détaillées
 */

import React from "react";
import { motion } from "framer-motion";
import {
  ChefHat,
  Clock,
  CheckCircle,
  AlertTriangle,
  Utensils,
} from "lucide-react";
import { NotificationEvent } from "../../../types/notifications.types";

interface OrderNotificationProps {
  event: NotificationEvent;
  onDismiss?: () => void;
  autoHide?: boolean;
  duration?: number;
  className?: string;
}

export const OrderNotification: React.FC<OrderNotificationProps> = ({
  event,
  onDismiss,
  autoHide = false,
  duration = 5000,
  className = "",
}) => {
  const getNotificationStyle = () => {
    switch (event.type) {
      case "order_created":
        return {
          color: "bg-blue-50 border-blue-200 text-blue-800",
          icon: Clock,
          iconColor: "text-blue-600",
          title: "Nouvelle commande",
        };
      case "order_status_updated":
        if (event.payload.status === "READY") {
          return {
            color: "bg-green-50 border-green-200 text-green-800",
            icon: CheckCircle,
            iconColor: "text-green-600",
            title: "Commande prête",
          };
        }
        return {
          color: "bg-orange-50 border-orange-200 text-orange-800",
          icon: ChefHat,
          iconColor: "text-orange-600",
          title: "Commande mise à jour",
        };
      case "order_ready_to_serve":
        return {
          color: "bg-green-50 border-green-200 text-green-800",
          icon: CheckCircle,
          iconColor: "text-green-600",
          title: "Prêt à servir !",
        };
      default:
        return {
          color: "bg-gray-50 border-gray-200 text-gray-800",
          icon: AlertTriangle,
          iconColor: "text-gray-600",
          title: "Notification",
        };
    }
  };

  const getStatusText = () => {
    switch (event.payload.status) {
      case "PENDING":
        return "En attente";
      case "IN_PREPARATION":
        return "En préparation";
      case "READY":
        return "Prête";
      case "DELIVERED":
        return "Livrée";
      case "FINISH":
        return "Terminée";
      case "CANCELLED":
        return "Annulée";
      default:
        return event.payload.status;
    }
  };

  const style = getNotificationStyle();
  const Icon = style.icon;

  // Auto-hide après la durée spécifiée
  React.useEffect(() => {
    if (autoHide && onDismiss) {
      const timer = setTimeout(onDismiss, duration);
      return () => clearTimeout(timer);
    }
  }, [autoHide, duration, onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={`
        relative rounded-lg border-2 p-4 shadow-lg backdrop-blur-sm
        ${style.color}
        ${className}
      `}
    >
      {/* Bouton de fermeture */}
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-black/10 transition-colors"
        >
          <span className="text-lg leading-none">×</span>
        </button>
      )}

      <div className="flex items-start gap-3">
        {/* Icône */}
        <div className={`p-2 rounded-full bg-white/50 ${style.iconColor}`}>
          <Icon className="w-5 h-5" />
        </div>

        {/* Contenu */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-sm">{style.title}</h3>
            <span className="text-xs opacity-75">
              {new Date(event.timestamp).toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          {/* Informations de la table */}
          <div className="flex items-center gap-4 mb-2">
            <div className="flex items-center gap-1">
              <Utensils className="w-4 h-4 opacity-75" />
              <span className="font-medium text-sm">
                {event.payload.tableNumber}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <Utensils className="w-4 h-4 opacity-75" />
              <span className="text-sm">
                {event.payload.dishCount} plat
                {event.payload.dishCount > 1 ? "s" : ""}
              </span>
            </div>

            <div className="text-sm font-medium">
              {event.payload.totalPrice.toFixed(2)}€
            </div>
          </div>

          {/* Message */}
          <p className="text-sm opacity-90 mb-2">{event.message}</p>

          {/* Statut */}
          <div className="flex items-center gap-2">
            <span className="text-xs opacity-75">Statut:</span>
            <span className="text-xs font-medium bg-white/30 px-2 py-1 rounded">
              {event.payload.previousStatus && (
                <>{event.payload.previousStatus} →</>
              )}
              {getStatusText()}
            </span>
          </div>

          {/* Barre de progression pour auto-hide */}
          {autoHide && (
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: duration / 1000, ease: "linear" }}
              className="absolute bottom-0 left-0 h-1 bg-current opacity-30 rounded-b-lg"
            />
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default OrderNotification;
