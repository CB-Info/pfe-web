import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import DashboardPage from "../../UI/pages/dashboard/dashboard.page";
import { UserRole } from "../../data/models/user.model";
import * as authReducer from "../../reducers/auth.reducer";

// Mock du contexte d'authentification
vi.mock("../../reducers/auth.reducer", () => ({
  useUsersListerStateContext: vi.fn(),
}));

// Mock des dashboards spécialisés
vi.mock("../../UI/pages/dashboard/OwnerDashboard", () => ({
  default: () => <div data-testid="owner-dashboard">Owner Dashboard</div>,
}));

vi.mock("../../UI/pages/dashboard/ManagerDashboard", () => ({
  default: () => <div data-testid="manager-dashboard">Manager Dashboard</div>,
}));

vi.mock("../../UI/pages/dashboard/KitchenDashboard", () => ({
  default: () => <div data-testid="kitchen-dashboard">Kitchen Dashboard</div>,
}));

vi.mock("../../UI/pages/dashboard/WaiterDashboard", () => ({
  default: () => <div data-testid="waiter-dashboard">Waiter Dashboard</div>,
}));

vi.mock("../../UI/pages/dashboard/CustomerDashboard", () => ({
  default: () => <div data-testid="customer-dashboard">Customer Dashboard</div>,
}));

// Mock des composants
vi.mock("../../UI/components/common/loading.component", () => ({
  default: ({ text }: { text: string }) => (
    <div data-testid="loading">{text}</div>
  ),
}));

describe("DashboardPage", () => {
  const createMockUser = (role: UserRole) => ({
    id: "1",
    email: "test@example.com",
    firstname: "Test",
    lastname: "User",
    role,
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("should show loading when no user is present", () => {
    vi.mocked(authReducer.useUsersListerStateContext).mockReturnValue({
      currentUser: undefined,
    });

    render(<DashboardPage />);

    expect(screen.getByTestId("loading")).toBeInTheDocument();
    expect(
      screen.getByText("Chargement de votre tableau de bord...")
    ).toBeInTheDocument();
  });

  test("should show Customer dashboard for CUSTOMER role", () => {
    vi.mocked(authReducer.useUsersListerStateContext).mockReturnValue({
      currentUser: createMockUser("CUSTOMER"),
    });

    render(<DashboardPage />);

    expect(screen.getByTestId("customer-dashboard")).toBeInTheDocument();
  });

  test("should show Waiter dashboard for WAITER role", () => {
    vi.mocked(authReducer.useUsersListerStateContext).mockReturnValue({
      currentUser: createMockUser("WAITER"),
    });

    render(<DashboardPage />);

    expect(screen.getByTestId("waiter-dashboard")).toBeInTheDocument();
  });

  test("should show Kitchen dashboard for KITCHEN_STAFF role", () => {
    vi.mocked(authReducer.useUsersListerStateContext).mockReturnValue({
      currentUser: createMockUser("KITCHEN_STAFF"),
    });

    render(<DashboardPage />);

    expect(screen.getByTestId("kitchen-dashboard")).toBeInTheDocument();
  });

  test("should show Manager dashboard for MANAGER role", () => {
    vi.mocked(authReducer.useUsersListerStateContext).mockReturnValue({
      currentUser: createMockUser("MANAGER"),
    });

    render(<DashboardPage />);

    expect(screen.getByTestId("manager-dashboard")).toBeInTheDocument();
  });

  test("should show Owner dashboard for OWNER role", () => {
    vi.mocked(authReducer.useUsersListerStateContext).mockReturnValue({
      currentUser: createMockUser("OWNER"),
    });

    render(<DashboardPage />);

    expect(screen.getByTestId("owner-dashboard")).toBeInTheDocument();
  });

  test("should show Owner dashboard for ADMIN role", () => {
    vi.mocked(authReducer.useUsersListerStateContext).mockReturnValue({
      currentUser: createMockUser("ADMIN"),
    });

    render(<DashboardPage />);

    expect(screen.getByTestId("owner-dashboard")).toBeInTheDocument();
  });
});
