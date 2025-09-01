import {
  EntityAdapter,
  EntityAdapterContext,
  EntityAttributes,
  EntityRecord,
  EntityListOptions,
  EntityLoadOptions,
  EntityIdentifier,
  XhrInterface,
  StorageInterface,
} from "@drupal-js-sdk/interfaces";
import { EntityLoader } from "../EntityLoader";

/**
 * Mock Entity Adapter for testing
 */
class MockEntityAdapter<TAttributes extends EntityAttributes = EntityAttributes>
  implements EntityAdapter<TAttributes> {
  
  private mockData: EntityRecord<TAttributes>[];
  private shouldThrowError = false;
  private errorMessage = "Mock adapter error";

  constructor() {
    this.mockData = [
      {
        id: "1",
        type: "node--article",
        attributes: { title: "Test Article 1", body: "Test content 1" } as unknown as TAttributes,
        relationships: {},
      },
      {
        id: "2",
        type: "node--article",
        attributes: { title: "Test Article 2", body: "Test content 2" } as unknown as TAttributes,
        relationships: {},
      },
    ];
  }

  // Test helper methods
  setMockData(data: EntityRecord<TAttributes>[]): void {
    this.mockData = data;
  }

  setShouldThrowError(shouldThrow: boolean, message?: string): void {
    this.shouldThrowError = shouldThrow;
    if (message) {
      this.errorMessage = message;
    }
  }

  async load(entityId: string, _options?: EntityLoadOptions): Promise<EntityRecord<TAttributes>> {
    if (this.shouldThrowError) {
      throw new Error(this.errorMessage);
    }

    const found = this.mockData.find(item => item.id === entityId);
    if (!found) {
      throw new Error(`Entity ${entityId} not found`);
    }
    return found;
  }

  async list(_options?: EntityListOptions): Promise<Array<EntityRecord<TAttributes>>> {
    if (this.shouldThrowError) {
      throw new Error(this.errorMessage);
    }
    return this.mockData;
  }

  async count(_options?: EntityListOptions): Promise<number> {
    if (this.shouldThrowError) {
      throw new Error(this.errorMessage);
    }
    return this.mockData.length;
  }

  async listPage(_options?: EntityListOptions) {
    if (this.shouldThrowError) {
      throw new Error(this.errorMessage);
    }
    return {
      items: this.mockData,
      page: { 
        total: this.mockData.length, 
        number: 1, 
        size: this.mockData.length,
        next: null,
        prev: null,
      },
    };
  }
}

/**
 * Mock Entity Adapter without optional methods
 */
class MinimalEntityAdapter<TAttributes extends EntityAttributes = EntityAttributes>
  implements EntityAdapter<TAttributes> {
  
  async load(entityId: string, _options?: EntityLoadOptions): Promise<EntityRecord<TAttributes>> {
    return {
      id: entityId,
      type: "node--article",
      attributes: { title: "Minimal Test Article", body: "Minimal content" } as unknown as TAttributes,
      relationships: {},
    };
  }
}

/**
 * Mock Entity Adapter with partial method support
 */
class PartialEntityAdapter<TAttributes extends EntityAttributes = EntityAttributes>
  implements EntityAdapter<TAttributes> {
  
  async load(entityId: string, _options?: EntityLoadOptions): Promise<EntityRecord<TAttributes>> {
    return {
      id: entityId,
      type: "node--article",
      attributes: { title: "Partial Test Article", body: "Partial content" } as unknown as TAttributes,
      relationships: {},
    };
  }

  async list(_options?: EntityListOptions): Promise<Array<EntityRecord<TAttributes>>> {
    return [
      {
        id: "1",
        type: "node--article",
        attributes: { title: "Partial Article 1", body: "Content 1" } as unknown as TAttributes,
        relationships: {},
      },
    ];
  }

  // Note: Intentionally not implementing count() or listPage()
}

describe("EntityLoader", () => {
  let mockContext: EntityAdapterContext;
  let mockAdapter: MockEntityAdapter<{ title: string; body: string }>;
  let entityLoader: EntityLoader<{ title: string; body: string }>;

  beforeEach(() => {
    const mockIdentifier: EntityIdentifier = { entity: "node", bundle: "article" };
    
    mockContext = {
      id: mockIdentifier,
      basePath: "/jsonapi/node/article",
      client: {} as XhrInterface,
      config: {} as StorageInterface,
    };

    mockAdapter = new MockEntityAdapter<{ title: string; body: string }>();
    entityLoader = new EntityLoader(mockContext, mockAdapter);
  });

  describe("Constructor", () => {
    test("should create EntityLoader with context and adapter", () => {
      expect(entityLoader).toBeInstanceOf(EntityLoader);
    });

    test("should store context and adapter correctly", () => {
      // Test that the loader can use the adapter (indirect test)
      expect(() => entityLoader.load("1")).not.toThrow();
    });
  });

  describe("Load Operations", () => {
    test("should load single entity by ID", async () => {
      const result = await entityLoader.load("1");
      
      expect(result).toHaveProperty("id", "1");
      expect(result).toHaveProperty("type", "node--article");
      expect(result).toHaveProperty("attributes");
      expect(result.attributes).toHaveProperty("title", "Test Article 1");
      expect(result.attributes).toHaveProperty("body", "Test content 1");
    });

    test("should load entity with options", async () => {
      const options: EntityLoadOptions = {
        jsonapi: { query: { include: "field_author" } },
      };
      
      const result = await entityLoader.load("1", options);
      expect(result).toHaveProperty("id", "1");
    });

    test("should load different entities by different IDs", async () => {
      const result1 = await entityLoader.load("1");
      const result2 = await entityLoader.load("2");
      
      expect(result1.id).toBe("1");
      expect(result2.id).toBe("2");
      expect(result1.attributes.title).toBe("Test Article 1");
      expect(result2.attributes.title).toBe("Test Article 2");
    });

    test("should throw error for non-existent entity", async () => {
      await expect(entityLoader.load("999")).rejects.toThrow("Entity 999 not found");
    });

    test("should propagate adapter errors during load", async () => {
      mockAdapter.setShouldThrowError(true, "Load operation failed");
      
      await expect(entityLoader.load("1")).rejects.toThrow("Load operation failed");
    });

    test("should handle undefined options", async () => {
      const result = await entityLoader.load("1", undefined);
      expect(result).toHaveProperty("id", "1");
    });
  });

  describe("List Operations", () => {
    test("should list entities", async () => {
      const results = await entityLoader.list();
      
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBe(2);
      expect(results[0]).toHaveProperty("id", "1");
      expect(results[1]).toHaveProperty("id", "2");
    });

    test("should list entities with options", async () => {
      const options: EntityListOptions = {
        jsonapi: { query: { "page[limit]": 5 } },
      };
      
      const results = await entityLoader.list(options);
      expect(Array.isArray(results)).toBe(true);
    });

    test("should return empty array when no entities", async () => {
      mockAdapter.setMockData([]);
      
      const results = await entityLoader.list();
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBe(0);
    });

    test("should throw error when adapter doesn't support list", async () => {
      const minimalAdapter = new MinimalEntityAdapter<{ title: string; body: string }>();
      const minimalLoader = new EntityLoader(mockContext, minimalAdapter);
      
      await expect(minimalLoader.list()).rejects.toThrow("Entity adapter does not support list()");
    });

    test("should propagate adapter errors during list", async () => {
      mockAdapter.setShouldThrowError(true, "List operation failed");
      
      await expect(entityLoader.list()).rejects.toThrow("List operation failed");
    });

    test("should handle undefined options", async () => {
      const results = await entityLoader.list(undefined);
      expect(Array.isArray(results)).toBe(true);
    });
  });

  describe("Count Operations", () => {
    test("should count entities", async () => {
      const count = await entityLoader.count();
      
      expect(typeof count).toBe("number");
      expect(count).toBe(2);
    });

    test("should count entities with options", async () => {
      const options: EntityListOptions = {
        jsonapi: { query: { "filter[status]": 1 } },
      };
      
      const count = await entityLoader.count(options);
      expect(typeof count).toBe("number");
      expect(count).toBe(2);
    });

    test("should return zero when no entities", async () => {
      mockAdapter.setMockData([]);
      
      const count = await entityLoader.count();
      expect(count).toBe(0);
    });

    test("should throw error when adapter doesn't support count", async () => {
      const partialAdapter = new PartialEntityAdapter<{ title: string; body: string }>();
      const partialLoader = new EntityLoader(mockContext, partialAdapter);
      
      await expect(partialLoader.count()).rejects.toThrow("Entity adapter does not support count()");
    });

    test("should propagate adapter errors during count", async () => {
      mockAdapter.setShouldThrowError(true, "Count operation failed");
      
      await expect(entityLoader.count()).rejects.toThrow("Count operation failed");
    });

    test("should handle undefined options", async () => {
      const count = await entityLoader.count(undefined);
      expect(typeof count).toBe("number");
    });
  });

  describe("ListPage Operations", () => {
    test("should list entities with pagination", async () => {
      const result = await entityLoader.listPage();
      
      expect(result).toHaveProperty("items");
      expect(result).toHaveProperty("page");
      expect(Array.isArray((result as any).items)).toBe(true);
      expect((result as any).items.length).toBe(2);
      expect((result as any).page).toHaveProperty("total", 2);
      expect((result as any).page).toHaveProperty("number", 1);
      expect((result as any).page).toHaveProperty("size", 2);
    });

    test("should list entities with pagination and options", async () => {
      const options: EntityListOptions = {
        jsonapi: { query: { "page[limit]": 10 } },
      };
      
      const result = await entityLoader.listPage(options);
      expect(result).toHaveProperty("items");
      expect(result).toHaveProperty("page");
    });

    test("should return pagination info with empty items", async () => {
      mockAdapter.setMockData([]);
      
      const result = await entityLoader.listPage();
      expect(result).toHaveProperty("items");
      expect((result as any).items.length).toBe(0);
      expect(result).toHaveProperty("page");
      expect((result as any).page).toHaveProperty("total", 0);
    });

    test("should throw error when adapter doesn't support listPage", async () => {
      const partialAdapter = new PartialEntityAdapter<{ title: string; body: string }>();
      const partialLoader = new EntityLoader(mockContext, partialAdapter);
      
      await expect(partialLoader.listPage()).rejects.toThrow("Entity adapter does not support listPage()");
    });

    test("should propagate adapter errors during listPage", async () => {
      mockAdapter.setShouldThrowError(true, "ListPage operation failed");
      
      await expect(entityLoader.listPage()).rejects.toThrow("ListPage operation failed");
    });

    test("should handle undefined options", async () => {
      const result = await entityLoader.listPage(undefined);
      expect(result).toHaveProperty("items");
      expect(result).toHaveProperty("page");
    });
  });

  describe("Adapter Method Detection", () => {
    test("should detect when adapter has list method", async () => {
      const fullAdapter = new MockEntityAdapter<{ title: string; body: string }>();
      const fullLoader = new EntityLoader(mockContext, fullAdapter);
      
      // Should not throw error
      const results = await fullLoader.list();
      expect(Array.isArray(results)).toBe(true);
    });

    test("should detect when adapter lacks list method", async () => {
      const minimalAdapter = new MinimalEntityAdapter<{ title: string; body: string }>();
      const minimalLoader = new EntityLoader(mockContext, minimalAdapter);
      
      await expect(minimalLoader.list()).rejects.toThrow("Entity adapter does not support list()");
    });

    test("should detect when adapter has count method", async () => {
      const fullAdapter = new MockEntityAdapter<{ title: string; body: string }>();
      const fullLoader = new EntityLoader(mockContext, fullAdapter);
      
      // Should not throw error
      const count = await fullLoader.count();
      expect(typeof count).toBe("number");
    });

    test("should detect when adapter lacks count method", async () => {
      const partialAdapter = new PartialEntityAdapter<{ title: string; body: string }>();
      const partialLoader = new EntityLoader(mockContext, partialAdapter);
      
      await expect(partialLoader.count()).rejects.toThrow("Entity adapter does not support count()");
    });

    test("should detect when adapter has listPage method", async () => {
      const fullAdapter = new MockEntityAdapter<{ title: string; body: string }>();
      const fullLoader = new EntityLoader(mockContext, fullAdapter);
      
      // Should not throw error
      const result = await fullLoader.listPage();
      expect(result).toHaveProperty("items");
    });

    test("should detect when adapter lacks listPage method", async () => {
      const partialAdapter = new PartialEntityAdapter<{ title: string; body: string }>();
      const partialLoader = new EntityLoader(mockContext, partialAdapter);
      
      await expect(partialLoader.listPage()).rejects.toThrow("Entity adapter does not support listPage()");
    });
  });

  describe("Type Safety", () => {
    test("should maintain type safety for attributes", async () => {
      const typedLoader = new EntityLoader<{ title: string; body: string; published: boolean }>(
        mockContext,
        mockAdapter as any
      );
      
      const result = await typedLoader.load("1");
      
      // TypeScript should enforce these types at compile time
      expect(typeof result.attributes).toBe("object");
      expect(result.attributes).toHaveProperty("title");
      expect(result.attributes).toHaveProperty("body");
    });

    test("should work with different attribute types", async () => {
      interface CustomAttributes extends EntityAttributes {
        name: string;
        count: number;
        active: boolean;
        tags: string[];
      }

      const customMockAdapter: EntityAdapter<CustomAttributes> = {
        load: async (entityId: string) => ({
          id: entityId,
          type: "custom--type",
          attributes: {
            name: "Custom Entity",
            count: 42,
            active: true,
            tags: ["tag1", "tag2"],
          },
          relationships: {},
        }),
      };

      const customLoader = new EntityLoader<CustomAttributes>(mockContext, customMockAdapter);
      const result = await customLoader.load("1");
      
      expect(result.attributes.name).toBe("Custom Entity");
      expect(result.attributes.count).toBe(42);
      expect(result.attributes.active).toBe(true);
      expect(Array.isArray(result.attributes.tags)).toBe(true);
    });
  });

  describe("Edge Cases", () => {
    test("should handle adapter with null/undefined methods", async () => {
      const nullMethodAdapter = {
        load: async (entityId: string) => ({
          id: entityId,
          type: "node--article",
          attributes: { title: "Test", body: "Content" } as { title: string; body: string },
          relationships: {},
        }),
        list: null,
        count: undefined,
        listPage: null,
      } as any;

      const nullLoader = new EntityLoader(mockContext, nullMethodAdapter);
      
      await expect(nullLoader.list()).rejects.toThrow("Entity adapter does not support list()");
      await expect(nullLoader.count()).rejects.toThrow("Entity adapter does not support count()");
      await expect(nullLoader.listPage()).rejects.toThrow("Entity adapter does not support listPage()");
    });

    test("should handle adapter with non-function properties", async () => {
      const invalidAdapter = {
        load: async (entityId: string) => ({
          id: entityId,
          type: "node--article",
          attributes: { title: "Test", body: "Content" } as { title: string; body: string },
          relationships: {},
        }),
        list: "not a function",
        count: 42,
        listPage: {},
      } as any;

      const invalidLoader = new EntityLoader(mockContext, invalidAdapter);
      
      await expect(invalidLoader.list()).rejects.toThrow("Entity adapter does not support list()");
      await expect(invalidLoader.count()).rejects.toThrow("Entity adapter does not support count()");
      await expect(invalidLoader.listPage()).rejects.toThrow("Entity adapter does not support listPage()");
    });

    test("should handle empty string entity ID", async () => {
      // Empty string entity ID should be handled by the adapter - in our mock it throws
      await expect(entityLoader.load("")).rejects.toThrow("Entity  not found");
    });

    test("should handle special character entity IDs", async () => {
      // Add special character entity to mock data
      const specialData = [
        {
          id: "test-123_special.id",
          type: "node--article",
          attributes: { title: "Special ID Article", body: "Special content" } as { title: string; body: string },
          relationships: {},
        },
      ];
      mockAdapter.setMockData(specialData);

      const result = await entityLoader.load("test-123_special.id");
      expect(result.id).toBe("test-123_special.id");
    });
  });

  describe("Error Scenarios", () => {
    test("should handle adapter throwing synchronous errors", () => {
      const errorAdapter: EntityAdapter = {
        load: () => {
          throw new Error("Synchronous load error");
        },
      };

      const errorLoader = new EntityLoader(mockContext, errorAdapter);
      
      expect(errorLoader.load("1")).rejects.toThrow("Synchronous load error");
    });

    test("should handle adapter throwing asynchronous errors", async () => {
      const asyncErrorAdapter: EntityAdapter = {
        load: async () => {
          await new Promise(resolve => setTimeout(resolve, 1));
          throw new Error("Asynchronous load error");
        },
      };

      const errorLoader = new EntityLoader(mockContext, asyncErrorAdapter);
      
      await expect(errorLoader.load("1")).rejects.toThrow("Asynchronous load error");
    });

    test("should handle adapter returning malformed data", async () => {
      const malformedAdapter: EntityAdapter = {
        load: async () => null as any,
        list: async () => "not an array" as any,
        count: async () => "not a number" as any,
        listPage: async () => ({ items: null }) as any,
      };

      const malformedLoader = new EntityLoader(mockContext, malformedAdapter);
      
      // These tests depend on how the loader handles malformed data
      // The loader currently doesn't validate, so it would return the malformed data
      const loadResult = await malformedLoader.load("1");
      const listResult = await malformedLoader.list();
      const countResult = await malformedLoader.count();
      const pageResult = await malformedLoader.listPage();
      
      expect(loadResult).toBeNull();
      expect(listResult).toBe("not an array");
      expect(countResult).toBe("not a number");
      expect((pageResult as any).items).toBeNull();
    });
  });
});
