### Sécurité côté frontend

Ce document liste les pratiques réellement en place côté front. Aucune protection serveur n'est revendiquée ici.

## Authentification & jeton

- Auth: Firebase Authentication (email/password).
- Jeton: Firebase ID Token, récupéré à la volée via `getIdToken()` et envoyé en `Authorization: Bearer ...`.
- Non‑persistance du jeton dans le repo/stockage: géré par le SDK Firebase (mémoire/cookies internes SDK), pas stocké manuellement en clair.

## App Check (prod)

- Fichier: `src/config/firebase-security.config.ts`.
- App Check initialisé uniquement en production via `ReCaptchaV3Provider` si `VITE_RECAPTCHA_SITE_KEY` défini. En dev: log de bypass.

## En‑têtes et CSP (référence front)

- Constante `SECURITY_HEADERS` fournie côté front (documentation/guide) incluant CSP, HSTS, XFO, XSS protection, Referrer-Policy. À appliquer côté serveur/CDN si nécessaire.

```90:108:src/config/firebase-security.config.ts
export const SECURITY_HEADERS = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Content-Security-Policy': ` ... `
}
```

Note: ces en‑têtes ne sont pas injectés par le front au runtime; ils doivent être configurés par l'hébergeur/reverse proxy.

## XSS

- Pas d'usage de `dangerouslySetInnerHTML` détecté dans le code scanné.
- UI inputs: validations basiques côté client (ex. email/password) et inertie via Tailwind; affichage de messages.

## CSRF

- Non concerné côté front pour les appels `fetch` vers API protégée par Bearer token. La protection serveur reste nécessaire si sessions/cookies HttpOnly sont utilisées (non le cas ici).

## Contrôles d'accès UI

- Accès global: si non authentifié, `AuthProvider` rend `LoginPage`.
- Récupération du user courant via `/users/me` au montage de la NavBar; mise à jour du context auth (`currentUser`). Pas de gating par rôles exposé à ce stade.

## Secrets & .env

- `.env` ignoré par Git. `.env.example` généré automatiquement. Les clés Firebase côté web ne sont pas des secrets.

## CORS (côté front)

- Les requêtes incluent `Authorization` et `Content-Type: application/json`. Le backend doit autoriser l'origine front et ces en‑têtes.

