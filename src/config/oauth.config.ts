import { OAuthProvider } from '../types/auth.types';

export const OAUTH_PROVIDERS: OAuthProvider[] = [
  {
    id: 'google',
    name: 'Google',
    icon: 'google',
    color: 'bg-white border border-gray-300 text-gray-700',
    hoverColor: 'hover:bg-gray-50'
  },
  {
    id: 'github',
    name: 'GitHub',
    icon: 'github',
    color: 'bg-gray-900 text-white',
    hoverColor: 'hover:bg-gray-800'
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    icon: 'microsoft',
    color: 'bg-blue-600 text-white',
    hoverColor: 'hover:bg-blue-700'
  }
];

export const OAUTH_CONFIG = {
  // Scopes demandés pour chaque provider
  scopes: {
    google: ['email', 'profile'],
    github: ['user:email'],
    microsoft: ['email', 'profile']
  },
  
  // Paramètres personnalisés
  customParameters: {
    google: {
      prompt: 'select_account'
    },
    github: {
      allow_signup: 'true'
    },
    microsoft: {
      prompt: 'select_account'
    }
  }
} as const;