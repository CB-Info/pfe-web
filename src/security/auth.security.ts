/**
 * Mesures de sécurité pour l'authentification OAuth
 */

import { AuthError } from '../types/auth.types';

export class AuthSecurity {
  private static readonly MAX_LOGIN_ATTEMPTS = 5;
  private static readonly LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
  private static readonly SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 heures

  /**
   * Gestion des tentatives de connexion
   */
  static trackLoginAttempt(email: string, success: boolean): void {
    const key = `login_attempts_${email}`;
    const attempts = this.getLoginAttempts(email);

    if (success) {
      // Réinitialiser les tentatives en cas de succès
      localStorage.removeItem(key);
      localStorage.removeItem(`lockout_${email}`);
    } else {
      // Incrémenter les tentatives échouées
      const newAttempts = {
        count: attempts.count + 1,
        lastAttempt: Date.now()
      };
      
      localStorage.setItem(key, JSON.stringify(newAttempts));

      // Verrouiller le compte si trop de tentatives
      if (newAttempts.count >= this.MAX_LOGIN_ATTEMPTS) {
        localStorage.setItem(`lockout_${email}`, Date.now().toString());
      }
    }
  }

  /**
   * Vérifie si un compte est verrouillé
   */
  static isAccountLocked(email: string): boolean {
    const lockoutTime = localStorage.getItem(`lockout_${email}`);
    if (!lockoutTime) return false;

    const lockoutTimestamp = parseInt(lockoutTime);
    const now = Date.now();

    if (now - lockoutTimestamp > this.LOCKOUT_DURATION) {
      // Déverrouiller le compte
      localStorage.removeItem(`lockout_${email}`);
      localStorage.removeItem(`login_attempts_${email}`);
      return false;
    }

    return true;
  }

  /**
   * Récupère le nombre de tentatives de connexion
   */
  static getLoginAttempts(email: string): { count: number; lastAttempt: number } {
    const key = `login_attempts_${email}`;
    const stored = localStorage.getItem(key);
    
    if (!stored) {
      return { count: 0, lastAttempt: 0 };
    }

    try {
      return JSON.parse(stored);
    } catch {
      return { count: 0, lastAttempt: 0 };
    }
  }

  /**
   * Calcule le temps restant avant déverrouillage
   */
  static getLockoutTimeRemaining(email: string): number {
    const lockoutTime = localStorage.getItem(`lockout_${email}`);
    if (!lockoutTime) return 0;

    const lockoutTimestamp = parseInt(lockoutTime);
    const now = Date.now();
    const remaining = this.LOCKOUT_DURATION - (now - lockoutTimestamp);

    return Math.max(0, remaining);
  }

  /**
   * Valide la sécurité d'une session
   */
  static validateSession(): boolean {
    const sessionStart = localStorage.getItem('session_start');
    if (!sessionStart) return false;

    const sessionTimestamp = parseInt(sessionStart);
    const now = Date.now();

    return (now - sessionTimestamp) < this.SESSION_TIMEOUT;
  }

  /**
   * Initialise une nouvelle session
   */
  static initializeSession(): void {
    localStorage.setItem('session_start', Date.now().toString());
  }

  /**
   * Nettoie les données de session
   */
  static clearSession(): void {
    const keysToRemove = [
      'session_start',
      'csrf_token',
      'last_activity'
    ];

    keysToRemove.forEach(key => localStorage.removeItem(key));
  }

  /**
   * Génère et stocke un token CSRF
   */
  static generateCSRFToken(): string {
    const token = crypto.randomUUID();
    localStorage.setItem('csrf_token', token);
    return token;
  }

  /**
   * Valide un token CSRF
   */
  static validateCSRFToken(token: string): boolean {
    const storedToken = localStorage.getItem('csrf_token');
    return storedToken === token;
  }

  /**
   * Détecte les tentatives d'attaque par force brute
   */
  static detectBruteForce(email: string): boolean {
    const attempts = this.getLoginAttempts(email);
    const now = Date.now();
    
    // Détection de tentatives rapides successives
    if (attempts.count >= 3 && (now - attempts.lastAttempt) < 60000) {
      return true;
    }

    return false;
  }

  /**
   * Sanitise les données utilisateur
   */
  static sanitizeUserData(data: any): any {
    if (typeof data !== 'object' || data === null) {
      return data;
    }

    const sanitized: any = {};
    
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        // Échapper les caractères dangereux
        sanitized[key] = value
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#x27;')
          .replace(/\//g, '&#x2F;');
      } else if (typeof value === 'object') {
        sanitized[key] = this.sanitizeUserData(value);
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  /**
   * Valide l'origine de la requête
   */
  static validateOrigin(origin: string): boolean {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://your-domain.com'
    ];

    return allowedOrigins.includes(origin);
  }

  /**
   * Chiffre les données sensibles avant stockage
   */
  static encryptSensitiveData(data: string, key: string): string {
    // Implémentation simple de chiffrement (à remplacer par une solution plus robuste en production)
    let encrypted = '';
    for (let i = 0; i < data.length; i++) {
      encrypted += String.fromCharCode(
        data.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      );
    }
    return btoa(encrypted);
  }

  /**
   * Déchiffre les données sensibles
   */
  static decryptSensitiveData(encryptedData: string, key: string): string {
    try {
      const data = atob(encryptedData);
      let decrypted = '';
      for (let i = 0; i < data.length; i++) {
        decrypted += String.fromCharCode(
          data.charCodeAt(i) ^ key.charCodeAt(i % key.length)
        );
      }
      return decrypted;
    } catch {
      return '';
    }
  }
}