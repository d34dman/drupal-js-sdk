import { Drupal } from "../Drupal";
import { XhrInterface, XhrResponse } from "@drupal-js-sdk/interfaces";

/**
 * Tests for Drupal HTTP client initialization.
 * Validates how the HTTP client is selected and configured during Drupal initialization.
 */

class MockXhrClient implements XhrInterface {
  setClient(): XhrInterface { return this; }
  getClient(): unknown { return null; }
  addDefaultHeaders(): XhrInterface { return this; }
  addDefaultOptions(): XhrInterface { return this; }
  getDrupalError(): any { return new Error("Mock error"); }
  
  async call(): Promise<XhrResponse> {
    return {
      data: { data: [] },
      status: 200,
      statusText: "OK",
      headers: {},
      request: {},
      config: {}
    };
  }
}

describe("Drupal Client Initialization", () => {
  
  test("should use provided client when specified in configuration", () => {
    const customClient = new MockXhrClient();
    
    const drupal = new Drupal({
      baseURL: "https://custom-client.example.com",
      client: customClient // Custom client should be used as-is
    });
    
    expect(drupal).toBeInstanceOf(Drupal);
    expect(drupal.getClientService()).toBe(customClient);
  });

  test("should create default FetchClient when no client is provided", () => {
    const drupal = new Drupal({
      baseURL: "https://no-client.example.com"
      // Missing client should trigger automatic FetchClient creation
    });
    
    expect(drupal).toBeInstanceOf(Drupal);
    const clientService = drupal.getClientService();
    expect(clientService).toBeDefined();
    expect(typeof clientService.call).toBe("function");
  });

  test("should handle undefined client configuration", () => {
    const drupal = new Drupal({
      baseURL: "https://undefined-client.example.com",
      client: undefined // Undefined client should create FetchClient
    });
    
    expect(drupal).toBeInstanceOf(Drupal);
    const clientService = drupal.getClientService();
    expect(clientService).toBeDefined();
  });

  test("should handle null client configuration", () => {
    const drupal = new Drupal({
      baseURL: "https://null-client.example.com", 
      client: null as any // Null client should create FetchClient
    });
    
    expect(drupal).toBeInstanceOf(Drupal);
    const clientService = drupal.getClientService();
    expect(clientService).toBeDefined();
  });
});
