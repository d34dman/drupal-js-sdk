import { JsonApiEntityAdapter } from "../JsonApiEntityAdapter";
import { EntityAdapterContext, XhrInterface, XhrResponse } from "@drupal-js-sdk/interfaces";

/**
 * Tests to achieve 100% coverage for JsonApiEntityAdapter.ts
 * Targeting lines: 86-88, 91-96, 115
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

describe("JsonApiEntityAdapter 100% Coverage Tests", () => {
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

  describe("Line Coverage Tests", () => {
    test("Lines 86-88: listPage with options.params instead of options.jsonapi.query", async () => {
      // Test line 86: options?.jsonapi?.query ?? options?.params
      // We want to test the options?.params branch
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

    test("Line 88: listPage with no response data", async () => {
      // Test line 88: response && (response as any).data ? (response as any).data : {}
      // Test when response.data is falsy
      mockClient.setMockResponse(null); // No data

      const result = await adapter.listPage();

      expect(result.items).toHaveLength(0);
      expect(result.page).toBeDefined();
    });

    test("Lines 91-96: listPage with null/undefined object properties", async () => {
      // Test lines 91-96: various nullish coalescing scenarios in object mapping
      mockClient.setMockResponse({
        data: [
          null, // Null row
          undefined, // Undefined row  
          "not-an-object", // String row
          {}, // Empty object
          {
            id: null, // Null id
            type: undefined, // Undefined type
            attributes: null, // Null attributes
            relationships: "not-an-object" // Invalid relationships
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
      
      // Test first item (null row)
      expect(result.items[0].id).toBe("");
      expect(result.items[0].type).toBe("node--article");
      expect(result.items[0].attributes).toEqual({});
      expect(result.items[0].relationships).toBeUndefined();

      // Test item with null/undefined properties
      expect(result.items[4].id).toBe(""); // null ?? "" 
      expect(result.items[4].type).toBe("node--article"); // undefined ?? fallback
      expect(result.items[4].attributes).toEqual({}); // null attributes
      expect(result.items[4].relationships).toBeUndefined(); // invalid relationships

      // Test valid item
      expect(result.items[5].id).toBe("valid-id");
      expect(result.items[5].type).toBe("valid--type");
      expect(result.items[5].attributes).toEqual({ title: "Valid" });
      expect(result.items[5].relationships).toEqual({ field_test: { data: [] } });
    });

    test("Line 115: count with options.params instead of options.jsonapi.query", async () => {
      // Test line 115: options?.jsonapi?.query ?? options?.params
      // We want to test the options?.params branch
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

  describe("Additional Edge Cases for Complete Coverage", () => {
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
        data: "not-an-array", // Should default to empty array
        meta: "not-an-object", // Should default to {}
        links: "not-an-object" // Should default to {}
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
        meta: {} // No count property
      });

      const count = await adapter.count();

      expect(count).toBe(2); // Should fall back to array length
    });

    test("should handle responses with undefined data", async () => {
      mockClient.setMockResponse(undefined); // Completely undefined response

      const result = await adapter.listPage();
      expect(result.items).toHaveLength(0);
    });

    test("should handle toXhrParams edge cases", async () => {
      // Test the toXhrParams utility function edge cases
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

      expect(true).toBe(true); // Just ensure it executes without error
    });
  });
});
