/**
 * Hook pour gérer les notifications UI et les sons
 * Transforme les événements SSE en notifications utilisateur
 */

import { useState, useCallback, useRef } from "react";
import {
  UINotification,
  NotificationManager,
  NotificationEvent,
  NotificationSoundType,
} from "../types/notifications.types";

interface UseNotificationManagerOptions {
  maxNotifications?: number;
  soundEnabled?: boolean;
  soundVolume?: number;
}

interface UseNotificationManagerReturn extends NotificationManager {
  soundEnabled: boolean;
  soundVolume: number;
  setSoundEnabled: (enabled: boolean) => void;
  setSoundVolume: (volume: number) => void;
  createNotificationFromEvent: (event: NotificationEvent) => void;
}

export function useNotificationManager(
  options: UseNotificationManagerOptions = {}
): UseNotificationManagerReturn {
  const {
    maxNotifications = 50,
    soundEnabled: initialSoundEnabled = true,
    soundVolume: initialSoundVolume = 0.7,
  } = options;

  const [notifications, setNotifications] = useState<UINotification[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(initialSoundEnabled);
  const [soundVolume, setSoundVolume] = useState(initialSoundVolume);

  const audioContextRef = useRef<AudioContext | null>(null);

  // Calculer le nombre de notifications non lues
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Générer un ID unique pour les notifications
  const generateId = useCallback(() => {
    return `notification-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
  }, []);

  // Ajouter une notification
  const addNotification = useCallback(
    (notification: Omit<UINotification, "id" | "timestamp">) => {
      const newNotification: UINotification = {
        ...notification,
        id: generateId(),
        timestamp: new Date(),
      };

      setNotifications((prev) => {
        const updated = [newNotification, ...prev];
        // Limiter le nombre de notifications
        return updated.slice(0, maxNotifications);
      });

      // Jouer un son si activé
      if (notification.sound && soundEnabled) {
        const soundType = getSoundTypeForNotification(notification.type);
        playSound(soundType);
      }

      return newNotification.id;
    },
    [generateId, maxNotifications, soundEnabled]
  );

  // Marquer une notification comme lue
  const markAsRead = useCallback((notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
  }, []);

  // Marquer toutes les notifications comme lues
  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  // Supprimer une notification
  const removeNotification = useCallback((notificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  }, []);

  // Vider toutes les notifications
  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Initialiser l'AudioContext
  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      const AudioContextClass =
        window.AudioContext ||
        (window as typeof window & { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      audioContextRef.current = new AudioContextClass();
    }
    return audioContextRef.current;
  }, []);

  // Jouer un son
  const playSound = useCallback(
    (soundType: NotificationSoundType) => {
      if (!soundEnabled) return;

      try {
        const audioContext = initAudioContext();
        if (!audioContext) {
          console.warn("[NotificationManager] AudioContext non disponible");
          return;
        }

        // Utiliser des sons générés programmatiquement pour éviter les fichiers externes
        const frequency = getSoundFrequency(soundType);
        const duration = getSoundDuration(soundType);

        // Créer un oscillateur
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(
          frequency,
          audioContext.currentTime
        );
        oscillator.type = "sine";

        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(
          soundVolume * 0.3,
          audioContext.currentTime + 0.01
        );
        gainNode.gain.exponentialRampToValueAtTime(
          0.001,
          audioContext.currentTime + duration
        );

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
      } catch (error) {
        console.warn(
          "[NotificationManager] Erreur lors de la lecture du son:",
          error
        );
      }
    },
    [soundEnabled, soundVolume, initAudioContext]
  );

  // Créer une notification à partir d'un événement SSE
  const createNotificationFromEvent = useCallback(
    (event: NotificationEvent) => {
      const notification = mapEventToNotification(event);
      addNotification(notification);
    },
    [addNotification]
  );

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    soundEnabled,
    soundVolume,
    setSoundEnabled,
    setSoundVolume,
    createNotificationFromEvent,
  };
}

// Fonctions utilitaires

function getSoundTypeForNotification(
  type: UINotification["type"]
): NotificationSoundType {
  switch (type) {
    case "success":
      return "order_ready";
    case "info":
      return "new_order";
    case "warning":
      return "order_updated";
    case "error":
      return "error";
    default:
      return "new_order";
  }
}

function getSoundFrequency(soundType: NotificationSoundType): number {
  switch (soundType) {
    case "new_order":
      return 800; // Note plus haute pour attirer l'attention
    case "order_ready":
      return 600; // Note moyenne, positive
    case "order_updated":
      return 500; // Note plus basse, informative
    case "error":
      return 300; // Note grave pour les erreurs
    default:
      return 600;
  }
}

function getSoundDuration(soundType: NotificationSoundType): number {
  switch (soundType) {
    case "new_order":
      return 0.3; // Son court et percutant
    case "order_ready":
      return 0.5; // Son plus long pour les commandes prêtes
    case "order_updated":
      return 0.2; // Son très court pour les mises à jour
    case "error":
      return 0.8; // Son plus long pour les erreurs
    default:
      return 0.3;
  }
}

function mapEventToNotification(
  event: NotificationEvent
): Omit<UINotification, "id" | "timestamp"> {
  const baseNotification = {
    read: false,
    sound: true,
    data: event,
  };

  switch (event.type) {
    case "order_created":
      return {
        ...baseNotification,
        type: "info" as const,
        title: "Nouvelle commande",
        message: `Commande reçue pour ${event.payload.tableNumber}`,
        persistent: true,
      };

    case "order_status_updated":
      return {
        ...baseNotification,
        type: "info" as const,
        title: "Commande mise à jour",
        message: `${event.payload.tableNumber}: ${event.payload.previousStatus} → ${event.payload.status}`,
        sound: event.payload.status === "READY", // Son seulement si prête
      };

    case "order_ready_to_serve":
      return {
        ...baseNotification,
        type: "success" as const,
        title: "Commande prête !",
        message: `${event.payload.tableNumber} - ${event.payload.dishCount} plat(s) prêt(s) à servir`,
        persistent: true,
      };

    default:
      return {
        ...baseNotification,
        type: "info" as const,
        title: "Notification",
        message: event.message,
      };
  }
}
