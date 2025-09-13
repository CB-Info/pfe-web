# Gestion des Commandes

## Vue d'ensemble

Le système de gestion des commandes permet aux serveurs de prendre, suivre et gérer les commandes des tables du restaurant.

## Fonctionnalités

### 🎯 Accès restreint

- Accessible uniquement aux utilisateurs avec le rôle `WAITER`, `MANAGER`, `OWNER`, ou `ADMIN`
- Onglet "Commandes" visible dans la navigation pour les rôles autorisés
- Protection par le composant `RequireRole`

### 📱 Interface utilisateur

- **Page principale** : `/orders` - Vue d'ensemble des commandes
- **Navigation** : Onglet "Commandes" dans la barre latérale
- **Actions rapides** : Boutons dans le dashboard serveur pour accéder rapidement

### ✨ Création de commandes

#### Schéma de données

```typescript
{
  "tableNumberId": "607f1f77bcf86cd799439011",
  "dishes": [
    {
      "dishId": "607f1f77bcf86cd799439012",
      "isPaid": false
    }
  ],
  "status": "PENDING",
  "totalPrice": 45.5,
  "tips": 5
}
```

#### Processus de création

1. **Sélection de table** : Choisir parmi les tables disponibles (non occupées)
2. **Sélection de plats** : Interface organisée par catégories avec accordéons (fermés par défaut)
3. **Calcul automatique** : Prix total calculé en temps réel
4. **Validation** : Création avec statut `PENDING` et tips à 0

#### Gestion des commandes par les serveurs

1. **Commandes en attente** : Bouton "Annuler la commande" → `CANCELLED` (avec confirmation)
2. **Commandes prêtes** : Bouton "Marquer comme servi" → `DELIVERED`
3. **Commandes servies** : Bouton "Marquer comme payé" → `FINISH`
4. **Mise à jour en temps réel** : Interface actualisée immédiatement
5. **Confirmation requise** : L'annulation demande une confirmation utilisateur

### 📊 Statuts des commandes

| Statut           | Label          | Description                               |
| ---------------- | -------------- | ----------------------------------------- |
| `PENDING`        | En attente     | Commande créée, en attente de préparation |
| `IN_PREPARATION` | En préparation | Commande prise en charge par la cuisine   |
| `READY`          | Prêt           | Commande prête à être servie              |
| `DELIVERED`      | Servi          | Commande servie au client                 |
| `FINISH`         | Payé           | Commande payée et terminée                |
| `CANCELLED`      | Annulé         | Commande annulée                          |

### 🔧 Composants techniques

#### Modèles de données

- **Order** : Modèle principal des commandes
- **Table** : Modèle des tables du restaurant
- **OrderDish** : Association commande-plat

#### Repositories

- **OrdersRepositoryImpl** : Gestion API des commandes
- **TablesRepositoryImpl** : Gestion API des tables

#### Pages et composants

- **OrdersPage** : Page principale de gestion
- **CreateOrderModal** : Modal de création de commande
- **WaiterDashboard** : Actions rapides intégrées

## API Endpoints

### Commandes

- `GET /orders` - Récupérer toutes les commandes
- `GET /orders/:id` - Récupérer une commande par ID
- `GET /orders/table/:tableId` - Commandes d'une table
- `POST /orders` - Créer une nouvelle commande
- `PUT /orders/:id` - Mettre à jour une commande (ex: `{"status": "READY"}`)
- `DELETE /orders/:id` - Supprimer une commande

### Tables

- `GET /tables` - Récupérer toutes les tables
- `GET /tables/:id` - Récupérer une table par ID
- `POST /tables` - Créer une nouvelle table
- `PATCH /tables/:id` - Mettre à jour une table

## Intégration avec le dashboard

### Actions rapides serveur

- **"Prendre une commande"** → Redirige vers `/orders`
- **"Gérer les commandes"** → Redirige vers `/orders`
- **"Voir les menus"** → Redirige vers `/cards`

### Métriques affichées

- Commandes en attente (`PENDING`)
- À servir/encaisser (`READY` + `DELIVERED`)
- Total actif (excluant les commandes payées et annulées)

### Tri et organisation des commandes

Les commandes sont triées par priorité pour les serveurs :

1. **`READY`** : Priorité maximale (à servir immédiatement)
2. **`DELIVERED`** : Priorité élevée (à encaisser)
3. **`PENDING`** : Priorité moyenne (en attente de préparation)
4. **`IN_PREPARATION`** : Priorité basse (en cours en cuisine)

Les commandes **`FINISH`** (payées) sont masquées de la vue principale et accessible dans une section repliable pour éviter l'encombrement.

## Sécurité et permissions

- Protection par authentification Firebase
- Contrôle d'accès basé sur les rôles utilisateur
- Validation des données côté client et serveur
- Gestion d'erreurs avec messages utilisateur

## Notes techniques

- **Tips** : Automatiquement fixés à 0 lors de la création (non visible dans l'interface)
- **Statut initial** : Toujours `PENDING` à la création
- **Tables** : Seules les tables non occupées sont sélectionnables
- **Plats** : Seuls les plats disponibles peuvent être ajoutés
- **Temps réel** : Interface mise à jour avec les changements de statut
