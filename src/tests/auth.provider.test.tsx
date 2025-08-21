import { render, screen, waitFor } from "@testing-library/react";
import { vi, describe, test, expect, beforeEach, afterEach } from "vitest";
import AuthProvider from "../contexts/auth.provider";
import FirebaseAuthManager from "../network/authentication/firebase.auth.manager";
import { User, Auth } from "firebase/auth";

// Mock FirebaseAuthManager
vi.mock("../network/authentication/firebase.auth.manager");

// Mock LoginPage component
vi.mock("../UI/pages/authentication/login.page", () => ({
  default: () => <div data-testid="login-page">Login Page</div>,
}));

// Mock Loading component
vi.mock("../UI/components/common/loading.component", () => ({
  default: ({ text }: { text: string }) => (
    <div data-testid="loading-component">{text}</div>
  ),
}));

// Mock reducers
vi.mock("../reducers/auth.reducer", () => ({
  UsersListerDispatchContext: {
    Provider: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
  },
  UsersListerStateContext: {
    Provider: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
  },
  UsersListerInitialState: {},
  usersListerlocalReducer: vi.fn(),
}));

describe("AuthProvider", () => {
  const mockFirebaseAuthManager = {
    monitorAuthState: vi.fn(),
    auth: {} as Auth,
    login: vi.fn(),
    sendPasswordResetEmail: vi.fn(),
    getToken: vi.fn(),
    logout: vi.fn(),
  };

  beforeEach(() => {
    vi.mocked(FirebaseAuthManager.getInstance).mockReturnValue(
      mockFirebaseAuthManager as unknown as FirebaseAuthManager
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("shows loading component initially", () => {
    // Mock auth state monitoring that never calls the callback
    mockFirebaseAuthManager.monitorAuthState.mockImplementation(() => {
      return () => {}; // unsubscribe function
    });

    render(
      <AuthProvider>
        <div data-testid="protected-content">Protected Content</div>
      </AuthProvider>
    );

    expect(screen.getByTestId("loading-component")).toBeInTheDocument();
    expect(
      screen.getByText("Authentification en cours...")
    ).toBeInTheDocument();
  });

  test("shows login page when user is not authenticated", async () => {
    // Mock auth state monitoring that calls callback with null user
    mockFirebaseAuthManager.monitorAuthState.mockImplementation((callback) => {
      setTimeout(() => callback(null), 0);
      return () => {}; // unsubscribe function
    });

    render(
      <AuthProvider>
        <div data-testid="protected-content">Protected Content</div>
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("login-page")).toBeInTheDocument();
    });

    expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
  });

  test("shows protected content when user is authenticated", async () => {
    // Mock auth state monitoring that calls callback with user object
    mockFirebaseAuthManager.monitorAuthState.mockImplementation((callback) => {
      setTimeout(
        () => callback({ uid: "test-user-id", email: "test@example.com" }),
        0
      );
      return () => {}; // unsubscribe function
    });

    render(
      <AuthProvider>
        <div data-testid="protected-content">Protected Content</div>
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("protected-content")).toBeInTheDocument();
    });

    expect(screen.queryByTestId("login-page")).not.toBeInTheDocument();
  });

  test("calls unsubscribe function on unmount", () => {
    const mockUnsubscribe = vi.fn();
    mockFirebaseAuthManager.monitorAuthState.mockReturnValue(mockUnsubscribe);

    const { unmount } = render(
      <AuthProvider>
        <div>Content</div>
      </AuthProvider>
    );

    unmount();

    expect(mockUnsubscribe).toHaveBeenCalled();
  });

  test("handles auth state changes correctly", async () => {
    let authCallback: ((user: User | null) => void) | undefined;

    // Capture the callback function
    mockFirebaseAuthManager.monitorAuthState.mockImplementation((callback) => {
      authCallback = callback;
      return () => {}; // unsubscribe function
    });

    render(
      <AuthProvider>
        <div data-testid="protected-content">Protected Content</div>
      </AuthProvider>
    );

    // Initially loading
    expect(screen.getByTestId("loading-component")).toBeInTheDocument();

    // Simulate user login
    authCallback?.({ uid: "test-user", email: "test@example.com" } as User);

    await waitFor(() => {
      expect(screen.getByTestId("protected-content")).toBeInTheDocument();
    });

    // Simulate user logout
    authCallback?.(null);

    await waitFor(() => {
      expect(screen.getByTestId("login-page")).toBeInTheDocument();
    });
  });
});
