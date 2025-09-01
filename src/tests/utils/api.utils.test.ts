import { describe, test, expect, vi, beforeEach } from "vitest";
import {
  ApiError,
  handleApiResponse,
  handleApiError,
} from "../../utils/api.utils";

// Mock FirebaseAuthManager
vi.mock("../../network/authentication/firebase.auth.manager", () => ({
  default: {
    getInstance: vi.fn(() => ({
      logout: vi.fn().mockResolvedValue(undefined),
    })),
  },
}));

// Mock window.location.reload
Object.defineProperty(window, "location", {
  value: {
    reload: vi.fn(),
  },
  writable: true,
});

describe("API Utils", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("ApiError", () => {
    test("should create ApiError with status and message", () => {
      const error = new ApiError(404, "Not found");

      expect(error.status).toBe(404);
      expect(error.message).toBe("Not found");
      expect(error.name).toBe("ApiError");
    });

    test("should create ApiError with original error", () => {
      const originalError = new Error("Original");
      const error = new ApiError(500, "Server error", originalError);

      expect(error.originalError).toBe(originalError);
    });
  });

  describe("handleApiResponse", () => {
    test("should return response when ok", async () => {
      const mockResponse = {
        ok: true,
        status: 200,
      } as Response;

      const result = await handleApiResponse(mockResponse);
      expect(result).toBe(mockResponse);
    });

    test("should throw ApiError with 401 status", async () => {
      const mockResponse = {
        ok: false,
        status: 401,
      } as Response;

      await expect(handleApiResponse(mockResponse)).rejects.toThrow(ApiError);
      await expect(handleApiResponse(mockResponse)).rejects.toThrow(
        "Session expirée"
      );
    });

    test("should throw ApiError with 403 status", async () => {
      const mockResponse = {
        ok: false,
        status: 403,
      } as Response;

      await expect(handleApiResponse(mockResponse)).rejects.toThrow(ApiError);
      await expect(handleApiResponse(mockResponse)).rejects.toThrow(
        "permissions nécessaires"
      );
    });

    test("should throw ApiError with 404 status", async () => {
      const mockResponse = {
        ok: false,
        status: 404,
      } as Response;

      await expect(handleApiResponse(mockResponse)).rejects.toThrow(ApiError);
      await expect(handleApiResponse(mockResponse)).rejects.toThrow(
        "ressource demandée"
      );
    });

    test("should throw ApiError with 500 status", async () => {
      const mockResponse = {
        ok: false,
        status: 500,
      } as Response;

      await expect(handleApiResponse(mockResponse)).rejects.toThrow(ApiError);
      await expect(handleApiResponse(mockResponse)).rejects.toThrow(
        "Erreur serveur"
      );
    });

    test("should handle response with custom error message", async () => {
      const mockResponse = {
        ok: false,
        status: 400,
        json: vi.fn().mockResolvedValue({ message: "Custom error message" }),
      } as unknown as Response;

      await expect(handleApiResponse(mockResponse)).rejects.toThrow(
        "Custom error message"
      );
    });
  });

  describe("handleApiError", () => {
    const mockAddAlert = vi.fn();

    beforeEach(() => {
      mockAddAlert.mockClear();
    });

    test("should handle ApiError with 403 status", () => {
      const apiError = new ApiError(403, "Forbidden");

      handleApiError(apiError, mockAddAlert);

      expect(mockAddAlert).toHaveBeenCalledWith({
        severity: "warning",
        message: "Forbidden",
        timeout: 5,
      });
    });

    test("should handle ApiError with non-403 status", () => {
      const apiError = new ApiError(404, "Not found");

      handleApiError(apiError, mockAddAlert);

      expect(mockAddAlert).toHaveBeenCalledWith({
        severity: "error",
        message: "Not found",
        timeout: 3,
      });
    });

    test("should handle non-ApiError", () => {
      const regularError = new Error("Regular error");

      handleApiError(regularError, mockAddAlert, "Default message");

      expect(mockAddAlert).toHaveBeenCalledWith({
        severity: "error",
        message: "Default message",
        timeout: 3,
      });
    });

    test("should use default message when provided", () => {
      const unknownError = "string error";

      handleApiError(unknownError, mockAddAlert);

      expect(mockAddAlert).toHaveBeenCalledWith({
        severity: "error",
        message: "Une erreur est survenue",
        timeout: 3,
      });
    });
  });
});
