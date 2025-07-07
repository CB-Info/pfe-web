export interface OAuthProvider {
  id: string;
  name: string;
  icon: string;
  color: string;
  hoverColor: string;
}

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  providerId: string;
  isEmailVerified: boolean;
}

export interface AuthError {
  code: string;
  message: string;
  details?: any;
}

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  error: AuthError | null;
}