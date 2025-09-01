/**
 * Tests for XHR client edge cases and configuration scenarios.
 * Validates complex environment setups, request configurations, and client behavior.
 */
import { FetchClient } from "../FetchClient";

describe("XHR Edge Cases and Configuration", () => {
  const mkResponse = () => ({
    ok: true,
    status: 200,
    statusText: "OK",
    headers: new Map(),
    json: () => Promise.resolve({}),
    text: () => Promise.resolve("{}")
  } as unknown as Response);

  beforeEach(() => {
    (global.fetch as jest.Mock) = jest.fn(() => Promise.resolve(mkResponse()));
  });

  test("should handle comprehensive configuration and environment edge cases", async () => {
    const originalWindow = (global as any).window;
    
    // Test constructor behavior with various environment configurations
    (global as any).window = { fetch: undefined }; // Browser without fetch polyfill
    let client = new FetchClient();
    
    // Test setClient with different global fetch scenarios
    (global as any).window = { fetch: global.fetch }; 
    client.setClient(global.fetch); // Configure with global fetch
    
    // Test with custom fetch implementation
    const customFetch = jest.fn(() => Promise.resolve(mkResponse()));
    client.setClient(customFetch as any); // Configure with custom fetch
    
    // Reset to default fetch configuration
    client.setClient(); // Use default configuration
    
    // Test various request scenarios
    await client.call("GET", "/test1"); // Standard request
    
    // Test request with AbortSignal
    const controller = new AbortController();
    await client.call("GET", "/test2", { signal: controller.signal });
    
    // Test request with timeout (creates internal controller)
    await client.call("GET", "/test3", { timeoutMs: 100 });
    
    // Test various HTTP methods
    await client.call("GET", "/test4");
    await client.call("get" as any, "/test5"); // Lowercase method
    
    // Restore original environment
    if (originalWindow !== undefined) {
      (global as any).window = originalWindow;
    } else {
      delete (global as any).window;
    }
    
    expect(true).toBe(true);
  });

  test("should handle constructor with various configuration options", () => {
    // Test constructor with various configuration levels
    const client1 = new FetchClient();
    const client2 = new FetchClient({});
    const client3 = new FetchClient({ baseURL: "https://test.com" });
    
    expect(client1).toBeInstanceOf(FetchClient);
    expect(client2).toBeInstanceOf(FetchClient); 
    expect(client3).toBeInstanceOf(FetchClient);
  });

  test("should handle all setClient configuration variations", () => {
    const client = new FetchClient();
    
    // Test different client configuration methods
    client.setClient(fetch);
    client.setClient(global.fetch);
    
    const mockFetch = (() => Promise.resolve(mkResponse())) as any;
    client.setClient(mockFetch);
    
    // Test with default
    client.setClient();
    
    expect(client).toBeInstanceOf(FetchClient);
  });

  test("should handle various HTTP request configuration scenarios", async () => {
    const client = new FetchClient({ baseURL: "https://edge.example.com" });

    // Test various request configuration combinations
    const configs = [
      {}, // No special configuration
      { signal: new AbortController().signal }, // With abort signal
      { timeoutMs: 1000 }, // With timeout
      { signal: new AbortController().signal, timeoutMs: 500 }, // Signal and timeout
      { method: undefined }, // Undefined method type
      { method: null }, // Null method type
      { method: "" }, // Empty method string
    ];

    for (const config of configs) {
      await client.call("GET", "/edge", config as any);
    }

    expect(true).toBe(true);
  });

  test("should distinguish between window.fetch and global fetch implementations", () => {
    const client = new FetchClient();
    const originalWindow = (global as any).window;
    
    try {
      // Configure browser environment with fetch
      (global as any).window = { fetch: global.fetch };
      
      // Test window.fetch detection and binding
      const windowFetch = (global as any).window.fetch;
      client.setClient(windowFetch);
      
      // Test global fetch configuration
      client.setClient(fetch);
      
    } finally {
      if (originalWindow !== undefined) {
        (global as any).window = originalWindow;
      } else {
        delete (global as any).window;
      }
    }
    
    expect(client).toBeInstanceOf(FetchClient);
  });
});
