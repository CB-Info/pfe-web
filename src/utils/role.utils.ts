import { UserRole } from "../data/models/user.model";

/**
 * Mappe les rôles du backend (minuscules) vers les rôles frontend (majuscules)
 */
export const mapBackendRoleToFrontend = (backendRole: string): UserRole => {
  const roleMapping: Record<string, UserRole> = {
    customer: "CUSTOMER",
    waiter: "WAITER",
    kitchen_staff: "KITCHEN_STAFF",
    manager: "MANAGER",
    owner: "OWNER",
    admin: "ADMIN",
  };

  return roleMapping[backendRole.toLowerCase()] || "CUSTOMER";
};

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  CUSTOMER: 1,
  WAITER: 2,
  KITCHEN_STAFF: 3,
  MANAGER: 4,
  OWNER: 5,
  ADMIN: 6,
};

/**
 * Vérifie si l'utilisateur a au moins le rôle requis
 */
export const hasRoleAtLeast = (
  userRole: UserRole,
  requiredRole: UserRole
): boolean => {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
};

/**
 * Vérifie si l'utilisateur peut gérer les plats (création, édition, suppression)
 */
export const canManageDishes = (role: UserRole): boolean =>
  hasRoleAtLeast(role, "KITCHEN_STAFF");

/**
 * Vérifie si l'utilisateur peut gérer les cartes (création, édition, suppression)
 */
export const canManageCards = (role: UserRole): boolean =>
  hasRoleAtLeast(role, "MANAGER");

/**
 * Vérifie si l'utilisateur peut voir le stock
 */
export const canViewStock = (role: UserRole): boolean =>
  hasRoleAtLeast(role, "KITCHEN_STAFF");

/**
 * Vérifie si l'utilisateur peut gérer les utilisateurs
 */
export const canManageUsers = (role: UserRole): boolean =>
  hasRoleAtLeast(role, "MANAGER");

/**
 * Vérifie si l'utilisateur peut changer les rôles
 */
export const canChangeRoles = (role: UserRole): boolean =>
  hasRoleAtLeast(role, "MANAGER");

/**
 * Vérifie si l'utilisateur peut supprimer des utilisateurs
 */
export const canDeleteUsers = (role: UserRole): boolean => role === "ADMIN";

/**
 * Vérifie si l'utilisateur peut superviser le restaurant
 */
export const canSuperviseRestaurant = (role: UserRole): boolean =>
  hasRoleAtLeast(role, "OWNER");

/**
 * Retourne les rôles autorisés pour une action donnée
 */
export const getRolesForAction = (action: string): UserRole[] => {
  switch (action) {
    case "manage_dishes":
      return ["KITCHEN_STAFF", "MANAGER", "OWNER", "ADMIN"];
    case "manage_cards":
      return ["MANAGER", "OWNER", "ADMIN"];
    case "view_stock":
      return ["KITCHEN_STAFF", "MANAGER", "OWNER", "ADMIN"];
    case "manage_users":
      return ["MANAGER", "OWNER", "ADMIN"];
    case "supervise_restaurant":
      return ["OWNER", "ADMIN"];
    default:
      return [
        "CUSTOMER",
        "WAITER",
        "KITCHEN_STAFF",
        "MANAGER",
        "OWNER",
        "ADMIN",
      ];
  }
};
