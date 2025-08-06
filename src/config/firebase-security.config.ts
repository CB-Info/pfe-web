import { FirebaseApp } from 'firebase/app';
import { initializeAppCheck, ReCaptchaV3Provider, getToken } from 'firebase/app-check';

/**
 * Initialize Firebase App Check for additional security
 * App Check helps protect your API resources from abuse by preventing unauthorized clients from accessing your backend resources.
 */
export function initializeFirebaseAppCheck(app: FirebaseApp) {
  // Only initialize App Check in production environment
  if (import.meta.env.NODE_ENV === 'production') {
    try {
      const appCheck = initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(import.meta.env.VITE_RECAPTCHA_SITE_KEY || ''),
        isTokenAutoRefreshEnabled: true
      });

      // Verify App Check is working
      getToken(appCheck).then(() => {
        console.log('App Check initialized successfully');
      }).catch((error: unknown) => {
        console.warn('App Check initialization failed:', error);
      });

      return appCheck;
    } catch (error) {
      console.warn('Failed to initialize App Check:', error);
      return null;
    }
  } else {
    console.log('App Check skipped in development mode');
    return null;
  }
}

/**
 * Firebase Security Configuration Settings
 */
export const FIREBASE_SECURITY_CONFIG = {
  // Authentication settings
  auth: {
    // Require email verification before allowing access
    requireEmailVerification: true,
    
    // Password requirements
    passwordMinLength: 8,
    requireStrongPassword: true,
    
    sessionTimeout: 60,
    
    // Maximum login attempts before temporary lockout
    maxLoginAttempts: 5,
    lockoutDuration: 15 // minutes
  },
  
  // App Check settings
  appCheck: {
    // Enable App Check in production
    enabled: import.meta.env.NODE_ENV === 'production',
    
    // ReCaptcha configuration
    recaptcha: {
      siteKey: import.meta.env.VITE_RECAPTCHA_SITE_KEY,
      theme: 'light' as const,
      size: 'invisible' as const
    }
  },
  
  // API restrictions that should be applied in Firebase Console
  apiRestrictions: {
    // HTTP referrers (domains that can use this API key)
    allowedReferrers: [
      'localhost:*',
      '*.yourdomain.com/*',
      'yourdomain.com/*'
    ],
    
    // Recommended API restrictions for Firebase Web API Key
    allowedApis: [
      'Firebase Management API',
      'Cloud Logging API',
      'Firebase Installations API',
      'Identity Toolkit API',
      'Token Service API',
      'Cloud Firestore API',
      'Firebase Remote Config API'
    ]
  }
};

/**
 * Security Headers for additional protection
 */
export const SECURITY_HEADERS = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Content-Security-Policy': `
    default-src 'self';
    script-src 'self' 'unsafe-inline' https://www.gstatic.com https://www.google.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    font-src 'self' https://fonts.gstatic.com;
    img-src 'self' data: https:;
    connect-src 'self' https://*.googleapis.com https://*.firebase.com;
    frame-src https://www.google.com;
  `.replace(/\s+/g, ' ').trim()
};