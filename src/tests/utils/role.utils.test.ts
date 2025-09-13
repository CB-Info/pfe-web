import { describe, test, expect } from "vitest";
import {
  hasRoleAtLeast,
  canManageDishes,
  canManageCards,
  canViewStock,
  getRolesForAction,
} from "../../utils/role.utils";

describe("Role Utils", () => {
  describe("hasRoleAtLeast", () => {
    test("should return true when user role is higher than required", () => {
      expect(hasRoleAtLeast("MANAGER", "WAITER")).toBe(true);
      expect(hasRoleAtLeast("ADMIN", "KITCHEN_STAFF")).toBe(true);
    });

    test("should return true when user role equals required role", () => {
      expect(hasRoleAtLeast("MANAGER", "MANAGER")).toBe(true);
      expect(hasRoleAtLeast("WAITER", "WAITER")).toBe(true);
    });

    test("should return false when user role is lower than required", () => {
      expect(hasRoleAtLeast("CUSTOMER", "WAITER")).toBe(false);
      expect(hasRoleAtLeast("WAITER", "MANAGER")).toBe(false);
    });
  });

  describe("canManageDishes", () => {
    test("should allow KITCHEN_STAFF and above", () => {
      expect(canManageDishes("KITCHEN_STAFF")).toBe(true);
      expect(canManageDishes("MANAGER")).toBe(true);
      expect(canManageDishes("OWNER")).toBe(true);
      expect(canManageDishes("ADMIN")).toBe(true);
    });

    test("should not allow CUSTOMER and WAITER", () => {
      expect(canManageDishes("CUSTOMER")).toBe(false);
      expect(canManageDishes("WAITER")).toBe(false);
    });
  });

  describe("canManageCards", () => {
    test("should allow MANAGER and above", () => {
      expect(canManageCards("MANAGER")).toBe(true);
      expect(canManageCards("OWNER")).toBe(true);
      expect(canManageCards("ADMIN")).toBe(true);
    });

    test("should not allow roles below MANAGER", () => {
      expect(canManageCards("CUSTOMER")).toBe(false);
      expect(canManageCards("WAITER")).toBe(false);
      expect(canManageCards("KITCHEN_STAFF")).toBe(false);
    });
  });

  describe("canViewStock", () => {
    test("should allow KITCHEN_STAFF and above", () => {
      expect(canViewStock("KITCHEN_STAFF")).toBe(true);
      expect(canViewStock("MANAGER")).toBe(true);
      expect(canViewStock("OWNER")).toBe(true);
      expect(canViewStock("ADMIN")).toBe(true);
    });

    test("should not allow CUSTOMER and WAITER", () => {
      expect(canViewStock("CUSTOMER")).toBe(false);
      expect(canViewStock("WAITER")).toBe(false);
    });
  });

  describe("getRolesForAction", () => {
    test("should return correct roles for manage_dishes", () => {
      const roles = getRolesForAction("manage_dishes");
      expect(roles).toEqual(["KITCHEN_STAFF", "MANAGER", "OWNER", "ADMIN"]);
    });

    test("should return correct roles for manage_cards", () => {
      const roles = getRolesForAction("manage_cards");
      expect(roles).toEqual(["MANAGER", "OWNER", "ADMIN"]);
    });

    test("should return all roles for unknown action", () => {
      const roles = getRolesForAction("unknown_action");
      expect(roles).toEqual([
        "CUSTOMER",
        "WAITER",
        "KITCHEN_STAFF",
        "MANAGER",
        "OWNER",
        "ADMIN",
      ]);
    });
  });
});
