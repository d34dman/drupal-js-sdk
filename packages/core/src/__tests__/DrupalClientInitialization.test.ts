import { Drupal } from "../Drupal";
import { XhrInterface, XhrResponse } from "@drupal-js-sdk/interfaces";

/**
 * Specific test to cover Drupal.ts line 37
 * Line 37: const client = options.client ?? new FetchClient(apiConfig);
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

describe("Drupal Client Coverage - Line 37", () => {
  
  test("Line 37: should use provided client (left side of ??)", () => {
    const customClient = new MockXhrClient();
    
    const drupal = new Drupal({
      baseURL: "https://custom-client.example.com",
      client: customClient // Provided client - should NOT create new FetchClient
    });
    
    expect(drupal).toBeInstanceOf(Drupal);
    expect(drupal.getClientService()).toBe(customClient);
  });

  test("Line 37: should create FetchClient when no client provided (right side of ??)", () => {
    const drupal = new Drupal({
      baseURL: "https://no-client.example.com"
      // No client property - should create new FetchClient
    });
    
    expect(drupal).toBeInstanceOf(Drupal);
    const clientService = drupal.getClientService();
    expect(clientService).toBeDefined();
    expect(typeof clientService.call).toBe("function");
  });

  test("Line 37: should handle undefined client", () => {
    const drupal = new Drupal({
      baseURL: "https://undefined-client.example.com",
      client: undefined // Explicitly undefined - should create new FetchClient
    });
    
    expect(drupal).toBeInstanceOf(Drupal);
    const clientService = drupal.getClientService();
    expect(clientService).toBeDefined();
  });

  test("Line 37: should handle null client", () => {
    const drupal = new Drupal({
      baseURL: "https://null-client.example.com", 
      client: null as any // Explicitly null - should create new FetchClient
    });
    
    expect(drupal).toBeInstanceOf(Drupal);
    const clientService = drupal.getClientService();
    expect(clientService).toBeDefined();
  });
});
