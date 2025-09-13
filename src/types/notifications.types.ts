/**
 * Types pour le système de notifications temps réel via Server-Sent Events (SSE)
 */

// Types des événements métier
export type NotificationEventType =
  | "order_created"
  | "order_status_updated"
  | "order_ready_to_serve";

// Cibles des notifications
export type NotificationTarget = "kitchen" | "service" | "all";

// Statuts des commandes
export type OrderStatus =
  | "PENDING"
  | "IN_PREPARATION"
  | "READY"
  | "DELIVERED"
  | "FINISH"
  | "CANCELLED";

// Interface principale pour les événements métier
export interface NotificationEvent {
  type: NotificationEventType;
  target: NotificationTarget;
  timestamp: string;
  payload: {
    orderId: string;
    tableNumber: string;
    status: OrderStatus;
    previousStatus?: OrderStatus; // pour les mises à jour de statut
    dishCount: number;
    totalPrice: number;
  };
  message: string;
}

// Interface pour les événements système
export interface SystemNotificationEvent {
  message: string;
  timestamp: string;
}

// Union type pour tous les événements possibles
export type SSEEvent = NotificationEvent | SystemNotificationEvent;

// Interface pour le statut de connexion SSE
export interface SSEConnectionStatus {
  connected: boolean;
  connecting: boolean;
  error: string | null;
  lastHeartbeat: Date | null;
}

// Interface pour les paramètres de connexion SSE
export interface SSEConnectionConfig {
  endpoint: string;
  reconnectInterval: number;
  maxReconnectAttempts: number;
  heartbeatTimeout: number;
}

// Types pour les hooks React
export interface UseSSENotificationsOptions {
  target: "kitchen" | "service";
  enabled?: boolean;
  onEvent?: (event: NotificationEvent) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: string) => void;
}

export interface UseSSENotificationsReturn {
  status: SSEConnectionStatus;
  events: NotificationEvent[];
  lastEvent: NotificationEvent | null;
  connect: () => void;
  disconnect: () => void;
  clearEvents: () => void;
}

// Interface pour les notifications UI
export interface UINotification {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  persistent?: boolean; // pour les notifications importantes qui ne disparaissent pas automatiquement
  sound?: boolean; // pour jouer un son
  data?: NotificationEvent; // données de l'événement original
}

// Interface pour le gestionnaire de notifications UI
export interface NotificationManager {
  notifications: UINotification[];
  unreadCount: number;
  addNotification: (
    notification: Omit<UINotification, "id" | "timestamp">
  ) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  removeNotification: (notificationId: string) => void;
  clearAll: () => void;
}

// Types pour les sons de notification
export type NotificationSoundType =
  | "new_order"
  | "order_ready"
  | "order_updated"
  | "error";

// Interface pour le gestionnaire de sons
export interface SoundManager {
  playSound: (soundType: NotificationSoundType) => void;
  setVolume: (volume: number) => void;
  setEnabled: (enabled: boolean) => void;
  isEnabled: boolean;
  volume: number;
}

// Utilitaires pour typer les événements
export function isNotificationEvent(
  event: SSEEvent
): event is NotificationEvent {
  return "type" in event && "target" in event && "payload" in event;
}

export function isSystemEvent(
  event: SSEEvent
): event is SystemNotificationEvent {
  return "message" in event && !("type" in event);
}
