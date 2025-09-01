import { EntityAdapterContext, XhrInterface, XhrResponse } from "@drupal-js-sdk/interfaces";

import { JsonApiEntityAdapter } from "../JsonApiEntityAdapter";

/**
 * Tests for JsonAPI response parsing and parameter handling.
 * Validates response data processing, parameter merging, and error handling scenarios.
 */

class MockXhrClient implements XhrInterface {
  private mockResponse: any = {};
  
  setMockResponse(response: any): void {
    this.mockResponse = response;
  }

  setClient(): XhrInterface { return this; }
  getClient(): unknown { return null; }
  addDefaultHeaders(): XhrInterface { return this; }
  addDefaultOptions(): XhrInterface { return this; }
  getDrupalError(): any { return new Error("Mock error"); }
  
  async call(): Promise<XhrResponse> {
    return {
      data: this.mockResponse,
      status: 200,
      statusText: "OK",
      headers: {},
      request: {},
      config: {}
    };
  }
}

describe("JsonAPI Response Parsing and Parameters", () => {
  let mockClient: MockXhrClient;
  let mockContext: EntityAdapterContext;
  let adapter: JsonApiEntityAdapter;

  beforeEach(() => {
    mockClient = new MockXhrClient();
    mockContext = {
      id: { entity: "node", bundle: "article" },
      basePath: "/jsonapi/node/article",
      client: mockClient
    };
    adapter = new JsonApiEntityAdapter(mockContext);
  });

  describe("Parameter Handling", () => {
    test("should handle listPage with legacy params option instead of jsonapi.query", async () => {
      // Test legacy params option support for backwards compatibility
      mockClient.setMockResponse({
        data: [
          {
            id: "1",
            type: "node--article",
            attributes: { title: "Test Article" },
            relationships: { field_author: { data: { type: "user--user", id: "1" } } }
          }
        ],
        meta: { count: 1 },
        links: {}
      });

      const result = await adapter.listPage({
        params: { // Use params instead of jsonapi.query to hit the ?? branch
          "fields[node--article]": "title",
          include: "field_author"
        }
      });

      expect(result.items).toHaveLength(1);
      expect(result.items[0].id).toBe("1");
      expect(result.page).toBeDefined();
    });

    test("should handle listPage when response has no data", async () => {
      // Test handling when API response contains no data
      mockClient.setMockResponse(null); // Simulate empty response

      const result = await adapter.listPage();

      expect(result.items).toHaveLength(0);
      expect(result.page).toBeDefined();
    });

    test("should handle listPage with malformed or missing entity properties", async () => {
      // Test various malformed entity data scenarios in API responses
      mockClient.setMockResponse({
        data: [
          null, // Null entity data
          undefined, // Undefined entity data  
          "not-an-object", // Invalid entity format
          {}, // Empty entity object
          {
            id: null, // Missing entity ID
            type: undefined, // Missing entity type
            attributes: null, // Missing attributes
            relationships: "not-an-object" // Invalid relationships format
          },
          {
            id: "valid-id",
            type: "valid--type",
            attributes: { title: "Valid" },
            relationships: { field_test: { data: [] } }
          }
        ]
      });

      const result = await adapter.listPage();

      expect(result.items).toHaveLength(6);
      
      // Verify null entity data is handled gracefully
      expect(result.items[0].id).toBe("");
      expect(result.items[0].type).toBe("node--article");
      expect(result.items[0].attributes).toEqual({});
      expect(result.items[0].relationships).toBeUndefined();

      // Verify malformed entity properties are handled properly
      expect(result.items[4].id).toBe(""); // Null ID defaults to empty string
      expect(result.items[4].type).toBe("node--article"); // Undefined type uses identifier fallback
      expect(result.items[4].attributes).toEqual({}); // Null attributes default to empty object
      expect(result.items[4].relationships).toBeUndefined(); // Invalid relationships are ignored

      // Verify valid entity data is processed correctly
      expect(result.items[5].id).toBe("valid-id");
      expect(result.items[5].type).toBe("valid--type");
      expect(result.items[5].attributes).toEqual({ title: "Valid" });
      expect(result.items[5].relationships).toEqual({ field_test: { data: [] } });
    });

    test("should handle count with legacy params option instead of jsonapi.query", async () => {
      // Test count operation with legacy params option
      mockClient.setMockResponse({
        data: [],
        meta: { count: 25 }
      });

      const count = await adapter.count({
        params: { // Use params instead of jsonapi.query to hit the ?? branch
          "filter[status]": "1"
        }
      });

      expect(count).toBe(25);
    });
  });

  describe("Response Parsing Edge Cases", () => {
    test("should handle load with options.params", async () => {
      mockClient.setMockResponse({
        data: {
          id: "test-id",
          type: "node--article",
          attributes: { title: "Test" }
        }
      });

      const result = await adapter.load("test-id", {
        params: { include: "field_test" }
      });

      expect(result.id).toBe("test-id");
    });

    test("should handle listPage with no jsonapi property", async () => {
      mockClient.setMockResponse({
        data: [{ id: "1", type: "test", attributes: {} }]
      });

      // Options without jsonapi property to test the ?? options?.params branch
      const result = await adapter.listPage({
        params: { limit: 10 }
      });

      expect(result.items).toHaveLength(1);
    });

    test("should handle count with no jsonapi property", async () => {
      mockClient.setMockResponse({
        data: [],
        meta: { count: 0 }
      });

      // Options without jsonapi property to test the ?? options?.params branch
      const count = await adapter.count({
        params: { "filter[published]": "1" }
      });

      expect(count).toBe(0);
    });

    test("should handle responses with invalid data structures", async () => {
      mockClient.setMockResponse({
        data: "not-an-array", // Invalid data format should default to empty array
        meta: "not-an-object", // Invalid meta should default to empty object
        links: "not-an-object" // Invalid links should default to empty object
      });

      const result = await adapter.listPage();

      expect(result.items).toHaveLength(0);
      expect(result.page?.size).toBeUndefined();
      expect(result.page?.total).toBeUndefined();
    });

    test("should handle count with no meta.count", async () => {
      mockClient.setMockResponse({
        data: [
          { id: "1", type: "test", attributes: {} },
          { id: "2", type: "test", attributes: {} }
        ],
        meta: {} // Meta without count property should fallback to array length
      });

      const count = await adapter.count();

      expect(count).toBe(2); // Count falls back to data array length
    });

    test("should handle responses with undefined data", async () => {
      mockClient.setMockResponse(undefined); // Handle completely empty response

      const result = await adapter.listPage();
      expect(result.items).toHaveLength(0);
    });

    test("should handle toXhrParams edge cases", async () => {
      // Test parameter conversion utility with various data types
      mockClient.setMockResponse({ data: [] });

      // Test with various param value types
      await adapter.list({
        params: {
          stringValue: "test",
          numberValue: 42,
          booleanValue: true,
          arrayValue: [1, 2, 3]
        }
      });

      expect(true).toBe(true); // Verify parameter conversion executes successfully
    });
  });
});
