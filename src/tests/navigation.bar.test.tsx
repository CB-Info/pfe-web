import { render, screen, fireEvent, act } from "@testing-library/react";
import { NavBar } from "../UI/components/navigation/NavBar";
import {
  UsersListerStateContext,
  UsersListerDispatchContext,
  UsersListerInitialState,
  usersListerlocalReducer,
} from "../reducers/auth.reducer";
import { UserRepositoryImpl } from "../network/repositories/user.respository";
import { useReducer, FC, ReactNode } from "react";
import { vi, beforeEach, describe, test, expect } from "vitest";
import AlertsProvider from "../contexts/alerts.context";
import { MemoryRouter } from "react-router-dom";

// Mock Firebase dependencies
vi.mock("../network/authentication/firebase.auth.manager", () => ({
  default: class MockFirebaseAuthManager {
    static getInstance() {
      return {
        logout: vi.fn().mockResolvedValue(undefined),
        getToken: vi.fn().mockResolvedValue("mock-token"),
        login: vi.fn().mockResolvedValue({}),
      };
    }
  },
}));

// Mock Firebase config
vi.mock("../config/firebase.config", () => ({
  app: {},
  appCheck: {},
  default: {},
}));

// Mock Firebase security config
vi.mock("../config/firebase-security.config", () => ({
  initializeFirebaseAppCheck: vi.fn().mockReturnValue(null),
  FIREBASE_SECURITY_CONFIG: {},
  SECURITY_HEADERS: {},
}));

const Wrapper: FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(
    usersListerlocalReducer,
    UsersListerInitialState
  );

  // Ajouter un utilisateur au contexte pour les tests
  const stateWithUser = {
    ...state,
    currentUser: {
      id: "1",
      email: "test@example.com",
      firstname: "John",
      lastname: "Doe",
      role: "CUSTOMER" as const,
    },
  };

  return (
    <MemoryRouter>
      <AlertsProvider>
        <UsersListerStateContext.Provider value={stateWithUser}>
          <UsersListerDispatchContext.Provider value={dispatch}>
            {children}
          </UsersListerDispatchContext.Provider>
        </UsersListerStateContext.Provider>
      </AlertsProvider>
    </MemoryRouter>
  );
};

beforeEach(() => {
  localStorage.clear();
});

function mockUser() {
  vi.spyOn(UserRepositoryImpl.prototype, "getMe").mockResolvedValue({
    id: "1",
    email: "test@example.com",
    firstname: "John",
    lastname: "Doe",
    role: "CUSTOMER",
  });
}

describe("NavBar collapsed state", () => {
  test("loads collapsed state from localStorage", async () => {
    localStorage.setItem("navCollapsed", "true");
    mockUser();

    await act(async () => {
      render(<NavBar isOpen={true} onClose={() => {}} />, { wrapper: Wrapper });
    });

    // Check that the Dashboard text is hidden (has the collapsed CSS classes)
    const dashboardText = screen.getByText("Dashboard");
    expect(dashboardText.parentElement).toHaveClass("w-0", "opacity-0");
  });

  test("toggle collapse on button click", async () => {
    localStorage.setItem("navCollapsed", "false");
    mockUser();

    await act(async () => {
      render(<NavBar isOpen={true} onClose={() => {}} />, { wrapper: Wrapper });
    });

    const btn = screen.getByLabelText("Réduire la navigation");

    await act(async () => {
      fireEvent.click(btn);
    });

    expect(localStorage.getItem("navCollapsed")).toBe("true");
  });
});
