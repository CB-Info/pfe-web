import { 
  GoogleAuthProvider, 
  GithubAuthProvider, 
  OAuthProvider as FirebaseOAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  linkWithPopup,
  unlink,
  User,
  Auth
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, Firestore } from 'firebase/firestore';
import { AuthUser, AuthError } from '../types/auth.types';
import { OAUTH_CONFIG } from '../config/oauth.config';

export class OAuthService {
  private auth: Auth;
  private db: Firestore;

  constructor(auth: Auth, db: Firestore) {
    this.auth = auth;
    this.db = db;
  }

  /**
   * Crée un provider OAuth selon le type demandé
   */
  private createProvider(providerId: string) {
    switch (providerId) {
      case 'google':
        const googleProvider = new GoogleAuthProvider();
        OAUTH_CONFIG.scopes.google.forEach(scope => {
          googleProvider.addScope(scope);
        });
        googleProvider.setCustomParameters(OAUTH_CONFIG.customParameters.google);
        return googleProvider;

      case 'github':
        const githubProvider = new GithubAuthProvider();
        OAUTH_CONFIG.scopes.github.forEach(scope => {
          githubProvider.addScope(scope);
        });
        githubProvider.setCustomParameters(OAUTH_CONFIG.customParameters.github);
        return githubProvider;

      case 'microsoft':
        const microsoftProvider = new FirebaseOAuthProvider('microsoft.com');
        OAUTH_CONFIG.scopes.microsoft.forEach(scope => {
          microsoftProvider.addScope(scope);
        });
        microsoftProvider.setCustomParameters(OAUTH_CONFIG.customParameters.microsoft);
        return microsoftProvider;

      default:
        throw new Error(`Provider ${providerId} not supported`);
    }
  }

  /**
   * Connexion OAuth avec popup
   */
  async signInWithOAuth(providerId: string, useRedirect = false): Promise<AuthUser> {
    try {
      const provider = this.createProvider(providerId);
      
      let result;
      if (useRedirect) {
        await signInWithRedirect(this.auth, provider);
        // Le résultat sera traité par handleRedirectResult
        throw new Error('Redirect initiated');
      } else {
        result = await signInWithPopup(this.auth, provider);
      }

      const user = this.mapFirebaseUser(result.user, providerId);
      await this.saveUserToFirestore(user);
      
      return user;
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Gère le résultat de la redirection OAuth
   */
  async handleRedirectResult(): Promise<AuthUser | null> {
    try {
      const result = await getRedirectResult(this.auth);
      if (!result) return null;

      const providerId = result.providerId || 'unknown';
      const user = this.mapFirebaseUser(result.user, providerId);
      await this.saveUserToFirestore(user);
      
      return user;
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Lie un compte OAuth à un utilisateur existant
   */
  async linkAccount(providerId: string): Promise<void> {
    try {
      const currentUser = this.auth.currentUser;
      if (!currentUser) {
        throw new Error('No user currently signed in');
      }

      const provider = this.createProvider(providerId);
      await linkWithPopup(currentUser, provider);
      
      // Met à jour les informations utilisateur
      const updatedUser = this.mapFirebaseUser(currentUser, providerId);
      await this.updateUserInFirestore(updatedUser);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Délie un compte OAuth
   */
  async unlinkAccount(providerId: string): Promise<void> {
    try {
      const currentUser = this.auth.currentUser;
      if (!currentUser) {
        throw new Error('No user currently signed in');
      }

      await unlink(currentUser, providerId);
      
      // Met à jour les informations utilisateur
      const updatedUser = this.mapFirebaseUser(currentUser, 'email');
      await this.updateUserInFirestore(updatedUser);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Récupère les providers liés à un utilisateur
   */
  getLinkedProviders(): string[] {
    const currentUser = this.auth.currentUser;
    if (!currentUser) return [];

    return currentUser.providerData.map(provider => provider.providerId);
  }

  /**
   * Mappe un utilisateur Firebase vers notre type AuthUser
   */
  private mapFirebaseUser(firebaseUser: User, providerId: string): AuthUser {
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
      providerId,
      isEmailVerified: firebaseUser.emailVerified
    };
  }

  /**
   * Sauvegarde l'utilisateur dans Firestore
   */
  private async saveUserToFirestore(user: AuthUser): Promise<void> {
    try {
      const userRef = doc(this.db, 'users', user.uid);
      const userDoc = await getDoc(userRef);

      const userData = {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        providerId: user.providerId,
        isEmailVerified: user.isEmailVerified,
        lastLoginAt: new Date(),
        updatedAt: new Date()
      };

      if (!userDoc.exists()) {
        // Nouvel utilisateur
        await setDoc(userRef, {
          ...userData,
          createdAt: new Date()
        });
      } else {
        // Utilisateur existant
        await updateDoc(userRef, userData);
      }
    } catch (error) {
      console.error('Error saving user to Firestore:', error);
      // Ne pas faire échouer l'authentification si Firestore échoue
    }
  }

  /**
   * Met à jour l'utilisateur dans Firestore
   */
  private async updateUserInFirestore(user: AuthUser): Promise<void> {
    try {
      const userRef = doc(this.db, 'users', user.uid);
      await updateDoc(userRef, {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        providerId: user.providerId,
        isEmailVerified: user.isEmailVerified,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating user in Firestore:', error);
    }
  }

  /**
   * Gère les erreurs d'authentification
   */
  private handleAuthError(error: any): AuthError {
    const authError: AuthError = {
      code: error.code || 'unknown',
      message: this.getErrorMessage(error.code),
      details: error
    };

    console.error('OAuth Error:', authError);
    return authError;
  }

  /**
   * Retourne un message d'erreur localisé
   */
  private getErrorMessage(errorCode: string): string {
    const errorMessages: Record<string, string> = {
      'auth/popup-closed-by-user': 'La fenêtre de connexion a été fermée',
      'auth/popup-blocked': 'Les popups sont bloquées par votre navigateur',
      'auth/cancelled-popup-request': 'Demande de connexion annulée',
      'auth/account-exists-with-different-credential': 'Un compte existe déjà avec cette adresse email',
      'auth/credential-already-in-use': 'Ces identifiants sont déjà utilisés',
      'auth/operation-not-allowed': 'Cette méthode de connexion n\'est pas activée',
      'auth/user-disabled': 'Ce compte utilisateur a été désactivé',
      'auth/user-not-found': 'Aucun utilisateur trouvé',
      'auth/wrong-password': 'Mot de passe incorrect',
      'auth/too-many-requests': 'Trop de tentatives, veuillez réessayer plus tard',
      'auth/network-request-failed': 'Erreur de connexion réseau'
    };

    return errorMessages[errorCode] || 'Une erreur inattendue s\'est produite';
  }
}