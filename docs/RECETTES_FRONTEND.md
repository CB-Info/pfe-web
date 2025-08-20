# Recettes Frontend — C2.3.1

## Scénarios de Test UX

### 1. Consultation du Dashboard

**Prérequis** : Utilisateur connecté avec rôle ≥ serveur

**Étapes** :

1. Se connecter avec des identifiants valides
2. Arriver sur la page Dashboard (`/dashboard`)
3. Observer les widgets et statistiques affichés

**API appelées** :

- `POST /auth/login` (Firebase)
- `GET /api/stats/overview` (si implémenté)

**Résultat attendu** :

- Dashboard visible avec données actualisées
- Navigation latérale accessible
- Indicateurs de performance visibles

---

### 2. Gestion des Plats - Consultation

**Prérequis** : Utilisateur connecté, rôle ≥ chef

**Étapes** :

1. Cliquer sur "Plats" dans la navigation
2. Attendre le chargement de la liste
3. Observer la liste des plats avec prix et ingrédients

**API appelées** :

- `GET /api/dishes`
- `GET /api/dishes/top-ingredients`

**Résultat attendu** :

- Liste paginée des plats
- Filtres fonctionnels (catégorie, disponibilité)
- Bouton "Ajouter" visible selon permissions

---

### 3. Création d'un Nouveau Plat

**Prérequis** : Utilisateur avec rôle chef/manager

**Étapes** :

1. Sur la page Plats, cliquer "Nouveau plat"
2. Remplir le formulaire :
   - Nom : "Salade César"
   - Prix : 12.50€
   - Catégorie : "Entrées"
   - Ingrédients : Sélectionner dans la liste
3. Cliquer "Créer"

**API appelées** :

- `GET /api/ingredients` (pour la liste)
- `POST /api/dishes` (création)

**Résultat attendu** :

- Toast de succès
- Redirection vers la liste
- Nouveau plat visible

---

### 4. Gestion des Cartes/Menus

**Prérequis** : Utilisateur manager

**Étapes** :

1. Naviguer vers "Cartes"
2. Créer une nouvelle carte
3. Ajouter des plats par drag & drop ou sélection
4. Définir la période de validité
5. Publier la carte

**API appelées** :

- `GET /api/cards`
- `POST /api/cards`
- `PUT /api/cards/:id`

**Résultat attendu** :

- Carte créée et active
- QR code généré (si feature présente)
- Prévisualisation disponible

---

### 5. Consultation Menu Client (QR Code)

**Prérequis** : Aucun (accès public prévu)

**Étapes** :

1. Scanner le QR code de la table
2. Accéder à l'URL `/menu/:restaurantId/:tableNumber`
3. Parcourir les catégories
4. Voir les détails d'un plat

**API appelées** :

- `GET /api/public/menu/:restaurantId`
- `GET /api/public/dishes/:id`

**Résultat attendu** :

- Menu consultable sans connexion
- Images et descriptions visibles
- Prix et allergènes affichés

---

### 6. Authentification - Login/Logout

**Prérequis** : Compte utilisateur existant

**Étapes** :

1. Accéder à l'application
2. Saisir email et mot de passe
3. Cliquer "Se connecter"
4. Plus tard : cliquer "Déconnexion"

**API appelées** :

- Firebase Auth : `signInWithEmailAndPassword`
- Firebase Auth : `signOut`

**Résultat attendu** :

- Login : Redirection vers dashboard
- Logout : Retour à la page de connexion
- Token Firebase géré automatiquement

---

### 7. Mot de Passe Oublié

**Prérequis** : Email valide associé à un compte

**Étapes** :

1. Sur la page login, cliquer "Mot de passe oublié"
2. Saisir l'email
3. Cliquer "Envoyer"
4. Vérifier l'email de réinitialisation

**API appelées** :

- Firebase Auth : `sendPasswordResetEmail`

**Résultat attendu** :

- Toast de confirmation
- Email reçu avec lien
- Possibilité de définir nouveau mot de passe

---

### 8. Protection des Pages - Accès Refusé

**Prérequis** : Utilisateur avec rôle insuffisant

**Étapes** :

1. Tenter d'accéder à `/dishes` en tant que serveur (non chef)
2. Observer le comportement

**API appelées** :

- Vérification du rôle côté client

**Résultat attendu** :

- Message "Accès non autorisé"
- Redirection vers dashboard
- Navigation limitée aux pages autorisées

---

### 9. Gestion des Erreurs Réseau

**Prérequis** : Connexion internet instable

**Étapes** :

1. Couper la connexion réseau
2. Tenter de charger la liste des plats
3. Observer le message d'erreur
4. Rétablir la connexion
5. Actualiser la page

**API appelées** :

- Échec de `GET /api/dishes`

**Résultat attendu** :

- Message d'erreur clair
- Bouton "Réessayer" disponible
- Récupération gracieuse après reconnexion

---

### 10. Recherche et Filtres

**Prérequis** : Liste de plats existante

**Étapes** :

1. Sur la page Plats, utiliser la barre de recherche
2. Taper "pizza"
3. Appliquer un filtre de catégorie "Plats principaux"
4. Trier par prix croissant

**API appelées** :

- `GET /api/dishes?search=pizza&category=main&sort=price`

**Résultat attendu** :

- Résultats filtrés en temps réel
- Compteur de résultats mis à jour
- URL mise à jour avec paramètres

---

### 11. Mode Sombre

**Prérequis** : Application chargée

**Étapes** :

1. Aller dans Paramètres
2. Activer le "Mode sombre"
3. Naviguer dans l'application

**API appelées** :

- Aucune (préférence locale)

**Résultat attendu** :

- Thème sombre appliqué immédiatement
- Préférence sauvegardée
- Cohérence visuelle maintenue

---

### 12. Upload d'Image pour un Plat

**Prérequis** : Formulaire de création/édition de plat

**Étapes** :

1. Dans le formulaire, cliquer "Ajouter une image"
2. Sélectionner une image (< 5MB)
3. Prévisualiser
4. Sauvegarder le plat

**API appelées** :

- Firebase Storage : upload
- `POST/PUT /api/dishes` avec URL image

**Résultat attendu** :

- Upload progressif visible
- Image redimensionnée si nécessaire
- URL stockée avec le plat

---

### 13. Export de Données

**Prérequis** : Rôle manager, données existantes

**Étapes** :

1. Sur la page souhaitée, cliquer "Exporter"
2. Choisir le format (CSV/PDF)
3. Télécharger le fichier

**API appelées** :

- `GET /api/export/dishes?format=csv`

**Résultat attendu** :

- Fichier téléchargé
- Données complètes et formatées
- Encodage UTF-8 pour les accents

---

### 14. Notifications en Temps Réel

**Prérequis** : Feature de notifications active

**Étapes** :

1. Être connecté en tant que chef
2. Un serveur crée une commande
3. Observer la notification

**API appelées** :

- WebSocket ou Firebase Realtime Database

**Résultat attendu** :

- Toast notification
- Son optionnel
- Compteur de notifications mis à jour

---

### 15. Performance - Chargement Initial

**Prérequis** : Première visite, cache vide

**Étapes** :

1. Vider le cache navigateur
2. Accéder à l'application
3. Mesurer le temps jusqu'à l'interactivité

**API appelées** :

- Chargement des bundles JS/CSS
- Firebase init
- Premier appel API authentifié

**Résultat attendu** :

- Écran de chargement < 3 secondes
- Time to Interactive < 5 secondes
- Pas de layout shift visible

## État des Tests Automatisés

### Scénarios Couverts par les Tests E2E ✅

Les scénarios suivants sont maintenant couverts par des tests automatisés Playwright :

1. **Authentification complète** (`auth-flow.spec.ts`)

   - ✅ Affichage de la page de connexion
   - ✅ Validation des champs (email, mot de passe)
   - ✅ Toggle de visibilité du mot de passe
   - ✅ Indicateur de force du mot de passe
   - ✅ Navigation vers réinitialisation mot de passe
   - ✅ États de chargement et erreurs
   - ✅ Tests d'accessibilité (navigation clavier, ARIA)
   - ✅ Tests responsive (mobile, tablet)

2. **Gestion des Plats** (`dishes-management.spec.ts`)
   - ✅ Chargement et affichage de la liste
   - ✅ Recherche et filtrage
   - ✅ Création/édition/suppression de plats
   - ✅ Validation des formulaires
   - ✅ Gestion des erreurs réseau
   - ✅ Tests responsive et accessibilité

### Scénarios en Cours d'Implémentation 🔧

Les tests d'intégration suivants sont implémentés mais en cours de finalisation :

3. **Consultation du Dashboard** (`dashboard.integration.test.tsx`)
4. **Gestion des Cartes/Menus** (planifié)
5. **Consultation Menu Client (QR Code)** (planifié)

### Scénarios à Implémenter

6. **Upload d'Image pour un Plat**
7. **Export de Données**
8. **Notifications en Temps Réel**
9. **Performance - Chargement Initial**

## Prochaines Recettes (Roadmap)

- Gestion multi-restaurant
- Intégration paiements
- Commandes en ligne
- Analytics dashboard
- Gestion des stocks
