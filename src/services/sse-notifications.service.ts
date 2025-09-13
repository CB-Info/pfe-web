/**
 * Service de gestion des connexions Server-Sent Events (SSE) pour les notifications temps réel
 * Gère l'authentification, la reconnexion automatique et la distribution des événements
 */

import FirebaseAuthManager from "../network/authentication/firebase.auth.manager";
import {
  NotificationEvent,
  SystemNotificationEvent,
  SSEEvent,
  SSEConnectionStatus,
  SSEConnectionConfig,
  isNotificationEvent,
  isSystemEvent,
} from "../types/notifications.types";

export type SSETarget = "kitchen" | "service";

/**
 * Interface pour notre EventSource-like personnalisé
 */
interface CustomEventSource {
  readyState: number;
  url: string;
  withCredentials: boolean;
  CONNECTING: number;
  OPEN: number;
  CLOSED: number;
  onopen: ((event: Event) => void) | null;
  onmessage: ((event: MessageEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  addEventListener: typeof EventTarget.prototype.addEventListener;
  removeEventListener: typeof EventTarget.prototype.removeEventListener;
  dispatchEvent: typeof EventTarget.prototype.dispatchEvent;
  close: () => void;
}

class SSENotificationsService {
  private static instance: SSENotificationsService;
  private eventSources: Map<SSETarget, EventSource> = new Map();
  private connectionStatus: Map<SSETarget, SSEConnectionStatus> = new Map();
  private eventListeners: Map<
    SSETarget,
    Set<(event: NotificationEvent) => void>
  > = new Map();
  private systemListeners: Map<
    SSETarget,
    Set<(event: SystemNotificationEvent) => void>
  > = new Map();
  private statusListeners: Map<
    SSETarget,
    Set<(status: SSEConnectionStatus) => void>
  > = new Map();
  private reconnectTimeouts: Map<SSETarget, NodeJS.Timeout> = new Map();
  private heartbeatTimeouts: Map<SSETarget, NodeJS.Timeout> = new Map();

  private readonly config: SSEConnectionConfig = {
    endpoint: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
    reconnectInterval: 5000, // 5 secondes
    maxReconnectAttempts: 10,
    heartbeatTimeout: 45000, // 45 secondes (heartbeat toutes les 30s + marge)
  };

  private constructor() {
    // Initialiser les status par défaut
    this.connectionStatus.set("kitchen", {
      connected: false,
      connecting: false,
      error: null,
      lastHeartbeat: null,
    });
    this.connectionStatus.set("service", {
      connected: false,
      connecting: false,
      error: null,
      lastHeartbeat: null,
    });

    // Initialiser les collections de listeners
    this.eventListeners.set("kitchen", new Set());
    this.eventListeners.set("service", new Set());
    this.systemListeners.set("kitchen", new Set());
    this.systemListeners.set("service", new Set());
    this.statusListeners.set("kitchen", new Set());
    this.statusListeners.set("service", new Set());
  }

  public static getInstance(): SSENotificationsService {
    if (!SSENotificationsService.instance) {
      SSENotificationsService.instance = new SSENotificationsService();
    }
    return SSENotificationsService.instance;
  }

  /**
   * Se connecter au stream SSE pour un target donné
   */
  public async connect(target: SSETarget): Promise<void> {
    try {
      // Si déjà connecté, ne rien faire
      if (this.connectionStatus.get(target)?.connected) {
        console.log(`[SSE] Déjà connecté au stream ${target}`);
        return;
      }

      // Fermer la connexion existante si elle existe
      this.disconnect(target);

      // Mettre à jour le statut
      this.updateConnectionStatus(target, {
        connecting: true,
        error: null,
      });

      // Obtenir le token d'authentification
      const token = await FirebaseAuthManager.getInstance().getToken();
      if (!token) {
        throw new Error("Token d'authentification manquant");
      }

      // Construire l'URL de l'endpoint
      const endpoint = this.getEndpointUrl(target);
      console.log(`[SSE] Connexion au stream ${target}: ${endpoint}`);

      // Créer l'EventSource avec authentification
      // Solution robuste: fetch + ReadableStream avec gestion CORS améliorée
      const eventSource = await this.createAuthenticatedEventSource(
        endpoint,
        token
      );

      // Configurer les gestionnaires d'événements
      eventSource.onopen = () => {
        console.log(`[SSE] Connexion établie pour ${target}`);
        this.updateConnectionStatus(target, {
          connected: true,
          connecting: false,
          error: null,
        });
        this.resetHeartbeatTimeout(target);
      };

      eventSource.onmessage = (event) => {
        this.handleMessage(target, event);
      };

      eventSource.onerror = (error) => {
        console.error(`[SSE] Erreur de connexion pour ${target}:`, error);
        this.handleConnectionError(target, error);
      };

      // Stocker l'EventSource
      this.eventSources.set(target, eventSource);
    } catch (error) {
      console.error(`[SSE] Erreur lors de la connexion ${target}:`, error);

      let errorMessage = "Erreur de connexion inconnue";
      if (error instanceof Error) {
        errorMessage = error.message;

        // Diagnostics spécifiques pour les erreurs CORS
        if (
          error.message.includes("CORS") ||
          error.message.includes("blocked")
        ) {
          errorMessage = "Erreur CORS - Vérifiez la configuration du backend";
          console.error(`[SSE] Problème CORS détecté pour ${target}. Le backend doit autoriser:
- Origin: ${window.location.origin}
- Headers: Authorization, Accept
- Methods: GET
- Credentials: true`);
        }
      }

      this.updateConnectionStatus(target, {
        connected: false,
        connecting: false,
        error: errorMessage,
      });

      // Programmer une reconnexion (sauf pour les erreurs CORS qui nécessitent une correction backend)
      if (!errorMessage.includes("CORS")) {
        this.scheduleReconnect(target);
      }
    }
  }

  /**
   * Se déconnecter du stream SSE
   */
  public disconnect(target: SSETarget): void {
    console.log(`[SSE] Déconnexion du stream ${target}`);

    // Fermer l'EventSource
    const eventSource = this.eventSources.get(target);
    if (eventSource) {
      eventSource.close();
      this.eventSources.delete(target);
    }

    // Annuler les timeouts
    const reconnectTimeout = this.reconnectTimeouts.get(target);
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout);
      this.reconnectTimeouts.delete(target);
    }

    const heartbeatTimeout = this.heartbeatTimeouts.get(target);
    if (heartbeatTimeout) {
      clearTimeout(heartbeatTimeout);
      this.heartbeatTimeouts.delete(target);
    }

    // Mettre à jour le statut
    this.updateConnectionStatus(target, {
      connected: false,
      connecting: false,
      error: null,
    });
  }

  /**
   * Déconnecter tous les streams
   */
  public disconnectAll(): void {
    this.disconnect("kitchen");
    this.disconnect("service");
  }

  /**
   * Obtenir le statut de connexion pour un target
   */
  public getConnectionStatus(target: SSETarget): SSEConnectionStatus {
    return (
      this.connectionStatus.get(target) || {
        connected: false,
        connecting: false,
        error: null,
        lastHeartbeat: null,
      }
    );
  }

  /**
   * Écouter les événements de notification métier
   */
  public addEventListener(
    target: SSETarget,
    listener: (event: NotificationEvent) => void
  ): () => void {
    const listeners = this.eventListeners.get(target);
    if (listeners) {
      listeners.add(listener);
    }

    // Retourner une fonction de nettoyage
    return () => {
      const listeners = this.eventListeners.get(target);
      if (listeners) {
        listeners.delete(listener);
      }
    };
  }

  /**
   * Écouter les événements système
   */
  public addSystemListener(
    target: SSETarget,
    listener: (event: SystemNotificationEvent) => void
  ): () => void {
    const listeners = this.systemListeners.get(target);
    if (listeners) {
      listeners.add(listener);
    }

    return () => {
      const listeners = this.systemListeners.get(target);
      if (listeners) {
        listeners.delete(listener);
      }
    };
  }

  /**
   * Écouter les changements de statut de connexion
   */
  public addStatusListener(
    target: SSETarget,
    listener: (status: SSEConnectionStatus) => void
  ): () => void {
    const listeners = this.statusListeners.get(target);
    if (listeners) {
      listeners.add(listener);
    }

    return () => {
      const listeners = this.statusListeners.get(target);
      if (listeners) {
        listeners.delete(listener);
      }
    };
  }

  // Méthodes privées

  /**
   * Créer un EventSource avec authentification via headers
   * Utilise fetch + ReadableStream comme solution de contournement
   */
  private async createAuthenticatedEventSource(
    url: string,
    token: string
  ): Promise<EventSource> {
    console.log("[SSE] Tentative de connexion SSE avec authentification:", url);

    try {
      // Tentative 1: fetch + ReadableStream avec headers Authorization
      return await this.createStreamFromFetch(url, token);
    } catch (error) {
      console.warn(
        "[SSE] Échec avec headers Authorization, tentative avec query param:",
        error
      );

      // Tentative 2: Fallback avec EventSource natif + token en query param
      // (si le backend supporte cette méthode d'authentification)
      try {
        const urlWithToken = `${url}${
          url.includes("?") ? "&" : "?"
        }token=${encodeURIComponent(token)}`;
        console.log("[SSE] Fallback: EventSource avec token en query param");

        const eventSource = new EventSource(urlWithToken);
        return eventSource;
      } catch (fallbackError) {
        console.error("[SSE] Échec également avec query param:", fallbackError);
        throw error; // Relancer l'erreur originale
      }
    }
  }

  /**
   * Créer un EventSource-like avec fetch + ReadableStream
   */
  private async createStreamFromFetch(
    url: string,
    token: string
  ): Promise<EventSource> {
    console.log(
      "[SSE] Création du stream fetch avec token:",
      token ? "✓" : "✗"
    );

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "text/event-stream",
        // Supprimer Cache-Control qui cause le problème CORS
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}`);
    }

    if (!response.body) {
      throw new Error("Response body manquant");
    }

    // Créer un EventSource-like object
    const eventSource = this.createEventSourceLike(response.body);
    return eventSource;
  }

  /**
   * Créer un objet EventSource-like à partir d'un ReadableStream
   */
  private createEventSourceLike(
    stream: ReadableStream<Uint8Array>
  ): EventSource {
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    // Créer un EventTarget pour simuler EventSource
    const eventTarget = new EventTarget();

    // Propriétés EventSource
    const eventSourceLike: CustomEventSource = {
      readyState: EventSource.OPEN,
      url: "",
      withCredentials: false,
      CONNECTING: EventSource.CONNECTING,
      OPEN: EventSource.OPEN,
      CLOSED: EventSource.CLOSED,
      onopen: null,
      onmessage: null,
      onerror: null,
      addEventListener: eventTarget.addEventListener.bind(eventTarget),
      removeEventListener: eventTarget.removeEventListener.bind(eventTarget),
      dispatchEvent: eventTarget.dispatchEvent.bind(eventTarget),
      close: () => {
        reader.cancel();
        eventSourceLike.readyState = EventSource.CLOSED;
      },
    };

    // Traiter le stream
    const processStream = async () => {
      try {
        // Déclencher l'événement open
        const openEvent = new Event("open");
        if (eventSourceLike.onopen) {
          eventSourceLike.onopen(openEvent);
        }
        eventTarget.dispatchEvent(openEvent);

        let done = false;
        while (!done) {
          const result = await reader.read();
          done = result.done;
          const value = result.value;

          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              const messageEvent = new MessageEvent("message", { data });

              if (eventSourceLike.onmessage) {
                eventSourceLike.onmessage(messageEvent);
              }
              eventTarget.dispatchEvent(messageEvent);
            }
          }
        }
      } catch (error) {
        console.error("[SSE] Erreur lors de la lecture du stream:", error);
        const errorEvent = new Event("error");
        if (eventSourceLike.onerror) {
          eventSourceLike.onerror(errorEvent);
        }
        eventTarget.dispatchEvent(errorEvent);
      }
    };

    // Démarrer le traitement
    processStream();

    return eventSourceLike as EventSource;
  }

  private getEndpointUrl(target: SSETarget): string {
    const baseUrl = this.config.endpoint;
    switch (target) {
      case "kitchen":
        return `${baseUrl}/notifications/kitchen/stream`;
      case "service":
        return `${baseUrl}/notifications/service/stream`;
      default:
        throw new Error(`Target SSE non supporté: ${target}`);
    }
  }

  private handleMessage(target: SSETarget, event: MessageEvent): void {
    try {
      const data: SSEEvent = JSON.parse(event.data);

      if (isNotificationEvent(data)) {
        // Événement métier
        console.log(`[SSE] Événement reçu pour ${target}:`, data);
        this.notifyEventListeners(target, data);
      } else if (isSystemEvent(data)) {
        // Événement système
        if (data.message.includes("Connected")) {
          console.log(`[SSE] Connexion confirmée pour ${target}`);
        } else {
          // Heartbeat
          this.updateConnectionStatus(target, {
            lastHeartbeat: new Date(),
          });
          this.resetHeartbeatTimeout(target);
        }
        this.notifySystemListeners(target, data);
      } else {
        console.warn(`[SSE] Événement non reconnu pour ${target}:`, data);
      }
    } catch (error) {
      console.error(
        `[SSE] Erreur lors du parsing du message pour ${target}:`,
        error,
        event.data
      );
    }
  }

  private handleConnectionError(target: SSETarget, error: Event): void {
    console.error(`[SSE] Erreur de connexion pour ${target}:`, error);

    this.updateConnectionStatus(target, {
      connected: false,
      connecting: false,
      error: "Connexion perdue",
    });

    // Fermer proprement la connexion
    this.disconnect(target);

    // Programmer une reconnexion
    this.scheduleReconnect(target);
  }

  private scheduleReconnect(target: SSETarget): void {
    // Éviter les reconnexions multiples
    const existingTimeout = this.reconnectTimeouts.get(target);
    if (existingTimeout) {
      return;
    }

    console.log(
      `[SSE] Reconnexion programmée pour ${target} dans ${this.config.reconnectInterval}ms`
    );

    const timeout = setTimeout(() => {
      this.reconnectTimeouts.delete(target);
      console.log(`[SSE] Tentative de reconnexion pour ${target}`);
      this.connect(target).catch((error) => {
        console.error(`[SSE] Échec de la reconnexion pour ${target}:`, error);
      });
    }, this.config.reconnectInterval);

    this.reconnectTimeouts.set(target, timeout);
  }

  private resetHeartbeatTimeout(target: SSETarget): void {
    // Annuler le timeout existant
    const existingTimeout = this.heartbeatTimeouts.get(target);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    // Programmer un nouveau timeout
    const timeout = setTimeout(() => {
      console.warn(`[SSE] Timeout heartbeat pour ${target}`);
      this.updateConnectionStatus(target, {
        error: "Timeout heartbeat",
      });
      // Déclencher une reconnexion
      this.handleConnectionError(target, new Event("heartbeat-timeout"));
    }, this.config.heartbeatTimeout);

    this.heartbeatTimeouts.set(target, timeout);
  }

  private updateConnectionStatus(
    target: SSETarget,
    updates: Partial<SSEConnectionStatus>
  ): void {
    const currentStatus = this.connectionStatus.get(target);
    if (!currentStatus) return;

    const newStatus: SSEConnectionStatus = {
      ...currentStatus,
      ...updates,
    };

    this.connectionStatus.set(target, newStatus);
    this.notifyStatusListeners(target, newStatus);
  }

  private notifyEventListeners(
    target: SSETarget,
    event: NotificationEvent
  ): void {
    const listeners = this.eventListeners.get(target);
    if (listeners) {
      listeners.forEach((listener) => {
        try {
          listener(event);
        } catch (error) {
          console.error(
            `[SSE] Erreur dans le listener d'événement pour ${target}:`,
            error
          );
        }
      });
    }
  }

  private notifySystemListeners(
    target: SSETarget,
    event: SystemNotificationEvent
  ): void {
    const listeners = this.systemListeners.get(target);
    if (listeners) {
      listeners.forEach((listener) => {
        try {
          listener(event);
        } catch (error) {
          console.error(
            `[SSE] Erreur dans le listener système pour ${target}:`,
            error
          );
        }
      });
    }
  }

  private notifyStatusListeners(
    target: SSETarget,
    status: SSEConnectionStatus
  ): void {
    const listeners = this.statusListeners.get(target);
    if (listeners) {
      listeners.forEach((listener) => {
        try {
          listener(status);
        } catch (error) {
          console.error(
            `[SSE] Erreur dans le listener de statut pour ${target}:`,
            error
          );
        }
      });
    }
  }
}

export default SSENotificationsService;
