/**
 * Hook React pour gérer les notifications SSE temps réel
 * Fournit une interface simple pour se connecter aux streams et gérer les événements
 */

import { useState, useEffect, useCallback, useRef } from "react";
import SSENotificationsService from "../services/sse-notifications.service";
import {
  NotificationEvent,
  SystemNotificationEvent,
  SSEConnectionStatus,
  UseSSENotificationsOptions,
  UseSSENotificationsReturn,
} from "../types/notifications.types";

export function useSSENotifications(
  options: UseSSENotificationsOptions
): UseSSENotificationsReturn {
  const {
    target,
    enabled = true,
    onEvent,
    onConnect,
    onDisconnect,
    onError,
  } = options;

  const [status, setStatus] = useState<SSEConnectionStatus>({
    connected: false,
    connecting: false,
    error: null,
    lastHeartbeat: null,
  });

  const [events, setEvents] = useState<NotificationEvent[]>([]);
  const [lastEvent, setLastEvent] = useState<NotificationEvent | null>(null);

  const sseService = useRef(SSENotificationsService.getInstance());
  const cleanupFunctionsRef = useRef<(() => void)[]>([]);

  // Fonction pour se connecter
  const connect = useCallback(() => {
    if (!enabled) return;

    sseService.current.connect(target).catch((error) => {
      console.error(
        `[useSSENotifications] Erreur de connexion ${target}:`,
        error
      );
      onError?.(error instanceof Error ? error.message : "Erreur de connexion");
    });
  }, [target, enabled, onError]);

  // Fonction pour se déconnecter
  const disconnect = useCallback(() => {
    sseService.current.disconnect(target);
  }, [target]);

  // Fonction pour vider les événements
  const clearEvents = useCallback(() => {
    setEvents([]);
    setLastEvent(null);
  }, []);

  // Gestionnaire d'événements
  const handleEvent = useCallback(
    (event: NotificationEvent) => {
      console.log(`[useSSENotifications] Nouvel événement ${target}:`, event);

      setLastEvent(event);
      setEvents((prev) => [...prev, event]);

      onEvent?.(event);
    },
    [target, onEvent]
  );

  // Gestionnaire d'événements système
  const handleSystemEvent = useCallback(
    (event: SystemNotificationEvent) => {
      console.log(`[useSSENotifications] Événement système ${target}:`, event);

      if (event.message.includes("Connected")) {
        onConnect?.();
      }
    },
    [target, onConnect]
  );

  // Gestionnaire de changement de statut
  const handleStatusChange = useCallback(
    (newStatus: SSEConnectionStatus) => {
      console.log(
        `[useSSENotifications] Changement de statut ${target}:`,
        newStatus
      );

      setStatus(newStatus);

      if (newStatus.error && !newStatus.connected) {
        onError?.(newStatus.error);
      }

      if (!newStatus.connected && status.connected) {
        onDisconnect?.();
      }
    },
    [target, status.connected, onError, onDisconnect]
  );

  // Configuration des listeners et connexion
  useEffect(() => {
    if (!enabled) return;

    // Nettoyer les listeners précédents
    cleanupFunctionsRef.current.forEach((cleanup) => cleanup());
    cleanupFunctionsRef.current = [];

    // Configurer les nouveaux listeners
    const eventCleanup = sseService.current.addEventListener(
      target,
      handleEvent
    );
    const systemCleanup = sseService.current.addSystemListener(
      target,
      handleSystemEvent
    );
    const statusCleanup = sseService.current.addStatusListener(
      target,
      handleStatusChange
    );

    cleanupFunctionsRef.current = [eventCleanup, systemCleanup, statusCleanup];

    // Obtenir le statut initial
    const initialStatus = sseService.current.getConnectionStatus(target);
    setStatus(initialStatus);

    // Se connecter si pas déjà connecté
    if (!initialStatus.connected && !initialStatus.connecting) {
      connect();
    }

    return () => {
      cleanupFunctionsRef.current.forEach((cleanup) => cleanup());
      cleanupFunctionsRef.current = [];
    };
  }, [
    target,
    enabled,
    handleEvent,
    handleSystemEvent,
    handleStatusChange,
    connect,
  ]);

  // Nettoyage lors du démontage
  useEffect(() => {
    return () => {
      cleanupFunctionsRef.current.forEach((cleanup) => cleanup());
    };
  }, []);

  return {
    status,
    events,
    lastEvent,
    connect,
    disconnect,
    clearEvents,
  };
}
