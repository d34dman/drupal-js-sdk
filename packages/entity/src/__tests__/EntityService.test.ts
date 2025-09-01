import {
  CoreInterface,
  EntityAdapter,
  EntityAdapterFactory,
  EntityAdapterContext,
  EntityAttributes,
  EntityRecord,
  EntityListOptions,
  EntityLoadOptions,
  EntityIdentifier,
  XhrInterface,
  XhrResponse,
  XhrRequestConfig,
  StorageInterface,
  StorageValueType,
  StorageRecordInterface,
} from "@drupal-js-sdk/interfaces";

import { EntityLoader } from "../EntityLoader";
import { EntityService } from "../EntityService";

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
  private readonly mockResponses: Map<string, unknown> = new Map();

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

  setMockResponse(url: string, response: unknown): void {
    this.mockResponses.set(url, response);
  }

  async call<T = unknown, D = unknown>(
    _method: string,
    path: string,
    _config?: XhrRequestConfig<D>
  ): Promise<XhrResponse<T, D>> {
    const mockData = this.mockResponses.get(path) || {
      data: {
        id: "1",
        type: "node--article",
        attributes: { title: "Test Article", body: "Test content" },
        relationships: {},
      },
    };

    return {
      data: mockData as T,
      status: 200,
      statusText: "OK",
      headers: {},
      config: {} as XhrRequestConfig<D>,
    };
  }
}

/**
 * Mock Core implementation for testing
 */
class MockCore implements CoreInterface {
  private readonly client: XhrInterface;
  public config: StorageInterface;
  private readonly session: StorageInterface;

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

/**
 * Mock Entity Adapter for testing
 */
class MockEntityAdapter<TAttributes extends EntityAttributes = EntityAttributes>
  implements EntityAdapter<TAttributes>
{
  private readonly mockData: EntityRecord<TAttributes>[];
  private readonly mockSingleData: EntityRecord<TAttributes>;

  constructor() {
    this.mockSingleData = {
      id: "1",
      type: "node--article",
      attributes: { title: "Test Article", body: "Test content" } as unknown as TAttributes,
      relationships: {},
    };

    this.mockData = [
      this.mockSingleData,
      {
        id: "2",
        type: "node--article",
        attributes: { title: "Test Article 2", body: "Test content 2" } as unknown as TAttributes,
        relationships: {},
      },
    ];
  }

  async load(entityId: string, _options?: EntityLoadOptions): Promise<EntityRecord<TAttributes>> {
    const found = this.mockData.find((item) => item.id === entityId);
    if (!found) {
      throw new Error(`Entity ${entityId} not found`);
    }
    return found;
  }

  async list(_options?: EntityListOptions): Promise<Array<EntityRecord<TAttributes>>> {
    return this.mockData;
  }

  async count(_options?: EntityListOptions): Promise<number> {
    return this.mockData.length;
  }

  async listPage(_options?: EntityListOptions) {
    return {
      items: this.mockData,
      page: { total: this.mockData.length, number: 1, size: this.mockData.length },
    };
  }
}

/**
 * Mock Entity Adapter without optional methods
 */
class MinimalMockEntityAdapter<TAttributes extends EntityAttributes = EntityAttributes>
  implements EntityAdapter<TAttributes>
{
  async load(entityId: string, _options?: EntityLoadOptions): Promise<EntityRecord<TAttributes>> {
    return {
      id: entityId,
      type: "node--article",
      attributes: {
        title: "Minimal Test Article",
        body: "Minimal content",
      } as unknown as TAttributes,
      relationships: {},
    };
  }
}

describe("EntityService", () => {
  let mockCore: MockCore;
  let entityService: EntityService;
  let mockAdapterFactory: EntityAdapterFactory;
  let minimalAdapterFactory: EntityAdapterFactory;

  beforeEach(() => {
    mockCore = new MockCore();
    entityService = new EntityService(mockCore);
    mockAdapterFactory = (_ctx: EntityAdapterContext) => new MockEntityAdapter();
    minimalAdapterFactory = (_ctx: EntityAdapterContext) => new MinimalMockEntityAdapter();
  });

  describe("Constructor", () => {
    test("should create EntityService with CoreInterface", () => {
      expect(entityService).toBeInstanceOf(EntityService);
    });

    test("should initialize with default adapter key", () => {
      // The default adapter should be "jsonapi" but we test by trying to use it
      entityService.registerAdapter("jsonapi", mockAdapterFactory);

      const loader = entityService.entity({ entity: "node", bundle: "article" });
      expect(loader).toBeInstanceOf(EntityLoader);
    });
  });

  describe("Adapter Management", () => {
    test("should register adapter", () => {
      const result = entityService.registerAdapter("test", mockAdapterFactory);
      expect(result).toBe(entityService); // Should return this for chaining
    });

    test("should register multiple adapters", () => {
      entityService
        .registerAdapter("jsonapi", mockAdapterFactory)
        .registerAdapter("graphql", mockAdapterFactory)
        .registerAdapter("custom", mockAdapterFactory);

      // Test that all adapters can be used
      const jsonApiLoader = entityService.entity({ entity: "node", bundle: "article" }, "jsonapi");
      const graphqlLoader = entityService.entity({ entity: "node", bundle: "article" }, "graphql");
      const customLoader = entityService.entity({ entity: "node", bundle: "article" }, "custom");

      expect(jsonApiLoader).toBeInstanceOf(EntityLoader);
      expect(graphqlLoader).toBeInstanceOf(EntityLoader);
      expect(customLoader).toBeInstanceOf(EntityLoader);
    });

    test("should set default adapter", () => {
      const result = entityService.setDefaultAdapter("custom");
      expect(result).toBe(entityService); // Should return this for chaining

      entityService.registerAdapter("custom", mockAdapterFactory);

      // Should use custom adapter by default
      const loader = entityService.entity({ entity: "node", bundle: "article" });
      expect(loader).toBeInstanceOf(EntityLoader);
    });

    test("should throw error for unknown adapter", () => {
      expect(() => {
        entityService.entity({ entity: "node", bundle: "article" }, "unknown");
      }).toThrow('Unknown entity adapter "unknown"');
    });

    test("should throw error for default adapter when not registered", () => {
      expect(() => {
        entityService.entity({ entity: "node", bundle: "article" });
      }).toThrow('Unknown entity adapter "jsonapi"');
    });
  });

  describe("Entity Creation", () => {
    beforeEach(() => {
      entityService.registerAdapter("jsonapi", mockAdapterFactory);
    });

    test("should create entity loader with default adapter", () => {
      const identifier: EntityIdentifier = { entity: "node", bundle: "article" };
      const loader = entityService.entity(identifier);

      expect(loader).toBeInstanceOf(EntityLoader);
    });

    test("should create entity loader with specific adapter", () => {
      entityService.registerAdapter("custom", mockAdapterFactory);

      const identifier: EntityIdentifier = { entity: "node", bundle: "article" };
      const loader = entityService.entity(identifier, "custom");

      expect(loader).toBeInstanceOf(EntityLoader);
    });

    test("should create entity loader for different entity types", () => {
      const nodeLoader = entityService.entity({ entity: "node", bundle: "article" });
      const userLoader = entityService.entity({ entity: "user", bundle: "user" });
      const termLoader = entityService.entity({ entity: "taxonomy_term", bundle: "tags" });

      expect(nodeLoader).toBeInstanceOf(EntityLoader);
      expect(userLoader).toBeInstanceOf(EntityLoader);
      expect(termLoader).toBeInstanceOf(EntityLoader);
    });

    test("should pass correct context to adapter factory", () => {
      const mockFactory = jest
        .fn()
        .mockImplementation((_ctx: EntityAdapterContext) => new MockEntityAdapter());
      entityService.registerAdapter("test", mockFactory);

      const identifier: EntityIdentifier = { entity: "node", bundle: "article" };
      entityService.entity(identifier, "test");

      expect(mockFactory).toHaveBeenCalledWith({
        id: identifier,
        basePath: "/jsonapi/node/article",
        client: mockCore.getClientService(),
        config: mockCore.getConfigService(),
      });
    });
  });

  describe("List Operations", () => {
    beforeEach(() => {
      entityService.registerAdapter("jsonapi", mockAdapterFactory);
    });

    test("should list entities", async () => {
      const identifier: EntityIdentifier = { entity: "node", bundle: "article" };
      const results = await entityService.list(identifier);

      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeGreaterThan(0);
      expect(results[0]).toHaveProperty("id");
      expect(results[0]).toHaveProperty("type");
      expect(results[0]).toHaveProperty("attributes");
    });

    test("should list entities with options", async () => {
      const identifier: EntityIdentifier = { entity: "node", bundle: "article" };
      const options: EntityListOptions = {
        jsonapi: { query: { "page[limit]": 5 } },
      };

      const results = await entityService.list(identifier, options);
      expect(Array.isArray(results)).toBe(true);
    });

    test("should list entities with specific adapter", async () => {
      entityService.registerAdapter("custom", mockAdapterFactory);

      const identifier: EntityIdentifier = { entity: "node", bundle: "article" };
      const results = await entityService.list(identifier, undefined, "custom");

      expect(Array.isArray(results)).toBe(true);
    });

    test("should attach relations to listed entities", async () => {
      const identifier: EntityIdentifier = { entity: "node", bundle: "article" };
      const results = await entityService.list(identifier);

      expect(results[0]).toHaveProperty("rel");
      expect(typeof (results[0] as any).rel).toBe("function");
    });
  });

  describe("ListPage Operations", () => {
    beforeEach(() => {
      entityService.registerAdapter("jsonapi", mockAdapterFactory);
    });

    test("should list entities with pagination", async () => {
      const identifier: EntityIdentifier = { entity: "node", bundle: "article" };
      const result = await entityService.listPage(identifier);

      expect(result).toHaveProperty("items");
      expect(Array.isArray(result.items)).toBe(true);
      expect(result).toHaveProperty("page");
    });

    test("should list entities with pagination and options", async () => {
      const identifier: EntityIdentifier = { entity: "node", bundle: "article" };
      const options: EntityListOptions = {
        jsonapi: { query: { "page[limit]": 10 } },
      };

      const result = await entityService.listPage(identifier, options);
      expect(result).toHaveProperty("items");
      expect(result).toHaveProperty("page");
    });

    test("should handle adapter that doesn't support listPage", async () => {
      entityService.registerAdapter("minimal", minimalAdapterFactory);

      const identifier: EntityIdentifier = { entity: "node", bundle: "article" };

      // The EntityLoader will throw an error for adapters that don't support listPage
      // This is the expected behavior - the adapter should implement listPage if it wants to support it
      await expect(entityService.listPage(identifier, undefined, "minimal")).rejects.toThrow(
        "Entity adapter does not support listPage()"
      );
    });

    test("should test EntityService internal listPage fallback logic (Lines 61-62)", async () => {
      // We need to test the EntityService fallback, not the EntityLoader error
      // Create a mock EntityService that has a modified entity() method
      const mockEntityService = new EntityService(mockCore);

      // Mock the entity() method to return a loader without listPage
      const originalEntity = mockEntityService.entity;
      mockEntityService.entity = jest.fn().mockImplementation((identifier, adapterKey) => {
        return {
          load: jest.fn(),
          list: jest
            .fn()
            .mockResolvedValue([
              { id: "1", type: "node--article", attributes: { title: "Fallback Item" } },
            ]),
          count: jest.fn(),
          // No listPage method - this should make typeof loader.listPage !== "function" true
        };
      });

      const identifier: EntityIdentifier = { entity: "node", bundle: "article" };

      // This should trigger lines 61-62: fallback to list() when loader.listPage is not a function
      const result = await mockEntityService.listPage(identifier);

      expect(result).toHaveProperty("items");
      expect(result).toHaveProperty("page", undefined);
      expect(result.items).toHaveLength(1);
      expect(result.items[0].attributes.title).toBe("Fallback Item");

      // Restore original method
      mockEntityService.entity = originalEntity;
    });

    test("should attach relations to paginated entities", async () => {
      const identifier: EntityIdentifier = { entity: "node", bundle: "article" };
      const result = await entityService.listPage(identifier);

      expect(result.items[0]).toHaveProperty("rel");
      expect(typeof (result.items[0] as any).rel).toBe("function");
    });
  });

  describe("Load Operations", () => {
    beforeEach(() => {
      entityService.registerAdapter("jsonapi", mockAdapterFactory);
    });

    test("should load single entity", async () => {
      const identifier: EntityIdentifier = { entity: "node", bundle: "article" };
      const result = await entityService.load(identifier, "1");

      expect(result).toHaveProperty("id", "1");
      expect(result).toHaveProperty("type");
      expect(result).toHaveProperty("attributes");
    });

    test("should load entity with options", async () => {
      const identifier: EntityIdentifier = { entity: "node", bundle: "article" };
      const options: EntityLoadOptions = {
        jsonapi: { query: { include: "field_author" } },
      };

      const result = await entityService.load(identifier, "1", options);
      expect(result).toHaveProperty("id", "1");
    });

    test("should load entity with specific adapter", async () => {
      entityService.registerAdapter("custom", mockAdapterFactory);

      const identifier: EntityIdentifier = { entity: "node", bundle: "article" };
      const result = await entityService.load(identifier, "1", undefined, "custom");

      expect(result).toHaveProperty("id", "1");
    });

    test("should attach relations to loaded entity", async () => {
      const identifier: EntityIdentifier = { entity: "node", bundle: "article" };
      const result = await entityService.load(identifier, "1");

      expect(result).toHaveProperty("rel");
      expect(typeof (result as any).rel).toBe("function");
    });

    test("should throw error for non-existent entity", async () => {
      const identifier: EntityIdentifier = { entity: "node", bundle: "article" };

      await expect(entityService.load(identifier, "999")).rejects.toThrow("Entity 999 not found");
    });
  });

  describe("Count Operations", () => {
    beforeEach(() => {
      entityService.registerAdapter("jsonapi", mockAdapterFactory);
    });

    test("should count entities", async () => {
      const identifier: EntityIdentifier = { entity: "node", bundle: "article" };
      const count = await entityService.count(identifier);

      expect(typeof count).toBe("number");
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test("should count entities with options", async () => {
      const identifier: EntityIdentifier = { entity: "node", bundle: "article" };
      const options: EntityListOptions = {
        jsonapi: { query: { "filter[status]": 1 } },
      };

      const count = await entityService.count(identifier, options);
      expect(typeof count).toBe("number");
    });

    test("should count entities with specific adapter", async () => {
      entityService.registerAdapter("custom", mockAdapterFactory);

      const identifier: EntityIdentifier = { entity: "node", bundle: "article" };
      const count = await entityService.count(identifier, undefined, "custom");

      expect(typeof count).toBe("number");
    });
  });

  describe("Adapter Context", () => {
    test("should create correct base path for different entity types", () => {
      const mockFactory = jest
        .fn()
        .mockImplementation((_ctx: EntityAdapterContext) => new MockEntityAdapter());
      entityService.registerAdapter("test", mockFactory);

      // Test different entity/bundle combinations
      entityService.entity({ entity: "node", bundle: "article" }, "test");
      expect(mockFactory).toHaveBeenCalledWith(
        expect.objectContaining({
          basePath: "/jsonapi/node/article",
        })
      );

      entityService.entity({ entity: "user", bundle: "user" }, "test");
      expect(mockFactory).toHaveBeenCalledWith(
        expect.objectContaining({
          basePath: "/jsonapi/user/user",
        })
      );

      entityService.entity({ entity: "taxonomy_term", bundle: "tags" }, "test");
      expect(mockFactory).toHaveBeenCalledWith(
        expect.objectContaining({
          basePath: "/jsonapi/taxonomy_term/tags",
        })
      );
    });

    test("should pass client service to adapter context", () => {
      const mockFactory = jest
        .fn()
        .mockImplementation((_ctx: EntityAdapterContext) => new MockEntityAdapter());
      entityService.registerAdapter("test", mockFactory);

      entityService.entity({ entity: "node", bundle: "article" }, "test");

      expect(mockFactory).toHaveBeenCalledWith(
        expect.objectContaining({
          client: mockCore.getClientService(),
        })
      );
    });

    test("should pass config service to adapter context", () => {
      const mockFactory = jest
        .fn()
        .mockImplementation((_ctx: EntityAdapterContext) => new MockEntityAdapter());
      entityService.registerAdapter("test", mockFactory);

      entityService.entity({ entity: "node", bundle: "article" }, "test");

      expect(mockFactory).toHaveBeenCalledWith(
        expect.objectContaining({
          config: mockCore.getConfigService(),
        })
      );
    });
  });

  describe("Method Chaining", () => {
    test("should support method chaining for adapter management", () => {
      const result = entityService
        .setDefaultAdapter("custom")
        .registerAdapter("jsonapi", mockAdapterFactory)
        .registerAdapter("graphql", mockAdapterFactory)
        .registerAdapter("custom", mockAdapterFactory);

      expect(result).toBe(entityService);

      // Should be able to use the chained configuration
      const loader = entityService.entity({ entity: "node", bundle: "article" });
      expect(loader).toBeInstanceOf(EntityLoader);
    });
  });

  describe("Error Handling", () => {
    test("should propagate adapter errors during load", async () => {
      const errorAdapter: EntityAdapter = {
        load: jest.fn().mockRejectedValue(new Error("Adapter load error")),
      };
      const errorFactory = (_ctx: EntityAdapterContext) => errorAdapter;

      entityService.registerAdapter("error", errorFactory);

      const identifier: EntityIdentifier = { entity: "node", bundle: "article" };
      await expect(entityService.load(identifier, "1", undefined, "error")).rejects.toThrow(
        "Adapter load error"
      );
    });

    test("should propagate adapter errors during list", async () => {
      const errorAdapter: EntityAdapter = {
        load: jest.fn(),
        list: jest.fn().mockRejectedValue(new Error("Adapter list error")),
      };
      const errorFactory = (_ctx: EntityAdapterContext) => errorAdapter;

      entityService.registerAdapter("error", errorFactory);

      const identifier: EntityIdentifier = { entity: "node", bundle: "article" };
      await expect(entityService.list(identifier, undefined, "error")).rejects.toThrow(
        "Adapter list error"
      );
    });

    test("should propagate adapter errors during count", async () => {
      const errorAdapter: EntityAdapter = {
        load: jest.fn(),
        count: jest.fn().mockRejectedValue(new Error("Adapter count error")),
      };
      const errorFactory = (_ctx: EntityAdapterContext) => errorAdapter;

      entityService.registerAdapter("error", errorFactory);

      const identifier: EntityIdentifier = { entity: "node", bundle: "article" };
      await expect(entityService.count(identifier, undefined, "error")).rejects.toThrow(
        "Adapter count error"
      );
    });
  });

  describe("Edge Cases", () => {
    test("should handle empty entity identifier", () => {
      entityService.registerAdapter("test", mockAdapterFactory);

      const identifier: EntityIdentifier = { entity: "", bundle: "" };
      const loader = entityService.entity(identifier, "test");

      expect(loader).toBeInstanceOf(EntityLoader);
    });

    test("should handle undefined options gracefully", async () => {
      entityService.registerAdapter("jsonapi", mockAdapterFactory);

      const identifier: EntityIdentifier = { entity: "node", bundle: "article" };

      const listResult = await entityService.list(identifier, undefined);
      const loadResult = await entityService.load(identifier, "1", undefined);
      const countResult = await entityService.count(identifier, undefined);

      expect(Array.isArray(listResult)).toBe(true);
      expect(loadResult).toHaveProperty("id");
      expect(typeof countResult).toBe("number");
    });

    test("should handle special characters in entity/bundle names", () => {
      const mockFactory = jest
        .fn()
        .mockImplementation((_ctx: EntityAdapterContext) => new MockEntityAdapter());
      entityService.registerAdapter("test", mockFactory);

      entityService.entity({ entity: "custom_entity", bundle: "special-bundle" }, "test");

      expect(mockFactory).toHaveBeenCalledWith(
        expect.objectContaining({
          basePath: "/jsonapi/custom_entity/special-bundle",
        })
      );
    });
  });
});
