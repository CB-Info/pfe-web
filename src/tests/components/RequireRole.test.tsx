import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { RequireRole } from "../../UI/components/guards/RequireRole";
import { UserRole } from "../../data/models/user.model";
import * as authReducer from "../../reducers/auth.reducer";

// Mock du contexte d'authentification
vi.mock("../../reducers/auth.reducer", () => ({
  useUsersListerStateContext: vi.fn(),
}));

// Mock des composants
vi.mock("../../UI/components/common/loading.component", () => ({
  default: ({ text }: { text: string }) => (
    <div data-testid="loading">{text}</div>
  ),
}));

vi.mock("../../UI/components/common/ForbiddenMessage", () => ({
  ForbiddenMessage: () => <div data-testid="forbidden">Access Denied</div>,
}));

describe("RequireRole", () => {
  const mockUser = {
    id: "1",
    email: "test@example.com",
    firstname: "Test",
    lastname: "User",
    role: "MANAGER" as UserRole,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("should show loading when no user is present", () => {
    vi.mocked(authReducer.useUsersListerStateContext).mockReturnValue({
      currentUser: undefined,
    });

    render(
      <RequireRole allowed={["MANAGER"]}>
        <div>Protected Content</div>
      </RequireRole>
    );

    expect(screen.getByTestId("loading")).toBeInTheDocument();
    expect(
      screen.getByText("Vérification des permissions...")
    ).toBeInTheDocument();
  });

  test("should show content when user has required role", () => {
    vi.mocked(authReducer.useUsersListerStateContext).mockReturnValue({
      currentUser: mockUser,
    });

    render(
      <RequireRole allowed={["MANAGER", "ADMIN"]}>
        <div data-testid="protected-content">Protected Content</div>
      </RequireRole>
    );

    expect(screen.getByTestId("protected-content")).toBeInTheDocument();
    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  test("should show forbidden message when user lacks required role", () => {
    vi.mocked(authReducer.useUsersListerStateContext).mockReturnValue({
      currentUser: { ...mockUser, role: "CUSTOMER" },
    });

    render(
      <RequireRole allowed={["MANAGER", "ADMIN"]}>
        <div data-testid="protected-content">Protected Content</div>
      </RequireRole>
    );

    expect(screen.getByTestId("forbidden")).toBeInTheDocument();
    expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
  });

  test("should show custom fallback when provided and user lacks role", () => {
    vi.mocked(authReducer.useUsersListerStateContext).mockReturnValue({
      currentUser: { ...mockUser, role: "CUSTOMER" },
    });

    render(
      <RequireRole
        allowed={["MANAGER"]}
        fallback={<div data-testid="custom-fallback">Custom Access Denied</div>}
      >
        <div data-testid="protected-content">Protected Content</div>
      </RequireRole>
    );

    expect(screen.getByTestId("custom-fallback")).toBeInTheDocument();
    expect(screen.getByText("Custom Access Denied")).toBeInTheDocument();
    expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
  });

  test("should allow access when user role is in allowed list", () => {
    vi.mocked(authReducer.useUsersListerStateContext).mockReturnValue({
      currentUser: { ...mockUser, role: "KITCHEN_STAFF" },
    });

    render(
      <RequireRole allowed={["KITCHEN_STAFF", "MANAGER", "ADMIN"]}>
        <div data-testid="protected-content">Protected Content</div>
      </RequireRole>
    );

    expect(screen.getByTestId("protected-content")).toBeInTheDocument();
  });
});
