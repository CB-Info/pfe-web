/**
 * Composant d'indicateur de statut de connexion SSE
 * Affiche l'état de la connexion temps réel avec des couleurs et icônes appropriées
 */

import React from "react";
import { motion } from "framer-motion";
import { Wifi, WifiOff, AlertTriangle } from "lucide-react";
import { SSEConnectionStatus } from "../../../types/notifications.types";

interface ConnectionStatusProps {
  status: SSEConnectionStatus;
  target: "kitchen" | "service";
  className?: string;
  showText?: boolean;
  size?: "small" | "medium" | "large";
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  status,
  target,
  className = "",
  showText = true,
  size = "medium",
}) => {
  const getStatusInfo = () => {
    if (status.connecting) {
      return {
        color: "text-green-600 bg-green-100",
        icon: Wifi,
        text: "Connecté",
        animate: false,
      };
    }

    if (status.connected) {
      return {
        color: "text-green-600 bg-green-100",
        icon: Wifi,
        text: "Connecté",
        animate: false,
      };
    }

    if (status.error) {
      return {
        color: "text-red-600 bg-red-100",
        icon: AlertTriangle,
        text: status.error,
        animate: false,
      };
    }

    return {
      color: "text-gray-600 bg-gray-100",
      icon: WifiOff,
      text: "Déconnecté",
      animate: false,
    };
  };

  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return {
          container: "px-2 py-1 text-xs",
          icon: "w-3 h-3",
          gap: "gap-1",
        };
      case "large":
        return {
          container: "px-4 py-2 text-base",
          icon: "w-5 h-5",
          gap: "gap-3",
        };
      default:
        return {
          container: "px-3 py-1.5 text-sm",
          icon: "w-4 h-4",
          gap: "gap-2",
        };
    }
  };

  const statusInfo = getStatusInfo();
  const sizeClasses = getSizeClasses();
  const Icon = statusInfo.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`
        inline-flex items-center rounded-full border font-medium
        ${statusInfo.color}
        ${sizeClasses.container}
        ${sizeClasses.gap}
        ${className}
      `}
      title={`Connexion ${target}: ${statusInfo.text}${
        status.lastHeartbeat
          ? ` (Dernière activité: ${status.lastHeartbeat.toLocaleTimeString()})`
          : ""
      }`}
    >
      <motion.div
        animate={statusInfo.animate ? { rotate: 360 } : {}}
        transition={
          statusInfo.animate
            ? { duration: 1, repeat: Infinity, ease: "linear" }
            : {}
        }
      >
        <Icon className={sizeClasses.icon} />
      </motion.div>

      {showText && <span className="font-medium">{statusInfo.text}</span>}
    </motion.div>
  );
};

export default ConnectionStatus;
