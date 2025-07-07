import { useState, useCallback } from 'react';
import { oauthService } from '../services/oauth.service';
import { AuthUser, AuthError } from '../types/auth.types';
import { useAlerts } from '../contexts/alerts.context';

interface UseOAuthReturn {
  isLoading: boolean;
  error: AuthError | null;
  signInWithOAuth: (providerId: string, useRedirect?: boolean) => Promise<AuthUser | null>;
  linkAccount: (providerId: string) => Promise<void>;
  unlinkAccount: (providerId: string) => Promise<void>;
  getLinkedProviders: () => string[];
  clearError: () => void;
}

export const useOAuth = (): UseOAuthReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);
  const { addAlert } = useAlerts();

  const signInWithOAuth = useCallback(async (
    providerId: string, 
    useRedirect = false
  ): Promise<AuthUser | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const user = await oauthService.signInWithOAuth(providerId, useRedirect);
      
      addAlert({
        severity: 'success',
        message: `Connexion réussie avec ${providerId}`,
        timeout: 3
      });

      return user;
    } catch (err: any) {
      const authError = err as AuthError;
      setError(authError);
      
      // Ne pas afficher d'alerte pour les redirections
      if (authError.message !== 'Redirect initiated') {
        addAlert({
          severity: 'error',
          message: authError.message,
          timeout: 5
        });
      }
      
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [addAlert]);

  const linkAccount = useCallback(async (providerId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      await oauthService.linkAccount(providerId);
      
      addAlert({
        severity: 'success',
        message: `Compte ${providerId} lié avec succès`,
        timeout: 3
      });
    } catch (err: any) {
      const authError = err as AuthError;
      setError(authError);
      
      addAlert({
        severity: 'error',
        message: authError.message,
        timeout: 5
      });
    } finally {
      setIsLoading(false);
    }
  }, [addAlert]);

  const unlinkAccount = useCallback(async (providerId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      await oauthService.unlinkAccount(providerId);
      
      addAlert({
        severity: 'success',
        message: `Compte ${providerId} délié avec succès`,
        timeout: 3
      });
    } catch (err: any) {
      const authError = err as AuthError;
      setError(authError);
      
      addAlert({
        severity: 'error',
        message: authError.message,
        timeout: 5
      });
    } finally {
      setIsLoading(false);
    }
  }, [addAlert]);

  const getLinkedProviders = useCallback((): string[] => {
    return oauthService.getLinkedProviders();
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    signInWithOAuth,
    linkAccount,
    unlinkAccount,
    getLinkedProviders,
    clearError
  };
};