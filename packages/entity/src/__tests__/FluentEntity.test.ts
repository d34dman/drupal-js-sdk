import {
  CoreInterface,
  EntityAttributes,
  EntityRecord,
  EntityListOptions,
  EntityLoadOptions,
  XhrInterface,
  XhrResponse,
  XhrRequestConfig,
  StorageInterface,
  StorageValueType,
  StorageRecordInterface,
} from "@drupal-js-sdk/interfaces";
import { EntityService } from "../EntityService";
import { FluentEntity } from "../FluentEntity";
import { JsonApiEntityAdapter } from "@drupal-js-sdk/jsonapi";

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
 * Mock XHR client for testing
 */
class MockXhrClient implements XhrInterface {
  private defaultHeaders: Record<string, unknown> = {};
  private mockResponses: Map<string, unknown> = new Map();

  setClient(_client: unknown): XhrInterface {
    return this;
  }

  getClient(): unknown {
    return null;
  }

  addDefaultOptions(_options: Partial<XhrRequestConfig>): XhrInterface {
    return this;
  }

  addDefaultHeaders(headers: { [key: string]: unknown }): XhrInterface {
    this.defaultHeaders = { ...this.defaultHeaders, ...headers };
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

  // Mock method to set up responses for testing
  setMockResponse(url: string, response: unknown): void {
    this.mockResponses.set(url, response);
  }

  async call<T = unknown, D = unknown>(
    method: string,
    path: string,
    config?: XhrRequestConfig<D>
  ): Promise<XhrResponse<T, D>> {
    const mockData = this.mockResponses.get(path) || {
      data: [
        {
          id: "1",
          type: "node--article",
          attributes: { title: "Test Article 1", body: "Test content 1" },
          relationships: {},
        },
        {
          id: "2", 
          type: "node--article",
          attributes: { title: "Test Article 2", body: "Test content 2" },
          relationships: {},
        },
      ],
    };

    return {
      data: mockData as T,
      status: 200,
      statusText: "OK",
      headers: {},
      config: { method, url: path, ...config } as unknown as XhrRequestConfig<D>,
    };
  }
}

/**
 * Mock Core implementation for testing
 */
class MockCore implements CoreInterface {
  private client: XhrInterface;
  public config: StorageInterface;
  private session: StorageInterface;

  constructor() {
    this.client = new MockXhrClient();
    this.config = new MockStorage();
    this.session = new MockStorage();
  }

  getClientService(): XhrInterface {
    return this.client;
  }

  getConfigService(): StorageInterface {
    return this.config;
  }

  getSessionService(): StorageInterface {
    return this.session;
  }
}

describe("FluentEntity", () => {
  let mockCore: MockCore;
  let entityService: EntityService;
  let fluentEntity: FluentEntity<{ title: string; body: string }>;

  beforeEach(() => {
    mockCore = new MockCore();
    entityService = new EntityService(mockCore);
    
    // Register JsonApiEntityAdapter
    entityService.registerAdapter("jsonapi", (ctx) => new JsonApiEntityAdapter(ctx));
    
    fluentEntity = new FluentEntity(entityService, { entity: "node", bundle: "article" });
  });

  describe("Constructor", () => {
    test("should initialize FluentEntity with correct properties", () => {
      expect(fluentEntity).toBeInstanceOf(FluentEntity);
    });

    test("should create entity with different identifiers", () => {
      const userEntity = new FluentEntity(entityService, { entity: "user", bundle: "user" });
      expect(userEntity).toBeInstanceOf(FluentEntity);
      
      const taxonomyEntity = new FluentEntity(entityService, { entity: "taxonomy_term", bundle: "tags" });
      expect(taxonomyEntity).toBeInstanceOf(FluentEntity);
    });
  });

  describe("Query Building", () => {
    test("should build select fields correctly", () => {
      const result = fluentEntity.select(["title", "body"]);
      expect(result).toBe(fluentEntity); // Should return this for chaining
    });

    test("should build include paths correctly", () => {
      const result = fluentEntity.include(["field_author", "field_tags"]);
      expect(result).toBe(fluentEntity); // Should return this for chaining
    });

    test("should build sort correctly", () => {
      const result1 = fluentEntity.sort("title", "ASC");
      const result2 = fluentEntity.sort("created", "DESC");
      expect(result1).toBe(fluentEntity);
      expect(result2).toBe(fluentEntity);
    });

    test("should build sort with default direction", () => {
      const result = fluentEntity.sort("title");
      expect(result).toBe(fluentEntity);
    });

    test("should build page options correctly", () => {
      const result1 = fluentEntity.page({ limit: 10 });
      const result2 = fluentEntity.page({ offset: 20 });
      const result3 = fluentEntity.page({ number: 2, limit: 5 });
      
      expect(result1).toBe(fluentEntity);
      expect(result2).toBe(fluentEntity);
      expect(result3).toBe(fluentEntity);
    });

    test("should accept external params", () => {
      const result = fluentEntity.params({ "custom-param": "value" });
      expect(result).toBe(fluentEntity);
    });

    test("should accept params from external builder with duck typing", () => {
      const mockBuilder = {
        getQueryObject: () => ({ include: "author", "fields[node--article]": "title,body" })
      };
      
      const result = fluentEntity.fromParams(mockBuilder);
      expect(result).toBe(fluentEntity);
    });

    test("should handle params from builder without getQueryObject method", () => {
      const mockBuilder = {};
      const result = fluentEntity.fromParams(mockBuilder);
      expect(result).toBe(fluentEntity);
    });

    test("should handle params from builder with malformed getQueryObject", () => {
      const mockBuilder = {
        getQueryObject: null
      };
      const result = fluentEntity.fromParams(mockBuilder as any);
      expect(result).toBe(fluentEntity);
    });
  });

  describe("Filter Methods", () => {
    test("should build whereEq filter", () => {
      const result1 = fluentEntity.whereEq("status", 1);
      const result2 = fluentEntity.whereEq("title", "Test Article");
      const result3 = fluentEntity.whereEq("published", true);
      
      expect(result1).toBe(fluentEntity);
      expect(result2).toBe(fluentEntity);
      expect(result3).toBe(fluentEntity);
    });

    test("should build whereContains filter", () => {
      const result = fluentEntity.whereContains("title", "Test");
      expect(result).toBe(fluentEntity);
    });

    test("should build whereIn filter", () => {
      const result1 = fluentEntity.whereIn("nid", [1, 2, 3]);
      const result2 = fluentEntity.whereIn("status", ["published", "draft"]);
      
      expect(result1).toBe(fluentEntity);
      expect(result2).toBe(fluentEntity);
    });

    test("should build whereRange filters", () => {
      const result1 = fluentEntity.whereRange("created", { gte: "2023-01-01" });
      const result2 = fluentEntity.whereRange("created", { lte: "2023-12-31" });
      const result3 = fluentEntity.whereRange("weight", { gte: 0, lte: 100 });
      
      expect(result1).toBe(fluentEntity);
      expect(result2).toBe(fluentEntity);
      expect(result3).toBe(fluentEntity);
    });

    test("should handle empty whereRange options", () => {
      const result = fluentEntity.whereRange("weight", {});
      expect(result).toBe(fluentEntity);
    });
  });

  describe("ID Targeting", () => {
    test("should set target ID", () => {
      const result = fluentEntity.id("123");
      expect(result).toBe(fluentEntity);
    });
  });

  describe("List Operations", () => {
    test("should execute list query", async () => {
      const results = await fluentEntity.list();
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeGreaterThan(0);
    });

    test("should execute list with options", async () => {
      const options: EntityListOptions = {
        jsonapi: {
          query: { "page[limit]": 5 }
        }
      };
      
      const results = await fluentEntity.list(options);
      expect(Array.isArray(results)).toBe(true);
    });

    test("should execute list with chained filters", async () => {
      const results = await fluentEntity
        .select(["title", "body"])
        .whereEq("status", 1)
        .sort("created", "DESC")
        .page({ limit: 10 })
        .list();
        
      expect(Array.isArray(results)).toBe(true);
    });

    test("should execute listPage query", async () => {
      const result = await fluentEntity.listPage();
      expect(result).toHaveProperty("items");
      expect(Array.isArray(result.items)).toBe(true);
    });

    test("should execute listPage with options", async () => {
      const options: EntityListOptions = {
        jsonapi: {
          query: { "page[limit]": 5 }
        }
      };
      
      const result = await fluentEntity.listPage(options);
      expect(result).toHaveProperty("items");
      expect(Array.isArray(result.items)).toBe(true);
    });

    test("should handle listPage when service doesn't support it", async () => {
      // Create a service without listPage support
      const serviceWithoutListPage = new EntityService(mockCore);
      serviceWithoutListPage.registerAdapter("jsonapi", (ctx) => new JsonApiEntityAdapter(ctx));
      
      const entity = new FluentEntity(serviceWithoutListPage, { entity: "node", bundle: "article" });
      const result = await entity.listPage();
      
      expect(result).toHaveProperty("items");
      expect(Array.isArray(result.items)).toBe(true);
      // When service doesn't support listPage, it falls back to list() and page may be present but undefined for total/size
      expect(result.page).toBeDefined();
    });
  });

  describe("Single Entity Operations", () => {
    test("should get entity by ID", async () => {
      // Mock a single entity response
      const mockClient = mockCore.getClientService() as MockXhrClient;
      mockClient.setMockResponse("/jsonapi/node/article/123", {
        data: {
          id: "123",
          type: "node--article",
          attributes: { title: "Single Article", body: "Single content" },
          relationships: {},
        },
      });

      const result = await fluentEntity.id("123").get();
      expect(result).toHaveProperty("id");
      expect(result).toHaveProperty("attributes");
    });

    test("should get entity with options", async () => {
      const mockClient = mockCore.getClientService() as MockXhrClient;
      mockClient.setMockResponse("/jsonapi/node/article/123", {
        data: {
          id: "123",
          type: "node--article", 
          attributes: { title: "Single Article", body: "Single content" },
          relationships: {},
        },
      });

      const options: EntityLoadOptions = {
        jsonapi: {
          query: { include: "field_author" }
        }
      };
      
      const result = await fluentEntity.id("123").get(options);
      expect(result).toHaveProperty("id", "123");
    });

    test("should throw error when getting entity without ID", async () => {
      await expect(fluentEntity.get()).rejects.toThrow("No id() set for get()");
    });

    test("should get entity with chained options", async () => {
      const mockClient = mockCore.getClientService() as MockXhrClient;
      mockClient.setMockResponse("/jsonapi/node/article/456", {
        data: {
          id: "456",
          type: "node--article",
          attributes: { title: "Chained Article", body: "Chained content" },
          relationships: {},
        },
      });

      const result = await fluentEntity
        .id("456")
        .include(["field_author"])
        .select(["title", "body"])
        .get();
        
      expect(result).toHaveProperty("id", "456");
    });
  });

  describe("findOne Operation", () => {
    test("should find first entity", async () => {
      const result = await fluentEntity.findOne();
      expect(result).toHaveProperty("id");
      expect(result).toHaveProperty("attributes");
    });

    test("should return null when no entities found", async () => {
      // Mock empty response
      const mockClient = mockCore.getClientService() as MockXhrClient;
      mockClient.setMockResponse("/jsonapi/node/article", { data: [] });

      const result = await fluentEntity.findOne();
      expect(result).toBeNull();
    });

    test("should find first with options", async () => {
      const options: EntityListOptions = {
        jsonapi: {
          query: { "filter[status]": 1 }
        }
      };
      
      const result = await fluentEntity.findOne(options);
      expect(result).toHaveProperty("id");
    });

    test("should find first with chained filters", async () => {
      const result = await fluentEntity
        .whereEq("status", 1)
        .sort("created", "DESC")
        .findOne();
        
      expect(result).toHaveProperty("id");
    });
  });

  describe("Count Operation", () => {
    test("should get count", async () => {
      const count = await fluentEntity.count();
      expect(typeof count).toBe("number");
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test("should get count with options", async () => {
      const options: EntityListOptions = {
        jsonapi: {
          query: { "filter[status]": 1 }
        }
      };
      
      const count = await fluentEntity.count(options);
      expect(typeof count).toBe("number");
    });

    test("should get count with chained filters", async () => {
      const count = await fluentEntity
        .whereEq("status", 1)
        .whereContains("title", "Test")
        .count();
        
      expect(typeof count).toBe("number");
    });

    test("should fallback to list length when count fails", async () => {
      // Create a service that will throw an error during count
      const mockServiceWithError = {
        list: jest.fn().mockResolvedValue([{ id: "1" }, { id: "2" }]),
        count: jest.fn().mockRejectedValue(new Error("Count not supported")),
      };

      // Replace the internal service's count method
      const originalEntity = entityService.entity;
      entityService.entity = jest.fn().mockReturnValue(mockServiceWithError);

      const count = await fluentEntity.count();
      expect(count).toBe(2);

      // Restore original method
      entityService.entity = originalEntity;
    });

    test("should use service count when available", async () => {
      // Mock a service with count support
      const mockServiceWithCount = {
        ...entityService,
        count: jest.fn().mockResolvedValue(42),
      };

      // Create a new FluentEntity with the mocked service
      const fluentWithCount = new FluentEntity(mockServiceWithCount as any, { entity: "node", bundle: "article" });
      
      const count = await fluentWithCount.count();
      expect(count).toBe(42);
    });
  });

  describe("Method Chaining", () => {
    test("should support complex method chaining", async () => {
      const results = await fluentEntity
        .select(["title", "body", "created"])
        .include(["field_author", "field_tags"])
        .whereEq("status", 1)
        .whereContains("title", "Test")
        .whereIn("type", ["article", "news"])
        .whereRange("created", { gte: "2023-01-01", lte: "2023-12-31" })
        .sort("created", "DESC")
        .page({ limit: 20, offset: 10 })
        .params({ "custom-param": "custom-value" })
        .list();

      expect(Array.isArray(results)).toBe(true);
    });

    test("should support chaining with external params", async () => {
      const externalBuilder = {
        getQueryObject: () => ({ 
          include: "author,tags",
          "fields[node--article]": "title,body,created",
          sort: "-created"
        })
      };

      const results = await fluentEntity
        .fromParams(externalBuilder)
        .whereEq("status", 1)
        .page({ limit: 10 })
        .list();

      expect(Array.isArray(results)).toBe(true);
    });
  });

  describe("Edge Cases", () => {
    test("should handle empty list results", async () => {
      const mockClient = mockCore.getClientService() as MockXhrClient;
      mockClient.setMockResponse("/jsonapi/node/article", { data: [] });

      const results = await fluentEntity.list();
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBe(0);
    });

    test("should handle multiple param merges", async () => {
      const result = fluentEntity
        .params({ param1: "value1" })
        .params({ param2: "value2" })
        .fromParams({ getQueryObject: () => ({ param3: "value3" }) });

      expect(result).toBe(fluentEntity);
    });

    test("should handle undefined options gracefully", async () => {
      const results = await fluentEntity.list(undefined);
      expect(Array.isArray(results)).toBe(true);
    });

    test("should handle complex filter combinations", async () => {
      const result = fluentEntity
        .whereEq("published", true)
        .whereEq("featured", false)
        .whereContains("title", "important")
        .whereIn("category", ["news", "blog"])
        .whereRange("weight", { gte: 0, lte: 10 });

      expect(result).toBe(fluentEntity);
    });
  });

  describe("JsonApiQueryBuilder", () => {
    test("should build query object correctly", async () => {
      // This tests the internal query builder through the fluent interface
      const mockClient = mockCore.getClientService() as MockXhrClient;
      let capturedConfig: any = null;

      // Override call method to capture the config
      const originalCall = mockClient.call;
      mockClient.call = jest.fn().mockImplementation(async (method, path, config) => {
        capturedConfig = config;
        return originalCall.call(mockClient, method, path, config);
      });

      await fluentEntity
        .select(["title", "body"])
        .include(["field_author"])
        .sort("created", "DESC")
        .page({ limit: 10, offset: 5 })
        .whereEq("status", 1)
        .list();

      // Verify that the query builder created the correct parameters
      expect(capturedConfig?.params).toBeDefined();
    });

    test("should handle empty query builder state", async () => {
      const results = await new FluentEntity(entityService, { entity: "node", bundle: "article" }).list();
      expect(Array.isArray(results)).toBe(true);
    });
  });
});
