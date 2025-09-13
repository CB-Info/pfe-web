import { describe, test, expect } from "vitest";
import { mapBackendRoleToFrontend } from "../../utils/role.utils";

describe("Role Mapping", () => {
  test("should map backend roles to frontend roles correctly", () => {
    expect(mapBackendRoleToFrontend("customer")).toBe("CUSTOMER");
    expect(mapBackendRoleToFrontend("waiter")).toBe("WAITER");
    expect(mapBackendRoleToFrontend("kitchen_staff")).toBe("KITCHEN_STAFF");
    expect(mapBackendRoleToFrontend("manager")).toBe("MANAGER");
    expect(mapBackendRoleToFrontend("owner")).toBe("OWNER");
    expect(mapBackendRoleToFrontend("admin")).toBe("ADMIN");
  });

  test("should handle case insensitive mapping", () => {
    expect(mapBackendRoleToFrontend("ADMIN")).toBe("ADMIN");
    expect(mapBackendRoleToFrontend("Admin")).toBe("ADMIN");
    expect(mapBackendRoleToFrontend("aDmIn")).toBe("ADMIN");
  });

  test("should fallback to CUSTOMER for unknown roles", () => {
    expect(mapBackendRoleToFrontend("unknown")).toBe("CUSTOMER");
    expect(mapBackendRoleToFrontend("")).toBe("CUSTOMER");
    expect(mapBackendRoleToFrontend("invalid_role")).toBe("CUSTOMER");
  });
});
