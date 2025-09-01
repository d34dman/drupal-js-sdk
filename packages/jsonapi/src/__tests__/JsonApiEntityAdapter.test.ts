import { JsonApiEntityAdapter } from "../JsonApiEntityAdapter";
import {
  EntityAdapterContext,
  EntityIdentifier,
  EntityAttributes,
  EntityLoadOptions,
  EntityListOptions,
  StorageInterface,
  StorageRecordInterface,
  StorageValueType,
  XhrInterface,
  XhrResponse,
  XhrRequestConfig,
} from "@drupal-js-sdk/interfaces";

/**
 * Mock Storage implementation for testing
 */
class MockStorage implements StorageInterface {
  private store: StorageRecordInterface = {};

  getItem(keyName: string): StorageValueType {
    return this.store[keyName];
  }

  setItem(keyName: string, keyValue: StorageValueType): void {
    this.store[keyName] = keyValue;
  }

  removeItem(keyName: string): void {
    delete this.store[keyName];
  }

  clear(): void {
    this.store = {};
  }

  getString(keyName: string): string | null {
    const value = this.getItem(keyName);
    return typeof value === "string" ? value : null;
  }

  setString(keyName: string, keyValue: string): void {
    this.setItem(keyName, keyValue);
  }

  isAvailable(): boolean {
    return true;
  }

  get(): StorageRecordInterface | null {
    return { ...this.store };
  }

  set(value: StorageRecordInterface): void {
    this.store = { ...value };
  }
}

/**
 * Mock XHR client with configurable responses
 */
class MockXhrClient implements XhrInterface {
  private mockResponses: Map<string, any> = new Map();
  private callLog: Array<{ method: string; path: string; config?: any }> = [];

  setClient(_client: unknown): XhrInterface {
    return this;
  }

  getClient(): unknown {
    return null;
  }

  addDefaultOptions(_options: Partial<XhrRequestConfig>): XhrInterface {
    return this;
  }

  addDefaultHeaders(_headers: { [key: string]: unknown }): XhrInterface {
    return this;
  }

  getDrupalError(_response: unknown) {
    return {
      name: "MockDrupalError",
      message: "Mock error",
      code: 500,
      getErrorCode: () => 500,
      stack: undefined,
    };
  }

  // Test helper methods
  setMockResponse(path: string, response: any): void {
    this.mockResponses.set(path, response);
  }

  getCallLog(): Array<{ method: string; path: string; config?: any }> {
    return [...this.callLog];
  }

  clearCallLog(): void {
    this.callLog = [];
  }

  async call<T = unknown, D = unknown>(
    method: string,
    path: string,
    config?: XhrRequestConfig<D>
  ): Promise<XhrResponse<T, D>> {
    // Log the call for verification
    this.callLog.push({ method, path, config });

    // Check for mock response
    const mockResponse = this.mockResponses.get(path);
    if (mockResponse) {
      return {
        data: mockResponse as T,
        status: 200,
        statusText: "OK",
        headers: {},
        config: config as XhrRequestConfig<D>,
      };
    }

    // Default response
    const defaultResponse = {
      data: {
        id: "1",
        type: "node--article",
        attributes: { title: "Default Article" },
        relationships: {},
      },
    };

    return {
      data: defaultResponse as T,
      status: 200,
      statusText: "OK",
      headers: {},
      config: config as XhrRequestConfig<D>,
    };
  }
}

describe("JsonApiEntityAdapter", () => {
  let mockClient: MockXhrClient;
  let mockContext: EntityAdapterContext;
  let adapter: JsonApiEntityAdapter<{ title: string; body: string }>;

  beforeEach(() => {
    mockClient = new MockXhrClient();
    
    const identifier: EntityIdentifier = { entity: "node", bundle: "article" };
    mockContext = {
      id: identifier,
      basePath: "/jsonapi/node/article",
      client: mockClient,
      config: new MockStorage(),
    };

    adapter = new JsonApiEntityAdapter<{ title: string; body: string }>(mockContext);
  });

  describe("Constructor", () => {
    test("should create adapter with context", () => {
      expect(adapter).toBeInstanceOf(JsonApiEntityAdapter);
    });

    test("should store context correctly", () => {
      const testContext: EntityAdapterContext = {
        id: { entity: "user", bundle: "user" },
        basePath: "/jsonapi/user/user",
        client: mockClient,
        config: new MockStorage(),
      };

      const testAdapter = new JsonApiEntityAdapter(testContext);
      expect(testAdapter).toBeInstanceOf(JsonApiEntityAdapter);
    });
  });

  describe("load method", () => {
    test("should load single entity successfully", async () => {
      const mockData = {
        data: {
          id: "123",
          type: "node--article",
          attributes: {
            title: "Test Article",
            body: "Test content",
          },
          relationships: {
            author: {
              data: { id: "1", type: "user--user" },
            },
          },
        },
      };

      mockClient.setMockResponse("/jsonapi/node/article/123", mockData);

      const result = await adapter.load("123");

      expect(result.id).toBe("123");
      expect(result.type).toBe("node--article");
      expect(result.attributes.title).toBe("Test Article");
      expect(result.attributes.body).toBe("Test content");
      expect(result.relationships).toBeDefined();
    });

    test("should handle load with options", async () => {
      const mockData = {
        data: {
          id: "456",
          type: "node--article",
          attributes: { title: "Article with Options", body: "Content" },
          relationships: {},
        },
      };

      mockClient.setMockResponse("/jsonapi/node/article/456", mockData);

      const options: EntityLoadOptions = {
        jsonapi: {
          query: {
            include: "field_author",
            "fields[node--article]": "title,body",
          },
        },
      };

      const result = await adapter.load("456", options);

      expect(result.id).toBe("456");
      expect(result.attributes.title).toBe("Article with Options");

      // Verify the call was made with correct parameters
      const calls = mockClient.getCallLog();
      expect(calls).toHaveLength(1);
      expect(calls[0].method).toBe("GET");
      expect(calls[0].path).toBe("/jsonapi/node/article/456");
      expect(calls[0].config?.params).toBeDefined();
    });

    test("should handle load with params options", async () => {
      const options: EntityLoadOptions = {
        params: {
          include: "author",
          sort: "-created",
        },
      };

      await adapter.load("789", options);

      const calls = mockClient.getCallLog();
      expect(calls[0].config?.params).toBeDefined();
    });

    test("should handle entity ID with special characters", async () => {
      const specialId = "test-id_123.456";
      const mockData = {
        data: {
          id: specialId,
          type: "node--article",
          attributes: { title: "Special ID Article", body: "Content" },
        },
      };

      mockClient.setMockResponse(`/jsonapi/node/article/${encodeURIComponent(specialId)}`, mockData);

      const result = await adapter.load(specialId);

      expect(result.id).toBe(specialId);

      // Verify URL encoding
      const calls = mockClient.getCallLog();
      expect(calls[0].path).toBe("/jsonapi/node/article/test-id_123.456");
    });

    test("should handle empty response data", async () => {
      mockClient.setMockResponse("/jsonapi/node/article/empty", {});

      const result = await adapter.load("empty");

      expect(result.id).toBe("");
      expect(result.type).toBe("node--article");
      expect(result.attributes).toEqual({});
      expect(result.relationships).toBeUndefined();
    });

    test("should handle null response data", async () => {
      mockClient.setMockResponse("/jsonapi/node/article/null", { data: null });

      const result = await adapter.load("null");

      expect(result.id).toBe("");
      expect(result.type).toBe("node--article");
      expect(result.attributes).toEqual({});
    });

    test("should handle malformed response data", async () => {
      mockClient.setMockResponse("/jsonapi/node/article/malformed", {
        data: {
          data: "not an object",
        },
      });

      const result = await adapter.load("malformed");

      expect(result.id).toBe("");
      expect(result.type).toBe("node--article");
      expect(result.attributes).toEqual({});
    });

    test("should handle missing attributes in response", async () => {
      const mockData = {
        data: {
          id: "no-attrs",
          type: "node--article",
          // No attributes property
        },
      };

      mockClient.setMockResponse("/jsonapi/node/article/no-attrs", mockData);

      const result = await adapter.load("no-attrs");

      expect(result.id).toBe("no-attrs");
      expect(result.type).toBe("node--article");
      expect(result.attributes).toEqual({});
    });

    test("should handle missing relationships in response", async () => {
      const mockData = {
        data: {
          data: {
            id: "no-rels",
            type: "node--article",
            attributes: { title: "No Relationships", body: "Content" },
            // No relationships property
          },
        },
      };

      mockClient.setMockResponse("/jsonapi/node/article/no-rels", mockData);

      const result = await adapter.load("no-rels");

      expect(result.relationships).toBeUndefined();
    });

    test("should fallback to context type when response type is missing", async () => {
      const mockData = {
        data: {
          data: {
            id: "no-type",
            // No type property
            attributes: { title: "No Type", body: "Content" },
          },
        },
      };

      mockClient.setMockResponse("/jsonapi/node/article/no-type", mockData);

      const result = await adapter.load("no-type");

      expect(result.type).toBe("node--article"); // Should use context fallback
    });
  });

  describe("list method", () => {
    test("should list multiple entities", async () => {
      const mockData = {
        data: [
          {
            id: "1",
            type: "node--article",
            attributes: { title: "Article 1", body: "Content 1" },
            relationships: {},
          },
          {
            id: "2",
            type: "node--article",
            attributes: { title: "Article 2", body: "Content 2" },
            relationships: {},
          },
        ],
      };

      mockClient.setMockResponse("/jsonapi/node/article", mockData);

      const results = await adapter.list();

      expect(Array.isArray(results)).toBe(true);
      expect(results).toHaveLength(2);
      expect(results[0].id).toBe("1");
      expect(results[0].attributes.title).toBe("Article 1");
      expect(results[1].id).toBe("2");
      expect(results[1].attributes.title).toBe("Article 2");
    });

    test("should handle empty list response", async () => {
      const mockData = { data: [] };

      mockClient.setMockResponse("/jsonapi/node/article", mockData);

      const results = await adapter.list();

      expect(Array.isArray(results)).toBe(true);
      expect(results).toHaveLength(0);
    });

    test("should handle list with options", async () => {
      const mockData = {
        data: [
          {
            id: "filtered-1",
            type: "node--article",
            attributes: { title: "Filtered Article", body: "Filtered content" },
          },
        ],
      };

      mockClient.setMockResponse("/jsonapi/node/article", mockData);

      const options: EntityListOptions = {
        jsonapi: {
          query: {
            "filter[status]": "1",
            "page[limit]": "10",
          },
        },
      };

      const results = await adapter.list(options);

      expect(results).toHaveLength(1);
      expect(results[0].attributes.title).toBe("Filtered Article");

      // Verify parameters were passed
      const calls = mockClient.getCallLog();
      expect(calls[0].config?.params).toBeDefined();
    });

    test("should handle non-array response data", async () => {
      const mockData = { data: "not an array" };

      mockClient.setMockResponse("/jsonapi/node/article", mockData);

      const results = await adapter.list();

      expect(Array.isArray(results)).toBe(true);
      expect(results).toHaveLength(0);
    });

    test("should handle malformed list items", async () => {
      const mockData = {
        data: [
          {
            id: "good-item",
            type: "node--article",
            attributes: { title: "Good Item", body: "Good content" },
          },
          null, // Bad item
          "not an object", // Bad item
          {
            // Item without attributes
            id: "no-attrs-item",
            type: "node--article",
          },
        ],
      };

      mockClient.setMockResponse("/jsonapi/node/article", mockData);

      const results = await adapter.list();

      expect(results).toHaveLength(4);
      expect(results[0].attributes.title).toBe("Good Item");
      expect(results[1].id).toBe(""); // null item becomes empty record
      expect(results[2].id).toBe(""); // string item becomes empty record
      expect(results[3].id).toBe("no-attrs-item");
      expect(results[3].attributes).toEqual({});
    });
  });

  describe("listPage method", () => {
    test("should return paginated list with meta information", async () => {
      const mockData = {
        data: [
          {
            id: "page-1",
            type: "node--article",
            attributes: { title: "Page Article 1", body: "Page content 1" },
          },
          {
            id: "page-2",
            type: "node--article",
            attributes: { title: "Page Article 2", body: "Page content 2" },
          },
        ],
        meta: {
          count: 25,
          pageSize: 2,
          pageNumber: 1,
        },
        links: {
          next: {
            href: "/jsonapi/node/article?page[offset]=2&page[limit]=2",
          },
          prev: null,
        },
      };

      mockClient.setMockResponse("/jsonapi/node/article", mockData);

      const result = await adapter.listPage();

      expect(result).toHaveProperty("items");
      expect(result).toHaveProperty("page");
      expect(Array.isArray(result.items)).toBe(true);
      expect(result.items).toHaveLength(2);
      expect(result.items[0].id).toBe("page-1");
      expect(result.page?.total).toBe(25);
      expect(result.page?.size).toBe(2);
      expect(result.page?.number).toBe(1);
      expect(result.page?.next).toBe("/jsonapi/node/article?page[offset]=2&page[limit]=2");
      expect(result.page?.prev).toBeNull();
    });

    test("should handle listPage with options", async () => {
      const mockData = {
        data: [],
        meta: { count: 0 },
        links: {},
      };

      mockClient.setMockResponse("/jsonapi/node/article", mockData);

      const options: EntityListOptions = {
        jsonapi: {
          query: {
            "page[limit]": "5",
            "page[offset]": "10",
          },
        },
      };

      const result = await adapter.listPage(options);

      expect(result.items).toHaveLength(0);
      expect(result.page?.total).toBe(0);

      const calls = mockClient.getCallLog();
      expect(calls[0].config?.params).toBeDefined();
    });

    test("should handle missing meta information", async () => {
      const mockData = {
        data: [
          {
            id: "no-meta",
            type: "node--article",
            attributes: { title: "No Meta", body: "No meta content" },
          },
        ],
        // No meta property
        links: {},
      };

      mockClient.setMockResponse("/jsonapi/node/article", mockData);

      const result = await adapter.listPage();

      expect(result.items).toHaveLength(1);
      expect(result.page?.total).toBeUndefined();
      expect(result.page?.size).toBeUndefined();
      expect(result.page?.number).toBeUndefined();
    });

    test("should handle missing links information", async () => {
      const mockData = {
        data: [],
        meta: { count: 0 },
        // No links property
      };

      mockClient.setMockResponse("/jsonapi/node/article", mockData);

      const result = await adapter.listPage();

      expect(result.page?.next).toBeNull();
      expect(result.page?.prev).toBeNull();
    });

    test("should handle malformed links", async () => {
      const mockData = {
        data: [],
        meta: { count: 0 },
        links: {
          next: "not an object",
          prev: { href: 123 }, // href is not a string
        },
      };

      mockClient.setMockResponse("/jsonapi/node/article", mockData);

      const result = await adapter.listPage();

      expect(result.page?.next).toBeNull();
      expect(result.page?.prev).toBeNull();
    });

    test("should handle empty response", async () => {
      mockClient.setMockResponse("/jsonapi/node/article", {});

      const result = await adapter.listPage();

      expect(result.items).toHaveLength(0);
      expect(result.page?.total).toBeUndefined();
    });
  });

  describe("count method", () => {
    test("should return count from meta information", async () => {
      const mockData = {
        data: [],
        meta: {
          count: 42,
        },
      };

      mockClient.setMockResponse("/jsonapi/node/article", mockData);

      const result = await adapter.count();

      expect(result).toBe(42);
    });

    test("should fallback to data length when meta count is not available", async () => {
      const mockData = {
        data: [
          { id: "1", type: "node--article", attributes: {} },
          { id: "2", type: "node--article", attributes: {} },
          { id: "3", type: "node--article", attributes: {} },
        ],
        meta: {
          // No count property
        },
      };

      mockClient.setMockResponse("/jsonapi/node/article", mockData);

      const result = await adapter.count();

      expect(result).toBe(3);
    });

    test("should handle count with options", async () => {
      const mockData = {
        data: [],
        meta: { count: 5 },
      };

      mockClient.setMockResponse("/jsonapi/node/article", mockData);

      const options: EntityListOptions = {
        jsonapi: {
          query: {
            "filter[status]": "published",
          },
        },
      };

      const result = await adapter.count(options);

      expect(result).toBe(5);

      const calls = mockClient.getCallLog();
      expect(calls[0].config?.params).toBeDefined();
    });

    test("should handle missing meta", async () => {
      const mockData = {
        data: [
          { id: "1", type: "node--article", attributes: {} },
          { id: "2", type: "node--article", attributes: {} },
        ],
        // No meta property
      };

      mockClient.setMockResponse("/jsonapi/node/article", mockData);

      const result = await adapter.count();

      expect(result).toBe(2);
    });

    test("should handle non-array data", async () => {
      const mockData = {
        data: "not an array",
        meta: {
          // No count
        },
      };

      mockClient.setMockResponse("/jsonapi/node/article", mockData);

      const result = await adapter.count();

      expect(result).toBe(0);
    });

    test("should handle empty response", async () => {
      mockClient.setMockResponse("/jsonapi/node/article", {});

      const result = await adapter.count();

      expect(result).toBe(0);
    });
  });

  describe("Parameter Conversion", () => {
    test("should convert various parameter types correctly", async () => {
      const options: EntityLoadOptions = {
        jsonapi: {
          query: {
            stringParam: "value",
            numberParam: 42,
            booleanParam: true,
            arrayParam: ["a", "b", "c"],
            numberArrayParam: [1, 2, 3],
            booleanArrayParam: [true, false],
            nullParam: null,
            undefinedParam: undefined,
            objectParam: { nested: "value" },
          },
        },
      };

      await adapter.load("param-test", options);

      const calls = mockClient.getCallLog();
      const params = calls[0].config?.params;

      expect(params?.stringParam).toBe("value");
      expect(params?.numberParam).toBe(42);
      expect(params?.booleanParam).toBe(true);
      expect(params?.arrayParam).toEqual(["a", "b", "c"]);
      expect(params?.numberArrayParam).toEqual(["1", "2", "3"]);
      expect(params?.booleanArrayParam).toEqual(["true", "false"]);
      expect(params?.nullParam).toBeUndefined(); // null values are skipped
      expect(params?.undefinedParam).toBeUndefined(); // undefined values are skipped
      expect(params?.objectParam).toBe("[object Object]"); // objects are stringified
    });

    test("should handle undefined query parameters", async () => {
      const options: EntityLoadOptions = {
        // No jsonapi or params
      };

      await adapter.load("no-params", options);

      const calls = mockClient.getCallLog();
      expect(calls[0].config?.params).toBeUndefined();
    });

    test("should prefer jsonapi query over params", async () => {
      const options: EntityLoadOptions = {
        params: {
          fromParams: "ignored",
        },
        jsonapi: {
          query: {
            fromJsonapi: "used",
          },
        },
      };

      await adapter.load("preference-test", options);

      const calls = mockClient.getCallLog();
      const params = calls[0].config?.params;

      expect(params?.fromJsonapi).toBe("used");
      expect(params?.fromParams).toBeUndefined();
    });

    test("should use params when jsonapi query is not available", async () => {
      const options: EntityLoadOptions = {
        params: {
          fallbackParam: "used",
        },
        jsonapi: {
          // No query property
        },
      };

      await adapter.load("fallback-test", options);

      const calls = mockClient.getCallLog();
      const params = calls[0].config?.params;

      expect(params?.fallbackParam).toBe("used");
    });
  });

  describe("Type Safety", () => {
    test("should maintain type safety for different attribute types", () => {
      interface CustomAttributes extends EntityAttributes {
        customField: string;
        customNumber: number;
        customBoolean: boolean;
      }

      const customContext: EntityAdapterContext = {
        id: { entity: "custom", bundle: "entity" },
        basePath: "/jsonapi/custom/entity",
        client: mockClient,
        config: new MockStorage(),
      };

      const customAdapter = new JsonApiEntityAdapter<CustomAttributes>(customContext);

      expect(customAdapter).toBeInstanceOf(JsonApiEntityAdapter);
    });

    test("should work with minimal EntityAttributes", () => {
      const minimalAdapter = new JsonApiEntityAdapter<{ title: string }>(mockContext);

      expect(minimalAdapter).toBeInstanceOf(JsonApiEntityAdapter);
    });
  });

  describe("Error Handling", () => {
    test("should handle XHR client errors gracefully", async () => {
      // Create a client that throws errors
      const errorClient: XhrInterface = {
        setClient: () => errorClient,
        getClient: () => null,
        addDefaultOptions: () => errorClient,
        addDefaultHeaders: () => errorClient,
        getDrupalError: () => ({
          name: "XhrError",
          message: "Client error",
          code: 500,
          getErrorCode: () => 500,
        }),
        call: async () => {
          throw new Error("Network error");
        },
      };

      const errorContext: EntityAdapterContext = {
        id: { entity: "error", bundle: "test" },
        basePath: "/jsonapi/error/test",
        client: errorClient,
        config: new MockStorage(),
      };

      const errorAdapter = new JsonApiEntityAdapter(errorContext);

      await expect(errorAdapter.load("error-id")).rejects.toThrow("Network error");
    });
  });

  describe("Edge Cases and Complete Branch Coverage", () => {
    test("should handle response with null data in list", async () => {
      const mockData = {
        data: null,
      };

      mockClient.setMockResponse("/jsonapi/node/article", mockData);

      const results = await adapter.list();

      expect(Array.isArray(results)).toBe(true);
      expect(results).toHaveLength(0);
    });

    test("should handle response with no data property in list", async () => {
      const mockData = {
        // No data property at all
        meta: { count: 0 },
      };

      mockClient.setMockResponse("/jsonapi/node/article", mockData);

      const results = await adapter.list();

      expect(Array.isArray(results)).toBe(true);
      expect(results).toHaveLength(0);
    });

    test("should handle response with null data in listPage", async () => {
      const mockData = {
        data: null,
        meta: { count: 0 },
        links: {},
      };

      mockClient.setMockResponse("/jsonapi/node/article", mockData);

      const result = await adapter.listPage();

      expect(result.items).toHaveLength(0);
      expect(result.page?.total).toBe(0);
    });

    test("should handle complex links structure in listPage", async () => {
      const mockData = {
        data: [],
        meta: { count: 0 },
        links: {
          next: {
            href: "/next-page",
            meta: { title: "Next page" },
          },
          prev: {
            href: "/prev-page",
            meta: { title: "Previous page" },
          },
          first: {
            href: "/first-page",
          },
        },
      };

      mockClient.setMockResponse("/jsonapi/node/article", mockData);

      const result = await adapter.listPage();

      expect(result.page?.next).toBe("/next-page");
      expect(result.page?.prev).toBe("/prev-page");
    });

    test("should handle non-number meta values in listPage", async () => {
      const mockData = {
        data: [],
        meta: {
          count: "not a number",
          pageSize: "also not a number",
          pageNumber: null,
          otherField: { nested: "object" },
        },
        links: {},
      };

      mockClient.setMockResponse("/jsonapi/node/article", mockData);

      const result = await adapter.listPage();

      expect(result.page?.total).toBeUndefined();
      expect(result.page?.size).toBeUndefined();
      expect(result.page?.number).toBeUndefined();
    });

    test("should handle response with null meta in count", async () => {
      const mockData = {
        data: [
          { id: "1", type: "node--article", attributes: {} },
          { id: "2", type: "node--article", attributes: {} },
        ],
        meta: null,
      };

      mockClient.setMockResponse("/jsonapi/node/article", mockData);

      const result = await adapter.count();

      expect(result).toBe(2); // Should fallback to data.length
    });

    test("should handle response with non-object meta in count", async () => {
      const mockData = {
        data: [{ id: "1", type: "node--article", attributes: {} }],
        meta: "not an object",
      };

      mockClient.setMockResponse("/jsonapi/node/article", mockData);

      const result = await adapter.count();

      expect(result).toBe(1);
    });

    test("should handle complex parameter conversion scenarios", async () => {
      const options: EntityLoadOptions = {
        jsonapi: {
          query: {
            simpleString: "test",
            emptyString: "",
            zeroNumber: 0,
            falseBoolean: false,
            emptyArray: [],
            mixedArray: ["string", 42, true, null],
            nestedObject: { level1: { level2: "deep" } },
            symbolValue: Symbol("test") as any,
            functionValue: (() => "test") as any,
          },
        },
      };

      await adapter.load("complex-params", options);

      const calls = mockClient.getCallLog();
      const params = calls[0].config?.params;

      expect(params?.simpleString).toBe("test");
      expect(params?.emptyString).toBe("");
      expect(params?.zeroNumber).toBe(0);
      expect(params?.falseBoolean).toBe(false);
      expect(params?.emptyArray).toEqual([]);
      expect(params?.mixedArray).toEqual(["string", "42", "true", "null"]); // null in array becomes "null"
      expect(typeof params?.nestedObject).toBe("string");
      expect(typeof params?.symbolValue).toBe("string");
      expect(typeof params?.functionValue).toBe("string");
    });

    test("should handle all falsy values in parameter conversion", async () => {
      const options: EntityLoadOptions = {
        jsonapi: {
          query: {
            nullValue: null,
            undefinedValue: undefined,
            emptyString: "",
            zeroNumber: 0,
            falseBool: false,
            nanValue: NaN,
          },
        },
      };

      await adapter.load("falsy-params", options);

      const calls = mockClient.getCallLog();
      const params = calls[0].config?.params;

      expect(params?.nullValue).toBeUndefined(); // null should be skipped
      expect(params?.undefinedValue).toBeUndefined(); // undefined should be skipped
      expect(params?.emptyString).toBe("");
      expect(params?.zeroNumber).toBe(0);
      expect(params?.falseBool).toBe(false);
      expect(params?.nanValue).toBeNaN(); // NaN is a number, passed through as-is
    });

    test("should handle extremely deep response structures", async () => {
      const deepResponse = {
        data: {
          id: "deep-test",
          type: "node--article",
          attributes: {
            title: "Deep Structure",
            body: "Content",
            nested: {
              level1: {
                level2: {
                  level3: {
                    deepValue: "found it!",
                  },
                },
              },
            },
          },
          relationships: {
            deepRel: {
              data: {
                id: "related-1",
                type: "related--type",
                meta: { count: 1 },
              },
              links: {
                self: "/api/relationship/self",
                related: "/api/relationship/related",
              },
            },
          },
        },
      };

      mockClient.setMockResponse("/jsonapi/node/article/deep-test", deepResponse);

      const result = await adapter.load("deep-test");

      expect(result.id).toBe("deep-test");
      expect(result.attributes.title).toBe("Deep Structure");
      expect((result.attributes as any).nested.level1.level2.level3.deepValue).toBe("found it!");
      expect(result.relationships?.deepRel).toBeDefined();
    });
  });
});
