/**
 * Panneau de notifications
 * Affiche la liste des notifications avec actions (marquer comme lu, supprimer)
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  BellOff,
  Check,
  CheckCheck,
  X,
  Trash2,
  Volume2,
  VolumeX,
  Settings,
} from "lucide-react";
import { UINotification } from "../../../types/notifications.types";
import { NotificationBadge } from "./notification-badge.component";

interface NotificationPanelProps {
  notifications: UINotification[];
  unreadCount: number;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onRemove: (id: string) => void;
  onClearAll: () => void;
  soundEnabled: boolean;
  onToggleSound: (enabled: boolean) => void;
  soundVolume: number;
  onVolumeChange: (volume: number) => void;
  className?: string;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  notifications,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
  onRemove,
  onClearAll,
  soundEnabled,
  onToggleSound,
  soundVolume,
  onVolumeChange,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const getNotificationIcon = (type: UINotification["type"]) => {
    switch (type) {
      case "success":
        return "✅";
      case "warning":
        return "⚠️";
      case "error":
        return "❌";
      default:
        return "ℹ️";
    }
  };

  const getNotificationColor = (
    type: UINotification["type"],
    read: boolean
  ) => {
    const opacity = read ? "opacity-60" : "";
    switch (type) {
      case "success":
        return `bg-green-50 border-green-200 ${opacity}`;
      case "warning":
        return `bg-orange-50 border-orange-200 ${opacity}`;
      case "error":
        return `bg-red-50 border-red-200 ${opacity}`;
      default:
        return `bg-blue-50 border-blue-200 ${opacity}`;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={`relative ${className}`}>
      {/* Bouton de notification */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
        title="Notifications"
      >
        <Bell className="w-6 h-6 text-gray-600" />
        <div className="absolute -top-1 -right-1">
          <NotificationBadge count={unreadCount} />
        </div>
      </button>

      {/* Panneau de notifications */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Panneau */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Notifications
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowSettings(!showSettings)}
                      className="p-1 rounded hover:bg-gray-100 transition-colors"
                      title="Paramètres"
                    >
                      <Settings className="w-4 h-4 text-gray-500" />
                    </button>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-1 rounded hover:bg-gray-100 transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={onMarkAllAsRead}
                      className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                    >
                      <CheckCheck className="w-3 h-3" />
                      Tout marquer comme lu
                    </button>
                  )}
                  {notifications.length > 0 && (
                    <button
                      onClick={onClearAll}
                      className="flex items-center gap-1 px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      Tout effacer
                    </button>
                  )}
                </div>
              </div>

              {/* Paramètres */}
              <AnimatePresence>
                {showSettings && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-b border-gray-200 overflow-hidden"
                  >
                    <div className="p-4 space-y-3">
                      {/* Toggle son */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Sons</span>
                        <button
                          onClick={() => onToggleSound(!soundEnabled)}
                          className="flex items-center gap-1 text-sm"
                        >
                          {soundEnabled ? (
                            <Volume2 className="w-4 h-4 text-green-600" />
                          ) : (
                            <VolumeX className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      </div>

                      {/* Volume */}
                      {soundEnabled && (
                        <div className="space-y-1">
                          <label className="text-xs text-gray-600">
                            Volume
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={soundVolume}
                            onChange={(e) =>
                              onVolumeChange(parseFloat(e.target.value))
                            }
                            className="w-full"
                          />
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Liste des notifications */}
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <BellOff className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>Aucune notification</p>
                  </div>
                ) : (
                  <div className="space-y-1 p-2">
                    <AnimatePresence>
                      {notifications.map((notification) => (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className={`
                            p-3 rounded-lg border transition-all
                            ${getNotificationColor(
                              notification.type,
                              notification.read
                            )}
                            ${!notification.read ? "shadow-sm" : ""}
                          `}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm">
                                  {getNotificationIcon(notification.type)}
                                </span>
                                <h4 className="text-sm font-medium text-gray-900 truncate">
                                  {notification.title}
                                </h4>
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                                )}
                              </div>
                              <p className="text-xs text-gray-600 mb-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400">
                                {formatTime(notification.timestamp)}
                              </p>
                            </div>

                            <div className="flex items-center gap-1 ml-2">
                              {!notification.read && (
                                <button
                                  onClick={() => onMarkAsRead(notification.id)}
                                  className="p-1 rounded hover:bg-white/50 transition-colors"
                                  title="Marquer comme lu"
                                >
                                  <Check className="w-3 h-3 text-gray-500" />
                                </button>
                              )}
                              <button
                                onClick={() => onRemove(notification.id)}
                                className="p-1 rounded hover:bg-white/50 transition-colors"
                                title="Supprimer"
                              >
                                <X className="w-3 h-3 text-gray-500" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationPanel;
