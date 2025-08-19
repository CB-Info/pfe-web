# Recettes Frontend UX — C2.3.1

## Scénarios de Test Utilisateur

### Prérequis Généraux
- **Navigateur** : Chrome/Firefox/Safari dernière version
- **Résolution** : Desktop (1920x1080) et Mobile (375x667)
- **Connexion** : Internet stable
- **Données** : Base de données avec plats et cartes de test

## 1. Authentification et Accès

### 1.1 Connexion Utilisateur
**Prérequis** : Utilisateur avec compte Firebase valide

**Étapes UI :**
1. Accéder à l'URL de l'application
2. Vérifier redirection automatique vers page de login
3. Saisir email et mot de passe valides
4. Cliquer sur "Se connecter"
5. Vérifier redirection vers dashboard

**APIs appelées :**
- Firebase Auth : `signInWithEmailAndPassword()`
- Firebase Auth : `onAuthStateChanged()` (monitoring)

**Résultat attendu :**
- ✅ Redirection vers `/dashboard`
- ✅ NavBar visible avec menu de navigation
- ✅ Token d'authentification stocké en mémoire
- ✅ État `isLogin = true` dans AuthProvider

### 1.2 Protection des Routes
**Prérequis** : Utilisateur non connecté

**Étapes UI :**
1. Tenter d'accéder directement à `/dishes`
2. Vérifier redirection vers page de login
3. Essayer d'accéder à `/dashboard` via URL
4. Confirmer blocage et affichage du login

**APIs appelées :**
- Firebase Auth : `onAuthStateChanged()` (retourne null)

**Résultat attendu :**
- ✅ Toutes les routes privées redirigent vers login
- ✅ Message "Authentification en cours..." pendant la vérification
- ✅ Pas d'accès aux données sans authentification

## 2. Navigation et Interface

### 2.1 Navigation Desktop
**Prérequis** : Utilisateur connecté, écran desktop (> 768px)

**Étapes UI :**
1. Vérifier présence de la sidebar de navigation
2. Cliquer sur "Dashboard" dans le menu
3. Cliquer sur "Dishes" dans le menu
4. Cliquer sur "Cards" dans le menu
5. Cliquer sur "Settings" dans le menu

**APIs appelées :**
- Lazy loading des composants de page
- Appels API spécifiques à chaque page

**Résultat attendu :**
- ✅ Navigation fluide entre les pages
- ✅ URL mise à jour correctement
- ✅ Lazy loading avec indicateur de chargement
- ✅ Sidebar toujours visible

### 2.2 Navigation Mobile
**Prérequis** : Utilisateur connecté, écran mobile (< 768px)

**Étapes UI :**
1. Vérifier que la sidebar est masquée par défaut
2. Cliquer sur le bouton hamburger (☰) en haut à gauche
3. Vérifier ouverture de la sidebar en overlay
4. Cliquer sur un élément de navigation
5. Vérifier fermeture automatique de la sidebar
6. Cliquer sur l'overlay pour fermer manuellement

**APIs appelées :**
- Mêmes que navigation desktop

**Résultat attendu :**
- ✅ Sidebar responsive avec overlay mobile
- ✅ Bouton hamburger visible et fonctionnel
- ✅ Fermeture automatique après navigation
- ✅ Overlay semi-transparent fonctionnel

## 3. Gestion des Plats

### 3.1 Consultation de la Liste des Plats
**Prérequis** : Utilisateur connecté avec rôle approprié

**Étapes UI :**
1. Naviguer vers `/dishes`
2. Attendre le chargement de la liste
3. Vérifier l'affichage des plats par catégorie
4. Tester le scroll de la liste
5. Vérifier les informations affichées (nom, prix, description)

**APIs appelées :**
```
GET /api/dishes
Headers: Authorization: Bearer {firebase-token}
```

**Résultat attendu :**
- ✅ Liste des plats chargée et affichée
- ✅ Plats organisés par catégories (Entrées, Plats, Desserts...)
- ✅ Prix formatés correctement (€)
- ✅ Images des plats si disponibles
- ✅ Indicateur de disponibilité

### 3.2 Ajout d'un Nouveau Plat
**Prérequis** : Utilisateur avec permissions de création

**Étapes UI :**
1. Sur la page `/dishes`, cliquer sur "Ajouter un plat"
2. Remplir le formulaire :
   - Nom : "Salade César Test"
   - Prix : "12.50"
   - Description : "Salade avec croûtons et parmesan"
   - Catégorie : "Salades"
   - Ingrédients : Sélectionner dans la liste
3. Cliquer sur "Enregistrer"
4. Vérifier l'ajout dans la liste

**APIs appelées :**
```
POST /api/dishes
Body: {
  name: "Salade César Test",
  price: 12.50,
  description: "...",
  category: "SALADS",
  ingredients: [...],
  isAvailable: true
}
```

**Résultat attendu :**
- ✅ Formulaire de création affiché
- ✅ Validation côté client des champs obligatoires
- ✅ Plat créé et visible dans la liste
- ✅ Message de succès affiché
- ✅ Redirection ou refresh de la liste

### 3.3 Modification d'un Plat Existant
**Prérequis** : Au moins un plat existant

**Étapes UI :**
1. Dans la liste des plats, cliquer sur "Modifier" pour un plat
2. Modifier le prix : "15.00" → "16.00"
3. Ajouter un ingrédient supplémentaire
4. Cliquer sur "Sauvegarder"
5. Vérifier la mise à jour dans la liste

**APIs appelées :**
```
PUT /api/dishes/{dishId}
Body: { ...dishData avec modifications }
```

**Résultat attendu :**
- ✅ Formulaire pré-rempli avec données existantes
- ✅ Modifications sauvegardées
- ✅ Liste mise à jour immédiatement
- ✅ Message de confirmation

## 4. Gestion des Cartes/Tables

### 4.1 Consultation des Cartes
**Prérequis** : Utilisateur connecté

**Étapes UI :**
1. Naviguer vers `/cards`
2. Vérifier l'affichage de la liste des cartes
3. Examiner les informations de chaque carte
4. Tester l'organisation/tri si disponible

**APIs appelées :**
```
GET /api/cards
Headers: Authorization: Bearer {token}
```

**Résultat attendu :**
- ✅ Liste des cartes/tables affichée
- ✅ Informations pertinentes visibles
- ✅ Interface claire et navigable

### 4.2 Création d'une Nouvelle Carte
**Prérequis** : Permissions appropriées

**Étapes UI :**
1. Cliquer sur "Nouvelle carte"
2. Remplir les informations requises
3. Sélectionner les plats à inclure
4. Définir les paramètres (si applicable)
5. Sauvegarder la carte

**APIs appelées :**
```
POST /api/cards
Body: { ...cardData }
```

**Résultat attendu :**
- ✅ Formulaire de création fonctionnel
- ✅ Sélection de plats intuitive
- ✅ Carte créée et visible

## 5. Gestion des Erreurs et États

### 5.1 Erreur de Connexion Réseau
**Prérequis** : Application chargée, puis perte de connexion

**Étapes UI :**
1. Désactiver la connexion internet
2. Tenter de naviguer vers une nouvelle page
3. Essayer de créer/modifier un plat
4. Observer les messages d'erreur
5. Réactiver la connexion et réessayer

**APIs appelées :**
- Tous les appels API échouent avec erreur réseau

**Résultat attendu :**
- ✅ Messages d'erreur clairs et informatifs
- ✅ Pas de crash de l'application
- ✅ Possibilité de réessayer les actions
- ✅ État de l'interface cohérent

### 5.2 Erreur d'Authentification (Token Expiré)
**Prérequis** : Session expirée côté serveur

**Étapes UI :**
1. Laisser l'application ouverte longtemps (ou forcer expiration)
2. Tenter une action nécessitant l'authentification
3. Observer la gestion de l'erreur 401
4. Vérifier la redirection vers login

**APIs appelées :**
- API retourne 401 Unauthorized

**Résultat attendu :**
- ✅ Détection automatique de l'expiration
- ✅ Redirection vers page de login
- ✅ Message explicatif à l'utilisateur
- ✅ Possibilité de se reconnecter

### 5.3 Gestion des États de Chargement
**Prérequis** : Connexion lente simulée

**Étapes UI :**
1. Naviguer vers une page avec beaucoup de données
2. Observer les indicateurs de chargement
3. Vérifier les skeletons/placeholders
4. Tester l'annulation si disponible

**APIs appelées :**
- Appels API avec latence élevée

**Résultat attendu :**
- ✅ Indicateurs de chargement visibles
- ✅ Interface non bloquée pendant le chargement
- ✅ Feedback visuel approprié (spinners, skeletons)
- ✅ Pas de double soumission

## 6. Expérience Utilisateur

### 6.1 Thème Sombre/Clair
**Prérequis** : Fonctionnalité de thème implémentée

**Étapes UI :**
1. Localiser le toggle de thème dans les paramètres
2. Basculer vers le thème sombre
3. Vérifier l'application du thème sur toute l'interface
4. Recharger la page et vérifier la persistance
5. Basculer vers le thème clair

**APIs appelées :**
- Aucune (gestion locale)

**Résultat attendu :**
- ✅ Basculement fluide entre thèmes
- ✅ Tous les composants respectent le thème
- ✅ Préférence sauvegardée dans localStorage
- ✅ Application du thème au rechargement

### 6.2 Notifications et Alertes
**Prérequis** : Système d'alertes fonctionnel

**Étapes UI :**
1. Déclencher une action de succès (création plat)
2. Vérifier l'affichage de l'alerte de succès
3. Déclencher une erreur (données invalides)
4. Vérifier l'alerte d'erreur
5. Tester la fermeture manuelle et automatique

**APIs appelées :**
- Selon l'action (succès ou erreur)

**Résultat attendu :**
- ✅ Alertes appropriées selon le contexte
- ✅ Auto-fermeture après délai configuré
- ✅ Possibilité de fermeture manuelle
- ✅ Styles distincts par type (succès/erreur/info)
- ✅ Positionnement non intrusif

## 7. Responsive Design

### 7.1 Adaptation Mobile (375px)
**Prérequis** : Écran mobile ou émulation

**Étapes UI :**
1. Redimensionner à 375px de large
2. Tester la navigation (hamburger menu)
3. Vérifier la lisibilité des listes
4. Tester les formulaires en mode mobile
5. Vérifier l'accessibilité des boutons

**APIs appelées :**
- Identiques au desktop

**Résultat attendu :**
- ✅ Interface adaptée à la taille d'écran
- ✅ Navigation mobile fonctionnelle
- ✅ Textes lisibles sans zoom
- ✅ Boutons de taille appropriée (44px min)
- ✅ Pas de scroll horizontal

### 7.2 Adaptation Tablette (768px)
**Prérequis** : Écran tablette ou émulation

**Étapes UI :**
1. Redimensionner à 768px de large
2. Vérifier le point de bascule desktop/mobile
3. Tester toutes les fonctionnalités principales
4. Vérifier l'utilisation de l'espace disponible

**APIs appelées :**
- Identiques aux autres formats

**Résultat attendu :**
- ✅ Transition fluide entre layouts
- ✅ Utilisation optimale de l'espace
- ✅ Fonctionnalités complètes disponibles

## 8. Performance et Optimisation

### 8.1 Temps de Chargement Initial
**Prérequis** : Application déployée

**Étapes UI :**
1. Ouvrir les DevTools (onglet Network)
2. Vider le cache navigateur
3. Recharger l'application
4. Mesurer les temps de chargement
5. Vérifier le lazy loading des pages

**APIs appelées :**
- Chargement initial des assets
- Firebase Auth check

**Résultat attendu :**
- ✅ Temps de First Contentful Paint < 2s
- ✅ Lazy loading des pages fonctionnel
- ✅ Pas de ressources bloquantes inutiles
- ✅ Indicateur de chargement pendant l'auth

### 8.2 Navigation Entre Pages
**Prérequis** : Application chargée

**Étapes UI :**
1. Naviguer rapidement entre différentes pages
2. Observer les temps de transition
3. Vérifier l'absence de re-chargements inutiles
4. Tester le bouton retour du navigateur

**APIs appelées :**
- Appels API spécifiques à chaque page

**Résultat attendu :**
- ✅ Navigation instantanée ou quasi-instantanée
- ✅ Pas de rechargement complet de la page
- ✅ Historique navigateur fonctionnel
- ✅ États préservés quand approprié

## Liens vers Documentation Backend

### Endpoints API Documentés
- **Swagger/OpenAPI** : Voir documentation backend pour schémas complets
- **Authentification** : Tokens JWT via Firebase (voir doc sécurité backend)
- **Autorisation** : Rôles et permissions (voir RBAC backend)

### Éviter la Duplication
- ✅ Frontend documente les **scénarios UX** et **appels API**
- ✅ Backend documente les **schémas de données** et **règles métier**
- ❌ Pas de duplication des spécifications d'API
- ❌ Pas de documentation des validations serveur ici

## Notes d'Implémentation

### Scénarios Non Implémentés
- **QR Codes** : Prévus mais pas encore développés
- **Partage d'addition** : Fonctionnalité future
- **Notifications push** : À évaluer selon besoins

### Limitations Connues
- **Tests E2E** : Scénarios manuels pour l'instant
- **Performance** : Métriques à améliorer avec outils dédiés
- **Accessibilité** : Tests manuels, automatisation à prévoir

Ces recettes constituent la base de validation UX du frontend. Elles doivent être exécutées avant chaque release et peuvent servir de base pour des tests automatisés futurs.