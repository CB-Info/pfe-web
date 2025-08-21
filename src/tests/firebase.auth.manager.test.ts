import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import FirebaseAuthManager from "../network/authentication/firebase.auth.manager";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  getAuth,
  UserCredential,
  Auth,
  User,
} from "firebase/auth";

// Mock Firebase auth functions
vi.mock("firebase/auth", () => ({
  getAuth: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChanged: vi.fn(),
  sendPasswordResetEmail: vi.fn(),
}));

// Mock Firebase config
vi.mock("../config/firebase.config", () => ({
  app: { name: "mock-app" },
}));

describe("FirebaseAuthManager", () => {
  let authManager: FirebaseAuthManager;
  const mockAuth = {
    currentUser: null as User | null,
  };

  beforeEach(() => {
    vi.mocked(getAuth).mockReturnValue(mockAuth as Auth);
    authManager = FirebaseAuthManager.getInstance();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Singleton Pattern", () => {
    test("returns the same instance", () => {
      const instance1 = FirebaseAuthManager.getInstance();
      const instance2 = FirebaseAuthManager.getInstance();

      expect(instance1).toBe(instance2);
    });
  });

  describe("login", () => {
    test("successfully logs in with valid credentials", async () => {
      const mockUser = { uid: "test-uid", email: "test@example.com" };
      const mockUserCredential = { user: mockUser };

      vi.mocked(signInWithEmailAndPassword).mockResolvedValue(
        mockUserCredential as UserCredential
      );

      const result = await authManager.login("test@example.com", "password123");

      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        mockAuth,
        "test@example.com",
        "password123"
      );
      expect(result).toEqual(mockUser);
    });

    test("throws error on login failure", async () => {
      const mockError = new Error("Invalid credentials");
      vi.mocked(signInWithEmailAndPassword).mockRejectedValue(mockError);

      await expect(
        authManager.login("test@example.com", "wrongpassword")
      ).rejects.toThrow("Invalid credentials");
    });

    test("logs error to console on login failure", async () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const mockError = new Error("Network error");
      vi.mocked(signInWithEmailAndPassword).mockRejectedValue(mockError);

      try {
        await authManager.login("test@example.com", "password");
      } catch (error) {
        // Expected to throw
      }

      expect(consoleSpy).toHaveBeenCalledWith(
        "Erreur de connexion: ",
        mockError
      );
      consoleSpy.mockRestore();
    });
  });

  describe("sendPasswordResetEmail", () => {
    test("successfully sends password reset email", async () => {
      vi.mocked(sendPasswordResetEmail).mockResolvedValue();

      await authManager.sendPasswordResetEmail("test@example.com");

      expect(sendPasswordResetEmail).toHaveBeenCalledWith(
        mockAuth,
        "test@example.com"
      );
    });

    test("throws error on password reset failure", async () => {
      const mockError = new Error("User not found");
      vi.mocked(sendPasswordResetEmail).mockRejectedValue(mockError);

      await expect(
        authManager.sendPasswordResetEmail("nonexistent@example.com")
      ).rejects.toThrow("User not found");
    });

    test("logs error to console on password reset failure", async () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const mockError = new Error("Network error");
      vi.mocked(sendPasswordResetEmail).mockRejectedValue(mockError);

      try {
        await authManager.sendPasswordResetEmail("test@example.com");
      } catch (error) {
        // Expected to throw
      }

      expect(consoleSpy).toHaveBeenCalledWith(
        "Erreur lors de l'envoi de l'email de réinitialisation: ",
        mockError
      );
      consoleSpy.mockRestore();
    });
  });

  describe("getToken", () => {
    test("returns token when user is authenticated", async () => {
      const mockToken = "mock-jwt-token";
      const mockUser = {
        getIdToken: vi.fn().mockResolvedValue(mockToken),
        uid: "test-uid",
        email: "test@example.com",
      };
      mockAuth.currentUser = mockUser as unknown as User;

      const result = await authManager.getToken();

      expect(mockUser.getIdToken).toHaveBeenCalled();
      expect(result).toBe(mockToken);
    });

    test("throws error when no user is authenticated", async () => {
      mockAuth.currentUser = null;

      await expect(authManager.getToken()).rejects.toThrow(
        "Aucun utilisateur connecté"
      );
    });
  });

  describe("logout", () => {
    test("successfully logs out", async () => {
      vi.mocked(signOut).mockResolvedValue();

      await authManager.logout();

      expect(signOut).toHaveBeenCalledWith(mockAuth);
    });

    test("logs error on logout failure but does not throw", async () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const mockError = new Error("Logout failed");
      vi.mocked(signOut).mockRejectedValue(mockError);

      // Should not throw
      await authManager.logout();

      expect(consoleSpy).toHaveBeenCalledWith(
        "Erreur de déconnexion: ",
        mockError
      );
      consoleSpy.mockRestore();
    });
  });

  describe("monitorAuthState", () => {
    test("sets up auth state listener and returns unsubscribe function", () => {
      const mockCallback = vi.fn();
      const mockUnsubscribe = vi.fn();
      vi.mocked(onAuthStateChanged).mockReturnValue(mockUnsubscribe);

      const unsubscribe = authManager.monitorAuthState(mockCallback);

      expect(onAuthStateChanged).toHaveBeenCalledWith(mockAuth, mockCallback);
      expect(unsubscribe).toBe(mockUnsubscribe);
    });

    test("callback receives user updates", () => {
      const mockCallback = vi.fn();
      let capturedCallback: ((user: User | null) => void) | undefined;

      vi.mocked(onAuthStateChanged).mockImplementation((_auth, callback) => {
        capturedCallback = callback as (user: User | null) => void;
        return vi.fn(); // unsubscribe
      });

      authManager.monitorAuthState(mockCallback);

      const mockUser = { uid: "test-uid", email: "test@example.com" };
      capturedCallback?.(mockUser as User);

      expect(mockCallback).toHaveBeenCalledWith(mockUser);
    });
  });
});
