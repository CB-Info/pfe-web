import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { NavBarItems } from "../../UI/components/navigation/NavBarItems";
import { UserRole } from "../../data/models/user.model";
import * as authReducer from "../../reducers/auth.reducer";

// Mock du contexte d'authentification
vi.mock("../../reducers/auth.reducer", () => ({
  useUsersListerStateContext: vi.fn(),
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("NavBarItems", () => {
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

  test("should show only Dashboard for CUSTOMER", () => {
    vi.mocked(authReducer.useUsersListerStateContext).mockReturnValue({
      currentUser: createMockUser("CUSTOMER"),
    });

    renderWithRouter(<NavBarItems collapsed={false} />);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.queryByText("Stock")).not.toBeInTheDocument();
    expect(screen.queryByText("Cards")).not.toBeInTheDocument();
    expect(screen.queryByText("Dishes")).not.toBeInTheDocument();
  });

  test("should show Dashboard for WAITER", () => {
    vi.mocked(authReducer.useUsersListerStateContext).mockReturnValue({
      currentUser: createMockUser("WAITER"),
    });

    renderWithRouter(<NavBarItems collapsed={false} />);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.queryByText("Stock")).not.toBeInTheDocument();
    expect(screen.queryByText("Cards")).not.toBeInTheDocument();
    expect(screen.queryByText("Dishes")).not.toBeInTheDocument();
  });

  test("should show Dashboard, Stock, and Dishes for KITCHEN_STAFF", () => {
    vi.mocked(authReducer.useUsersListerStateContext).mockReturnValue({
      currentUser: createMockUser("KITCHEN_STAFF"),
    });

    renderWithRouter(<NavBarItems collapsed={false} />);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Stock")).toBeInTheDocument();
    expect(screen.getByText("Dishes")).toBeInTheDocument();
    expect(screen.queryByText("Cards")).not.toBeInTheDocument();
  });

  test("should show all items for MANAGER", () => {
    vi.mocked(authReducer.useUsersListerStateContext).mockReturnValue({
      currentUser: createMockUser("MANAGER"),
    });

    renderWithRouter(<NavBarItems collapsed={false} />);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Stock")).toBeInTheDocument();
    expect(screen.getByText("Cards")).toBeInTheDocument();
    expect(screen.getByText("Dishes")).toBeInTheDocument();
  });

  test("should show all items for OWNER", () => {
    vi.mocked(authReducer.useUsersListerStateContext).mockReturnValue({
      currentUser: createMockUser("OWNER"),
    });

    renderWithRouter(<NavBarItems collapsed={false} />);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Stock")).toBeInTheDocument();
    expect(screen.getByText("Cards")).toBeInTheDocument();
    expect(screen.getByText("Dishes")).toBeInTheDocument();
  });

  test("should show all items for ADMIN", () => {
    vi.mocked(authReducer.useUsersListerStateContext).mockReturnValue({
      currentUser: createMockUser("ADMIN"),
    });

    renderWithRouter(<NavBarItems collapsed={false} />);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Stock")).toBeInTheDocument();
    expect(screen.getByText("Cards")).toBeInTheDocument();
    expect(screen.getByText("Dishes")).toBeInTheDocument();
  });

  test("should show no items when no user is present", () => {
    vi.mocked(authReducer.useUsersListerStateContext).mockReturnValue({
      currentUser: undefined,
    });

    renderWithRouter(<NavBarItems collapsed={false} />);

    expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
    expect(screen.queryByText("Stock")).not.toBeInTheDocument();
    expect(screen.queryByText("Cards")).not.toBeInTheDocument();
    expect(screen.queryByText("Dishes")).not.toBeInTheDocument();
  });
});
