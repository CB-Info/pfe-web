/**
 * Service de nettoyage des connexions SSE
 * Gère la fermeture propre des connexions lors de la fermeture de l'application
 */

import SSENotificationsService from "./sse-notifications.service";

class SSECleanupService {
  private static instance: SSECleanupService;
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): SSECleanupService {
    if (!SSECleanupService.instance) {
      SSECleanupService.instance = new SSECleanupService();
    }
    return SSECleanupService.instance;
  }

  /**
   * Initialiser les gestionnaires de nettoyage
   */
  public initialize(): void {
    if (this.isInitialized) return;

    const sseService = SSENotificationsService.getInstance();

    // Nettoyage lors de la fermeture de la page
    window.addEventListener("beforeunload", () => {
      console.log(
        "[SSECleanup] Fermeture de l'application, nettoyage des connexions SSE"
      );
      sseService.disconnectAll();
    });

    // Nettoyage lors de la fermeture de l'onglet (visibilitychange)
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        console.log("[SSECleanup] Page cachée, pause des connexions SSE");
        // Optionnel: déconnecter quand la page est cachée pour économiser les ressources
        // sseService.disconnectAll();
      } else if (document.visibilityState === "visible") {
        console.log("[SSECleanup] Page visible, reprise des connexions SSE");
        // Reconnecter automatiquement si nécessaire
        // Cette logique sera gérée par les composants individuels
      }
    });

    // Gestion des erreurs réseau globales
    window.addEventListener("online", () => {
      console.log("[SSECleanup] Connexion réseau rétablie");
      // Les reconnexions automatiques sont gérées par le service SSE
    });

    window.addEventListener("offline", () => {
      console.log("[SSECleanup] Connexion réseau perdue");
      // Les connexions SSE se fermeront automatiquement
    });

    this.isInitialized = true;
    console.log("[SSECleanup] Service de nettoyage SSE initialisé");
  }

  /**
   * Nettoyage manuel
   */
  public cleanup(): void {
    const sseService = SSENotificationsService.getInstance();
    sseService.disconnectAll();
    console.log("[SSECleanup] Nettoyage manuel effectué");
  }
}

export default SSECleanupService;
