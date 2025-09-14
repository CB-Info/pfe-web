/**
 * Gestionnaire d'authentification pour les clients QR
 * Contourne l'authentification Firebase pour les routes publiques
 */
class CustomerAuthManager {
  private static instance: CustomerAuthManager;

  private constructor() {}

  public static getInstance(): CustomerAuthManager {
    if (!CustomerAuthManager.instance) {
      CustomerAuthManager.instance = new CustomerAuthManager();
    }
    return CustomerAuthManager.instance;
  }

  /**
   * Retourne null pour indiquer qu'aucun token n'est nécessaire
   * pour les clients QR
   */
  async getToken(): Promise<string | null> {
    return null;
  }

  /**
   * Vérifie si nous sommes en mode client (sans authentification)
   */
  isCustomerMode(): boolean {
    return window.location.pathname.startsWith("/customer/");
  }
}

export default CustomerAuthManager;
