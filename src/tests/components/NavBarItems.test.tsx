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

  test("should show only Accueil for CUSTOMER", () => {
    vi.mocked(authReducer.useUsersListerStateContext).mockReturnValue({
      currentUser: createMockUser("CUSTOMER"),
    });

    renderWithRouter(<NavBarItems collapsed={false} />);

    expect(screen.getByText("Accueil")).toBeInTheDocument();
    expect(screen.queryByText("Stock")).not.toBeInTheDocument();
    expect(screen.queryByText("Cartes")).not.toBeInTheDocument();
    expect(screen.queryByText("Plats")).not.toBeInTheDocument();
  });

  test("should show Accueil and Commandes for WAITER", () => {
    vi.mocked(authReducer.useUsersListerStateContext).mockReturnValue({
      currentUser: createMockUser("WAITER"),
    });

    renderWithRouter(<NavBarItems collapsed={false} />);

    expect(screen.getByText("Accueil")).toBeInTheDocument();
    expect(screen.getByText("Commandes")).toBeInTheDocument();
    expect(screen.queryByText("Stock")).not.toBeInTheDocument();
    expect(screen.queryByText("Cartes")).not.toBeInTheDocument();
    expect(screen.queryByText("Plats")).not.toBeInTheDocument();
  });

  test("should show Accueil, Cuisine, Stock, and Plats for KITCHEN_STAFF", () => {
    vi.mocked(authReducer.useUsersListerStateContext).mockReturnValue({
      currentUser: createMockUser("KITCHEN_STAFF"),
    });

    renderWithRouter(<NavBarItems collapsed={false} />);

    expect(screen.getByText("Accueil")).toBeInTheDocument();
    expect(screen.getByText("Cuisine")).toBeInTheDocument();
    expect(screen.getByText("Stock")).toBeInTheDocument();
    expect(screen.getByText("Plats")).toBeInTheDocument();
    expect(screen.queryByText("Cartes")).not.toBeInTheDocument();
  });

  test("should show all items for MANAGER", () => {
    vi.mocked(authReducer.useUsersListerStateContext).mockReturnValue({
      currentUser: createMockUser("MANAGER"),
    });

    renderWithRouter(<NavBarItems collapsed={false} />);

    expect(screen.getByText("Accueil")).toBeInTheDocument();
    expect(screen.getByText("Commandes")).toBeInTheDocument();
    expect(screen.getByText("Cuisine")).toBeInTheDocument();
    expect(screen.getByText("Stock")).toBeInTheDocument();
    expect(screen.getByText("Cartes")).toBeInTheDocument();
    expect(screen.getByText("Plats")).toBeInTheDocument();
  });

  test("should show all items for OWNER", () => {
    vi.mocked(authReducer.useUsersListerStateContext).mockReturnValue({
      currentUser: createMockUser("OWNER"),
    });

    renderWithRouter(<NavBarItems collapsed={false} />);

    expect(screen.getByText("Accueil")).toBeInTheDocument();
    expect(screen.getByText("Commandes")).toBeInTheDocument();
    expect(screen.getByText("Cuisine")).toBeInTheDocument();
    expect(screen.getByText("Stock")).toBeInTheDocument();
    expect(screen.getByText("Cartes")).toBeInTheDocument();
    expect(screen.getByText("Plats")).toBeInTheDocument();
  });

  test("should show all items for ADMIN", () => {
    vi.mocked(authReducer.useUsersListerStateContext).mockReturnValue({
      currentUser: createMockUser("ADMIN"),
    });

    renderWithRouter(<NavBarItems collapsed={false} />);

    expect(screen.getByText("Accueil")).toBeInTheDocument();
    expect(screen.getByText("Commandes")).toBeInTheDocument();
    expect(screen.getByText("Cuisine")).toBeInTheDocument();
    expect(screen.getByText("Stock")).toBeInTheDocument();
    expect(screen.getByText("Cartes")).toBeInTheDocument();
    expect(screen.getByText("Plats")).toBeInTheDocument();
  });

  test("should show no items when no user is present", () => {
    vi.mocked(authReducer.useUsersListerStateContext).mockReturnValue({
      currentUser: undefined,
    });

    renderWithRouter(<NavBarItems collapsed={false} />);

    expect(screen.queryByText("Accueil")).not.toBeInTheDocument();
    expect(screen.queryByText("Commandes")).not.toBeInTheDocument();
    expect(screen.queryByText("Cuisine")).not.toBeInTheDocument();
    expect(screen.queryByText("Stock")).not.toBeInTheDocument();
    expect(screen.queryByText("Cartes")).not.toBeInTheDocument();
    expect(screen.queryByText("Plats")).not.toBeInTheDocument();
  });
});
