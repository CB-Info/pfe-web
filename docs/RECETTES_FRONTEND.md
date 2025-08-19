### Recettes UX (parcours clés)

Chaque scénario liste les prérequis, étapes UI et résultat attendu. Les appels API mentionnés renvoient vers les repositories existants.

1) Consulter le tableau de bord
- Prérequis: utilisateur authentifié
- Étapes: Naviguer `/dashboard`
- API: `GET /dishes`, `GET /cards`, `GET /dishes/top-ingredients`
- Attendu: cartes de stats, répartitions, liste de plats récents. En cas d'erreur: alerte rouge "Erreur lors de la récupération…"

2) Se connecter
- Prérequis: compte Firebase valide
- Étapes: Page login → saisir email/mot de passe → bouton "Se connecter"
- API: `FirebaseAuthManager.login`
- Attendu: spinner, validation de formulaire, alerte erreur si credentials invalides; bascule vers app une fois connecté.

3) Réinitialiser le mot de passe
- Étapes: depuis login, lien "Mot de passe oublié ?" → saisir email → submit
- API: `FirebaseAuthManager.sendPasswordResetEmail`
- Attendu: message de confirmation; erreurs spécifiques selon code Firebase.

4) Lister les plats
- Étapes: Naviguer `/dishes`
- API: `GET /dishes`
- Attendu: table paginée, filtres/tris/états vides. En cas d'erreur: alerte.

5) Filtrer et trier les plats
- Étapes: taper une recherche, choisir catégorie/statut, trier par prix/nom/date
- API: aucun (filtrage/tri côté client)
- Attendu: liste mise à jour; empty state dédié si aucun résultat.

6) Créer un plat
- Étapes: ouvrir le drawer "Ajouter" → remplir nom/description/prix/catégorie/ingrédients → valider
- API: `POST /dishes`
- Attendu: loader de soumission, alertes validation si champs obligatoires manquants, reset du formulaire au succès.

7) Éditer un plat
- Étapes: sélection d'un plat → ouvrir drawer édition → modifier → valider
- API: `PUT /dishes/{id}`
- Attendu: succès/erreur via alertes, rafraîchissement liste local.

8) Supprimer un plat
- Étapes: action supprimer sur une ligne → confirmation modal → confirmer
- API: `DELETE /dishes/{id}`
- Attendu: suppression côté UI (optimiste ou après succès), alerte succès/erreur.

9) Gérer les cartes (menus)
- Étapes: `/cards` → création/édition/suppression
- API: `GET/POST/PUT/DELETE /cards`
- Attendu: tri par date de création, alertes succès/erreur, empty states quand applicable.

10) Activer une carte (exclusivité)
- Étapes: toggle sur une carte inactive
- API: `PUT /cards/{id}` avec `isActive`
- Attendu: si une autre carte est active, alerte erreur bloquante; sinon, alerte succès et rafraîchissement.

11) Voir une carte côté client (aperçu)
- Étapes: action "voir" sur une carte → ouverture modal client
- API: `GET /dishes` (pour composer la vue à partir des IDs de la carte)
- Attendu: liste des plats de la carte; empty state si vide.

12) Charger l'utilisateur courant
- Étapes: sur chargement, la NavBar appelle `getMe()`
- API: `GET /users/me`
- Attendu: mise à jour du context utilisateur; alerte en cas d'échec.

13) Erreurs réseau génériques
- Étapes: provoquer une erreur (API indisponible)
- API: n/a
- Attendu: alertes rouges explicites; les listes montrent des empty states pertinents.

14) Thème sombre/clair
- Étapes: bascule via UI (switch si exposé), sinon `localStorage('isDarkMode')`
- API: n/a
- Attendu: persistance de la préférence et application du thème styled‑components.

15) PWA (cache basique)
- Étapes: chargement de l'app → service worker s'enregistre
- API: n/a
- Attendu: assets de base servis depuis cache en offline partiel (selon SW simple).

