import { Drupal } from "../Drupal";
import { XhrInterface, XhrResponse } from "@drupal-js-sdk/interfaces";

/**
 * Tests for Drupal session storage and configuration handling.
 * Validates client initialization, session storage selection, and configuration options.
 */

class MockXhrClient implements XhrInterface {
  setClient(): XhrInterface {
    return this;
  }
  getClient(): unknown {
    return null;
  }
  addDefaultHeaders(): XhrInterface {
    return this;
  }
  addDefaultOptions(): XhrInterface {
    return this;
  }
  getDrupalError(): any {
    return new Error("Mock error");
  }

  async call(): Promise<XhrResponse> {
    return {
      data: { data: [] },
      status: 200,
      statusText: "OK",
      headers: {},
      request: {},
      config: {},
    };
  }
}

describe("Drupal Session Storage and Configuration", () => {
  describe("Client Configuration", () => {
    test("should use provided client when specified in configuration", () => {
      const customClient = new MockXhrClient();

      // When client is provided, it should be used instead of creating a new one
      const drupal = new Drupal({
        baseURL: "https://provided-client.example.com",
        client: customClient, // This should trigger the left side of options.client ?? new FetchClient()
      });

      expect(drupal).toBeInstanceOf(Drupal);
      // Confirm the provided client was properly configured
      expect(drupal.getClientService()).toBe(customClient);
    });

    test("should create default FetchClient when no client is provided", () => {
      // Test when options.client is NOT provided (should create new FetchClient)
      const drupal = new Drupal({
        baseURL: "https://default-client.example.com",
        // Missing client property should trigger automatic FetchClient creation
      });

      expect(drupal).toBeInstanceOf(Drupal);
      // Confirm FetchClient was automatically created and configured
      const clientService = drupal.getClientService();
      expect(clientService).toBeDefined();
      expect(typeof clientService.call).toBe("function");
    });

    test("should handle explicit undefined client", () => {
      // Test when options.client is explicitly undefined
      const drupal = new Drupal({
        baseURL: "https://undefined-client.example.com",
        client: undefined, // Explicitly undefined - should trigger new FetchClient()
      });

      expect(drupal).toBeInstanceOf(Drupal);
      const clientService = drupal.getClientService();
      expect(clientService).toBeDefined();
    });

    test("should handle explicit null client", () => {
      // Test when options.client is explicitly null
      const drupal = new Drupal({
        baseURL: "https://null-client.example.com",
        client: null as any, // Explicitly null - should trigger new FetchClient()
      });

      expect(drupal).toBeInstanceOf(Drupal);
      const clientService = drupal.getClientService();
      expect(clientService).toBeDefined();
    });
  });

  describe("Configuration Options Handling", () => {
    test("should handle config with auth but no headers", () => {
      const drupal = new Drupal({
        baseURL: "https://auth-only.example.com",
        auth: {
          username: "testuser",
          password: "testpass",
        },
        // Configuration with auth only - should create FetchClient with auth settings
      });

      expect(drupal).toBeInstanceOf(Drupal);
    });

    test("should handle config with headers but no auth", () => {
      const drupal = new Drupal({
        baseURL: "https://headers-only.example.com",
        headers: {
          Authorization: "Bearer token",
          "Content-Type": "application/json",
        },
        // Configuration with headers only - should create FetchClient with header settings
      });

      expect(drupal).toBeInstanceOf(Drupal);
    });

    test("should handle config with both auth and headers", () => {
      const drupal = new Drupal({
        baseURL: "https://auth-and-headers.example.com",
        auth: {
          username: "user",
          password: "pass",
        },
        headers: {
          "X-Custom-Header": "custom-value",
        },
        // Configuration with both auth and headers should merge both settings
      });

      expect(drupal).toBeInstanceOf(Drupal);
    });

    test("should handle minimal config (only baseURL)", () => {
      const drupal = new Drupal({
        baseURL: "https://minimal.example.com",
        // Minimal configuration with only baseURL should work
      });

      expect(drupal).toBeInstanceOf(Drupal);
      const clientService = drupal.getClientService();
      expect(clientService).toBeDefined();
    });
  });

  describe("Session Storage Initialization", () => {
    test("should use provided session service", () => {
      const mockSession = {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
        getString: jest.fn(),
        setString: jest.fn(),
        get: jest.fn(),
        set: jest.fn(),
        isAvailable: jest.fn().mockReturnValue(true),
      };

      const drupal = new Drupal({
        baseURL: "https://custom-session.example.com",
        session: mockSession,
      });

      expect(drupal).toBeInstanceOf(Drupal);
      expect(drupal.getSessionService()).toBe(mockSession);
    });

    test("should initialize Web Storage when localStorage is available", () => {
      // Mock window.localStorage to be available
      const mockLocalStorage = {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
        length: 0,
        key: jest.fn(),
      };

      (global as any).window = { localStorage: mockLocalStorage };

      const drupal = new Drupal({
        baseURL: "https://web-storage.example.com",
        // No session provided - should try Web Storage
      });

      expect(drupal).toBeInstanceOf(Drupal);

      // Cleanup
      delete (global as any).window;
    });

    test("should fallback to memory storage when Web Storage fails", () => {
      // Ensure no window object to trigger fallback
      delete (global as any).window;

      const drupal = new Drupal({
        baseURL: "https://memory-fallback.example.com",
        // No session provided, no window - should fallback to memory storage
      });

      expect(drupal).toBeInstanceOf(Drupal);
      const sessionService = drupal.getSessionService();
      expect(sessionService).toBeDefined();
      expect(sessionService.isAvailable()).toBe(true);
    });
  });
});
