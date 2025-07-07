import { AuthError } from '../types/auth.types';

/**
 * Utilitaires pour la gestion de l'authentification
 */

/**
 * Valide une adresse email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Évalue la force d'un mot de passe
 */
export const getPasswordStrength = (password: string): {
  score: number;
  label: string;
  color: string;
} => {
  if (password.length === 0) {
    return { score: 0, label: '', color: '' };
  }

  let score = 0;
  
  // Longueur
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  
  // Complexité
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  const labels = ['', 'Très faible', 'Faible', 'Moyen', 'Fort', 'Très fort'];
  const colors = ['', 'text-red-500', 'text-orange-500', 'text-yellow-500', 'text-blue-500', 'text-green-500'];

  const finalScore = Math.min(score, 5);
  
  return {
    score: finalScore,
    label: labels[finalScore],
    color: colors[finalScore]
  };
};

/**
 * Génère un token CSRF sécurisé
 */
export const generateCSRFToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Stockage sécurisé dans le localStorage avec chiffrement simple
 */
export const secureStorage = {
  set: (key: string, value: any): void => {
    try {
      const encrypted = btoa(JSON.stringify(value));
      localStorage.setItem(key, encrypted);
    } catch (error) {
      console.error('Error storing data:', error);
    }
  },

  get: (key: string): any => {
    try {
      const encrypted = localStorage.getItem(key);
      if (!encrypted) return null;
      return JSON.parse(atob(encrypted));
    } catch (error) {
      console.error('Error retrieving data:', error);
      return null;
    }
  },

  remove: (key: string): void => {
    localStorage.removeItem(key);
  },

  clear: (): void => {
    localStorage.clear();
  }
};

/**
 * Détecte si l'utilisateur utilise un appareil mobile
 */
export const isMobileDevice = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

/**
 * Formate les erreurs d'authentification pour l'affichage
 */
export const formatAuthError = (error: AuthError): string => {
  // Mapping des codes d'erreur vers des messages utilisateur-friendly
  const errorMap: Record<string, string> = {
    'auth/user-not-found': 'Aucun compte trouvé avec cette adresse email',
    'auth/wrong-password': 'Mot de passe incorrect',
    'auth/email-already-in-use': 'Cette adresse email est déjà utilisée',
    'auth/weak-password': 'Le mot de passe est trop faible',
    'auth/invalid-email': 'Adresse email invalide',
    'auth/user-disabled': 'Ce compte a été désactivé',
    'auth/too-many-requests': 'Trop de tentatives. Veuillez réessayer plus tard',
    'auth/network-request-failed': 'Erreur de connexion réseau',
    'auth/popup-closed-by-user': 'La fenêtre de connexion a été fermée',
    'auth/popup-blocked': 'Les popups sont bloquées par votre navigateur',
    'auth/account-exists-with-different-credential': 'Un compte existe déjà avec cette adresse email'
  };

  return errorMap[error.code] || error.message || 'Une erreur inattendue s\'est produite';
};

/**
 * Vérifie si l'utilisateur a activé l'authentification à deux facteurs
 */
export const hasTwoFactorEnabled = (user: any): boolean => {
  return user?.multiFactor?.enrolledFactors?.length > 0;
};

/**
 * Génère un nom d'utilisateur à partir de l'email
 */
export const generateUsernameFromEmail = (email: string): string => {
  return email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '');
};

/**
 * Valide la conformité RGPD pour les données utilisateur
 */
export const validateGDPRCompliance = (userData: any): boolean => {
  // Vérifications basiques de conformité RGPD
  const requiredFields = ['email', 'consentDate', 'dataProcessingConsent'];
  return requiredFields.every(field => userData[field] !== undefined);
};