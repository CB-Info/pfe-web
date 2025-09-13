import FirebaseAuthManager from "../network/authentication/firebase.auth.manager";

export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Gère les réponses d'API et traite les erreurs d'authentification et d'autorisation
 * @param response - La réponse fetch à traiter
 * @returns La réponse si elle est OK
 * @throws ApiError en cas d'erreur
 */
export const handleApiResponse = async (
  response: Response
): Promise<Response> => {
  if (response.status === 401) {
    // Token expiré ou invalide - déclencher logout automatique
    try {
      await FirebaseAuthManager.getInstance().logout();
      // Recharger la page pour rediriger vers login
      window.location.reload();
    } catch (error) {
      console.error("Erreur lors de la déconnexion automatique:", error);
    }
    throw new ApiError(401, "Session expirée. Veuillez vous reconnecter.");
  }

  if (response.status === 403) {
    throw new ApiError(
      403,
      "Vous n'avez pas les permissions nécessaires pour cette action."
    );
  }

  if (response.status === 404) {
    throw new ApiError(404, "La ressource demandée n'a pas été trouvée.");
  }

  if (response.status >= 500) {
    throw new ApiError(
      response.status,
      "Erreur serveur. Veuillez réessayer plus tard."
    );
  }

  if (!response.ok) {
    // Essayer de récupérer le message d'erreur du serveur
    let errorMessage = `Erreur ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData.message) {
        errorMessage = errorData.message;
      }
    } catch {
      // Si on ne peut pas parser la réponse, utiliser le message par défaut
    }
    throw new ApiError(response.status, errorMessage);
  }

  return response;
};

/**
 * Wrapper pour les appels fetch avec gestion d'erreurs automatique
 * @param url - URL de l'API
 * @param options - Options fetch
 * @returns La réponse traitée
 */
export const apiCall = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  try {
    const response = await fetch(url, options);
    return await handleApiResponse(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    // Erreur réseau ou autre
    throw new ApiError(
      0,
      "Erreur de connexion. Vérifiez votre connexion internet.",
      error as Error
    );
  }
};

/**
 * Gère les erreurs API dans les composants React
 * @param error - L'erreur à traiter
 * @param addAlert - Fonction pour afficher une alerte
 * @param defaultMessage - Message par défaut si aucun message spécifique
 */
export const handleApiError = (
  error: unknown,
  addAlert: (alert: {
    severity: "error" | "warning" | "info" | "success";
    message: string;
    timeout?: number;
  }) => void,
  defaultMessage: string = "Une erreur est survenue"
) => {
  if (error instanceof ApiError) {
    addAlert({
      severity: error.status === 403 ? "warning" : "error",
      message: error.message,
      timeout: error.status === 403 ? 5 : 3,
    });
  } else {
    addAlert({
      severity: "error",
      message: defaultMessage,
      timeout: 3,
    });
  }
};
